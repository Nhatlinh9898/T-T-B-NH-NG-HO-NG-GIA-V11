
import React, { useState, useRef, useEffect } from 'react';

interface OptionSelectorProps {
  label: string;
  options: string[];
  selectedValue: string | string[];
  onChange: (value: string) => void;
  isMultiSelect?: boolean;
  hideDeselectAll?: boolean;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  isMultiSelect = false,
  hideDeselectAll = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  
  const handleSelect = (option: string) => {
    onChange(option);
    if (!isMultiSelect) {
      setIsOpen(false);
    }
  };

  const displayValue = () => {
    if (isMultiSelect) {
      if (Array.isArray(selectedValue) && selectedValue.length > 0) {
        return `${selectedValue.length} ĐÃ CHỌN`;
      }
      return `CHỌN ${label.toUpperCase()}...`;
    }
    const singleValue = selectedValue as string;
    return singleValue && singleValue !== '' ? singleValue : `CHỌN ${label.toUpperCase()}...`;
  };
  
  const hasSelection = isMultiSelect 
    ? (Array.isArray(selectedValue) && selectedValue.length > 0)
    : (selectedValue && selectedValue !== '');

  // --- VIP STYLING SYSTEM ---
  
  // Base State (Inactive)
  const unselectedStyle = `
    bg-[var(--bg-soft-glass)] 
    border border-[var(--accent-gold)]/30 
    text-gray-300 
    hover:border-[var(--accent-gold)] 
    hover:bg-black/40
  `;
  
  // VIP Active State (Glowing)
  const selectedStyle = `
    bg-gradient-to-r from-[#3a0000] via-[#500000] to-[#200000]
    border-2 border-[var(--accent-gold)]
    shadow-[0_0_20px_rgba(255,215,0,0.4),inset_0_0_10px_rgba(255,215,0,0.2)]
    ring-1 ring-[var(--accent-gold)]
    animate-pulse-slow
  `;

  return (
    <div ref={wrapperRef} className="relative flex flex-col gap-2 group/selector">
      <label className={`text-xs font-black uppercase tracking-[0.15em] transition-colors duration-300 flex items-center gap-2 ${hasSelection ? 'text-[var(--accent-gold)] drop-shadow-[0_0_5px_rgba(255,215,0,0.8)]' : 'text-gray-400'}`}>
        {hasSelection && <span className="text-lg animate-spin-slow">✨</span>}
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
            w-full rounded-xl py-3 px-4 text-left flex justify-between items-center 
            focus:outline-none transition-all duration-500 font-sans relative overflow-hidden
            ${hasSelection ? selectedStyle : unselectedStyle}
        `}
      >
        {/* Glowing Background Effect for Active State */}
        {hasSelection && (
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-spin-very-slow pointer-events-none mix-blend-overlay"></div>
        )}

        {/* MAIN DISPLAY TEXT - SIÊU NỔI BẬT */}
        <span className={`
            truncate relative z-10 transition-all duration-300 flex-1 pr-2
            ${hasSelection 
                ? 'font-black text-sm sm:text-base tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFF] to-[#FFD700] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' 
                : 'font-medium text-xs sm:text-sm tracking-wider'
            }
        `}>
            {displayValue()}
        </span>
        
        {/* Reset 'X' Button or Dropdown Arrow */}
        <div className="flex items-center gap-2 z-20">
            {hasSelection && !isMultiSelect && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onChange('');
                    }}
                    className="p-1 rounded-full bg-black/50 text-red-400 hover:text-red-200 hover:bg-red-900/50 transition-colors cursor-pointer border border-red-500/30"
                    title="Bỏ chọn"
                >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
            )}
            
            <svg className={`fill-current h-4 w-4 transition-transform duration-300 ${isOpen ? 'transform rotate-180 text-[var(--accent-gold)]' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
        </div>
      </button>

      {/* DROPDOWN MENU VIP */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#2a0505] border-2 border-[var(--accent-gold)] rounded-xl p-2 shadow-[0_10px_60px_rgba(0,0,0,1)] z-[100] animate-fade-in-up max-h-[400px] overflow-y-auto custom-scrollbar">
           {/* Header Decor */}
           <div className="flex justify-between items-center mb-2 px-2 py-1 text-[9px] text-[var(--accent-gold)] uppercase tracking-[0.2em] border-b border-[var(--accent-gold)]/20 font-black bg-black/20 rounded">
              <span>💎 VIP COLLECTION</span>
              <span>2026 🐉</span>
           </div>

           {/* LIST ITEMS */}
           <div className="grid grid-cols-1 gap-1.5">
            {options.map((option, index) => {
              const isSelected = isMultiSelect 
                ? Array.isArray(selectedValue) && selectedValue.includes(option)
                : selectedValue === option;

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={`
                    text-left py-3 px-3 rounded-lg text-xs sm:text-sm transition-all duration-200 flex items-center gap-3 border relative overflow-hidden group/item
                    ${isSelected
                      ? 'bg-gradient-to-r from-[var(--accent-gold)] to-[#FDB931] text-[#3E0000] font-black border-white shadow-[0_0_15px_rgba(255,215,0,0.6)] transform scale-[1.02]'
                      : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-[var(--accent-gold)]/50 hover:text-[var(--accent-gold)] font-medium'
                    }
                  `}
                >
                  {/* Icon or Bullet */}
                  <span className={`text-lg transition-transform duration-300 ${isSelected ? 'scale-125' : 'opacity-50 group-hover/item:text-[var(--accent-gold)]'}`}>
                    {isSelected ? '👑' : '💠'}
                  </span>
                  
                  <span className="truncate flex-1 relative z-10 leading-snug">
                    {option}
                  </span>

                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/item:animate-[shimmer_0.8s_infinite]"></div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <style>{`
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        .animate-spin-very-slow { animation: spin 12s linear infinite; }
      `}</style>
    </div>
  );
};
