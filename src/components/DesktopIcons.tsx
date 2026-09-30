import React from 'react';
import { Computer, Trash2, Folder } from 'lucide-react';
import { AppLogo } from './AppLogo';
import { sound } from '../utils/audio';

interface DesktopIconsProps {
  onOpenComputer: () => void;
  onOpenRecycleBin: () => void;
  onOpenAssets: () => void;
  onOpenNoteFlow: () => void;
  recycleCount: number;
  lang: 'cn' | 'en';
}

export const DesktopIcons: React.FC<DesktopIconsProps> = ({
  onOpenComputer,
  onOpenRecycleBin,
  onOpenAssets,
  onOpenNoteFlow,
  recycleCount,
  lang
}) => {
  return (
    <aside className="fixed left-5 top-7 z-10 flex flex-col gap-5 w-20 select-none pointer-events-auto">
      {/* This PC */}
      <div
        className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 hover:backdrop-blur-md cursor-pointer transition-all border border-transparent hover:border-white/15"
        onClick={() => {
          sound.playClick();
          onOpenComputer();
        }}
        title={lang === 'cn' ? '此电脑 (系统属性与空间状态)' : 'This PC'}
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/80 to-blue-700/90 shadow-md flex items-center justify-center text-white border border-white/30 group-hover:scale-105 transition-transform">
          <Computer className="w-6 h-6 drop-shadow-sm" />
        </div>
        <span className="text-[11px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] text-center tracking-tight leading-tight">
          {lang === 'cn' ? '此电脑' : 'This PC'}
        </span>
      </div>

      {/* Recycle Bin */}
      <div
        className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 hover:backdrop-blur-md cursor-pointer transition-all border border-transparent hover:border-white/15 relative"
        onClick={() => {
          sound.playClick();
          onOpenRecycleBin();
        }}
        title={lang === 'cn' ? `回收站 (${recycleCount} 项待恢复/已删除便签)` : `Recycle Bin (${recycleCount} items)`}
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-400/80 to-slate-600/90 shadow-md flex items-center justify-center text-white border border-white/30 group-hover:scale-105 transition-transform relative">
          <Trash2 className="w-6 h-6 drop-shadow-sm" />
          {recycleCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md">
              {recycleCount}
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] text-center tracking-tight leading-tight">
          {lang === 'cn' ? '回收站' : 'Recycle Bin'}
        </span>
      </div>

      {/* Design Assets */}
      <div
        className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 hover:backdrop-blur-md cursor-pointer transition-all border border-transparent hover:border-white/15"
        onClick={() => {
          sound.playClick();
          onOpenAssets();
        }}
        title={lang === 'cn' ? '设计资产与 20 款贴纸' : 'Design Assets & 20 Stickers'}
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400/90 to-yellow-600/90 shadow-md flex items-center justify-center text-amber-950 border border-white/30 group-hover:scale-105 transition-transform">
          <Folder className="w-6 h-6 fill-amber-950/20" />
        </div>
        <span className="text-[11px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] text-center tracking-tight leading-tight">
          {lang === 'cn' ? '设计资产' : 'Assets'}
        </span>
      </div>

      {/* 阿金便利贴 (Updated desktop app name and beautiful new icon) */}
      <div
        className="group flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/10 backdrop-blur-md cursor-pointer transition-all border border-indigo-400/40 shadow-sm"
        onClick={() => {
          sound.playClick();
          onOpenNoteFlow();
        }}
        title={lang === 'cn' ? '阿金便利贴 (点击打开工作台/新建便签)' : '阿金便利贴 (NoteFlow)'}
      >
        <div className="group-hover:scale-105 transition-transform">
          <AppLogo size={44} />
        </div>
        <span className="text-[11px] font-semibold text-[#c0c1ff] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] text-center tracking-tight leading-tight">
          {lang === 'cn' ? '阿金便利贴' : '阿金便利贴'}
        </span>
      </div>
    </aside>
  );
};
