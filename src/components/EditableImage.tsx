import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { useImage } from './ImageContext';

export default function EditableImage({ 
  imageKey, 
  defaultSrc, 
  className = '',
  isBackground = false,
  backgroundSize = 'cover',
  overlayClassName,
  children
}: { 
  imageKey: string, 
  defaultSrc: string, 
  className?: string,
  isBackground?: boolean,
  backgroundSize?: string,
  overlayClassName?: string,
  children?: React.ReactNode
}) {
  const { overrides, setOverride, isEditMode } = useImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasOverride = !!overrides[imageKey];
  const currentSrc = overrides[imageKey] || defaultSrc;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setOverride(imageKey, dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOverride(imageKey, '');
  };

  if (isBackground) {
    return (
      <div 
        className={`relative ${className}`}
        style={{ backgroundImage: currentSrc ? `url('${currentSrc}')` : undefined, backgroundSize, backgroundPosition: 'center' }}
      >
        {isEditMode && (
          <div 
            className={overlayClassName || "absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer z-[99] hover:bg-black/70 transition-colors group"}
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          >
            <Camera className={`w-8 h-8 mb-2 ${overlayClassName ? '' : 'text-white'}`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${overlayClassName ? '' : 'text-white'}`}>Đổi ảnh</span>
            {hasOverride && (
              <button 
                onClick={handleRemove}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md opacity-90 hover:opacity-100 transition-opacity"
                title="Xóa ảnh tùy chỉnh"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
        {children}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {currentSrc ? (
        <img src={currentSrc} alt="Editable" className="w-full h-full object-cover" />
      ) : null}
      {isEditMode && (
        <div 
          className={overlayClassName || "absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer z-[99] hover:bg-black/70 transition-colors group"}
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
        >
          <Camera className={`w-8 h-8 mb-2 ${overlayClassName ? '' : 'text-white'}`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${overlayClassName ? '' : 'text-white'}`}>Đổi ảnh</span>
          {hasOverride && (
            <button 
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md opacity-90 hover:opacity-100 transition-opacity"
              title="Xóa ảnh tùy chỉnh"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
      {children}
    </div>
  );
}
