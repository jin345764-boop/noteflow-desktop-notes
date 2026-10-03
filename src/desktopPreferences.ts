import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { StickyNote, ThemeId, StickerId } from './types';
import { DEFAULT_THEME_CONFIGS } from './utils/themePresets';
import { sound } from './utils/audio';

const defaults = { lang: 'cn' as 'cn' | 'en', soundEnabled: true, title: '阿金便利贴', themeRenames: {} as Record<string,string> };
export function useDesktopPreferences() {
  const [prefs, setPrefs] = useState(defaults);
  const [error, setError] = useState('');
  useEffect(() => {
    const accept = (value: Partial<typeof defaults>) => setPrefs({ ...defaults, ...value });
    invoke<Partial<typeof defaults>>('desktop_preferences').then(accept).catch(e => setError(String(e)));
    const events = listen<Partial<typeof defaults>>('preferences-changed', e => accept(e.payload));
    return () => { events.then(fn => fn()); };
  }, []);
  useEffect(() => { sound.enabled = prefs.soundEnabled; }, [prefs.soundEnabled]);
  const update = (changes: Partial<typeof defaults>) => invoke('desktop_preferences',{changes}).catch(e => setError(String(e)));
  return { prefs, update, error };
}
export function createThemeNote(theme: ThemeId, prefs: typeof defaults, opacity = .96, radius = 16, hasPet = true,
  custom?: {bgColor:string; textColor:string; accentColor:string; name:string; sticker:StickerId}, playSound = true) {
  const cfg = DEFAULT_THEME_CONFIGS[theme];
  const template: Partial<StickyNote> = {
    theme, category: cfg.category, title: custom?.name || prefs.themeRenames[theme] || (prefs.lang === 'en' ? cfg.nameEn : cfg.name),
    headerName: custom?.name || prefs.themeRenames[theme] || (prefs.lang === 'en' ? cfg.badgeEn : cfg.badge), titleEn: cfg.nameEn,
    subtitle: cfg.description, subtitleEn: cfg.descriptionEn,
    items: cfg.defaultItems.map((item,i) => ({...item,id:`item-${crypto.randomUUID()}-${i}`})),
    sticker: hasPet ? custom?.sticker || cfg.defaultSticker : 'none',
    speechBubble:cfg.defaultSpeech, speechBubbleEn:cfg.defaultSpeechEn, hideSpeechBubble:false,
    washiTape:cfg.hasTape, opacity, borderRadius:radius,
    customBgColor:custom?.bgColor, customTextColor:custom?.textColor, customAccentColor:custom?.accentColor,
  };
  if(theme === 'notebook' || theme === 'notebookWarm') {
    template.fontFamily = theme === 'notebook' ? 'longcang' : 'zhimangxing';
    template.titleFontSize = 18; template.bodyFontSize = 18; template.width = 280; template.height = 280;
  }
  if (playSound) sound.playPaper();
  return invoke('desktop_create',{template});
}
