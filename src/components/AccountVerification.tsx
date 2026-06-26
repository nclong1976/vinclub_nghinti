import React, { useState } from 'react';
import { ArrowLeft, Shield, User, AlertTriangle, Contact, Smartphone, Lock, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { useUser } from './UserContext';
import IdentityVerification from './IdentityVerification';

interface AccountVerificationProps {
  onBack: () => void;
}

export default function AccountVerification({ onBack }: AccountVerificationProps) {
  const { phoneNumber, isIdentityVerified, setIsIdentityVerified, kycStatus, kycRejectReason } = useUser();
  const [showIdentityVerification, setShowIdentityVerification] = useState(false);

  const formattedPhone = phoneNumber 
    ? `${phoneNumber.substring(0, 2)}***${phoneNumber.substring(phoneNumber.length - 2)}`
    : '09***66';

  if (showIdentityVerification) {
    return <IdentityVerification 
      onBack={() => setShowIdentityVerification(false)} 
      onSuccess={() => {
        // Now it just submits, we don't automatically verify
        // The IdentityVerification component should update kycStatus to 'pending'
        setShowIdentityVerification(false);
      }}
    />;
  }

  const isPending = kycStatus === 'pending' && !isIdentityVerified;
  const isRejected = kycStatus === 'rejected' && !isIdentityVerified;

  return (
    <div className="flex-1 bg-[#f7f9fb] flex flex-col relative h-full">
      {/* Header */}
      <div className="flex items-center p-4 sticky top-0 z-20 bg-[#f7f9fb]">
        <button onClick={onBack} className="p-1 -ml-1 text-[#001839] hover:text-[#0055c8] transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-[#001839] font-bold text-[20px] font-['Montserrat'] pr-6">Xác thực tài khoản</h1>
      </div>

      <div className="flex-1 px-4 py-6 flex flex-col items-center overflow-y-auto pb-24" style={{ backgroundColor: '#f8f2f2' }}>
        {/* Shield Icon Area */}
        <div className={`w-24 h-24 ${isIdentityVerified ? 'bg-[#e6f4ea]' : isPending ? 'bg-amber-100' : isRejected ? 'bg-rose-100' : 'bg-[#e0e3e5]'} rounded-3xl flex items-center justify-center mb-5 relative`}>
           <div className={`flex items-center gap-1.5 ${isIdentityVerified ? 'text-[#00875A]' : isPending ? 'text-amber-600' : isRejected ? 'text-rose-600' : 'text-[#001839]'}`}>
              <Shield className="w-7 h-7 fill-current" />
              <User className="w-7 h-7 fill-current" />
           </div>
           {!isIdentityVerified && !isPending && !isRejected && (
             <div className="absolute -bottom-1 -right-1 bg-[#f7f9fb] rounded-full p-1">
                <div className="bg-[#ba1a1a] text-white rounded-full w-7 h-7 flex items-center justify-center shadow-sm">
                   <AlertTriangle className="w-4 h-4 fill-current text-white" />
                </div>
             </div>
           )}
           {isPending && (
             <div className="absolute -bottom-1 -right-1 bg-[#f7f9fb] rounded-full p-1">
                <div className="bg-amber-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-sm">
                   <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
             </div>
           )}
           {isRejected && (
             <div className="absolute -bottom-1 -right-1 bg-[#f7f9fb] rounded-full p-1">
                <div className="bg-rose-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-sm">
                   <AlertTriangle className="w-4 h-4 fill-current text-white" />
                </div>
             </div>
           )}
           {isIdentityVerified && (
             <div className="absolute -bottom-1 -right-1 bg-[#f7f9fb] rounded-full p-1">
                <div className="bg-[#00875A] text-white rounded-full w-7 h-7 flex items-center justify-center shadow-sm">
                   <Check className="w-4 h-4 text-white" />
                </div>
             </div>
           )}
        </div>

        <h2 className={`${isIdentityVerified ? 'text-[#00875A]' : isPending ? 'text-amber-600' : isRejected ? 'text-rose-600' : 'text-[#ba1a1a]'} text-[22px] font-bold font-['Montserrat'] mb-2 text-center tracking-tight`}>
          {isIdentityVerified ? 'Đã xác thực tài khoản' : isPending ? 'Đang chờ phê duyệt' : isRejected ? 'Xác thực bị từ chối' : 'Tài khoản chưa xác thực'}
        </h2>
        <p className="text-[#43474f] text-[13px] text-center mb-8 px-2 font-['Plus_Jakarta_Sans'] leading-relaxed max-w-[280px]">
          {isIdentityVerified ? 'Tài khoản của bạn đã được bảo mật và sẵn sàng cho các giao dịch' : isPending ? 'Hồ sơ của bạn đang được xử lý. Vui lòng quay lại sau.' : isRejected ? 'Hồ sơ bị từ chối. Vui lòng xem lý do và cập nhật lại thông tin.' : 'Vui lòng cung cấp thông tin để bảo mật tài khoản và hưởng đặc quyền đầu tư'}
        </p>

        {isRejected && kycRejectReason && (
          <div className="w-full max-w-sm bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6">
            <p className="text-rose-700 text-[13px] font-medium mb-1">Lý do từ chối:</p>
            <p className="text-rose-600 text-sm font-bold">{kycRejectReason}</p>
          </div>
        )}

        {/* Verification Cards */}
        <div className="w-full space-y-4 max-w-sm">
           {/* CCCD / Hộ chiếu */}
           <div className={`bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-5 ${isIdentityVerified || isPending ? 'flex items-center justify-between' : ''}`}>
              {!isIdentityVerified && !isPending ? (
                <>
                  <div className="w-12 h-10 bg-[#f2f4f6] rounded-lg flex items-center justify-center mb-4">
                     <Contact className="w-6 h-6 text-[#001839] fill-current" />
                  </div>
                  <h3 className="text-[#001839] text-[16px] font-semibold mb-1.5 font-['Montserrat'] tracking-tight">Xác thực CCCD/Hộ chiếu</h3>
                  <p className="text-[#43474f] text-[13px] mb-5 font-['Plus_Jakarta_Sans']">Yêu cầu bắt buộc để mở khóa tính năng giao dịch</p>
                  
                  <button 
                    onClick={() => setShowIdentityVerification(true)}
                    className="w-full bg-[#0055c8] hover:bg-[#286eea] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                     <span className="text-[15px]">{isRejected ? 'Cập nhật lại thông tin' : 'Bắt đầu'}</span>
                     <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : isPending ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                      <Contact className="w-6 h-6 text-amber-600 fill-current" />
                    </div>
                    <div>
                      <h3 className="text-[#001839] text-[15px] font-semibold font-['Montserrat']">Xác thực CCCD/Hộ chiếu</h3>
                      <p className="text-amber-600 text-[13px] font-['Plus_Jakarta_Sans']">Đang chờ xử lý...</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#e6f4ea] rounded-lg flex items-center justify-center shrink-0">
                      <Contact className="w-6 h-6 text-[#00875A] fill-current" />
                    </div>
                    <div>
                      <h3 className="text-[#001839] text-[15px] font-semibold font-['Montserrat']">Xác thực CCCD/Hộ chiếu</h3>
                      <p className="text-[#747780] text-[13px] font-['Plus_Jakarta_Sans']">Đã xác thực</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#00875A] flex items-center justify-center">
                     <Check className="w-4 h-4 text-white" />
                  </div>
                </>
              )}
           </div>

           {/* Số điện thoại */}
           <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#e6f4ea] rounded-lg flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 text-[#00875A]" />
                </div>
                <div>
                  <h3 className="text-[#001839] text-[15px] font-semibold font-['Montserrat']">Số điện thoại</h3>
                  <p className="text-[#747780] text-[13px] font-['Plus_Jakarta_Sans']">{formattedPhone}</p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#00875A] flex items-center justify-center">
                 <Check className="w-4 h-4 text-white" />
              </div>
           </div>

           {/* Info Box */}
           <div className="bg-[#f2f4f6] rounded-xl p-4 flex gap-3 mt-6">
              <Lock className="w-5 h-5 text-[#747780] shrink-0 mt-0.5" />
              <p className="text-[#43474f] text-[12px] leading-relaxed font-['Plus_Jakarta_Sans']">
                 Thông tin của bạn được mã hóa an toàn và chỉ sử dụng cho mục đích xác thực danh tính theo quy định pháp luật.
              </p>
           </div>
        </div>
      </div>

      {/* Bottom Fixed Button */}
      {!isIdentityVerified && (
        <div className="mt-auto p-4 pb-20 bg-transparent shrink-0">
           <button 
              onClick={() => setShowIdentityVerification(true)}
              className="w-full bg-[#001839] hover:bg-[#002c5f] text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 font-['Montserrat'] transition-colors shadow-lg"
           >
              <span>Xác thực ngay</span>
              <ShieldCheck className="w-5 h-5" />
           </button>
        </div>
      )}
    </div>
  );
}
