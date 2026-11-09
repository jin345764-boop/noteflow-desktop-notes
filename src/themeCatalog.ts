import { ThemeId } from './types';

export const THEME_ALIASES: Partial<Record<ThemeId, ThemeId>> = { folder:'minimal' };

export const THEME_GROUPS: { id: string; name: string; nameEn: string; description: string; themes: ThemeId[] }[] = [
  { id:'daily', name:'极简日常', nameEn:'Everyday', description:'', themes:['custom','minimal','notebookWarm','romanHoliday','winterPost','lifePlan','code','fluent','finance'] },
  { id:'journal', name:'手账趣味', nameEn:'Journal', description:'', themes:['notebook','work','healing','chatMemo','study','memo','reading','bookRecord','blueprint','colorBlock','drinkTracker','pet','kawaii','home','shopping','foodie','creative','travel','appleGingham','movieTicket','concertTicket','biscuit','traffic','summerTag','pixelCard','station','abstractLab'] },
  { id:'timeline', name:'时间线', nameEn:'Timeline', description:'', themes:[] },
  { id:'weekly', name:'周待办', nameEn:'Weekly', description:'', themes:[] },
  { id:'habit', name:'习惯打卡', nameEn:'Habits', description:'', themes:[] },
];
