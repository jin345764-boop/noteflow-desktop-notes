import { KeyboardEvent, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { X } from 'lucide-react';
import { useDesktopPreferences } from '../desktopPreferences';
import './ManagerMemo.css';

export function ShortcutSettings(){
  const {prefs}=useDesktopPreferences();
  const [memo,setMemo]=useState('Alt+N'),[todo,setTodo]=useState('Alt+D'),[message,setMessage]=useState(''),[saving,setSaving]=useState(false),[failed,setFailed]=useState(false);
  useEffect(()=>{setMemo(prefs.memoShortcut);setTodo(prefs.todoShortcut);},[prefs.memoShortcut,prefs.todoShortcut]);
  const capture=(event:KeyboardEvent<HTMLInputElement>,set:(value:string)=>void)=>{
    if(event.key==='Tab')return;event.preventDefault();
    if(event.key==='Backspace'||event.key==='Delete'){set('');setMessage('');return;}
    if(!event.altKey&&!event.ctrlKey&&!event.metaKey){setFailed(true);setMessage('请搭配 Alt 或 Ctrl，例如 Alt+N');return;}
    if(!/^[a-z0-9]$/i.test(event.key))return;
    set([event.ctrlKey?'Ctrl':'',event.altKey?'Alt':'',event.shiftKey?'Shift':'',event.metaKey?'Super':'',event.key.toUpperCase()].filter(Boolean).join('+'));setMessage('');
  };
  const save=async()=>{
    setSaving(true);setMessage('');setFailed(false);
    try{await invoke('desktop_shortcuts',{memo,todo});setMessage('快捷键已保存');}catch(error){setFailed(true);setMessage(String(error));}finally{setSaving(false);}
  };
  return <section className="shortcut-settings shortcuts-v2">
    <h2>全局快捷键</h2><p>点选右侧输入框，按下想使用的组合键。</p>
    <div className="shortcut-key-list">
      {[{label:'新建随手记',name:'随手记快捷键',value:memo,set:setMemo},{label:'新建待办',name:'待办快捷键',value:todo,set:setTodo}].map(row=><div className="shortcut-key-row" key={row.name}><label htmlFor={row.name}>{row.label}</label><div><input id={row.name} aria-label={row.name} readOnly value={row.value} placeholder="未设置" onKeyDown={event=>capture(event,row.set)}/><button type="button" disabled={!row.value} aria-label={`关闭${row.name}`} title="关闭此快捷键" onClick={()=>{row.set('');setMessage('');}}><X size={14}/></button></div></div>)}
    </div>
    <p className="shortcut-footnote">在其他应用中也能使用。删除键可清除；若组合键已被占用，会保留原设置并提示。</p>
    <div className="shortcut-save-row"><button type="button" className="panel-secondary" onClick={()=>{setMemo('Alt+N');setTodo('Alt+D');setMessage('');}}>恢复默认</button><button type="button" className="panel-primary" disabled={saving} onClick={save}>{saving?'保存中…':'保存快捷键'}</button></div>
    {(message||prefs.shortcutError)&&<p className={failed||prefs.shortcutError?'panel-message error':'panel-message'} role={failed||prefs.shortcutError?'alert':'status'}>{message||prefs.shortcutError}</p>}
  </section>;
}
