import React, { createContext, useContext, useState, useEffect } from 'react';

type ImageContextType = {
  overrides: Record<string, string>;
  setOverride: (key: string, dataUrl: string) => void;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
};

export const ImageContext = createContext<ImageContextType>({
  overrides: {},
  setOverride: () => {},
  isEditMode: false,
  setIsEditMode: () => {},
});

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('image-overrides');
    if (saved) {
      try {
        setOverrides(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const setOverride = (key: string, dataUrl: string) => {
    setOverrides(prev => {
      const next = { ...prev, [key]: dataUrl };
      try {
        localStorage.setItem('image-overrides', JSON.stringify(next));
      } catch (e) {
        console.error('Storage error', e);
        alert('Không thể lưu ảnh do dung lượng quá lớn. Vui lòng chọn ảnh có kích thước nhỏ hơn.');
      }
      return next;
    });
  };

  return (
    <ImageContext.Provider value={{ overrides, setOverride, isEditMode, setIsEditMode }}>
      {children}
    </ImageContext.Provider>
  );
}

export const useImage = () => useContext(ImageContext);
