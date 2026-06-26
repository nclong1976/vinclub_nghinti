import React, { useState, useContext } from 'react';
import { ArrowLeft, Wallet, TrendingUp, CheckCircle, AlertCircle, ArrowRight, ShieldCheck, Building2 } from 'lucide-react';
import { UserContext } from './UserContext';
import ContractSign from './ContractSign';
import { Project } from '../types';

interface VinpearlInvestViewProps {
  projectId?: string;
  onBack: () => void;
}

export default function VinpearlInvestView({ projectId, onBack }: VinpearlInvestViewProps) {
  const { balance, addTransaction, setBalance, adminProjects } = useContext(UserContext);
  const [showToast, setShowToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [signatureType, setSignatureType] = useState<'draw' | 'type' | 'saved' | null>(null);
  const [signatureContent, setSignatureContent] = useState<string | null>(null);

  // Look up the selected project, or default to the first project in adminProjects
  const project = adminProjects.find(p => p.id === projectId) || adminProjects[0];

  const formatCurrency = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  };

  const investmentAmount = project?.minInvestAmount || 1200000000;
  const canInvest = balance >= investmentAmount;

  const handleProceedToSign = () => {
    if (project?.status === 'CLOSED') {
      setShowToast({ message: 'Dự án đã đóng cổng tiếp nhận vốn.', type: 'error' });
      setTimeout(() => setShowToast(null), 3000);
      return;
    }
    if (!canInvest) {
      setShowToast({ message: 'Số dư không đủ. Vui lòng nạp thêm.', type: 'error' });
      setTimeout(() => setShowToast(null), 3000);
      return;
    }
    setStep(2);
  };

  const handleSignatureComplete = (type: 'draw' | 'type' | 'saved', content: string) => {
    setSignatureType(type);
    setSignatureContent(content);

    addTransaction({
      amount: investmentAmount,
      type: 'invest',
      status: 'Thành công',
      signatureType: type,
      signatureContent: content,
      contractProjectTitle: project.title
    });
    
    setBalance((prev) => Math.max(0, prev - investmentAmount));
    setStep(3);
  };

  if (step === 3) {
    const estimatedInterest = Math.round(investmentAmount * project.interestRateValue * project.durationDays);
    const totalReturn = investmentAmount + estimatedInterest;
    
    return (
      <div className="flex-1 bg-[#f7f9fb] flex flex-col items-center justify-center p-6 min-h-screen text-[#001839] font-['Plus_Jakarta_Sans'] animate-in fade-in zoom-in-95 duration-300 overflow-y-auto">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4 border border-green-200 mt-8">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <h2 className="text-[#001839] font-extrabold text-[16px] mb-1 uppercase tracking-wider font-['Montserrat']">HỢP ĐỒNG ĐẦU TƯ ĐÃ HOÀN THÀNH</h2>
        <p className="text-[#334155] text-[12px] max-w-[300px] text-center mb-6 leading-relaxed">
          Khoản đầu tư của quý khách vào dự án đã được xử lý và lưu trữ thành công trên hệ thống.
        </p>

        {/* Receipt Visual Container */}
        <div className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-4 text-left text-[12px] mb-6 space-y-2.5 relative shadow-sm max-w-[400px]">
          <p className="text-[10px] text-[#747780] font-bold uppercase tracking-widest mb-2 border-b border-[#E2E8F0] pb-1.5">Hợp đồng điện tử VinClub</p>
          
          <div className="flex justify-between">
            <span className="text-[#334155] font-medium">Tên dự án:</span>
            <span className="font-bold text-[#001839] max-w-[180px] text-right truncate">{project.title}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#334155] font-medium">Mức đầu tư tài trợ:</span>
            <span className="font-extrabold text-[#001839] text-[14px]">{formatCurrency(investmentAmount)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#334155] font-medium">Thời hạn cam kết:</span>
            <span className="font-bold text-[#001839]">{project.durationDays} ngày</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#334155] font-medium">Tổng thu nhập dự tính:</span>
            <span className="font-extrabold text-[#00875A]">{formatCurrency(investmentAmount + Math.round(investmentAmount * project.interestRateValue * project.durationDays))}</span>
          </div>

          <div className="h-[1px] bg-[#E2E8F0] my-2"></div>

          {/* Captured signature display */}
          <div className="flex items-center justify-between">
            <span className="text-[#334155] font-medium">Chữ ký điện tử:</span>
            <div className="h-10 w-24 bg-[#f7f9fb] border border-[#E2E8F0] rounded flex items-center justify-center overflow-hidden p-1">
              {signatureType === 'draw' && signatureContent ? (
                <img src={signatureContent} alt="Chữ ký vẽ tay" className="max-h-full max-w-full object-contain" />
              ) : signatureType === 'type' && signatureContent ? (
                <span 
                  className="text-[12px] font-semibold text-[#001839] italic" 
                  style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive" }}
                >
                  {signatureContent}
                </span>
              ) : (
                <span className="text-[9px] text-[#747780] font-bold uppercase">ĐÃ KÝ</span>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={onBack}
          className="w-full max-w-[400px] bg-[#001839] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 font-['Montserrat'] hover:bg-[#002c5f] transition-colors"
        >
          <span>VỀ TRANG CHI TIẾT</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#f7f9fb] flex flex-col min-h-screen text-[#001839] font-['Plus_Jakarta_Sans']">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-20 left-4 right-4 z-50 p-4 rounded-xl flex items-start gap-3 shadow-lg animate-in slide-in-from-top-4 ${
          showToast.type === 'success' ? 'bg-[#e6f4ea] text-[#00875A] border border-[#c3e6cb]' : 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ffb4ab]'
        }`}>
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-[14px] font-medium leading-relaxed">{showToast.message}</p>
        </div>
      )}

      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-40 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 h-16 shadow-sm">
        <button onClick={() => step === 2 ? setStep(1) : onBack()} className="text-[#001839] hover:bg-[#f2f4f6] transition-colors p-2 rounded-full active:opacity-80">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-[20px] text-[#001839] font-['Montserrat']">
          {step === 2 ? 'Ký hợp đồng' : 'Đầu tư ngay'}
        </h1>
        <div className="w-10"></div>
      </header>

      {step === 1 ? (
        <>
          <main className="px-4 py-6 max-w-[600px] mx-auto w-full flex-1 flex flex-col">
            {/* Project Mini Card */}
            <div className="bg-white rounded-xl p-3 border border-[#E2E8F0] flex items-center gap-4 mb-8 shadow-sm">
              {project.imageUrl ? (
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-[60px] h-[60px] rounded-lg object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-[60px] h-[60px] rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                  <Building2 className="w-6 h-6" />
                </div>
              )}
              <div>
                <span className="text-[#C49A6C] text-[11px] font-bold uppercase tracking-wider mb-1 block">SIÊU DỰ ÁN</span>
                <h3 className="font-['Montserrat'] font-bold text-[#001839] text-[16px] leading-tight">{project.title}</h3>
              </div>
            </div>

            {/* Amount Input area */}
            <div className="mb-6">
              <label className="text-[12px] font-bold text-[#334155] uppercase tracking-wider mb-2 block">SỐ TIỀN ĐẦU TƯ</label>
              <div className="flex items-end justify-between border-b border-[#E2E8F0] pb-2 mb-2">
                <span className="font-['Montserrat'] text-[28px] md:text-[32px] font-bold text-[#001839]">
                  {investmentAmount.toLocaleString('vi-VN')}
                </span>
                <span className="font-['Montserrat'] text-[16px] md:text-[18px] font-bold text-[#334155] mb-1">VNĐ</span>
              </div>
              <p className="text-[#747780] text-[13px]">Tối thiểu: {investmentAmount.toLocaleString('vi-VN')} VNĐ ({project.minAmount})</p>
            </div>

            {/* Funding Source */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 mb-6 relative overflow-hidden shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#b8860b]"></div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[12px] font-bold text-[#334155] uppercase tracking-wider">THÔNG TIN NGUỒN VỐN</span>
                <button className="text-[#b8860b] text-[14px] font-semibold flex items-center gap-1 hover:opacity-80">
                  <span className="text-[18px] leading-none">+</span> Nạp thêm
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f0f4ff] rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-[#b8860b]" />
                </div>
                <div>
                  <p className="text-[#747780] text-[13px]">Số dư ví VinClub</p>
                  <p className="font-['Montserrat'] font-bold text-[#001839] text-[18px]">
                    {formatCurrency(balance).replace(' VNĐ', '')} <span className="text-[14px]">VNĐ</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Profit Info */}
            <div className="grid grid-cols-2 gap-4 mb-8 mt-auto">
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-center shadow-sm">
                <span className="text-[12px] font-bold text-[#334155] uppercase tracking-wider mb-2 block">LỢI NHUẬN DỰ KIẾN</span>
                <span className="font-['Montserrat'] font-bold text-[#00875A] text-[20px] flex items-center gap-1">
                  <TrendingUp className="w-5 h-5" /> {project.interestRate}
                </span>
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-center shadow-sm">
                <span className="text-[12px] font-bold text-[#334155] uppercase tracking-wider mb-2 block">KỲ HẠN</span>
                <span className="font-['Montserrat'] font-bold text-[#001839] text-[20px]">{project.durationDays} ngày</span>
              </div>
            </div>
          </main>

          {/* Action Button */}
          <div className="p-4 bg-white border-t border-[#E2E8F0] mt-auto" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
            <button 
              onClick={handleProceedToSign}
              className="w-full bg-[#001839] hover:bg-[#002c5f] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 font-['Montserrat'] transition-colors"
            >
              <span>TIẾP TỤC ĐỂ KÝ HỢP ĐỒNG</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </>
      ) : (
        <main className="flex-1 flex flex-col bg-white">
          <ContractSign 
            project={project} 
            amount={investmentAmount} 
            onSignComplete={handleSignatureComplete} 
            onBack={() => setStep(1)} 
          />
        </main>
      )}
    </div>
  );
}
