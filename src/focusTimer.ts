export interface FocusRecord { endedAt: number; startedAt?: number; seconds: number; completed: boolean; taskDone?: boolean; projectTitle?: string; itemTitle?: string }
export interface FocusState {
  muted?: boolean;
  noteId?: string;
  itemId?: string;
  projectTitle?: string;
  itemTitle?: string;
  startedAt?: number;
  minutes: number;
  remaining: number;
  deadline: number | null;
  elapsed: number;
  records: FocusRecord[];
  finishedAt: number | null;
}
export const DEFAULT_FOCUS: FocusState = {minutes:25,remaining:1500,deadline:null,elapsed:0,records:[],finishedAt:null};
export function focusRemaining(state: FocusState, now: number) {
  return state.deadline === null ? state.remaining : Math.max(0,Math.min(state.remaining,Math.ceil((state.deadline-now)/1000)));
}
export function focusElapsed(state: FocusState, now: number) {
  return state.elapsed + state.remaining - focusRemaining(state,now);
}
export function startFocus(state: FocusState, now: number): FocusState {
  return {...state,startedAt:state.startedAt ?? now,deadline:now+state.remaining*1000,finishedAt:null};
}
export function pauseFocus(state: FocusState, now: number): FocusState {
  return {...state,remaining:focusRemaining(state,now),elapsed:focusElapsed(state,now),deadline:null};
}
export function finishFocus(state: FocusState, now: number, completed: boolean, taskDone=false): FocusState {
  const seconds=focusElapsed(state,now);
  return {...state,startedAt:undefined,deadline:null,remaining:state.minutes*60,elapsed:0,
    finishedAt:completed ? now : null,
    records:seconds > 0 ? [...state.records,{endedAt:completed && state.deadline !== null ? Math.min(state.deadline,now) : now,startedAt:state.startedAt,seconds,completed,taskDone,projectTitle:state.projectTitle,itemTitle:state.itemTitle}] : state.records};
}

export function completeFocusItem<T extends {id:string;done:boolean}>(items:T[],itemId:string):T[] {
  return items.map(item=>item.id===itemId ? {...item,done:true} : item);
}

export function focusOverview(records:FocusRecord[],now:number) {
  const date=new Date(now),day=date.toLocaleDateString();
  const completed=records.filter(record=>record.completed),abandoned=records.filter(record=>!record.completed);
  const month=records.filter(record=>{const d=new Date(record.endedAt);return d.getFullYear()===date.getFullYear() && d.getMonth()===date.getMonth();});
  const days=Array.from({length:new Date(date.getFullYear(),date.getMonth()+1,0).getDate()},(_,i)=>({day:i+1,seconds:0}));
  for(const record of month)days[new Date(record.endedAt).getDate()-1].seconds+=record.seconds;
  const sum=(rows:FocusRecord[])=>rows.reduce((total,record)=>total+record.seconds,0);
  return {completed:completed.length,abandoned:abandoned.length,average:completed.length ? Math.round(sum(completed)/completed.length) : 0,abandonedAverage:abandoned.length ? Math.round(sum(abandoned)/abandoned.length) : 0,today:sum(records.filter(record=>new Date(record.endedAt).toLocaleDateString()===day)),month:sum(month),days};
}
