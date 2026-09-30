/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StickyNote, ThemeId, StickerId } from './types';
import { 
  loadStickyNotes, 
  saveStickyNotes, 
  loadRecycleBin, 
  saveRecycleBin, 
  loadSoundEnabled,
  saveSoundEnabled
} from './utils/storage';
import { 
  DEFAULT_THEME_CONFIGS, 
  loadWorkbenchTitle, 
  saveWorkbenchTitle, 
  loadThemeRenames, 
  saveThemeRenames 
} from './utils/themePresets';
import { sound } from './utils/audio';

import { TopFloatingBar } from './components/TopFloatingBar';
import { DesktopIcons } from './components/DesktopIcons';
import { StickyNoteItem } from './components/StickyNoteItem';
import { WindowsTaskbar } from './components/WindowsTaskbar';
import { ThemeWorkshopConsole } from './components/ThemeWorkshopConsole';
import { RecycleBinModal } from './components/RecycleBinModal';
import { StartMenuModal } from './components/StartMenuModal';
import { SystemInfoModal } from './components/SystemInfoModal';

export default function App() {
  const [notes, setNotes] = useState<StickyNote[]>(() => loadStickyNotes());
  const [recycleNotes, setRecycleNotes] = useState<StickyNote[]>(() => loadRecycleBin());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => loadSoundEnabled());
  const [areNotesVisible, setAreNotesVisible] = useState<boolean>(true);
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState<boolean>(false);
  const [showRecycleModal, setShowRecycleModal] = useState<boolean>(false);
  const [systemModal, setSystemModal] = useState<'computer' | 'assets' | null>(null);
  const [lang, setLang] = useState<'cn' | 'en'>('cn');
  const [maxZIndex, setMaxZIndex] = useState<number>(20);

  // Multi-select & Batch move states ("便签可以全选移动，可以选中多个便签自由移动")
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [selectionBox, setSelectionBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);
  const batchDragStartPos = useRef<Record<string, { x: number; y: number }>>({});

  // Editable workbench title state
  const [workbenchTitle, setWorkbenchTitle] = useState<string>(() => loadWorkbenchTitle());

  // Editable theme renames state
  const [themeRenames, setThemeRenames] = useState<Record<string, string>>(() => loadThemeRenames());

  // Pure Sticky Notes Mode vs Simulated Desktop Screen ("不要有桌面的屏幕")
  const [showDesktopScreen, setShowDesktopScreen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('noteflow_show_desktop') === 'true';
    } catch {
      return false; // Default: Pure sticky notes, NO desktop screen!
    }
  });

  const handleToggleDesktopScreen = useCallback(() => {
    setShowDesktopScreen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('noteflow_show_desktop', String(next));
      } catch {
        // ignore
      }
      sound.playClick();
      return next;
    });
  }, []);

  // Synchronize sound engine
  useEffect(() => {
    sound.enabled = soundEnabled;
    saveSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  // Persist notes
  useEffect(() => {
    saveStickyNotes(notes);
  }, [notes]);

  // Persist recycle bin
  useEffect(() => {
    saveRecycleBin(recycleNotes);
  }, [recycleNotes]);

  // Persist workbench title
  const handleUpdateWorkbenchTitle = useCallback((title: string) => {
    setWorkbenchTitle(title);
    saveWorkbenchTitle(title);
  }, []);

  // Multi-select actions ("便签可以全选移动，可以选中多个便签自由移动")
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedNoteIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    sound.playClick();
  }, []);

  // Desktop Free Box Selection ("可以自己框选便利贴，自由框选移动")
  const handleDesktopPointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    // Prevent box selection when interacting with notes, icons, modals, top bar, or taskbar
    if (
      target.closest('article') ||
      target.closest('aside') ||
      target.closest('footer') ||
      target.closest('section') ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('.pointer-events-auto')
    ) {
      return;
    }

    if (!e.shiftKey) {
      setSelectedNoteIds([]);
    }

    setSelectionBox({
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY
    });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handleDesktopPointerMove = useCallback((e: React.PointerEvent) => {
    if (!selectionBox) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    setSelectionBox((prev) => prev ? { ...prev, currentX, currentY } : null);

    const minX = Math.min(selectionBox.startX, currentX);
    const maxX = Math.max(selectionBox.startX, currentX);
    const minY = Math.min(selectionBox.startY, currentY);
    const maxY = Math.max(selectionBox.startY, currentY);

    if (maxX - minX > 3 || maxY - minY > 3) {
      const boxed = notes.filter((n) => {
        const noteLeft = n.x;
        const noteRight = n.x + n.width;
        const noteTop = n.y;
        const noteBottom = n.y + (n.collapsed ? 48 : n.height);
        return minX <= noteRight && maxX >= noteLeft && minY <= noteBottom && maxY >= noteTop;
      }).map((n) => n.id);

      setSelectedNoteIds(boxed);
    }
  }, [notes, selectionBox]);

  const handleDesktopPointerUp = useCallback((e: React.PointerEvent) => {
    if (selectionBox) {
      const minX = Math.min(selectionBox.startX, selectionBox.currentX);
      const maxX = Math.max(selectionBox.startX, selectionBox.currentX);
      const minY = Math.min(selectionBox.startY, selectionBox.currentY);
      const maxY = Math.max(selectionBox.startY, selectionBox.currentY);

      if (maxX - minX > 8 || maxY - minY > 8) {
        if (selectedNoteIds.length > 0) {
          sound.playSnap();
        }
      }
      setSelectionBox(null);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
  }, [selectionBox, selectedNoteIds.length]);

  // Batch drag multiple notes together across the desktop
  const handleBatchMoveStart = useCallback((activeId: string) => {
    const map: Record<string, { x: number; y: number }> = {};
    notes.forEach((n) => {
      if (selectedNoteIds.includes(n.id) || n.id === activeId) {
        map[n.id] = { x: n.x, y: n.y };
      }
    });
    batchDragStartPos.current = map;
  }, [notes, selectedNoteIds]);

  const handleBatchMove = useCallback((dx: number, dy: number, _activeId: string) => {
    const startMap = batchDragStartPos.current;
    if (!startMap || Object.keys(startMap).length === 0) return;

    setNotes((prevNotes) =>
      prevNotes.map((n) => {
        const start = startMap[n.id];
        if (start) {
          const newX = Math.max(10, Math.min(window.innerWidth - n.width - 10, start.x + dx));
          const newY = Math.max(10, Math.min(window.innerHeight - (n.collapsed ? 50 : n.height) - 50, start.y + dy));
          return { ...n, x: newX, y: newY };
        }
        return n;
      })
    );
  }, []);

  const handleBatchMoveEnd = useCallback(() => {
    batchDragStartPos.current = {};
    sound.playSnap();
  }, []);

  // One-click toggle all speech bubbles ("可以一键收起悬浮角色台词气泡，不要一个一个调节")
  const areAllBubblesHidden = notes.length > 0 && notes.every((n) => n.hideSpeechBubble);

  const handleToggleAllSpeechBubbles = useCallback(() => {
    sound.playPop();
    setNotes((prev) => {
      const shouldHide = !prev.every((n) => n.hideSpeechBubble);
      return prev.map((n) => ({ ...n, hideSpeechBubble: shouldHide }));
    });
  }, []);

  // Persist theme renames
  const handleUpdateThemeName = useCallback((themeId: string, newName: string) => {
    setThemeRenames((prev) => {
      const next = { ...prev, [themeId]: newName };
      saveThemeRenames(next);
      return next;
    });
  }, []);

  // Initial layout positioning if zero coordinates
  useEffect(() => {
    const w = window.innerWidth;
    const isSmallScreen = w < 1024;

    setNotes((prevNotes) => {
      const hasZeros = prevNotes.some((n) => n.x === 0 && n.y === 0);
      if (!hasZeros) return prevNotes;

      return prevNotes.map((note, idx) => {
        if (note.x !== 0 || note.y !== 0) return note;

        if (isSmallScreen) {
          const colX = Math.max(80, w - 310);
          return {
            ...note,
            x: colX,
            y: 65 + idx * 255
          };
        }

        const col1X = Math.max(100, w - 620);
        const col2X = Math.max(col1X + 305, w - 310);

        if (idx === 0) return { ...note, x: col1X, y: 65, width: 285, height: 235 };
        if (idx === 1) return { ...note, x: col1X, y: 325, width: 285, height: 235 };
        if (idx === 2) return { ...note, x: col2X, y: 65, width: 285, height: 235 };
        if (idx === 3) return { ...note, x: col2X, y: 325, width: 285, height: 235 };

        return { ...note, x: col2X - 40, y: 100 + (idx - 4) * 80, width: 285, height: 235 };
      });
    });
  }, []);

  // Bring note to absolute front
  const handleBringToFront = useCallback((id: string) => {
    setMaxZIndex((prev) => {
      const nextZ = prev + 5;
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.id === id ? { ...n, zIndex: nextZ } : n))
      );
      return nextZ;
    });
  }, []);

  // Update a single note
  const handleUpdateNote = useCallback((updated: StickyNote) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  }, []);

  // Delete note
  const handleDeleteNote = useCallback((id: string) => {
    setSelectedNoteIds((prev) => prev.filter((i) => i !== id));
    setNotes((prev) => {
      const target = prev.find((n) => n.id === id);
      if (target) {
        setRecycleNotes((r) => [target, ...r]);
      }
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  // Restore note
  const handleRestoreNote = useCallback((note: StickyNote) => {
    setRecycleNotes((r) => r.filter((n) => n.id !== note.id));
    setNotes((prev) => [
      {
        ...note,
        x: Math.max(100, window.innerWidth - 320),
        y: 80 + Math.random() * 60,
        zIndex: maxZIndex + 5
      },
      ...prev
    ]);
  }, [maxZIndex]);

  // Permanently delete
  const handlePermanentDelete = useCallback((id: string) => {
    setRecycleNotes((r) => r.filter((n) => n.id !== id));
  }, []);

  // Empty bin
  const handleEmptyBin = useCallback(() => {
    setRecycleNotes([]);
  }, []);

  // Quick Add from 15 themes (custom at front #0)
  const handleQuickAdd = useCallback((themeId: ThemeId = 'memo') => {
    const config = DEFAULT_THEME_CONFIGS[themeId] || DEFAULT_THEME_CONFIGS.memo;
    const w = window.innerWidth;
    const isCustom = themeId === 'custom';
    const rawName = themeRenames[themeId] || (lang === 'en' ? config.nameEn : config.name);

    const newNote: StickyNote = {
      id: `note-${Date.now()}`,
      title: rawName,
      titleEn: config.nameEn,
      subtitle: config.description,
      subtitleEn: config.descriptionEn,
      theme: themeId,
      category: config.category,
      customBgColor: isCustom ? '#9caf88' : undefined,
      customTextColor: isCustom ? '#1f2e1b' : undefined,
      customAccentColor: isCustom ? '#4a6741' : undefined,
      items: config.defaultItems.map((item, i) => ({
        id: `item-${Date.now()}-${i}`,
        text: item.text,
        textEn: item.textEn,
        done: item.done
      })),
      x: Math.max(120, w - 320 - (Math.random() * 50)),
      y: 75 + Math.random() * 80,
      width: 285,
      height: 235,
      zIndex: maxZIndex + 5,
      pinned: true,
      collapsed: false,
      opacity: 0.96,
      borderRadius: 16,
      fontSize: 'sm',
      fontFamily: 'sans',
      sticker: config.defaultSticker,
      speechBubble: config.defaultSpeech,
      speechBubbleEn: config.defaultSpeechEn,
      washiTape: config.hasTape,
      createdAt: new Date().toISOString()
    };

    setNotes((prev) => [newNote, ...prev]);
    setMaxZIndex((z) => z + 5);
    setAreNotesVisible(true);
  }, [lang, maxZIndex, themeRenames]);

  // Apply new note from Theme Workshop Console (including Custom theme)
  const handleApplyThemeNewNote = useCallback((
    themeId: ThemeId, 
    opacity: number, 
    radius: number, 
    hasPet: boolean,
    customConfig?: { bgColor: string; textColor: string; accentColor: string; name: string; sticker: StickerId }
  ) => {
    const config = DEFAULT_THEME_CONFIGS[themeId] || DEFAULT_THEME_CONFIGS.pet;
    const w = window.innerWidth;
    const isCustom = themeId === 'custom';
    const noteTitle = isCustom && customConfig?.name 
      ? customConfig.name 
      : (themeRenames[themeId] || (lang === 'en' ? config.nameEn : config.name));

    const newNote: StickyNote = {
      id: `note-${Date.now()}`,
      title: noteTitle,
      titleEn: config.nameEn,
      subtitle: config.description,
      subtitleEn: config.descriptionEn,
      theme: themeId,
      category: config.category,
      customBgColor: isCustom && customConfig ? customConfig.bgColor : undefined,
      customTextColor: isCustom && customConfig ? customConfig.textColor : undefined,
      customAccentColor: isCustom && customConfig ? customConfig.accentColor : undefined,
      items: config.defaultItems.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        text: item.text,
        textEn: item.textEn,
        done: item.done
      })),
      x: Math.max(100, w - 325),
      y: 75,
      width: 285,
      height: 235,
      zIndex: maxZIndex + 5,
      pinned: true,
      collapsed: false,
      opacity: opacity,
      borderRadius: radius,
      fontSize: 'sm',
      fontFamily: 'sans',
      sticker: hasPet ? (isCustom && customConfig ? customConfig.sticker : config.defaultSticker) : 'none',
      speechBubble: config.defaultSpeech,
      speechBubbleEn: config.defaultSpeechEn,
      washiTape: config.hasTape,
      hasPetWidget: hasPet,
      createdAt: new Date().toISOString()
    };

    setNotes((prev) => [newNote, ...prev]);
    setMaxZIndex((z) => z + 5);
    setAreNotesVisible(true);
  }, [lang, maxZIndex, themeRenames]);

  // 一键还原所有便签到一样大小 (285x235) 并且根据当前屏幕位置对齐（不把新建的放最上面）
  const handleResetAndAlignAll = useCallback(() => {
    const w = window.innerWidth;
    const isSingleCol = w < 1000;

    setNotes((prev) => {
      if (prev.length === 0) return prev;

      if (isSingleCol) {
        // Sort strictly by their current vertical Y position on screen!
        const sorted = [...prev].sort((a, b) => a.y - b.y);
        const colX = Math.max(80, w - 310);
        return sorted.map((note, idx) => ({
          ...note,
          width: 285,
          height: 235,
          collapsed: false,
          x: colX,
          y: 65 + idx * 255
        }));
      }

      // Two columns: group notes by their actual screen X coordinate relative to midline
      const col1TargetX = Math.max(80, w - 620);
      const col2TargetX = Math.max(col1TargetX + 305, w - 310);
      const splitX = (col1TargetX + col2TargetX) / 2;

      // Group and sort each column strictly by current screen Y position!
      const col1Notes = prev.filter(n => (n.x + n.width / 2) < splitX).sort((a, b) => a.y - b.y);
      const col2Notes = prev.filter(n => (n.x + n.width / 2) >= splitX).sort((a, b) => a.y - b.y);

      // Map aligned coordinates preserving each note's vertical arrangement
      const mappedCol1 = col1Notes.map((note, idx) => ({
        ...note,
        width: 285,
        height: 235,
        collapsed: false,
        x: col1TargetX,
        y: 65 + idx * 255
      }));

      const mappedCol2 = col2Notes.map((note, idx) => ({
        ...note,
        width: 285,
        height: 235,
        collapsed: false,
        x: col2TargetX,
        y: 65 + idx * 255
      }));

      return [...mappedCol1, ...mappedCol2];
    });
    setAreNotesVisible(true);
  }, []);

  // Clear completed tasks across all notes
  const handleClearCompletedAll = useCallback(() => {
    setNotes((prev) =>
      prev.map((note) => ({
        ...note,
        items: note.items.filter((item) => !item.done)
      }))
    );
  }, []);

  return (
    <main 
      className="relative w-screen h-screen overflow-hidden text-slate-100 font-body-md select-none"
      onPointerDown={handleDesktopPointerDown}
      onPointerMove={handleDesktopPointerMove}
      onPointerUp={handleDesktopPointerUp}
    >
      {/* ========================================================
          CANVAS BACKGROUND (纯净便签模式 vs 模拟桌面屏幕)
          ======================================================== */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none transition-all duration-500"
        style={{
          background: showDesktopScreen
            ? 'radial-gradient(ellipse at 50% 30%, #151e2f 0%, #0d131f 60%, #080c14 100%)'
            : 'radial-gradient(circle at 50% 50%, #111827 0%, #0a0e17 100%)'
        }}
      >
        {/* Geometric dot grid for sticky alignment */}
        <div 
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        {/* Dynamic Ambient Vignette and radial focus glow */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{
            background: showDesktopScreen
              ? 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 75%)'
              : 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.06) 0%, transparent 75%)'
          }}
        />
      </div>

      {/* ========================================================
          DESKTOP MARQUEE BOX SELECTION OVERLAY (鼠标自由框选区域)
          ======================================================== */}
      {selectionBox && (Math.abs(selectionBox.currentX - selectionBox.startX) > 4 || Math.abs(selectionBox.currentY - selectionBox.startY) > 4) && (
        <div
          className="fixed z-40 bg-cyan-500/15 border border-cyan-400/80 rounded-xs pointer-events-none shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-in fade-in duration-75"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.currentX),
            top: Math.min(selectionBox.startY, selectionBox.currentY),
            width: Math.abs(selectionBox.currentX - selectionBox.startX),
            height: Math.abs(selectionBox.currentY - selectionBox.startY)
          }}
        >
          {selectedNoteIds.length > 0 && (
            <div className="absolute -top-7 left-0 bg-cyan-600/90 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap">
              {lang === 'cn' ? `已框选 ${selectedNoteIds.length} 张便签` : `${selectedNoteIds.length} Notes Boxed`}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          LEFT DESKTOP ICONS (Windows 11 Desktop Shortcuts，仅桌面模式展示)
          ======================================================== */}
      {showDesktopScreen && (
        <DesktopIcons
          onOpenComputer={() => setSystemModal('computer')}
          onOpenRecycleBin={() => setShowRecycleModal(true)}
          onOpenAssets={() => setSystemModal('assets')}
          onOpenNoteFlow={() => setIsConsoleOpen(true)}
          recycleCount={recycleNotes.length}
          lang={lang}
        />
      )}

      {/* ========================================================
          TOP FLOATING WORKBENCH BAR (长条形悬浮条：随意拖拽、一键收起气泡、可收起停靠)
          ======================================================== */}
      <TopFloatingBar
        onQuickAdd={handleQuickAdd}
        onResetAndAlign={handleResetAndAlignAll}
        onToggleVisibility={() => setAreNotesVisible(!areNotesVisible)}
        areNotesVisible={areNotesVisible}
        onToggleConsole={() => setIsConsoleOpen(!isConsoleOpen)}
        isConsoleOpen={isConsoleOpen}
        lang={lang}
        onToggleLang={(l) => setLang(l)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        themeRenames={themeRenames}
        onToggleAllSpeechBubbles={handleToggleAllSpeechBubbles}
        areAllBubblesHidden={areAllBubblesHidden}
        onOpenRecycleBin={() => setShowRecycleModal(true)}
        recycleCount={recycleNotes.length}
        showDesktopScreen={showDesktopScreen}
        onToggleDesktopScreen={handleToggleDesktopScreen}
      />

      {/* ========================================================
          FLOATING STICKY NOTES LAYER (自由多选移动、联动平移、磁吸对齐)
          ======================================================== */}
      <div 
        className={`fixed inset-0 z-30 pointer-events-none transition-all duration-300 ${
          areNotesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {notes.map((note, index) => (
          <div key={note.id} className="pointer-events-auto">
            <StickyNoteItem
              note={note}
              index={index}
              allNotes={notes}
              onUpdate={handleUpdateNote}
              onDelete={handleDeleteNote}
              onBringToFront={handleBringToFront}
              lang={lang}
              themeRenames={themeRenames}
              isSelected={selectedNoteIds.includes(note.id)}
              onToggleSelect={handleToggleSelect}
              onBatchMoveStart={handleBatchMoveStart}
              onBatchMove={handleBatchMove}
              onBatchMoveEnd={handleBatchMoveEnd}
            />
          </div>
        ))}
      </div>

      {/* ========================================================
          MOVABLE THEME WORKSHOP CONSOLE (纯白/固定界面，内部不收起悬浮条，仅保留桌面长条形)
          ======================================================== */}
      {isConsoleOpen && (
        <ThemeWorkshopConsole
          notes={notes}
          onClose={() => setIsConsoleOpen(false)}
          onApplyThemeNewNote={handleApplyThemeNewNote}
          onClearCompletedAll={handleClearCompletedAll}
          onResetAndAlignAll={handleResetAndAlignAll}
          lang={lang}
          workbenchTitle={workbenchTitle}
          onUpdateWorkbenchTitle={handleUpdateWorkbenchTitle}
          themeRenames={themeRenames}
          onUpdateThemeName={handleUpdateThemeName}
          onToggleAllSpeechBubbles={handleToggleAllSpeechBubbles}
          areAllBubblesHidden={areAllBubblesHidden}
        />
      )}

      {/* ========================================================
          RECYCLE BIN MODAL
          ======================================================== */}
      {showRecycleModal && (
        <RecycleBinModal
          recycleNotes={recycleNotes}
          onRestore={handleRestoreNote}
          onPermanentDelete={handlePermanentDelete}
          onEmptyBin={handleEmptyBin}
          onClose={() => setShowRecycleModal(false)}
          lang={lang}
        />
      )}

      {/* ========================================================
          WINDOWS 11 START MENU MODAL (仅在开启桌面屏幕时展示)
          ======================================================== */}
      {showDesktopScreen && isStartMenuOpen && (
        <StartMenuModal
          onClose={() => setIsStartMenuOpen(false)}
          onOpenConsole={() => setIsConsoleOpen(true)}
          onQuickAdd={handleQuickAdd}
          notes={notes}
          onFocusNote={(id) => {
            handleBringToFront(id);
            setAreNotesVisible(true);
          }}
          lang={lang}
        />
      )}

      {/* ========================================================
          SYSTEM / ASSETS MODAL (展示 20 款高清矢量贴纸)
          ======================================================== */}
      {systemModal && (
        <SystemInfoModal
          type={systemModal}
          onClose={() => setSystemModal(null)}
          lang={lang}
        />
      )}

      {/* ========================================================
          WINDOWS 11 CENTERED TASKBAR (仅在开启桌面屏幕时展示，纯净便签模式隐藏)
          ======================================================== */}
      {showDesktopScreen && (
        <WindowsTaskbar
          onToggleStartMenu={() => setIsStartMenuOpen(!isStartMenuOpen)}
          isStartMenuOpen={isStartMenuOpen}
          onToggleConsole={() => setIsConsoleOpen(!isConsoleOpen)}
          isConsoleOpen={isConsoleOpen}
          onToggleShowDesktop={() => setAreNotesVisible(!areNotesVisible)}
          activeStickiesCount={notes.length}
          lang={lang}
        />
      )}
    </main>
  );
}
