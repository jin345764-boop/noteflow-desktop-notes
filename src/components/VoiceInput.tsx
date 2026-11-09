import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Mic } from 'lucide-react';
export function VoiceInput({onActivate}:{onActivate:()=>void}){
  const [hint,setHint]=useState(''),[confirm,setConfirm]=useState(false);
  const start=async()=>{setConfirm(false);onActivate();try{await invoke('desktop_dictation');setHint('已打开系统语音输入');}catch(e){setHint(String(e));}window.setTimeout(()=>setHint(''),5000);};
  return <span className="voice-input"><button type="button" aria-label="语音输入" title="系统语音输入（需联网），将文字输入当前光标位置" onMouseDown={e=>e.preventDefault()} onClick={()=>{if(localStorage.getItem('noteflow-system-dictation-consent')==='yes')start();else setConfirm(true);}}><Mic size={13}/></button>{confirm&&<span className="voice-consent"><b>系统语音输入</b><span>使用 Windows 在线听写，需要联网和麦克风。开始后可在系统语音面板停止录音。</span><button onMouseDown={e=>e.preventDefault()} onClick={()=>{localStorage.setItem('noteflow-system-dictation-consent','yes');start();}}>继续</button><button onClick={()=>setConfirm(false)}>取消</button></span>}{hint&&<span role="status" className="voice-hint">{hint}</span>}</span>;
}
