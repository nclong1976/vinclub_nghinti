import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, UploadCloud, FileImage, CheckCircle2, AlertCircle } from 'lucide-react';
import { useUser } from './UserContext';
import frontDefaultImg from '../assets/images/regenerated_image_1782467998194.webp';
import backDefaultImg from '../assets/images/regenerated_image_1782467997539.webp';

interface IdentityVerificationProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function IdentityVerification({ onBack, onSuccess }: IdentityVerificationProps) {
  const { updateUserField } = useUser();
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === 'front') {
          setFrontImage(reader.result as string);
        } else {
          setBackImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!frontImage || !backImage) {
      setShowToast({ message: 'Vui lòng cung cấp đầy đủ ảnh 2 mặt CCCD/Hộ chiếu', type: 'error' });
      setTimeout(() => setShowToast(null), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      if (updateUserField) {
        await Promise.all([
          updateUserField('cccdFrontImage', frontImage),
          updateUserField('cccdBackImage', backImage),
          updateUserField('kycStatus', 'pending'),
          updateUserField('kycRejectReason', null)
        ]);
      }
      
      setShowToast({ message: 'Đã gửi thông tin xác thực thành công. Chúng tôi sẽ xử lý trong thời gian sớm nhất.', type: 'success' });
      setTimeout(() => {
        setShowToast(null);
        setIsSubmitting(false);
        onSuccess();
      }, 2500);
    } catch (e) {
      console.error(e);
      setShowToast({ message: 'Lỗi khi gửi thông tin.', type: 'error' });
      setIsSubmitting(false);
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  const triggerInput = (side: 'front' | 'back', capture: boolean = false) => {
    const ref = side === 'front' ? frontInputRef : backInputRef;
    if (ref.current) {
      if (capture) {
        ref.current.setAttribute('capture', 'environment');
      } else {
        ref.current.removeAttribute('capture');
      }
      ref.current.click();
    }
  };

  return (
    <div className="flex-1 bg-[#f7f9fb] flex flex-col relative h-full animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center p-4 sticky top-0 z-20 bg-[#f7f9fb]">
        <button onClick={onBack} className="p-1 -ml-1 text-[#001839] hover:text-[#0055c8] transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-[#001839] font-bold text-[20px] font-['Montserrat'] pr-6">Xác thực CCCD / Hộ chiếu</h1>
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto pb-28" style={{ backgroundColor: '#f8f2f2' }}>
        <div className="bg-[#e6f4ea] text-[#00875A] p-3 rounded-lg flex items-start gap-2 mb-6 shadow-sm border border-[#c3e6cb]">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-[13px] font-medium font-['Plus_Jakarta_Sans'] leading-relaxed">
            Vui lòng chụp rõ nét, không bị lóa sáng hay mất góc để quá trình xác thực diễn ra nhanh nhất.
          </p>
        </div>

        <div className="space-y-6">
          {/* Front Image */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-5">
            <h3 className="text-[#001839] text-[15px] font-bold mb-3 font-['Montserrat']">Ảnh mặt trước CCCD / Hộ chiếu</h3>
            <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-[#c4c6d1] bg-[#f2f4f6] flex flex-col items-center justify-center min-h-[160px]">
              {frontImage ? (
                <>
                  <img src={frontImage} alt="Mặt trước" className="w-full h-full object-cover absolute inset-0" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button onClick={() => setFrontImage(null)} className="bg-white/90 text-[#ba1a1a] px-4 py-2 rounded-lg font-semibold text-sm">Chụp lại</button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center p-4 text-center">
                  <FileImage className="w-10 h-10 text-[#747780] mb-2" />
                  <p className="text-[#43474f] text-sm font-medium mb-4">Tải ảnh lên hoặc chụp ảnh trực tiếp</p>
                  <div className="flex gap-3">
                    <button onClick={() => triggerInput('front', true)} className="bg-[#001839] hover:bg-[#002c5f] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                      <Camera className="w-4 h-4" />
                      Chụp ảnh
                    </button>
                    <button onClick={() => triggerInput('front', false)} className="bg-white border border-[#c4c6d1] text-[#001839] px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                      <UploadCloud className="w-4 h-4" />
                      Tải lên
                    </button>
                  </div>
                </div>
              )}
              <input type="file" accept="image/*" ref={frontInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'front')} />
            </div>
          </div>

          {/* Back Image */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-5">
            <h3 className="text-[#001839] text-[15px] font-bold mb-3 font-['Montserrat']">Ảnh mặt sau CCCD (Tùy chọn với Hộ chiếu)</h3>
            <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-[#c4c6d1] bg-[#f2f4f6] flex flex-col items-center justify-center min-h-[160px]">
              {backImage ? (
                <>
                  <img src={backImage} alt="Mặt sau" className="w-full h-full object-cover absolute inset-0" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button onClick={() => setBackImage(null)} className="bg-white/90 text-[#ba1a1a] px-4 py-2 rounded-lg font-semibold text-sm">Chụp lại</button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center p-4 text-center">
                  <FileImage className="w-10 h-10 text-[#747780] mb-2" />
                  <p className="text-[#43474f] text-sm font-medium mb-4">Tải ảnh lên hoặc chụp ảnh trực tiếp</p>
                  <div className="flex gap-3">
                    <button onClick={() => triggerInput('back', true)} className="bg-[#001839] hover:bg-[#002c5f] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                      <Camera className="w-4 h-4" />
                      Chụp ảnh
                    </button>
                    <button onClick={() => triggerInput('back', false)} className="bg-white border border-[#c4c6d1] text-[#001839] px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                      <UploadCloud className="w-4 h-4" />
                      Tải lên
                    </button>
                  </div>
                </div>
              )}
              <input type="file" accept="image/*" ref={backInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'back')} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fixed Button */}
      <div className="mt-auto p-4 pb-20 bg-transparent shrink-0">
         <button 
           onClick={handleSubmit}
           disabled={isSubmitting || !frontImage || !backImage}
           className="w-full bg-[#001839] disabled:bg-[#808c9c] hover:bg-[#002c5f] text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 font-['Montserrat'] transition-colors shadow-lg"
         >
            {isSubmitting ? 'Đang gửi...' : 'Gửi thông tin xác thực'}
         </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[250] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border transition-all duration-300 animate-in fade-in slide-in-from-top-4 w-[90%] max-w-sm ${
          showToast.type === 'success' ? 'bg-green-50 text-[#00875A] border-green-200' : 'bg-red-50 text-[#ba1a1a] border-red-200'
        }`}>
          {showToast.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="text-sm font-medium font-['Plus_Jakarta_Sans']">{showToast.message}</span>
        </div>
      )}
    </div>
  );
}
