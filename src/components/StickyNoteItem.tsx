import React, { useState, useRef, useEffect } from 'react';
import { StickyNote, ThemeId, StickerId, FontSizeId, ChecklistItem } from '../types';
import { DEFAULT_THEME_CONFIGS, MORANDI_NOTE_COLORS } from '../utils/themePresets';
import { sound } from '../utils/audio';
import { NOTE_FONTS } from '../desktopFonts';
import { CrispSticker } from './CrispStickers';
import { 
  Pin, 
  GripVertical,
  Lock,
  Unlock,
  Minus, 
  Maximize2, 
  Palette, 
  CheckCheck, 
  Plus, 
  X, 
  Copy, 
  Check, 
  Sparkles,
  RotateCcw,
  Undo2,
  Edit3,
  MessageSquare,
  MessageSquareOff
} from 'lucide-react';

interface StickyNoteItemProps {
  note: StickyNote;
  index: number;
  allNotes: StickyNote[];
  onUpdate: (updated: StickyNote) => void;
  onDelete: (id: string) => void;
  onBringToFront: (id: string) => void;
  lang?: 'cn' | 'en';
  themeRenames?: Record<string, string>;
  isSelected?: boolean;
  onToggleSelect?: (id: string, e: React.MouseEvent) => void;
  onBatchMoveStart?: (activeId: string) => void;
  onBatchMove?: (dx: number, dy: number, activeId: string) => void;
  onBatchMoveEnd?: () => void;
  desktop?: boolean;
  onNativeDrag?: () => void;
  onNewNote?: () => void;
  onOpenSettings?: () => void;
  settingsOnly?: boolean;
  onCloseSettings?: () => void;
}

export const StickyNoteItem: React.FC<StickyNoteItemProps> = ({
  note,
  allNotes,
  onUpdate,
  onDelete,
  onBringToFront,
  lang = 'cn',
  themeRenames = {},
  isSelected = false,
  onToggleSelect,
  onBatchMoveStart,
  onBatchMove,
  onBatchMoveEnd,
  desktop = false,
  onNativeDrag,
  onNewNote,
  onOpenSettings,
  settingsOnly = false,
  onCloseSettings
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showPalette, setShowPalette] = useState(settingsOnly);
  const [completedEffect, setCompletedEffect] = useState<string | null>(null);
  useEffect(()=>{if(!completedEffect)return; const timer=window.setTimeout(()=>setCompletedEffect(null),700); return ()=>window.clearTimeout(timer);},[completedEffect]);
  const [quickInput, setQuickInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [snapDirection, setSnapDirection] = useState<'horizontal' | 'vertical' | 'both' | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isEditingBubble, setIsEditingBubble] = useState(false);
  const [tempBubbleText, setTempBubbleText] = useState('');

  const cardRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0, noteX: 0, noteY: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const config = DEFAULT_THEME_CONFIGS[note.theme] || DEFAULT_THEME_CONFIGS.pet;
  const displaySticker = ({cat:'cryblob',teddy:'uglypotato',ghost:'brainfog'} as Partial<Record<StickerId,StickerId>>)[note.sticker] || note.sticker;

  // Custom theme colors support
  const hasCustomBg = !!note.customBgColor;
  const customBgStyle = hasCustomBg ? { backgroundColor: note.customBgColor } : {};
  const customTextStyle = note.customTextColor ? { color: note.customTextColor } : {};

  // Dragging logic with Smart Magnetic Snapping
  const handlePointerDownHeader = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.contentEditable === 'true') {
      return;
    }

    onBringToFront(note.id);

    if (e.shiftKey && onToggleSelect) {
      onToggleSelect(note.id, e as unknown as React.MouseEvent);
      return;
    }
    if (desktop && onNativeDrag) {
      if (note.sizeLocked) return;
      onNativeDrag();
      return;
    }

    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      noteX: note.x,
      noteY: note.y
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    sound.playClick();

    if (isSelected && onBatchMoveStart) {
      onBatchMoveStart(note.id);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      
      // Batch drag all selected notes synchronously ("可以选中多个便签自由移动")
      if (isSelected && onBatchMove) {
        onBatchMove(dx, dy, note.id);
        return;
      }

      let targetX = dragStartPos.current.noteX + dx;
      let targetY = dragStartPos.current.noteY + dy;

      // Smart Magnetic Snapping with 24px threshold
      const SNAP_THRESHOLD = 24;
      let snapH = false;
      let snapV = false;

      const otherNotes = allNotes.filter(n => n.id !== note.id && !n.collapsed);
      for (const other of otherNotes) {
        // Horizontal snap (Left-to-Left, Right-to-Right, Left-to-Right, Right-to-Left, Center)
        if (Math.abs(targetX - other.x) < SNAP_THRESHOLD) {
          targetX = other.x;
          snapH = true;
        } else if (Math.abs((targetX + note.width) - (other.x + other.width)) < SNAP_THRESHOLD) {
          targetX = other.x + other.width - note.width;
          snapH = true;
        } else if (Math.abs((targetX + note.width / 2) - (other.x + other.width / 2)) < SNAP_THRESHOLD) {
          targetX = other.x + (other.width - note.width) / 2;
          snapH = true;
        } else if (Math.abs(targetX - (other.x + other.width + 16)) < SNAP_THRESHOLD) {
          // Placed to the right of other note with 16px gap
          targetX = other.x + other.width + 16;
          snapH = true;
        } else if (Math.abs((targetX + note.width + 16) - other.x) < SNAP_THRESHOLD) {
          // Placed to the left of other note with 16px gap
          targetX = other.x - note.width - 16;
          snapH = true;
        }

        // Vertical snap ("移动便签放到下方，便签可以自动和旁边的对齐")
        if (Math.abs(targetY - (other.y + other.height + 16)) < SNAP_THRESHOLD) {
          // Placed directly BELOW other note with standard 16px gap!
          targetY = other.y + other.height + 16;
          snapV = true;
        } else if (Math.abs((targetY + note.height + 16) - other.y) < SNAP_THRESHOLD) {
          // Placed directly ABOVE other note with 16px gap
          targetY = other.y - note.height - 16;
          snapV = true;
        } else if (Math.abs(targetY - other.y) < SNAP_THRESHOLD) {
          // Top aligned side-by-side
          targetY = other.y;
          snapV = true;
        } else if (Math.abs((targetY + note.height) - (other.y + other.height)) < SNAP_THRESHOLD) {
          // Bottom aligned
          targetY = other.y + other.height - note.height;
          snapV = true;
        }
      }

      if (snapH && snapV) setSnapDirection('both');
      else if (snapH) setSnapDirection('horizontal');
      else if (snapV) setSnapDirection('vertical');
      else setSnapDirection(null);

      const newX = Math.max(10, Math.min(window.innerWidth - note.width - 10, targetX));
      const newY = Math.max(10, Math.min(window.innerHeight - (note.collapsed ? 50 : note.height) - 50, targetY));

      onUpdate({ ...note, x: newX, y: newY });
    } else if (isResizing) {
      const dx = (desktop ? e.screenX : e.clientX) - resizeStartPos.current.x;
      const dy = (desktop ? e.screenY : e.clientY) - resizeStartPos.current.y;

      const newWidth = Math.max(220, Math.min(600, resizeStartPos.current.width + dx));
      const newHeight = Math.max(160, Math.min(750, resizeStartPos.current.height + dy));

      onUpdate({ ...note, width: newWidth, height: newHeight });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      if (isSelected && onBatchMoveEnd) {
        onBatchMoveEnd();
      }
      if (snapDirection) {
        sound.playSnap();
      }
      setSnapDirection(null);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
    if (isResizing) {
      setIsResizing(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
  };

  // Resize gripper
  const handlePointerDownResize = (e: React.PointerEvent) => {
    e.stopPropagation();
    onBringToFront(note.id);
    setIsResizing(true);
    resizeStartPos.current = {
      x: desktop ? e.screenX : e.clientX,
      y: desktop ? e.screenY : e.clientY,
      width: note.width,
      height: note.height
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    sound.playClick();
  };

  // Toggle todo item
  const handleToggleItem = (itemId: string) => {
    const updatedItems = note.items.map((it) => {
      if (it.id === itemId) {
        const nextDone = !it.done;
        if (nextDone) { setCompletedEffect(itemId); if (desktop) sound.playCelebrate(); else sound.playPop(); }
        else sound.playUnpop();
        return { ...it, done: nextDone };
      }
      return it;
    });

    const allDone = updatedItems.length > 0 && updatedItems.every(i => i.done);
    if (allDone && !desktop) {
      setTimeout(() => sound.playChime(), 150);
    }

    onUpdate({ ...note, items: updatedItems });
  };

  // Delete single todo item
  const handleDeleteItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTear();
    const updatedItems = note.items.filter((it) => it.id !== itemId);
    onUpdate({ ...note, items: updatedItems });
  };

  // Clear completed
  const handleClearCompleted = () => {
    sound.playTear();
    const updatedItems = note.items.filter((it) => !it.done);
    onUpdate({ ...note, items: updatedItems });
  };

  // Quick add item on enter
  const handleQuickAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && quickInput.trim()) {
      sound.playPaper();
      const newItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        text: quickInput.trim(),
        textEn: quickInput.trim(),
        done: false
      };
      onUpdate({
        ...note,
        items: [...note.items, newItem]
      });
      setQuickInput('');
    }
  };

  // Copy text
  const handleCopyText = (text: string, id: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Reset note to standard uniform size
  const handleResetSize = () => {
    sound.playSnap();
    onUpdate({
      ...note,
      width: desktop ? 260 : 285,
      height: desktop ? 220 : 235
    });
  };

  // Edit item text inline
  const handleStartEditItem = (item: ChecklistItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItemId(item.id);
    setEditingText(lang === 'en' ? (item.textEn || item.text) : item.text);
  };

  const handleSaveItemEdit = (itemId: string) => {
    if (editingText.trim()) {
      sound.playClick();
      const updatedItems = note.items.map(it => 
        it.id === itemId 
          ? { ...it, text: editingText.trim(), textEn: editingText.trim() } 
          : it
      );
      onUpdate({ ...note, items: updatedItems });
    }
    setEditingItemId(null);
  };

  // 一键还原没有划线的状态 (取消所有待办划线)
  const handleRestoreAllStrikethroughs = () => {
    sound.playClick();
    const restoredItems = note.items.map(it => ({ ...it, done: false }));
    onUpdate({ ...note, items: restoredItems });
  };

  // Renamed theme badge support
  const rawThemeName = themeRenames[note.theme] || (lang === 'en' ? config.badgeEn : config.badge);
  const displayTitle = lang === 'en' ? (note.titleEn || note.title) : note.title;
  const displaySubtitle = lang === 'en' ? (note.subtitleEn || note.subtitle) : note.subtitle;
  const speechText = lang === 'en' ? (note.speechBubbleEn || note.speechBubble || config.defaultSpeechEn) : (note.speechBubble || config.defaultSpeech);

  const fontSizeClass = {
    sm: 'text-[11px]',
    base: 'text-[12px]',
    lg: 'text-[14px]'
  }[note.fontSize || 'sm'];

  const totalCount = note.items.length;
  const completedCount = note.items.filter(i => i.done).length;

  const allDone = totalCount > 0 && completedCount === totalCount;
  const previousDone = useRef(allDone);
  const [celebrating, setCelebrating] = useState(false);
  useEffect(() => {
    if (allDone && !previousDone.current) { setCelebrating(true); if (desktop && !settingsOnly) sound.playChime(); }
    previousDone.current = allDone;
  }, [allDone]);
  useEffect(() => {
    if (!celebrating) return;
    const timer = window.setTimeout(() => setCelebrating(false), 2200);
    return () => window.clearTimeout(timer);
  }, [celebrating]);
  const stickerSize = note.collapsed ? 22 : (note.stickerSize || 28);

  const allThemesList = Object.keys(DEFAULT_THEME_CONFIGS) as ThemeId[];

  const allStickers: { id: StickerId; label: string }[] = [
    { id: 'none', label: lang === 'cn' ? '无贴纸' : 'None' },
    { id: 'battery', label: '满格电量' },
    { id: 'snailmail', label: '拖延小蜗' },
    { id: 'riceball', label: '干饭团子' },
    { id: 'bubbletea', label: '续命奶茶' },
    { id: 'cryblob', label: '委屈团子' },
    { id: 'sideeye', label: '斜眼打工人' },
    { id: 'brainfog', label: '脑袋打结' },
    { id: 'uglypotato', label: '丑萌土豆' },
    { id: 'crocodile', label: '知识吞吞鳄' },
    { id: 'deadline', label: '救命DDL' },
    { id: 'relaxword', label: '摸鱼中' },
    { id: 'cheerword', label: '冲鸭' },
    { id: 'biscuit', label: '咬一口饼干' },
    { id: 'flower', label: '🌼 花朵' },
    { id: 'cloud', label: '☁️ 云朵' },
    { id: 'camera', label: '📷 相机' },
    { id: 'planet', label: '🪐 星球' },
    { id: 'envelope', label: '💌 信封' },
    { id: 'ribbon', label: '🏅 奖章' },
    { id: 'stamp', label: '已完成印章' },
    { id: 'pencil', label: '铅笔' },
    { id: 'capybara', label: '🍊 卡皮巴拉' },
    { id: 'toaster', label: '吐司机' },
    { id: 'washi', label: '格纹胶带' },
    { id: 'clip', label: '回形针' },
    { id: 'clock', label: '小闹钟' },
    { id: 'ticket', label: '电影票' },
    { id: 'teapot', label: '茶壶' },
    { id: 'cafe', label: '☕ 咖啡' },
    { id: 'pomodoro', label: '🍅 番茄钟' },
    { id: 'books', label: '📚 书本' },
    { id: 'avocado', label: '🥑 牛油果' },
    { id: 'checkmark', label: '完成打勾' },
    { id: 'burger', label: '🍔 汉堡' },
    { id: 'gamepad', label: '🎮 游戏机' },
    { id: 'apple', label: '苹果' },
    { id: 'bulb', label: '💡 灵感灯' },
    { id: 'headphone', label: '🎧 耳机' },
    { id: 'rocket', label: '🚀 小火箭' },
  ];

  // Calculated z-index: when palette is open, elevate to 9999 so it is never obscured by other notes!
  const computedZIndex = showPalette 
    ? 9999 + note.zIndex 
    : (note.pinned ? 40 + note.zIndex : 20 + note.zIndex);

  return (
    <article
      data-selected={isSelected}
      ref={cardRef}
      data-note-theme={note.theme}
      data-paper={note.theme === 'notebook' || note.theme === 'notebookWarm'}
      style={{
        transform: `translate3d(${note.x}px, ${note.y}px, 0)`,
        width: `${note.width}px`,
        height: note.collapsed ? (desktop ? '32px' : 'auto') : `${note.height}px`,
        zIndex: computedZIndex,
        opacity: note.opacity ?? 0.95,
        borderRadius: `${note.borderRadius ?? 16}px`,
        ...customBgStyle,
        ...customTextStyle,
        ...(desktop ? {fontFamily:NOTE_FONTS.find(font=>font.id===note.fontFamily)?.family} : {})
      }}
      className={`absolute select-none transition-shadow duration-150 ${!hasCustomBg ? config.bgClass : ''} ${!hasCustomBg ? config.borderClass : 'border'} ${!hasCustomBg ? config.textClass : ''} border shadow-[0_12px_32px_rgba(0,0,0,0.32)] hover:shadow-[0_18px_44px_rgba(0,0,0,0.4)] backdrop-blur-md flex flex-col ${
        isDragging ? 'cursor-grabbing scale-[1.02] shadow-[0_24px_48px_rgba(0,0,0,0.5)] ring-2 ring-indigo-400/60' : ''
      } ${snapDirection ? 'ring-2 ring-cyan-400 shadow-[0_0_24px_rgba(6,182,212,0.5)]' : ''} ${
        isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent shadow-[0_0_25px_rgba(6,182,212,0.55)]' : ''
      }`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={() => onBringToFront(note.id)}
    >
      {/* Snap Magnetic Guide line visual indicator */}
      {snapDirection && (
        <div className="absolute -inset-1 rounded-2xl border-2 border-cyan-400 pointer-events-none animate-pulse">
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] bg-cyan-600 text-white font-mono px-2 py-0.2 rounded-full shadow">
            {lang === 'cn' ? '🧲 磁吸对齐' : '🧲 Snapped'}
          </span>
        </div>
      )}

      {/* Crisp Vector Mascot Sticker Attachment */}
      {note.sticker !== 'none' && !desktop && (
        <div className="absolute -top-10 right-3 z-30 transform hover:rotate-6 transition-transform">
          <CrispSticker sticker={displaySticker} size={54} />
          {speechText && !note.hideSpeechBubble && (
            isEditingBubble ? (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute -top-5 right-8 bg-white text-slate-900 text-[10px] font-medium px-2 py-0.5 rounded-full shadow-lg border-2 border-indigo-400 z-50 flex items-center gap-1"
              >
                <input
                  type="text"
                  value={tempBubbleText}
                  autoFocus
                  onChange={(e) => setTempBubbleText(e.target.value)}
                  onBlur={() => {
                    setIsEditingBubble(false);
                    if (tempBubbleText.trim()) {
                      onUpdate({
                        ...note,
                        speechBubble: tempBubbleText.trim(),
                        speechBubbleEn: tempBubbleText.trim()
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingBubble(false);
                      if (tempBubbleText.trim()) {
                        onUpdate({
                          ...note,
                          speechBubble: tempBubbleText.trim(),
                          speechBubbleEn: tempBubbleText.trim()
                        });
                      }
                    } else if (e.key === 'Escape') {
                      setIsEditingBubble(false);
                    }
                  }}
                  className="w-28 text-[10px] px-1 py-0.5 rounded bg-slate-50 border border-slate-300 focus:outline-none text-slate-900 font-medium"
                  placeholder={lang === 'cn' ? '输入自定义台词...' : 'Enter dialog...'}
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingBubble(false);
                    if (tempBubbleText.trim()) {
                      onUpdate({
                        ...note,
                        speechBubble: tempBubbleText.trim(),
                        speechBubbleEn: tempBubbleText.trim()
                      });
                    }
                  }}
                  className="p-0.5 text-emerald-600 hover:text-emerald-700"
                  title={lang === 'cn' ? '保存台词' : 'Save'}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            ) : (
              <div 
                className="group/bubble absolute -top-4 right-10 bg-white/95 text-slate-800 text-[9px] font-medium px-2.5 py-0.5 rounded-full shadow-md border border-slate-200/90 whitespace-nowrap animate-bounce duration-1000 flex items-center gap-1.5 cursor-pointer pointer-events-auto hover:bg-white hover:border-indigo-400 transition-all z-30"
                title={lang === 'cn' ? '点击修改台词文字，右侧按钮可收起' : 'Click to edit dialogue'}
                onClick={(e) => {
                  e.stopPropagation();
                  setTempBubbleText(speechText || '');
                  setIsEditingBubble(true);
                }}
              >
                <span className="cursor-text hover:text-indigo-600 transition-colors">
                  {speechText}
                </span>
                <Edit3 className="w-2.5 h-2.5 opacity-40 group-hover/bubble:opacity-100 hover:text-indigo-600 transition-opacity" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    onUpdate({ ...note, hideSpeechBubble: true });
                  }}
                  className="w-3 h-3 flex items-center justify-center rounded-full hover:bg-black/10 text-slate-400 hover:text-red-500 transition-colors ml-0.5"
                  title={lang === 'cn' ? '收起此气泡' : 'Hide bubble'}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* Washi Tape Accents */}
      {(note.washiTape || config.hasTape) && !desktop && (
        <div className="absolute -top-2 left-6 w-20 h-4 washi-pattern-pink -rotate-2 rounded-xs shadow-xs flex items-center justify-center border-t border-b border-pink-300/40 z-20 pointer-events-none">
          <span className="text-[8px] text-[#9d174d] tracking-widest uppercase font-bold font-mono">
            {lang === 'cn' ? '★ 手帐 ★' : '★ DECO ★'}
          </span>
        </div>
      )}

      {/* Header Bar (Draggable Handle) */}
      <header
        className="flex items-center justify-between px-3.5 pt-2.5 pb-2 border-b border-black/5 cursor-grab active:cursor-grabbing shrink-0"
        onPointerDown={handlePointerDownHeader}
        style={desktop && !note.collapsed && note.sticker !== 'none' ? {height: stickerSize + 8} : undefined}
      >
        {/* Left: Multi-select Checkbox & Category Indicator */}
        <div className="flex items-center gap-1.5 min-w-0">
          {desktop && <span title="拖动便签；Shift 点击多选，再拖动一起移动" className="shrink-0 cursor-grab"><GripVertical className="w-3 h-4" /></span>}
          {desktop && note.sticker !== 'none' && <button type="button" className={`note-sticker-button shrink-0 ${celebrating ? 'sticker-celebrate' : ''}`} aria-label={lang === 'cn' ? '展开或收起贴纸台词' : 'Toggle sticker message'} aria-expanded={!note.hideSpeechBubble} title={`${completedCount}/${totalCount} 已完成 · 点击展开或收起台词`} style={{width:stickerSize,height:stickerSize,background:totalCount ? `conic-gradient(#79a581 ${completedCount / totalCount * 100}%, #8799ab25 0)` : undefined}} onClick={() => onUpdate({...note,hideSpeechBubble:!note.hideSpeechBubble})}><CrispSticker sticker={displaySticker} size={stickerSize - 3} /></button>}
          {onToggleSelect && !desktop && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect(note.id, e);
              }}
              className={`w-4 h-4 rounded flex items-center justify-center transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-cyan-500 text-white shadow-xs ring-1 ring-cyan-400' 
                  : 'bg-black/10 hover:bg-black/20 text-transparent hover:text-black/40 border border-black/10'
              }`}
              title={
                isSelected 
                  ? (lang === 'cn' ? '取消选中 (多选移动)' : 'Deselect for multi-move') 
                  : (lang === 'cn' ? '选中此便签进行多选移动' : 'Select for multi-move')
              }
            >
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </button>
          )}

          <span
            className="w-2 h-2 rounded-full shrink-0 shadow-xs"
            style={{ backgroundColor: note.customAccentColor || config.dotColor }}
          />
          {desktop ? <input aria-label="便签名称" title="直接修改便签名称，例如：日常生活"
            value={note.headerName ?? rawThemeName}
            onChange={e => onUpdate({ ...note, headerName: e.target.value })}
            className="min-w-0 w-full bg-transparent text-[10px] font-bold focus:outline-none focus:border-b focus:border-current" /> :
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider truncate opacity-85">{rawThemeName}</span>}
          {totalCount > 0 && !note.collapsed && !desktop && (
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-black/5 font-mono opacity-70">
              {completedCount}/{totalCount}
            </span>
          )}
        </div>

        {/* Right: Window Controls */}
        <div className="flex items-center gap-0.5 opacity-80 hover:opacity-100 transition-opacity">
          {desktop && <button type="button" title="重新开始：保留文字，将全部任务设为未完成" aria-label="重新开始便签" className="w-5 h-5 rounded hover:bg-black/10 flex items-center justify-center" disabled={completedCount === 0} onClick={handleRestoreAllStrikethroughs}><RotateCcw className="w-3 h-3" /></button>}
          {onNewNote && !desktop && <button type="button" title="新建独立便签" onClick={onNewNote}
            className="w-5 h-5 rounded hover:bg-black/10 flex items-center justify-center"><Plus className="w-3 h-3" /></button>}
          {/* Style / Palette Settings */}
          <button
            type="button"
            className="w-5 h-5 rounded hover:bg-black/10 flex items-center justify-center transition-colors"
            title={lang === 'cn' ? '定制主题、莫兰蒂色系与贴纸' : 'Style & Morandi Colors'}
            onClick={(e) => {
              e.stopPropagation();
              onBringToFront(note.id);
              sound.playClick();
              if (onOpenSettings) onOpenSettings();
              else setShowPalette(!showPalette);
            }}
          >
            <Palette className="w-3 h-3" />
          </button>

          {/* Reset size to uniform 285x235 ("每个便签可以一键复位") */}
          {!desktop && <button
            type="button"
            className="w-5 h-5 rounded hover:bg-black/10 flex items-center justify-center transition-colors"
            title={lang === 'cn' ? '一键复位便签 (还原标准尺寸与状态)' : 'Reset Note Standard Size & State'}
            onClick={(e) => {
              e.stopPropagation();
              handleResetSize();
            }}
          >
            <RotateCcw className="w-2.5 h-2.5" />
          </button>}

          {/* 一键还原未划线状态 (全部设为未完成) ("完成了之后有划线，可以一键还原没有划钱的状态") */}
          {completedCount > 0 && !desktop && (
            <button
              type="button"
              className="w-5 h-5 rounded hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-colors"
              title={lang === 'cn' ? '一键还原未划线状态 (全部设为未完成)' : 'Restore All Unchecked'}
              onClick={(e) => {
                e.stopPropagation();
                handleRestoreAllStrikethroughs();
              }}
            >
              <Undo2 className="w-2.5 h-2.5" />
            </button>
          )}

          {/* Pin Toggle */}
          {!desktop && <button
            type="button"
            className={`w-5 h-5 rounded hover:bg-black/10 flex items-center justify-center transition-colors ${
              note.pinned ? 'text-amber-500 font-bold' : ''
            }`}
            title={note.pinned ? (lang === 'cn' ? '取消置顶' : 'Unpin') : (lang === 'cn' ? '常驻置顶' : 'Pin to top')}
            onClick={(e) => {
              e.stopPropagation();
              sound.playPin();
              onUpdate({ ...note, pinned: !note.pinned });
            }}
          >
            <Pin className={`w-3 h-3 ${note.pinned ? 'fill-current' : ''}`} />
          </button>}
          {desktop && <button type="button" title={note.sizeLocked ? '解锁位置和尺寸' : '锁定位置和尺寸'}
            className="w-5 h-5 rounded hover:bg-black/10 flex items-center justify-center"
            onClick={() => onUpdate({...note,sizeLocked:!note.sizeLocked})}>{note.sizeLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}</button>}

          {/* Fold / Unfold */}
          <button
            type="button"
            className="w-5 h-5 rounded hover:bg-black/10 flex items-center justify-center transition-colors"
            title={note.collapsed ? (lang === 'cn' ? '展开便签' : 'Expand') : (lang === 'cn' ? '折叠为胶囊 (不挡视野)' : 'Fold to pill')}
            disabled={desktop && note.sizeLocked}
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              onUpdate({ ...note, collapsed: !note.collapsed });
            }}
          >
            {note.collapsed ? <Maximize2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          </button>

          {/* Clear Done */}
          {completedCount > 0 && !note.collapsed && !desktop && (
            <button
              type="button"
              className="w-5 h-5 rounded hover:bg-black/10 flex items-center justify-center transition-colors"
              title={lang === 'cn' ? '清除已完成项' : 'Clear completed'}
              onClick={(e) => {
                e.stopPropagation();
                handleClearCompleted();
              }}
            >
              <CheckCheck className="w-3 h-3" />
            </button>
          )}

          {/* Delete / Close Note */}
          <button
            type="button"
            className="w-5 h-5 rounded hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
            title={lang === 'cn' ? '关闭并放入回收站' : 'Close to recycle bin'}
            onClick={(e) => {
              e.stopPropagation();
              sound.playTear();
              onDelete(note.id);
            }}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </header>
      {desktop && !note.collapsed && speechText && !note.hideSpeechBubble && <button type="button" className="desktop-speech" title={speechText} onClick={() => onOpenSettings?.()}>{speechText}</button>}

      {/* Style & Customization Popup Menu (Z-INDEX: 10000 to prevent occlusion) */}
      {showPalette && (!note.collapsed || settingsOnly) && (
        <aside 
          className="absolute top-10 right-2 z-[10000] w-76 bg-slate-900/98 backdrop-blur-2xl border border-white/25 rounded-2xl p-3.5 shadow-2xl text-white text-xs flex flex-col gap-2.5 animate-in fade-in zoom-in-95 max-h-[82vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10 font-bold">
            <span className="flex items-center gap-1.5 text-slate-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'cn' ? '定制主题、莫兰蒂色与贴纸' : 'Style, Morandi Colors & Stickers'}
            </span>
            <button
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
              onClick={() => onCloseSettings ? onCloseSettings() : setShowPalette(false)}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Morandi & Custom Colors (莫兰蒂绿色、灰色、黑色、橙色等多色可选) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium">
              <span>{lang === 'cn' ? '🎨 莫兰蒂高雅色系 (绿/灰/黑/橙等)' : '🎨 Morandi Color Palette'}</span>
              <label 
                className="relative inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-[9px] shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer ring-1 ring-white/30"
                title={lang === 'cn' ? '点击全彩调色盘自由选色' : 'Pick any color'}
              >
                <Palette className="w-2.5 h-2.5" />
                <span>{lang === 'cn' ? '调色盘' : 'Palette'}</span>
                <span className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: note.customBgColor || '#9caf88' }} />
                <input
                  type="color"
                  value={note.customBgColor || '#9caf88'}
                  onChange={(e) => {
                    const color = e.target.value;
                    onUpdate({
                      ...note,
                      customBgColor: color,
                      customTextColor: '#ffffff'
                    });
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </label>
            </div>
            
            <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto pr-1">
              {MORANDI_NOTE_COLORS.map((col) => {
                const isSelected = note.customBgColor === col.bg;
                return (
                  <button
                    key={col.bg}
                    type="button"
                    style={{ backgroundColor: col.bg, color: col.text }}
                    className={`h-7 px-1 rounded-lg text-[9px] font-bold border transition-all flex items-center justify-center truncate ${
                      isSelected ? 'ring-2 ring-white border-white scale-105 shadow' : 'border-black/20 hover:scale-102'
                    }`}
                    onClick={() => {
                      sound.playClick();
                      onUpdate({
                        ...note,
                        customBgColor: col.bg,
                        customTextColor: col.text,
                        customAccentColor: col.accent
                      });
                    }}
                    title={lang === 'cn' ? col.name : col.nameEn}
                  >
                    {lang === 'cn' ? col.name : col.nameEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 15 Themes Selector (Custom #0 at front) */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-300 font-medium">
              {lang === 'cn' ? `场景预设主题风格 (${allThemesList.length}款)` : `${allThemesList.length} Scene Themes`}
            </span>
            <div className="grid grid-cols-3 gap-1 max-h-28 overflow-y-auto pr-1">
              {allThemesList.map((tId) => {
                const cfg = DEFAULT_THEME_CONFIGS[tId];
                const active = note.theme === tId;
                const name = themeRenames[tId] || (lang === 'en' ? cfg.nameEn.split(' ')[0] : cfg.name.substring(0, 5));
                return (
                  <button
                    key={tId}
                    type="button"
                    className={`h-6 px-1 rounded text-[9px] font-semibold flex items-center justify-center border transition-all truncate ${
                      active ? 'ring-2 ring-white border-white scale-105 font-bold' : 'border-white/10 opacity-75 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: cfg.accentColor, color: '#fff' }}
                    onClick={() => {
                      sound.playClick();
                      onUpdate({ 
                        ...note, 
                        theme: tId,
                        customBgColor: undefined,
                        customTextColor: undefined,
                        sticker: note.sticker === 'none' ? cfg.defaultSticker : note.sticker,
                        speechBubble: lang === 'en' ? cfg.defaultSpeechEn : cfg.defaultSpeech
                      });
                    }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticker choices */}
          <div className="sticker-settings flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px] text-slate-300 font-medium">
              <span>{lang === 'cn' ? `🐾 ${allStickers.length - 1} 款高清贴纸` : `🐾 ${allStickers.length - 1} Crisp Stickers`}</span>
              <span className="text-[9px] text-indigo-400 font-mono">{allStickers.length - 1} Total</span>
            </div>
            <label className="flex items-center justify-between text-[10px] text-slate-300">{lang === 'cn' ? '贴纸大小' : 'Sticker size'}<select aria-label="贴纸大小" className="bg-slate-800 rounded px-2 py-1" value={note.stickerSize || 28} onChange={e => onUpdate({...note,stickerSize:Number(e.target.value)})}><option value={22}>小巧</option><option value={28}>标准</option><option value={36}>醒目</option></select></label>
            <div className="sticker-options grid grid-cols-4 gap-1 max-h-36 overflow-y-auto pr-1">
              {allStickers.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  className={`py-1 px-1 rounded text-[8.5px] border transition-all truncate text-center ${
                    displaySticker === st.id
                      ? 'bg-indigo-600 text-white border-indigo-400 font-bold scale-102'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/15'
                  }`}
                  onClick={() => {
                    sound.playClick();
                    onUpdate({ ...note, sticker: st.id });
                  }}
                >
                  <span className="flex flex-col items-center gap-1"><CrispSticker sticker={st.id} size={28} />{st.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Speech Bubble Display Toggle & Custom Text Edit ("台词气泡可以自己修改文字") */}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-300 font-medium">
                {lang === 'cn' ? '💬 角色台词气泡' : '💬 Speech Bubble'}
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onUpdate({ ...note, hideSpeechBubble: !note.hideSpeechBubble });
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                  !note.hideSpeechBubble 
                    ? 'bg-emerald-600/80 text-white border-emerald-400' 
                    : 'bg-white/10 text-slate-300 border-white/15'
                }`}
              >
                {!note.hideSpeechBubble ? (lang === 'cn' ? '已显示' : 'Shown') : (lang === 'cn' ? '已隐藏' : 'Hidden')}
              </button>
            </div>
            {!note.hideSpeechBubble && (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={note.speechBubble || ''}
                  placeholder={lang === 'cn' ? '输入自定义台词内容...' : 'Custom dialog...'}
                  onChange={(e) => {
                    onUpdate({
                      ...note,
                      speechBubble: e.target.value,
                      speechBubbleEn: e.target.value
                    });
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-[10px] text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                />
              </div>
            )}
          </div>
        </aside>
      )}

      {desktop && !note.collapsed && allDone && <div className="completion-stamp paw-stamp" aria-label="猫爪已完成印章"><svg viewBox="0 0 120 110" fill="none"><ellipse cx="20" cy="39" rx="13" ry="18" transform="rotate(-25 20 39)" fill="#dfa8b9"/><ellipse cx="45" cy="22" rx="13" ry="18" transform="rotate(-8 45 22)" fill="#dfa8b9"/><ellipse cx="76" cy="22" rx="13" ry="18" transform="rotate(8 76 22)" fill="#dfa8b9"/><ellipse cx="101" cy="39" rx="13" ry="18" transform="rotate(25 101 39)" fill="#dfa8b9"/><path d="M31 62Q59 29 89 62Q114 97 86 102Q74 106 60 100Q46 106 34 102Q7 97 31 62" fill="#f2cbd6" stroke="#ba7f95" strokeWidth="2"/><text x="60" y="83" textAnchor="middle" fill="#9c5c75" fontSize="19" fontFamily="sans-serif" fontWeight="bold">已完成</text><path d="M38 90H83" stroke="#ba7f95" strokeWidth="2" strokeDasharray="2 3"/></svg></div>}
      {desktop && celebrating && <div className="note-confetti" aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i} style={{left:`${(i*37)%100}%`,background:['#e9ad9f','#91b8a0','#e5ca7b','#a5b6db'][i%4],animationDelay:`${i%6*.07}s`,transform:`rotate(${i*31}deg)`}} />)}</div>}
      {desktop && !note.collapsed && totalCount > 0 && <div className="note-completion"><div className="note-progress-label" role="status"><span>{allDone ? (lang === 'cn' ? '已完成 ✓' : 'Completed ✓') : (lang === 'cn' ? '任务进度' : 'Progress')}</span><span>{completedCount}/{totalCount}</span></div><div className="note-progress-track" role="progressbar" aria-label="便签任务进度" aria-valuemin={0} aria-valuemax={totalCount} aria-valuenow={completedCount}><i style={{width:`${completedCount/totalCount*100}%`,backgroundColor:note.customAccentColor || config.accentColor}} /></div></div>}

      {/* Main Content Area */}
      {!note.collapsed && (
        <div className={`flex-1 flex flex-col p-3 overflow-hidden min-h-0 ${desktop ? 'compact-note-content' : ''}`}>
          {/* Note Title & Subtitle + Restore strikethrough action */}
          <div className="mb-2 shrink-0 flex items-center justify-between gap-1">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={displayTitle}
                style={desktop ? {fontSize:note.titleFontSize ?? 14} : undefined}
                onChange={(e) => {
                  onUpdate({
                    ...note,
                    title: e.target.value,
                    titleEn: lang === 'en' ? e.target.value : note.titleEn
                  });
                }}
                className="w-full bg-transparent font-bold text-sm leading-tight border-b border-transparent hover:border-black/10 focus:border-indigo-400 focus:outline-none truncate"
                placeholder={lang === 'cn' ? '便签标题...' : 'Note title...'}
              />
              {displaySubtitle && !desktop && (
                <p className="text-[10px] opacity-65 truncate mt-0.5">
                  {displaySubtitle}
                </p>
              )}
            </div>

            {/* 一键还原未划线状态按钮 ("完成了之后有划线，可以一键还原没有划钱的状态") */}
            {completedCount > 0 && !desktop && (
              <button
                type="button"
                onClick={handleRestoreAllStrikethroughs}
                className="shrink-0 flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold transition-colors cursor-pointer shadow-2xs"
                title={lang === 'cn' ? '一键清除全部划线，还原为未完成状态' : 'Restore All Unchecked'}
              >
                <Undo2 className="w-2.5 h-2.5" />
                <span>{lang === 'cn' ? '还原未划线' : 'Uncheck All'}</span>
              </button>
            )}
          </div>

          {/* Checklist items scroll container ("便签上的文字可以修改，现在不能修改，只能删除") */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 min-h-[50px]">
            {note.items.map((item) => {
              const itemText = lang === 'en' ? (item.textEn || item.text) : item.text;
              const isEditing = editingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`group flex items-start justify-between gap-1.5 py-0.5 rounded hover:bg-black/5 px-1 transition-colors ${completedEffect === item.id ? 'task-completed-effect' : ''}`}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        autoFocus
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveItemEdit(item.id);
                          if (e.key === 'Escape') setEditingItemId(null);
                        }}
                        onBlur={() => handleSaveItemEdit(item.id)}
                        className="flex-1 bg-white/95 text-slate-900 border border-indigo-500 rounded px-1.5 py-0.5 text-xs font-medium focus:outline-none ring-1 ring-indigo-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveItemEdit(item.id)}
                        className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 shrink-0"
                        title={lang === 'cn' ? '保存修改' : 'Save'}
                      >
                        <Check className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => handleToggleItem(item.id)}
                        className="mt-0.5 w-3.5 h-3.5 rounded text-indigo-600 focus:ring-0 cursor-pointer accent-indigo-600 shrink-0"
                      />
                      <span
                        onClick={(e) => handleStartEditItem(item, e)}
                        style={desktop && note.bodyFontSize ? {fontSize:note.bodyFontSize} : undefined}
                        className={`${fontSizeClass} leading-tight break-all cursor-text flex-1 select-text ${
                          item.done ? 'line-through opacity-50' : 'opacity-90 font-medium'
                        } hover:opacity-100 hover:text-indigo-900 transition-colors`}
                        title={lang === 'cn' ? '点击可直接修改此项文字' : 'Click to edit text'}
                      >
                        {itemText}
                      </span>
                    </div>
                  )}

                  {/* Actions: Edit, Copy & Delete */}
                  {!isEditing && (
                    <div className={`flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ${desktop ? 'compact-item-actions' : ''}`}>
                      <button
                        type="button"
                        onClick={(e) => handleStartEditItem(item, e)}
                        className="p-0.5 rounded hover:bg-black/10 text-slate-500 hover:text-indigo-600"
                        title={lang === 'cn' ? '修改文字内容' : 'Edit text'}
                      >
                        <Edit3 className="w-2.5 h-2.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyText(itemText, item.id)}
                        className="p-0.5 rounded hover:bg-black/10 text-slate-500"
                        title={lang === 'cn' ? '复制内容' : 'Copy'}
                      >
                        {copiedId === item.id ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        className="p-0.5 rounded hover:bg-black/10 text-slate-500 hover:text-red-500"
                        title={lang === 'cn' ? '删除此项' : 'Delete'}
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Input Bar */}
          <div className="mt-2 pt-1.5 border-t border-black/5 flex items-center gap-1 shrink-0">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              onKeyDown={handleQuickAdd}
              placeholder={lang === 'cn' ? '+ 按回车添加待办待记...' : '+ Press Enter to add...'}
              className="flex-1 bg-black/5 border border-transparent focus:border-indigo-400 rounded-lg px-2 py-1 text-[11px] focus:outline-none"
            />
            {quickInput.trim() && (
              <button
                type="button"
                onClick={() => {
                  sound.playPaper();
                  const newItem = {
                    id: `item-${Date.now()}`,
                    text: quickInput.trim(),
                    textEn: quickInput.trim(),
                    done: false
                  };
                  onUpdate({ ...note, items: [...note.items, newItem] });
                  setQuickInput('');
                }}
                className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700"
              >
                <Plus className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Resize Handle Gripper */}
      {!note.collapsed && !(desktop && note.sizeLocked) && (
        <div
          onPointerDown={handlePointerDownResize}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 opacity-40 hover:opacity-100"
          title={lang === 'cn' ? '拖拽调整便签大小' : 'Resize note'}
        >
          <div className="w-2 h-2 border-r-2 border-b-2 border-current" />
        </div>
      )}
    </article>
  );
};
