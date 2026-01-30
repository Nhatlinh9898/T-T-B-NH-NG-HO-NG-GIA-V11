
import React, { useState, useEffect, useRef } from 'react';
import { DownloadIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

interface ImageViewerModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
}

const downloadImage = (src: string, fileName: string) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw the image only - NO TEXT
    ctx.drawImage(img, 0, 0);

    // Trigger download
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  img.src = src;
};

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ images, currentIndex, onClose }) => {
  const [index, setIndex] = useState(currentIndex);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

  const resetTransform = () => setTransform({ scale: 1, x: 0, y: 0 });

  const goToNext = () => {
    if (images.length > 1) {
      setIndex((prev) => (prev + 1) % images.length);
      resetTransform();
    }
  };

  const goToPrevious = () => {
    if (images.length > 1) {
      setIndex((prev) => (prev - 1 + images.length) % images.length);
      resetTransform();
    }
  };

  const handleDownload = () => {
    const src = images[index];
    const timestamp = new Date().getTime();
    const fileName = `kiet-tac-THIEN-MASTER-AI-${timestamp}.png`;
    downloadImage(src, fileName);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleAmount = 0.1;
    let newScale = transform.scale - e.deltaY * 0.01 * scaleAmount;
    newScale = Math.min(Math.max(0.5, newScale), 5); // Clamp scale
    setTransform(prev => ({...prev, scale: newScale}));
  };
  
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
    if (imageContainerRef.current) imageContainerRef.current.style.cursor = 'grabbing';
  };
  
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPosition.current.x;
    const dy = e.clientY - lastPosition.current.y;
    lastPosition.current = { x: e.clientX, y: e.clientY };
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (imageContainerRef.current) imageContainerRef.current.style.cursor = 'grab';
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" onWheel={handleWheel}>
      
      {/* Image Display Area */}
      <div 
        className="relative w-full h-full flex items-center justify-center overflow-hidden" 
        onMouseUp={onMouseUp} 
        onMouseLeave={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      >
        <div
            ref={imageContainerRef}
            style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                cursor: 'grab',
                transition: 'transform 0.2s ease-out',
            }}
        >
            <div className="relative">
                <img
                    src={images[index]}
                    alt={`View image ${index + 1}`}
                    className="block max-h-screen max-w-screen object-contain"
                />
            </div>
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
          <button onClick={handleDownload} className="flex items-center gap-2 bg-white/20 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-white/30 transition-colors">
              <DownloadIcon /> Tải về
          </button>
          <button onClick={onClose} className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors">
              <CloseIcon />
          </button>
      </div>

      {/* Side Navigation */}
      {images.length > 1 && (
        <>
            <button onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors">
                <ChevronLeftIcon />
            </button>
            <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors">
                <ChevronRightIcon />
            </button>
        </>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
