import { RefObject, useLayoutEffect } from 'react';
import { StickyNote } from '../types';

export function useTaskFitHeight(ref:RefObject<HTMLElement|null>,note:StickyNote,onUpdate:(note:StickyNote)=>void,enabled=true){
  useLayoutEffect(()=>{
    if(!enabled||note.collapsed||note.sizeLocked||note.isPlainNote)return;
    const root=ref.current,list=root?.querySelector<HTMLElement>('.task-list-scroll');
    if(!root||!list)return;
    const rows=Array.from(list.querySelectorAll<HTMLElement>('.task-row')).slice(0,3);
    if(!rows.length)return;
    const first=rows[0].getBoundingClientRect(),last=rows[rows.length-1].getBoundingClientRect();
    const missing=last.bottom-first.top+4-list.clientHeight;
    const height=Math.min(750,Math.max(280,window.screen.availHeight-32),Math.ceil(Math.max(280,note.height+Math.max(0,missing))));
    if(height>note.height+1)onUpdate({...note,height});
  },[enabled,note.items,note.width,note.height,note.theme,note.bodyFontSize,note.fontSize,note.collapsed,note.sizeLocked]);
}
