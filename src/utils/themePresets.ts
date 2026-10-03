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
  { name: '莓果酒红', nameEn: 'Berry Wine', bg: '#713b50', text: '#fff1f5', accent: '#f6a8bd' },
  { name: '极地冰蓝', nameEn: 'Polar Ice', bg: '#d6edf5', text: '#233f52', accent: '#377d9e' },
  { name: '蜜桃奶油', nameEn: 'Peach Cream', bg: '#f6cbbb', text: '#58372e', accent: '#b66a51' },
  { name: '午夜深紫', nameEn: 'Midnight Plum', bg: '#40334f', text: '#f3ebff', accent: '#c5a3e6' },
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
const NOTEBOOK_THEME: ThemeConfig = {
  id:'notebook',name:'清风横线手写',nameEn:'Breeze Notebook',badge:'清风手写',badgeEn:'Breeze Notes',category:'memo',
  bgClass:'bg-[#f5f8f6]',borderClass:'border-[#d9e4df]',textClass:'text-[#32474c]',accentColor:'#35a46b',dotColor:'#35a46b',
  defaultSticker:'none',hasTape:false,description:'清白纸张、细横线与手写墨迹',descriptionEn:'Light ruled paper and handwritten ink',
  keywords:['横线','手写'],keywordsEn:['Ruled','Handwriting'],
  defaultItems:[{text:'写下今天最想完成的一件事',textEn:'Write down one thing to do today',done:false},{text:'给自己留一点慢下来的时间',textEn:'Leave some time to slow down',done:false},{text:'记录一个值得开心的小瞬间',textEn:'Record a little happy moment',done:false}],
};
const ORIGINAL_THEME_CONFIGS: Record<Exclude<ThemeId,'redEditorial'|'colorBlock'|'appleGingham'|'blueprint'|'movieTicket'|'concertTicket'|'drinkTracker'|'bookRecord'|'lifePlan'|'romanHoliday'|'biscuit'|'folder'|'chatMemo'|'traffic'|'summerTag'|'winterPost'|'weekStrip'|'pixelCard'|'station'|'abstractLab'>, ThemeConfig> = {
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

  notebook:NOTEBOOK_THEME,
  notebookWarm:{...NOTEBOOK_THEME,id:'notebookWarm',name:'暖杏横线手帐',nameEn:'Warm Journal',badge:'暖杏手帐',badgeEn:'Warm Journal',bgClass:'bg-[#faf2e3]',borderClass:'border-[#e5d8bc]',textClass:'text-[#594c3b]',accentColor:'#9b7a42',dotColor:'#9b7a42',description:'暖杏纸张、淡横线与随性手写'},
  home: {...NOTEBOOK_THEME,id:'home',name:'家务生活清单',nameEn:'Home Routine',badge:'家务生活清单',badgeEn:'Home Routine',category:'life',bgClass:'bg-[#ecf4e7]',textClass:'text-[#37503c]',accentColor:'#709361',dotColor:'#709361',defaultSticker:'flower',defaultSpeech:'慢慢来，也很棒 ✨',defaultSpeechEn:'One step at a time',description:'家务生活清单，三条可自由修改的待办',descriptionEn:'Three editable reminders',defaultItems:[{"text":"收拾桌面，物品归位","textEn":"Tidy the desk and put things away","done":false},{"text":"换洗衣物与床单","textEn":"Wash clothes and bed linen","done":false},{"text":"给绿植浇水","textEn":"Water the plants","done":false}]},
  shopping: {...NOTEBOOK_THEME,id:'shopping',name:'购物采购清单',nameEn:'Shopping List',badge:'购物采购清单',badgeEn:'Shopping List',category:'life',bgClass:'bg-[#fff0e7]',textClass:'text-[#704435]',accentColor:'#ce865b',dotColor:'#ce865b',defaultSticker:'envelope',defaultSpeech:'慢慢来，也很棒 ✨',defaultSpeechEn:'One step at a time',description:'购物采购清单，三条可自由修改的待办',descriptionEn:'Three editable reminders',defaultItems:[{"text":"列好本周食材清单","textEn":"Plan groceries for the week","done":false},{"text":"核对库存，避免重复购买","textEn":"Check stock before buying","done":false},{"text":"出门记得带购物袋","textEn":"Bring a shopping bag","done":false}]},
  reading: {...NOTEBOOK_THEME,id:'reading',name:'阅读摘录时光',nameEn:'Reading Journal',badge:'阅读摘录时光',badgeEn:'Reading Journal',category:'study',bgClass:'bg-[#efeafa]',textClass:'text-[#4f406a]',accentColor:'#9275b5',dotColor:'#9275b5',defaultSticker:'ribbon',defaultSpeech:'慢慢来，也很棒 ✨',defaultSpeechEn:'One step at a time',description:'阅读摘录时光，三条可自由修改的待办',descriptionEn:'Three editable reminders',defaultItems:[{"text":"读完今天的十页书","textEn":"Read ten pages today","done":false},{"text":"摘录一句喜欢的话","textEn":"Save a favorite quote","done":false},{"text":"写下自己的阅读感想","textEn":"Write down your thoughts","done":false}]},
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
    defaultSticker: 'cryblob',
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
    defaultSpeech: '桌面光影',
    defaultSpeechEn: '桌面光影',
    hasTape: false,
    description: '电脑桌面 Mica 亚克力背景模糊与高光光效，通透高级',
    descriptionEn: '电脑桌面 Mica acrylic glass with smooth blur and rim lighting',
    keywords: ['Mica', '亚克力', '透明', '桌面'],
    keywordsEn: ['Mica', 'Acrylic', 'Glass', '桌面'],
    defaultItems: [
      { text: '启用 24px 亚克力背景模糊光效', textEn: 'Enable 24px acrylic backdrop blur', done: false },
      { text: '支持内容行内直接编辑与即时删减', textEn: 'Support inline direct editing and removal', done: false },
      { text: '整理今天的三件重要事项', textEn: 'Plan three important things for today', done: false }
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
    defaultSticker: 'uglypotato',
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

Object.assign(ORIGINAL_THEME_CONFIGS.minimal,{"name":"素白极简","nameEn":"Plain Minimal","badge":"素白极简","badgeEn":"Plain Minimal","description":"纯白纸面与细线，适合工作待办和快速记录","descriptionEn":"Plain Minimal paper layout for everyday notes","bgClass":"bg-[#fcfcfb]","textClass":"text-[#374151]","borderClass":"border-[#737d8c]","accentColor":"#737d8c","dotColor":"#737d8c","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.memo,{"name":"时间小票","nameEn":"Time Receipt","badge":"时间小票","badgeEn":"Time Receipt","description":"奶白热敏纸、虚线分隔和条码，记录一天的小事","descriptionEn":"Time Receipt paper layout for everyday notes","bgClass":"bg-[#faf7e9]","textClass":"text-[#302c26]","borderClass":"border-[#595349]","accentColor":"#595349","dotColor":"#595349","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.work,{"name":"荧光笔方格","nameEn":"Highlighter Grid","badge":"荧光笔方格","badgeEn":"Highlighter Grid","description":"黑框方格纸与多彩荧光划线，突出本周重点","descriptionEn":"Highlighter Grid paper layout for everyday notes","bgClass":"bg-[#ffffff]","textClass":"text-[#242424]","borderClass":"border-[#262626]","accentColor":"#262626","dotColor":"#262626","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.healing,{"name":"花草胶带手帐","nameEn":"Botanical Journal","badge":"花草胶带手帐","badgeEn":"Botanical Journal","description":"绿色胶带、柔和花草和淡点阵，写下放松的日常","descriptionEn":"Botanical Journal paper layout for everyday notes","bgClass":"bg-[#f5f3e9]","textClass":"text-[#4f6650]","borderClass":"border-[#82a06a]","accentColor":"#82a06a","dotColor":"#82a06a","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.kawaii,{"name":"草莓波点","nameEn":"Strawberry Dots","badge":"草莓波点","badgeEn":"Strawberry Dots","description":"粉白波点和红色缝线，适合可爱日记与生活清单","descriptionEn":"Strawberry Dots paper layout for everyday notes","bgClass":"bg-[#fff1f3]","textClass":"text-[#75424f]","borderClass":"border-[#cc677f]","accentColor":"#cc677f","dotColor":"#cc677f","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.fluent,{"name":"冰透玻璃","nameEn":"Frosted Glass","badge":"冰透玻璃","badgeEn":"Frosted Glass","description":"冷灰透明质感与细亮边，适合干净的桌面工作区","descriptionEn":"Frosted Glass paper layout for everyday notes","bgClass":"bg-[#e0e9f0cc]","textClass":"text-[#3b5166]","borderClass":"border-[#7b9eb8]","accentColor":"#7b9eb8","dotColor":"#7b9eb8","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.study,{"name":"蓝绿线圈本","nameEn":"Spiral Notebook","badge":"蓝绿线圈本","badgeEn":"Spiral Notebook","description":"蓝色封套、薄荷内页与线圈装订，适合学习计划","descriptionEn":"Spiral Notebook paper layout for everyday notes","bgClass":"bg-[#e3f2ed]","textClass":"text-[#3b6578]","borderClass":"border-[#72a1bf]","accentColor":"#72a1bf","dotColor":"#72a1bf","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.fitness,{"name":"七日周计划","nameEn":"Weekly Planner","badge":"七日周计划","badgeEn":"Weekly Planner","description":"米白纸、星期标记与咖色横线，安排本周目标","descriptionEn":"Weekly Planner paper layout for everyday notes","bgClass":"bg-[#f7f3eb]","textClass":"text-[#5c5147]","borderClass":"border-[#aa8b6b]","accentColor":"#aa8b6b","dotColor":"#aa8b6b","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.code,{"name":"终端备忘","nameEn":"Terminal Notes","badge":"终端备忘","badgeEn":"Terminal Notes","description":"深色终端、绿色光标与等宽排版，记录开发待办","descriptionEn":"Terminal Notes paper layout for everyday notes","bgClass":"bg-[#14201d]","textClass":"text-[#c0e8d0]","borderClass":"border-[#74c698]","accentColor":"#74c698","dotColor":"#74c698","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.foodie,{"name":"复古餐厅菜单","nameEn":"Retro Menu","badge":"复古餐厅菜单","badgeEn":"Retro Menu","description":"暖黄纸、酒红标题带与双线边框，写食谱和采购","descriptionEn":"Retro Menu paper layout for everyday notes","bgClass":"bg-[#fff4d9]","textClass":"text-[#714237]","borderClass":"border-[#a7423d]","accentColor":"#a7423d","dotColor":"#a7423d","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.creative,{"name":"拼贴灵感卡","nameEn":"Collage Card","badge":"拼贴灵感卡","badgeEn":"Collage Card","description":"紫色外框、黄绿渐变和小标签，收集创作灵感","descriptionEn":"Collage Card paper layout for everyday notes","bgClass":"bg-[#f9e7a7]","textClass":"text-[#4e4164]","borderClass":"border-[#8472ab]","accentColor":"#8472ab","dotColor":"#8472ab","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.finance,{"name":"账本票据","nameEn":"Ledger Receipt","badge":"账本票据","badgeEn":"Ledger Receipt","description":"米白账本、序号和表格分隔线，整理账单与预算","descriptionEn":"Ledger Receipt paper layout for everyday notes","bgClass":"bg-[#f7f3e9]","textClass":"text-[#414544]","borderClass":"border-[#527c77]","accentColor":"#527c77","dotColor":"#527c77","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.travel,{"name":"旅行登机票","nameEn":"Boarding Pass","badge":"旅行登机票","badgeEn":"Boarding Pass","description":"蓝色票头、虚线撕口与票号装饰，记录旅行准备","descriptionEn":"Boarding Pass paper layout for everyday notes","bgClass":"bg-[#edf5f8]","textClass":"text-[#34566b]","borderClass":"border-[#4484a5]","accentColor":"#4484a5","dotColor":"#4484a5","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.notebook,{"name":"星光手写信纸","nameEn":"Starry Letter","badge":"星光手写信纸","badgeEn":"Starry Letter","description":"细横线、蓝色星星和手写墨迹，适合摘录与随笔","descriptionEn":"Starry Letter paper layout for everyday notes","bgClass":"bg-[#fffdf2]","textClass":"text-[#455875]","borderClass":"border-[#91b5ca]","accentColor":"#91b5ca","dotColor":"#91b5ca","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.notebookWarm,{"name":"原色牛皮方格","nameEn":"Kraft Grid","badge":"原色牛皮方格","badgeEn":"Kraft Grid","description":"原色纸张、细密方格与棕红印刷边，适合随手记录","descriptionEn":"Kraft Grid paper layout for everyday notes","bgClass":"bg-[#efe0c0]","textClass":"text-[#694735]","borderClass":"border-[#905b46]","accentColor":"#905b46","dotColor":"#905b46","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.home,{"name":"厨房插画清单","nameEn":"Kitchen Notes","badge":"厨房插画清单","badgeEn":"Kitchen Notes","description":"红色装订条、蓝绿色厨房小图案与方格纸，安排家务","descriptionEn":"Kitchen Notes paper layout for everyday notes","bgClass":"bg-[#fffaf0]","textClass":"text-[#565143]","borderClass":"border-[#b34848]","accentColor":"#b34848","dotColor":"#b34848","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.shopping,{"name":"愿望清单小票","nameEn":"Wish Receipt","badge":"愿望清单小票","badgeEn":"Wish Receipt","description":"复古棕墨、愿望栏目与底部条码，收藏想做的事情","descriptionEn":"Wish Receipt paper layout for everyday notes","bgClass":"bg-[#f5e9cf]","textClass":"text-[#5b3629]","borderClass":"border-[#704335]","accentColor":"#704335","dotColor":"#704335","hasTape":false});
Object.assign(ORIGINAL_THEME_CONFIGS.reading,{"name":"文学书页","nameEn":"Book Page","badge":"文学书页","badgeEn":"Book Page","description":"暖白书页、衬线标题与红色书签，记录读书心得","descriptionEn":"Book Page paper layout for everyday notes","bgClass":"bg-[#f6f0e4]","textClass":"text-[#534738]","borderClass":"border-[#9b4e4c]","accentColor":"#9b4e4c","dotColor":"#9b4e4c","hasTape":false});

ORIGINAL_THEME_CONFIGS.minimal.defaultItems = [{"text":"整理今日重点","textEn":"Plan today","done":false},{"text":"完成一件重要的小事","textEn":"Finish one small important task","done":false},{"text":"下班前清空桌面","textEn":"Clear the desk","done":false}];
ORIGINAL_THEME_CONFIGS.kawaii.defaultItems = [{"text":"记录今天的小美好","textEn":"Keep a happy memory","done":false},{"text":"整理照片与手帐","textEn":"Sort photos and journal","done":false},{"text":"给朋友写一句祝福","textEn":"Write a kind note","done":false}];
ORIGINAL_THEME_CONFIGS.fluent.defaultItems = [{"text":"整理今日待办","textEn":"Plan today","done":false},{"text":"处理一封重要邮件","textEn":"Reply to an important email","done":false},{"text":"保存文件并备份","textEn":"Save and back up files","done":false}];
ORIGINAL_THEME_CONFIGS.shopping.defaultItems = [{"text":"去看一次日出","textEn":"Watch a sunrise","done":false},{"text":"给自己买一束花","textEn":"Buy some flowers","done":false},{"text":"探索一个新的城市","textEn":"Explore a new city","done":false}];
ORIGINAL_THEME_CONFIGS.memo.defaultItems = [{"text":"整理今天的日程","textEn":"Plan the day","done":false},{"text":"记录一段专注时间","textEn":"Record a focused session","done":false},{"text":"睡前回顾完成的事","textEn":"Review the day","done":false}];

export const DEFAULT_THEME_CONFIGS = ORIGINAL_THEME_CONFIGS as Record<ThemeId, ThemeConfig>;
DEFAULT_THEME_CONFIGS.biscuit = {...NOTEBOOK_THEME,"id":"biscuit","name":"饼干休息站","nameEn":"Biscuit Break","badge":"饼干休息站","badgeEn":"Biscuit Break","description":"饼干压纹边框与暖黄纸面，给休息留一点甜","descriptionEn":"Biscuit Break stationery for everyday reminders","bgClass":"bg-[#f8ebcf]","textClass":"text-[#45454b]","borderClass":"border-[#805b39]","accentColor":"#805b39","dotColor":"#805b39","category":"healing","defaultSticker":"biscuit","hasTape":false,"defaultSpeech":"今天也要慢慢完成呀","defaultSpeechEn":"One small task at a time","defaultItems":[{"text":"喝杯温水","textEn":"Drink some water","done":false},{"text":"伸展肩颈两分钟","textEn":"Stretch for two minutes","done":false},{"text":"安排一段休息时间","textEn":"Take a short break","done":false}]};
DEFAULT_THEME_CONFIGS.folder = {...NOTEBOOK_THEME,"id":"folder","name":"蓝色文件夹","nameEn":"Blue Folder","badge":"蓝色文件夹","badgeEn":"Blue Folder","description":"文件夹页签、蓝色装订线，整理项目资料","descriptionEn":"Blue Folder stationery for everyday reminders","bgClass":"bg-[#eff7fa]","textClass":"text-[#45454b]","borderClass":"border-[#428aaa]","accentColor":"#428aaa","dotColor":"#428aaa","category":"work","defaultSticker":"sideeye","hasTape":false,"defaultSpeech":"今天也要慢慢完成呀","defaultSpeechEn":"One small task at a time","defaultItems":[{"text":"整理项目文件","textEn":"Organize project files","done":false},{"text":"确认文件命名","textEn":"Check file names","done":false},{"text":"备份重要资料","textEn":"Back up important files","done":false}]};
DEFAULT_THEME_CONFIGS.chatMemo = {...NOTEBOOK_THEME,"id":"chatMemo","name":"聊天备忘录","nameEn":"Chat Memo","badge":"聊天备忘录","badgeEn":"Chat Memo","description":"错落聊天气泡清单，像给自己发消息","descriptionEn":"Chat Memo stationery for everyday reminders","bgClass":"bg-[#f6faf1]","textClass":"text-[#45454b]","borderClass":"border-[#709565]","accentColor":"#709565","dotColor":"#709565","category":"life","defaultSticker":"cryblob","hasTape":false,"defaultSpeech":"今天也要慢慢完成呀","defaultSpeechEn":"One small task at a time","defaultItems":[{"text":"给朋友回一条消息","textEn":"Reply to a friend","done":false},{"text":"记下一句想说的话","textEn":"Save something to say","done":false},{"text":"确认约定时间","textEn":"Confirm the meeting time","done":false}]};
DEFAULT_THEME_CONFIGS.traffic = {...NOTEBOOK_THEME,"id":"traffic","name":"施工中计划","nameEn":"Work in Progress","badge":"施工中计划","badgeEn":"Work in Progress","description":"橙色警示条与稀疏蓝色方格，标记正在推进的事情","descriptionEn":"Work in Progress stationery for everyday reminders","bgClass":"bg-[#fffaf1]","textClass":"text-[#45454b]","borderClass":"border-[#ed893b]","accentColor":"#ed893b","dotColor":"#ed893b","category":"work","defaultSticker":"deadline","hasTape":false,"defaultSpeech":"今天也要慢慢完成呀","defaultSpeechEn":"One small task at a time","defaultItems":[{"text":"先处理最紧急的一项","textEn":"Handle the most urgent task","done":false},{"text":"检查进行中的任务","textEn":"Review work in progress","done":false},{"text":"给难题留一个下一步","textEn":"Choose the next step","done":false}]};
DEFAULT_THEME_CONFIGS.summerTag = {...NOTEBOOK_THEME,"id":"summerTag","name":"夏日挂牌","nameEn":"Summer Tag","badge":"夏日挂牌","badgeEn":"Summer Tag","description":"青柠页眉、侧边页签和轻横线，记录轻松日常","descriptionEn":"Summer Tag stationery for everyday reminders","bgClass":"bg-[#fafbdc]","textClass":"text-[#45454b]","borderClass":"border-[#8fa245]","accentColor":"#8fa245","dotColor":"#8fa245","category":"life","defaultSticker":"bubbletea","hasTape":false,"defaultSpeech":"今天也要慢慢完成呀","defaultSpeechEn":"One small task at a time","defaultItems":[{"text":"准备一杯喜欢的饮料","textEn":"Make a favorite drink","done":false},{"text":"出去走一小段路","textEn":"Take a short walk","done":false},{"text":"收藏今天的小快乐","textEn":"Save a happy moment","done":false}]};
DEFAULT_THEME_CONFIGS.winterPost = {...NOTEBOOK_THEME,"id":"winterPost","name":"冬日邮笺","nameEn":"Winter Post","badge":"冬日邮笺","badgeEn":"Winter Post","description":"冰蓝邮戳与虚线信封边，写给自己的提醒","descriptionEn":"Winter Post stationery for everyday reminders","bgClass":"bg-[#eef7fc]","textClass":"text-[#45454b]","borderClass":"border-[#659ab5]","accentColor":"#659ab5","dotColor":"#659ab5","category":"healing","defaultSticker":"relaxword","hasTape":false,"defaultSpeech":"今天也要慢慢完成呀","defaultSpeechEn":"One small task at a time","defaultItems":[{"text":"穿暖一点再出门","textEn":"Dress warmly","done":false},{"text":"给自己准备热饮","textEn":"Make a warm drink","done":false},{"text":"写下今天的心情","textEn":"Write about your mood","done":false}]};
DEFAULT_THEME_CONFIGS.weekStrip = {...NOTEBOOK_THEME,"id":"weekStrip","name":"一周计划条","nameEn":"Weekly Strip","badge":"一周计划条","badgeEn":"Weekly Strip","description":"七日页眉与绿色侧栏，拆分本周安排","descriptionEn":"Weekly Strip stationery for everyday reminders","bgClass":"bg-[#f6faf4]","textClass":"text-[#45454b]","borderClass":"border-[#46865b]","accentColor":"#46865b","dotColor":"#46865b","category":"work","defaultSticker":"cheerword","hasTape":false,"defaultSpeech":"今天也要慢慢完成呀","defaultSpeechEn":"One small task at a time","defaultItems":[{"text":"选定本周三个重点","textEn":"Choose three weekly priorities","done":false},{"text":"为重点安排时间","textEn":"Schedule focused time","done":false},{"text":"周末回顾完成情况","textEn":"Review the week","done":false}]};
DEFAULT_THEME_CONFIGS.pixelCard = {...NOTEBOOK_THEME,"id":"pixelCard","name":"像素任务卡","nameEn":"Pixel Quest","badge":"像素任务卡","badgeEn":"Pixel Quest","description":"紫黄像素边角与任务刻度，像完成游戏关卡","descriptionEn":"Pixel Quest stationery for everyday reminders","bgClass":"bg-[#fffde1]","textClass":"text-[#45454b]","borderClass":"border-[#7366ac]","accentColor":"#7366ac","dotColor":"#7366ac","category":"work","defaultSticker":"brainfog","hasTape":false,"defaultSpeech":"今天也要慢慢完成呀","defaultSpeechEn":"One small task at a time","defaultItems":[{"text":"解锁今天第一项任务","textEn":"Unlock the first task","done":false},{"text":"清理一个卡住的难题","textEn":"Resolve one obstacle","done":false},{"text":"记下获得的新经验","textEn":"Record a lesson learned","done":false}]};
DEFAULT_THEME_CONFIGS.station = {...NOTEBOOK_THEME,"id":"station","name":"幸福到站","nameEn":"Happy Station","badge":"幸福到站","badgeEn":"Happy Station","description":"红色站牌页眉、路线节点和车票留白，安排出发","descriptionEn":"Happy Station stationery for everyday reminders","bgClass":"bg-[#fff8ee]","textClass":"text-[#45454b]","borderClass":"border-[#bb4c49]","accentColor":"#bb4c49","dotColor":"#bb4c49","category":"travel","defaultSticker":"crocodile","hasTape":false,"defaultSpeech":"今天也要慢慢完成呀","defaultSpeechEn":"One small task at a time","defaultItems":[{"text":"确认目的地与时间","textEn":"Confirm the destination and time","done":false},{"text":"整理随身物品","textEn":"Pack the essentials","done":false},{"text":"留一点时间慢慢逛","textEn":"Leave time to explore","done":false}]};
DEFAULT_THEME_CONFIGS.abstractLab = {...NOTEBOOK_THEME,"id":"abstractLab","name":"抽象灵感室","nameEn":"Abstract Lab","badge":"抽象灵感室","badgeEn":"Abstract Lab","description":"不规则色块只留在边角，收集脑洞和草稿","descriptionEn":"Abstract Lab stationery for everyday reminders","bgClass":"bg-[#f6f3fb]","textClass":"text-[#45454b]","borderClass":"border-[#8777aa]","accentColor":"#8777aa","dotColor":"#8777aa","category":"work","defaultSticker":"uglypotato","hasTape":false,"defaultSpeech":"今天也要慢慢完成呀","defaultSpeechEn":"One small task at a time","defaultItems":[{"text":"记录一个离谱的点子","textEn":"Save an unusual idea","done":false},{"text":"画一张简单草图","textEn":"Draw a simple sketch","done":false},{"text":"尝试一个小实验","textEn":"Try a small experiment","done":false}]};
DEFAULT_THEME_CONFIGS.redEditorial = {...NOTEBOOK_THEME,"id":"redEditorial","name":"酒红分栏笔记","nameEn":"Red Editorial","badge":"酒红分栏笔记","badgeEn":"Red Editorial","description":"酒红印刷页眉、红色侧栏与细横线，适合会议要点","descriptionEn":"Red Editorial paper design","bgClass":"bg-[#fff5e9]","textClass":"text-[#693f36]","borderClass":"border-[#862d30]","accentColor":"#862d30","dotColor":"#862d30","category":"work","defaultSticker":"stamp","defaultSpeech":"把想做的事写下来 ✨","defaultSpeechEn":"Put your ideas on paper","defaultItems":[{"text":"记录会议的关键决定","textEn":"记录会议的关键决定","done":false},{"text":"整理需要跟进的事项","textEn":"整理需要跟进的事项","done":false},{"text":"确认下一次沟通时间","textEn":"确认下一次沟通时间","done":false}]};
DEFAULT_THEME_CONFIGS.colorBlock = {...NOTEBOOK_THEME,"id":"colorBlock","name":"蓝粉色块计划","nameEn":"Color Block","badge":"蓝粉色块计划","badgeEn":"Color Block","description":"蓝粉拼色、留白与轻方格，适合每日安排","descriptionEn":"Color Block paper design","bgClass":"bg-[#f5eedc]","textClass":"text-[#3e5263]","borderClass":"border-[#8199bf]","accentColor":"#8199bf","dotColor":"#8199bf","category":"memo","defaultSticker":"washi","defaultSpeech":"把想做的事写下来 ✨","defaultSpeechEn":"Put your ideas on paper","defaultItems":[{"text":"确定今天最重要的事","textEn":"确定今天最重要的事","done":false},{"text":"给休息留出时间","textEn":"给休息留出时间","done":false},{"text":"下班前整理明日计划","textEn":"下班前整理明日计划","done":false}]};
DEFAULT_THEME_CONFIGS.appleGingham = {...NOTEBOOK_THEME,"id":"appleGingham","name":"苹果格纹日常","nameEn":"Apple Gingham","badge":"苹果格纹日常","badgeEn":"Apple Gingham","description":"苹果小图案、红色格纹胶带与奶油纸，记录生活","descriptionEn":"Apple Gingham paper design","bgClass":"bg-[#fff8e6]","textClass":"text-[#734537]","borderClass":"border-[#c9776c]","accentColor":"#c9776c","dotColor":"#c9776c","category":"life","defaultSticker":"apple","defaultSpeech":"把想做的事写下来 ✨","defaultSpeechEn":"Put your ideas on paper","defaultItems":[{"text":"吃一份新鲜水果","textEn":"吃一份新鲜水果","done":false},{"text":"记录一件开心的小事","textEn":"记录一件开心的小事","done":false},{"text":"完成今日家务清单","textEn":"完成今日家务清单","done":false}]};
DEFAULT_THEME_CONFIGS.blueprint = {...NOTEBOOK_THEME,"id":"blueprint","name":"蓝调工程方格","nameEn":"Blueprint","badge":"蓝调工程方格","badgeEn":"Blueprint","description":"深蓝细网格、技术标注与直角框，拆解项目步骤","descriptionEn":"Blueprint paper design","bgClass":"bg-[#668aa8]","textClass":"text-[#f4faff]","borderClass":"border-[#e0eff9]","accentColor":"#e0eff9","dotColor":"#e0eff9","category":"code","defaultSticker":"pencil","defaultSpeech":"把想做的事写下来 ✨","defaultSpeechEn":"Put your ideas on paper","defaultItems":[{"text":"拆解一个具体的需求","textEn":"拆解一个具体的需求","done":false},{"text":"完成今天的实现步骤","textEn":"完成今天的实现步骤","done":false},{"text":"检查并记录测试结果","textEn":"检查并记录测试结果","done":false}]};
DEFAULT_THEME_CONFIGS.movieTicket = {...NOTEBOOK_THEME,"id":"movieTicket","name":"复古电影票根","nameEn":"Movie Ticket","badge":"复古电影票根","badgeEn":"Movie Ticket","description":"粉棕票根、齿孔和胶片边，安排观影与记录感想","descriptionEn":"Movie Ticket paper design","bgClass":"bg-[#e8cdc9]","textClass":"text-[#673e44]","borderClass":"border-[#a7626c]","accentColor":"#a7626c","dotColor":"#a7626c","category":"life","defaultSticker":"ticket","defaultSpeech":"把想做的事写下来 ✨","defaultSpeechEn":"Put your ideas on paper","defaultItems":[{"text":"挑选一部想看的电影","textEn":"挑选一部想看的电影","done":false},{"text":"确认放映时间与地点","textEn":"确认放映时间与地点","done":false},{"text":"写下看完后的感想","textEn":"写下看完后的感想","done":false}]};
DEFAULT_THEME_CONFIGS.concertTicket = {...NOTEBOOK_THEME,"id":"concertTicket","name":"薄荷演出票","nameEn":"Concert Ticket","badge":"薄荷演出票","badgeEn":"Concert Ticket","description":"薄荷纸、侧边票孔与黑色票号，记录演出行程","descriptionEn":"Concert Ticket paper design","bgClass":"bg-[#d9e7ce]","textClass":"text-[#3e5748]","borderClass":"border-[#779874]","accentColor":"#779874","dotColor":"#779874","category":"travel","defaultSticker":"headphone","defaultSpeech":"把想做的事写下来 ✨","defaultSpeechEn":"Put your ideas on paper","defaultItems":[{"text":"确认演出日期和地点","textEn":"确认演出日期和地点","done":false},{"text":"保存电子票与交通路线","textEn":"保存电子票与交通路线","done":false},{"text":"整理出门需要带的物品","textEn":"整理出门需要带的物品","done":false}]};
DEFAULT_THEME_CONFIGS.drinkTracker = {...NOTEBOOK_THEME,"id":"drinkTracker","name":"饮水记录卡","nameEn":"Drink Tracker","badge":"饮水记录卡","badgeEn":"Drink Tracker","description":"冰蓝纸张、杯子标记和表格横线，提醒日常补水","descriptionEn":"Drink Tracker paper design","bgClass":"bg-[#e7f0f6]","textClass":"text-[#4a6076]","borderClass":"border-[#8ea9c2]","accentColor":"#8ea9c2","dotColor":"#8ea9c2","category":"fitness","defaultSticker":"teapot","defaultSpeech":"把想做的事写下来 ✨","defaultSpeechEn":"Put your ideas on paper","defaultItems":[{"text":"上午记得喝一杯水","textEn":"上午记得喝一杯水","done":false},{"text":"下午补充饮水并活动","textEn":"下午补充饮水并活动","done":false},{"text":"晚间回顾今天的饮水","textEn":"晚间回顾今天的饮水","done":false}]};
DEFAULT_THEME_CONFIGS.bookRecord = {...NOTEBOOK_THEME,"id":"bookRecord","name":"阅读档案卡","nameEn":"Book Record","badge":"阅读档案卡","badgeEn":"Book Record","description":"象牙卡片、评分星标与档案栏线，整理阅读摘录","descriptionEn":"Book Record paper design","bgClass":"bg-[#f7f3e7]","textClass":"text-[#575749]","borderClass":"border-[#999579]","accentColor":"#999579","dotColor":"#999579","category":"study","defaultSticker":"books","defaultSpeech":"把想做的事写下来 ✨","defaultSpeechEn":"Put your ideas on paper","defaultItems":[{"text":"写下书名与作者","textEn":"写下书名与作者","done":false},{"text":"摘录一个喜欢的段落","textEn":"摘录一个喜欢的段落","done":false},{"text":"记下自己的阅读评价","textEn":"记下自己的阅读评价","done":false}]};
DEFAULT_THEME_CONFIGS.lifePlan = {...NOTEBOOK_THEME,"id":"lifePlan","name":"青蓝人生计划","nameEn":"Life Plan","badge":"青蓝人生计划","badgeEn":"Life Plan","description":"大字标题、青蓝色块和细分隔，规划阶段目标","descriptionEn":"Life Plan paper design","bgClass":"bg-[#f6f8f7]","textClass":"text-[#263e47]","borderClass":"border-[#76cce0]","accentColor":"#76cce0","dotColor":"#76cce0","category":"work","defaultSticker":"clock","defaultSpeech":"把想做的事写下来 ✨","defaultSpeechEn":"Put your ideas on paper","defaultItems":[{"text":"选定一个阶段目标","textEn":"选定一个阶段目标","done":false},{"text":"拆解本周的行动步骤","textEn":"拆解本周的行动步骤","done":false},{"text":"记录完成进度与收获","textEn":"记录完成进度与收获","done":false}]};
DEFAULT_THEME_CONFIGS.romanHoliday = {...NOTEBOOK_THEME,"id":"romanHoliday","name":"罗马假日留白","nameEn":"Roman Holiday","badge":"罗马假日留白","badgeEn":"Roman Holiday","description":"轻量杂志排版、彩色点缀和大片留白，记录灵感","descriptionEn":"Roman Holiday paper design","bgClass":"bg-[#fffef9]","textClass":"text-[#424346]","borderClass":"border-[#a7b774]","accentColor":"#a7b774","dotColor":"#a7b774","category":"healing","defaultSticker":"camera","defaultSpeech":"把想做的事写下来 ✨","defaultSpeechEn":"Put your ideas on paper","defaultItems":[{"text":"发现一个喜欢的地方","textEn":"发现一个喜欢的地方","done":false},{"text":"写下今天的新鲜灵感","textEn":"写下今天的新鲜灵感","done":false},{"text":"留一段时间自在散步","textEn":"留一段时间自在散步","done":false}]};

for (const theme of Object.values(DEFAULT_THEME_CONFIGS)) {
  const replacements: Partial<Record<import('../types').StickerId, import('../types').StickerId>> = {clown:'stamp',doge:'pencil',duck:'toaster',shiba:'washi',bunny:'clip',sloth:'clock',penguin:'ticket',redpanda:'teapot',sleepypig:'apple',meme:'checkmark'};
  theme.defaultSticker = replacements[theme.defaultSticker] || theme.defaultSticker;
}
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
