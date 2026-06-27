import React, { useState } from 'react';
import { X, CreditCard, ChevronRight, AlertCircle, CheckCircle2, Wallet, Copy, ShieldCheck, ArrowRight } from 'lucide-react';
import { Project } from '../types';
import { useUser } from './UserContext';
import ContractSign from './ContractSign';
import GoogleDriveSync from './GoogleDriveSync';

export default function InvestmentModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const { balance, setBalance, addTransaction, displayName } = useUser();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [amount, setAmount] = useState<number>(project.minInvestAmount);
  
  // Feedback states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Signed details to be stored in the final transaction
  const [signatureType, setSignatureType] = useState<'draw' | 'type' | 'saved' | null>(null);
  const [signatureContent, setSignatureContent] = useState<string | null>(null);

  const interestRateDisplay = (project.interestRateValue * 100).toFixed(2) + '%';
  const estimatedInterest = Math.round(amount * project.interestRateValue * project.durationDays);
  const totalReturn = amount + estimatedInterest;

  const handleMultiplier = (multiplier: number) => {
    setAmount(project.minInvestAmount * multiplier);
    setErrorMsg(null);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' VNĐ';
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Move from step 1 (Amount) to step 2 (Payment method selection / balance check)
  const handleProceedToPayment = () => {
    if (amount < project.minInvestAmount) {
      setErrorMsg(`Số tiền đầu tư tối thiểu là ${formatCurrency(project.minInvestAmount)}.`);
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  // Move from step 2 (Payment verification) to step 3 (Contract signing)
  const handleProceedToContract = () => {
    if (balance < amount) {
      // Create a pending deposit
      addTransaction({
        type: 'deposit',
        amount: amount,
        status: 'Đang xử lý',
        note: `Chuyển khoản đầu tư dự án ${project.title}`
      });
      setErrorMsg('Hệ thống đã ghi nhận yêu cầu. Vui lòng chờ admin xác nhận nạp tiền trước khi tiếp tục ký hợp đồng.');
      setStep(1); // Go back to step 1 to show error, or stay.
      return;
    }
    setStep(3);
  };

  // Handle final step 3 (Sign completed)
  const handleSignatureComplete = (type: 'draw' | 'type' | 'saved', content: string) => {
    setSignatureType(type);
    setSignatureContent(content);

    // 1. Record the investment transaction with the signature details
    addTransaction({
      type: 'invest',
      amount: amount,
      status: 'Thành công',
      signatureType: type,
      signatureContent: content,
      contractProjectTitle: project.title
    });

    // 2. Deduct the amount from the user's balance
    setBalance((prev) => Math.max(0, prev - amount));

    // 3. Proceed to Step 4 (Success / Celebrations Screen)
    setStep(4);
  };

  return (
    <div id="investment-modal-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-none md:rounded-2xl overflow-hidden shadow-2xl flex flex-col relative h-full md:h-auto md:max-h-[92vh] overflow-y-auto scrollbar-hide animate-in zoom-in-95 duration-200">
        
        {/* Header Banner - Fixed height */}
        <div className="h-36 w-full relative shrink-0">
          <img src={project.imageUrl || undefined} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors cursor-pointer z-10"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="px-2 py-0.5 bg-[#8c7b50] rounded text-[9px] font-extrabold tracking-wider mb-1 inline-block uppercase">
              {project.category}
            </span>
            <h2 className="font-bold text-[15px] leading-snug line-clamp-2">{project.title}</h2>
          </div>
        </div>

        {/* Modal Main Form Area */}
        <div className="p-5 flex-1 flex flex-col bg-white">
          
          {/* Progress Indicator Steps - Only show for Steps 1, 2, 3 */}
          {step < 4 && (
            <div className="flex items-center justify-between mb-5 px-1 select-none">
              <div className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  step >= 1 ? 'bg-[#8c7b50] text-white' : 'bg-zinc-200 text-zinc-600'
                }`}>1</div>
                <span className={`text-[12px] font-bold ${step >= 1 ? 'text-[#8c7b50]' : 'text-zinc-400'}`}>Hạn Mức</span>
              </div>
              <div className="flex-1 h-[1.5px] bg-zinc-200 mx-2"></div>
              
              <div className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  step >= 2 ? 'bg-[#8c7b50] text-white' : 'bg-zinc-200 text-zinc-600'
                }`}>2</div>
                <span className={`text-[12px] font-bold ${step >= 2 ? 'text-[#8c7b50]' : 'text-zinc-400'}`}>Thanh Toán</span>
              </div>
              <div className="flex-1 h-[1.5px] bg-zinc-200 mx-2"></div>
              
              <div className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  step >= 3 ? 'bg-[#8c7b50] text-white' : 'bg-zinc-200 text-zinc-600'
                }`}>3</div>
                <span className={`text-[12px] font-bold ${step >= 3 ? 'text-[#8c7b50]' : 'text-zinc-400'}`}>Ký Kết</span>
              </div>
            </div>
          )}

          {/* STEP 1: AMOUNT SELECTION */}
          {step === 1 && (
            <div className="flex flex-col flex-1 animate-in fade-in duration-150">
              {/* Interest Info Row */}
              <div className="flex justify-between items-center mb-4 p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs">
                <div>
                  <span className="text-zinc-500 font-medium">Lãi suất hàng ngày:</span>
                  <span className="text-[#d32f2f] font-extrabold ml-1">{interestRateDisplay}</span>
                </div>
                <div className="w-[1px] h-4 bg-zinc-200 mx-1"></div>
                <div>
                  <span className="text-zinc-500 font-medium">Kỳ hạn:</span>
                  <span className="font-extrabold text-zinc-800 ml-1">{project.durationDays} ngày</span>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Amount Input */}
              <div className="mb-2 flex justify-between items-end">
                <span className="text-zinc-800 font-bold text-xs uppercase tracking-wide">Số tiền góp vốn đầu tư</span>
                <span className="text-zinc-400 text-[10px] font-medium">Tối thiểu: {formatCurrency(project.minInvestAmount)}</span>
              </div>

              <div className="relative mb-3">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  value={new Intl.NumberFormat('vi-VN').format(amount)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setAmount(Number(val));
                    setErrorMsg(null);
                  }}
                  className="w-full border border-zinc-200 rounded-xl py-3.5 pl-11 pr-16 text-zinc-950 font-bold text-base outline-none focus:border-[#8c7b50] focus:ring-1 focus:ring-[#8c7b50] transition-shadow"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs select-none">
                  VNĐ
                </div>
              </div>

              {/* Quick Multiplier Buttons */}
              <div className="flex gap-2 mb-5">
                <button 
                  type="button" 
                  onClick={() => handleMultiplier(1)} 
                  className="flex-1 py-2 border border-zinc-200 rounded-xl text-zinc-700 text-[11px] font-bold hover:border-[#8c7b50] hover:text-[#8c7b50] transition-colors bg-white cursor-pointer"
                >
                  Tối thiểu (1x)
                </button>
                <button 
                  type="button" 
                  onClick={() => handleMultiplier(2)} 
                  className="flex-1 py-2 border border-zinc-200 rounded-xl text-zinc-700 text-[11px] font-bold hover:border-[#8c7b50] hover:text-[#8c7b50] transition-colors bg-white cursor-pointer"
                >
                  Gấp đôi (2x)
                </button>
                <button 
                  type="button" 
                  onClick={() => handleMultiplier(5)} 
                  className="flex-1 py-2 border border-zinc-200 rounded-xl text-zinc-700 text-[11px] font-bold hover:border-[#8c7b50] hover:text-[#8c7b50] transition-colors bg-white cursor-pointer"
                >
                  Gấp 5 (5x)
                </button>
              </div>

              {/* Estimated Yield Calculations */}
              <div className="bg-zinc-50/50 border border-zinc-100 rounded-xl p-4 mb-6 space-y-2.5">
                <div className="text-zinc-400 font-bold text-[9px] uppercase tracking-wider">Lợi Nhuận Góp Vốn Hợp Đồng</div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium">Lãi suất hàng ngày:</span>
                  <span className="text-zinc-800 font-bold">{interestRateDisplay} / ngày</span>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium">Lãi dự tính nhận ({project.durationDays} ngày):</span>
                  <span className="text-[#d32f2f] font-extrabold">{formatCurrency(estimatedInterest)}</span>
                </div>
                
                <div className="h-[1px] bg-zinc-200/60 my-1"></div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-600 font-bold">Tổng thanh toán sau tất toán:</span>
                  <span className="text-zinc-950 font-extrabold text-sm">{formatCurrency(totalReturn)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto flex gap-3 pb-2 pt-4">
                <button 
                  type="button"
                  onClick={onClose} 
                  className="flex-1 py-3.5 border border-zinc-300 bg-white rounded-xl text-zinc-700 text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  Hủy Giao Dịch
                </button>
                <button 
                  type="button"
                  onClick={handleProceedToPayment}
                  className="flex-1 py-3.5 bg-[#8c7b50] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-[#7a6b45] transition-colors cursor-pointer"
                >
                  Tiếp tục thanh toán
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT VERIFICATION */}
          {step === 2 && (
            <div className="flex flex-col flex-1 animate-in fade-in duration-150">
              
              {/* Account Balance visual block */}
              <div className="bg-zinc-900 text-white rounded-xl p-4 mb-4 flex items-center justify-between select-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#8c7b50]/20 flex items-center justify-center text-[#dfa135]">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 font-medium">Số dư khả dụng hiện tại</p>
                    <p className="text-sm font-bold">{formatCurrency(balance)}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-zinc-400 font-medium">Khoản đầu tư yêu cầu</p>
                  <p className="text-sm font-bold text-[#dfa135]">{formatCurrency(amount)}</p>
                </div>
              </div>

              {/* Conditional Payment Display logic */}
              {balance >= amount ? (
                /* Method A: Direct deduction from VinClub Wallet balance */
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                    <h3 className="font-bold text-green-800 text-xs uppercase">SỐ DƯ KHẢ DỤNG ĐỦ ĐỂ THANH TOÁN</h3>
                    <p className="text-zinc-600 text-[11px] leading-relaxed">
                      Tài khoản của bạn có đủ số dư thành viên. Tiền đầu tư sẽ được trích trực tiếp từ ví VinClub sau khi hợp đồng được ký xác thực.
                    </p>
                    <div className="pt-2 flex flex-col gap-1 text-[11px] text-zinc-500 max-w-xs mx-auto border-t border-green-100/55">
                      <div className="flex justify-between">
                        <span>Số dư mới sau góp vốn:</span>
                        <span className="font-bold text-zinc-800">{formatCurrency(balance - amount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-3 pb-2 pt-6">
                    <button 
                      type="button"
                      onClick={() => setStep(1)} 
                      className="flex-1 py-3.5 border border-zinc-300 bg-white rounded-xl text-zinc-700 text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      Trở Lại
                    </button>
                    <button 
                      type="button"
                      onClick={handleProceedToContract}
                      className="flex-1 py-3.5 bg-[#8c7b50] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-[#7a6b45] transition-colors cursor-pointer"
                    >
                      Ký số Hợp đồng
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Method B: Direct QR Code Instant transfer billing for insufficient balance */
                <div className="space-y-4 flex-1 flex flex-col">
                  
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2.5 items-start text-amber-800 text-[11px] leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Số dư tài khoản của bạn không đủ!</span> Quý khách vui lòng chuyển khoản thanh toán trực tiếp số tiền đầu tư dưới đây thông qua QR ngân hàng hoặc chuyển khoản tay 24/7.
                    </div>
                  </div>

                  {/* High fidelity VietQR QR Code Card */}
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col items-center">
                    {/* Compact VietQR format (Free instant generator) */}
                    <div className="w-36 h-36 bg-white p-2.5 rounded-lg border border-zinc-100 shadow-sm flex items-center justify-center relative overflow-hidden mb-3">
                      <img 
                        src={`https://img.vietqr.io/image/mbbank-19034567890123-compact2.png?amount=${amount}&addInfo=${encodeURIComponent((displayName || 'USER') + ' DAU TU')}`} 
                        alt="Mã QR Chuyển Khoản Đầu Tư" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/150x150/png?text=QR+CODE";
                        }}
                      />
                    </div>

                    <p className="text-[10px] text-zinc-400 font-medium select-none mb-3">Quét mã QR bằng ứng dụng ngân hàng của bạn để thanh toán tự động</p>

                    {/* Detailed transaction account coordinates */}
                    <div className="w-full text-zinc-800 text-[11px] space-y-1.5 border-t border-zinc-200/70 pt-3">
                      
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 font-medium">Tên ngân hàng:</span>
                        <span className="font-bold text-zinc-900">MB BANK (Quân Đội)</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 font-medium">Số tài khoản:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-zinc-900">19034567890123</span>
                          <button 
                            type="button"
                            onClick={() => handleCopy('19034567890123', 'stk')}
                            className="p-1 hover:bg-zinc-200 rounded text-zinc-500 cursor-pointer"
                            title="Sao chép"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 font-medium">Chủ tài khoản:</span>
                        <span className="font-extrabold text-zinc-900 uppercase">CONG TY CO PHAN VINCLUB</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 font-medium">Số tiền chuyển:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-[#d32f2f]">{formatCurrency(amount)}</span>
                          <button 
                            type="button"
                            onClick={() => handleCopy(String(amount), 'amount')}
                            className="p-1 hover:bg-zinc-200 rounded text-zinc-500 cursor-pointer"
                            title="Sao chép"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 font-medium">Nội dung chuyển khoản:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-extrabold text-blue-600 uppercase">{(displayName || 'USER').toUpperCase()} DAU TU</span>
                          <button 
                            type="button"
                            onClick={() => handleCopy(`${(displayName || 'USER').toUpperCase()} DAU TU`, 'memo')}
                            className="p-1 hover:bg-zinc-200 rounded text-zinc-500 cursor-pointer"
                            title="Sao chép"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>

                    {copiedText && (
                      <div className="mt-2 text-[10px] text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded">
                        Đã sao chép thành công!
                      </div>
                    )}
                  </div>

                  {/* Immediate confirmation buttons */}
                  <div className="mt-auto flex gap-3 pb-2 pt-4">
                    <button 
                      type="button"
                      onClick={() => setStep(1)} 
                      className="flex-1 py-3.5 border border-zinc-300 bg-white rounded-xl text-zinc-700 text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      Trở Lại
                    </button>
                    <button 
                      type="button"
                      onClick={handleProceedToContract}
                      className="flex-1 py-3.5 bg-[#8c7b50] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-[#7a6b45] transition-colors cursor-pointer"
                    >
                      Xác Nhận Đã Chuyển Khoản
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* STEP 3: CONTRACT SIGNING PORTAL */}
          {step === 3 && (
            <div className="flex flex-col flex-1 animate-in fade-in duration-150">
              <ContractSign 
                project={project} 
                amount={amount} 
                onSignComplete={handleSignatureComplete} 
                onBack={() => setStep(2)} 
              />
            </div>
          )}

          {/* STEP 4: SUCCESS / CELEBRATION COMPLETED SCREEN */}
          {step === 4 && (
            <div className="flex flex-col flex-1 items-center justify-center text-center py-6 animate-in fade-in zoom-in-95 duration-300">
              
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4 border border-green-200">
                <ShieldCheck className="w-9 h-9" />
              </div>

              <h2 className="text-zinc-900 font-extrabold text-base mb-1 uppercase tracking-wider">HỢP ĐỒNG ĐẦU TƯ ĐÃ HOÀN THÀNH</h2>
              <p className="text-zinc-500 text-xs max-w-xs mx-auto mb-5 leading-relaxed">
                Khoản đầu tư của quý khách vào dự án đã được xử lý và lưu trữ thành công trên khối dữ liệu bảo mật của VinClub.
              </p>

              {/* Receipt Visual Container */}
              <div className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-left text-xs mb-6 space-y-2 relative">
                
                {/* Decorative cut paper edges */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-200/50 via-zinc-100 to-zinc-200/50"></div>
                
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-2 border-b border-zinc-200 pb-1.5 select-none">Hợp đồng điện tử VinClub</p>
                
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-medium">Tên dự án:</span>
                  <span className="font-bold text-zinc-900 max-w-[180px] text-right truncate">{project.title}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500 font-medium">Mức đầu tư tài trợ:</span>
                  <span className="font-extrabold text-zinc-900 text-sm">{formatCurrency(amount)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500 font-medium">Thời hạn cam kết:</span>
                  <span className="font-bold text-zinc-900">{project.durationDays} ngày</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500 font-medium">Lãi suất kỳ hạn:</span>
                  <span className="font-bold text-[#d32f2f]">{interestRateDisplay} / ngày</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500 font-medium">Tổng thu nhập dự tính:</span>
                  <span className="font-extrabold text-green-600">{formatCurrency(totalReturn)}</span>
                </div>

                <div className="h-[1px] bg-zinc-200/60 my-2"></div>

                {/* Captured signature display */}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-medium">Chữ ký Bên B:</span>
                  <div className="h-10 w-24 bg-white border border-zinc-200 rounded flex items-center justify-center overflow-hidden p-1">
                    {signatureType === 'draw' && signatureContent ? (
                      <img src={signatureContent} alt="Chữ ký vẽ tay" className="max-h-full max-w-full object-contain" />
                    ) : signatureType === 'type' && signatureContent ? (
                      <span 
                        className="text-xs font-semibold text-zinc-800 italic" 
                        style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive" }}
                      >
                        {signatureContent}
                      </span>
                    ) : (
                      <span className="text-[9px] text-zinc-400 font-bold uppercase">ĐÃ KÝ</span>
                    )}
                  </div>
                </div>

              </div>

              <div className="w-full mb-6">
                <GoogleDriveSync 
                  contractContent={`HỢP ĐỒNG ĐẦU TƯ VINCLUB\n\nDự án: ${project.title}\nMức đầu tư: ${formatCurrency(amount)}\nThời hạn: ${project.durationDays} ngày\nLãi suất: ${interestRateDisplay} / ngày\nTổng thu nhập: ${formatCurrency(totalReturn)}\n\n(Đã ký điện tử)`}
                  fileName={`HopDong_${project.id}_${new Date().getTime()}.txt`}
                />
              </div>

              {/* Action Completion button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-4 bg-[#8c7b50] hover:bg-[#7a6b45] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                Hoàn tất & Về Trang Chủ
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
