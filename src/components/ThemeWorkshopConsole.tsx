import React, { useState, useRef } from 'react';
import { 
  X, 
  RotateCcw, 
  CheckCheck, 
  Edit2, 
  Sparkles, 
  Check, 
  Palette,
  Circle,
  CheckCircle,
  MessageSquare,
  MessageSquareOff
} from 'lucide-react';
import { StickyNote, ThemeId, StickerId } from '../types';
import { 
  DEFAULT_THEME_CONFIGS, 
  MORANDI_NOTE_COLORS 
} from '../utils/themePresets';
import { sound } from '../utils/audio';
import { CrispSticker } from './CrispStickers';
import { AppLogo } from './AppLogo';

interface ThemeWorkshopConsoleProps {
  onClose: () => void;
  onApplyThemeNewNote: (
    themeId: ThemeId, 
    opacity: number, 
    radius: number, 
    hasPet: boolean, 
    customConfig?: { bgColor: string; textColor: string; accentColor: string; name: string; sticker: StickerId }
  ) => void;
  onResetAndAlignAll: () => void;
  onClearCompletedAll: () => void;
  notes: StickyNote[];
  lang: 'cn' | 'en';
  workbenchTitle: string;
  onUpdateWorkbenchTitle: (title: string) => void;
  themeRenames: Record<string, string>;
  onUpdateThemeName: (themeId: string, name: string) => void;
  onToggleAllSpeechBubbles?: () => void;
  areAllBubblesHidden?: boolean;
}

export const ThemeWorkshopConsole: React.FC<ThemeWorkshopConsoleProps> = ({
  onClose,
  onApplyThemeNewNote,
  onResetAndAlignAll,
  onClearCompletedAll,
  notes,
  lang,
  workbenchTitle,
  onUpdateWorkbenchTitle,
  themeRenames,
  onUpdateThemeName,
  onToggleAllSpeechBubbles,
  areAllBubblesHidden = false
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [globalOpacity] = useState<number>(0.96);
  const [globalRadius] = useState<number>(16);
  const [enablePetWidget] = useState<boolean>(true);

  // Position states
  const [pos, setPos] = useState({ x: Math.max(16, (window.innerWidth - 1080) / 2), y: 36 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // Title editing
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(workbenchTitle);

  // Theme rename state
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [tempThemeName, setTempThemeName] = useState('');

  // Custom Sticky Note builder state (placed at front #0)
  const [customName, setCustomName] = useState('自定义便签');
  const [customBgColor, setCustomBgColor] = useState('#9caf88');
  const [customTextColor, setCustomTextColor] = useState('#1f2e1b');
  const [customAccentColor, setCustomAccentColor] = useState('#4a6741');
  const [customSticker, setCustomSticker] = useState<StickerId>('bulb');

  // Dragging the movable workshop window
  const handlePointerDownHeader = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) return;

    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: pos.x,
      posY: pos.y
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    sound.playClick();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const newX = Math.max(0, Math.min(window.innerWidth - 300, dragStart.current.posX + dx));
    const newY = Math.max(0, Math.min(window.innerHeight - 100, dragStart.current.posY + dy));
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

  // Metrics
  const totalTasks = notes.reduce((acc, note) => acc + note.items.length, 0);
  const completedTasks = notes.reduce((acc, note) => acc + note.items.filter(i => i.done).length, 0);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;
  const pinnedCount = notes.filter(n => n.pinned).length;

  const handleUseTheme = (themeId: ThemeId) => {
    sound.playPaper();
    if (themeId === 'custom') {
      onApplyThemeNewNote('custom', globalOpacity, globalRadius, enablePetWidget, {
        bgColor: customBgColor,
        textColor: customTextColor,
        accentColor: customAccentColor,
        name: customName,
        sticker: customSticker
      });
    } else {
      onApplyThemeNewNote(themeId, globalOpacity, globalRadius, enablePetWidget);
    }
    onClose();
  };

  // Exactly 15 themes (custom + 14 preset styles)
  const allThemeKeys = Object.keys(DEFAULT_THEME_CONFIGS) as ThemeId[];
  const filteredThemes = allThemeKeys.filter((tId) => {
    if (selectedFilter === 'all') return true;
    return DEFAULT_THEME_CONFIGS[tId].category === selectedFilter;
  });

  return (
    <section
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        width: 'min(1100px, 94vw)',
        maxHeight: '88vh'
      }}
      className={`fixed z-50 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-[0_25px_70px_rgba(0,0,0,0.35)] text-slate-800 select-none flex flex-col transition-all duration-200 ${
        isDragging ? 'ring-2 ring-indigo-500/60 shadow-[0_30px_80px_rgba(0,0,0,0.5)]' : ''
      }`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Draggable Header Bar */}
      <header
        className="h-13 px-4 flex items-center justify-between border-b border-slate-200/80 cursor-grab active:cursor-grabbing bg-slate-50/90 rounded-t-2xl shrink-0"
        onPointerDown={handlePointerDownHeader}
      >
        <div className="flex items-center gap-3 min-w-0">
          <AppLogo size={28} />
          
          {/* Editable Workbench Title */}
          {isEditingTitle ? (
            <input
              type="text"
              value={tempTitle}
              autoFocus
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={() => {
                setIsEditingTitle(false);
                if (tempTitle.trim()) onUpdateWorkbenchTitle(tempTitle.trim());
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingTitle(false);
                  if (tempTitle.trim()) onUpdateWorkbenchTitle(tempTitle.trim());
                }
              }}
              className="text-base font-bold text-slate-900 bg-white border border-indigo-400 rounded px-1.5 py-0.5 focus:outline-none"
            />
          ) : (
            <div className="flex items-center gap-1.5 group/title cursor-text" onClick={() => setIsEditingTitle(true)}>
              <span className="font-headline-md text-base font-bold truncate">
                {workbenchTitle}
              </span>
              <button
                type="button"
                className="opacity-0 group-hover/title:opacity-100 opacity-60 hover:opacity-100 p-0.5"
                title={lang === 'cn' ? '点击修改工作台名称' : 'Rename Workbench'}
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Shows count only ("工作台右上角，不要全部展示主题的名字，写数量就行") */}
          <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full font-mono shrink-0 font-bold">
            15 {lang === 'cn' ? '款风格' : 'Themes'}
          </span>
        </div>

        {/* Window Controls - Clean Close Button Only (不收起为小悬浮条) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title={lang === 'cn' ? '关闭工作台' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Quick Filter Bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {[
                { id: 'all', label: lang === 'cn' ? '全部风格 (15款)' : 'All (15 Themes)' },
                { id: 'custom', label: lang === 'cn' ? '✨ 自定义' : 'Custom DIY' },
                { id: 'work', label: lang === 'cn' ? '工作办公' : 'Office' },
                { id: 'pet', label: lang === 'cn' ? '萌宠日记' : 'Pet' },
                { id: 'kawaii', label: lang === 'cn' ? '可爱手帐' : 'Kawaii' },
                { id: 'healing', label: lang === 'cn' ? '松弛治愈' : 'Healing' },
                { id: 'memo', label: lang === 'cn' ? '临时备忘' : 'Memo' },
                { id: 'study', label: lang === 'cn' ? '沉浸学习' : 'Study' },
                { id: 'fitness', label: lang === 'cn' ? '健康健身' : 'Fitness' },
                { id: 'code', label: lang === 'cn' ? '深夜代码' : 'Dev' },
                { id: 'life', label: lang === 'cn' ? '美食创意' : 'Life & Art' },
                { id: 'finance', label: lang === 'cn' ? '理财记账' : 'Finance' },
                { id: 'travel', label: lang === 'cn' ? '旅行漫游' : 'Travel' }
              ].map(pill => (
                <button
                  key={pill.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedFilter(pill.id);
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedFilter === pill.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Quick Batch Actions */}
            <div className="flex items-center gap-2">
              {onToggleAllSpeechBubbles && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleAllSpeechBubbles();
                    sound.playPop();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 border ${
                    areAllBubblesHidden
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                  }`}
                  title={lang === 'cn' ? '一键收起或展开所有便签的角色台词气泡' : 'Toggle all speech bubbles'}
                >
                  {areAllBubblesHidden ? (
                    <MessageSquareOff className="w-3.5 h-3.5 text-amber-600" />
                  ) : (
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>
                    {areAllBubblesHidden
                      ? (lang === 'cn' ? '展开角色气泡' : 'Show Bubbles')
                      : (lang === 'cn' ? '一键收起气泡' : 'Hide Bubbles')}
                  </span>
                </button>
              )}
              <button
                onClick={() => {
                  onClearCompletedAll();
                  sound.playTear();
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>{lang === 'cn' ? '清空已完成' : 'Clear Done'}</span>
              </button>
              <button
                onClick={() => {
                  onResetAndAlignAll();
                  sound.playSnap();
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium transition-all flex items-center gap-1 border border-indigo-200"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                <span>{lang === 'cn' ? '同尺寸对齐' : 'Reset Size & Align'}</span>
              </button>
            </div>
          </div>

          {/* Compact HUD Metric Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500">{lang === 'cn' ? '今日完成率' : 'Completion'}</span>
                <p className="text-xl font-bold font-mono text-slate-900">{completionRate}%</p>
              </div>
              <span className="text-xs text-sky-600 font-mono font-bold">{completedTasks}/{totalTasks}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500">{lang === 'cn' ? '活跃便签' : 'Active'}</span>
                <p className="text-xl font-bold font-mono text-slate-900">{notes.length}</p>
              </div>
              <span className="text-xs text-pink-600 font-mono font-bold">{pinnedCount} {lang === 'cn' ? '置顶' : 'Pinned'}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between col-span-2">
              <div>
                <span className="text-[11px] text-slate-500">{lang === 'cn' ? '智能磁吸对齐与自由配色' : 'Interactive Features'}</span>
                <p className="text-xs text-slate-700 font-medium mt-0.5">
                  {lang === 'cn' ? '移动便签在下方智能磁吸对齐 · 莫兰蒂色系 · 20 款贴纸' : 'Smart magnetic snap · Morandi colors · 20 Stickers'}
                </p>
              </div>
              <span className="text-[10px] text-emerald-600 font-mono bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                15 THEMES
              </span>
            </div>
          </div>

          {/* Grid of 15 Themes (Custom Sticky Note placed at the very front #0) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredThemes.map((tId) => {
              const cfg = DEFAULT_THEME_CONFIGS[tId];
              const isCustomCard = tId === 'custom';
              const customDisplayName = themeRenames[tId] || (lang === 'en' ? cfg.nameEn : cfg.name);

              return (
                <div
                  key={tId}
                  className={`group relative rounded-2xl p-4 flex flex-col justify-between border transition-all ${
                    isCustomCard 
                      ? 'bg-gradient-to-br from-purple-50 via-emerald-50 to-amber-50 border-2 border-emerald-500 shadow-md ring-4 ring-emerald-100'
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  {/* Theme Miniature Preview */}
                  <div
                    style={isCustomCard ? { backgroundColor: customBgColor, color: customTextColor } : {}}
                    className={`relative w-full h-56 rounded-xl p-3.5 flex flex-col justify-between border shadow-2xs overflow-hidden ${
                      !isCustomCard ? `${cfg.bgClass} ${cfg.borderClass} ${cfg.textClass}` : 'border-black/20'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" 
                          style={{ backgroundColor: isCustomCard ? customAccentColor : cfg.dotColor }} 
                        />
                        <span className="text-xs font-bold font-mono tracking-wide truncate">
                          {isCustomCard ? customName : customDisplayName}
                        </span>
                      </div>

                      {/* Sticker */}
                      <div className="scale-75 origin-top-right -mr-1">
                        <CrispSticker sticker={isCustomCard ? customSticker : cfg.defaultSticker} size={42} />
                      </div>
                    </div>

                    {/* Custom Note Interactive Controls (Only inside custom card #0: Morandi colors, green, gray, black, orange...) */}
                    {isCustomCard ? (
                      <div className="flex flex-col gap-2 my-auto z-10 text-xs">
                        {/* Morandi Color Palette */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold opacity-90">
                              {lang === 'cn' ? '莫兰蒂色系 (绿/灰/黑/橙等)：' : 'Morandi Colors:'}
                            </span>
                            {/* Prominent Eye-catching Color Picker Badge ("色盘那里的图标不够明显，需要有特定的符号展示") */}
                            <label 
                              className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white font-bold text-[10px] shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-white/80 group"
                              title={lang === 'cn' ? '🎨 点击打开系统全彩吸管调色盘自由调色' : '🎨 Click to open full-spectrum color palette'}
                            >
                              <Palette className="w-3.5 h-3.5 text-yellow-200 group-hover:rotate-12 transition-transform" />
                              <span className="tracking-tight">{lang === 'cn' ? '🎨 调色盘' : 'Palette'}</span>
                              <span 
                                className="w-3 h-3 rounded-full border-2 border-white shadow-xs shrink-0" 
                                style={{ backgroundColor: customBgColor }} 
                              />
                              <input
                                type="color"
                                value={customBgColor}
                                onChange={(e) => {
                                  setCustomBgColor(e.target.value);
                                  setCustomTextColor('#ffffff');
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                            </label>
                          </div>
                          
                          <div className="flex gap-1.5 flex-wrap">
                            {MORANDI_NOTE_COLORS.slice(0, 10).map((col) => (
                              <button
                                key={col.bg}
                                type="button"
                                style={{ backgroundColor: col.bg }}
                                className={`w-5 h-5 rounded-full border border-black/30 transition-transform ${
                                  customBgColor === col.bg ? 'ring-2 ring-indigo-600 scale-110' : 'hover:scale-105'
                                }`}
                                onClick={() => {
                                  setCustomBgColor(col.bg);
                                  setCustomTextColor(col.text);
                                  setCustomAccentColor(col.accent);
                                }}
                                title={col.name}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium opacity-80">{lang === 'cn' ? '命名：' : 'Name:'}</span>
                          <input
                            type="text"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            className="bg-white/90 border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-800 focus:outline-none flex-1 font-medium"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium opacity-80">{lang === 'cn' ? '贴纸：' : 'Sticker:'}</span>
                          <select
                            value={customSticker}
                            onChange={(e) => setCustomSticker(e.target.value as StickerId)}
                            className="bg-white/90 border border-slate-300 rounded px-1 py-0.5 text-[11px] text-slate-800 focus:outline-none flex-1"
                          >
                            <option value="clown">🤡 搞怪小丑假笑</option>
                            <option value="doge">🐶 魔性狗头斜眼</option>
                            <option value="ghost">👻 搞怪吐舌小幽灵</option>
                            <option value="bulb">💡 灵感灯泡</option>
                            <option value="capybara">🍊 卡皮巴拉</option>
                            <option value="cat">🐱 萌萌小猫</option>
                            <option value="duck">🦆 水手大鸭</option>
                            <option value="shiba">🐕 治愈柴犬</option>
                            <option value="avocado">🥑 活力牛油果</option>
                            <option value="meme">🤪 滑稽表情</option>
                            <option value="burger">🍔 芝士汉堡</option>
                            <option value="gamepad">🎮 游戏手柄</option>
                            <option value="rocket">🚀 冲天火箭</option>
                            <option value="cafe">☕ 咖啡甜点</option>
                            <option value="pomodoro">🍅 番茄闹钟</option>
                            <option value="teddy">🧸 泰迪小熊</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      /* Preset sample items */
                      <div className="flex flex-col gap-1.5 my-auto z-10">
                        {cfg.defaultItems.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            {item.done ? (
                              <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: cfg.accentColor }} />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            )}
                            <span className={`text-[11px] leading-tight line-clamp-1 ${item.done ? 'line-through opacity-60' : 'font-medium'}`}>
                              {lang === 'en' ? item.textEn : item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-black/10 z-10 opacity-75">
                      <span className="truncate">{cfg.keywords.join(' · ')}</span>
                      <span className="font-mono font-bold shrink-0">{cfg.defaultSpeech || 'Ready'}</span>
                    </div>
                  </div>

                  {/* Card Bottom Controls & Theme Renaming */}
                  <div className="flex items-center justify-between mt-3 pt-1">
                    <div className="flex flex-col min-w-0 pr-2 flex-1">
                      {editingThemeId === tId ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={tempThemeName}
                            autoFocus
                            onChange={(e) => setTempThemeName(e.target.value)}
                            onBlur={() => {
                              if (tempThemeName.trim()) {
                                onUpdateThemeName(tId, tempThemeName.trim());
                              }
                              setEditingThemeId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                if (tempThemeName.trim()) {
                                  onUpdateThemeName(tId, tempThemeName.trim());
                                }
                                setEditingThemeId(null);
                              }
                            }}
                            className="text-xs font-bold text-slate-900 border border-indigo-400 rounded px-1.5 py-0.5 w-full"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 group/rename cursor-pointer">
                          <h4 
                            className="font-bold text-sm text-slate-900 truncate"
                            onClick={() => {
                              setEditingThemeId(tId);
                              setTempThemeName(customDisplayName);
                            }}
                          >
                            {customDisplayName}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingThemeId(tId);
                              setTempThemeName(customDisplayName);
                            }}
                            className="opacity-0 group-hover/rename:opacity-100 text-slate-400 hover:text-indigo-600 p-0.5"
                            title={lang === 'cn' ? '点击修改此主题名称' : 'Rename theme'}
                          >
                            <Edit2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {lang === 'en' ? cfg.descriptionEn : cfg.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUseTheme(tId)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow transition-all shrink-0 ${
                        isCustomCard 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {lang === 'cn' ? '立即新建' : 'Create'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    </section>
  );
};
