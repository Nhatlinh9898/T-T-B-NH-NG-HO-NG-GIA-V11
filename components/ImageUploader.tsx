import React, { useRef } from 'react';
import { CloseIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (files: FileList) => void;
  uploadedImages: string[];
  onRemoveImage: (index: number) => void;
  onClearAll?: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploadedImages, onRemoveImage, onClearAll }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onImageUpload(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="text-center p-3 border-2 border-dashed border-[var(--accent-gold)]/50 rounded-2xl bg-black/20 hover:bg-black/30 transition-all group relative overflow-hidden w-full">
       {/* Background Glow */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"></div>
      
      <h3 className="font-black text-lg text-[var(--accent-gold)] mb-1 font-display uppercase tracking-widest drop-shadow-md">
        📸 KHO ẢNH GỐC (FACE LOCK)
      </h3>
      <p className="text-[9px] text-gray-300 font-sans mb-3 uppercase tracking-wider">
        Tải lên 1 hoặc nhiều ảnh (Gia đình, Bạn bè) để AI tự động ghép siêu thực
      </p>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        multiple 
      />

      {uploadedImages.length > 0 ? (
        <div className="flex flex-col gap-3">
            
            {/* LOGIC HIỂN THỊ MỚI: CENTER AND COMPACT */}
            {uploadedImages.length === 1 ? (
                // --- 1 ẢNH: NẰM GIỮA, FULL KÍCH THƯỚC (CONTAIN) NHƯNG GỌN ---
                <div className="flex flex-col items-center justify-center animate-fade-in-up">
                    <div className="relative group/img inline-block w-auto max-w-full">
                         <img 
                            src={uploadedImages[0]} 
                            alt="Ảnh gốc đã tải lên" 
                            className="max-h-[250px] w-auto max-w-full object-contain rounded-lg border-2 border-[var(--accent-gold)] shadow-[0_0_15px_rgba(255,215,0,0.3)]" 
                        />
                         <button 
                            onClick={(e) => { e.stopPropagation(); onRemoveImage(0); }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 shadow-lg hover:bg-red-700 hover:scale-110 transition-all border border-white z-10"
                            title="Xóa ảnh này"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                    
                    {/* Compact Add More Button */}
                     <div 
                        onClick={handleClick}
                        className="mt-2 flex items-center gap-2 px-4 py-1.5 border border-dashed border-[var(--accent-gold)]/40 rounded-full cursor-pointer hover:bg-[var(--accent-gold)]/20 transition-colors text-[var(--accent-gold)] bg-black/40 shadow-lg"
                    >
                        <span className="text-lg font-bold">+</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Thêm ảnh khác</span>
                    </div>
                </div>
            ) : (
                 // --- NHIỀU ẢNH: TỪ GIỮA ĐẨY RA 2 BÊN ---
                <div className="flex flex-wrap justify-center items-center gap-2 pb-2 animate-fade-in-up">
                    {uploadedImages.map((imgSrc, index) => (
                        <div key={index} className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 group/img transition-transform hover:scale-105" style={{animationDelay: `${index * 0.05}s`}}>
                            <img 
                                src={imgSrc} 
                                alt={`Ảnh tải lên ${index}`} 
                                className="w-full h-full object-cover rounded-lg border border-[var(--accent-gold)] shadow-md" 
                            />
                            <button 
                                onClick={(e) => { e.stopPropagation(); onRemoveImage(index); }}
                                className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 shadow-md hover:bg-red-700 hover:scale-110 transition-all border border-white z-10"
                                title="Xóa ảnh này"
                            >
                                <CloseIcon />
                            </button>
                            <div className="absolute bottom-0.5 left-0.5 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded-full backdrop-blur-sm border border-white/20 font-mono">
                                #{index + 1}
                            </div>
                        </div>
                    ))}
                    
                    {/* Add More Button Square */}
                    <div 
                        onClick={handleClick}
                        className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center border border-dashed border-[var(--accent-gold)]/30 rounded-lg cursor-pointer hover:bg-[var(--accent-gold)]/10 transition-colors text-[var(--accent-gold)] bg-black/20"
                    >
                        <span className="text-2xl">+</span>
                        <span className="text-[8px] font-bold uppercase mt-1">Thêm</span>
                    </div>
                </div>
            )}
            
            <div className="flex justify-between items-center px-2 pt-2 border-t border-white/10 mt-1">
                <span className="text-[10px] text-green-400 font-bold bg-green-900/30 px-2 py-0.5 rounded border border-green-500/30">
                    ✅ Đã chọn {uploadedImages.length} nhân vật
                </span>
                <button 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        if (onClearAll) onClearAll(); 
                    }} 
                    className="text-[10px] text-red-400 hover:text-red-300 underline font-bold cursor-pointer hover:scale-105 transition-transform"
                >
                    Xóa tất cả
                </button>
            </div>
        </div>
      ) : (
        <div 
          onClick={handleClick} 
          className="cursor-pointer py-4 flex flex-col items-center justify-center text-[var(--text-light)]/70 transition-transform hover:scale-[1.02]"
        >
            <div className="w-12 h-12 rounded-full bg-[var(--accent-gold)]/10 flex items-center justify-center mb-2 ring-1 ring-[var(--accent-gold)]/30 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--accent-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <p className="font-bold text-[var(--accent-gold)] font-sans text-sm">CHẠM ĐỂ TẢI ẢNH LÊN</p>
            <p className="text-[9px] text-gray-400 font-sans mt-1 max-w-[200px] leading-relaxed">
                Hỗ trợ ghép nhiều người cùng lúc (Gia đình, Cặp đôi, Nhóm bạn)
            </p>
        </div>
      )}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};