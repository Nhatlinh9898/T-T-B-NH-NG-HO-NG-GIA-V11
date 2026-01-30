import React from 'react';

interface HistoryDisplayProps {
  history: string[];
  onImageClick: (url: string) => void;
}

export const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history, onImageClick }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {history.map((src, index) => (
        <div
          key={index}
          className="aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-lg shadow-black/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--accent-gold)]/10 hover:scale-105 border-2 border-transparent hover:border-[var(--accent-gold)]"
          onClick={() => onImageClick(src)}
        >
          <img
            src={src}
            alt={`History item ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};