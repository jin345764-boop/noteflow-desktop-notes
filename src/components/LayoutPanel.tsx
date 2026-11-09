import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { AlignLeft, AlignRight, AlignVerticalJustifyStart, AlignVerticalJustifyEnd, Columns3, Undo2 } from 'lucide-react';
import './LayoutPanel.css';

type LayoutInfo = {movable:number;locked:number;scope:'selection'|'screen'};
const directions = [
  {id:'left',name:'左对齐',hint:'竖排，左边缘一致',Icon:AlignLeft},
  {id:'right',name:'右对齐',hint:'竖排，右边缘一致',Icon:AlignRight},
  {id:'top',name:'顶部对齐',hint:'横排，上边缘一致',Icon:AlignVerticalJustifyStart},
  {id:'bottom',name:'底部对齐',hint:'横排，下边缘一致',Icon:AlignVerticalJustifyEnd},
];
export function LayoutPanel(){
  const [info,setInfo]=useState<LayoutInfo|null>(null),[columns,setColumns]=useState(2),[error,setError]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
  const refresh=()=>invoke<LayoutInfo>('desktop_layout_info').then(setInfo).catch(e=>setError(String(e)));
  useEffect(()=>{
    refresh();
    const changes=[listen('selection-changed',refresh),listen('notes-changed',refresh)];
    window.addEventListener('focus',refresh);
    return()=>{changes.forEach(change=>change.then(unlisten=>unlisten()));window.removeEventListener('focus',refresh);};
  },[]);
  const arrange=async(mode:string)=>{
    setBusy(true);setError('');setMessage('');
    try{
      const positions=await invoke<{noteId:string;x:number;y:number}[]>('desktop_layout',{mode,columns});
      setMessage('已整理 '+positions.length+' 张便签'+(info?.locked?'，'+info.locked+' 张锁定便签保持原位':''));
      await refresh();
    }catch(e){setError(String(e));}finally{setBusy(false);}
  };
  const undo=async()=>{
    setBusy(true);setError('');setMessage('');
    try{await invoke('desktop_undo_layout');setMessage('已恢复整理前的位置');await refresh();}
    catch(e){setError(String(e));}finally{setBusy(false);}
  };
  const disabled=busy||!info?.movable;
  return <main className="layout-panel-v2">
    <header><h1>整理便签</h1><p>保留原尺寸，选一种排列方式即可。</p></header>
    <section className="layout-scope" aria-label="整理范围">
      <div><span>整理范围</span><b>{info?.scope==='selection'?'当前屏幕的选中便签':'当前屏幕的可见便签'}</b></div>
      <div className="layout-counts"><span><strong>{info?.movable??'—'}</strong> 张可移动</span><span><strong>{info?.locked??'—'}</strong> 张已锁定</span></div>
    </section>
    <section aria-labelledby="layout-direction-heading"><h2 id="layout-direction-heading">对齐方向</h2>
      <div className="layout-direction-grid">{directions.map(({id,name,hint,Icon})=><button key={id} disabled={disabled} title={name+'，'+hint+'，间距 12 像素，点击立即应用'} onClick={()=>arrange(id)}><Icon size={22}/><b>{name}</b><small>{hint}</small></button>)}</div>
      <p className="layout-help">左、右对齐排成一列；顶部、底部对齐排成一行。便签之间留出 12 像素间距。</p>
    </section>
    <details className="layout-columns"><summary><Columns3 size={16}/>便签较多时，分成几列</summary><div><label>列数<select aria-label="排列列数" value={columns} disabled={busy} onChange={e=>setColumns(Number(e.target.value))}>{[2,3,4].map(n=><option key={n} value={n}>{n} 列</option>)}</select></label><button disabled={disabled} onClick={()=>arrange('columns')}>按列整理</button></div></details>
    <footer><p>框选后只整理所选便签。锁定便签保持原位。</p><button disabled={busy} onClick={undo}><Undo2 size={15}/>撤销上次整理</button></footer>
    {message&&<p className="layout-feedback" role="status">{message}</p>}
    {error&&<p className="layout-feedback error" role="alert">{error}</p>}
  </main>;
}

