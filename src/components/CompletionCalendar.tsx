import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { ChevronLeft, ChevronRight, Check, ExternalLink } from 'lucide-react';
import { CalendarPeriod, CompletionRecord, completionSummary, dateKey, monthCells, periodRecords, recordsByDay } from '../completionCalendar';
import './completionCalendar.css';

const colors=['#e6eee8','#e6ecf1','#eee9e0','#eee7ee','#e9eddc'];
function recordColor(id:string){return colors[Array.from(id).reduce((total,char)=>total+char.charCodeAt(0),0)%colors.length];}
type CalendarData={completions:CompletionRecord[];notes:{id:string}[];archived:{id:string}[]};

export function CompletionCalendar(){
  const [today,setToday]=useState(()=>new Date());
  const [month,setMonth]=useState(()=>new Date(new Date().getFullYear(),new Date().getMonth(),1));
  const [selected,setSelected]=useState(()=>dateKey(new Date()));
  const [period,setPeriod]=useState<CalendarPeriod>('day');
  const [records,setRecords]=useState<CompletionRecord[]>([]);
  const [sources,setSources]=useState<Record<string,'active'|'archived'>>({});
  const [limit,setLimit]=useState(40),[error,setError]=useState(''),[showing,setShowing]=useState(false);

  useEffect(()=>{
    const reload=()=>invoke<CalendarData>('desktop_list').then(data=>{
      setRecords(data.completions||[]);
      const source:Record<string,'active'|'archived'>={};
      for(const note of data.archived||[])source[note.id]='archived';
      for(const note of data.notes||[])source[note.id]='active';
      setSources(source);setError('');
    }).catch(e=>setError(String(e)));
    reload();const sub=listen('notes-changed',reload);
    const clock=window.setInterval(()=>setToday(new Date()),60000);
    return()=>{sub.then(fn=>fn());window.clearInterval(clock);};
  },[]);
  useEffect(()=>setLimit(40),[period,selected,month]);

  const year=month.getFullYear(),monthIndex=month.getMonth(),todayKey=dateKey(today);
  const days=recordsByDay(records),cells=monthCells(year,monthIndex);
  const summary=completionSummary(records,today,year,monthIndex);
  const rows=periodRecords(records,period,selected,year,monthIndex);
  const noteIds=Array.from(new Set(rows.filter(record=>sources[record.noteId]==='active').map(record=>record.noteId)));
  const recordedYears=Array.from(new Set(records.map(record=>new Date(record.completedAt).getFullYear()).filter(Number.isFinite)));
  const firstYear=Math.min(today.getFullYear()-10,year,...recordedYears);
  const lastYear=Math.max(today.getFullYear()+5,year,...recordedYears);
  const years=Array.from({length:lastYear-firstYear+1},(_,i)=>lastYear-i);
  const detailTitle=period==='day'?selected.replaceAll('-',' / '):period==='month'?`${year} 年 ${monthIndex+1} 月`:`${year} 年`;
  const selectMonth=(next:Date)=>{
    setMonth(next);setSelected(dateKey(next));
  };
  const showToday=()=>{
    const now=new Date();setToday(now);setMonth(new Date(now.getFullYear(),now.getMonth(),1));setSelected(dateKey(now));setPeriod('day');
  };
  const showNotes=async()=>{
    setShowing(true);setError('');
    try{await invoke('desktop_show_notes',{noteIds});}catch(e){setError(String(e));}finally{setShowing(false);}
  };
  const statCards=[
    {id:'day' as const,label:'今日完成',count:summary.day,date:today.toLocaleDateString('zh-CN',{month:'long',day:'numeric',weekday:'short'})},
    {id:'month' as const,label:'月度完成',count:summary.month,date:`${year} 年 ${monthIndex+1} 月`},
    {id:'year' as const,label:'年度完成',count:summary.year,date:`${year} 年`},
  ];

  return <main className="completion-calendar calendar-v2">
    <header className="calendar-heading">
      <div><h1>完成日历</h1><p>做完的事，都记在这里。</p></div>
      <div className="calendar-controls">
        <select aria-label="年份" value={year} onChange={e=>selectMonth(new Date(Number(e.target.value),monthIndex,1))}>{years.map(value=><option key={value} value={value}>{value} 年</option>)}</select>
        <select aria-label="月份" value={monthIndex} onChange={e=>selectMonth(new Date(year,Number(e.target.value),1))}>{Array.from({length:12},(_,i)=><option key={i} value={i}>{i+1} 月</option>)}</select>
        <button type="button" onClick={showToday} title="回到今天">今天</button>
      </div>
    </header>
    <section className="calendar-stats" aria-label="完成统计">
      {statCards.map(card=><button type="button" key={card.id} className="calendar-stat" aria-pressed={period===card.id&&(card.id!=='day'||selected===todayKey)} onClick={()=>{setPeriod(card.id);if(card.id==='day')setSelected(todayKey);}}>
        <span className="calendar-stat-label">{card.label}</span><span className="calendar-stat-circle"><strong>{card.count.toLocaleString('zh-CN')}</strong><span>件事</span></span><span className="calendar-stat-range">{card.date}</span>
      </button>)}
    </section>
    <div className="calendar-month-heading"><h2>{year} 年 {monthIndex+1} 月</h2><div><span>点击日期查看完成事项</span><button type="button" aria-label="上个月" title="上个月" onClick={()=>selectMonth(new Date(year,monthIndex-1,1))}><ChevronLeft size={16}/></button><button type="button" aria-label="下个月" title="下个月" onClick={()=>selectMonth(new Date(year,monthIndex+1,1))}><ChevronRight size={16}/></button></div></div>
    <div className="calendar-weekdays">{['一','二','三','四','五','六','日'].map(day=><span key={day}>{day}</span>)}</div>
    <div className="calendar-grid" role="grid" aria-label={`${year}年${monthIndex+1}月完成事项`}>{cells.map(date=>{
      const key=dateKey(date),items=days[key]||[];
      return <button type="button" key={key} role="gridcell" aria-label={`${key}，完成${items.length}项`} aria-selected={period==='day'&&selected===key} className={`${date.getMonth()!==monthIndex?'outside':''} ${key===todayKey?'today':''} ${period==='day'&&selected===key?'chosen':''}`} onClick={()=>{setSelected(key);setPeriod('day');if(date.getMonth()!==monthIndex)setMonth(new Date(date.getFullYear(),date.getMonth(),1));}}>
        <span className="calendar-date">{date.getDate()}</span><div>{items.slice(0,2).map((record,i)=><span className="calendar-strip" title={record.text} style={{background:recordColor(record.noteId)}} key={`${record.noteId}-${record.itemId}-${record.cycle}-${i}`}>{record.text}</span>)}{items.length>2&&<small>还有 {items.length-2} 项</small>}</div>
      </button>;
    })}</div>
    <section className="calendar-details" aria-label="完成事项列表">
      <div className="calendar-details-heading"><h2>{detailTitle}<span>{rows.length} 件事</span></h2>{noteIds.length>0&&<button type="button" className="calendar-show-notes" disabled={showing} onClick={showNotes}><ExternalLink size={12}/>{showing?'正在显示…':'显示相关便签'}</button>}</div>
      {period==='year'&&<div className="calendar-year-chart" aria-label={`${year}年各月完成数量`}>{summary.monthly.map((count,i)=><button type="button" key={i} title={`${i+1}月完成 ${count} 件事`} aria-label={`${i+1}月完成 ${count} 件事，查看该月`} onClick={()=>{selectMonth(new Date(year,i,1));setPeriod('month');}}><span className="calendar-chart-count">{count||''}</span><span className="calendar-chart-track"><i style={{height:`${count/Math.max(1,...summary.monthly)*100}%`}}/></span><span>{i+1}月</span></button>)}</div>}
      {rows.length===0?<p className="calendar-empty">{period==='day'?'这一天':period==='month'?'这个月':'这一年'}还没有完成记录</p>:<ul>{rows.slice(0,limit).map((record,i)=><li key={`${record.noteId}-${record.itemId}-${record.cycle}-${i}`}><Check size={14}/><div><strong>{record.text}</strong><small>{record.project||'未命名便签'}{sources[record.noteId]==='archived'?' · 已归档':!sources[record.noteId]?' · 便签已删除':''}</small></div><time dateTime={new Date(record.completedAt).toISOString()}>{period!=='day'&&<span>{new Date(record.completedAt).toLocaleDateString('zh-CN',{month:'numeric',day:'numeric'})}</span>}{new Date(record.completedAt).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}</time></li>)}</ul>}
      {rows.length>limit&&<button type="button" className="calendar-load-more" onClick={()=>setLimit(limit+40)}>继续查看 · 还有 {rows.length-limit} 件事</button>}
      <p className="calendar-note">按实际完成日期记录。循环重置便签会保留历史，取消勾选会撤回本次完成记录。</p>
    </section>
    {error&&<p className="calendar-error" role="alert">操作未完成：{error}</p>}
  </main>;
}
