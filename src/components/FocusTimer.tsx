import {useEffect,useRef,useState} from 'react';
import {invoke} from '@tauri-apps/api/core';
import {listen} from '@tauri-apps/api/event';
import {Play,Pause,RotateCcw,Volume2,VolumeX,CheckCircle2,Trash2} from 'lucide-react';
import {StickyNote} from '../types';
import {sound} from '../utils/audio';
import {DEFAULT_FOCUS,FocusState,focusRemaining,focusElapsed,startFocus,pauseFocus,finishFocus,completeFocusItem,focusOverview} from '../focusTimer';

export function useFocusTimer(coordinator=false) {
  const [state,setState]=useState<FocusState>(DEFAULT_FOCUS);
  const [now,setNow]=useState(Date.now());
  const [ready,setReady]=useState(false);
  const [error,setError]=useState('');
  const finishing=useRef(false);
  const save=async (focus:FocusState) => {
    try {await invoke('desktop_preferences',{changes:{focus}}); setState(focus); return true;}
    catch(e) {setError(String(e)); return false;}
  };
  useEffect(() => {
    const accept=(prefs:{focus?:FocusState}) => {setState(prefs.focus || DEFAULT_FOCUS); setReady(true);};
    const events=listen<{focus?:FocusState}>('preferences-changed',e=>accept(e.payload));
    invoke<{focus?:FocusState}>('desktop_preferences').then(accept).catch(e=>setError(String(e)));
    const timer=window.setInterval(()=>setNow(Date.now()),1000);
    return ()=>{window.clearInterval(timer); events.then(stop=>stop());};
  },[]);
  useEffect(() => {
    if(!coordinator || !ready || state.deadline === null || now < state.deadline || finishing.current) return;
    finishing.current=true;
    save(finishFocus(state,now,true)).then(saved=>{finishing.current=false; if(saved && !state.muted)sound.playChime();});
  },[coordinator,ready,state,now]);
  return {state,now,ready,error,save,remaining:focusRemaining(state,now)};
}

export function FocusTimer() {
  const {state,now,ready,error,save,remaining}=useFocusTimer();
  const [notes,setNotes]=useState<StickyNote[]>([]);
  const selectedNote=notes.find(note=>note.id===state.noteId);
  const selectedItem=selectedNote?.items.find(item=>item.id===state.itemId);
  const [actionError,setActionError]=useState('');
  const [minutes,setMinutes]=useState(25);
  const [confirmClear,setConfirmClear]=useState(false);
  useEffect(()=>setMinutes(state.minutes),[state.minutes]);
  useEffect(()=>{const refresh=()=>invoke<{notes:StickyNote[]}>('desktop_list').then(data=>setNotes(data.notes)).catch(e=>setActionError(String(e))); refresh(); const events=listen('notes-changed',refresh);return ()=>{events.then(stop=>stop());};},[]);
  const active=state.deadline !== null || state.elapsed > 0;
  const overview=focusOverview(state.records,now);
  const maxDay=Math.max(3600,...overview.days.map(day=>day.seconds));
  const maxRecord=Math.max(1,...state.records.map(record=>record.seconds));
  const duration=(seconds:number)=>seconds>=3600 ? Math.floor(seconds/3600)+'h'+Math.floor(seconds%3600/60)+'m' : seconds>=60 ? Math.floor(seconds/60)+'分'+(seconds%60 ? seconds%60+'秒' : '') : seconds+'秒';
  const format=(seconds:number)=>`${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`;
  const choose=(value:number)=>{const m=Math.min(240,Math.max(1,Math.round(value || 25)));setMinutes(m);save({...state,minutes:m,remaining:m*60,finishedAt:null});};
  const toggle=()=>{const m=Math.min(240,Math.max(1,Math.round(minutes || 25)));const start=active ? state : {...state,minutes:m,remaining:m*60,projectTitle:selectedNote?.title || '自由专注',itemTitle:selectedItem?.text || '未关联事项'};save(state.deadline===null ? startFocus(start,Date.now()) : pauseFocus(state,Date.now()));};
  const complete=async()=>{try{const data=await invoke<{notes:StickyNote[]}>('desktop_list');const note=data.notes.find(n=>n.id===state.noteId);if(!note || !note.items.some(item=>item.id===state.itemId))return;await invoke('desktop_update',{note:{id:note.id,items:completeFocusItem(note.items,state.itemId!)}});if(active)await save(finishFocus(state,Date.now(),true,true));}catch(e){setActionError(String(e));}};
  const progress=state.finishedAt ? 100 : (1-remaining/(state.minutes*60))*100;
  return <main className="focus-panel focus-flow focus-clean focus-refined">
    <div className="focus-project-label">选择本次专注事项</div>
    <select aria-label="选择专注项目" className="focus-project" value={state.noteId || ''} disabled={!ready || active} onChange={e=>save({...state,noteId:e.target.value,itemId:undefined,projectTitle:undefined,itemTitle:undefined})}><option value="">自由专注 · 暂不关联便签</option>{notes.filter(note=>note.items.length>0).map(note=><option key={note.id} value={note.id}>{note.title}{note.items.every(item=>item.done) ? ' · 已完成' : ''}</option>)}</select>
    <select aria-label="选择具体事项" className="focus-project focus-item" value={state.itemId || ''} disabled={!ready || active || !selectedNote} onChange={e=>save({...state,itemId:e.target.value})}><option value="">请选择具体事项</option>{selectedNote?.items.map(item=><option key={item.id} value={item.id}>{item.text}{item.done ? ' · 已完成' : ''}</option>)}</select>
    <div className="tomato-rest" aria-hidden="true"><svg viewBox="0 0 220 155" fill="none"><path d="M46 128Q15 93 58 50Q90 3 141 22Q188 19 197 86Q203 139 118 146Q67 151 46 128" fill="#7597c4" stroke="#425a7e" strokeWidth="3"/><path d="M55 120Q105 87 181 102M153 36Q174 68 165 98" stroke="#557ca9" strokeWidth="3"/><path d="M79 90L55 117L72 125L100 100M121 100L139 118L154 111L142 91" fill="#e99863" stroke="#906554" strokeWidth="2"/><ellipse cx="110" cy="70" rx="42" ry="43" fill="#e97d55" stroke="#a95c43" strokeWidth="3"/><path d="M97 27L88 14L106 20L114 7L118 22L137 16L125 31L139 37L117 38L110 29L94 38Z" fill="#8ca55a" stroke="#607849" strokeWidth="2"/><rect x="79" y="52" width="24" height="18" rx="6" fill="#eabc7f" stroke="#8d6047" strokeWidth="3"/><rect x="112" y="52" width="24" height="18" rx="6" fill="#eabc7f" stroke="#8d6047" strokeWidth="3"/><path d="M103 59H112M87 63V59M120 63V59M104 75Q111 80 118 75" stroke="#835438" strokeWidth="3" strokeLinecap="round"/><path d="M83 83L109 89L131 82V111L109 117L83 109Z" fill="#f5e7c0" stroke="#a38a62" strokeWidth="2"/><path d="M109 89V117" stroke="#a38a62" strokeWidth="2"/><path d="M81 87Q63 92 80 102M136 88Q151 98 134 103" fill="#e97d55" stroke="#a95c43" strokeWidth="3"/></svg></div>
    <div className="focus-countdown"><b>{format(remaining)}</b><span role="status">{state.deadline!==null ? '专注中' : state.finishedAt ? '本次专注已完成 ✓' : active ? '已暂停' : '准备就绪'}</span></div>
    <div className="focus-duration">{[25,45,60,120].map(m=><button disabled={!ready || active} className={state.minutes===m ? 'active' : ''} key={m} onClick={()=>choose(m)}>{m<60 ? m+'分' : m/60+'小时'}</button>)}<label className="focus-custom">自定义 <input aria-label="自定义专注分钟数" type="number" min={1} max={240} disabled={!ready || active} value={minutes} onChange={e=>setMinutes(Number(e.target.value))} onBlur={()=>choose(minutes)} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur();}}/> 分钟</label></div>
    <div className="focus-actions"><button disabled={!ready || !active} title="结束本次并重置，保留专注记录" onClick={()=>save(finishFocus(state,Date.now(),false))}><RotateCcw size={17}/></button><button className="focus-play" disabled={!ready} title={state.deadline!==null ? '暂停' : '开始或继续专注'} onClick={toggle}>{state.deadline!==null ? <Pause size={23}/> : <Play size={23}/>}</button><button title={state.muted ? '打开到时音效' : '关闭到时音效'} onClick={()=>save({...state,muted:!state.muted})}>{state.muted ? <VolumeX size={17}/> : <Volume2 size={17}/>}</button></div>
    <button className="focus-complete" disabled={!selectedItem || selectedItem.done} onClick={complete}><CheckCircle2 size={16}/>完成这一项</button>
    <div className="focus-track" role="progressbar" aria-label="本次专注进度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><i style={{width:progress+'%'}}/></div>
    <section className="focus-overview" aria-label="专注概览"><h2>专注概览</h2><div className="focus-metrics">{[['专注次数',overview.completed+'次'],['平均专注',duration(overview.average)],['今日专注',duration(overview.today+focusElapsed(state,now))],['提前结束',overview.abandoned+'次'],['平均提前结束',duration(overview.abandonedAverage)],['本月专注',duration(overview.month+focusElapsed(state,now))]].map(([label,value])=><div key={label}><b>{value}</b><span>{label}</span></div>)}</div><div className="focus-month-heading"><h3>每日专注</h3><span>{new Date(now).getFullYear()}年{new Date(now).getMonth()+1}月 · 单位小时</span></div><div className="focus-month-chart" role="img" aria-label="本月每日专注时长条形图"><div className="focus-chart-scale"><span>{Math.ceil(maxDay/3600)}h</span><span>0h</span></div><div className="focus-chart-columns">{overview.days.map(day=><div className="focus-day" key={day.day} title={day.day+'日：'+duration(day.seconds)}><div><i style={{height:(day.seconds/maxDay*100)+'%'}}/></div><small>{day.day===1 || day.day%5===0 ? day.day : ''}</small></div>)}</div></div></section>
    <div className="focus-history-heading"><h2>专注记录</h2>{state.records.length>0 && <button disabled={!ready} onClick={()=>setConfirmClear(!confirmClear)}>清空记录</button>}</div>{confirmClear && <div className="focus-clear-confirm"><span>清空全部专注记录？</span><button onClick={async()=>{if(await save({...state,records:[]}))setConfirmClear(false);}}>确认清空</button><button onClick={()=>setConfirmClear(false)}>取消</button></div>}{!state.records.length && <p className="focus-empty">完成一次专注后，记录会出现在这里。</p>}
    <ul className="focus-records">{state.records.map((record,index)=>({record,index})).reverse().slice(0,8).map(({record,index})=><li className="focus-record" key={record.endedAt+'-'+index}><div><b>{record.projectTitle || '历史记录 · 未关联项目'}</b><p>{record.itemTitle || '具体事项未记录'}</p><time>{record.startedAt ? new Date(record.startedAt).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})+' → ' : ''}{new Date(record.endedAt).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})}</time><i className="focus-record-bar" style={{width:(record.seconds/maxRecord*100)+'%'}}/></div><div><strong>{format(record.seconds)}</strong><span>{record.taskDone ? '事项完成' : record.completed ? '定时结束' : '提前结束'}</span><button className="focus-record-delete" aria-label={'删除专注记录：'+(record.projectTitle || '未关联项目')+' · '+(record.itemTitle || '未关联事项')} title="删除这条记录" disabled={!ready} onClick={()=>save({...state,records:state.records.filter((_,i)=>i!==index)})}><Trash2 size={13}/></button></div></li>)}</ul>
    {(error || actionError) && <p role="alert">{error || actionError}</p>}
  </main>;
}
