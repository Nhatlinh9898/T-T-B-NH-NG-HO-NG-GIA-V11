
import React, { useState } from 'react';
import { GenerationOptions } from '../types';
import {
  EFFECTS, STYLES, LAYOUTS, BORDERS, ACCESSORIES, HANDHELD_ITEMS, PETS, TET_BACKGROUNDS,
  TET_OUTFITS_FEMALE, TET_OUTFITS_MALE, FLOWERS, DESTINATIONS, FAMILY_CONCEPTS, TRAVEL_CONCEPTS, CAMERA_ANGLES,
  STUDIO_CONCEPTS, CALENDAR_CONCEPTS, ROYAL_CONCEPTS, EMERALD_CONCEPTS, BILLIONAIRE_CONCEPTS,
  HEAVENLY_CONCEPTS, ZODIAC_HORSE_CONCEPTS, PHOENIX_CONCEPTS, FASHION_STUDIO_CONCEPTS, FAMILY_STUDIO_VIP_CONCEPTS,
  FLOWER_SPRING_CONCEPTS, PAGODA_LUCK_CONCEPTS, // Imported NEW
  CALENDAR_WEEKDAYS, CALENDAR_DAYS, CALENDAR_MONTHS, CALENDAR_YEARS, CALENDAR_TYPES
} from '../constants';
import { OptionSelector } from './OptionSelector';
import { ImageUploader } from './ImageUploader';
import { HistoryDisplay } from './HistoryDisplay';
import { AspectRatioPortraitIcon, AspectRatioSquareIcon, AspectRatioLandscapeIcon } from './icons';

interface GenerationControlsProps {
  options: GenerationOptions;
  onOptionChange: (key: keyof GenerationOptions, value: string | number) => void;
  onImageUpload: (files: FileList) => void;
  onRemoveImage: (index: number) => void;
  onGenerateClick: () => void;
  uploadedImages: string[];
  isLoading: boolean;
  history: string[];
  onImageClick: (url: string) => void;
  onClearImages?: () => void; // Added optional prop
}

const visualOptions = {
  aspectRatio: [
    { value: '9:16', label: 'Dọc (Phone)', icon: <AspectRatioPortraitIcon /> },
    { value: '1:1', label: 'Vuông (Avt)', icon: <AspectRatioSquareIcon /> },
    { value: '16:9', label: 'Ngang (PC)', icon: <AspectRatioLandscapeIcon /> },
  ],
  imageCount: [
    { value: 1, label: 'Siêu Phẩm' },
    { value: 2, label: 'Siêu Phẩm' },
    { value: 3, label: 'Siêu Phẩm' },
  ],
};

// --- VIP SECTION HEADER COMPONENT ---
const VIPSectionHeader = ({ 
  title, 
  icon, 
  isOpen, 
  onClick, 
  subtitle 
}: { 
  title: string, 
  icon: string, 
  isOpen: boolean, 
  onClick: () => void,
  subtitle?: string 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 transition-all duration-500 group relative overflow-hidden z-10 ${
      isOpen
        ? 'bg-gradient-to-r from-[#500000] via-[#3a0000] to-[#2a0a0a] border-[var(--accent-gold)] shadow-[0_0_25px_rgba(255,215,0,0.2)]'
        : 'bg-black/40 border-white/10 hover:border-[var(--accent-gold)]/50 hover:bg-black/60'
    }`}
  >
    {/* Animated Shine Background */}
    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-gold)]/10 to-transparent -translate-x-full transition-transform duration-1000 ${isOpen ? 'animate-[shimmer_3s_infinite]' : 'group-hover:animate-[shimmer_1.5s_infinite]'}`}></div>
    
    <div className="flex items-center gap-4 relative z-10">
      <div className={`text-3xl sm:text-4xl filter drop-shadow-lg transition-transform duration-500 ${isOpen ? 'scale-110 rotate-12' : 'scale-100 group-hover:scale-110'}`}>
        {icon}
      </div>
      <div className="text-left">
        <h3 className={`font-black text-lg sm:text-xl font-display uppercase tracking-widest transition-colors duration-300 ${
          isOpen 
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFA500]' 
            : 'text-gray-300 group-hover:text-[var(--accent-gold)]'
        }`}>
          {title}
        </h3>
        {subtitle && (
          <p className={`text-[10px] sm:text-xs font-sans tracking-wider uppercase transition-colors ${isOpen ? 'text-[var(--text-gold)]/80' : 'text-gray-500 group-hover:text-gray-400'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>

    <div className={`relative z-10 p-2 rounded-full border transition-all duration-500 ${
      isOpen 
        ? 'bg-[var(--accent-gold)] text-black border-[var(--accent-gold)] rotate-180 shadow-[0_0_15px_var(--accent-gold)]' 
        : 'bg-white/5 border-white/20 text-gray-400 group-hover:border-[var(--accent-gold)] group-hover:text-[var(--accent-gold)]'
    }`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
    </div>
  </button>
);

export const GenerationControls: React.FC<GenerationControlsProps> = ({
  options,
  onOptionChange,
  onImageUpload,
  onRemoveImage,
  onGenerateClick,
  uploadedImages,
  isLoading,
  history,
  onImageClick,
  onClearImages // Destructure
}) => {
  // State to manage collapsible sections
  const [sectionState, setSectionState] = useState({
    calendar: true,
    section1: true,
    section2: true,
    section3: true,
    section4: false // New Section 4 (formerly expandable)
  });

  const toggleSection = (key: keyof typeof sectionState) => {
    setSectionState(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleCollapseAll = () => {
      setSectionState({
          calendar: false,
          section1: false,
          section2: false,
          section3: false,
          section4: false
      });
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-8 space-y-8 relative shadow-2xl">
      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[var(--accent-gold)] rounded-tl-3xl opacity-100 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[var(--accent-gold)] rounded-br-3xl opacity-100 animate-pulse pointer-events-none"></div>
      <div className="absolute top-[-15px] right-[-15px] text-5xl animate-bounce drop-shadow-lg">🧧</div>
      <div className="absolute bottom-[-15px] left-[-15px] text-5xl animate-bounce drop-shadow-lg" style={{animationDelay: '1s'}}>🌸</div>
      
      <ImageUploader 
        onImageUpload={onImageUpload} 
        uploadedImages={uploadedImages} 
        onRemoveImage={onRemoveImage}
        onClearAll={onClearImages} // Pass down
      />
      
      {/* COLLAPSE ALL BUTTON */}
      <div className="flex justify-end">
          <button 
            onClick={handleCollapseAll}
            className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--accent-red)] hover:text-white bg-black/30 hover:bg-[var(--accent-red)] py-1.5 px-3 rounded-lg transition-all border border-[var(--accent-red)]/50"
          >
              ✖ Thu Gọn Tất Cả
          </button>
      </div>
      
      {/* --- VIP CALENDAR CONTROL CENTER --- */}
      {/* Set Z-Index high (60) and overflow-visible when open to allow dropdowns to float on top */}
      <div className="relative z-[60]">
        <div 
            onClick={() => toggleSection('calendar')}
            className="bg-gradient-to-br from-[#2a0a0a] to-[#4a0404] p-4 rounded-t-3xl border-x-2 border-t-2 border-[var(--accent-gold)] shadow-lg cursor-pointer flex justify-between items-center group relative overflow-hidden"
        >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-pulse pointer-events-none"></div>
             <div className="flex items-center gap-3 relative z-10">
                <span className="text-3xl animate-bounce">📆</span>
                <h3 className="text-[var(--text-gold)] font-black text-lg sm:text-xl font-display uppercase tracking-widest drop-shadow-md">
                    THIẾT KẾ LỊCH TẾT ĐỘC QUYỀN
                </h3>
             </div>
             <div className={`p-1 rounded-full border border-[var(--accent-gold)] transition-transform duration-300 ${sectionState.calendar ? 'rotate-180 bg-[var(--accent-gold)] text-black' : 'text-[var(--accent-gold)]'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
             </div>
        </div>

        <div className={`bg-gradient-to-br from-[#2a0a0a] to-[#4a0404] rounded-b-3xl border-x-2 border-b-2 border-[var(--accent-gold)] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out ${sectionState.calendar ? 'max-h-[1000px] opacity-100 p-6 pt-2 overflow-visible' : 'max-h-0 opacity-0 p-0 border-none overflow-hidden'}`}>
            <div className="flex flex-col gap-5 relative z-50">
                {/* ROW 1: YEAR & TYPE (Major Settings) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-black/30 p-2 rounded-xl relative z-50">
                        <OptionSelector
                            label="1. Chọn Năm (Niên Lịch)"
                            options={CALENDAR_YEARS}
                            selectedValue={options.calendarYear}
                            onChange={(value) => onOptionChange('calendarYear', value)}
                        />
                    </div>
                    <div className="bg-black/30 p-2 rounded-xl relative z-50">
                        <OptionSelector
                            label="2. Phong Cách Lịch (Design)"
                            options={CALENDAR_TYPES}
                            selectedValue={options.calendarType}
                            onChange={(value) => onOptionChange('calendarType', value)}
                        />
                    </div>
                </div>

                {/* ROW 2: SPECIFIC DETAILS (Fine Tuning) */}
                <div className="bg-black/20 p-3 rounded-xl border border-white/10 relative z-40">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center mb-2 font-bold">Chi tiết ngày tháng (Tùy chọn)</p>
                    <div className="grid grid-cols-3 gap-3">
                        <OptionSelector
                        label="Tháng (Month)"
                        options={CALENDAR_MONTHS}
                        selectedValue={options.calendarMonth}
                        onChange={(value) => onOptionChange('calendarMonth', value)}
                        />
                        <OptionSelector
                        label="Ngày (Day)"
                        options={CALENDAR_DAYS}
                        selectedValue={options.calendarDay}
                        onChange={(value) => onOptionChange('calendarDay', value)}
                        />
                        <OptionSelector
                        label="Thứ (Weekday)"
                        options={CALENDAR_WEEKDAYS}
                        selectedValue={options.calendarWeekday}
                        onChange={(value) => onOptionChange('calendarWeekday', value)}
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* SECTION 1: KHO TÀNG CHỦ ĐỀ VÔ TẬN (MIX THOẢI MÁI) */}
      <div className="relative z-40">
         <VIPSectionHeader 
            title="1. BỘ SƯU TẬP CHỦ ĐỀ (MIX & MATCH)"
            subtitle="Chọn nhiều chủ đề để tạo ra tác phẩm lai độc đáo (VD: Hoàng Gia + Phượng Hoàng + Neon)"
            icon="👑"
            isOpen={sectionState.section1}
            onClick={() => toggleSection('section1')}
         />
         
         <div className={`transition-all duration-700 ease-in-out ${sectionState.section1 ? 'max-h-[3000px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'}`}>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 px-2">
                <OptionSelector
                label="🌸 1. Du Xuân Vườn Hoa Tuyệt Sắc"
                options={FLOWER_SPRING_CONCEPTS}
                selectedValue={options.flowerSpringConcept}
                onChange={(value) => onOptionChange('flowerSpringConcept', value)}
                />

                <OptionSelector
                label="🙏 2. Lễ Chùa Cầu May Đầu Năm"
                options={PAGODA_LUCK_CONCEPTS}
                selectedValue={options.pagodaLuckConcept}
                onChange={(value) => onOptionChange('pagodaLuckConcept', value)}
                />

                <OptionSelector
                label="👑 3. Hoàng Gia & Đế Vương (Royal)"
                options={ROYAL_CONCEPTS}
                selectedValue={options.royalConcept}
                onChange={(value) => onOptionChange('royalConcept', value)}
                />
                
                <OptionSelector
                label="🔥 4. Phượng Hoàng Lửa (Phoenix)"
                options={PHOENIX_CONCEPTS}
                selectedValue={options.phoenixConcept}
                onChange={(value) => onOptionChange('phoenixConcept', value)}
                />

                <OptionSelector
                label="🐎 5. Linh Vật Bính Ngọ (Zodiac Horse)"
                options={ZODIAC_HORSE_CONCEPTS}
                selectedValue={options.zodiacHorseConcept}
                onChange={(value) => onOptionChange('zodiacHorseConcept', value)}
                />

                <OptionSelector
                label="💲 6. Giới Siêu Giàu (Billionaire)"
                options={BILLIONAIRE_CONCEPTS}
                selectedValue={options.billionaireConcept}
                onChange={(value) => onOptionChange('billionaireConcept', value)}
                />

                <OptionSelector
                label="☁️ 7. Tiên Cảnh Bồng Lai (Heavenly)"
                options={HEAVENLY_CONCEPTS}
                selectedValue={options.heavenlyConcept}
                onChange={(value) => onOptionChange('heavenlyConcept', value)}
                />
                
                <OptionSelector
                label="🌾 8. Chợ Quê & Tết Xưa (Rustic)"
                options={EMERALD_CONCEPTS}
                selectedValue={options.emeraldConcept}
                onChange={(value) => onOptionChange('emeraldConcept', value)}
                />
                
                <OptionSelector
                label="📸 9. Sàn Diễn Thời Trang (Fashion)"
                options={FASHION_STUDIO_CONCEPTS}
                selectedValue={options.fashionConcept}
                onChange={(value) => onOptionChange('fashionConcept', value)}
                />

                <OptionSelector
                label="📅 10. Lịch Tết Treo Tường (Calendar Art)"
                options={CALENDAR_CONCEPTS}
                selectedValue={options.calendarConcept}
                onChange={(value) => onOptionChange('calendarConcept', value)}
                />
                
                <OptionSelector
                label="📸 11. Studio Lịch Sang Trọng"
                options={STUDIO_CONCEPTS}
                selectedValue={options.studioConcept}
                onChange={(value) => onOptionChange('studioConcept', value)}
                />
                
                <OptionSelector
                label="👨‍👩‍👧‍👦 12. Đại Gia Đình Sum Vầy VIP"
                options={FAMILY_STUDIO_VIP_CONCEPTS}
                selectedValue={options.familyStudioVipConcept}
                onChange={(value) => onOptionChange('familyStudioVipConcept', value)}
                />

                <OptionSelector
                label="👨‍👩‍👧‍👦 13. Khoảnh Khắc Đoàn Viên (Cảm Xúc)"
                options={FAMILY_CONCEPTS}
                selectedValue={options.familyConcept}
                onChange={(value) => onOptionChange('familyConcept', value)}
                />
                
                <OptionSelector
                label="✈️ 14. Du Xuân Khắp Chốn (Travel)"
                options={TRAVEL_CONCEPTS}
                selectedValue={options.travelConcept}
                onChange={(value) => onOptionChange('travelConcept', value)}
                />
            </div>
         </div>
      </div>

      {/* SECTION 2: THỜI TRANG */}
      <div className="relative z-30">
        <VIPSectionHeader 
            title="2. THỜI TRANG & TRANG ĐIỂM"
            subtitle="Tự chọn trang phục hoặc để AI tự thiết kế theo Concept"
            icon="💎"
            isOpen={sectionState.section2}
            onClick={() => toggleSection('section2')}
         />
        
        <div className={`transition-all duration-700 ease-in-out ${sectionState.section2 ? 'max-h-[1000px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 px-2">
                <OptionSelector
                label="👗 Thời Trang Nữ (Haute Couture)"
                options={TET_OUTFITS_FEMALE}
                selectedValue={options.tetOutfitFemale}
                onChange={(value) => onOptionChange('tetOutfitFemale', value)}
                />
                <OptionSelector
                label="👔 Thời Trang Nam (Gentleman)"
                options={TET_OUTFITS_MALE}
                selectedValue={options.tetOutfitMale}
                onChange={(value) => onOptionChange('tetOutfitMale', value)}
                />
                <OptionSelector
                label="🌺 Hoa Cầm Tay Nghệ Thuật"
                options={FLOWERS}
                selectedValue={options.flower}
                onChange={(value) => onOptionChange('flower', value)}
                isMultiSelect
                />
            </div>
        </div>
      </div>

      {/* SECTION 3: KHÔNG GIAN & NGHỆ THUẬT */}
      <div className="relative z-20">
        <VIPSectionHeader 
            title="3. KHÔNG GIAN & HIỆU ỨNG"
            subtitle="Bối cảnh, Hiệu ứng, Bố cục, Phong cách..."
            icon="🎨"
            isOpen={sectionState.section3}
            onClick={() => toggleSection('section3')}
         />

        <div className={`transition-all duration-700 ease-in-out ${sectionState.section3 ? 'max-h-[1500px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 px-2">
                <OptionSelector
                label="🖌️ Phong Cách Nghệ Thuật (Art Style)"
                options={STYLES}
                selectedValue={options.style}
                onChange={(value) => onOptionChange('style', value)}
                />
                
                <OptionSelector
                label="📸 Góc Chụp Điện Ảnh (Camera)"
                options={CAMERA_ANGLES}
                selectedValue={options.cameraAngle}
                onChange={(value) => onOptionChange('cameraAngle', value)}
                />
                <OptionSelector
                label="🌸 Danh Lam Thắng Cảnh (Travel)"
                options={DESTINATIONS}
                selectedValue={options.destination}
                onChange={(value) => onOptionChange('destination', value)}
                />
                <OptionSelector
                label="🏰 Bối Cảnh Sang Trọng (Background)"
                options={TET_BACKGROUNDS}
                selectedValue={options.tetBackground}
                onChange={(value) => onOptionChange('tetBackground', value)}
                />
                <OptionSelector
                label="✨ Hiệu Ứng Phép Thuật (VFX)"
                options={EFFECTS}
                selectedValue={options.effect}
                onChange={(value) => onOptionChange('effect', value)}
                isMultiSelect
                />
                <OptionSelector
                label="📸 Bố Cục Sắp Đặt (Layout)"
                options={LAYOUTS}
                selectedValue={options.layout}
                onChange={(value) => onOptionChange('layout', value)}
                />
            </div>
        </div>
      </div>

      {/* SECTION 4: KHUNG VIỀN & MỞ RỘNG (RENAMED FROM EXPANDABLE) */}
      <div className="relative z-10">
         <VIPSectionHeader 
            title="4. KHUNG VIỀN & TÙY CHỌN MỞ RỘNG"
            subtitle="Khung ảnh, Phụ kiện, Thú cưng, Đạo cụ..."
            icon="🖼️"
            isOpen={sectionState.section4}
            onClick={() => toggleSection('section4')}
         />

         <div className={`transition-all duration-700 ease-in-out ${sectionState.section4 ? 'max-h-[1000px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 px-2 mt-4">
                {/* MOVED BORDER HERE */}
                <OptionSelector
                label="🖼️ Khung Viền Lễ Hội (Border)"
                options={BORDERS}
                selectedValue={options.border}
                onChange={(value) => onOptionChange('border', value)}
                isMultiSelect
                />
                
                <OptionSelector
                label="💍 Phụ Kiện Xa Xỉ (Accessories)"
                options={ACCESSORIES}
                selectedValue={options.accessory}
                onChange={(value) => onOptionChange('accessory', value)}
                isMultiSelect
                />
                <OptionSelector
                label="🎒 Đạo Cụ Cầm Tay (Props)"
                options={HANDHELD_ITEMS}
                selectedValue={options.handheldItem}
                onChange={(value) => onOptionChange('handheldItem', value)}
                isMultiSelect
                />
                <OptionSelector
                label="🐉 Thú Cưng Linh Vật (Pets)"
                options={PETS}
                selectedValue={options.pet}
                onChange={(value) => onOptionChange('pet', value)}
                isMultiSelect
                />
            </div>
         </div>
      </div>

      {/* CONTROLS */}
      <div className="space-y-4 pt-4 border-t border-[var(--accent-gold)]/30 relative z-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[var(--text-gold)] font-bold text-sm font-modern uppercase tracking-wider text-center block">Tỷ Lệ Khung Hình</label>
            <div className="grid grid-cols-3 gap-3 p-2 rounded-xl bg-black/20 border border-[var(--accent-gold)]/30">
              {visualOptions.aspectRatio.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onOptionChange('aspectRatio', opt.value)}
                  className={`flex flex-col items-center justify-center gap-1 py-3 px-1 rounded-lg transition-all duration-300 ${options.aspectRatio === opt.value ? 'bg-[var(--accent-gold)] text-black font-bold shadow-[0_0_15px_var(--accent-gold)] scale-105 ring-2 ring-white/20' : 'text-gray-300 hover:bg-white/10'}`}
                >
                  {opt.icon}
                  <span className="text-[10px] font-bold">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[var(--text-gold)] font-bold text-sm font-modern uppercase tracking-wider text-center block">Số Lượng Ảnh</label>
            <div className="grid grid-cols-3 gap-3 p-2 rounded-xl bg-black/20 border border-[var(--accent-gold)]/30">
              {visualOptions.imageCount.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onOptionChange('imageCount', opt.value)}
                  className={`flex flex-col items-center justify-center py-3 px-1 rounded-lg transition-all duration-300 ${options.imageCount === opt.value ? 'bg-[var(--accent-gold)] text-black font-bold shadow-[0_0_15px_var(--accent-gold)] scale-105 ring-2 ring-white/20' : 'text-gray-300 hover:bg-white/10'}`}
                >
                  <span className="text-xl font-black">{opt.value}</span>
                  <span className="text-[10px] font-bold">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

       <div className="flex flex-col gap-2 relative z-0">
        <label htmlFor="description" className="text-[var(--text-gold)] font-bold text-sm font-modern uppercase tracking-wider">Thần Chú Bổ Sung (Mô Tả Chi Tiết)</label>
        <textarea
          id="description"
          value={options.description}
          onChange={(e) => onOptionChange('description', e.target.value)}
          placeholder="Nhập thêm chi tiết để AI tạo ảnh đúng ý bạn nhất..."
          className="w-full bg-black/30 border border-[var(--accent-gold)]/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] focus:border-transparent min-h-[100px] backdrop-blur-sm transition-all shadow-inner"
        />
      </div>

      <button
        onClick={onGenerateClick}
        disabled={isLoading || uploadedImages.length === 0}
        className="w-full bg-gradient-to-r from-[#FF4D4D] via-[#FFD700] to-[#FF4D4D] text-white font-black py-4 px-6 rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.6)] hover:shadow-[0_0_50px_rgba(255,215,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl tracking-widest animate-vip-glow uppercase border-2 border-white/30 transform hover:-translate-y-1 flex items-center justify-center gap-3 relative overflow-hidden group z-0"
      >
        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
        <span className="relative z-10">{isLoading ? '🦄 ĐANG KHỞI TẠO PHÉP MÀU... 🦄' : '🧧 TẠO SIÊU PHẨM TẾT NGAY 🧧'}</span>
      </button>
      
       {history.length > 0 && (
         <div className="space-y-4 pt-6 border-t border-[var(--accent-gold)]/30 relative z-0">
           <h3 className="text-center font-black text-xl text-[var(--accent-gold)] font-display uppercase tracking-widest drop-shadow-md">✨ Bộ Sưu Tập Vàng ✨</h3>
           <HistoryDisplay history={history} onImageClick={onImageClick} />
         </div>
       )}
    </div>
  );
};
