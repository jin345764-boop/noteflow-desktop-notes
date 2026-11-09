import { useEffect, useRef, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { Archive, RotateCcw, Settings2, FileText, CheckSquare2 } from 'lucide-react';
import { StickyNote } from '../types';
import { DEFAULT_THEME_CONFIGS } from '../utils/themePresets';
import { ShortcutSettings } from './ShortcutSettings';
import './ManagerMemo.css';

type ManagerData={notes:StickyNote[];archived:StickyNote[]};
function noteName(note:StickyNote){return (note.isPlainNote?note.title:note.headerName||note.title)||DEFAULT_THEME_CONFIGS[note.theme]?.name||'未命名便签';}
function noteSummary(note:StickyNote){
  if(note.isPlainNote)return `随手记 · ${note.content?.length||0} 字`;
  const label={checklist:'待办清单',timeline:'时间线',weekly:'周待办',habitWeek:'周打卡',habitMonth:'月打卡'}[note.format||'checklist'];
  return `${label} · ${note.items?.filter(item=>item.done).length||0}/${note.items?.length||0} 已完成`;
}

function ManagerRow({note,archived,busy,onRename,onAction}:{note:StickyNote;archived:boolean;busy:boolean;onRename:(name:string)=>void;onAction:(command:string)=>void}){
  const name=noteName(note),[value,setValue]=useState(name),cancel=useRef(false);
  useEffect(()=>setValue(name),[name]);
  return <div className="manager-note-row">
    <span className="manager-note-icon" aria-hidden="true">{note.isPlainNote?<FileText size={18}/>:<CheckSquare2 size={18}/>}</span>
    <div className="manager-note-info"><input aria-label="便签名称" title="直接修改名称，回车保存" value={value} disabled={busy} onChange={event=>setValue(event.target.value)} onBlur={()=>{if(cancel.current){cancel.current=false;return;}const next=value.trim()||name;setValue(next);if(next!==name)onRename(next);}} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();event.currentTarget.blur();}if(event.key==='Escape'){cancel.current=true;setValue(name);event.currentTarget.blur();}}}/><span>{noteSummary(note)}</span></div>
    <div className="manager-row-actions">{archived?<button type="button" disabled={busy} onClick={()=>onAction('desktop_restore')}><RotateCcw size={13}/>恢复</button>:<><button type="button" disabled={busy} onClick={()=>onAction('desktop_panel')}><Settings2 size={13}/>设置</button><button type="button" disabled={busy} onClick={()=>onAction('desktop_archive')}><Archive size={13}/>收纳</button></>}</div>
  </div>;
}

export function NoteManager(){
  const [tab,setTab]=useState<'desktop'|'archived'|'shortcuts'>('desktop');
  const [data,setData]=useState<ManagerData>({notes:[],archived:[]}),[loading,setLoading]=useState(true),[error,setError]=useState(''),[busy,setBusy]=useState('');
  const reload=()=>invoke<ManagerData>('desktop_list').then(setData).catch(error=>setError(String(error))).finally(()=>setLoading(false));
  useEffect(()=>{reload();const events=listen('notes-changed',reload);return()=>{events.then(unlisten=>unlisten());};},[]);
  const call=async(command:string,note:StickyNote,extra:Record<string,unknown>={})=>{
    setBusy(note.id);setError('');
    try{await invoke(command,{noteId:note.id,...extra});await reload();}catch(error){setError(String(error));}finally{setBusy('');}
  };
  const notes=tab==='archived'?data.archived:data.notes;
  return <main className="manager-panel">
    <header><h1>管理便签</h1><p>整理桌面，收纳暂时不用的内容。</p></header>
    <nav className="manager-tabs" role="tablist" aria-label="管理分类">{[{id:'desktop',name:'桌面便签',count:data.notes.length},{id:'archived',name:'已收纳',count:data.archived.length},{id:'shortcuts',name:'快捷键'}].map(item=><button type="button" role="tab" key={item.id} aria-selected={tab===item.id} onClick={()=>setTab(item.id as typeof tab)}>{item.name}{item.count!==undefined&&<span>{item.count}</span>}</button>)}</nav>
    {error&&<p className="panel-message error" role="alert">{error}</p>}
    {tab==='shortcuts'?<ShortcutSettings/>:<section className="manager-note-section" aria-label={tab==='desktop'?'桌面便签':'已收纳便签'}>
      <div className="manager-section-heading"><h2>{tab==='desktop'?'桌面便签':'已收纳'}</h2><span>{notes.length} 张</span></div>
      {loading?<p className="panel-empty">正在读取…</p>:notes.length===0?<p className="panel-empty">{tab==='desktop'?'桌面上还没有便签。点击控制条“新建”开始记录。':'暂时没有收纳的便签。'}</p>:<div className="manager-note-list">{notes.map(note=><ManagerRow key={note.id} note={note} archived={tab==='archived'} busy={busy===note.id} onRename={name=>call('desktop_manager_rename',note,{name})} onAction={command=>call(command,note)}/>)}</div>}
      <p className="manager-help">{tab==='desktop'?'点击名称即可修改。收纳后内容仍保留，可随时恢复。':'恢复后会重新显示在桌面上，保留内容和原有样式。'}</p>
    </section>}
  </main>;
}
