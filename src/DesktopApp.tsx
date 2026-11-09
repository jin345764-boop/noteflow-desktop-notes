import { useEffect, useRef, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Plus, GripVertical, Eye, AlignRight, ChevronLeft, ChevronRight, Volume2, VolumeX, Timer, Scan, CalendarDays, FilePenLine, Settings2, MoreHorizontal } from 'lucide-react';
import { StickyNoteItem } from './components/StickyNoteItem';
import { StickyNote } from './types';
import { INITIAL_STICKY_NOTES } from './utils/storage';
import { DEFAULT_THEME_CONFIGS } from './utils/themePresets';
import { useDesktopPreferences } from './desktopPreferences';
import { NOTE_FONTS } from './desktopFonts';
import { FontFamilyId, FontSizeId } from './types';
import { ThemeGallery } from './components/ThemeGallery';
import {FocusTimer,useFocusTimer} from './components/FocusTimer';
import { QuickNote } from './components/QuickNote';
import { CompletionCalendar } from './components/CompletionCalendar';
import { NoteManager } from './components/NoteManager';
import { MemoHistory } from './components/MemoHistory';
import { quickTemplate } from './quickNotes';
import { PlannerNote } from './components/PlannerNote';
import { LayoutPanel } from './components/LayoutPanel';
import { Reminder } from './components/Reminder';
import { TaskSettings } from './components/TaskOptions';
import { OpacityControl } from './components/PaperOpacity';
import { plannerStyles } from './taskPlanning';
import './settingsPanel.css';
import './planning.css';
import './journal.css';
import './desktop.css';
import './noteThemes.css';

const params = new URLSearchParams(location.search);

// Leave the old browser storage intact; migrate personal content once into the native store.
function legacyNotes(): StickyNote[] {
  const raw = localStorage.getItem('noteflow11_stickies_v4');
  if (!raw) return [];
  const notes: StickyNote[] = JSON.parse(raw);
  if (!Array.isArray(notes)) return [];
  return notes.filter(note => !INITIAL_STICKY_NOTES.some(sample =>
    sample.id === note.id && sample.title === note.title && sample.theme === note.theme &&
    sample.sticker === note.sticker && sample.customBgColor === note.customBgColor &&
    JSON.stringify(sample.items) === JSON.stringify(note.items)));
}

export default function DesktopApp() {
  if (params.has('memoHistory')) return <MemoHistory />;
  if (params.has('layout')) return <LayoutPanel />;
  if (params.has('reminder')) return <Reminder />;
  if (params.has('calendar')) return <CompletionCalendar />;
  if (params.has('focus')) return <FocusTimer />;
  if (params.has('themes')) return <ThemeGallery />;
  if (params.has('selection')) return <Selection />;
  if (params.has('manager')) return <NoteManager />;
  const noteId = params.get('note') || params.get('settings') || params.get('task');
  return noteId ? <DesktopNote noteId={noteId} settings={params.has('settings')} /> : <Toolbar />;
}

function Toolbar() {
  const [error,setError]=useState(''),[collapsed,setCollapsed]=useState(false),[panel,setPanel]=useState<'more'|null>(null);
  const barRef=useRef<HTMLDivElement>(null),widths=useRef({expanded:560,folded:160}),lastSize=useRef('');
  const openingRef=useRef(false),[opening,setOpening]=useState(false);
  const {prefs,update:updatePrefs,error:prefsError}=useDesktopPreferences();
  const focus=useFocusTimer(true),[title,setTitle]=useState(prefs.title);
  const call=(command:string,args?:Record<string,unknown>)=>invoke(command,args).catch(e=>setError(String(e)));
  useEffect(()=>{try{call('desktop_init',{legacy:legacyNotes()});}catch(e){setError(String(e));}},[]);
  useEffect(()=>setTitle(prefs.title),[prefs.title]);
  const resize=async(fold:boolean,next:'more'|null)=>{try{const width=widths.current[fold?'folded':'expanded'];await invoke('desktop_toolbar',{collapsed:fold,menuOpen:!!next,menuHeight:370,width});lastSize.current=`${fold}:${!!next}:${width}`;setCollapsed(fold);setPanel(next);}catch(e){setError(String(e));}};
  useEffect(()=>{
    const bar=barRef.current;if(!bar)return;
    const sync=()=>{const width=Math.ceil(bar.getBoundingClientRect().width+8);widths.current[collapsed?'folded':'expanded']=width;const key=`${collapsed}:${!!panel}:${width}`;if(key===lastSize.current)return;lastSize.current=key;invoke('desktop_toolbar',{collapsed,menuOpen:!!panel,menuHeight:370,width}).catch(e=>{lastSize.current='';setError(String(e));});};
    sync();const observer=new ResizeObserver(sync);observer.observe(bar);return()=>observer.disconnect();
  },[collapsed,panel]);
  useEffect(()=>{const escape=(e:KeyboardEvent)=>{if(e.key==='Escape')resize(collapsed,null);};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);},[collapsed]);
  const action=async(command:string,args?:Record<string,unknown>)=>{await resize(false,null);await call(command,args);};
  const openNew=async()=>{if(openingRef.current)return;openingRef.current=true;setOpening(true);setError('');try{if(panel){setPanel(null);invoke('desktop_toolbar',{collapsed:false,menuOpen:false,width:widths.current.expanded}).catch(e=>setError(String(e)));}await invoke('desktop_panel',{noteId:null,gallery:true});}catch(e){setError('无法打开新建便签：'+String(e));}finally{openingRef.current=false;setOpening(false);}};
  return <><div ref={barRef} className={'desktop-launcher toolbar-simple '+(collapsed?'folded':'')} role="toolbar" aria-label="便签控制条">
    <span title="拖动控制条" onPointerDown={async()=>{if(panel)await resize(collapsed,null);call('desktop_drag');}}><GripVertical size={14}/></span>
    <div className="toolbar-brand"><span>📋</span><input aria-label="控制条名称" title="直接修改名称，回车保存" value={title} onChange={e=>setTitle(e.target.value)} onBlur={()=>{const t=title.trim()||'阿金便利贴';setTitle(t);if(t!==prefs.title)updatePrefs({title:t});}} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur();if(e.key==='Escape')setTitle(prefs.title);}}/></div>
    {!collapsed&&<><button className="toolbar-new" title="新建便签：选择格式和主题" disabled={opening} aria-busy={opening} onClick={openNew}><Plus size={14}/>{opening?'打开中…':'新建'}</button><button title={'新建随手记 · '+prefs.memoShortcut} onClick={()=>action('desktop_create',{template:quickTemplate()})}><FilePenLine size={14}/>随手记</button><button title="完成日历：日、月、年统计" onClick={()=>action('desktop_calendar')}><CalendarDays size={14}/>日历</button><button title="番茄钟，手动确认完成具体事项" onClick={()=>action('desktop_panel',{noteId:null,focus:true})}><Timer size={14}/>{focus.state.deadline!==null?Math.floor(focus.remaining/60)+':'+(focus.remaining%60).toString().padStart(2,'0'):'番茄钟'}</button><button title="更多：框选、整理布局、声音和设置" aria-expanded={panel==='more'} onClick={()=>resize(false,panel==='more'?null:'more')}><MoreHorizontal size={16}/>更多</button></>}
    <button className="toolbar-fold" title={collapsed?'展开控制条':'收起控制条'} aria-label={collapsed?'展开控制条':'收起控制条'} onClick={()=>resize(!collapsed,null)}>{collapsed?<ChevronLeft size={15}/>:<ChevronRight size={15}/>}</button>
  </div>
  {panel==='more'&&<div className="toolbar-popup more-menu"><div className="popup-heading"><b>窗口</b><button title="关闭更多菜单" onClick={()=>resize(false,null)}>关闭</button></div><div><button title="拖动框选，选中后拖动标题一起移动" onClick={()=>action('desktop_begin_selection')}><Scan size={14}/>框选便签</button><button title="整理现有列或重新分列，预览后应用" onClick={()=>action('desktop_layout_panel')}><AlignRight size={14}/>整理布局</button><button title="显示或隐藏全部桌面便签" onClick={()=>action('desktop_visibility')}><Eye size={14}/>显示／隐藏全部</button></div><div className="popup-heading"><b>设置</b></div><div><button title="打开或关闭应用音效" onClick={()=>updatePrefs({soundEnabled:!prefs.soundEnabled})}>{prefs.soundEnabled?<Volume2 size={14}/>:<VolumeX size={14}/>}声音：{prefs.soundEnabled?'开':'关'}</button><button title="切换界面语言" onClick={()=>updatePrefs({lang:prefs.lang==='cn'?'en':'cn'})}>语言：{prefs.lang==='cn'?'中文':'English'}</button><button title="管理便签、归档和快捷键" onClick={()=>action('desktop_panel',{noteId:null})}><Settings2 size={14}/>管理便签与快捷键</button></div></div>}
  {(error||prefsError)&&<div role="alert" className="desktop-error">{error||prefsError}</div>}</>;
}

function DesktopNote({ noteId, settings }: { noteId: string; settings: boolean }) {
  const { prefs } = useDesktopPreferences();
  const [note, setNote] = useState<StickyNote | null>(null);
  const noteRef = useRef<StickyNote | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState('');
  const queue = useRef(Promise.resolve());
  const showError = (e: unknown) => setError(String(e));

  useEffect(() => {
    const events = listen<string>('desktop-error', event => showError(event.payload));
    invoke<StickyNote>('desktop_note', { noteId }).then(n => { noteRef.current = n; setNote(n); }).catch(showError);
    invoke<string[]>('desktop_selection').then(setSelected).catch(showError);
    const changes = listen<{note: StickyNote; source: string}>('note-updated', e => {
      if (e.payload.note.id === noteId && e.payload.source !== getCurrentWindow().label) { noteRef.current = e.payload.note; setNote(e.payload.note); }
    });
    const selection = listen<string[]>('selection-changed', e => setSelected(e.payload));
    return () => { [events, changes, selection].forEach(subscription => subscription.then(unlisten => unlisten())); };
  }, []);

  const create = () => { invoke('desktop_create').catch(showError); };
  const drag = () => { invoke('desktop_drag').catch(showError); };
  const update = (next: StickyNote) => {
    const changes: Record<string, unknown> = { id: noteId };
    for (const key of Object.keys(next) as (keyof StickyNote)[]) {
      if (key !== 'x' && key !== 'y' && JSON.stringify(next[key]) !== JSON.stringify(noteRef.current?.[key])) changes[key] = next[key] ?? null;
    }
    noteRef.current = next;
    setNote(next);
    const saved = queue.current.then(() => invoke<void>('desktop_update', { note: changes }));
    queue.current = saved.catch(showError);
    return saved;
  };
  const saveMemo = async (next:StickyNote) => {
    await update(next);
    await invoke('desktop_memo_save',{note:next});
  };
  const archive = () => {
    queue.current = queue.current.then(() => invoke<void>('desktop_archive', { noteId })).catch(showError);
  };

  if (!note) return error ? <div className="desktop-error">{error}</div> : null;
  if (params.has('task')) return <TaskSettings note={note} itemId={params.get('item')||''} onUpdate={update}/>;
  if (note.format && note.format!=='checklist' && !settings) return <PlannerNote note={note} onUpdate={update} onArchive={archive} onDrag={drag} selected={selected.includes(noteId)} error={error} onSettings={()=>invoke('desktop_panel',{noteId}).catch(showError)}/>;
  if (note.isPlainNote) return <QuickNote note={note} onUpdate={update} onSave={saveMemo} onArchive={archive} onDrag={drag} selected={selected.includes(noteId)} error={error}/>;
  const top = 4;
  return <div className={settings ? 'desktop-settings' : 'desktop-note'}>
    {settings && <><h1 className="settings-title">便签外观</h1><div className="settings-names">
      <label>便签名称<input value={note.headerName ?? DEFAULT_THEME_CONFIGS[note.theme].badge} onChange={e => update({ ...note, headerName: e.target.value })} /></label>
      <label>内容标题<input value={note.title} onChange={e => update({ ...note, title: e.target.value })} /></label>
      <label>字体<select value={note.fontFamily || 'sans'} onChange={e=>update({...note,fontFamily:e.target.value as FontFamilyId})}>{NOTE_FONTS.map(font=><option key={font.id} value={font.id}>{font.name}</option>)}</select></label>
      <label>标题字号<select value={note.titleFontSize ?? 14} onChange={e=>update({...note,titleFontSize:Number(e.target.value)})}>{[12,14,16,18,20,24,28].map(size=><option key={size} value={size}>{size} px</option>)}</select></label>
      <label>正文字号<select value={note.bodyFontSize ? String(note.bodyFontSize) : note.fontSize || 'base'} onChange={e=>{
        const value=e.target.value; if(['sm','base','lg'].includes(value)) update({...note,fontSize:value as FontSizeId,bodyFontSize:undefined}); else update({...note,bodyFontSize:Number(value)});
      }}><option value="sm">原有小号 · 11 px</option><option value="base">原有标准 · 12 px</option><option value="lg">原有大号 · 14 px</option>{[16,18,20,24,28].map(size=><option key={size} value={size}>{size} px</option>)}</select></label>
    </div><OpacityControl note={note} onUpdate={update}/>{note.format&&note.format!=='checklist'&&<section className="settings-plan-styles"><h2>版式</h2>{plannerStyles(note.format).map(style=><button key={style.id} aria-pressed={(note.plannerStyle||'clean')===style.id} onClick={()=>update({...note,plannerStyle:style.id,customBgColor:style.background,customTextColor:style.color,fontFamily:style.id==='warm'?(note.format==='weekly'?'mono':'kai'):'sans'})}>{style.name}</button>)}</section>}</>}
    <StickyNoteItem note={{ ...note, x: 4, y: top }} index={0} allNotes={[note]}
      onUpdate={update} onDelete={archive} onBringToFront={() => {}}
      desktop lang={prefs.lang} themeRenames={prefs.themeRenames} onNativeDrag={drag} onNewNote={create} isSelected={selected.includes(noteId)}
      onToggleSelect={() => invoke('desktop_toggle_selection', { noteId }).catch(showError)}
      onOpenSettings={() => invoke('desktop_panel', { noteId }).catch(showError)}
      settingsOnly={settings} onCloseSettings={() => invoke('desktop_close_panel').catch(showError)} />
    {error && <div role="alert" className="desktop-error" title={error}>保存失败：{error}</div>}
  </div>;
}

function Selection() {
  const origin = useRef<[number,number] | null>(null);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') invoke('desktop_cancel_selection'); };
    window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape);
  }, []);
  return <div className="desktop-selection" onPointerDown={e => { if(e.button!==0)return; origin.current=[e.clientX,e.clientY]; setStart(origin.current); setEnd(origin.current); e.currentTarget.setPointerCapture(e.pointerId); }}
    onPointerMove={e => { if (start) setEnd([e.clientX,e.clientY]); }}
    onPointerUp={e => { const point=origin.current; if(point){origin.current=null; invoke('desktop_finish_selection', { rect: [Math.min(point[0],e.clientX),Math.min(point[1],e.clientY),Math.max(point[0],e.clientX),Math.max(point[1],e.clientY)], append: e.shiftKey }).catch(e => setError(String(e)));} }}>
    <div className="selection-hint">拖动框选 · 松开后拖动选中便签标题一起移动 · Shift 追加 · Esc 取消</div>
    {start && end && <div className="selection-box" style={{left:Math.min(start[0],end[0]),top:Math.min(start[1],end[1]),width:Math.abs(start[0]-end[0]),height:Math.abs(start[1]-end[1])}} />}
    {error && <div className="desktop-error">{error}</div>}
  </div>;
}

