import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { ThemeId } from '../types';
import { DEFAULT_THEME_CONFIGS } from '../utils/themePresets';
import { createThemeNote, useDesktopPreferences } from '../desktopPreferences';
import { CrispSticker } from './CrispStickers';

export function ThemeGallery() {
  const { prefs } = useDesktopPreferences();
  const [error, setError] = useState('');
  const [creating, setCreating] = useState<ThemeId | null>(null);
  return <main className="theme-gallery">
    <header><div><h1>{Object.keys(DEFAULT_THEME_CONFIGS).length}款便签主题</h1><p>不同纸张、纹理与排版，挑一款放在桌面。</p></div><button onClick={() => invoke('desktop_close_panel').catch(e => setError(String(e)))}>关闭</button></header>
    {error && <p role="alert">{error}</p>}
    <div className="gallery-grid">{(Object.keys(DEFAULT_THEME_CONFIGS) as ThemeId[]).map(id => {
      const cfg = DEFAULT_THEME_CONFIGS[id];
      return <section className="gallery-card" key={id}>
        <div data-note-theme={id} className={`theme-preview ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`}>
          <header><span>{cfg.badge}</span><CrispSticker sticker={cfg.defaultSticker} size={20} /></header>
          <div className="preview-content"><b>{cfg.name}</b><div className="preview-items">{cfg.defaultItems.slice(0,3).map((item,i) => <div key={i}><span>□</span><span>{item.text}</span></div>)}</div></div>
        </div>
        <h2>{prefs.themeRenames[id] || cfg.name}</h2><p>{cfg.description}</p>
        <button disabled={creating !== null} onClick={async () => {setCreating(id); try {await createThemeNote(id,prefs);} catch(e) {setError(String(e));} finally {setCreating(null);}}}>{creating === id ? '创建中…' : '新建此主题'}</button>
      </section>;
    })}</div>
  </main>;
}
