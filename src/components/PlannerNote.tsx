import { useEffect, useRef, useState } from 'react';
import { GripVertical, RotateCcw, Palette, Pin, Lock, Unlock, Minus, X, ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react';
import { StickyNote, ChecklistItem } from '../types';
import { NOTE_FONTS } from '../desktopFonts';
import { DEFAULT_THEME_CONFIGS } from '../utils/themePresets';
import { dayKey, weekStart, weekDays, orderTasks } from '../taskPlanning';
import { TaskOptions, TaskPriority } from './TaskOptions';
import { VoiceInput } from './VoiceInput';
import { sound } from '../utils/audio';
import { CompletedStamp } from './CompletedStamp';
import { PaperSurface, usePaperOpacity } from './PaperOpacity';
import './PlannerStyles.css';

const weekdays=['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
const dayCodes=['MON','TUE','WED','THU','FRI','SAT','SUN'];

export function PlannerNote({note,onUpdate,onArchive,onDrag,onSettings,selected,error}:{note:StickyNote;onUpdate:(n:StickyNote)=>void;onArchive:()=>void;onDrag:()=>void;onSettings:()=>void;selected:boolean;error:string}){
  const articleRef=useRef<HTMLElement>(null);
  const [period,setPeriod]=useState(()=>note.plannerDate?new Date(note.plannerDate+'T12:00:00'):new Date()),[day,setDay]=useState(()=>note.plannerDate||dayKey(new Date())),[input,setInput]=useState('');
  const inputRef=useRef<HTMLInputElement>(null),resize=useRef<{x:number;y:number;w:number;h:number}|null>(null);
  const format=note.format||'checklist',weekly=format==='weekly',monthHabit=format==='habitMonth',habit=format==='habitWeek'||monthHabit;
  const style=note.plannerStyle||'clean';
  usePaperOpacity(articleRef,note.opacity??1,`${format}:${style}:${note.customBgColor||''}`);
  const start=weekStart(period),days=weekDays(start),monthDays=Array.from({length:new Date(period.getFullYear(),period.getMonth()+1,0).getDate()},(_,i)=>new Date(period.getFullYear(),period.getMonth(),i+1));
  const visibleDates=(monthHabit?monthDays:days).map(dayKey);
  const timelineDate=note.plannerDate||dayKey(new Date());
  const scoped=note.items.filter(i=>format==='timeline'?(!i.day||i.day===timelineDate):(weekly||habit)&&!!i.day&&visibleDates.includes(i.day));
  const shown=weekly?orderTasks(scoped.filter(i=>i.day===day)):format==='timeline'?[...scoped].sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99')):scoped;
  const done=scoped.filter(i=>i.done).length,total=habit?visibleDates.length:scoped.length,complete=total>0&&done===total;
  const [celebrating,setCelebrating]=useState(false),previous=useRef({key:'',complete});
  const celebrationKey=String(format)+':'+(format==='timeline'?timelineDate:dayKey(start))+':'+note.taskCycle;
  useEffect(()=>{if(previous.current.key===celebrationKey&&!previous.current.complete&&complete){setCelebrating(true);sound.playChime();}previous.current={key:celebrationKey,complete};},[complete,celebrationKey]);
  useEffect(()=>{if(!celebrating)return;const t=window.setTimeout(()=>setCelebrating(false),2200);return()=>window.clearTimeout(t);},[celebrating]);
  const cfg=DEFAULT_THEME_CONFIGS[note.theme]||DEFAULT_THEME_CONFIGS.minimal;
  const change=(item:ChecklistItem)=>onUpdate({...note,items:note.items.map(i=>i.id===item.id?item:i)});
  const toggle=(item:ChecklistItem)=>{const next={...item,done:!item.done};change(next);if(next.done)sound.playPop();};
  const add=()=>{if(!input.trim())return;const item:ChecklistItem={id:`item-${crypto.randomUUID()}`,text:input.trim(),done:false,...(weekly?{day}:{}),...(format==='timeline'?{time:'09:00',day:timelineDate}:{})};onUpdate({...note,items:[...note.items,item]});setInput('');inputRef.current?.focus();};
  const shift=(delta:number)=>{const next=monthHabit?new Date(period.getFullYear(),period.getMonth()+delta,1):new Date(period.getFullYear(),period.getMonth(),period.getDate()+delta*7);setPeriod(next);setDay(dayKey(weekStart(next)));onUpdate({...note,plannerDate:dayKey(monthHabit?next:weekStart(next))});};
  const checkDay=(date:Date)=>{const key=dayKey(date),item=note.items.find(i=>i.day===key);if(item)toggle(item);else{onUpdate({...note,items:[...note.items,{id:`day-${key}-${crypto.randomUUID()}`,day:key,text:note.title||'习惯打卡',done:true}]});sound.playPop();}};
  const activeIndex=Math.max(0,days.findIndex(d=>dayKey(d)===day)),activeDate=days[activeIndex];
  const dayButton=(date:Date,index:number)=>{
    const key=dayKey(date),remaining=scoped.filter(item=>item.day===key&&!item.done).length;
    return <button key={key} type="button" className={day===key?'active':''} aria-label={`${key} ${weekdays[index]}`} aria-pressed={day===key} onClick={()=>setDay(key)}><span>{weekdays[index].replace('星期','周')}</span><b>{date.getDate()}</b><small>{remaining||'·'}</small></button>;
  };
  const task=(item:ChecklistItem)=><div className="planner-task" data-task-id={item.id} key={item.id}>
    {format==='timeline'&&<div className="timeline-time"><input aria-label="开始时间" type="time" value={item.time||''} onChange={e=>change({...item,time:e.target.value})}/><input aria-label="结束时间，可选" type="time" value={item.endTime||''} onChange={e=>change({...item,endTime:e.target.value})}/></div>}
    <div className="planner-task-line"><label className="check-hit"><input type="checkbox" aria-label={`完成 ${item.text}`} checked={item.done} onChange={()=>toggle(item)}/></label><TaskPriority item={item}/>
      {weekly?<textarea id={`task-text-${item.id}`} className={`weekly-task-text ${item.done?'done':''}`} aria-label="事项文字" rows={1} value={item.text} style={{fontSize:note.bodyFontSize||14}} ref={el=>{if(el){el.style.height='auto';el.style.height=`${el.scrollHeight}px`;}}} onChange={e=>change({...item,text:e.target.value})}/>:<input id={`task-text-${item.id}`} className={item.done?'done':''} aria-label="事项文字" value={item.text} style={{fontSize:note.bodyFontSize||14}} onChange={e=>change({...item,text:e.target.value})}/>}
      <TaskOptions item={item} noteId={note.id} onEdit={()=>{const el=document.getElementById(`task-text-${item.id}`) as HTMLInputElement|HTMLTextAreaElement;el?.focus();el?.select();}} onDelete={()=>onUpdate({...note,items:note.items.filter(i=>i.id!==item.id)})}/>
    </div>
  </div>;
  const taskList=(items:ChecklistItem[],empty='给这一天安排一件事')=><div className="planner-scroll">{items.length?items.map(task):<p className="planner-empty">{empty}</p>}</div>;
  const dayHeading=<div className="weekly-day-heading"><b>{weekdays[activeIndex]}</b><span>{activeDate.getMonth()+1}月{activeDate.getDate()}日</span></div>;
  const weekContent=()=>{
    if(style==='blue')return <div className="weekly-board-viewport"><div className="weekly-board" aria-label="一周七日看板">{days.map((date,index)=>{
      const key=dayKey(date),items=orderTasks(scoped.filter(item=>item.day===key));
      return <section className={`weekly-board-column ${day===key?'active':''}`} key={key} aria-label={weekdays[index]} onPointerDown={()=>setDay(key)} onFocusCapture={()=>setDay(key)}><header><span>{weekdays[index].replace('星期','周')}</span><b>{date.getDate()}</b><small>{items.filter(item=>item.done).length}/{items.length}</small></header><div className="weekly-board-tasks">{items.map(task)}</div><button className="weekly-board-add" aria-label={`添加${weekdays[index]}事项`} title={`添加${weekdays[index]}事项`} onClick={()=>{setDay(key);inputRef.current?.focus();}}><Plus size={12}/></button></section>;
    })}</div></div>;
    if(style==='dark')return <div className="weekly-business"><nav className="weekly-business-days" aria-label="选择星期">{days.map(dayButton)}</nav><section className="weekly-business-main">{dayHeading}{taskList(shown)}</section></div>;
    if(style==='warm')return <div className="weekly-receipt"><div className="weekly-receipt-title"><b>WEEKLY LIST</b><span>{start.getFullYear()}</span></div><nav className="weekly-receipt-days" aria-label="选择星期">{days.map(dayButton)}</nav><div className="weekly-receipt-date">{dayCodes[activeIndex]} <b>{activeDate.getMonth()+1}.{activeDate.getDate()}</b></div>{taskList(shown)}<div className="weekly-receipt-total"><span>已完成 / 事项</span><b>{shown.filter(item=>item.done).length} / {shown.length}</b></div></div>;
    if(style==='strip')return <div className="weekly-coil"><div className="weekly-binding" aria-hidden="true">{Array.from({length:10},(_,i)=><i key={i}/>)}</div><nav className="weekly-coil-days" aria-label="选择星期">{days.map(dayButton)}</nav>{dayHeading}{taskList(shown)}</div>;
    if(style==='sevenDay')return <div className="weekly-index"><nav className="weekly-index-tabs" aria-label="选择星期">{days.map(dayButton)}</nav><section className="weekly-index-card"><div className="weekly-index-heading"><b>{String(activeDate.getDate()).padStart(2,'0')}</b><span>{weekdays[activeIndex]}<small>{activeDate.getMonth()+1}月</small></span></div>{taskList(shown)}<div className="weekly-index-number">{String(activeIndex+1).padStart(2,'0')} / 07</div></section></div>;
    return <div className="weekly-clean"><nav className="planner-week-tabs weekly-clean-days" aria-label="选择星期">{days.map(dayButton)}</nav>{dayHeading}{taskList(shown)}</div>;
  };
  return <article ref={articleRef} className={`planner-note planner-${format} planner-style-${style} ${cfg.bgClass} ${cfg.textClass}`} data-selected={selected} style={{width:note.width,height:note.collapsed?32:note.height,opacity:note.opacity??1,fontFamily:NOTE_FONTS.find(f=>f.id===note.fontFamily)?.family,background:note.customBgColor,color:note.customTextColor,borderRadius:note.borderRadius??10}}>
    <PaperSurface/>
    <header onPointerDown={e=>{if(!(e.target as HTMLElement).closest('button,input')&&!note.sizeLocked)onDrag();}}><GripVertical size={13}/><input aria-label="便签名称" value={note.title} onChange={e=>onUpdate({...note,title:e.target.value})}/><button title="循环重置当前记录，保留历史" onClick={()=>onUpdate({...note,items:note.items.map(i=>scoped.some(s=>s.id===i.id)?{...i,done:false,completionCycle:(i.completionCycle??note.taskCycle??0)+1}:i)})}><RotateCcw size={13}/></button><button title="字体与外观" onClick={onSettings}><Palette size={13}/></button><button title="置顶" onClick={()=>onUpdate({...note,pinned:!note.pinned})}><Pin size={13}/></button><button title={note.sizeLocked?'解锁':'锁定位置和尺寸'} onClick={()=>onUpdate({...note,sizeLocked:!note.sizeLocked})}>{note.sizeLocked?<Lock size={12}/>:<Unlock size={12}/>}</button><button title="收起" disabled={note.sizeLocked} onClick={()=>onUpdate({...note,collapsed:!note.collapsed})}><Minus size={13}/></button><button title="关闭，可在管理中恢复" onClick={onArchive}><X size={13}/></button></header>
    {!note.collapsed&&<><div className="planner-progress"><span>{complete?'已完成 ✓':habit?'打卡进度':'任务进度'}</span><span>{done}/{total}</span><i role="progressbar" aria-label="完成进度" aria-valuemin={0} aria-valuemax={total||1} aria-valuenow={done}><b style={{width:`${total?done/total*100:0}%`}}/></i></div>
    {format==='timeline'&&<label className="timeline-date">一天的安排<input type="date" aria-label="时间线日期" value={timelineDate} onChange={e=>{if(e.target.value)onUpdate({...note,plannerDate:e.target.value,items:note.items.map(i=>i.day?i:{...i,day:timelineDate})});}}/></label>}
    {(weekly||habit)&&<div className="planner-period"><button title="上一期" onClick={()=>shift(-1)}><ChevronLeft size={13}/></button><span>{monthHabit?`${period.getFullYear()}年${period.getMonth()+1}月`:`${start.getMonth()+1}/${start.getDate()} — ${days[6].getMonth()+1}/${days[6].getDate()}`}</span><button title="下一期" onClick={()=>shift(1)}><ChevronRight size={13}/></button><button onClick={()=>{setPeriod(new Date());setDay(dayKey(new Date()));onUpdate({...note,plannerDate:dayKey(new Date())});}}>本{monthHabit?'月':'周'}</button></div>}
    {weekly?weekContent():habit?<div className="planner-scroll"><div className={`habit-grid ${monthHabit?'month':''}`}>{(monthHabit?monthDays:days).map(d=>{const item=note.items.find(i=>i.day===dayKey(d));return <button key={dayKey(d)} aria-label={`${dayKey(d)}打卡`} aria-pressed={!!item?.done} className={item?.done?'checked':''} onClick={()=>checkDay(d)}><span>{monthHabit?d.getDate():['日','一','二','三','四','五','六'][d.getDay()]}</span><i>{item?.done?<Check size={14}/>:null}</i></button>;})}</div><textarea className="habit-reflection" aria-label="打卡备注" placeholder="写一句感受…" value={note.content||''} onChange={e=>onUpdate({...note,content:e.target.value})}/></div>:taskList(shown,'沿着时间，写下今天的安排')}
    {!habit&&<footer className="planner-add">{weekly&&<span className="weekly-add-day">周{['一','二','三','四','五','六','日'][activeIndex]}</span>}<input aria-label="添加待办" ref={inputRef} autoFocus={!note.items.length} value={input} placeholder="+ 添加待办" title="按回车添加" onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.nativeEvent.isComposing)add();}}/><VoiceInput onActivate={()=>inputRef.current?.focus()}/>{input.trim()&&<button title="添加" onClick={add}><Plus size={14}/></button>}</footer>}
    {complete&&<div className="planner-done-stamp"><CompletedStamp/></div>}
    {celebrating&&<div className="note-confetti" aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i} style={{left:`${(i*37)%100}%`,background:['#e9ad9f','#91b8a0','#e5ca7b','#a5b6db'][i%4],animationDelay:`${i%6*.07}s`}}/>)}</div>}
    {!note.sizeLocked&&<div className="quick-resize" title="调整尺寸" onPointerDown={e=>{resize.current={x:e.screenX,y:e.screenY,w:note.width,h:note.height};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{const r=resize.current;if(r)onUpdate({...note,width:Math.max(260,Math.min(600,r.w+e.screenX-r.x)),height:Math.max(220,Math.min(750,r.h+e.screenY-r.y))});}} onPointerUp={()=>resize.current=null}/>}
    </>}{error&&<p role="alert">{error}</p>}
  </article>;
}
