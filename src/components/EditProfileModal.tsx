import React, { useRef, useState } from 'react';
import { X, Camera } from 'lucide-react';
import { useUser } from './UserContext';

export default function EditProfileModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { 
    displayName, setDisplayName, 
    avatarImage, setAvatarImage,
    phoneNumber, setPhoneNumber,
    birthYear, setBirthYear,
    cccd, setCccd,
    address, setAddress
  } = useUser();
  
  const [tempName, setTempName] = useState(displayName);
  const [tempAvatar, setTempAvatar] = useState(avatarImage);
  const [tempPhone, setTempPhone] = useState(phoneNumber);
  const [tempBirthYear, setTempBirthYear] = useState(birthYear);
  const [tempCccd, setTempCccd] = useState(cccd);
  const [tempAddress, setTempAddress] = useState(address);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync temp state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTempName(displayName);
      setTempAvatar(avatarImage);
      setTempPhone(phoneNumber);
      setTempBirthYear(birthYear);
      setTempCccd(cccd);
      setTempAddress(address);
    }
  }, [isOpen, displayName, avatarImage, phoneNumber, birthYear, cccd, address]);

  if (!isOpen) return null;

  const handleSave = () => {
    setDisplayName(tempName);
    setAvatarImage(tempAvatar);
    setPhoneNumber(tempPhone);
    setBirthYear(tempBirthYear);
    setCccd(tempCccd);
    setAddress(tempAddress);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 256;
          const MAX_HEIGHT = 256;
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
          setTempAvatar(dataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a202c] border border-zinc-700 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-zinc-200 font-semibold text-lg">Chỉnh sửa hồ sơ</h3>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center gap-6">
          {/* Avatar Edit */}
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-24 h-24 rounded-full border-2 border-[#c29b57] overflow-hidden bg-black flex items-center justify-center relative">
              {tempAvatar ? (
                <img src={tempAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-[#c29b57] text-3xl font-bold">{tempName.charAt(0).toUpperCase()}</div>
              )}
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white mb-1" />
                <span className="text-[10px] text-white font-medium">ĐỔI ẢNH</span>
              </div>
            </div>
            {tempAvatar && (
              <button 
                onClick={(e) => { e.stopPropagation(); setTempAvatar(null); }}
                className="absolute top-0 right-0 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-colors shadow-md"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Name Edit */}
          <div className="w-full space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Họ và tên
              </label>
              <input 
                type="text" 
                value={tempName}
                disabled
                className="w-full bg-[#12161f] border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-500 cursor-not-allowed select-none font-medium"
                placeholder="Nhập họ và tên..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Số điện thoại
              </label>
              <input 
                type="text" 
                value={tempPhone}
                disabled
                className="w-full bg-[#12161f] border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-500 cursor-not-allowed select-none font-medium"
                placeholder="Nhập số điện thoại..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Năm sinh (ngày/tháng/năm)</label>
                <input 
                  type="text" 
                  value={tempBirthYear}
                  onChange={(e) => setTempBirthYear(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:border-[#c29b57] focus:ring-1 focus:ring-[#c29b57] transition-all"
                  placeholder="Ví dụ: 20/10/1990"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Số CCCD</label>
                <input 
                  type="text" 
                  value={tempCccd}
                  onChange={(e) => setTempCccd(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:border-[#c29b57] focus:ring-1 focus:ring-[#c29b57] transition-all"
                  placeholder="Số CCCD..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Địa chỉ</label>
              <input 
                type="text" 
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
                className="w-full bg-[#0f0f0f] border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:border-[#c29b57] focus:ring-1 focus:ring-[#c29b57] transition-all"
                placeholder="Nhập địa chỉ..."
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800 bg-[#12161f] flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#c29b57] text-black font-semibold hover:bg-[#ebd5ad] transition-colors"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
