import React from 'react';
import { 
  Search, 
  Globe, 
  Terminal, 
  Palette, 
  Power, 
  User, 
  StickyNote as StickyNoteIcon
} from 'lucide-react';
import { StickyNote, ThemeId } from '../types';
import { AppLogo } from './AppLogo';
import { sound } from '../utils/audio';

interface StartMenuModalProps {
  onClose: () => void;
  onOpenConsole: () => void;
  onQuickAdd: (theme?: ThemeId) => void;
  notes: StickyNote[];
  onFocusNote: (id: string) => void;
  lang: 'cn' | 'en';
}

export const StartMenuModal: React.FC<StartMenuModalProps> = ({
  onClose,
  onOpenConsole,
  onQuickAdd,
  notes,
  onFocusNote,
  lang
}) => {
  return (
    <div
      className="fixed inset-0 z-50 pointer-events-auto select-none"
      onClick={onClose}
    >
      <div
        className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[540px] max-w-[92vw] bg-[#0f172a]/92 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-6 text-white flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 text-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'cn' ? '搜索阿金便签、应用、设置...' : 'Type here to search...'}
            className="w-full bg-transparent border-none p-0 focus:ring-0 focus:outline-none placeholder:text-slate-400 text-xs"
          />
        </div>

        {/* Pinned Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>{lang === 'cn' ? '已固定应用' : 'Pinned'}</span>
            <button 
              onClick={() => onOpenConsole()}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {lang === 'cn' ? '全部便签工作台' : 'All Stickies'}
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
            {/* 阿金便利贴 App */}
            <div
              onClick={() => {
                sound.playClick();
                onOpenConsole();
                onClose();
              }}
              className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
            >
              <div className="group-hover:scale-105 transition-transform">
                <AppLogo size={40} />
              </div>
              <span className="text-[11px] text-slate-200 truncate w-full text-center font-medium">
                {lang === 'cn' ? '阿金便利贴' : 'NoteFlow'}
              </span>
            </div>

            {/* Quick New Custom Note */}
            <div
              onClick={() => {
                sound.playPaper();
                onQuickAdd('custom');
                onClose();
              }}
              className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow group-hover:scale-105 transition-transform">
                <span className="text-lg">✨</span>
              </div>
              <span className="text-[11px] text-slate-200 truncate w-full text-center">
                {lang === 'cn' ? '自定义便签' : 'Custom'}
              </span>
            </div>

            {/* Quick New Pet Note */}
            <div
              onClick={() => {
                sound.playPaper();
                onQuickAdd('pet');
                onClose();
              }}
              className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white shadow group-hover:scale-105 transition-transform">
                <span className="text-lg">🍊</span>
              </div>
              <span className="text-[11px] text-slate-200 truncate w-full text-center">
                {lang === 'cn' ? '萌宠日记' : 'Pet Care'}
              </span>
            </div>

            {/* Quick Foodie Note */}
            <div
              onClick={() => {
                sound.playPaper();
                onQuickAdd('foodie');
                onClose();
              }}
              className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white shadow group-hover:scale-105 transition-transform">
                <span className="text-lg">🍔</span>
              </div>
              <span className="text-[11px] text-slate-200 truncate w-full text-center">
                {lang === 'cn' ? '美食探店' : 'Foodie'}
              </span>
            </div>

            {/* Terminal */}
            <div
              onClick={() => sound.playClick()}
              className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/20 flex items-center justify-center text-emerald-400 shadow group-hover:scale-105 transition-transform">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-slate-200 truncate w-full text-center">
                {lang === 'cn' ? '黑客终端' : 'Terminal'}
              </span>
            </div>

            {/* Settings */}
            <div
              onClick={() => {
                sound.playClick();
                onOpenConsole();
                onClose();
              }}
              className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-700 border border-white/20 flex items-center justify-center text-slate-200 shadow group-hover:scale-105 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-slate-200 truncate w-full text-center">
                {lang === 'cn' ? '便签工作台' : 'Workbench'}
              </span>
            </div>
          </div>
        </div>

        {/* Recommended Recent Notes */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>{lang === 'cn' ? '活跃桌面便签' : 'Active Stickies'}</span>
            <span className="text-[10px] font-mono">{notes.length} 项</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {notes.slice(0, 4).map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  sound.playClick();
                  onFocusNote(n.id);
                  onClose();
                }}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors border border-white/5"
              >
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <StickyNoteIcon className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-semibold text-white truncate">
                    {n.title}
                  </h5>
                  <p className="text-[10px] text-slate-400 truncate">
                    {n.items.length} {lang === 'cn' ? '项待办' : 'items'} · {n.pinned ? '已置顶' : '吸附中'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Profile & Power */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-2 py-1 rounded-xl hover:bg-white/10 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium">Administrator</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
            title="关闭开始菜单"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
