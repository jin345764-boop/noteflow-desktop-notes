import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Search, 
  Layers, 
  LayoutGrid, 
  FolderOpen, 
  Globe, 
  Terminal, 
  Wifi, 
  Volume2, 
  BatteryMedium, 
  ChevronUp
} from 'lucide-react';
import { sound } from '../utils/audio';
import { AppLogo } from './AppLogo';

interface WindowsTaskbarProps {
  onToggleStartMenu: () => void;
  isStartMenuOpen: boolean;
  onToggleConsole: () => void;
  isConsoleOpen: boolean;
  onToggleShowDesktop: () => void;
  activeStickiesCount: number;
  lang: 'cn' | 'en';
}

export const WindowsTaskbar: React.FC<WindowsTaskbarProps> = ({
  onToggleStartMenu,
  isStartMenuOpen,
  onToggleConsole,
  isConsoleOpen,
  onToggleShowDesktop,
  activeStickiesCount,
  lang
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showWeatherDetail, setShowWeatherDetail] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${mins}`);

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      setDateStr(`${year}/${month}/${day}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-12 z-50 bg-[#090d16]/85 backdrop-blur-2xl border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.35)] flex items-center justify-between px-3 select-none text-white">
      {/* Left: Weather Widget */}
      <div className="flex items-center gap-2 min-w-[140px] relative">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setShowWeatherDetail(!showWeatherDetail);
          }}
          className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors text-xs group"
          title={lang === 'cn' ? '点击查看天气详情' : 'Weather Forecast'}
        >
          <Sun className="w-5 h-5 text-amber-300 animate-spin-slow" />
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[11px] font-medium text-white/90">
              {lang === 'cn' ? '23°C 晴朗' : '23°C Sunny'}
            </span>
            <span className="text-[9px] text-white/50 group-hover:text-white/80">
              {lang === 'cn' ? '空气优 · 深圳' : 'Air Good · SZ'}
            </span>
          </div>
        </button>

        {/* Weather popup */}
        {showWeatherDetail && (
          <div 
            className="absolute bottom-14 left-2 w-64 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 shadow-2xl z-50 text-xs animate-in fade-in slide-in-from-bottom-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-sm text-amber-300">
                {lang === 'cn' ? '深圳 · 今日天气' : 'Today Weather'}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">AQI 28 (Good)</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <Sun className="w-8 h-8 text-amber-400" />
                <span className="text-2xl font-bold font-mono">23°</span>
              </div>
              <div className="text-right text-[11px] text-slate-300">
                <p>{lang === 'cn' ? '西北风 2级' : 'NW Wind Lv.2'}</p>
                <p>{lang === 'cn' ? '湿度 54%' : 'Humidity 54%'}</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              {lang === 'cn' 
                ? '💡 晴空万里，微风宜人，适合开窗通风，放慢节奏记录灵感~' 
                : '💡 Clear skies and pleasant breeze. Perfect time to organize stickies!'}
            </p>
          </div>
        )}
      </div>

      {/* Center: Windows 11 App Icons */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
        {/* Windows Start Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onToggleStartMenu();
          }}
          className={`w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all ${
            isStartMenuOpen ? 'bg-white/15' : ''
          }`}
          title={lang === 'cn' ? '开始菜单' : 'Start Menu'}
        >
          <svg className="w-4.5 h-4.5 text-[#00a4ef] drop-shadow-[0_0_6px_rgba(0,164,239,0.6)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.5 3.5h8.5v8.5H2.5zM13 3.5h8.5v8.5H13zM2.5 14h8.5v8.5H2.5zM13 14h8.5v8.5H13z"></path>
          </svg>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setShowSearchModal(!showSearchModal);
          }}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 active:scale-95 text-white/70 hover:text-white transition-all"
          title={lang === 'cn' ? '搜索' : 'Search'}
        >
          <Search className="w-4.5 h-4.5" />
        </button>

        {/* Task View */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onToggleConsole();
          }}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 active:scale-95 text-white/70 hover:text-white transition-all"
          title={lang === 'cn' ? '任务视图 / 便签工作台' : 'Task View'}
        >
          <Layers className="w-4.5 h-4.5" />
        </button>

        {/* Widgets */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setShowWeatherDetail(!showWeatherDetail);
          }}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 active:scale-95 text-white/70 hover:text-white transition-all"
          title={lang === 'cn' ? '小组件' : 'Widgets'}
        >
          <LayoutGrid className="w-4.5 h-4.5" />
        </button>

        <div className="w-px h-4 bg-white/15 mx-1" />

        {/* File Explorer */}
        <button
          type="button"
          onClick={() => sound.playClick()}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 active:scale-95 text-amber-400 transition-all"
          title={lang === 'cn' ? '文件资源管理器' : 'File Explorer'}
        >
          <FolderOpen className="w-5 h-5 fill-amber-400/20" />
        </button>

        {/* Edge Browser */}
        <button
          type="button"
          onClick={() => sound.playClick()}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 active:scale-95 text-cyan-400 transition-all"
          title="Microsoft Edge"
        >
          <Globe className="w-5 h-5" />
        </button>

        {/* VS Code */}
        <button
          type="button"
          onClick={() => sound.playClick()}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 active:scale-95 text-blue-400 transition-all"
          title="Visual Studio Code"
        >
          <Terminal className="w-5 h-5" />
        </button>

        {/* 阿金便利贴 (Active Highlighted) */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onToggleConsole();
          }}
          className="relative w-9 h-9 rounded-lg bg-indigo-500/25 border border-indigo-400/40 flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
          title={`${lang === 'cn' ? '阿金便利贴' : 'NoteFlow'} (${activeStickiesCount} ${lang === 'cn' ? '张便签运行中' : 'active notes'})`}
        >
          <AppLogo size={22} />
          <span className="absolute -bottom-0.5 left-2.5 right-2.5 h-[2.5px] bg-[#c0c1ff] rounded-full shadow-[0_0_6px_#c0c1ff]" />
        </button>
      </div>

      {/* Right: System Tray & Clock */}
      <div className="flex items-center gap-1 min-w-[140px] justify-end">
        <button
          type="button"
          onClick={() => sound.playClick()}
          className="w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center text-white/70"
          title={lang === 'cn' ? '显示隐藏的图标' : 'Show hidden icons'}
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>

        <div
          onClick={() => sound.playClick()}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/10 cursor-pointer text-white/80 transition-colors"
          title={lang === 'cn' ? '网络 / 音量 / 电池状态' : 'Network / Sound / Battery'}
        >
          <Wifi className="w-3.5 h-3.5" />
          <Volume2 className="w-3.5 h-3.5" />
          <BatteryMedium className="w-3.5 h-3.5" />
        </div>

        {/* Language IME */}
        <div 
          onClick={() => sound.playClick()}
          className="px-1.5 py-0.5 rounded text-[11px] font-mono text-white/90 hover:bg-white/10 cursor-pointer"
        >
          <span>{lang === 'cn' ? '中' : 'ENG'}</span>
        </div>

        {/* Live Clock & Date */}
        <div 
          onClick={() => sound.playClick()}
          className="flex flex-col text-right leading-none px-2 py-1 rounded hover:bg-white/10 cursor-pointer"
        >
          <span className="text-[11px] font-semibold text-white/95 font-mono">
            {timeStr || '12:00'}
          </span>
          <span className="text-[9px] text-white/50 mt-0.5 font-mono">
            {dateStr || '2026/09/29'}
          </span>
        </div>

        {/* Windows 11 "Show Desktop" line at far right */}
        <div
          onClick={() => {
            sound.playSnap();
            onToggleShowDesktop();
          }}
          className="w-1.5 h-7 border-l border-white/20 ml-1 hover:bg-white/30 cursor-pointer transition-colors"
          title={lang === 'cn' ? '显示桌面 / 快速隐藏便签' : 'Show Desktop'}
        />
      </div>
    </footer>
  );
};
