import React from 'react';
import { X, HardDrive, Cpu, Folder, Sparkles } from 'lucide-react';
import { CrispSticker } from './CrispStickers';
import { sound } from '../utils/audio';
import { StickerId } from '../types';

interface SystemInfoModalProps {
  type: 'computer' | 'assets';
  onClose: () => void;
  lang: 'cn' | 'en';
}

export const SystemInfoModal: React.FC<SystemInfoModalProps> = ({
  type,
  onClose,
  lang
}) => {
  const stickersList: { id: StickerId; nameCn: string; nameEn: string }[] = [
    { id: 'capybara', nameCn: '卡皮巴拉顶橘子', nameEn: 'Capybara Orange' },
    { id: 'cat', nameCn: '萌萌猫咪抱毛线', nameEn: 'Kitten with Yarn' },
    { id: 'duck', nameCn: '呆萌水手大白鹅', nameEn: 'Sailor Duck' },
    { id: 'shiba', nameCn: '招手小柴犬', nameEn: 'Happy Shiba' },
    { id: 'bunny', nameCn: '软萌小兔胡萝卜', nameEn: 'Fluffy Bunny' },
    { id: 'sloth', nameCn: '治愈树懒树枝', nameEn: 'Sleepy Sloth' },
    { id: 'penguin', nameCn: '围巾小企鹅', nameEn: 'Scarf Penguin' },
    { id: 'redpanda', nameCn: '软萌小熊猫', nameEn: 'Red Panda' },
    { id: 'cafe', nameCn: '咖啡与甜甜圈', nameEn: 'Cafe & Donut' },
    { id: 'pomodoro', nameCn: '番茄专注时钟', nameEn: 'Pomodoro Timer' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-slate-900 border border-white/20 rounded-2xl shadow-2xl p-5 text-white flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            {type === 'computer' ? (
              <HardDrive className="w-5 h-5 text-blue-400" />
            ) : (
              <Folder className="w-5 h-5 text-amber-400" />
            )}
            <h3 className="font-bold text-base">
              {type === 'computer' 
                ? (lang === 'cn' ? '此电脑 · 属性与环境' : 'This PC Properties') 
                : (lang === 'cn' ? '设计资产与 10 款高清无锯齿贴纸' : 'Design Assets & 10 Vector Stickers')}
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {type === 'computer' ? (
          <div className="flex flex-col gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">{lang === 'cn' ? '操作系统' : 'Operating System'}</span>
                <span className="font-medium text-white">Windows 64-bit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{lang === 'cn' ? '渲染架构' : 'Rendering Architecture'}</span>
                <span className="font-medium text-sky-400 font-mono">DWM Acrylic + 100% Vector Canvas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{lang === 'cn' ? '抗锯齿引擎' : 'Anti-Aliasing'}</span>
                <span className="font-medium text-emerald-400 font-mono">Sub-pixel Smooth Vector (0 Jagged)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{lang === 'cn' ? '无壁纸纯净模式' : 'Distraction-free'}</span>
                <span className="font-medium text-amber-400 font-mono">True Sticky Focus Engine</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <Cpu className="w-8 h-8 text-indigo-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">
                  {lang === 'cn' ? '极致轻量与零视觉遮挡' : 'Ultra-lightweight & zero distraction'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {lang === 'cn' 
                    ? '便签支持同尺寸对齐、一键折叠为胶囊，不遮挡任何工作视野。' 
                    : 'Notes can fold to slim pills and align uniformly without blocking workspace vision.'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <p>
                {lang === 'cn' 
                  ? '已彻底解决栅格锯齿问题！采用纯净高解析矢量 SVG 绘图，任意缩放边缘光滑细腻：' 
                  : 'Zero jagged edges! High-DPI anti-aliased vector illustrations with smooth curves:'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {stickersList.map(st => (
                <div key={st.id} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-400 transition-colors">
                  <CrispSticker sticker={st.id} size={48} />
                  <span className="text-[10px] text-slate-200 font-medium text-center truncate w-full">
                    {lang === 'en' ? st.nameEn : st.nameCn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
