import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline, List, GripVertical, Minus, X, Pin, Palette, Type, Save, History, Check } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { StickyNote } from '../types';
import { NOTE_FONTS } from '../desktopFonts';
import { cleanRichText, QUICK_PAPERS } from '../quickNotes';
import { VoiceInput } from './VoiceInput';
import { PaperSurface, usePaperOpacity, OpacityControl } from './PaperOpacity';
import './QuickNote.css';

export function QuickNote({note,onUpdate,onSave,onArchive,onDrag,selected,error}:{note:StickyNote;onUpdate:(n:StickyNote)=>void;onSave:(n:StickyNote)=>Promise<void>;onArchive:()=>void;onDrag:()=>void;selected:boolean;error:string}) {
  const editor=useRef<HTMLDivElement>(null),range=useRef<Range|null>(null);
  const articleRef=useRef<HTMLElement>(null);
  const [editing,setEditing]=useState(false),[paperMenu,setPaperMenu]=useState(false),[formats,setFormats]=useState(false);
  const [saving,setSaving]=useState(false),[saved,setSaved]=useState(false),[recordError,setRecordError]=useState('');
  const resizing=useRef<{x:number;y:number;width:number;height:number}|null>(null);
  const family=NOTE_FONTS.find(f=>f.id===note.fontFamily)?.family;
  const paper=QUICK_PAPERS.find(p=>p.id===(note.paperStyle||'cream'))||QUICK_PAPERS[0];
  const bg=note.customBgColor||paper.color,text=note.customTextColor||paper.text,accent=note.customAccentColor||paper.accent;
  usePaperOpacity(articleRef,note.opacity??1,`${note.paperStyle}:${bg}`);
  const setBackground=(color:string)=>{
    const rgb=color.match(/[a-f\d]{2}/gi)?.map(v=>parseInt(v,16))||[255,255,255];
    const dark=(rgb[0]*299+rgb[1]*587+rgb[2]*114)/1000<145;
    onUpdate({...note,customBgColor:color,customTextColor:dark?'#f2f3f5':'#34383d'});
  };
  useEffect(()=>{
    const el=editor.current;if(!el)return;
    if(document.activeElement!==el){
      if(note.richContent)el.innerHTML=cleanRichText(note.richContent);else el.textContent=note.content||'';
    }
  },[note.richContent,note.content,note.collapsed]);
  useEffect(()=>{ if(!note.content && !note.richContent && !note.collapsed) editor.current?.focus(); },[]);
  const remember=()=>{const selection=window.getSelection();if(selection?.rangeCount && editor.current?.contains(selection.anchorNode))range.current=selection.getRangeAt(0).cloneRange();};
  const currentDraft=()=>{const el=editor.current;return el?{...note,richContent:cleanRichText(el.innerHTML),content:el.innerText}:note;};
  const save=()=>{setSaved(false);onUpdate(currentDraft());};
  const saveRecord=async()=>{
    if(saving)return;
    const next=currentDraft();setSaving(true);setSaved(false);setRecordError('');
    try{await onSave(next);setSaved(true);}catch(e){setRecordError(String(e));}finally{setSaving(false);}
  };
  const restore=()=>{editor.current?.focus();const selection=window.getSelection();if(range.current && selection){selection.removeAllRanges();selection.addRange(range.current);}};
  const format=(command:string,value?:string)=>{restore();document.execCommand(command,false,value);remember();save();};
  const textStyle=(key:'fontFamily'|'bodyFontSize',value:string)=>{
    const selectedRange=range.current;
    if(selectedRange && !selectedRange.collapsed && editor.current?.contains(selectedRange.commonAncestorContainer)){
      restore();const span=document.createElement('span');
      if(key==='fontFamily')span.style.fontFamily=NOTE_FONTS.find(f=>f.id===value)?.family||'system-ui';
      else span.style.fontSize=`${value}px`;
      span.append(selectedRange.extractContents());selectedRange.insertNode(span);selectedRange.selectNodeContents(span);remember();save();
    }else{restore();onUpdate({...note,[key]:key==='bodyFontSize'?Number(value):value});}
  };
  return <article ref={articleRef} className={`quick-note quick-${note.paperStyle||'cream'}`} data-selected={selected} style={{width:note.width,height:note.collapsed?32:note.height,fontFamily:family,opacity:note.opacity,'--quick-bg':bg,'--quick-text':text,'--quick-accent':accent} as CSSProperties}>
    <PaperSurface/>
    <header onPointerDown={e=>{if(!(e.target as HTMLElement).closest('button,input'))onDrag();}}>
      <GripVertical size={13}/><input aria-label="随手记标题" value={note.title} onChange={e=>onUpdate({...note,title:e.target.value})}/>
      <button title="纸张样式与颜色" aria-label="纸张样式与颜色" aria-expanded={paperMenu} onClick={()=>setPaperMenu(!paperMenu)}><Palette size={14}/></button>
      <button title={note.pinned?'取消置顶':'置顶'} onClick={()=>onUpdate({...note,pinned:!note.pinned})} aria-pressed={note.pinned}><Pin size={13}/></button>
      <button title={note.collapsed?'展开':'收起'} onClick={()=>onUpdate({...note,collapsed:!note.collapsed})}><Minus size={14}/></button>
      <button title="关闭随手记，可在管理中恢复" onClick={onArchive}><X size={14}/></button>
    </header>
    {!note.collapsed && <>
      {paperMenu && <div className="quick-appearance">
        <div className="quick-papers">{QUICK_PAPERS.map(p=><button key={p.id} aria-pressed={(note.paperStyle||'cream')===p.id} onClick={()=>onUpdate({...note,paperStyle:p.id,customBgColor:undefined,customTextColor:undefined,customAccentColor:undefined})}><i className={`quick-paper-swatch swatch-${p.id}`} style={{background:p.color}}/>{p.name}</button>)}</div>
        <div className="quick-color-presets" aria-label="常用纸张颜色">{['#fffdf8','#f2f6fb','#eaf1ec','#f8e9e4','#ede9f6','#27292e'].map(color=><button key={color} aria-label={`纸张颜色 ${color}`} title="使用此颜色" style={{background:color}} onClick={()=>setBackground(color)}/>)}</div>
        <div className="quick-color-controls"><label>纸色<input type="color" aria-label="自定义纸张颜色" value={bg} onChange={e=>setBackground(e.target.value)}/></label><label>文字<input type="color" aria-label="默认文字颜色" value={text} onChange={e=>onUpdate({...note,customTextColor:e.target.value})}/></label><label>点缀<input type="color" aria-label="点缀颜色" value={accent} onChange={e=>onUpdate({...note,customAccentColor:e.target.value})}/></label></div>
        <OpacityControl note={note} onUpdate={onUpdate}/>
        <button className="quick-appearance-done" onClick={()=>setPaperMenu(false)}>完成</button>
      </div>}
      <div className="quick-writing" onFocus={()=>setEditing(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setEditing(false);}}>
        {(editing||formats) && <div className="quick-format" role="toolbar" aria-label="文字排版" onPointerDown={remember}>
          <select aria-label="字体" value={note.fontFamily||'sans'} onChange={e=>textStyle('fontFamily',e.target.value)}>{NOTE_FONTS.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select>
          <select aria-label="字号" value={note.bodyFontSize||16} onChange={e=>textStyle('bodyFontSize',e.target.value)}>{[12,14,16,18,20,24,28,32].map(n=><option key={n} value={n}>{n}</option>)}</select>
          {[[Bold,'bold','加粗'],[Italic,'italic','斜体'],[Underline,'underline','下划线'],[List,'insertUnorderedList','列表']].map(([Icon,cmd,label])=>{const I=Icon as typeof Bold;return <button key={String(cmd)} title={String(label)} aria-label={String(label)} onMouseDown={e=>e.preventDefault()} onClick={()=>format(String(cmd))}><I size={13}/></button>;})}
          <input type="color" aria-label="文字颜色" defaultValue="#343a40" onChange={e=>format('foreColor',e.target.value)}/>
        </div>}
        <div ref={editor} role="textbox" aria-label="随手记正文" aria-multiline="true" contentEditable suppressContentEditableWarning className="quick-editor" data-placeholder="写下此刻的想法…" style={{fontSize:note.bodyFontSize||16}} onInput={save} onKeyUp={remember} onMouseUp={remember}
          onKeyDown={e=>{if(e.key==='Escape'){e.currentTarget.blur();setFormats(false);}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();saveRecord();}}}
          onPaste={e=>{e.preventDefault();const text=e.clipboardData.getData('text/plain');document.execCommand('insertText',false,text);save();}}/>
      </div>
      <footer><span>{note.content?.length||0} 字</span><div className="quick-footer-actions"><button className="quick-save-record" title="保存到记录（Ctrl+S），更新同一篇随手记" aria-label="保存到记录" disabled={saving} onClick={saveRecord}>{saved?<Check size={12}/>:<Save size={12}/>}<span>{saving?'保存中…':saved?'已保存':'保存记录'}</span></button><button className="quick-history" title="查看往期随手记" aria-label="往期随手记" onClick={()=>invoke('desktop_memo_history',{noteId:note.id}).catch(e=>setRecordError(String(e)))}><History size={12}/><span>往期</span></button><VoiceInput onActivate={()=>{restore();setPaperMenu(false);}}/><button title="文字排版" aria-label="文字排版" aria-pressed={formats} onClick={()=>{setFormats(!formats);editor.current?.focus();}}><Type size={14}/></button></div></footer>
      {!note.sizeLocked && <div className="quick-resize" title="拖动调整大小" onPointerDown={e=>{resizing.current={x:e.screenX,y:e.screenY,width:note.width,height:note.height};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{const r=resizing.current;if(r)onUpdate({...note,width:Math.max(260,Math.min(600,r.width+e.screenX-r.x)),height:Math.max(200,Math.min(750,r.height+e.screenY-r.y))});}} onPointerUp={()=>{resizing.current=null;}}/>}
    </>}
    {error&&<p className="quick-error" role="alert">保存失败：{error}</p>}
    {recordError&&<p className="quick-error" role="alert">{recordError}</p>}
  </article>;
}
