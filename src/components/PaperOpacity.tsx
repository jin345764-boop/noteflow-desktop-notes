import { RefObject, useLayoutEffect } from 'react';
import { StickyNote } from '../types';
import './PaperOpacity.css';

export function PaperSurface(){return <div className="paper-opacity-layer" aria-hidden="true"/>;}

export function usePaperOpacity(ref:RefObject<HTMLElement|null>,opacity:number,identity:string){
  useLayoutEffect(()=>{
    const element=ref.current,layer=element?.querySelector<HTMLElement>(':scope > .paper-opacity-layer');
    if(!element||!layer)return;
    delete element.dataset.paperSurface;
    const style=getComputedStyle(element);
    layer.style.backgroundColor=style.backgroundColor;
    layer.style.backgroundImage=style.backgroundImage;
    layer.style.backgroundSize=style.backgroundSize;
    layer.style.backgroundPosition=style.backgroundPosition;
    layer.style.backgroundRepeat=style.backgroundRepeat;
    layer.style.opacity=String(Math.max(.3,Math.min(1,opacity??1)));
    element.dataset.paperSurface='ready';
  },[ref,opacity,identity]);
}

export function OpacityControl({note,onUpdate}:{note:StickyNote;onUpdate:(note:StickyNote)=>void}){
  const opacity=Math.round((note.opacity??1)*100);
  return <div className="paper-opacity-control"><label>纸张透明度<span>{opacity}%</span><input aria-label="纸张透明度" type="range" min={30} max={100} step={5} value={opacity} onChange={event=>onUpdate({...note,opacity:Number(event.target.value)/100})}/></label><button type="button" onClick={()=>onUpdate({...note,opacity:1})}>恢复 100%</button><small>淡化纸张背景，文字和按钮保持清晰。</small></div>;
}
