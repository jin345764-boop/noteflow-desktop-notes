export interface CompletionRecord {noteId:string;itemId:string;cycle:number;project:string;text:string;theme:string;completedAt:number}
export type CalendarPeriod = 'day' | 'month' | 'year';

export function dateKey(date:Date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

export function monthCells(year:number,month:number) {
  const first=new Date(year,month,1),offset=(first.getDay()+6)%7;
  return Array.from({length:42},(_,i)=>new Date(year,month,1-offset+i));
}

function completionDate(record:CompletionRecord) {
  const date=new Date(record.completedAt);
  return Number.isFinite(record.completedAt) && Number.isFinite(date.getTime()) ? date : null;
}

export function recordsByDay(records:CompletionRecord[]) {
  const days:Record<string,CompletionRecord[]>={};
  for(const record of records){
    const date=completionDate(record);
    if(date)(days[dateKey(date)]??=[]).push(record);
  }
  return days;
}

export function completionSummary(records:CompletionRecord[],today:Date,year:number,month:number) {
  const monthly=Array<number>(12).fill(0),todayKey=dateKey(today);
  let day=0;
  for(const record of records){
    const date=completionDate(record);
    if(!date)continue;
    if(dateKey(date)===todayKey)day++;
    if(date.getFullYear()===year)monthly[date.getMonth()]++;
  }
  return {day,month:monthly[month],year:monthly.reduce((total,count)=>total+count,0),monthly};
}

export function periodRecords(records:CompletionRecord[],period:CalendarPeriod,selectedDay:string,year:number,month:number) {
  return records.filter(record=>{
    const date=completionDate(record);
    if(!date)return false;
    if(period==='day')return dateKey(date)===selectedDay;
    return date.getFullYear()===year && (period==='year'||date.getMonth()===month);
  }).sort((a,b)=>b.completedAt-a.completedAt);
}
