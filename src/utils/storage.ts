import { StickyNote } from '../types';

const STORAGE_KEY_NOTES = 'noteflow11_stickies_v4';
const STORAGE_KEY_RECYCLE = 'noteflow11_recycle_bin_v4';
const STORAGE_KEY_SOUND = 'noteflow11_sound_enabled_v4';

export const INITIAL_STICKY_NOTES: StickyNote[] = [
  {
    id: 'note-custom-initial',
    title: '自定义便签',
    titleEn: 'Custom DIY Note',
    subtitle: '点击文字可直接修改 · 随心记录',
    subtitleEn: 'Click text to edit · Personal Note',
    theme: 'custom',
    category: 'custom',
    customBgColor: '#9caf88',
    customTextColor: '#1f2e1b',
    customAccentColor: '#4a6741',
    items: [
      { id: 'item-c1', text: '莫兰蒂色系多色可选，自由定制 🎨', textEn: 'Morandi color palette & custom DIY 🎨', done: false },
      { id: 'item-c2', text: '拖拽移动便签自动智能磁吸对齐 🧲', textEn: 'Auto magnetic snap alignment when moved 🧲', done: false },
      { id: 'item-c3', text: '点击文字可直接编辑修改内容 ✏️', textEn: 'Click on text directly to edit & update ✏️', done: false }
    ],
    x: 0,
    y: 0,
    width: 285,
    height: 235,
    zIndex: 10,
    pinned: true,
    collapsed: false,
    opacity: 0.96,
    borderRadius: 16,
    fontSize: 'sm',
    fontFamily: 'sans',
    sticker: 'bulb',
    speechBubble: '自由定制 ✨',
    speechBubbleEn: 'My Style ✨',
    washiTape: true,
    createdAt: '2026-09-29T08:00:00Z'
  },
  {
    id: 'note-pet-initial',
    title: '萌宠治愈日常',
    titleEn: 'Pet Healing Diary',
    subtitle: '点击文字直接修改 · 萌宠相伴',
    subtitleEn: 'Click text to edit · Warm Companion',
    theme: 'pet',
    category: 'pet',
    items: [
      { id: 'item-p1', text: '开一罐三文鱼主食猫条罐罐 🐟', textEn: 'Open a salmon cat food can 🐟', done: false },
      { id: 'item-p2', text: '陶瓷循环饮水机换新鲜温水 💧', textEn: 'Refill drinking fountain with warm water 💧', done: false },
      { id: 'item-p3', text: '傍晚 18:00 摸摸卡皮巴拉的头 🍊', textEn: 'Pet capybara at 18:00 PM 🍊', done: false }
    ],
    x: 0,
    y: 0,
    width: 285,
    height: 235,
    zIndex: 10,
    pinned: false,
    collapsed: false,
    opacity: 0.96,
    borderRadius: 16,
    fontSize: 'sm',
    fontFamily: 'sans',
    sticker: 'capybara',
    speechBubble: '心平气和 🍊',
    speechBubbleEn: 'Stay Calm 🍊',
    hasPetWidget: true,
    createdAt: '2026-09-29T08:30:00Z'
  }
];

export function loadStickyNotes(): StickyNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    if (!raw) return INITIAL_STICKY_NOTES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STICKY_NOTES;
  } catch {
    return INITIAL_STICKY_NOTES;
  }
}

export function saveStickyNotes(notes: StickyNote[]) {
  try {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  } catch {
    // Ignore quota issues
  }
}

export function loadRecycleBin(): StickyNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECYCLE);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveRecycleBin(notes: StickyNote[]) {
  try {
    localStorage.setItem(STORAGE_KEY_RECYCLE, JSON.stringify(notes));
  } catch {
    // Ignore
  }
}

export function loadSoundEnabled(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SOUND);
    return raw !== null ? raw === 'true' : true;
  } catch {
    return true;
  }
}

export function saveSoundEnabled(enabled: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY_SOUND, enabled ? 'true' : 'false');
  } catch {
    // Ignore
  }
}
