import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Check, X } from 'lucide-react';
import { StickyNote } from '../types';
import { DEFAULT_THEME_CONFIGS } from '../utils/themePresets';
import { createThemeNote, useDesktopPreferences } from '../desktopPreferences';
import { CrispSticker } from './CrispStickers';
import { THEME_GROUPS } from '../themeCatalog';
import { plannerTemplate, plannerStyles, PLANNER_STYLES } from '../taskPlanning';
import './ThemeGallery.css';

function WeeklyStylePreview({style}:{style:string}) {
  const navigation=(className:string)=><div className={`preview-week ${className}`}>{['一','二','三','四','五','六','日'].map((day,i)=><div className={i===1?'active':''} key={day}><b>周{day}</b><span>{i+1}</span></div>)}</div>;
  const tasks=<div className="preview-week-tasks">{Array.from({length:3},(_,i)=><div key={i}><i/><span/></div>)}</div>;
  if(style==='blue')return <div className="preview-week-board">{['一','二','三','四','五','六','日'].map((day,i)=><section key={day}><header>周{day}<b>{i+1}</b></header>{tasks}</section>)}</div>;
  if(style==='dark')return <div className="preview-week-business">{navigation('preview-business-rail')}<section><b>星期二</b><small>10月2日</small>{tasks}</section></div>;
  if(style==='warm')return <div className="preview-week-receipt"><div className="preview-receipt-title">WEEKLY LIST</div>{navigation('preview-receipt-days')}{tasks}<div className="preview-receipt-total">TOTAL <span>0 / 3</span></div></div>;
  if(style==='strip')return <div className="preview-week-coil"><div className="preview-binding">{Array.from({length:8},(_,i)=><i key={i}/>)}</div>{navigation('preview-coil-days')}{tasks}</div>;
  if(style==='sevenDay')return <div className="preview-week-index">{navigation('preview-index-tabs')}<section><header><b>02</b><span>星期二</span></header>{tasks}<small>02 / 07</small></section></div>;
  return <div className="preview-week-clean">{navigation('preview-clean-days')}<div className="preview-clean-heading">星期二</div>{tasks}</div>;
}

export function ThemeGallery() {
  const { prefs } = useDesktopPreferences();
  const [category, setCategory] = useState('daily');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);
  const group = THEME_GROUPS.find(g => g.id === category);
  const cn = prefs.lang === 'cn';
  const format: StickyNote['format'] = category === 'timeline' ? 'timeline' : category === 'weekly' ? 'weekly' : undefined;
  const plannerCards = format ? plannerStyles(format).map(style => ({format, style})) : category === 'habit' ? (['habitWeek','habitMonth'] as const).map(format => ({format, style:PLANNER_STYLES[0]})) : [];
  const create = async (key:string, action:()=>Promise<unknown>) => {
    setCreating(key); setError('');
    try {await action(); setCreated(key);} catch(e) {setError(String(e));} finally {setCreating(null);}
  };
  const buttonLabel = (key:string) => creating === key ? (cn ? '创建中…' : 'Creating…') : created === key ? <><Check size={12}/>{cn ? '再建一张' : 'Add another'}</> : (cn ? '新建' : 'Create');
  return <main className="theme-gallery">
    <header><h1>{cn ? '便签样式' : 'Note styles'}</h1><button className="gallery-close" aria-label={cn ? '关闭样式选择' : 'Close styles'} onClick={() => invoke('desktop_close_panel').catch(e => setError(String(e)))}><X size={16}/></button></header>
    <nav className="gallery-categories" aria-label={cn ? '便签样式分类' : 'Style categories'}>{THEME_GROUPS.map(g => <button key={g.id} aria-pressed={category === g.id} onClick={() => setCategory(g.id)}>{cn ? g.name : g.nameEn}</button>)}</nav>
    {error && <p className="gallery-error" role="alert">{error}</p>}
    {plannerCards.length ? <div className="gallery-grid planner-gallery-grid">{plannerCards.map(({format,style}) => {
      const key = `${format}-${style.id}`;
      const habit = format === 'habitWeek' || format === 'habitMonth';
      const name = format === 'timeline' ? (cn ? '时间线' : 'Timeline') : format === 'weekly' ? (cn ? '周待办' : 'Weekly') : format === 'habitWeek' ? (cn ? '周打卡' : 'Weekly habit') : (cn ? '月打卡' : 'Monthly habit');
      const label = habit ? name : style.id === 'strip' || style.id === 'sevenDay' ? style.name : `${name} · ${cn ? style.name : style.id}`;
      return <section className="gallery-card" key={key}>
        <div className={`planner-preview planner-preview-${style.id} preview-${format}`} style={{background:style.background,color:style.color}}>
          <header>{name}<span>{habit ? '✓' : cn ? style.name : style.id}</span></header>
          {format === 'timeline' ? <div className="preview-timeline">{['09:00','13:30','16:00'].map(time => <div key={time}><i/><b>{time}</b><span/></div>)}</div> : habit ? <div className={`preview-habits ${format === 'habitMonth' ? 'month' : ''}`}>{Array.from({length:format === 'habitMonth' ? 28 : 7},(_,i) => <div key={i}><span>{format === 'habitMonth' ? i+1 : ['一','二','三','四','五','六','日'][i]}</span><i/></div>)}</div> : <WeeklyStylePreview style={style.id}/>}
        </div>
        <div className="gallery-card-caption"><h2>{label}</h2><button disabled={creating !== null} aria-label={`${cn ? '新建' : 'Create'}${label}`} onClick={() => create(key,() => invoke('desktop_create',{template:plannerTemplate(format,style.id)}))}>{buttonLabel(key)}</button></div>
      </section>;
    })}</div> : <div className="gallery-grid">{group?.themes.map(id => {
      const cfg = DEFAULT_THEME_CONFIGS[id];
      const name = prefs.themeRenames[id] || (cn ? cfg.name : cfg.nameEn);
      return <section className="gallery-card" key={id}>
        <div data-note-theme={id} className={`theme-preview ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`}>
          <header><span>{cn ? cfg.badge : cfg.badgeEn}</span>{cfg.defaultSticker !== 'none' && <CrispSticker sticker={cfg.defaultSticker} size={20}/>}</header>
          <div className="preview-content">{id !== 'custom' && <b>{cn ? cfg.name : cfg.nameEn}</b>}<div className="preview-items">{cfg.defaultItems.slice(0,3).map((item,i) => <div key={i}><span className="preview-checkbox"/><span>{cn ? item.text : item.textEn}</span></div>)}</div></div>
          <footer className="preview-add">+ {cn ? '添加待办' : 'Add task'}</footer>
        </div>
        <div className="gallery-card-caption"><h2>{name}</h2><button disabled={creating !== null} aria-label={`${cn ? '新建' : 'Create'}${name}`} onClick={() => create(id,() => createThemeNote(id,prefs))}>{buttonLabel(id)}</button></div>
      </section>;
    })}</div>}
  </main>;
}
