import { ChecklistItem, StickyNote } from './types';
export const PRIORITIES = [
  {value:1 as const,label:'重要且紧急',short:'紧急重要',color:'#b77067'},
  {value:2 as const,label:'紧急但不重要',short:'紧急',color:'#b49461'},
  {value:3 as const,label:'重要但不紧急',short:'重要',color:'#6e8f8b'},
  {value:4 as const,label:'不重要也不紧急',short:'稍后',color:'#999f9e'},
];
export function orderTasks(items:ChecklistItem[]) {
  return items.map((item,index)=>({item,index})).sort((a,b)=>Number(a.item.done)-Number(b.item.done)||(a.item.priority||5)-(b.item.priority||5)||(a.item.dueAt||Infinity)-(b.item.dueAt||Infinity)||a.index-b.index).map(row=>row.item);
}
export function dayKey(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function weekStart(d:Date){return new Date(d.getFullYear(),d.getMonth(),d.getDate()-(d.getDay()+6)%7);}
export function weekDays(start:Date){return Array.from({length:7},(_,i)=>new Date(start.getFullYear(),start.getMonth(),start.getDate()+i));}
export const PLANNER_STYLES = [
  {id:'clean' as const,name:'白纸极简',background:'#ffffff',color:'#3e4546'},
  {id:'warm' as const,name:'暖砂手写',background:'#faf7ef',color:'#806d58'},
  {id:'blue' as const,name:'蓝调卡片',background:'#edf4f8',color:'#4d6d84'},
  {id:'dark' as const,name:'深色专注',background:'#252b31',color:'#d4dfda'},
];
export const WEEKLY_STYLES = [
  {id:'clean' as const,name:'苹果极简',background:'#ffffff',color:'#33383d'},
  {id:'warm' as const,name:'小票清单',background:'#fffdf7',color:'#575249'},
  {id:'blue' as const,name:'七日看板',background:'#f5f7fa',color:'#3c4856'},
  {id:'dark' as const,name:'商务日程',background:'#ffffff',color:'#35424d'},
  {id:'strip' as const,name:'线圈手账',background:'#faf7ef',color:'#695a49'},
  {id:'sevenDay' as const,name:'索引周卡',background:'#f7f8f4',color:'#485348'},
];
export function plannerStyles(format:StickyNote['format']) {
  return format==='weekly'?WEEKLY_STYLES:PLANNER_STYLES;
}
export function plannerTemplate(format:StickyNote['format'],style:StickyNote['plannerStyle']='clean'):Partial<StickyNote> {
  const names={checklist:'待办清单',timeline:'今日时间线',weekly:'本周待办',habitWeek:'每周小习惯',habitMonth:'每月小习惯'};
  const palette=plannerStyles(format).find(s=>s.id===style)||PLANNER_STYLES[0];
  const weeklyTheme=format==='weekly'&&style==='strip'?'weekStrip':format==='weekly'&&style==='sevenDay'?'fitness':undefined;
  const title=names[format||'checklist'];
  return {format,plannerStyle:palette.id,plannerDate:dayKey(new Date()),title,headerName:title,theme:weeklyTheme||'minimal',category:'work',items:[],width:format==='weekly'&&style==='blue'?600:format==='habitMonth'?340:310,height:format==='timeline'?500:format==='weekly'?460:360,sticker:'none',fontFamily:style==='warm'?(format==='weekly'?'mono':'kai'):'sans',hideSpeechBubble:true,customBgColor:palette.background,customTextColor:palette.color};
}
export function deadlineLabel(ms:number){const d=new Date(ms),now=new Date();return `${dayKey(d)===dayKey(now)?'今天':`${d.getMonth()+1}/${d.getDate()}`} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;}
