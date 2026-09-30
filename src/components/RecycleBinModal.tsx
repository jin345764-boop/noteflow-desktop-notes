import React from 'react';
import { Trash2, RotateCcw, X, AlertCircle } from 'lucide-react';
import { StickyNote } from '../types';
import { sound } from '../utils/audio';

interface RecycleBinModalProps {
  recycleNotes: StickyNote[];
  onRestore: (note: StickyNote) => void;
  onPermanentDelete: (id: string) => void;
  onEmptyBin: () => void;
  onClose: () => void;
  lang: 'cn' | 'en';
}

export const RecycleBinModal: React.FC<RecycleBinModalProps> = ({
  recycleNotes,
  onRestore,
  onPermanentDelete,
  onEmptyBin,
  onClose,
  lang
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {lang === 'cn' ? '回收站 · 便签垃圾桶' : 'Recycle Bin'}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                {recycleNotes.length} {lang === 'cn' ? '个已删除的便签卡片' : 'deleted items'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {recycleNotes.length > 0 && (
              <button
                onClick={() => {
                  sound.playTear();
                  onEmptyBin();
                }}
                className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-xs font-semibold border border-red-500/30 transition-all"
              >
                {lang === 'cn' ? '清空回收站' : 'Empty Bin'}
              </button>
            )}
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {recycleNotes.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-center gap-2">
              <Trash2 className="w-10 h-10 stroke-[1.5] text-slate-500/50" />
              <p className="text-sm font-medium">{lang === 'cn' ? '回收站是空的' : 'Recycle bin is empty'}</p>
              <p className="text-xs text-slate-500">
                {lang === 'cn' ? '桌面被删除的便签会暂存此处，随时可恢复' : 'Deleted stickies will appear here'}
              </p>
            </div>
          ) : (
            recycleNotes.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded-xl bg-slate-800/70 border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <h4 className="text-sm font-semibold text-white truncate">
                      {note.title || (lang === 'cn' ? '无标题便签' : 'Untitled Note')}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {note.items.map(i => i.text).join(' · ') || (lang === 'cn' ? '无事项' : 'Empty')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      sound.playPaper();
                      onRestore(note);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-all"
                    title={lang === 'cn' ? '一键恢复到桌面' : 'Restore to desktop'}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{lang === 'cn' ? '恢复' : 'Restore'}</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.playTear();
                      onPermanentDelete(note.id);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                    title={lang === 'cn' ? '彻底删除' : 'Delete permanently'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
