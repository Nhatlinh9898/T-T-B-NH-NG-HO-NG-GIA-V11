
import React, { useState } from 'react';
import { ImageViewerModal } from './ImageViewerModal';
import { DownloadIcon, CopyIcon, CheckIcon } from './icons';
import { TET_WISHES } from '../constants';

interface CalendarConfig {
    year: string;
    month: string;
    day: string;
    weekday: string;
    type: string;
}

interface ResultDisplayProps {
  images: string[];
  isLoading: boolean;
  error: string | null;
  aspectRatio: '9:16' | '1:1' | '16:9';
  isCalendarMode?: boolean; 
  cameraAngle?: string; 
  activeTheme?: string; 
  calendarConfig?: CalendarConfig;
}

// --- ENGINE 2: LOGIC LỊCH CHUẨN 2026 (FULL 12 THÁNG) ---
const generateFullYear2026Data = () => {
    const months = [];
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // T1/2026 Starts on Thursday (Index 3: Mon=0, Tue=1, Wed=2, Thu=3)
    let currentStartDay = 3; 

    for (let m = 0; m < 12; m++) {
        const daysCount = daysInMonth[m];
        const days = [];
        // Padding
        for (let i = 0; i < currentStartDay; i++) days.push(null);
        // Days
        for (let i = 1; i <= daysCount; i++) days.push(i);
        
        months.push({
            name: `THÁNG ${m + 1}`,
            days: days
        });

        currentStartDay = (currentStartDay + daysCount) % 7;
    }

    return months;
};

const getWish = (index: number) => {
    const vipWishes = [
        "CUNG CHÚC TÂN XUÂN",
        "ĐẠI CÁT ĐẠI LỢI",
        "MÃ ĐÁO THÀNH CÔNG",
        "VẠN SỰ NHƯ Ý",
        "TẤN TÀI TẤN LỘC",
        "PHÚ QUÝ VINH HOA"
    ];
    const combined = [...vipWishes, ...TET_WISHES];
    return combined[index % combined.length];
};

// --- UPDATED LAYOUT CONFIG FOR SAFE ZONE & CORNER WISHES ---
const LAYOUT_CONFIG = {
    '9:16': {
        // Title smaller, high up in safe zone (y=0.04)
        title: { x: 0.5, y: 0.04, align: 'center', fontSize: 0.05, maxWidth: 0.9 }, 
        // Wish bottom right corner
        wish:  { x: 0.95, y: 0.96, align: 'right', fontSize: 0.035, maxWidth: 0.8 }, 
        // Date Sidebar Position
        dateX: 0.05, dateY: 0.65 
    },
    '16:9': {
        title: { x: 0.5, y: 0.08, align: 'center', fontSize: 0.04, maxWidth: 0.8 },
        wish:  { x: 0.97, y: 0.92, align: 'right', fontSize: 0.025, maxWidth: 0.5 },
        dateX: 0.05, dateY: 0.5
    },
    '1:1': {
        title: { x: 0.5, y: 0.05, align: 'center', fontSize: 0.06, maxWidth: 0.9 },
        wish:  { x: 0.95, y: 0.95, align: 'right', fontSize: 0.045, maxWidth: 0.9 },
        dateX: 0.05, dateY: 0.7
    }
};

// --- DYNAMIC THEME ENGINE ---
const getCalendarTheme = (themeName: string = 'Gold') => {
    const themes: any = {
        'Gold': { // Luxury Royal
            bg: 'rgba(10, 5, 0, 0.85)',
            border: '#FFD700',
            titleColor: '#FFD700',
            monthBg: 'linear-gradient(to bottom, #B8860B, #8B6508)',
            monthText: '#FFFFFF',
            dayText: '#FFFFFF',
            weekendText: '#FF4D4D',
            headerText: '#AAAAAA',
            dateDetailColor: '#FFD700'
        },
        'Red': { // Traditional Tet
            bg: 'rgba(50, 0, 0, 0.9)',
            border: '#FFD700',
            titleColor: '#FFD700',
            monthBg: '#D70018',
            monthText: '#FFFF00',
            dayText: '#FFFFFF',
            weekendText: '#FFD700',
            headerText: '#FFCCCC',
            dateDetailColor: '#FFFFFF'
        },
        'Modern': { // Fashion / Minimal
            bg: 'rgba(255, 255, 255, 0.85)',
            border: '#000000',
            titleColor: '#000000',
            monthBg: '#000000',
            monthText: '#FFFFFF',
            dayText: '#000000',
            weekendText: '#D70018',
            headerText: '#555555',
            dateDetailColor: '#000000'
        },
        'Green': { // Nature / Emerald
            bg: 'rgba(0, 30, 10, 0.85)',
            border: '#90EE90',
            titleColor: '#90EE90',
            monthBg: '#006400',
            monthText: '#FFFFFF',
            dayText: '#F0FFF0',
            weekendText: '#FF7F50',
            headerText: '#8FBC8F',
            dateDetailColor: '#90EE90'
        }
    };
    return themes[themeName] || themes['Gold'];
};

// --- ENGINE 3: CANVAS COMPOSITOR (EXPORT IMAGE + 8K UPSCALE) ---
const downloadImageWithText = (
    src: string, 
    fileName: string, 
    index: number, 
    isCalendarMode?: boolean, 
    cameraAngle?: string, 
    calendarConfig?: CalendarConfig, 
    aspectRatio: '9:16' | '1:1' | '16:9' = '9:16',
    activeTheme: string = 'Gold'
) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- 8K ULTRA HD UPSCALE LOGIC ---
    // Scale factor 4: e.g., 1024px -> 4096px (Approx 4K/8K quality density)
    const SCALE_FACTOR = 4;
    
    canvas.width = img.naturalWidth * SCALE_FACTOR;
    canvas.height = img.naturalHeight * SCALE_FACTOR;
    
    // Enable High Quality Scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const w = canvas.width;
    const h = canvas.height;

    // LAYER 1: BACKGROUND (SCALED)
    ctx.drawImage(img, 0, 0, w, h);

    const theme = getCalendarTheme(activeTheme);

    // LAYER 2: TEXT/CALENDAR OVERLAY
    if (isCalendarMode && !calendarConfig?.day && !calendarConfig?.month) {
        // --- MODE A: FULL 12 MONTH GRID (Standard Calendar) ---
        // (Only if specific day/month is NOT selected, implying a full calendar request)
        
        const allMonths = generateFullYear2026Data();
        const gridHeight = h * 0.35; 
        const startY = h - gridHeight; 
        const gridWidth = w; 

        // Background (Edge to Edge)
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, startY, gridWidth, gridHeight);
        
        // Top Border Line
        ctx.beginPath();
        ctx.moveTo(0, startY);
        ctx.lineTo(w, startY);
        ctx.lineWidth = w * 0.005;
        ctx.strokeStyle = theme.border;
        ctx.stroke();

        // Main Title
        const titleHeight = gridHeight * 0.12;
        ctx.fillStyle = theme.titleColor;
        ctx.font = `900 ${titleHeight * 0.85}px "Cinzel Decorative", serif`; 
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = titleHeight * 0.2;
        ctx.fillText("HAPPY NEW YEAR 2026", w / 2, startY + (titleHeight * 0.85));
        ctx.shadowBlur = 0;

        // Grid Configuration: 3 Columns x 4 Rows
        const cols = 3;
        const rows = 4;
        const cellW = gridWidth / cols;
        const contentHeight = gridHeight - titleHeight;
        const cellH = contentHeight / rows;
        const startGridY = startY + titleHeight;

        // Render 12 Months
        allMonths.forEach((monthData, idx) => {
            const c = idx % cols;
            const r = Math.floor(idx / cols);
            const monthX = c * cellW;
            const monthY = startGridY + (r * cellH);

            const headerBarH = cellH * 0.18;
            ctx.fillStyle = theme.monthBg;
            const margin = cellW * 0.02;
            ctx.fillRect(monthX + margin, monthY, cellW - (margin*2), headerBarH);

            ctx.fillStyle = theme.monthText;
            const monthFontSize = headerBarH * 0.7;
            ctx.font = `800 ${monthFontSize}px "Montserrat", sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(monthData.name, monthX + (cellW/2), monthY + (headerBarH * 0.75));

            const dayGridY = monthY + headerBarH;
            const dayGridH = cellH - headerBarH;
            const innerW = cellW - (margin * 2);
            const colWidth = innerW / 7;
            const rowHeight = dayGridH / 7;

            const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
            ctx.font = `700 ${rowHeight * 0.55}px "Inter", sans-serif`;
            ctx.fillStyle = theme.headerText;
            
            weekdays.forEach((wd, wdIdx) => {
                const x = monthX + margin + (wdIdx * colWidth) + (colWidth/2);
                const y = dayGridY + (rowHeight * 0.6);
                ctx.fillText(wd, x, y);
            });

            ctx.font = `700 ${rowHeight * 0.65}px "Inter", sans-serif`;
            monthData.days.forEach((day, dIdx) => {
                if (day) {
                    const dCol = dIdx % 7;
                    const dRow = Math.floor(dIdx / 7) + 1;
                    const dx = monthX + margin + (dCol * colWidth) + (colWidth/2);
                    const dy = dayGridY + (dRow * rowHeight) + (rowHeight * 0.7);
                    ctx.fillStyle = (dCol === 6) ? theme.weekendText : theme.dayText;
                    ctx.fillText(day.toString(), dx, dy);
                }
            });
        });

    } else {
        // --- MODE B: STANDARD ART + SPECIFIC DATE DETAILS (Concept Mode) ---
        const layout = LAYOUT_CONFIG[aspectRatio];
        const mainText = "HAPPY NEW YEAR 2026";
        const subText = getWish(index);

        // 1. Draw Main Title (Safe Zone Top - Smaller)
        const drawTitle = () => {
            const sizePct = layout.title.fontSize;
            const fontSize = w * sizePct;
            const x = w * layout.title.x;
            const y = h * layout.title.y;

            ctx.textAlign = layout.title.align as CanvasTextAlign;
            ctx.textBaseline = 'middle';
            
            const fontName = "Cinzel Decorative";
            const fontWeight = "900"; 
            ctx.font = `${fontWeight} ${fontSize}px "${fontName}", serif`;

            ctx.shadowColor = 'rgba(0,0,0,1)';
            ctx.shadowBlur = fontSize * 0.5;
            
            ctx.lineWidth = fontSize * 0.08; 
            ctx.strokeStyle = '#2A0000'; 
            ctx.lineJoin = 'round';
            ctx.strokeText(mainText, x, y);

            ctx.shadowBlur = 0;

            // Platinum Gold Gradient
            const gradient = ctx.createLinearGradient(x, y - fontSize/2, x, y + fontSize/2);
            gradient.addColorStop(0, '#FFFFFF'); 
            gradient.addColorStop(0.3, '#FFD700'); 
            gradient.addColorStop(0.6, '#FDB931'); 
            gradient.addColorStop(1, '#8B6508'); 
            
            ctx.fillStyle = gradient;
            ctx.fillText(mainText, x, y);
        };

        // 2. Draw Wish (Bottom Corner, Luxury Thick Font)
        const drawWish = () => {
            const sizePct = layout.wish.fontSize;
            const fontSize = w * sizePct;
            const x = w * layout.wish.x;
            const y = h * layout.wish.y;

            ctx.textAlign = layout.wish.align as CanvasTextAlign;
            ctx.textBaseline = 'middle';
            
            const fontName = "Playfair Display";
            // Extra Bold Italic for Luxury Look
            ctx.font = `900 italic ${fontSize}px "${fontName}", serif`;

            ctx.shadowColor = 'rgba(0,0,0,1)';
            ctx.shadowBlur = fontSize * 0.8;
            ctx.lineWidth = fontSize * 0.05;
            ctx.strokeStyle = '#3E0000';
            ctx.strokeText(subText, x, y);
            ctx.shadowBlur = 0;

            // Luxury Text Fill (Red/Gold mix)
            const grad = ctx.createLinearGradient(x - w*0.2, y, x + w*0.2, y);
            grad.addColorStop(0, '#FFD700');
            grad.addColorStop(0.5, '#FFF');
            grad.addColorStop(1, '#FFD700');
            ctx.fillStyle = grad;
            ctx.fillText(subText, x, y);
        };

        drawTitle();
        drawWish();

        // 3. Draw Specific Date Details (SIDEBAR STACK - BIG THICK FONT)
        if (calendarConfig) {
            let detailsY = h * layout.dateY; // Position from config
            const detailsX = w * layout.dateX;
            const detailSize = w * 0.08; // HUGE FONT for Date Details
            
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = 20;

            const drawDetailLine = (text: string, offsetY: number, colorStart: string, colorEnd: string, scale: number = 1) => {
                const currentSize = detailSize * scale;
                ctx.font = `900 ${currentSize}px "Montserrat", sans-serif`; // Modern, Ultra Thick
                const yPos = detailsY + offsetY;
                
                // Thick Stroke
                ctx.lineWidth = currentSize * 0.1;
                ctx.strokeStyle = 'rgba(0,0,0,1)';
                ctx.lineJoin = 'round';
                ctx.strokeText(text, detailsX, yPos);
                
                // Gradient Fill
                const grad = ctx.createLinearGradient(detailsX, yPos - currentSize, detailsX, yPos);
                grad.addColorStop(0, colorStart);
                grad.addColorStop(0.5, '#FFFFFF');
                grad.addColorStop(1, colorEnd);
                ctx.fillStyle = grad;
                ctx.fillText(text, detailsX, yPos);
            };

            let currentOffset = 0;
            const lineSpacing = detailSize * 1.1;

            if (calendarConfig.weekday) {
                drawDetailLine(calendarConfig.weekday.toUpperCase(), currentOffset, '#FFD700', '#FFA500', 0.7); // Smaller Weekday
                currentOffset += (lineSpacing * 0.8);
            }
            if (calendarConfig.day) {
                drawDetailLine(calendarConfig.day.toUpperCase(), currentOffset, '#FFFFFF', '#CCCCCC', 1.2); // HUGE DAY
                currentOffset += (lineSpacing * 1.2);
            }
            if (calendarConfig.month) {
                drawDetailLine(calendarConfig.month.toUpperCase(), currentOffset, '#FFD700', '#B8860B', 0.7); // Smaller Month
                currentOffset += (lineSpacing * 0.8);
            }
            if (calendarConfig.year) {
                drawDetailLine(calendarConfig.year.toUpperCase(), currentOffset, '#FFFFFF', '#FFD700', 0.6); // Small Year
            }
        }
    }

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png', 1.0); // Max quality
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  img.src = src;
};

// ... (VIPNotificationBox, Helper Components remain unchanged) ...
const VIPNotificationBox: React.FC = () => {
    const randomWish = TET_WISHES[Math.floor(Math.random() * TET_WISHES.length)];
    return (
        <div className="w-full mb-8 relative group animate-fade-in-up z-20">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 rounded-[2rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
            <div className="relative bg-[var(--bg-deep)] border-[4px] border-[var(--accent-gold)] rounded-[1.8rem] p-6 sm:p-8 flex flex-col items-center text-center shadow-[inset_0_0_50px_rgba(255,215,0,0.3)] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-spin-slow pointer-events-none"></div>
                <div className="absolute top-2 left-4 text-4xl animate-bounce" style={{animationDuration: '2s'}}>🧧</div>
                <div className="absolute top-2 right-4 text-4xl animate-bounce" style={{animationDuration: '2.5s'}}>💰</div>
                <h3 className="text-2xl sm:text-4xl font-black font-display text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-sm mb-2 animate-pulse">
                    ⚜️ LỘC XUÂN BÍNH NGỌ 2026 ⚜️
                </h3>
                <p className="text-white text-lg sm:text-2xl font-bold font-heading tracking-wide mb-6 border-b border-yellow-500/50 pb-2">
                    "{randomWish}"
                </p>
                <a 
                    href="https://byvn.net/ky3c" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 rounded-full text-red-900 font-black text-xl sm:text-2xl shadow-[0_0_30px_#FFD700] hover:scale-110 hover:shadow-[0_0_60px_#FFD700] hover:rotate-1 transition-all duration-300 border-4 border-white/50 animate-vip-glow uppercase tracking-wider"
                >
                    <span className="text-3xl animate-spin" style={{animationDuration: '3s'}}>🎁</span>
                    NHẬN 6 SIÊU VIP
                    <span className="text-3xl animate-spin" style={{animationDuration: '3s'}}>🎁</span>
                    <span className="absolute -top-2 -right-2 flex h-6 w-6">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500"></span>
                    </span>
                </a>
                <p className="text-[10px] text-yellow-200/70 mt-3 font-sans tracking-widest uppercase">
                    Bấm ngay để nhận quà lì xì độc quyền từ Thiện Master AI
                </p>
            </div>
            <style>{`
              @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in-up {
                animation: fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
              }
              @keyframes gradient-xy {
                  0%, 100% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
              }
              .animate-gradient-xy {
                  background-size: 200% 200%;
                  animation: gradient-xy 3s ease infinite;
              }
            `}</style>
        </div>
    );
};

const AspectRatioContainer: React.FC<{ aspectRatio: '9:16' | '1:1' | '16:9', children: React.ReactNode }> = ({ aspectRatio, children }) => {
  const paddingTop = {
    '9:16': '177.77%',
    '1:1': '100%',
    '16:9': '56.25%',
  }[aspectRatio];

  return (
    <div className="relative w-full" style={{ paddingTop }}>
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
};

const DonationInfo: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const accountNumber = '19035907828017';

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="w-full mt-4 text-center bg-[var(--bg-soft-glass)] border border-[var(--border-color)] rounded-2xl p-4 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
      <p className="text-[var(--text-light)]/90 font-sans text-sm">
        Nếu bạn thích bức ảnh Tết này, hãy lì xì cho <span className="font-bold text-[var(--accent-gold)]">THIỆN MASTER AI</span> một ly cà phê đầu xuân nhé! ☕
      </p>
      <div className="mt-3 space-y-1 font-sans">
        <p className="font-bold text-base text-[var(--accent-gold)]">NGUYỄN QUỐC THIỆN</p>
        <p className="text-xs text-[var(--text-light)]/70">NGÂN HÀNG TECHCOMBANK</p>
        <button 
          onClick={handleCopy} 
          className="inline-flex items-center justify-center gap-2 bg-black/30 border border-[var(--accent-gold)] rounded-lg py-1.5 px-3 text-sm text-[var(--accent-gold)] font-bold transition-all hover:bg-[var(--accent-gold)]/20 hover:shadow-[0_0_10px_var(--accent-gold)] min-w-[200px]"
          aria-label="Sao chép số tài khoản"
        >
          {copied ? (
            <>
              <CheckIcon />
              <span>Đã nhận lì xì! 🧧</span>
            </>
          ) : (
            <>
              <CopyIcon />
              <span>STK: {accountNumber}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ images, isLoading, error, aspectRatio, isCalendarMode, cameraAngle, calendarConfig, activeTheme = 'Gold' }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  const handleDownload = (src: string, index: number) => {
    const timestamp = new Date().getTime();
    const fileName = `thien-master-ai-tet-8k-${timestamp}-${index + 1}.png`;
    downloadImageWithText(src, fileName, index, isCalendarMode, cameraAngle, calendarConfig, aspectRatio, activeTheme);
  };
  
  // --- ENGINE 3: HTML PREVIEW RENDERER (Composite) ---
  const renderStandardPreview = (index: number) => {
      // 1. RENDER FULL 12 MONTH CALENDAR PREVIEW (Engine 3 Display)
      const showGrid = isCalendarMode && !calendarConfig?.day && !calendarConfig?.month;

      if (showGrid) {
          const allMonths = generateFullYear2026Data();
          const theme = getCalendarTheme(activeTheme);
          
          return (
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-end items-center">
               {/* FULL WIDTH CONTAINER (35% Height) */}
               <div 
                 className="w-full h-[35%] flex flex-col border-t-2 shadow-2xl overflow-hidden backdrop-blur-md"
                 style={{ backgroundColor: theme.bg, borderColor: theme.border }}
               >
                   <h3 
                     className="text-center font-black text-[10px] sm:text-xs py-1 font-display uppercase tracking-widest drop-shadow-md shrink-0"
                     style={{ color: theme.titleColor }}
                   >
                       HAPPY NEW YEAR 2026
                   </h3>
                   
                   {/* GRID 3x4 CONTAINER */}
                   <div className="grid grid-cols-3 h-full overflow-hidden w-full">
                       {allMonths.map((monthData, idx) => (
                           <div key={idx} className="flex flex-col justify-center border-r border-b border-white/5 relative p-0.5">
                               {/* Month Title */}
                               <div 
                                 className="text-[6px] sm:text-[8px] font-bold text-center mb-0.5 rounded-sm mx-1"
                                 style={{ background: theme.monthBg, color: theme.monthText }}
                               >
                                   {monthData.name}
                               </div>
                               
                               {/* Days Grid */}
                               <div className="grid grid-cols-7 gap-0 text-center w-full px-1">
                                   {/* Headers */}
                                   {['T2','T3','T4','T5','T6','T7','CN'].map((d, i) => (
                                       <div key={i} className="text-[3px] sm:text-[5px] font-sans font-bold" style={{ color: theme.headerText }}>{d}</div>
                                   ))}
                                   
                                   {/* Days */}
                                   {monthData.days.map((d, i) => (
                                       <div key={i} className={`text-[4px] sm:text-[6px] font-bold`}>
                                           {d && (
                                               <span style={{ color: (i % 7 === 6) ? theme.weekendText : theme.dayText }}>
                                                   {d}
                                               </span>
                                           )}
                                       </div>
                                   ))}
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
            </div>
          );
      }

      // 2. RENDER VIP TEXT PREVIEW (HAPPY NEW YEAR 2026 + SPECIFIC DATE DETAILS)
      const layout = LAYOUT_CONFIG[aspectRatio];
      
      const titleStyle: React.CSSProperties = {
          position: 'absolute',
          left: `${layout.title.x * 100}%`,
          top: `${layout.title.y * 100}%`,
          transform: layout.title.align === 'center' ? 'translate(-50%, -50%)' : (layout.title.align === 'left' ? 'translate(0, -50%)' : 'translate(-100%, -50%)'),
          textAlign: layout.title.align as any,
          width: '100%',
          pointerEvents: 'none',
          zIndex: 10,
          fontFamily: '"Cinzel Decorative", serif',
          fontWeight: 900,
          fontSize: `clamp(14px, ${layout.title.fontSize * 100}cqw, 50px)`, 
          backgroundImage: 'linear-gradient(to bottom, #FFFFFF 0%, #FFD700 30%, #FDB931 60%, #8B6508 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          lineHeight: 1.1,
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,1))',
          WebkitTextStroke: '1.5px #2A0000',
      };

      const wishStyle: React.CSSProperties = {
          position: 'absolute',
          left: `${layout.wish.x * 100}%`,
          top: `${layout.wish.y * 100}%`,
          transform: layout.wish.align === 'center' ? 'translate(-50%, -50%)' : (layout.wish.align === 'left' ? 'translate(0, -50%)' : 'translate(-100%, -50%)'),
          textAlign: layout.wish.align as any,
          width: '100%',
          pointerEvents: 'none',
          zIndex: 10,
          fontFamily: '"Playfair Display", serif',
          fontWeight: 900,
          fontStyle: 'italic',
          fontSize: `clamp(10px, ${layout.wish.fontSize * 100}cqw, 35px)`,
          color: 'transparent',
          backgroundImage: 'linear-gradient(to right, #FFD700, #FFF, #FFD700)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,1))',
          WebkitTextStroke: '0.8px #500000',
      };

      return (
        <div style={{ containerType: 'inline-size', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            {/* MAIN TITLE SAFE ZONE */}
            <div style={titleStyle}>
                HAPPY NEW YEAR 2026
            </div>
            {/* WISHES BOTTOM CORNER */}
            <div style={wishStyle}>
                {getWish(index)}
            </div>

            {/* DYNAMIC DATE DETAILS (VIP PRO SIDEBAR) */}
            {calendarConfig && (calendarConfig.day || calendarConfig.month || calendarConfig.year || calendarConfig.weekday) && (
                <div style={{
                    position: 'absolute',
                    top: `${layout.dateY * 100}%`,
                    left: `${layout.dateX * 100}%`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    pointerEvents: 'none',
                    zIndex: 9,
                    alignItems: 'flex-start'
                }}>
                    {calendarConfig.weekday && (
                        <span style={{
                            fontFamily: '"Montserrat", sans-serif', fontWeight: 900, fontSize: 'clamp(16px, 6cqw, 40px)', textTransform: 'uppercase',
                            color: 'transparent', backgroundImage: 'linear-gradient(to bottom, #FFD700, #FFA500)', WebkitBackgroundClip: 'text', backgroundClip: 'text',
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,1))', WebkitTextStroke: '1px black'
                        }}>{calendarConfig.weekday}</span>
                    )}
                    {calendarConfig.day && (
                        <span style={{
                            fontFamily: '"Montserrat", sans-serif', fontWeight: 900, fontSize: 'clamp(20px, 8cqw, 50px)', textTransform: 'uppercase',
                            color: 'transparent', backgroundImage: 'linear-gradient(to bottom, #FFF, #CCC)', WebkitBackgroundClip: 'text', backgroundClip: 'text',
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,1))', WebkitTextStroke: '1.5px black', lineHeight: 0.9
                        }}>{calendarConfig.day}</span>
                    )}
                    {calendarConfig.month && (
                        <span style={{
                            fontFamily: '"Montserrat", sans-serif', fontWeight: 900, fontSize: 'clamp(16px, 6cqw, 40px)', textTransform: 'uppercase',
                            color: 'transparent', backgroundImage: 'linear-gradient(to bottom, #FFD700, #B8860B)', WebkitBackgroundClip: 'text', backgroundClip: 'text',
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,1))', WebkitTextStroke: '1px black'
                        }}>{calendarConfig.month}</span>
                    )}
                    {calendarConfig.year && (
                        <span style={{
                            fontFamily: '"Montserrat", sans-serif', fontWeight: 900, fontSize: 'clamp(14px, 5cqw, 30px)', textTransform: 'uppercase',
                            color: '#FFF', textShadow: '0 2px 4px rgba(0,0,0,1)', letterSpacing: '0.1em'
                        }}>{calendarConfig.year}</span>
                    )}
                </div>
            )}
        </div>
      );
  };

  return (
    <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-3xl p-4 sm:p-6 h-full flex flex-col items-center justify-center backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Pattern overlay inside container */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>

        <div className="w-full relative z-10">
            {isLoading && (
                <AspectRatioContainer aspectRatio={aspectRatio}>
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 border-4 border-t-[var(--accent-red)] border-r-[var(--accent-gold)] border-b-[var(--accent-green)] border-l-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-3xl animate-bounce">🦄</div>
                        </div>
                        <p className="mt-6 text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-red)] to-[var(--accent-gold)] font-heading tracking-wider animate-pulse">
                            Lân Sư Rồng đang múa...
                        </p>
                        <p className="mt-3 text-sm text-[var(--text-light)]/90 font-sans">
                            Ông đồ AI đang vẽ tranh Tết cho bạn...
                        </p>
                    </div>
                </AspectRatioContainer>
            )}

            {error && (
                <AspectRatioContainer aspectRatio={aspectRatio}>
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <div className="text-6xl mb-4">🧨</div>
                        <p className="text-xl font-bold text-red-400 font-heading">
                            Pháo chưa nổ!
                        </p>
                        <p className="mt-2 text-sm bg-red-900/30 text-red-200 border border-red-500/30 rounded-xl p-4 font-mono backdrop-blur-sm">
                            {error}
                        </p>
                        <p className="mt-4 text-sm text-[var(--text-light)]/80 font-sans">
                            Hãy thử lại (Tải lại trang).
                        </p>
                    </div>
                </AspectRatioContainer>
            )}

            {!isLoading && !error && images.length === 0 && (
                <AspectRatioContainer aspectRatio={aspectRatio}>
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <div className="text-6xl mb-4 animate-bounce">🌸</div>
                        <h2 className="text-3xl font-bold text-[var(--accent-gold)] font-heading shimmer">
                            Studio Tết Bính Ngọ
                        </h2>
                        <p className="mt-3 text-sm text-[var(--text-light)]/80 max-w-sm font-sans leading-relaxed">
                            Tải ảnh lên và chọn Áo Dài để có ngay bộ ảnh Tết lung linh đẳng cấp!
                        </p>
                    </div>
                </AspectRatioContainer>
            )}
            
            {!isLoading && !error && images.length > 0 && (
                 <div>
                    {/* VIP PROMO BOX */}
                    <VIPNotificationBox />

                    <div className="flex flex-col gap-6">
                        {images.map((src, index) => (
                             <AspectRatioContainer aspectRatio={aspectRatio} key={index}>
                                <div 
                                    className="group relative w-full h-full overflow-hidden rounded-2xl shadow-[0_0_20px_rgba(255,36,0,0.3)] border border-[var(--border-color)]"
                                >
                                    {/* LAYER 1: IMAGE (ENGINE 1 OUTPUT) */}
                                    <img 
                                        src={src} 
                                        alt={`Generated Tet image ${index + 1}`} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                                        onClick={() => openImageViewer(index)}
                                    />
                                    
                                    {/* LAYER 2: TEXT OVERLAY (ENGINE 3 COMPOSITE) */}
                                    {renderStandardPreview(index)}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <button
                                        onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload(src, index);
                                        }}
                                        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4/5 max-w-xs flex items-center justify-center gap-2 bg-[var(--accent-red)]/90 backdrop-blur-md text-white font-bold py-3 px-5 rounded-full shadow-lg hover:bg-[var(--accent-red)] transition-all text-sm animate-glow z-20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300"
                                        aria-label={`Tải ảnh ${index + 1}`}
                                    >
                                        <DownloadIcon />
                                        <span>Tải Về (Tự Động Upscale 8K)</span>
                                    </button>
                                </div>
                            </AspectRatioContainer>
                        ))}
                    </div>
                    <DonationInfo />
                </div>
            )}
        </div>

        {isViewerOpen && (
            <ImageViewerModal 
                images={images} 
                currentIndex={currentImageIndex} 
                onClose={closeImageViewer} 
            />
        )}
    </div>
  );
};
