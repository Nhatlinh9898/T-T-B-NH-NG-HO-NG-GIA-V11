import React from 'react';
import { CloseIcon } from './icons';

interface QrCodeModalProps {
  qrCodeSrc: string;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ qrCodeSrc, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-code-title"
    >
      <div 
        className="relative bg-white p-4 rounded-2xl shadow-2xl animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={qrCodeSrc} 
          alt="Mã QR chuyển khoản Techcombank - Phóng to"
          className="w-64 h-64 sm:w-80 sm:h-80 rounded-xl"
        />
        <p id="qr-code-title" className="text-center mt-3 text-sm font-sans text-gray-800 font-semibold">
            Quét mã để mời Thiện một ly cà phê!
        </p>
      </div>
      
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
        aria-label="Đóng"
      >
        <CloseIcon />
      </button>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        @keyframes zoom-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-zoom-in {
          animation: zoom-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
