
import React from 'react';
import { FacebookIcon, ZaloIcon, GiftIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="p-6 sm:p-8 border-b-2 border-[var(--accent-gold)] bg-[var(--bg-deep)]/80 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      {/* Luxury Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
      
      {/* Animated Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20px] left-[5%] text-6xl animate-bounce opacity-30">🏮</div>
        <div className="absolute top-[20%] right-[5%] text-5xl animate-pulse opacity-30">✨</div>
      </div>

      <div className="text-center relative z-10 flex flex-col items-center">
        {/* REMOVED BADGE ROW */}

        {/* --- SUPER FLASHY TITLE START --- */}
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black font-display mb-2 animate-rainbow-flash relative z-20 drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]">
          TẾT BÍNH NGỌ
        </h1>
        <style>{`
            @keyframes rainbow-flash {
                0% { color: #FFD700; text-shadow: 0 0 10px #FFD700, 0 0 20px #FF0000; transform: scale(1); }
                25% { color: #FF0000; text-shadow: 0 0 10px #FF0000, 0 0 20px #FFFF00; transform: scale(1.02); }
                50% { color: #00FF00; text-shadow: 0 0 10px #00FF00, 0 0 20px #0000FF; transform: scale(1); }
                75% { color: #00FFFF; text-shadow: 0 0 10px #00FFFF, 0 0 20px #FF00FF; transform: scale(1.02); }
                100% { color: #FF00FF; text-shadow: 0 0 10px #FF00FF, 0 0 20px #FFD700; transform: scale(1); }
            }
            .animate-rainbow-flash {
                animation: rainbow-flash 0.5s infinite; /* Extremely fast flashing */
                background: linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3);
                background-size: 400% 400%;
                -webkit-background-clip: text;
                /* Note: text-fill-color transparent overrides color animation, so we use text-shadow mostly for flash or remove clip for full color flash */
                /* For intense flashing, standard color animation is better than gradient clip with transparent fill */
                -webkit-text-fill-color: unset; 
            }
        `}</style>
        {/* --- SUPER FLASHY TITLE END --- */}

        <h2 className="text-2xl sm:text-4xl font-black font-heading italic tracking-wider mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#FFD700] to-[#FFFFFF] pb-2 inline-block border-b-2 border-[var(--accent-gold)]/50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          ✨ Diệu Kỳ & Đẳng Cấp ✨
        </h2>
        
        {/* REMOVED DESCRIPTION PARAGRAPH */}

        <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
            <a href="https://byvn.net/44LC" target="_blank" rel="noopener noreferrer" 
               className="flex items-center gap-2 bg-blue-900/80 border border-blue-400 text-white font-bold py-3 px-6 rounded-full shadow-[0_0_15px_rgba(0,0,255,0.3)] hover:scale-105 transition-all font-modern uppercase tracking-wide">
                <FacebookIcon />
                <span>Facebook</span>
            </a>
            <a href="tel:0968065274" 
               className="flex items-center gap-2 bg-green-900/80 border border-green-400 text-white font-bold py-3 px-6 rounded-full shadow-[0_0_15px_rgba(0,255,0,0.3)] hover:scale-105 transition-all font-modern uppercase tracking-wide">
                <ZaloIcon />
                <span>Zalo: 0968.065.274</span>
            </a>
            <a href="https://byvn.net/ky3c" target="_blank" rel="noopener noreferrer" 
               className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-yellow-500 text-white font-black py-3 px-8 rounded-full shadow-[0_0_20px_#FFD700] hover:scale-110 transition-all animate-vip-glow font-modern uppercase tracking-widest border border-yellow-200">
                <GiftIcon />
                NHẬN LÌ XÌ VIP
            </a>
        </div>
      </div>
    </header>
  );
};
