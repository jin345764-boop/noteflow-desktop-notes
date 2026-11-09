import { MouseEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { invoke } from '@tauri-apps/api/core';
import { Clock3, Timer, MoreHorizontal, SlidersHorizontal, Pencil, Copy, Trash2 } from 'lucide-react';
import { ChecklistItem, StickyNote } from '../types';
import { PRIORITIES, deadlineLabel } from '../taskPlanning';
export function TaskPriority({item}:{item:ChecklistItem}){
  const priority=PRIORITIES.find(p=>p.value===item.priority);
  return priority?<span className="task-priority-dot" role="img" aria-label={priority.label} title={priority.label} style={{background:priority.color}}/>:null;
}
export function TaskOptions({item,noteId,onEdit,onDelete,onCopy}:{item:ChecklistItem;noteId:string;onEdit?:(event:MouseEvent)=>void;onDelete?:(event:MouseEvent)=>void;onCopy?:()=>void}){
  const [error,setError]=useState(''),[position,setPosition]=useState<{left:number;top:number}|null>(null);
  const trigger=useRef<HTMLButtonElement>(null),menu=useRef<HTMLDivElement>(null);
  const close=(restore=false)=>{setPosition(null);if(restore)trigger.current?.focus();};
  const call=(command:string)=>{close();invoke(command,{noteId,itemId:item.id}).catch(e=>setError(String(e)));};
  useEffect(()=>{
    if(!position)return;
    menu.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
    const outside=(event:PointerEvent)=>{if(!menu.current?.contains(event.target as Node)&&!trigger.current?.contains(event.target as Node))close();};
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();close(true);}};
    const dismiss=()=>close();
    const scroll=(event:Event)=>{if(!menu.current?.contains(event.target as Node))close();};
    document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);document.addEventListener('scroll',scroll,true);window.addEventListener('resize',dismiss);window.addEventListener('blur',dismiss);
    return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);document.removeEventListener('scroll',scroll,true);window.removeEventListener('resize',dismiss);window.removeEventListener('blur',dismiss);};
  },[position]);
  const open=()=>{if(position){close();return;}const r=trigger.current!.getBoundingClientRect(),height=8+30*(3+Number(!!onEdit)+Number(!!onDelete));setPosition({left:Math.max(6,Math.min(r.right-184,window.innerWidth-190)),top:Math.max(6,Math.min(r.bottom+4,window.innerHeight-height-6))});};
  return <div className="task-options" onClick={e=>e.stopPropagation()}>
    {item.dueAt&&!item.done&&<span className={`task-deadline ${item.dueAt<Date.now()?'overdue':item.dueAt-Date.now()<3600000?'soon':''}`} role="img" aria-label={`截止 ${deadlineLabel(item.dueAt)}`} title={`截止：${new Date(item.dueAt).toLocaleString('zh-CN')}`}><Clock3 size={12}/></span>}
    {error&&<span className="task-option-error" role="alert" title={error}>!</span>}
    <button ref={trigger} className="task-more" title="事项操作" aria-label={`事项操作：${item.text}`} aria-haspopup="menu" aria-expanded={!!position} onClick={open}><MoreHorizontal size={15}/></button>
    {position&&createPortal(<div ref={menu} className="task-action-menu" role="menu" aria-label={`事项操作：${item.text}`} style={{left:position.left,top:position.top,maxHeight:window.innerHeight-12}} onKeyDown={event=>{
      if(event.key==='Tab'){close();return;}if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;event.preventDefault();const buttons=Array.from(menu.current!.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')),index=buttons.indexOf(document.activeElement as HTMLButtonElement);buttons[event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus();
    }}>
      <button role="menuitem" onClick={()=>call('desktop_task_settings')}><SlidersHorizontal size={13}/>优先级与提醒</button>
      <button role="menuitem" disabled={item.done} onClick={()=>call('desktop_focus_item')}><Timer size={13}/>开始专注</button>
      {onEdit&&<button role="menuitem" onClick={event=>{close();onEdit(event);}}><Pencil size={13}/>编辑文字</button>}
      <button role="menuitem" onClick={()=>{close();if(onCopy)onCopy();else navigator.clipboard.writeText(item.text).catch(e=>setError(String(e)));}}><Copy size={13}/>复制文字</button>
      {onDelete&&<button role="menuitem" className="task-delete" onClick={event=>{close();onDelete(event);}}><Trash2 size={13}/>删除事项</button>}
    </div>,document.body)}
  </div>;
}
export function TaskSettings({note,itemId,onUpdate}:{note:StickyNote;itemId:string;onUpdate:(note:StickyNote)=>void}){
  const item=note.items.find(i=>i.id===itemId);
  if(!item)return <main className="task-settings">这条事项已移除。</main>;
  const change=(next:ChecklistItem)=>onUpdate({...note,items:note.items.map(i=>i.id===itemId?next:i)});
  const time=item.dueAt?new Date(item.dueAt-new Date(item.dueAt).getTimezoneOffset()*60000).toISOString().slice(0,16):'';
  return <main className="task-settings"><p>{note.title}</p><h1>{item.text}</h1><h2>四象限</h2><div className="priority-grid">{PRIORITIES.map(p=><button key={p.value} className={item.priority===p.value?'active':''} style={{borderColor:item.priority===p.value?p.color:undefined}} onClick={()=>change({...item,priority:p.value})}><i style={{background:p.color}}/>{p.label}</button>)}</div><button className="priority-clear" onClick={()=>change({...item,priority:undefined})}>不设置优先级</button><label>截止时间<input aria-label="截止时间" type="datetime-local" value={time} onChange={e=>change({...item,dueAt:e.target.value?new Date(e.target.value).getTime():undefined,remindMinutes:item.remindMinutes??10})}/></label><label>提前提醒<select aria-label="提前提醒" disabled={!item.dueAt} value={item.remindMinutes??10} onChange={e=>change({...item,remindMinutes:Number(e.target.value)})}><option value={10}>提前 10 分钟</option><option value={30}>提前 30 分钟</option><option value={60}>提前 1 小时</option><option value={0}>截止时提醒</option><option value={-1}>不提醒</option>{![10,30,60,0,-1].includes(item.remindMinutes??10)&&<option value={item.remindMinutes}>{item.remindMinutes} 分钟</option>}</select></label>{item.dueAt&&<label>自定义提前分钟<input aria-label="自定义提前分钟" type="number" min={0} max={10080} value={item.remindMinutes===-1?'':item.remindMinutes??10} onChange={e=>change({...item,remindMinutes:Math.max(0,Math.min(10080,Number(e.target.value)))})}/></label>}<button className="priority-clear" onClick={()=>change({...item,dueAt:undefined,remindMinutes:undefined})}>清除时间</button><small>时间线按开始时间排列；其他清单先按四象限、再按截止时间排列。提醒需要应用运行或在托盘常驻。</small></main>;
}
