import { StickyNote } from './types';

export interface MemoRecord {
  noteId:string;
  title:string;
  content:string;
  richContent:string;
  note:StickyNote;
  savedAt:number|null;
  createdAt:string|number|null;
  status:'desktop'|'archived'|'record';
  saved:boolean;
  draftChanged:boolean;
}

// Native notes use nanoseconds; older imported notes may use ISO dates.
export function memoDate(value:string|number|null|undefined):Date|null {
  if(value===null||value===undefined||value==='')return null;
  let millis:number;
  if(typeof value==='string'&&/^\d+$/.test(value)){
    const stamp=BigInt(value);
    millis=Number(stamp>100000000000000000n?stamp/1000000n:stamp<100000000000n?stamp*1000n:stamp);
  }else if(typeof value==='number'){
    millis=value>1e17?value/1e6:value<1e11?value*1000:value;
  }else millis=Date.parse(value);
  const date=new Date(millis);
  return Number.isFinite(date.getTime())?date:null;
}

export function memoRecordTime(record:MemoRecord){return memoDate(record.savedAt??record.createdAt)?.getTime()??0;}
export function memoDateLabel(record:MemoRecord){
  const date=memoDate(record.savedAt??record.createdAt);
  return date?`${record.savedAt?'保存于':'创建于'} ${date.toLocaleString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false})}`:'日期未记录';
}
