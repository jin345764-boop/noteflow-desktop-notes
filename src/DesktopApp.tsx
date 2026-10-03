import { useEffect, useRef, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Plus, GripVertical, Eye, AlignRight, ChevronLeft, ChevronRight, ChevronDown, Volume2, VolumeX, Timer, Scan } from 'lucide-react';
import { StickyNoteItem } from './components/StickyNoteItem';
import { StickyNote } from './types';
import { INITIAL_STICKY_NOTES } from './utils/storage';
import { DEFAULT_THEME_CONFIGS } from './utils/themePresets';
import { ThemeId } from './types';
import { useDesktopPreferences, createThemeNote } from './desktopPreferences';
import { NOTE_FONTS } from './desktopFonts';
import { FontFamilyId, FontSizeId } from './types';
import { ThemeGallery } from './components/ThemeGallery';
import {FocusTimer,useFocusTimer} from './components/FocusTimer';
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
  if (params.has('focus')) return <FocusTimer />;
  if (params.has('themes')) return <ThemeGallery />;
  if (params.has('selection')) return <Selection />;
  if (params.has('manager')) return <NoteManager />;
  const noteId = params.get('note') || params.get('settings');
  return noteId ? <DesktopNote noteId={noteId} settings={params.has('settings')} /> : <Toolbar />;
}

function Toolbar() {
  const [error, setError] = useState('');
  const focus = useFocusTimer(true);
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { prefs, update: updatePrefs, error: prefsError } = useDesktopPreferences();
  const call = (command: string, args?: Record<string, unknown>) => invoke(command, args).catch(e => setError(String(e)));
  useEffect(() => {
    try { call('desktop_init', { legacy: legacyNotes() }); } catch (e) { setError(String(e)); }
  }, []);
  const resize = async (fold: boolean, menu: boolean) => {
    try { await invoke('desktop_toolbar',{collapsed:fold,menuOpen:menu}); setCollapsed(fold); setMenuOpen(menu); } catch(e) { setError(String(e)); }
  };
  const [titleDraft, setTitleDraft] = useState(prefs.title);
  useEffect(() => setTitleDraft(prefs.title), [prefs.title]);
  useEffect(() => {
    const escape = (e:KeyboardEvent) => { if(e.key === 'Escape') resize(collapsed,false); };
    window.addEventListener('keydown',escape); return () => window.removeEventListener('keydown',escape);
  },[collapsed]);
  return <><div className={`desktop-launcher ${collapsed ? 'folded' : ''}`} role="toolbar" aria-label="便签控制条">
    {collapsed && <button title="展开控制条" onClick={() => resize(false,false)}><ChevronLeft size={15} /></button>}
    <span title="拖动控制条" onPointerDown={() => { if(menuOpen) resize(collapsed,false); call('desktop_drag'); }}><GripVertical size={14} /></span>
    <div className="toolbar-brand"><span>📋</span><input aria-label="控制条名称" title="直接修改名称，回车保存" value={titleDraft} onChange={e => setTitleDraft(e.target.value)} onBlur={() => {const title = titleDraft.trim() || '阿金便利贴'; setTitleDraft(title); if (title !== prefs.title) updatePrefs({title});}} onKeyDown={e => {if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') {e.preventDefault(); setTitleDraft(prefs.title);}}} /></div>
    <button className="toolbar-theme-count" title="查看全部主题预览和介绍" onClick={() => {resize(collapsed,false); call('desktop_panel',{noteId:null,gallery:true});}}><small>{Object.keys(DEFAULT_THEME_CONFIGS).length} 款风格</small></button>
    {!collapsed && <>
      <button className="toolbar-new" title="选择主题新建便签" onClick={() => resize(false,!menuOpen)}><Plus size={14} />新建<ChevronDown size={12} /></button>
      <button className="toolbar-focus" title="番茄钟：设置时长并记录专注时间" onClick={()=>call('desktop_panel',{noteId:null,focus:true})}><Timer size={14}/>{focus.state.deadline !== null ? `${Math.floor(focus.remaining/60).toString().padStart(2,'0')}:${(focus.remaining%60).toString().padStart(2,'0')}` : '番茄钟'}</button>
      <button aria-label="框选便签" title="框选便签后，拖动选中便签的标题一起移动；Esc 取消" onClick={async()=>{await resize(false,false); await call('desktop_begin_selection');}}><Scan size={14}/><span>{prefs.lang === 'cn' ? '框选' : 'Select'}</span></button>
      <button title="保留每张便签的尺寸，紧凑对齐全部便签" onClick={() => call('desktop_align')}><AlignRight size={14} /><span>{prefs.lang === 'cn' ? '紧凑对齐' : 'Align'}</span></button>
      <button title={prefs.soundEnabled ? '关闭声音' : '打开声音'} onClick={() => updatePrefs({soundEnabled:!prefs.soundEnabled})}>{prefs.soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}</button>
      <button className="toolbar-language" title="切换中英文" onClick={() => updatePrefs({lang:prefs.lang === 'cn' ? 'en' : 'cn'})}><span className={prefs.lang === 'cn' ? 'active' : ''}>CN</span><span className={prefs.lang === 'en' ? 'active' : ''}>EN</span></button>
      <button title="隐藏或显示全部便签" onClick={() => call('desktop_visibility')}><Eye size={15} /></button>
      <button title="自动收起到屏幕最右侧" onClick={() => resize(true,false)}>收起<ChevronRight size={13} /></button>
    </>}
  </div>
    {menuOpen && <div className="toolbar-themes"><div className="theme-menu-heading">选择主题风格<button onClick={() => resize(false,false)}>关闭</button></div>
      <div className="theme-menu-grid">{(Object.keys(DEFAULT_THEME_CONFIGS) as ThemeId[]).map(theme => {
        const cfg = DEFAULT_THEME_CONFIGS[theme]; return <button key={theme} onClick={async () => {
          try { await createThemeNote(theme,prefs); await resize(false,false); } catch(e) { setError(String(e)); }
        }}><i style={{background:cfg.accentColor}} /><b>{prefs.themeRenames[theme] || (prefs.lang === 'cn' ? cfg.name : cfg.nameEn)}</b><small>{prefs.lang === 'cn' ? cfg.description : cfg.descriptionEn}</small></button>;
      })}</div></div>}
    {(error || prefsError) && <div role="alert" className="desktop-error">{error || prefsError}</div>}
  </>;
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
    queue.current = queue.current.then(() => invoke<void>('desktop_update', { note: changes })).catch(showError);
  };
  const archive = () => {
    queue.current = queue.current.then(() => invoke<void>('desktop_archive', { noteId })).catch(showError);
  };

  if (!note) return error ? <div className="desktop-error">{error}</div> : null;
  const top = 4;
  return <div className={settings ? 'desktop-settings' : 'desktop-note'}>
    {settings && <div className="settings-names">
      <label>便签名称<input value={note.headerName ?? DEFAULT_THEME_CONFIGS[note.theme].badge} onChange={e => update({ ...note, headerName: e.target.value })} /></label>
      <label>内容标题<input value={note.title} onChange={e => update({ ...note, title: e.target.value })} /></label>
      <label>字体<select value={note.fontFamily || 'sans'} onChange={e=>update({...note,fontFamily:e.target.value as FontFamilyId})}>{NOTE_FONTS.map(font=><option key={font.id} value={font.id}>{font.name}</option>)}</select></label>
      <label>标题字号<select value={note.titleFontSize ?? 14} onChange={e=>update({...note,titleFontSize:Number(e.target.value)})}>{[12,14,16,18,20,24,28].map(size=><option key={size} value={size}>{size} px</option>)}</select></label>
      <label>正文字号<select value={note.bodyFontSize ? String(note.bodyFontSize) : note.fontSize || 'base'} onChange={e=>{
        const value=e.target.value; if(['sm','base','lg'].includes(value)) update({...note,fontSize:value as FontSizeId,bodyFontSize:undefined}); else update({...note,bodyFontSize:Number(value)});
      }}><option value="sm">原有小号 · 11 px</option><option value="base">原有标准 · 12 px</option><option value="lg">原有大号 · 14 px</option>{[16,18,20,24,28].map(size=><option key={size} value={size}>{size} px</option>)}</select></label>
    </div>}
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

function NoteManager() {
  const [data, setData] = useState<{notes: StickyNote[]; archived: StickyNote[]}>({notes:[],archived:[]});
  const [error, setError] = useState('');
  const reload = () => invoke<typeof data>('desktop_list').then(setData).catch(e => setError(String(e)));
  useEffect(() => { reload(); const events = listen('notes-changed', reload); return () => { events.then(fn => fn()); }; }, []);
  const call = (command: string, args: Record<string, unknown>) => invoke(command,args).then(reload).catch(e => setError(String(e)));
  return <div className="note-manager">
    <h1>管理便签</h1><p>每张便签的名称可以单独修改；关闭后可在下方恢复。</p>
    {data.notes.length === 0 && <p>还没有便签，点击控制条“新建”即可添加。</p>}
    {data.notes.map(note => <div className="manager-row" key={note.id}>
      <input key={note.headerName ?? note.theme} aria-label="便签名称" defaultValue={note.headerName ?? DEFAULT_THEME_CONFIGS[note.theme].badge} onBlur={e => call('desktop_update',{note:{id:note.id,headerName:e.target.value}})} />
      <span>{note.title}</span><button onClick={() => call('desktop_panel',{noteId:note.id})}>设置</button>
      <button onClick={() => call('desktop_archive',{noteId:note.id})}>关闭</button>
    </div>)}
    <h2>已关闭的便签</h2>
    {data.archived.map(note => <div className="manager-row" key={note.id}><span>{note.headerName ?? note.title}</span><button onClick={() => call('desktop_restore',{noteId:note.id})}>恢复</button></div>)}
    {error && <p role="alert">{error}</p>}
  </div>;
}
