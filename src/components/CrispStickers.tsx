import React from 'react';
import { StickerId } from '../types';

interface CrispStickerProps {
  sticker: StickerId;
  className?: string;
  size?: number;
}

export const CrispSticker: React.FC<CrispStickerProps> = ({ 
  sticker, 
  className = '', 
  size = 56 
}) => {
  if (sticker === 'none') return null;

  switch (sticker) {
    case 'clown':
      // 0-A. 🤡 搞怪小丑假笑 (Goofy Clown Meme)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Colorful curly clown hair left & right */}
          <circle cx="22" cy="38" r="10" fill="#EF4444" />
          <circle cx="20" cy="50" r="9" fill="#F59E0B" />
          <circle cx="24" cy="62" r="8" fill="#10B981" />
          <circle cx="78" cy="38" r="10" fill="#3B82F6" />
          <circle cx="80" cy="50" r="9" fill="#8B5CF6" />
          <circle cx="76" cy="62" r="8" fill="#EC4899" />
          {/* Clown Head */}
          <circle cx="50" cy="52" r="28" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Blue star eye makeup */}
          <path d="M38 34L40 42L48 42L42 46L44 54L38 49L32 54L34 46L28 42L36 42Z" fill="#38BDF8" />
          <circle cx="38" cy="46" r="3" fill="#0F172A" />
          <circle cx="37" cy="45" r="1" fill="#FFFFFF" />
          {/* Right eye with cross or wink */}
          <path d="M62 34L64 42L72 42L66 46L68 54L62 49L56 54L58 46L52 42L60 42Z" fill="#F472B6" />
          <circle cx="62" cy="46" r="3" fill="#0F172A" />
          <circle cx="61" cy="45" r="1" fill="#FFFFFF" />
          {/* Eyebrows arch */}
          <path d="M32 38Q38 32 44 38" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M56 38Q62 32 68 38" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
          {/* Big Shiny Red Bulbous Clown Nose */}
          <circle cx="50" cy="54" r="8" fill="#DC2626" />
          <circle cx="47" cy="51" r="2.5" fill="#FFA8A8" />
          {/* Exaggerated Red Clown Smile */}
          <path d="M32 62C38 78 62 78 68 62" stroke="#DC2626" strokeWidth="4.5" strokeLinecap="round" fill="#FFFFFF" />
          <path d="M36 65C42 74 58 74 64 65" fill="#EF4444" />
          <circle cx="29" cy="61" r="3" fill="#DC2626" />
          <circle cx="71" cy="61" r="3" fill="#DC2626" />
          {/* Little Party Hat */}
          <polygon points="50,6 40,26 60,26" fill="#F59E0B" />
          <circle cx="50" cy="5" r="4" fill="#EC4899" />
        </svg>
      );

    case 'doge':
      // 0-B. 🐶 魔性狗头斜眼柴犬 (Doge Meme Face)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ears */}
          <polygon points="26,36 14,14 42,22" fill="#D97706" />
          <polygon points="26,33 18,18 38,24" fill="#FDE68A" />
          <polygon points="74,36 86,14 58,22" fill="#D97706" />
          <polygon points="74,33 82,18 62,24" fill="#FDE68A" />
          {/* Chubby Round Head */}
          <circle cx="50" cy="52" r="30" fill="#D97706" />
          <ellipse cx="50" cy="60" rx="22" ry="17" fill="#FEF3C7" />
          {/* Sassy Eyebrows */}
          <path d="M30 38Q36 31 43 37" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <path d="M57 33Q65 29 70 36" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          {/* Classic Suspicious Side-Eye / Doge Glare */}
          <ellipse cx="37" cy="46" rx="6" ry="7" fill="#FFFFFF" stroke="#78350F" strokeWidth="1.5" />
          <ellipse cx="34" cy="46" rx="3.5" ry="4.5" fill="#0F172A" />
          <circle cx="33" cy="44" r="1.5" fill="#FFFFFF" />
          <ellipse cx="63" cy="46" rx="6" ry="7" fill="#FFFFFF" stroke="#78350F" strokeWidth="1.5" />
          <ellipse cx="60" cy="46" rx="3.5" ry="4.5" fill="#0F172A" />
          <circle cx="59" cy="44" r="1.5" fill="#FFFFFF" />
          {/* Shiny Nose */}
          <ellipse cx="50" cy="56" rx="5" ry="4" fill="#0F172A" />
          <circle cx="48" cy="55" r="1.5" fill="#FFFFFF" />
          {/* Smug Mischievous Smile */}
          <path d="M42 63Q46 68 50 62Q54 68 59 62" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
          {/* Little Blush */}
          <circle cx="28" cy="56" r="4.5" fill="#F87171" fillOpacity="0.5" />
          <circle cx="72" cy="56" r="4.5" fill="#F87171" fillOpacity="0.5" />
        </svg>
      );

    case 'ghost':
      // 0-C. 👻 搞怪吐舌幽灵 (Goofy Prank Ghost)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Floating Ghost Body with Wavy Tail */}
          <path d="M50 14C32 14 24 28 24 48C24 64 20 78 28 84C34 88 38 80 44 84C48 87 52 87 56 84C62 80 66 88 72 84C80 78 76 64 76 48C76 28 68 14 50 14Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          {/* Spooky / Goofy Wobbly Little Arms */}
          <path d="M24 50C16 48 10 52 14 58C18 64 24 58 24 54" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M76 50C84 48 90 52 86 58C82 64 76 58 76 54" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          {/* Playful Spiral / Cross Eyes */}
          <ellipse cx="40" cy="40" rx="4.5" ry="6" fill="#0F172A" />
          <circle cx="38" cy="38" r="1.8" fill="#FFFFFF" />
          <ellipse cx="60" cy="40" rx="4.5" ry="6" fill="#0F172A" />
          <circle cx="58" cy="38" r="1.8" fill="#FFFFFF" />
          {/* Wide Open Mouth with Pink Tongue Sticking Out */}
          <ellipse cx="50" cy="53" rx="8" ry="7" fill="#0F172A" />
          <path d="M46 54C46 64 54 64 54 54Z" fill="#EC4899" />
          <path d="M50 55V61" stroke="#BE185D" strokeWidth="1" />
          {/* Rosy Blush */}
          <ellipse cx="32" cy="48" rx="4" ry="2.5" fill="#FDA4AF" fillOpacity="0.7" />
          <ellipse cx="68" cy="48" rx="4" ry="2.5" fill="#FDA4AF" fillOpacity="0.7" />
        </svg>
      );

    case 'capybara':
      // 1. 🍊 卡皮巴拉顶橘子 (Capybara)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="19" r="11" fill="#FF8A00" />
          <path d="M50 8C52 4 55 5 57 7C55 10 52 10 50 8Z" fill="#38A169" />
          <ellipse cx="47" cy="16" rx="2" ry="1" fill="#FFA94D" />
          <rect x="24" y="27" width="52" height="52" rx="22" fill="#B27341" />
          <rect x="20" y="44" width="60" height="36" rx="18" fill="#C48855" />
          <ellipse cx="25" cy="33" rx="6" ry="8" fill="#8C5326" />
          <ellipse cx="25" cy="33" rx="3.5" ry="5" fill="#E2A77A" />
          <ellipse cx="75" cy="33" rx="6" ry="8" fill="#8C5326" />
          <ellipse cx="75" cy="33" rx="3.5" ry="5" fill="#E2A77A" />
          <path d="M34 46Q40 43 44 46" stroke="#2D1A0E" strokeWidth="3" strokeLinecap="round" />
          <path d="M56 46Q60 43 66 46" stroke="#2D1A0E" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="50" cy="62" rx="14" ry="11" fill="#7E4720" />
          <ellipse cx="46" cy="60" rx="2.5" ry="3.5" fill="#2D1A0E" />
          <ellipse cx="54" cy="60" rx="2.5" ry="3.5" fill="#2D1A0E" />
          <path d="M50 64V68" stroke="#2D1A0E" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="31" cy="56" r="4.5" fill="#FF9478" fillOpacity="0.5" />
          <circle cx="69" cy="56" r="4.5" fill="#FF9478" fillOpacity="0.5" />
          <ellipse cx="36" cy="81" rx="8" ry="6" fill="#8C5326" />
          <ellipse cx="64" cy="81" rx="8" ry="6" fill="#8C5326" />
        </svg>
      );

    case 'cat':
      // 2. 🐱 萌萌猫咪抱毛线球 (Kitten with Yarn)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 40L30 18C33 16 39 24 40 28" fill="#F8FAFC" />
          <path d="M25 36L30 22C32 21 36 26 37 28" fill="#F472B6" />
          <path d="M78 40L70 18C67 16 61 24 60 28" fill="#F8FAFC" />
          <path d="M75 36L70 22C68 21 64 26 63 28" fill="#F472B6" />
          <ellipse cx="50" cy="46" rx="30" ry="24" fill="#FFFFFF" />
          <ellipse cx="38" cy="44" rx="4.5" ry="6" fill="#334155" />
          <circle cx="36.5" cy="42" r="1.8" fill="#FFFFFF" />
          <ellipse cx="62" cy="44" rx="4.5" ry="6" fill="#334155" />
          <circle cx="60.5" cy="42" r="1.8" fill="#FFFFFF" />
          <polygon points="50,51 47,49 53,49" fill="#F472B6" />
          <path d="M47 53Q50 56 50 52Q50 56 53 53" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M24 45L12 43M24 48L11 48M24 51L13 54" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M76 45L88 43M76 48L89 48M76 51L87 54" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="32" cy="52" rx="4" ry="2.5" fill="#FDA4AF" fillOpacity="0.6" />
          <ellipse cx="68" cy="52" rx="4" ry="2.5" fill="#FDA4AF" fillOpacity="0.6" />
          <circle cx="50" cy="76" r="15" fill="#EC4899" />
          <path d="M40 72Q50 68 60 72M38 78Q50 84 62 78M44 65Q54 75 48 88" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />
          <path d="M62 82C66 84 72 82 76 86" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="38" cy="67" rx="6" ry="5" fill="#FFFFFF" />
          <ellipse cx="62" cy="67" rx="6" ry="5" fill="#FFFFFF" />
        </svg>
      );

    case 'duck':
      // 3. 🦆 呆萌水手鸭 (Sailor Duck)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="58" rx="28" ry="26" fill="#FFFFFF" />
          <ellipse cx="44" cy="22" rx="18" ry="7" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
          <path d="M30 22C30 14 36 10 45 10C54 10 58 14 58 22" fill="#0284C7" />
          <rect x="36" y="16" width="16" height="4" rx="2" fill="#E0F2FE" />
          <path d="M56 22L68 18M57 24L66 28" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
          <circle cx="38" cy="40" r="4.5" fill="#0F172A" />
          <circle cx="36.5" cy="38" r="1.5" fill="#FFFFFF" />
          <circle cx="62" cy="40" r="4.5" fill="#0F172A" />
          <circle cx="60.5" cy="38" r="1.5" fill="#FFFFFF" />
          <path d="M35 48C35 44 43 42 50 42C57 42 65 44 65 48C65 54 57 58 50 58C43 58 35 54 35 48Z" fill="#F59E0B" />
          <circle cx="28" cy="49" r="4.5" fill="#F43F5E" fillOpacity="0.4" />
          <circle cx="72" cy="49" r="4.5" fill="#F43F5E" fillOpacity="0.4" />
          <path d="M30 68C36 78 64 78 70 68L62 82C56 86 44 86 38 82Z" fill="#0284C7" />
          <circle cx="50" cy="74" r="3.5" fill="#F59E0B" />
        </svg>
      );

    case 'shiba':
      // 4. 🐕 招手小柴犬 (Shiba Inu)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 34L32 14C35 12 40 20 42 26" fill="#D97706" />
          <path d="M26 31L32 18C34 17 38 21 39 25" fill="#FDE68A" />
          <path d="M78 34L68 14C65 12 60 20 58 26" fill="#D97706" />
          <path d="M74 31L68 18C66 17 62 21 61 25" fill="#FDE68A" />
          <ellipse cx="50" cy="48" rx="30" ry="26" fill="#D97706" />
          <ellipse cx="50" cy="56" rx="20" ry="16" fill="#FFFBEB" />
          <circle cx="34" cy="38" r="4" fill="#FFFBEB" />
          <circle cx="66" cy="38" r="4" fill="#FFFBEB" />
          <ellipse cx="38" cy="46" rx="4" ry="5" fill="#1E293B" />
          <circle cx="36.5" cy="44" r="1.5" fill="#FFFFFF" />
          <ellipse cx="62" cy="46" rx="4" ry="5" fill="#1E293B" />
          <circle cx="60.5" cy="44" r="1.5" fill="#FFFFFF" />
          <polygon points="50,56 46,52 54,52" fill="#0F172A" />
          <path d="M45 59Q50 63 50 58Q50 63 55 59" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
          <circle cx="31" cy="54" r="4" fill="#F87171" fillOpacity="0.5" />
          <circle cx="69" cy="54" r="4" fill="#F87171" fillOpacity="0.5" />
          <ellipse cx="78" cy="68" rx="8" ry="10" transform="rotate(-25 78 68)" fill="#D97706" />
          <ellipse cx="78" cy="68" rx="6" ry="7" transform="rotate(-25 78 68)" fill="#FFFBEB" />
        </svg>
      );

    case 'bunny':
      // 5. 🐰 软萌小兔抱胡萝卜 (Fluffy Bunny)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="36" cy="24" rx="8" ry="20" fill="#FFFFFF" />
          <ellipse cx="36" cy="24" rx="4.5" ry="14" fill="#FBCFE8" />
          <ellipse cx="64" cy="24" rx="8" ry="20" fill="#FFFFFF" />
          <ellipse cx="64" cy="24" rx="4.5" ry="14" fill="#FBCFE8" />
          <ellipse cx="50" cy="54" rx="28" ry="24" fill="#FFFFFF" />
          <circle cx="38" cy="50" r="4.5" fill="#475569" />
          <circle cx="36.5" cy="48" r="1.5" fill="#FFFFFF" />
          <circle cx="62" cy="50" r="4.5" fill="#475569" />
          <circle cx="60.5" cy="48" r="1.5" fill="#FFFFFF" />
          <polygon points="50,56 47,53 53,53" fill="#F472B6" />
          <path d="M47 58Q50 61 50 57Q50 61 53 58" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="31" cy="56" r="4.5" fill="#FDA4AF" fillOpacity="0.6" />
          <circle cx="69" cy="56" r="4.5" fill="#FDA4AF" fillOpacity="0.6" />
          <path d="M42 74L58 88L64 80L48 66Z" fill="#FB923C" />
          <path d="M42 66L36 60M44 68L40 58M47 70L46 62" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'sloth':
      // 6. 🦥 治愈树懒 (Sloth)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="48" rx="28" ry="25" fill="#A8A29E" />
          <ellipse cx="50" cy="50" rx="22" ry="18" fill="#F5F5F4" />
          <ellipse cx="38" cy="48" rx="7" ry="5" transform="rotate(15 38 48)" fill="#78716C" />
          <ellipse cx="62" cy="48" rx="7" ry="5" transform="rotate(-15 62 48)" fill="#78716C" />
          <path d="M34 49Q38 45 42 49" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M58 49Q62 45 66 49" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#292524" />
          <path d="M46 62Q50 66 54 62" stroke="#292524" strokeWidth="2" strokeLinecap="round" />
          <path d="M50 24C55 18 64 20 62 26C60 30 52 28 50 24Z" fill="#16A34A" />
        </svg>
      );

    case 'penguin':
      // 7. 🐧 围巾小企鹅 (Penguin)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="52" rx="28" ry="30" fill="#0F172A" />
          <ellipse cx="50" cy="56" rx="19" ry="22" fill="#FFFFFF" />
          <ellipse cx="40" cy="42" rx="3.5" ry="5" fill="#0F172A" />
          <circle cx="39" cy="40" r="1.2" fill="#FFFFFF" />
          <ellipse cx="60" cy="42" rx="3.5" ry="5" fill="#0F172A" />
          <circle cx="59" cy="40" r="1.2" fill="#FFFFFF" />
          <polygon points="50,47 44,53 56,53" fill="#F59E0B" />
          <circle cx="32" cy="48" r="3.5" fill="#FDA4AF" />
          <circle cx="68" cy="48" r="3.5" fill="#FDA4AF" />
          <rect x="26" y="60" width="48" height="9" rx="4.5" fill="#06B6D4" />
          <rect x="52" y="65" width="10" height="18" rx="4" fill="#0891B2" />
        </svg>
      );

    case 'redpanda':
      // 8. 🐾 软萌小熊猫 (Red Panda)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="26,38 18,16 38,24" fill="#FFFFFF" />
          <polygon points="26,34 22,20 34,26" fill="#C2410C" />
          <polygon points="74,38 82,16 62,24" fill="#FFFFFF" />
          <polygon points="74,34 78,20 66,26" fill="#C2410C" />
          <ellipse cx="50" cy="48" rx="29" ry="24" fill="#C2410C" />
          <ellipse cx="38" cy="36" rx="4" ry="2.5" fill="#FFFFFF" />
          <ellipse cx="62" cy="36" rx="4" ry="2.5" fill="#FFFFFF" />
          <ellipse cx="50" cy="54" rx="14" ry="11" fill="#FFFFFF" />
          <path d="M28 44C26 52 30 60 36 58" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          <path d="M72 44C74 52 70 60 64 58" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          <circle cx="39" cy="45" r="4" fill="#1C1917" />
          <circle cx="37.5" cy="43.5" r="1.3" fill="#FFFFFF" />
          <circle cx="61" cy="45" r="4" fill="#1C1917" />
          <circle cx="59.5" cy="43.5" r="1.3" fill="#FFFFFF" />
          <polygon points="50,53 47,50 53,50" fill="#1C1917" />
          <path d="M47 56Q50 59 50 55Q50 59 53 56" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );

    case 'cafe':
      // 9. ☕ 咖啡甜甜圈 (Coffee & Donut)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="22" y="38" width="34" height="34" rx="10" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
          <ellipse cx="39" cy="38" rx="17" ry="6" fill="#78350F" />
          <path d="M56 46C64 46 64 60 56 60" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <path d="M34 26Q32 18 36 12M44 28Q42 16 46 10" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="68" cy="62" r="18" fill="#F59E0B" />
          <circle cx="68" cy="62" r="16" fill="#F472B6" />
          <circle cx="68" cy="62" r="6" fill="#0B1326" />
          <line x1="62" y1="52" x2="65" y2="52" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="72" y1="54" x2="74" y2="57" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'pomodoro':
      // 10. 🍅 番茄专注钟 (Pomodoro)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="54" r="30" fill="#EF4444" />
          <ellipse cx="40" cy="42" rx="7" ry="4" transform="rotate(-20 40 42)" fill="#F87171" />
          <path d="M50 24V14M50 24C44 18 36 20 40 26M50 24C56 18 64 20 60 26M50 24C46 30 38 32 42 34M50 24C54 30 62 32 58 34" stroke="#22C55E" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="50" cy="56" r="16" fill="#FFFFFF" fillOpacity="0.9" />
          <circle cx="50" cy="56" r="1.8" fill="#1E293B" />
          <line x1="50" y1="56" x2="50" y2="45" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="56" x2="58" y2="56" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'books':
      // 11. 📚 堆叠书本与四叶草 (Books & Bookmark)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bottom Book */}
          <rect x="20" y="66" width="60" height="15" rx="3" fill="#3B82F6" />
          <rect x="24" y="68" width="52" height="11" fill="#F8FAFC" />
          <rect x="20" y="66" width="8" height="15" rx="2" fill="#1D4ED8" />

          {/* Middle Book */}
          <rect x="25" y="49" width="52" height="15" rx="3" fill="#10B981" />
          <rect x="29" y="51" width="44" height="11" fill="#F8FAFC" />
          <rect x="25" y="49" width="7" height="15" rx="2" fill="#047857" />

          {/* Top Book (Tilted) */}
          <g transform="rotate(-6 30 34)">
            <rect x="28" y="30" width="48" height="14" rx="3" fill="#F59E0B" />
            <rect x="32" y="32" width="40" height="10" fill="#FFFBEB" />
            <rect x="28" y="30" width="7" height="14" rx="2" fill="#B45309" />
          </g>

          {/* Ribbon Bookmark */}
          <path d="M64 44L64 74L68 70L72 74L72 44" fill="#EF4444" />
          {/* Clover Leaf */}
          <circle cx="50" cy="18" r="4.5" fill="#22C55E" />
          <circle cx="56" cy="20" r="4.5" fill="#16A34A" />
          <circle cx="44" cy="20" r="4.5" fill="#16A34A" />
          <circle cx="50" cy="25" r="4.5" fill="#15803D" />
          <path d="M50 25Q52 30 55 33" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'avocado':
      // 12. 🥑 搞怪微笑牛油果 (Happy Avocado)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Dark Green Skin */}
          <path d="M50 14C34 14 26 36 26 56C26 76 36 88 50 88C64 88 74 76 74 56C74 36 66 14 50 14Z" fill="#166534" />
          {/* Light Green Meat */}
          <path d="M50 20C38 20 31 38 31 56C31 73 39 83 50 83C61 83 69 73 69 56C69 38 62 20 50 20Z" fill="#BBF7D0" />
          {/* Brown Seed Pit */}
          <circle cx="50" cy="62" r="16" fill="#854D0E" />
          <circle cx="47" cy="58" r="3" fill="#CA8A04" />
          {/* Cute Avocado Face on Seed */}
          <circle cx="45" cy="60" r="2.2" fill="#FEF08A" />
          <circle cx="55" cy="60" r="2.2" fill="#FEF08A" />
          <path d="M47 65Q50 68 53 65" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />
          {/* Cheeks */}
          <circle cx="36" cy="46" r="3" fill="#F472B6" fillOpacity="0.6" />
          <circle cx="64" cy="46" r="3" fill="#F472B6" fillOpacity="0.6" />
          {/* Happy Eyes on Meat */}
          <path d="M40 42Q44 38 48 42" stroke="#14532D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M52 42Q56 38 60 42" stroke="#14532D" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'meme':
      // 13. 🤪 搞怪吐舌头表情包 (Derp Funny Meme Face)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Yellow Head */}
          <circle cx="50" cy="50" r="38" fill="#FACC15" />
          {/* Rosy Cheeks */}
          <circle cx="24" cy="54" r="6" fill="#F87171" fillOpacity="0.6" />
          <circle cx="76" cy="54" r="6" fill="#F87171" fillOpacity="0.6" />
          {/* Left Eye: Big Googly Eye */}
          <circle cx="36" cy="40" r="11" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="34" cy="38" r="5" fill="#0F172A" />
          <circle cx="32" cy="36" r="1.8" fill="#FFFFFF" />
          {/* Right Eye: Squeezing Wink */}
          <path d="M58 42L66 36L74 42" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Derp Mouth */}
          <path d="M34 60C38 72 62 72 66 60" fill="#1E293B" />
          {/* Sticking Tongue Out */}
          <path d="M46 64C46 76 56 76 56 64Z" fill="#F43F5E" />
          <line x1="51" y1="64" x2="51" y2="72" stroke="#BE123C" strokeWidth="1.5" />
          {/* Sweat drop for comedy */}
          <path d="M78 26C80 29 82 32 80 34C78 36 75 36 75 33C75 30 78 26 78 26Z" fill="#38BDF8" />
        </svg>
      );

    case 'burger':
      // 14. 🍔 芝士美味汉堡包 (Burger)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Top Bun */}
          <path d="M22 44C22 26 34 20 50 20C66 20 78 26 78 44Z" fill="#F59E0B" />
          {/* Sesame Seeds */}
          <ellipse cx="38" cy="30" rx="1.8" ry="1" fill="#FFFBEB" />
          <ellipse cx="50" cy="26" rx="1.8" ry="1" fill="#FFFBEB" />
          <ellipse cx="62" cy="32" rx="1.8" ry="1" fill="#FFFBEB" />
          {/* Green Lettuce (Wavy) */}
          <path d="M20 44Q26 50 32 46Q38 50 44 46Q50 50 56 46Q62 50 68 46Q74 50 80 44L78 49Q74 53 68 50Q62 53 56 50Q50 53 44 50Q38 53 32 50Q26 53 22 49Z" fill="#22C55E" />
          {/* Melted Cheese (Drooping Corner) */}
          <polygon points="22,50 78,50 68,64 56,53 42,66 30,52" fill="#EAB308" />
          {/* Beef Patty */}
          <rect x="22" y="55" width="56" height="12" rx="6" fill="#78350F" />
          {/* Bottom Bun */}
          <rect x="24" y="68" width="52" height="12" rx="5" fill="#D97706" />
        </svg>
      );

    case 'gamepad':
      // 15. 🎮 复古游戏手柄 (Game Controller)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Controller Body */}
          <path d="M24 36C18 36 14 44 14 58C14 74 24 82 32 78L40 68H60L68 78C76 82 86 74 86 58C86 44 82 36 76 36Z" fill="#4F46E5" />
          {/* D-Pad (Left) */}
          <rect x="26" y="47" width="16" height="6" rx="2" fill="#1E1B4B" />
          <rect x="31" y="42" width="6" height="16" rx="2" fill="#1E1B4B" />
          {/* Action Buttons (Right) */}
          <circle cx="70" cy="46" r="3" fill="#EC4899" />
          <circle cx="76" cy="52" r="3" fill="#38BDF8" />
          <circle cx="64" cy="52" r="3" fill="#FACC15" />
          <circle cx="70" cy="58" r="3" fill="#22C55E" />
          {/* Center Joysticks */}
          <circle cx="44" cy="58" r="4.5" fill="#312E81" />
          <circle cx="56" cy="58" r="4.5" fill="#312E81" />
        </svg>
      );

    case 'sleepypig':
      // 16. 💤 瞌睡小猪猪 (Sleepy Piggy with Zzz)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ears */}
          <polygon points="26,38 20,20 40,28" fill="#F472B6" />
          <polygon points="74,38 80,20 60,28" fill="#F472B6" />
          {/* Head */}
          <ellipse cx="50" cy="52" rx="30" ry="26" fill="#FBCFE8" />
          {/* Sleepy Closed Eyes */}
          <path d="M34 46Q38 42 42 46" stroke="#9D174D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M58 46Q62 42 66 46" stroke="#9D174D" strokeWidth="2.5" strokeLinecap="round" />
          {/* Pig Snout */}
          <ellipse cx="50" cy="58" rx="13" ry="9" fill="#F472B6" />
          <ellipse cx="46" cy="58" rx="2" ry="3" fill="#831843" />
          <ellipse cx="54" cy="58" rx="2" ry="3" fill="#831843" />
          {/* Cheeks */}
          <circle cx="28" cy="56" r="4" fill="#FB7185" fillOpacity="0.5" />
          <circle cx="72" cy="56" r="4" fill="#FB7185" fillOpacity="0.5" />
          {/* Floating Zzz */}
          <text x="70" y="28" fill="#A855F7" fontSize="12" fontWeight="bold" fontFamily="sans-serif">z</text>
          <text x="76" y="20" fill="#A855F7" fontSize="14" fontWeight="bold" fontFamily="sans-serif">Z</text>
          <text x="83" y="12" fill="#A855F7" fontSize="16" fontWeight="bold" fontFamily="sans-serif">Z</text>
        </svg>
      );

    case 'bulb':
      // 17. 💡 灵感点子闪烁灯泡 (Idea Bulb)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Glow Rays */}
          <line x1="50" y1="10" x2="50" y2="18" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <line x1="24" y1="24" x2="30" y2="30" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <line x1="76" y1="24" x2="70" y2="30" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <line x1="16" y1="50" x2="24" y2="50" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <line x1="84" y1="50" x2="76" y2="50" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          {/* Bulb Glass */}
          <path d="M34 50C34 38 41 30 50 30C59 30 66 38 66 50C66 58 60 62 60 68H40C40 62 34 58 34 50Z" fill="#FDE047" />
          {/* Cute Face on Bulb */}
          <circle cx="45" cy="48" r="2" fill="#78350F" />
          <circle cx="55" cy="48" r="2" fill="#78350F" />
          <path d="M47 53Q50 56 53 53" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
          {/* Screw Base */}
          <rect x="42" y="68" width="16" height="5" fill="#94A3B8" />
          <rect x="43" y="73" width="14" height="4" fill="#64748B" />
          <path d="M45 77C45 80 55 80 55 77Z" fill="#475569" />
        </svg>
      );

    case 'headphone':
      // 18. 🎧 音乐大耳机 (Headphones)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Headband */}
          <path d="M22 56C22 36 34 22 50 22C66 22 78 36 78 56" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" />
          <path d="M34 26C40 24 60 24 66 26" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" />
          {/* Left Earcup */}
          <rect x="15" y="48" width="14" height="24" rx="7" fill="#6366F1" />
          <rect x="18" y="52" width="6" height="16" rx="3" fill="#A5B4FC" />
          {/* Right Earcup */}
          <rect x="71" y="48" width="14" height="24" rx="7" fill="#6366F1" />
          <rect x="76" y="52" width="6" height="16" rx="3" fill="#A5B4FC" />
          {/* Musical Notes */}
          <path d="M48 50L54 44V60M54 48L62 44V56" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="62" r="3" fill="#EC4899" />
          <circle cx="58" cy="58" r="3" fill="#EC4899" />
        </svg>
      );

    case 'rocket':
      // 19. 🚀 效率冲天小火箭 (Rocket)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Rocket Body */}
          <g transform="rotate(45 50 50)">
            <path d="M50 14C38 32 38 52 38 64H62C62 52 62 32 50 14Z" fill="#F8FAFC" />
            <path d="M50 14C45 24 45 32 45 38H55C55 32 55 24 50 14Z" fill="#EF4444" />
            {/* Porthole */}
            <circle cx="50" cy="46" r="6" fill="#38BDF8" stroke="#94A3B8" strokeWidth="2" />
            {/* Fins */}
            <path d="M38 54L26 68H38Z" fill="#DC2626" />
            <path d="M62 54L74 68H62Z" fill="#DC2626" />
            {/* Booster Flame */}
            <polygon points="44,64 50,84 56,64" fill="#F59E0B" />
            <polygon points="47,64 50,78 53,64" fill="#EF4444" />
          </g>
        </svg>
      );

    case 'teddy':
      // 20. 🧸 治愈软萌泰迪熊 (Teddy Bear)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Round Ears */}
          <circle cx="28" cy="28" r="10" fill="#92400E" />
          <circle cx="28" cy="28" r="5" fill="#FDE68A" />
          <circle cx="72" cy="28" r="10" fill="#92400E" />
          <circle cx="72" cy="28" r="5" fill="#FDE68A" />
          {/* Head */}
          <circle cx="50" cy="48" r="26" fill="#B45309" />
          {/* Muzzle */}
          <ellipse cx="50" cy="54" rx="12" ry="9" fill="#FDE68A" />
          <ellipse cx="50" cy="51" rx="4" ry="2.8" fill="#451A03" />
          <path d="M47 55Q50 58 53 55" stroke="#451A03" strokeWidth="1.5" strokeLinecap="round" />
          {/* Eyes */}
          <circle cx="40" cy="44" r="3" fill="#1E293B" />
          <circle cx="39" cy="43" r="1" fill="#FFFFFF" />
          <circle cx="60" cy="44" r="3" fill="#1E293B" />
          <circle cx="59" cy="43" r="1" fill="#FFFFFF" />
          {/* Bowtie */}
          <polygon points="44,70 56,70 50,75" fill="#EF4444" />
          <polygon points="44,78 56,78 50,75" fill="#EF4444" />
          <circle cx="50" cy="74" r="2" fill="#B91C1C" />
        </svg>
      );

    default:
      return null;
  }
};
