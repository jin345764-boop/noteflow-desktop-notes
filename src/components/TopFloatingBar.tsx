import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  LayoutDashboard, 
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GripHorizontal,
  Palette,
  Check,
  MessageSquare,
  MessageSquareOff,
  Trash2
} from 'lucide-react';
import { sound } from '../utils/audio';
import { ThemeId } from '../types';
import { DEFAULT_THEME_CONFIGS, loadTopBarPos, saveTopBarPos } from '../utils/themePresets';
import { AppLogo } from './AppLogo';

interface TopFloatingBarProps {
  onQuickAdd: (theme?: ThemeId) => void;
  onResetAndAlign: () => void;
  onToggleVisibility: () => void;
  areNotesVisible: boolean;
  onToggleConsole: () => void;
  isConsoleOpen: boolean;
  lang: 'cn' | 'en';
  onToggleLang: (lang: 'cn' | 'en') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  themeRenames?: Record<string, string>;
  onToggleAllSpeechBubbles?: () => void;
  areAllBubblesHidden?: boolean;
  onOpenRecycleBin?: () => void;
  recycleCount?: number;
  showDesktopScreen?: boolean;
  onToggleDesktopScreen?: () => void;
}

export const TopFloatingBar: React.FC<TopFloatingBarProps> = ({
  onQuickAdd,
  onResetAndAlign,
  onToggleVisibility,
  areNotesVisible,
  onToggleConsole,
  isConsoleOpen,
  lang,
  onToggleLang,
  soundEnabled,
  onToggleSound,
  themeRenames = {},
  onToggleAllSpeechBubbles,
  areAllBubblesHidden = false,
  onOpenRecycleBin,
  recycleCount = 0,
  showDesktopScreen = false,
  onToggleDesktopScreen
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Movable and Collapsible state
  const initialPos = loadTopBarPos();
  const [isCollapsed, setIsCollapsed] = useState(initialPos.isCollapsed);
  const [pos, setPos] = useState({
    x: initialPos.x > 0 ? initialPos.x : Math.max(20, window.innerWidth - 530),
    y: initialPos.y >= 0 ? initialPos.y : 12
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, startX: 0, startY: 0 });

  // Reposition if screen resized
  useEffect(() => {
    const handleResize = () => {
      setPos((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 200),
        y: Math.min(prev.y, window.innerHeight - 50)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save pos when changes
  useEffect(() => {
    saveTopBarPos({ x: pos.x, y: pos.y, isCollapsed });
  }, [pos, isCollapsed]);

  const handlePointerDownDrag = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) return;

    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      startX: pos.x,
      startY: pos.y
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    sound.playClick();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const newX = Math.max(10, Math.min(window.innerWidth - 120, dragStart.current.startX + dx));
    const newY = Math.max(6, Math.min(window.innerHeight - 45, dragStart.current.startY + dy));
    setPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
      sound.playSnap();
    }
  };

  // Click to expand/collapse handling ("收起后自动放在桌面右侧，鼠标点击才会全部出现")
  const handleToggleCollapse = () => {
    sound.playClick();
    setIsCollapsed(!isCollapsed);
  };

  const allThemesList = Object.keys(DEFAULT_THEME_CONFIGS) as ThemeId[];

  // Render Collapsed Tab automatically placed on the desktop right edge
  if (isCollapsed) {
    return (
      <aside
        className="fixed right-0 top-14 z-40 select-none animate-in fade-in slide-in-from-right-3 duration-200"
      >
        <button 
          type="button"
          onClick={() => {
            sound.playClick();
            setIsCollapsed(false);
          }}
          className="flex items-center gap-2 pl-3.5 pr-2.5 py-1.5 rounded-l-full bg-[#090d16]/90 backdrop-blur-2xl border-y border-l border-white/20 text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.55)] hover:scale-105 active:scale-95 transition-all text-xs group cursor-pointer ring-1 ring-white/10"
          title={lang === 'cn' ? '点击展开工作台控制栏' : 'Click to expand workbench bar'}
        >
          <ChevronLeft className="w-3.5 h-3.5 text-indigo-400 group-hover:-translate-x-0.5 transition-transform" />
          <AppLogo size={18} />
          <span className="font-bold text-[11px] tracking-tight">
            {lang === 'cn' ? '阿金便利贴' : 'NoteFlow'}
          </span>
          <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950/70 px-1.5 py-0.2 rounded border border-cyan-400/30">
            15{lang === 'cn' ? '款' : ''}
          </span>
        </button>
      </aside>
    );
  }

  return (
    <aside
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      className="fixed z-40 select-none transition-shadow"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseLeave={() => {
        setShowAddMenu(false);
      }}
    >
      <header
        className={`flex items-center gap-1.5 bg-[#090d16]/90 backdrop-blur-2xl px-2.5 py-1 rounded-full border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.45)] text-white text-xs ${
          isDragging ? 'ring-2 ring-indigo-400 cursor-grabbing' : ''
        }`}
      >
        {/* Drag Handle ("便利贴上面的那一栏可以随意移动") */}
        <div
          className="cursor-grab active:cursor-grabbing p-1 text-white/50 hover:text-white transition-colors"
          onPointerDown={handlePointerDownDrag}
          title={lang === 'cn' ? '按住自由拖拽工作台位置' : 'Drag workbench anywhere'}
        >
          <GripHorizontal className="w-3.5 h-3.5" />
        </div>

        {/* Brand & Mini Status */}
        <div 
          className="flex items-center gap-1.5 pl-0.5 pr-2 border-r border-white/15 cursor-pointer hover:opacity-85 transition-opacity"
          onClick={() => onToggleConsole()}
          title={lang === 'cn' ? '点击打开阿金便签工作台' : 'Click to open workbench'}
        >
          <AppLogo size={18} />
          <span className="font-bold text-[11px] tracking-tight text-white">
            {lang === 'cn' ? '阿金便利贴' : 'NoteFlow'}
          </span>
          
          {/* Shows count only ("不要全部展示主题的名字，写数量就行") */}
          <span 
            onClick={(e) => {
              e.stopPropagation();
              setShowAddMenu(!showAddMenu);
            }}
            className="text-[9px] font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-400/30 hover:bg-cyan-900/60 transition-colors cursor-pointer"
            title={lang === 'cn' ? '共 15 款风格，点击快速选择新建' : '15 Themes total'}
          >
            15 {lang === 'cn' ? '款风格' : 'Themes'}
          </span>
        </div>

        {/* Quick Add Button with Immediate Theme Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowAddMenu(!showAddMenu);
            }}
            className="flex items-center gap-1 px-2.5 py-0.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[11px] rounded-full shadow hover:scale-105 active:scale-95 transition-all font-semibold"
            title={lang === 'cn' ? '点击自由选择 15 款主题新建' : 'New Note (Pick from 15 Themes)'}
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
            <span>{lang === 'cn' ? '新建' : 'New'}</span>
            <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-80" />
          </button>

          {/* 15 Themes Dropdown / Popover (Custom Note #0 at very front) */}
          {showAddMenu && (
            <div 
              className="absolute top-8 left-0 w-56 bg-[#0f172a]/95 backdrop-blur-2xl border border-white/20 rounded-xl p-2 shadow-2xl text-xs z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 max-h-80 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1.5 py-0.5 font-medium border-b border-white/10">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {lang === 'cn' ? '自由选择 15 款主题' : 'Select Theme to Create'}
                </span>
                <span className="font-mono text-[9px] text-indigo-400">15 Total</span>
              </div>

              {allThemesList.map((tId) => {
                const cfg = DEFAULT_THEME_CONFIGS[tId];
                const isCustom = tId === 'custom';
                const name = themeRenames[tId] || (lang === 'en' ? cfg.nameEn : cfg.name);

                return (
                  <button
                    key={tId}
                    type="button"
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors text-[11px] ${
                      isCustom 
                        ? 'bg-purple-950/70 border border-purple-500/50 text-purple-200 hover:bg-purple-900/90 font-bold'
                        : 'hover:bg-white/10 text-slate-200'
                    }`}
                    onClick={() => {
                      sound.playPaper();
                      setShowAddMenu(false);
                      onQuickAdd(tId);
                    }}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" 
                      style={{ backgroundColor: cfg.accentColor }} 
                    />
                    <span className="truncate flex-1">{name}</span>
                    {isCustom && (
                      <span className="text-[9px] bg-purple-500/30 text-purple-300 px-1 py-0.2 rounded font-mono">
                        #0
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 一键收起/展开台词气泡 ("可以一键收起悬浮角色台词气泡，不要一个一个调节") */}
        {onToggleAllSpeechBubbles && (
          <button
            type="button"
            onClick={onToggleAllSpeechBubbles}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
              areAllBubblesHidden 
                ? 'text-amber-300 bg-amber-400/15 border border-amber-400/30' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            title={
              areAllBubblesHidden
                ? (lang === 'cn' ? '一键展开全部角色的台词气泡' : 'Show All Bubbles')
                : (lang === 'cn' ? '一键收起全部角色的台词气泡' : 'Hide All Bubbles')
            }
          >
            {areAllBubblesHidden ? <MessageSquareOff className="w-3 h-3 text-amber-400" /> : <MessageSquare className="w-3 h-3 text-amber-300" />}
            <span>
              {areAllBubblesHidden ? (lang === 'cn' ? '展开气泡' : 'Show Bubbles') : (lang === 'cn' ? '收起气泡' : 'Hide Bubbles')}
            </span>
          </button>
        )}

        {/* 一键同尺寸对齐 (按照屏幕实际物理位置对齐，不把新建的顶到最上面) */}
        <button
          type="button"
          onClick={() => {
            sound.playSnap();
            onResetAndAlign();
          }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          title={lang === 'cn' ? '一键还原标准尺寸，按当前屏幕位置磁吸对齐' : 'Reset Size & Align by Screen Position'}
        >
          <RotateCcw className="w-3 h-3 text-[#4cd7f6]" />
          <span className="hidden md:inline">{lang === 'cn' ? '同尺寸对齐' : 'Align All'}</span>
        </button>

        {/* Toggle Hide/Show */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onToggleVisibility();
          }}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
            areNotesVisible ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-amber-400 bg-amber-400/20'
          }`}
          title={
            areNotesVisible 
              ? (lang === 'cn' ? '隐藏便签' : 'Hide Notes') 
              : (lang === 'cn' ? '显示便签' : 'Show Notes')
          }
        >
          {areNotesVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </button>

        {/* Workbench Toggle */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onToggleConsole();
          }}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
            isConsoleOpen 
              ? 'bg-indigo-600 text-white shadow-xs' 
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
          title={lang === 'cn' ? '打开便签工作台' : 'Console'}
        >
          <LayoutDashboard className="w-3 h-3 text-[#c0c1ff]" />
          <span className="hidden sm:inline">{lang === 'cn' ? '工作台' : 'Console'}</span>
        </button>

        {/* Recycle Bin Button */}
        {onOpenRecycleBin && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenRecycleBin();
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title={lang === 'cn' ? '打开便签回收站' : 'Recycle Bin'}
          >
            <Trash2 className="w-3 h-3 text-rose-400" />
            <span className="hidden lg:inline">{lang === 'cn' ? '回收站' : 'Bin'}</span>
            {recycleCount > 0 && (
              <span className="text-[9px] font-mono bg-rose-500/40 text-rose-200 px-1 rounded-full font-bold">
                {recycleCount}
              </span>
            )}
          </button>
        )}

        {/* Sound */}
        <button
          type="button"
          onClick={() => {
            onToggleSound();
            if (!soundEnabled) {
              setTimeout(() => sound.playChime(), 50);
            }
          }}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
            soundEnabled ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-400'
          }`}
          title={soundEnabled ? (lang === 'cn' ? '音效已开' : 'Sound ON') : (lang === 'cn' ? '静音' : 'Muted')}
        >
          {soundEnabled ? <Volume2 className="w-3 h-3 text-emerald-400" /> : <VolumeX className="w-3 h-3" />}
        </button>

        {/* Language Switcher */}
        <div className="flex items-center bg-white/10 p-0.5 rounded-full border border-white/10 text-[9px] font-semibold ml-0.5">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onToggleLang('cn');
            }}
            className={`px-1.5 py-0.2 rounded-full transition-all ${
              lang === 'cn' ? 'bg-[#6366f1] text-white shadow-xs' : 'text-white/70 hover:text-white'
            }`}
          >
            CN
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onToggleLang('en');
            }}
            className={`px-1.5 py-0.2 rounded-full transition-all ${
              lang === 'en' ? 'bg-[#6366f1] text-white shadow-xs' : 'text-white/70 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>

        {/* Collapse Button ("收起至桌面右侧，不占位置，鼠标点击才会全部出现") */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setIsCollapsed(true);
          }}
          className="flex items-center gap-1 pl-2 pr-1.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 text-[10px] font-medium transition-all ml-1 cursor-pointer"
          title={lang === 'cn' ? '收起并靠右停靠 (鼠标点击展开)' : 'Collapse to right edge (Click to expand)'}
        >
          <span>{lang === 'cn' ? '收起' : 'Hide'}</span>
          <ChevronRight className="w-3 h-3 text-indigo-300" />
        </button>
      </header>
    </aside>
  );
};
