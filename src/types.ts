export type ThemeId = 
  | 'custom'    // 自定义专属便签 (#0 放在最前面)
  | 'pet'       // 萌宠日记 (Pet Diary)
  | 'minimal'   // 极简工作流 (Sage Minimal)
  | 'kawaii'    // 可爱手帐 (Kawaii Journal)
  | 'fluent'    // Fluent 亚克力 (Mica Acrylic)
  | 'work'      // 工作办公 · P0攻坚 (Executive Office)
  | 'healing'   // 松弛治愈 · 情绪调节 (Gentle Healing)
  | 'memo'      // 临时备忘录 · 速记黄 (Quick Memo)
  | 'study'     // 沉浸考研学习 · 冲刺打卡 (Study & Exam)
  | 'fitness'   // 燃脂运动打卡 · 活力塑形 (Fitness & Health)
  | 'code'      // 赛博极客代码 · 黑客暗黑 (Cyber Dev & Code)
  | 'foodie'    // 美食日记 · 舌尖美味 (Foodie Gourmet)
  | 'creative'  // 灵感画布 · 创意手稿 (Creative Studio)
  | 'finance'   // 理财记账 · 财富自由 (Wealth & Finance)
  | 'travel'
  | 'notebook'
  | 'notebookWarm' | 'home' | 'shopping' | 'reading' | 'redEditorial' | 'colorBlock' | 'appleGingham' | 'blueprint' | 'movieTicket' | 'concertTicket' | 'drinkTracker' | 'bookRecord' | 'lifePlan' | 'romanHoliday' | 'biscuit' | 'folder' | 'chatMemo' | 'traffic' | 'summerTag' | 'winterPost' | 'weekStrip' | 'pixelCard' | 'station' | 'abstractLab';

export type StickerId = 
  | 'clown'     // 🤡 搞怪小丑假笑 (新增搞怪贴纸1)
  | 'doge'      // 🐶 魔性狗头斜眼柴犬 (新增搞怪贴纸2)
  | 'ghost'     // 👻 搞怪吐舌幽灵 (新增搞怪贴纸3)
  | 'capybara'  // 🍊 卡皮巴拉顶橘子
  | 'cat'       // 🐱 毛线球小猫
  | 'duck'      // 🦆 水手呆萌鸭
  | 'shiba'     // 🐕 招手小柴犬
  | 'bunny'     // 🐰 胡萝卜小兔
  | 'sloth'     // 🦥 治愈树懒
  | 'penguin'   // 🐧 围巾小企鹅
  | 'redpanda'  // 🐾 软萌小熊猫
  | 'cafe'      // ☕ 咖啡甜甜圈
  | 'pomodoro'  // 🍅 番茄专注钟
  | 'books'     // 📚 堆叠书本与绿叶
  | 'avocado'   // 🥑 搞怪微笑牛油果
  | 'meme'      // 🤪 搞怪吐舌头表情包
  | 'burger'    // 🍔 芝士美味汉堡
  | 'gamepad'   // 🎮 潮流游戏手柄
  | 'sleepypig' // 💤 贪睡小猪猪
  | 'bulb'      // 💡 灵感点子灯泡
  | 'headphone' // 🎧 音乐发烧耳机
  | 'rocket'    // 🚀 效率冲天火箭
  | 'teddy'     // 🧸 治愈泰迪小熊
  | 'flower' | 'cloud' | 'camera' | 'planet' | 'envelope' | 'ribbon'
  | 'pencil' | 'washi' | 'clip' | 'stamp' | 'clock' | 'ticket' | 'toaster' | 'teapot' | 'apple' | 'checkmark'
  | 'bubbletea' | 'cryblob' | 'sideeye' | 'brainfog' | 'uglypotato' | 'crocodile' | 'deadline' | 'relaxword' | 'cheerword' | 'biscuit'
  | 'battery' | 'snailmail' | 'riceball'
  | 'none';     // 无贴纸

export type FontFamilyId = 'sans' | 'mono' | 'rounded' | 'serif' | 'kai' | 'mashanzheng' | 'longcang' | 'zhimangxing' | 'zcool' | 'jason1' | 'jason2' | 'jason3' | 'jason4' | 'jason5' | 'jason6' | 'jason7' | 'jason8' | 'jason9' | 'liujianmaocao' | 'xiaowei' | 'qingke' | 'fangsong' | 'dengxian' | 'jhenghei';

export type FontSizeId = 'sm' | 'base' | 'lg';

export type InterfaceThemeId = 'white' | 'obsidian' | 'morandi' | 'sage' | 'cyber';

export interface InterfaceThemeConfig {
  id: InterfaceThemeId;
  name: string;
  nameEn: string;
  consoleBg: string;
  consoleHeaderBg: string;
  consoleBorder: string;
  consoleText: string;
  consoleSubtext: string;
  consoleCardBg: string;
  consoleCardBorder: string;
  bgGradient: string;
  ambientGlow: string;
  barBg: string;
  taskbarBg: string;
  accentColor: string;
  dotColor: string;
  previewColor: string;
  isLightMode?: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  textEn?: string;
  done: boolean;
}

export interface StickyNote {
  id: string;
  headerName?: string;
  sizeLocked?: boolean;
  titleFontSize?: number;
  bodyFontSize?: number;
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  theme: ThemeId;
  items: ChecklistItem[];
  content?: string;
  isPlainNote?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  pinned: boolean;
  collapsed: boolean;
  opacity: number;
  borderRadius: number;
  fontSize: FontSizeId;
  fontFamily: FontFamilyId;
  sticker: StickerId;
  stickerSize?: number;
  speechBubble?: string;
  speechBubbleEn?: string;
  hideSpeechBubble?: boolean;
  washiTape?: boolean;
  hasPetWidget?: boolean;
  customBgColor?: string;
  customTextColor?: string;
  customAccentColor?: string;
  createdAt: string;
  category: 'custom' | 'work' | 'pet' | 'kawaii' | 'healing' | 'memo' | 'study' | 'fitness' | 'code' | 'life' | 'finance' | 'travel';
  completedAt?: string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  nameEn: string;
  badge: string;
  badgeEn: string;
  category: 'custom' | 'work' | 'pet' | 'kawaii' | 'healing' | 'memo' | 'study' | 'fitness' | 'code' | 'life' | 'finance' | 'travel';
  bgClass: string;
  borderClass: string;
  textClass: string;
  accentColor: string;
  dotColor: string;
  defaultSticker: StickerId;
  defaultSpeech?: string;
  defaultSpeechEn?: string;
  hasTape?: boolean;
  description: string;
  descriptionEn: string;
  keywords: string[];
  keywordsEn: string[];
  defaultItems: { text: string; textEn: string; done: boolean }[];
}

export interface CustomThemeTemplate {
  name: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  sticker: StickerId;
  speech: string;
  borderRadius: number;
  hasTape: boolean;
}
