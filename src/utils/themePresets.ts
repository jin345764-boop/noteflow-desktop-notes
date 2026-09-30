import { ThemeConfig, ThemeId, CustomThemeTemplate, InterfaceThemeId, InterfaceThemeConfig } from '../types';

export const INTERFACE_THEMES: Record<InterfaceThemeId, InterfaceThemeConfig> = {
  white: {
    id: 'white',
    name: '经典纯白雅致',
    nameEn: 'Pure Classic White',
    consoleBg: 'bg-white',
    consoleHeaderBg: 'bg-slate-50 border-b border-slate-200',
    consoleBorder: 'border-slate-200 shadow-[0_24px_70px_rgba(0,0,0,0.16)]',
    consoleText: 'text-slate-900',
    consoleSubtext: 'text-slate-500',
    consoleCardBg: 'bg-slate-50/90',
    consoleCardBorder: 'border-slate-200',
    bgGradient: 'radial-gradient(ellipse at 80% 20%, #1e1b4b 0%, #070d1d 55%, #030712 100%)',
    ambientGlow: 'rgba(99, 102, 241, 0.18)',
    barBg: 'bg-white/95 border-slate-200 text-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.15)]',
    taskbarBg: 'bg-[#080e1e]/85 border-white/10',
    accentColor: '#4f46e5',
    dotColor: '#6366f1',
    previewColor: '#ffffff',
    isLightMode: true
  },
  obsidian: {
    id: 'obsidian',
    name: '极光深空灰蓝',
    nameEn: 'Aurora Obsidian Slate',
    consoleBg: 'bg-[#090f1d]',
    consoleHeaderBg: 'bg-[#0e1628] border-b border-white/10',
    consoleBorder: 'border-white/15 shadow-[0_24px_70px_rgba(0,0,0,0.65)]',
    consoleText: 'text-white',
    consoleSubtext: 'text-slate-400',
    consoleCardBg: 'bg-white/5',
    consoleCardBorder: 'border-white/10',
    bgGradient: 'radial-gradient(ellipse at 80% 20%, #1e1b4b 0%, #070d1d 55%, #030712 100%)',
    ambientGlow: 'rgba(99, 102, 241, 0.18)',
    barBg: 'bg-[#060e20]/85 border-white/15 text-white',
    taskbarBg: 'bg-[#080e1e]/85 border-white/10',
    accentColor: '#6366f1',
    dotColor: '#818cf8',
    previewColor: '#070d1d'
  },
  morandi: {
    id: 'morandi',
    name: '莫兰蒂暖杏米',
    nameEn: 'Warm Morandi Almond',
    consoleBg: 'bg-[#fbf7f0]',
    consoleHeaderBg: 'bg-[#f2e7d8] border-b border-[#c4b5a3]/60',
    consoleBorder: 'border-[#c4b5a3] shadow-[0_24px_70px_rgba(110,85,60,0.22)]',
    consoleText: 'text-[#2e261e]',
    consoleSubtext: 'text-[#796a57]',
    consoleCardBg: 'bg-[#f5ecdf]/80',
    consoleCardBorder: 'border-[#d8cab8]',
    bgGradient: 'radial-gradient(ellipse at 75% 25%, #e8dcce 0%, #dfd2c0 45%, #cfc0ad 100%)',
    ambientGlow: 'rgba(217, 130, 91, 0.18)',
    barBg: 'bg-[#f4ebe1]/90 border-[#c4b5a3] text-slate-800 shadow-[0_8px_30px_rgba(110,85,60,0.18)]',
    taskbarBg: 'bg-[#ece2d6]/90 border-[#c4b5a3]/70 text-slate-800',
    accentColor: '#c27854',
    dotColor: '#d9825b',
    previewColor: '#dfd2c0',
    isLightMode: true
  },
  sage: {
    id: 'sage',
    name: '雾境鼠尾草绿',
    nameEn: 'Sage Mist Forest',
    consoleBg: 'bg-[#f2f7f4]',
    consoleHeaderBg: 'bg-[#e2ede6] border-b border-emerald-300/60',
    consoleBorder: 'border-emerald-200 shadow-[0_24px_70px_rgba(16,185,129,0.16)]',
    consoleText: 'text-[#132c21]',
    consoleSubtext: 'text-[#4b6d5f]',
    consoleCardBg: 'bg-[#e5f0e9]/80',
    consoleCardBorder: 'border-emerald-200',
    bgGradient: 'radial-gradient(ellipse at 80% 20%, #1a3326 0%, #0d1e16 55%, #050d09 100%)',
    ambientGlow: 'rgba(16, 185, 129, 0.2)',
    barBg: 'bg-[#0a1811]/85 border-emerald-500/25 text-white',
    taskbarBg: 'bg-[#0a1811]/90 border-emerald-500/20',
    accentColor: '#10b981',
    dotColor: '#34d399',
    previewColor: '#0d1e16'
  },
  cyber: {
    id: 'cyber',
    name: '赛博极客炫黑',
    nameEn: 'Cyber Jet Black',
    consoleBg: 'bg-[#030408]',
    consoleHeaderBg: 'bg-[#080d1a] border-b border-cyan-500/30',
    consoleBorder: 'border-cyan-500/40 ring-1 ring-cyan-500/20 shadow-[0_24px_70px_rgba(6,182,212,0.25)]',
    consoleText: 'text-cyan-50',
    consoleSubtext: 'text-cyan-400/80',
    consoleCardBg: 'bg-[#080f20]',
    consoleCardBorder: 'border-cyan-500/30',
    bgGradient: 'radial-gradient(ellipse at 70% 30%, #0b1528 0%, #030407 60%, #000000 100%)',
    ambientGlow: 'rgba(56, 189, 248, 0.22)',
    barBg: 'bg-[#030408]/90 border-cyan-500/30 ring-1 ring-cyan-500/20 text-white',
    taskbarBg: 'bg-[#030408]/95 border-cyan-500/20',
    accentColor: '#38bdf8',
    dotColor: '#22d3ee',
    previewColor: '#030407'
  }
};

// Rich Morandi & Classic Note Color Swatches (鼠尾草绿、灰、黑、橙、奶杏、粉、蓝、紫、黄等)
export const MORANDI_NOTE_COLORS = [
  { name: '鼠尾草绿', nameEn: 'Sage Green', bg: '#9caf88', text: '#1f2e1b', accent: '#4a6741' },
  { name: '橄榄雾绿', nameEn: 'Olive Mist', bg: '#78866b', text: '#ffffff', accent: '#505a46' },
  { name: '薄荷浅青', nameEn: 'Mint Aqua', bg: '#b8d8be', text: '#1a3822', accent: '#437851' },
  { name: '莫兰蒂烟灰', nameEn: 'Smoke Gray', bg: '#a2a8a8', text: '#1f2425', accent: '#565c5d' },
  { name: '冷雾浅灰', nameEn: 'Mist Gray', bg: '#ced3d5', text: '#2c3234', accent: '#626b6e' },
  { name: '曜石纯黑', nameEn: 'Obsidian Black', bg: '#1e2022', text: '#f3f4f6', accent: '#4b5563' },
  { name: '极客深黑', nameEn: 'Deep Pitch Black', bg: '#121316', text: '#38bdf8', accent: '#22d3ee' },
  { name: '焦糖暖橙', nameEn: 'Warm Caramel', bg: '#d9825b', text: '#ffffff', accent: '#8c3d17' },
  { name: '赤陶棕橙', nameEn: 'Terracotta', bg: '#c47b6a', text: '#ffffff', accent: '#7a3727' },
  { name: '莫兰蒂奶杏', nameEn: 'Cream Almond', bg: '#eadcc9', text: '#3c3022', accent: '#8c6f4e' },
  { name: '燕麦米白', nameEn: 'Oatmeal White', bg: '#f4efe6', text: '#2c251d', accent: '#796a57' },
  { name: '暮云淡粉', nameEn: 'Blush Pink', bg: '#dfb6b2', text: '#431f1c', accent: '#8a4b45' },
  { name: '丁香柔紫', nameEn: 'Lavender Lilac', bg: '#b8a9c9', text: '#281c38', accent: '#695085' },
  { name: '海盐雾蓝', nameEn: 'Sea Salt Blue', bg: '#8da4b4', text: '#152532', accent: '#3b586e' },
  { name: '青瓷碧绿', nameEn: 'Celadon Teal', bg: '#7ea296', text: '#142e26', accent: '#396054' },
  { name: '暖酪奶黄', nameEn: 'Lemon Custard', bg: '#f7e1a0', text: '#42310b', accent: '#8c6b12' }
];

// Exactly 15 Distinct Complete Themes (Custom at front #0)
export const DEFAULT_THEME_CONFIGS: Record<ThemeId, ThemeConfig> = {
  // 0. 自定义便签 (Custom Note - Placed at the very front #0)
  custom: {
    id: 'custom',
    name: '自定义便签',
    nameEn: 'Custom DIY Note',
    badge: '自定义风格',
    badgeEn: 'CUSTOM DIY',
    category: 'custom',
    bgClass: 'bg-[#9caf88]/95',
    borderClass: 'border-[#78866b]',
    textClass: 'text-[#1f2e1b]',
    accentColor: '#4a6741',
    dotColor: '#4a6741',
    defaultSticker: 'bulb',
    defaultSpeech: '自由定制 ✨',
    defaultSpeechEn: 'My Style ✨',
    hasTape: true,
    description: '自由选择莫兰蒂绿色、灰色、黑色、橙色等多款底色与贴纸，打造独一无二的专属便签',
    descriptionEn: 'Customize with Morandi greens, grays, black, orange, and 20 stickers for unique notes',
    keywords: ['自定义', '莫兰蒂色系', '自由配色', '个性专属'],
    keywordsEn: ['Custom', 'Morandi Colors', 'Unique', 'Personal DIY'],
    defaultItems: [
      { text: '自由切换莫兰蒂绿/灰/黑/橙等丰富底色 🎨', textEn: 'Pick Morandi green/gray/black/orange colors 🎨', done: false },
      { text: '移动便签在下方自动智能磁吸对齐 🧲', textEn: 'Auto magnetic snap alignment when moved 🧲', done: false },
      { text: '点击定制便签名称与自由更换 20 款贴纸 📝', textEn: 'Rename note & pick from 20 crisp vector stickers 📝', done: false }
    ]
  },

  // 1. 萌宠日记 (Pet Diary)
  pet: {
    id: 'pet',
    name: '萌宠治愈日常',
    nameEn: 'Pet Healing Diary',
    badge: '萌宠治愈日常',
    badgeEn: 'PET DAILY',
    category: 'pet',
    bgClass: 'bg-[#ffedd5]/95',
    borderClass: 'border-[#fed7aa]',
    textClass: 'text-[#7c2d12]',
    accentColor: '#ea580c',
    dotColor: '#ea580c',
    defaultSticker: 'capybara',
    defaultSpeech: '心平气和 🍊',
    defaultSpeechEn: 'Stay Calm 🍊',
    hasTape: false,
    description: '可爱、温暖与宠物元素，自动同步每日喂食与毛孩子待办',
    descriptionEn: 'Cute and warm pet elements for daily feeding and pet care routines',
    keywords: ['可爱', '温暖', '宠物元素', '卡皮巴拉'],
    keywordsEn: ['Cute', 'Warm', 'Pets', 'Capybara'],
    defaultItems: [
      { text: '开一罐三文鱼主食猫条罐罐 🐟', textEn: 'Open a salmon cat food can 🐟', done: false },
      { text: '陶瓷循环饮水机换新鲜温水 💧', textEn: 'Refill drinking fountain with warm water 💧', done: false },
      { text: '下午 16:00 摸摸卡皮巴拉的头 🍊', textEn: 'Pet capybara at 16:00 PM 🍊', done: false }
    ]
  },

  // 2. 极简工作流 (Sage Minimal)
  minimal: {
    id: 'minimal',
    name: '极简工作流',
    nameEn: 'Sage Minimal Flow',
    badge: '极简工作流 · Sage',
    badgeEn: 'SAGE MINIMAL',
    category: 'work',
    bgClass: 'bg-[#f7f6f0]/95',
    borderClass: 'border-[#e3e1d5]',
    textClass: 'text-[#2c332d]',
    accentColor: '#5c7a5e',
    dotColor: '#7c947d',
    defaultSticker: 'sloth',
    defaultSpeech: '减法生活 🌿',
    defaultSpeechEn: 'Less is More 🌿',
    hasTape: false,
    description: '低饱和鼠尾草绿，干净克制，适合无干扰专注与减法生活',
    descriptionEn: 'Low saturation sage green for distraction-free focus and minimalism',
    keywords: ['克制', '无干扰', '专注', '减法'],
    keywordsEn: ['Focus', 'Clean', 'Distraction-free', 'Minimal'],
    defaultItems: [
      { text: '优化便签浮窗尺寸至桌面局部 285px', textEn: 'Keep sticky widget compact to 285px', done: false },
      { text: '精简今日交付清单，专注 3 件要事', textEn: 'Trim today deliverables, focus on top 3', done: false }
    ]
  },

  // 3. 可爱手帐 (Kawaii Journal)
  kawaii: {
    id: 'kawaii',
    name: '可爱手帐',
    nameEn: 'Kawaii Deco Journal',
    badge: '手帐随想贴 · Kawaii',
    badgeEn: 'KAWAII DECO',
    category: 'kawaii',
    bgClass: 'bg-[#fff0f3]/95',
    borderClass: 'border-[#ffd1dc]',
    textClass: 'text-[#4c0519]',
    accentColor: '#ec4899',
    dotColor: '#ec4899',
    defaultSticker: 'cat',
    defaultSpeech: '★ 手帐 ★',
    defaultSpeechEn: '★ JOURNAL ★',
    hasTape: true,
    description: '手写彩笔质感，萌系和纸胶带与小猫咪陪伴，记录小美好',
    descriptionEn: 'Pastel colors, cute washi tape, and kitten companion for daily joy',
    keywords: ['手写感', '贴纸', '彩色便签', '小猫'],
    keywordsEn: ['Handwritten', 'Stickers', 'Pastel', 'Kitten'],
    defaultItems: [
      { text: '日式吃茶店的抹茶千层配焙茶 🍵', textEn: 'Matcha crepe cake at neighborhood tea shop 🍵', done: false },
      { text: '暗房冲洗胶卷 (Kodak 200) 🎞️', textEn: 'Develop 35mm film roll (Kodak 200) 🎞️', done: false }
    ]
  },

  // 4. Fluent 亚克力玻璃 (Mica Acrylic)
  fluent: {
    id: 'fluent',
    name: 'Fluent 亚克力玻璃',
    nameEn: 'Fluent Mica Acrylic',
    badge: 'Fluent Mica · 任务',
    badgeEn: 'FLUENT MICA',
    category: 'work',
    bgClass: 'bg-[#0f172a]/75 acrylic-glass',
    borderClass: 'border-white/20',
    textClass: 'text-[#e2e8f0]',
    accentColor: '#4cd7f6',
    dotColor: '#4cd7f6',
    defaultSticker: 'duck',
    defaultSpeech: 'Win11 DWM',
    defaultSpeechEn: 'Win11 DWM',
    hasTape: false,
    description: 'Windows 11 Mica 亚克力背景模糊与高光光效，通透高级',
    descriptionEn: 'Windows 11 Mica acrylic glass with smooth blur and rim lighting',
    keywords: ['Mica', '亚克力', '透明', 'Win11'],
    keywordsEn: ['Mica', 'Acrylic', 'Glass', 'Win11'],
    defaultItems: [
      { text: '启用 24px 亚克力背景模糊光效', textEn: 'Enable 24px acrylic backdrop blur', done: false },
      { text: '支持内容行内直接编辑与即时删减', textEn: 'Support inline direct editing and removal', done: false }
    ]
  },

  // 5. 工作办公 · P0攻坚 (Executive Office)
  work: {
    id: 'work',
    name: '工作办公 · P0攻坚',
    nameEn: 'Executive Office · P0',
    badge: 'P0 今日重点',
    badgeEn: 'P0 PRIORITY',
    category: 'work',
    bgClass: 'bg-[#090d16]/92 acrylic-glass',
    borderClass: 'border-indigo-500/50',
    textClass: 'text-[#f1f5f9]',
    accentColor: '#6366f1',
    dotColor: '#ef4444',
    defaultSticker: 'pomodoro',
    defaultSpeech: '专注攻坚 🎯',
    defaultSpeechEn: 'Deep Focus 🎯',
    hasTape: false,
    description: '深色克制与清晰易读，自带倒计时与圆环进度看板，职场交付神器',
    descriptionEn: 'High-contrast executive dark card for mission-critical deliverables',
    keywords: ['专业', '克制', '效率感', '项目管理'],
    keywordsEn: ['Professional', 'Focus', 'Executive', 'P0'],
    defaultItems: [
      { text: '今日重点：项目计划与架构评审', textEn: 'Key Focus: Project architecture review', done: false },
      { text: '跨部门会议同步 (14:30)', textEn: 'Cross-functional sync meeting (14:30)', done: false },
      { text: '核心交付节点验收与自动化测试', textEn: 'Verify core milestone and test suites', done: false }
    ]
  },

  // 6. 松弛治愈 · 情绪调节 (Gentle Healing)
  healing: {
    id: 'healing',
    name: '松弛治愈',
    nameEn: 'Gentle Healing',
    badge: '情绪调节与生活节奏',
    badgeEn: 'MINDFULNESS',
    category: 'healing',
    bgClass: 'bg-[#f0fdf4]/95',
    borderClass: 'border-emerald-200/90',
    textClass: 'text-[#064e3b]',
    accentColor: '#10b981',
    dotColor: '#10b981',
    defaultSticker: 'shiba',
    defaultSpeech: '放轻松 🌿',
    defaultSpeechEn: 'Breathe 🌿',
    hasTape: false,
    description: '莫兰蒂绿与圆润边角，适合记录喝水、4-7-8呼吸与规律作息',
    descriptionEn: 'Morandi green with rounded curves for hydration and breathing',
    keywords: ['柔和', '低饱和', '留白', '呼吸'],
    keywordsEn: ['Gentle', 'Wellness', 'Breathe', 'Rest'],
    defaultItems: [
      { text: '晨间晒太阳 20 分钟 ☀️', textEn: 'Morning sunshine for 20 mins ☀️', done: false },
      { text: '散步微汗 & 每日补水 (1800ml) 💧', textEn: 'Light walk & drink water (1800ml) 💧', done: false },
      { text: '睡前半小时阅读，早点睡 🌙', textEn: 'Wind-down reading before sleep 🌙', done: false }
    ]
  },

  // 7. 临时备忘录 · 速记黄 (Quick Memo)
  memo: {
    id: 'memo',
    name: '临时备忘录',
    nameEn: 'Quick Post-It Memo',
    badge: '桌面随手记 · 临时备忘板',
    badgeEn: 'QUICK MEMO',
    category: 'memo',
    bgClass: 'bg-[#fef9c3]/95',
    borderClass: 'border-amber-300',
    textClass: 'text-[#713f12]',
    accentColor: '#d97706',
    dotColor: '#f59e0b',
    defaultSticker: 'cafe',
    defaultSpeech: '速记防忘 📌',
    defaultSpeechEn: 'Remember 📌',
    hasTape: true,
    description: '经典亮黄便签纸，常驻置顶，支持快速一键复制常用会议码与单号',
    descriptionEn: 'Classic canary yellow post-it note for quick pins and copy codes',
    keywords: ['防忘速记', '临时剪贴', '便携高频', '备忘'],
    keywordsEn: ['Post-it', 'Fast Memo', 'Quick Copy', 'Pin'],
    defaultItems: [
      { text: '下午2点评审 Zoom: 882-901-443', textEn: '2 PM Review Zoom: 882-901-443', done: false },
      { text: '驿站取件码：3-2-401 (生鲜)', textEn: 'Parcel pickup code: 3-2-401', done: false },
      { text: '发票税号：91310000X8890214', textEn: 'Tax ID: 91310000X8890214', done: false }
    ]
  },

  // 8. 沉浸考研学习 · 冲刺打卡 (Study & Exam Sprint)
  study: {
    id: 'study',
    name: '沉浸考研学习',
    nameEn: 'Deep Study Room',
    badge: '每日知识攻坚',
    badgeEn: 'STUDY SPRINT',
    category: 'study',
    bgClass: 'bg-[#eff6ff]/95',
    borderClass: 'border-blue-200',
    textClass: 'text-[#1e3a8a]',
    accentColor: '#2563eb',
    dotColor: '#3b82f6',
    defaultSticker: 'books',
    defaultSpeech: '金榜题名 🎓',
    defaultSpeechEn: 'Pass Exam 🎓',
    hasTape: true,
    description: '深蓝书香气质，适合考研考公、错题本复盘、每日背诵与番茄钟',
    descriptionEn: 'Academic blue theme for students, exam preps, and study logs',
    keywords: ['考研', '学生党', '错题复盘', '番茄钟'],
    keywordsEn: ['Exam', 'Student', 'Study Plan', 'Review'],
    defaultItems: [
      { text: '精读考研英语长难句与高频词 50个 📖', textEn: 'English vocabulary & 50 key words 📖', done: false },
      { text: '高数真题错题本复盘整理 3 道 📐', textEn: 'Review 3 math test error problems 📐', done: false },
      { text: '晚间核心大题框架记忆 30分钟 ✍️', textEn: '30 mins memorizing exam essay outlines ✍️', done: false }
    ]
  },

  // 9. 燃脂运动打卡 · 活力塑形 (Fitness & Health)
  fitness: {
    id: 'fitness',
    name: '燃脂运动打卡',
    nameEn: 'Fitness & Health Burn',
    badge: '燃脂塑形打卡',
    badgeEn: 'FITNESS LOG',
    category: 'fitness',
    bgClass: 'bg-[#fdf4ff]/95',
    borderClass: 'border-fuchsia-200',
    textClass: 'text-[#701a75]',
    accentColor: '#c026d3',
    dotColor: '#e879f9',
    defaultSticker: 'avocado',
    defaultSpeech: '挥洒汗水 ⚡',
    defaultSpeechEn: 'Keep Moving ⚡',
    hasTape: false,
    description: '元气活力配色，记录每日运动卡路里、蛋白质补给与 10000 步打卡',
    descriptionEn: 'Vibrant energy theme for workout logs, calories, and steps',
    keywords: ['健身', '减脂', '增肌', '卡路里'],
    keywordsEn: ['Gym', 'Calorie', 'Protein', 'Workout'],
    defaultItems: [
      { text: '晨间空腹帕梅拉或力量训练 40分钟 🏋️', textEn: 'Morning strength training for 40 mins 🏋️', done: false },
      { text: '全天摄入纯净蛋白质 90g (鸡胸肉/鸡蛋) 🥩', textEn: 'Hit protein target 90g (chicken/eggs) 🥩', done: false },
      { text: '达成今日 10000 步轻量快走 👟', textEn: 'Complete 10,000 daily walking steps 👟', done: false }
    ]
  },

  // 10. 赛博极客代码 · 黑客暗黑 (Cyber Dev & Code)
  code: {
    id: 'code',
    name: '赛博极客代码',
    nameEn: 'Cyber Dev & Hacker',
    badge: 'DEV TERMINAL',
    badgeEn: 'DEV TERMINAL',
    category: 'code',
    bgClass: 'bg-[#020617]/95 acrylic-glass',
    borderClass: 'border-emerald-500/40',
    textClass: 'text-[#34d399]',
    accentColor: '#10b981',
    dotColor: '#10b981',
    defaultSticker: 'gamepad',
    defaultSpeech: 'git push --force 🚀',
    defaultSpeechEn: 'git push --force 🚀',
    hasTape: false,
    description: '黑客绿光暗黑控制台，专为工程师设计，Bug 追踪与代码合并',
    descriptionEn: 'Cyber neon terminal theme for engineers, git branches, and bug tracker',
    keywords: ['程序员', '代码', '黑客', '终端'],
    keywordsEn: ['Developer', 'Terminal', 'Git', 'Bugfix'],
    defaultItems: [
      { text: 'git checkout -b feat/ultra-crisp-stickies 💻', textEn: 'git checkout -b feat/ultra-crisp-stickies 💻', done: false },
      { text: '修复贴纸锯齿与磁吸对齐 🐞', textEn: 'Fix sticker aliasing & magnetic auto-snap 🐞', done: false },
      { text: '跑通单元测试与 lint 验证无报错 🧪', textEn: 'Run automated lint and zero warning build 🧪', done: false }
    ]
  },

  // 11. 美食日记 · 舌尖美味 (Foodie Gourmet)
  foodie: {
    id: 'foodie',
    name: '美食日记 · 舌尖美味',
    nameEn: 'Foodie Gourmet & Recipes',
    badge: '今日美味探索',
    badgeEn: 'FOODIE DIARY',
    category: 'life',
    bgClass: 'bg-[#fff7ed]/95',
    borderClass: 'border-orange-200',
    textClass: 'text-[#9a3412]',
    accentColor: '#f97316',
    dotColor: '#fb923c',
    defaultSticker: 'burger',
    defaultSpeech: '唯有美食 🍔',
    defaultSpeechEn: 'Good Food 🍔',
    hasTape: true,
    description: '暖橙食欲满满，适合记录私房食谱、下厨灵感、深夜食堂与周末探店',
    descriptionEn: 'Warm appetite palette for homemade recipes, dining out, and snacks',
    keywords: ['美食', '食谱', '下厨', '探店'],
    keywordsEn: ['Foodie', 'Recipe', 'Cooking', 'Gourmet'],
    defaultItems: [
      { text: '买齐手作黑椒牛柳意面食材 🍝', textEn: 'Shop fresh ingredients for beef pasta 🍝', done: false },
      { text: '慢炖番茄牛腩煲 (小火焖 1.5 小时) 🍲', textEn: 'Slow simmer tomato beef stew for 1.5h 🍲', done: false },
      { text: '收藏街角新开的法式舒芙蕾小馆 🍮', textEn: 'Save neighborhood French Soufflé cafe 🍮', done: false }
    ]
  },

  // 12. 灵感画布 · 创意手稿 (Creative Studio)
  creative: {
    id: 'creative',
    name: '灵感画布 · 创意手稿',
    nameEn: 'Creative Studio & Doodles',
    badge: '创意灵感草稿',
    badgeEn: 'CREATIVE STUDIO',
    category: 'life',
    bgClass: 'bg-[#faf7ee]/95',
    borderClass: 'border-[#e8e0cc]',
    textClass: 'text-[#443828]',
    accentColor: '#b45309',
    dotColor: '#d97706',
    defaultSticker: 'teddy',
    defaultSpeech: '脑洞大开 💡',
    defaultSpeechEn: 'Eureka Idea 💡',
    hasTape: true,
    description: '复古暖调素描纸质感，适合捕捉电光石火的灵感、构想草图与奇思妙想',
    descriptionEn: 'Warm sketchbook parchment for capturing sparks, doodles, and creative ideas',
    keywords: ['灵感', '创意', '脑暴', '速写'],
    keywordsEn: ['Idea', 'Brainstorm', 'Creative', 'Sketch'],
    defaultItems: [
      { text: '画出新便签动效与交互草图 ✏️', textEn: 'Sketch animation mockup for sticky notes ✏️', done: false },
      { text: '收集莫兰蒂高级低饱和调色板 🎨', textEn: 'Collect luxury Morandi color palette moodboard 🎨', done: false },
      { text: '记录深夜洗澡时冒出的产品点子 💡', textEn: 'Jot down late night shower ideas 💡', done: false }
    ]
  },

  // 13. 理财记账 · 财富自由 (Wealth & Finance - #14)
  finance: {
    id: 'finance',
    name: '理财记账 · 财富自由',
    nameEn: 'Wealth & Budgeting',
    badge: '财富积累管理',
    badgeEn: 'FINANCE LOG',
    category: 'finance',
    bgClass: 'bg-[#f0fdfa]/95',
    borderClass: 'border-teal-200',
    textClass: 'text-[#134e4a]',
    accentColor: '#0d9488',
    dotColor: '#14b8a6',
    defaultSticker: 'rocket',
    defaultSpeech: '开源节流 💰',
    defaultSpeechEn: 'Grow Wealth 💰',
    hasTape: false,
    description: '清新青绿清爽格调，专为储蓄目标、月度预算、记账与资产管理定制',
    descriptionEn: 'Crisp teal palette for budget tracking, monthly savings, and investments',
    keywords: ['记账', '理财', '预算', '存款'],
    keywordsEn: ['Finance', 'Budget', 'Savings', 'Wealth'],
    defaultItems: [
      { text: '结清本月信用卡账单与房租 💳', textEn: 'Pay credit card statement and rent 💳', done: false },
      { text: '定期定额转入稳健理财账户 3000元 📈', textEn: 'Deposit monthly $500 to index fund 📈', done: false },
      { text: '复盘本周不必要的冲动消费支出 🔍', textEn: 'Audit impulsive expenses of the week 🔍', done: false }
    ]
  },

  // 14. 旅行漫游 · 环游世界 (Travel Wanderlust - #15)
  travel: {
    id: 'travel',
    name: '旅行漫游 · 环游世界',
    nameEn: 'Travel & Wanderlust',
    badge: '旅行出行随行贴',
    badgeEn: 'TRAVEL LOG',
    category: 'travel',
    bgClass: 'bg-[#fefce8]/95',
    borderClass: 'border-yellow-200',
    textClass: 'text-[#854d0e]',
    accentColor: '#ca8a04',
    dotColor: '#eab308',
    defaultSticker: 'penguin',
    defaultSpeech: '向远方出发 ✈️',
    defaultSpeechEn: 'Wanderlust ✈️',
    hasTape: true,
    description: '向往远方与自由，出游行李打包清单、机票车次备忘与风景打卡',
    descriptionEn: 'Vacation wanderlust for packing lists, flight tickets, and travel spots',
    keywords: ['旅行', '出发', '行李清单', '攻略'],
    keywordsEn: ['Travel', 'Packing', 'Vacation', 'Journey'],
    defaultItems: [
      { text: '检查身份证件、护照与充电宝 🎒', textEn: 'Pack ID, passport, power bank & cables 🎒', done: false },
      { text: '确认酒店预订与高铁取票凭证 🎫', textEn: 'Confirm hotel booking & train tickets 🎫', done: false },
      { text: '收藏当地评分最高的宝藏本地小吃 🗺️', textEn: 'Save map locations for top local street foods 🗺️', done: false }
    ]
  }
};

const STORAGE_KEY_THEME_NAMES = 'noteflow11_theme_renames_v2';
const STORAGE_KEY_WORKBENCH_TITLE = 'noteflow11_workbench_title_v2';
const STORAGE_KEY_CUSTOM_TEMPLATE = 'noteflow11_custom_template_v2';
const STORAGE_KEY_INTERFACE_THEME = 'noteflow11_interface_theme_v2';
const STORAGE_KEY_TOPBAR_POS = 'noteflow11_topbar_pos_v2';

export function loadInterfaceTheme(): InterfaceThemeId {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INTERFACE_THEME) as InterfaceThemeId;
    return raw && INTERFACE_THEMES[raw] ? raw : 'white';
  } catch {
    return 'white';
  }
}

export function saveInterfaceTheme(themeId: InterfaceThemeId) {
  try {
    localStorage.setItem(STORAGE_KEY_INTERFACE_THEME, themeId);
  } catch {
    // Ignore
  }
}

export function loadThemeRenames(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_THEME_NAMES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveThemeRenames(renames: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY_THEME_NAMES, JSON.stringify(renames));
  } catch {
    // Ignore
  }
}

export function loadWorkbenchTitle(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WORKBENCH_TITLE);
    return raw || '阿金便利贴 · 便签工作台';
  } catch {
    return '阿金便利贴 · 便签工作台';
  }
}

export function saveWorkbenchTitle(title: string) {
  try {
    localStorage.setItem(STORAGE_KEY_WORKBENCH_TITLE, title);
  } catch {
    // Ignore
  }
}

export const DEFAULT_CUSTOM_TEMPLATE: CustomThemeTemplate = {
  name: '自定义便签',
  bgColor: '#9caf88',
  textColor: '#1f2e1b',
  accentColor: '#4a6741',
  sticker: 'bulb',
  speech: '自由定制 ✨',
  borderRadius: 16,
  hasTape: true
};

export function loadCustomTemplate(): CustomThemeTemplate {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_TEMPLATE);
    return raw ? JSON.parse(raw) : DEFAULT_CUSTOM_TEMPLATE;
  } catch {
    return DEFAULT_CUSTOM_TEMPLATE;
  }
}

export function saveCustomTemplate(tmpl: CustomThemeTemplate) {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_TEMPLATE, JSON.stringify(tmpl));
  } catch {
    // Ignore
  }
}

export function loadTopBarPos(): { x: number; y: number; isCollapsed: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TOPBAR_POS);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return { x: -1, y: 12, isCollapsed: false };
}

export function saveTopBarPos(pos: { x: number; y: number; isCollapsed: boolean }) {
  try {
    localStorage.setItem(STORAGE_KEY_TOPBAR_POS, JSON.stringify(pos));
  } catch {
    // Ignore
  }
}
