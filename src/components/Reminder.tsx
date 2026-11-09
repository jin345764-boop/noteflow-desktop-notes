import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { Bell, X } from 'lucide-react';
interface ReminderItem {noteId:string;itemId:string;text:string;project:string;dueAt:number}
export function Reminder(){const [items,setItems]=useState<ReminderItem[]>([]),[error,setError]=useState('');const reload=()=>invoke<ReminderItem[]>('desktop_reminder_list').then(setItems).catch(e=>setError(String(e)));useEffect(()=>{reload();const sub=listen('reminders-changed',reload);return()=>{sub.then(fn=>fn());};},[]);
  return <main className="reminder-panel"><header><Bell size={15}/><b>待办提醒</b></header>{items.length===0?<p>没有待提醒的事项</p>:items.map(i=><section key={`${i.noteId}-${i.itemId}`}><button className="reminder-dismiss" title="本次不再提醒" onClick={()=>invoke('desktop_reminder_dismiss',{noteId:i.noteId,itemId:i.itemId}).then(reload).catch(e=>setError(String(e)))}><X size={12}/></button><strong>{i.text}</strong><small>{i.project} · {new Date(i.dueAt).toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}</small><div><button onClick={()=>invoke('desktop_show_notes',{noteIds:[i.noteId]}).catch(e=>setError(String(e)))}>查看便签</button><button onClick={()=>invoke('desktop_reminder_snooze',{noteId:i.noteId,itemId:i.itemId}).then(reload).catch(e=>setError(String(e)))}>10 分钟后提醒</button></div></section>)}{error&&<p role="alert">{error}</p>}</main>;
}
