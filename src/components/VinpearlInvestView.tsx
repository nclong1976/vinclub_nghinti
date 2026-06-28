import React, { useState, useContext } from 'react';
import { ArrowLeft, Wallet, TrendingUp, CheckCircle, AlertCircle, ArrowRight, ShieldCheck, Building2 } from 'lucide-react';
import { UserContext } from './UserContext';
import ContractSign from './ContractSign';
import { Project } from '../types';

interface VinpearlInvestViewProps {
  projectId?: string;
  onBack: () => void;
  onNavigateToDeposit: () => void;
}

export default function VinpearlInvestView({ projectId, onBack, onNavigateToDeposit }: VinpearlInvestViewProps) {
  const { balance, addTransaction, setBalance, adminProjects } = useContext(UserContext);
  const [showToast, setShowToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [signatureType, setSignatureType] = useState<'draw' | 'type' | 'saved' | null>(null);
  const [signatureContent, setSignatureContent] = useState<string | null>(null);

  // Look up the selected project, or default to the first project in adminProjects
  const project = adminProjects.find(p => p.id === projectId) || adminProjects[0];

  const investmentAmount = project?.minInvestAmount || 1200000000;

  const formatCurrency = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  };

  const canInvest = balance >= investmentAmount;

  const handleProceedToSign = () => {
    if (project?.status === 'CLOSED') {
      setShowToast({ message: 'Dự án đã đóng cổng tiếp nhận vốn.', type: 'error' });
      setTimeout(() => setShowToast(null), 3000);
      return;
    }
    if (!canInvest) {
      setShowToast({ message: 'Số dư không đủ. Đang chuyển hướng nạp tiền...', type: 'error' });
      setTimeout(() => {
        setShowToast(null);
        onNavigateToDeposit();
      }, 1500);
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
    
    return (
      <div className="flex-1 bg-[#080808] flex flex-col items-center justify-center p-6 h-full text-zinc-100 font-['Plus_Jakarta_Sans'] animate-in fade-in zoom-in-95 duration-300 overflow-y-auto w-full pb-20">
        <div className="w-16 h-16 bg-green-950/30 rounded-full flex items-center justify-center text-green-400 mb-4 border border-green-900/60 mt-8">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <h2 className="text-[#c29b57] font-extrabold text-[15px] mb-1.5 uppercase tracking-wider font-['Montserrat']">
          HỢP ĐỒNG ĐẦU TƯ ĐÃ HOÀN THÀNH
        </h2>
        <p className="text-zinc-400 text-[12px] max-w-[300px] text-center mb-6 leading-relaxed">
          Khoản đầu tư của quý khách vào dự án đã được xử lý và lưu trữ thành công trên hệ thống.
        </p>

        {/* Receipt Visual Container */}
        <div className="w-full bg-[#121212] border border-zinc-800/80 rounded-2xl p-5 text-left text-[12px] mb-6 space-y-3 relative shadow-md max-w-[400px]">
          <p className="text-[10px] text-[#c29b57] font-bold uppercase tracking-widest mb-2 border-b border-zinc-800/60 pb-2">
            Hợp đồng điện tử VinClub
          </p>
          
          <div className="flex justify-between">
            <span className="text-zinc-400">Tên dự án:</span>
            <span className="font-bold text-white max-w-[180px] text-right truncate">{project.title}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Mức đầu tư tài trợ:</span>
            <span className="font-extrabold text-white text-[14px]">{formatCurrency(investmentAmount)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Thời hạn cam kết:</span>
            <span className="font-bold text-white">{project.durationDays} ngày</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Tổng thu nhập dự tính:</span>
            <span className="font-extrabold text-[#00df89]">{formatCurrency(investmentAmount + Math.round(investmentAmount * project.interestRateValue * project.durationDays))}</span>
          </div>

          <div className="h-[1px] bg-zinc-800/60 my-2"></div>

          {/* Captured signature display */}
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Chữ ký điện tử:</span>
            <div className="h-10 w-24 bg-white border border-zinc-300 rounded flex items-center justify-center overflow-hidden p-1 shadow-inner">
              {signatureType === 'draw' && signatureContent ? (
                <img src={signatureContent} alt="Chữ ký vẽ tay" className="max-h-full max-w-full object-contain" />
              ) : signatureType === 'type' && signatureContent ? (
                <span 
                  className="text-[12px] font-semibold text-zinc-900 italic" 
                  style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive" }}
                >
                  {signatureContent}
                </span>
              ) : (
                <span className="text-[9px] text-zinc-500 font-bold uppercase">ĐÃ KÝ</span>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={onBack}
          className="w-full max-w-[400px] bg-gradient-to-r from-[#c29b57] to-[#ebd5ad] text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 font-['Montserrat'] active:scale-95 transition-all shadow-[0_4px_15px_rgba(194,155,87,0.15)]"
        >
          <span>VỀ TRANG CHI TIẾT</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#080808] flex flex-col h-full text-zinc-100 font-['Plus_Jakarta_Sans'] w-full">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-20 left-4 right-4 z-50 p-4 rounded-xl flex items-start gap-3 shadow-lg animate-in slide-in-from-top-4 ${
          showToast.type === 'success' ? 'bg-green-950/80 text-green-200 border border-green-900' : 'bg-red-950/80 text-red-200 border border-red-900'
        }`}>
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-[13px] font-medium leading-relaxed">{showToast.message}</p>
        </div>
      )}

      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-40 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-zinc-800/60 flex items-center justify-between px-4 h-16 shadow-md text-white shrink-0">
        <button 
          onClick={() => step === 2 ? setStep(1) : onBack()} 
          className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all p-2 rounded-full active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-[18px] font-['Montserrat'] tracking-wide">
          {step === 2 ? 'Ký hợp đồng' : 'Đầu tư ngay'}
        </h1>
        <div className="w-10"></div>
      </header>

      {step === 1 ? (
        <>
          <main className="px-4 py-6 max-w-[600px] mx-auto w-full flex-1 flex flex-col pb-28">
            {/* Project Mini Card */}
            <div className="bg-[#121212] rounded-2xl p-4 border border-zinc-800/80 flex items-center gap-4 mb-6 shadow-md">
              {project.imageUrl ? (
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-[60px] h-[60px] rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-[60px] h-[60px] rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-700">
                  <Building2 className="w-6 h-6" />
                </div>
              )}
              <div>
                <span className="text-[#c29b57] text-[10px] font-extrabold uppercase tracking-wider mb-1 block">SIÊU DỰ ÁN</span>
                <h3 className="font-['Montserrat'] font-bold text-white text-[15px] leading-tight">{project.title}</h3>
              </div>
            </div>

            {/* Amount display area */}
            <div className="mb-6 bg-[#121212]/30 border border-zinc-850 p-5 rounded-2xl">
              <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest mb-2 block">
                SỐ TIỀN ĐẦU TƯ
              </label>
              
              <div className="flex items-end justify-between border-b border-zinc-800/60 pb-3 mb-2">
                <span className="font-['Montserrat'] text-[26px] font-black text-[#c29b57] tracking-wide">
                  {investmentAmount.toLocaleString('vi-VN')}
                </span>
                <span className="font-['Montserrat'] text-[15px] font-bold text-zinc-400 mb-1">VNĐ</span>
              </div>
              <p className="text-zinc-500 text-[12px]">Số tiền cố định theo cài đặt hệ thống ({project?.minAmount || formatCurrency(investmentAmount)})</p>
            </div>

            {/* Funding Source */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-5 mb-6 relative overflow-hidden shadow-md">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c29b57]"></div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">THÔNG TIN NGUỒN VỐN</span>
                <button 
                  onClick={onNavigateToDeposit}
                  className="text-[#c29b57] text-[13px] font-bold flex items-center gap-1 hover:opacity-80"
                >
                  <span className="text-[16px] leading-none">+</span> Nạp thêm
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800/60">
                  <Wallet className="w-5 h-5 text-[#c29b57]" />
                </div>
                <div>
                  <p className="text-zinc-500 text-[11px]">Số dư ví VinClub</p>
                  <p className="font-['Montserrat'] font-black text-white text-[18px]">
                    {formatCurrency(balance).replace(' VNĐ', '')} <span className="text-[12px] font-bold text-zinc-400">VNĐ</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Profit Info */}
            <div className="grid grid-cols-2 gap-4 mb-8 mt-auto">
              <div className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-center shadow-md">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">LỢI NHUẬN DỰ KIẾN</span>
                <span className="font-['Montserrat'] font-black text-[#00df89] text-[18px] flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> {project.interestRate}
                </span>
              </div>
              <div className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-center shadow-md">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">KỲ HẠN</span>
                <span className="font-['Montserrat'] font-black text-white text-[18px]">{project.durationDays} ngày</span>
              </div>
            </div>
          </main>

          {/* Action Button */}
          <div 
            className="fixed bottom-0 left-0 right-0 p-4 bg-[#0f0f0f]/95 backdrop-blur-md border-t border-zinc-800/60 mt-auto max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-40 shrink-0" 
            style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
          >
            <button 
              onClick={handleProceedToSign}
              className="w-full bg-gradient-to-r from-[#c29b57] to-[#ebd5ad] text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 font-['Montserrat'] active:scale-95 transition-all shadow-[0_4px_15px_rgba(194,155,87,0.15)]"
            >
              <span>TIẾP TỤC ĐỂ KÝ HỢP ĐỒNG</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </>
      ) : (
        <main className="flex-1 flex flex-col bg-[#080808]">
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
