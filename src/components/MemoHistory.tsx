import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { ArrowUpRight, FileText } from 'lucide-react';
import { cleanRichText } from '../quickNotes';
import { MemoRecord, memoDate, memoDateLabel, memoRecordTime } from '../memoRecords';
import './ManagerMemo.css';

export function MemoHistory(){
  const [records,setRecords]=useState<MemoRecord[]>([]),[selected,setSelected]=useState(()=>new URLSearchParams(location.search).get('note')||'');
  const [loading,setLoading]=useState(true),[opening,setOpening]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState('');
  const reload=()=>invoke<MemoRecord[]>('desktop_memo_list').then(rows=>{
    const sorted=rows.sort((a,b)=>memoRecordTime(b)-memoRecordTime(a)||a.noteId.localeCompare(b.noteId));setRecords(sorted);setSelected(current=>sorted.some(row=>row.noteId===current)?current:sorted[0]?.noteId||'');
  }).catch(error=>setError(String(error))).finally(()=>setLoading(false));
  useEffect(()=>{
    reload();const events=listen('notes-changed',reload),selection=listen<string|null>('memo-history-select',event=>{if(event.payload)setSelected(event.payload);});
    return()=>{events.then(unlisten=>unlisten());selection.then(unlisten=>unlisten());};
  },[]);
  const record=records.find(row=>row.noteId===selected);
  const open=async()=>{
    if(!record)return;setOpening(true);setMessage('');setError('');
    try{await invoke('desktop_memo_open',{noteId:record.noteId});await reload();setMessage('已在桌面打开');}catch(error){setError(String(error));}finally{setOpening(false);}
  };
  return <main className="memo-history-panel">
    <header><div><h1>随手记记录</h1><p>保存过的文字，也能随时回到桌面。</p></div><span>{records.length} 篇</span></header>
    {error&&<p className="panel-message error" role="alert">{error}</p>}
    {loading?<p className="panel-empty">正在读取…</p>:records.length===0?<div className="memo-history-empty"><FileText size={28}/><h2>还没有随手记</h2><p>在桌面写下想法，点击“保存记录”留在这里。</p></div>:<div className="memo-history-layout">
      <nav className="memo-record-list" aria-label="往期随手记">{records.map(row=><button type="button" key={row.noteId} className={row.noteId===selected?'selected':''} aria-pressed={row.noteId===selected} onClick={()=>{setSelected(row.noteId);setMessage('');}}><span className="memo-record-title">{row.title||'未命名随手记'}</span><span className="memo-record-summary">{row.content?.trim()||'暂无正文'}</span><span className="memo-record-meta"><span>{row.saved?'已保存':row.status==='archived'?'已收纳草稿':'桌面草稿'}</span><time dateTime={memoDate(row.savedAt??row.createdAt)?.toISOString()}>{memoDateLabel(row)}</time></span></button>)}</nav>
      {record&&<section className="memo-record-detail" aria-label="随手记内容"><header><div><h2>{record.title||'未命名随手记'}</h2><p>{memoDateLabel(record)}{record.status==='archived'?' · 已收纳':''}</p></div><button type="button" className="panel-primary" disabled={opening} onClick={open}><ArrowUpRight size={14}/>{opening?'打开中…':record.status==='desktop'?'继续编辑':'放回桌面'}</button></header>
        {record.draftChanged&&<p className="memo-draft-note">{record.status==='desktop'?'桌面草稿有更新，继续编辑会打开当前草稿。':'草稿有更新，放回桌面会保留最新内容。'}</p>}
        <div className="memo-record-body">{record.richContent?<div dangerouslySetInnerHTML={{__html:cleanRichText(record.richContent)}}/>:<p>{record.content||'暂无正文'}</p>}</div>
        <footer><span>{record.content?.length||0} 字</span>{message&&<span role="status">{message}</span>}</footer>
      </section>}
    </div>}
  </main>;
}
