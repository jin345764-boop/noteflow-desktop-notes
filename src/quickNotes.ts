import { StickyNote } from './types';

export const QUICK_PAPERS = [
  { id:'cream', name:'纯色便笺', color:'#fffdf8', text:'#34383d', accent:'#8a9b8e' },
  { id:'ruled', name:'横线笔记', color:'#f2f6fb', text:'#35465b', accent:'#8aabc5' },
  { id:'index', name:'商务侧签', color:'#ffffff', text:'#303b39', accent:'#6a9482' },
  { id:'kraft', name:'深色备忘', color:'#27292e', text:'#e8e8ec', accent:'#a4bcad' },
  { id:'glass', name:'磨砂玻璃', color:'#ecf2f5', text:'#35424d', accent:'#8a9eae' },
] as const;

// Keep only inert text formatting, including when restoring imported note data.
export function cleanRichText(html:string):string {
  const doc=new DOMParser().parseFromString(html,'text/html');
  const allowed=new Set(['DIV','P','BR','SPAN','B','STRONG','I','EM','U','S','UL','OL','LI','FONT']);
  function clean(parent:Element) {
    for(const el of Array.from(parent.children)) {
      if(['SCRIPT','STYLE','IFRAME','OBJECT','SVG','MATH'].includes(el.tagName)){el.remove();continue;}
      clean(el);
      if(!allowed.has(el.tagName)){el.replaceWith(...Array.from(el.childNodes));continue;}
      const css=el as HTMLElement;
      const style=['font-family','font-size','font-weight','font-style','text-decoration','color','text-align'].map(key=>[key,css.style.getPropertyValue(key)]);
      const color=el.getAttribute('color'); const face=el.getAttribute('face');
      for(const attribute of Array.from(el.attributes))el.removeAttribute(attribute.name);
      for(const [key,value] of style)if(value && !/url\s*\(|expression|var\(/i.test(value))css.style.setProperty(key,value);
      if(color && /^(#[\da-f]{3,8}|[a-z]+)$/i.test(color))css.style.color=color;
      if(face)css.style.fontFamily=face;
    }
  }
  clean(doc.body);return doc.body.innerHTML;
}
export function quickTemplate():Partial<StickyNote> {
  return {isPlainNote:true,paperStyle:'cream',title:'随手记',width:320,height:340,content:'',richContent:'',sticker:'none'};
}
