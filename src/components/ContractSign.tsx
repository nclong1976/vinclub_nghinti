import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { Project } from '../types';
import SignaturePad from './SignaturePad';
import { PenTool, Keyboard, BookmarkCheck, FileText, Loader2, ScanLine, ShieldCheck } from 'lucide-react';
import contractStampImage2 from '../assets/images/regenerated_image_1782467280444.png';

interface ContractSignProps {
  project: Project;
  amount: number;
  onSignComplete: (signatureType: 'draw' | 'type' | 'saved', signatureContent: string) => void;
  onBack: () => void;
}

export default function ContractSign({ project, amount, onSignComplete, onBack }: ContractSignProps) {
  const { displayName, userId } = useUser();
  const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'saved'>('draw');
  
  // Signature source states
  const [drawnSignature, setDrawnSignature] = useState<string | null>(null);
  const [typedName, setTypedName] = useState(displayName || '');
  const [savedSignatures, setSavedSignatures] = useState<{ id: string; type: string; content: string; date: string }[]>([]);
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);

  // General error or validation
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [sealStatus, setSealStatus] = useState<'idle' | 'extracting' | 'verifying' | 'applied'>('idle');

  // Automated digital seal extraction process
  useEffect(() => {
    setSealStatus('extracting');
    const timer1 = setTimeout(() => {
      setSealStatus('verifying');
      const timer2 = setTimeout(() => {
        setSealStatus('applied');
      }, 1500);
      return () => clearTimeout(timer2);
    }, 1500);
    return () => clearTimeout(timer1);
  }, []);
  
  const interestRateDisplay = (project.interestRateValue * 100).toFixed(2) + '%';
  const estimatedInterest = Math.round(amount * project.interestRateValue * project.durationDays);
  const totalReturn = amount + estimatedInterest;
  const contractId = `HDDT-${project.id.toUpperCase()}-${Math.floor(Math.random() * 900000 + 100000)}`;
  const currentDateString = new Date().toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  // Load saved signatures from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('user-electronic-signatures');
      if (saved) {
        setSavedSignatures(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load saved signatures", e);
    }
  }, []);

  // Format currencies
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' VNĐ';
  };

  const handleSignAction = () => {
    setErrorMsg(null);
    let finalType: 'draw' | 'type' | 'saved' = activeTab;
    let finalContent = '';

    if (activeTab === 'draw') {
      if (!drawnSignature) {
        setErrorMsg('Vui lòng vẽ chữ ký của bạn trước khi xác nhận.');
        return;
      }
      finalContent = drawnSignature;

      // Automatically save to saved list for next time
      const isAlreadySaved = savedSignatures.some(s => s.content === drawnSignature);
      if (!isAlreadySaved) {
        const newSaved = {
          id: 'SIG-' + Math.floor(Math.random() * 100000),
          type: 'draw',
          content: drawnSignature,
          date: currentDateString
        };
        const updated = [newSaved, ...savedSignatures].slice(0, 5); // keep max 5
        setSavedSignatures(updated);
        localStorage.setItem('user-electronic-signatures', JSON.stringify(updated));
      }
    } else if (activeTab === 'type') {
      if (!typedName.trim()) {
        setErrorMsg('Vui lòng nhập họ và tên của bạn để tạo chữ ký.');
        return;
      }
      finalContent = typedName.trim();

      // Save to saved list
      const isAlreadySaved = savedSignatures.some(s => s.content === typedName.trim());
      if (!isAlreadySaved) {
        const newSaved = {
          id: 'SIG-' + Math.floor(Math.random() * 100000),
          type: 'type',
          content: typedName.trim(),
          date: currentDateString
        };
        const updated = [newSaved, ...savedSignatures].slice(0, 5);
        setSavedSignatures(updated);
        localStorage.setItem('user-electronic-signatures', JSON.stringify(updated));
      }
    } else if (activeTab === 'saved') {
      if (!selectedSavedId) {
        setErrorMsg('Vui lòng chọn một chữ ký đã lưu.');
        return;
      }
      const sel = savedSignatures.find(s => s.id === selectedSavedId);
      if (!sel) return;
      finalType = sel.type as 'draw' | 'type' | 'saved';
      finalContent = sel.content;
    }

    onSignComplete(finalType, finalContent);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#080808] flex flex-col w-full text-zinc-100 font-['Plus_Jakarta_Sans'] pb-20">
      
      {/* Scrollable contract document container */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 max-h-[50vh] scrollbar-hide border border-zinc-800/80 bg-zinc-900/40 rounded-xl mb-4 shadow-inner">
        
        {/* Document Frame styling */}
        <div className="bg-white p-5 md:p-6 border border-zinc-200 shadow-sm rounded-lg text-zinc-800 text-[11px] leading-relaxed space-y-4 font-serif relative">
          
          {/* Background Decorative Gold Crest */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-3 pointer-events-none select-none">
            <svg viewBox="0 0 100 100" className="w-56 h-56 text-[#dfa135]" fill="currentColor">
              <path d="M50 15 L80 45 L50 75 L20 45 Z" />
            </svg>
          </div>

          {/* National Emblem text */}
          <div className="text-center font-sans space-y-1 select-none">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-zinc-900">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
            <p className="font-semibold text-[10px] text-zinc-700">Độc lập - Tự do - Hạnh phúc</p>
            <div className="w-24 h-[1px] bg-zinc-400 mx-auto mt-1"></div>
          </div>

          {/* Contract Title */}
          <div className="text-center pt-3 space-y-1">
            <h3 className="font-bold text-[14px] text-zinc-900 tracking-wide font-sans uppercase">HỢP ĐỒNG HỢP TÁC ĐẦU TƯ TÀI CHÍNH</h3>
            <p className="text-[10px] text-zinc-500 font-sans italic">Mã số hợp đồng: {contractId}</p>
          </div>

          <div className="space-y-2">
            <p>Hôm nay, ngày {currentDateString}, tại Hệ thống điện tử VinClub, chúng tôi gồm các bên:</p>
            
            {/* Party A */}
            <div className="space-y-0.5">
              <p className="font-bold text-zinc-900 font-sans">
                BÊN A:{' '}
                {project.category.toUpperCase().includes('VINFAST') 
                  ? 'CÔNG TY TNHH KINH DOANH THƯƠNG MẠI VÀ DỊCH VỤ VINFAST' 
                  : project.category.toUpperCase().includes('BẤT ĐỘNG SẢN') || project.category.toUpperCase().includes('VINHOMES')
                  ? 'CÔNG TY CỔ PHẦN VINHOMES'
                  : 'HỆ THỐNG QUẢN LÝ QUỸ ĐẦU TƯ VINCLUB (VINPEARL COOPERATION)'}
              </p>
              <p>• Trụ sở: Tòa nhà văn phòng Symphony, Đường Chu Huy Mân, Khu đô thị Vinhomes Riverside, Long Biên, Hà Nội.</p>
              <p>• Đại diện: Ban Điều Hành Quỹ Đầu Tư VinClub.</p>
            </div>

            {/* Party B */}
            <div className="space-y-0.5">
              <p className="font-bold text-zinc-900 font-sans">BÊN B: KHÁCH HÀNG / THÀNH VIÊN ĐẦU TƯ</p>
              <p>• Họ và tên: <span className="font-bold text-zinc-900 uppercase">{displayName || 'Thành viên VinClub'}</span></p>
              <p>• Tài khoản giao dịch: <span className="font-mono text-zinc-600">{userId || 'Hội viên'}</span></p>
            </div>
          </div>

          {/* Contract Core values */}
          <div className="border border-zinc-200 rounded-lg overflow-hidden font-sans my-4">
            <div className="bg-zinc-50 px-3 py-2 border-b border-zinc-200 text-zinc-800 font-bold text-[11px]">
              NỘI DUNG ĐẦU TƯ CHI TIẾT
            </div>
            <table className="w-full text-left text-[11px] border-collapse">
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="px-3 py-2 text-zinc-500 font-medium">Tên dự án đầu tư:</td>
                  <td className="px-3 py-2 font-bold text-zinc-900">{project.title}</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-3 py-2 text-zinc-500 font-medium">Số vốn đăng ký góp:</td>
                  <td className="px-3 py-2 font-bold text-zinc-900 text-sm">{formatCurrency(amount)}</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-3 py-2 text-zinc-500 font-medium">Lãi suất cam kết hàng ngày:</td>
                  <td className="px-3 py-2 font-bold text-[#d32f2f]">{interestRateDisplay}</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-3 py-2 text-zinc-500 font-medium">Thời hạn hợp tác:</td>
                  <td className="px-3 py-2 font-bold text-zinc-900">{project.durationDays} ngày</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-3 py-2 text-zinc-500 font-medium">Lợi nhuận dự kiến nhận:</td>
                  <td className="px-3 py-2 font-bold text-[#d32f2f]">{formatCurrency(estimatedInterest)}</td>
                </tr>
                <tr className="bg-zinc-50/50">
                  <td className="px-3 py-2 text-zinc-600 font-bold">Tổng thanh toán tất toán:</td>
                  <td className="px-3 py-2 font-bold text-zinc-900 text-sm">{formatCurrency(totalReturn)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Core Terms and clauses */}
          <div className="space-y-3 pt-1 text-[10px] text-zinc-600">
            <p className="font-bold text-zinc-800 font-sans">ĐIỀU 1: QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN</p>
            <p>1.1 Bên B tự nguyện tham gia đầu tư tài chính vào dự án thuộc hệ thống quản lý của Bên A với số tiền được ghi nhận chính xác tại bảng chi tiết ở trên.</p>
            <p>1.2 Bên A có trách nhiệm quản lý, phân bổ nguồn vốn góp của Bên B vào dự án tối ưu nhất, đồng thời cam kết bảo mật thông tin giao dịch tuyệt đối.</p>
            
            <p className="font-bold text-zinc-800 font-sans">ĐIỀU 2: PHÂN CHIA LỢI NHUẬN & HOÀN VỐN</p>
            <p>2.1 Bên B sẽ nhận được lợi nhuận phát sinh hàng ngày tương đương với tỷ lệ {interestRateDisplay}. Toàn bộ số gốc và lợi nhuận tích lũy sẽ được tự động hoàn trả vào tài khoản ví điện tử của Bên B ngay sau khi hoàn thành kỳ hạn {project.durationDays} ngày.</p>
            <p>2.2 Hệ thống cam kết bảo toàn vốn 100% cho các khoản đầu tư đã được ký số hợp lệ.</p>

            <p className="font-bold text-zinc-800 font-sans">ĐIỀU 3: CHỮ KÝ ĐIỆN TỬ VÀ HIỆU LỰC HỢP ĐỒNG</p>
            <p>3.1 Hợp đồng này được ký kết trực tuyến thông qua chữ ký số/chữ ký điện tử của hai bên. Chữ ký điện tử của Bên B có giá trị pháp lý tương đương với chữ ký tay và con dấu thực tế.</p>
            <p>3.2 Hợp đồng có hiệu lực ngay sau khi Bên B hoàn thành việc ký điện tử và hệ thống xác nhận thanh toán vốn đầu tư thành công.</p>
          </div>

          {/* Signatures visual representations */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-200 font-sans">
            
            {/* Party A Representative */}
            <div className="text-center space-y-1.5 relative flex flex-col items-center">
              <p className="font-bold text-[11px] text-zinc-700">ĐẠI DIỆN BÊN A (VINCLUB)</p>
              <div className="h-24 flex items-center justify-center relative">
                {sealStatus === 'idle' || sealStatus === 'extracting' ? (
                  <div className="flex flex-col items-center justify-center text-zinc-400 gap-2 h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-[#c29b57]" />
                    <span className="text-[9px] animate-pulse uppercase tracking-wider">Đang trích xuất con dấu...</span>
                  </div>
                ) : sealStatus === 'verifying' ? (
                  <div className="flex flex-col items-center justify-center text-[#c29b57] gap-2 h-full">
                    <ScanLine className="w-6 h-6 animate-pulse" />
                    <span className="text-[9px] animate-pulse uppercase tracking-wider">Xác minh chữ ký số...</span>
                  </div>
                ) : (
                  <div className="relative h-full flex items-center justify-center">
                    <img src={contractStampImage2} alt="Chữ ký và con dấu" className="h-full object-contain mix-blend-multiply animate-in fade-in zoom-in duration-500" />
                    <div className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-0.5 shadow-sm" title="Đã xác thực">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
              <p className="text-[9px] font-bold text-zinc-800 text-center uppercase">NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT - PHÓ TỔNG GIÁM ĐỐC</p>
            </div>

            {/* Party B Customer signature */}
            <div className="text-center space-y-1.5 flex flex-col items-center justify-between border-l border-zinc-100 pl-4">
              <p className="font-bold text-[11px] text-zinc-700">ĐẠI DIỆN BÊN B (KÝ TÊN)</p>
              
              <div className="h-20 w-full flex items-center justify-center bg-zinc-50/30 rounded border border-dashed border-zinc-200 overflow-hidden">
                {activeTab === 'draw' && drawnSignature ? (
                  <img src={drawnSignature} alt="Chữ ký vẽ" className="max-h-16 max-w-full object-contain" />
                ) : activeTab === 'type' && typedName.trim() ? (
                  <span 
                    className="text-2xl font-medium text-slate-800 italic" 
                    style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive, sans-serif" }}
                  >
                    {typedName}
                  </span>
                ) : activeTab === 'saved' && selectedSavedId && savedSignatures.find(s => s.id === selectedSavedId) ? (
                  (() => {
                    const sel = savedSignatures.find(s => s.id === selectedSavedId);
                    if (sel?.type === 'draw') {
                      return <img src={sel.content} alt="Chữ ký lưu" className="max-h-16 max-w-full object-contain" />;
                    } else if (sel?.type === 'type') {
                      return (
                        <span 
                          className="text-2xl font-medium text-slate-800 italic" 
                          style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive, sans-serif" }}
                        >
                          {sel.content}
                        </span>
                      );
                    }
                    return null;
                  })()
                ) : (
                  <span className="text-[10px] text-zinc-350 italic">Chưa ký điện tử</span>
                )}
              </div>

              <p className="text-[10px] font-bold text-zinc-800 uppercase truncate max-w-full">
                {activeTab === 'type' ? typedName || 'Khách hàng' : displayName || 'Khách hàng'}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Signature Area Interactive tabs */}
      <div className="border border-zinc-800/80 rounded-xl p-4 bg-[#121212] space-y-4 shadow-lg mx-4">
        
        {/* Navigation Tabs for Signing Methods */}
        <div className="flex border-b border-zinc-800/60 pb-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('draw');
              setErrorMsg(null);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold transition-all border-b-2 -mb-[10px] ${
              activeTab === 'draw'
                ? 'border-[#c29b57] text-[#c29b57]'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            Vẽ Chữ Ký
          </button>
          
          <button
            type="button"
            onClick={() => {
              setActiveTab('type');
              setErrorMsg(null);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold transition-all border-b-2 -mb-[10px] ${
              activeTab === 'type'
                ? 'border-[#c29b57] text-[#c29b57]'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            Gõ Tên
          </button>

          <button
            type="button"
            disabled={savedSignatures.length === 0}
            onClick={() => {
              setActiveTab('saved');
              setErrorMsg(null);
              if (savedSignatures.length > 0 && !selectedSavedId) {
                setSelectedSavedId(savedSignatures[0].id);
              }
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold transition-all border-b-2 -mb-[10px] disabled:opacity-20 disabled:cursor-not-allowed ${
              activeTab === 'saved'
                ? 'border-[#c29b57] text-[#c29b57]'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            Đã Lưu ({savedSignatures.length})
          </button>
        </div>

        {/* Dynamic Inner Tab Content */}
        <div className="pt-1">
          {errorMsg && (
            <div className="mb-3 text-red-200 text-[12px] font-medium bg-red-950/30 border border-red-900/60 p-2.5 rounded-xl">
              {errorMsg}
            </div>
          )}

          {activeTab === 'draw' && (
            <div className="pt-1">
              <SignaturePad onSave={setDrawnSignature} strokeColor="#090d16" />
            </div>
          )}

          {activeTab === 'type' && (
            <div className="pt-1 space-y-3">
              <input
                type="text"
                placeholder="Nhập đầy đủ Họ và Tên..."
                value={typedName}
                onChange={(e) => {
                  setTypedName(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full border border-zinc-800 rounded-xl px-4 py-3 text-white text-[13px] font-medium bg-[#161616] outline-none focus:border-[#c29b57] placeholder:text-zinc-600"
              />
              <div className="flex flex-col items-center justify-center bg-[#161616] border border-zinc-800/60 rounded-xl py-4 select-none">
                <span className="text-[9px] text-zinc-500 tracking-wider font-sans mb-1 uppercase">Bản xem trước chữ ký điện tử</span>
                <span 
                  className="text-3xl font-medium text-white py-2 inline-block italic min-h-[44px]"
                  style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive, sans-serif" }}
                >
                  {typedName || 'Chưa nhập tên'}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="pt-1 max-h-36 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
              {savedSignatures.map((sig) => (
                <div
                  key={sig.id}
                  onClick={() => setSelectedSavedId(sig.id)}
                  className={`border rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${
                    selectedSavedId === sig.id
                      ? 'border-[#c29b57] bg-[#c29b57]/5 shadow-sm'
                      : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center border border-zinc-700 shrink-0">
                      {selectedSavedId === sig.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#c29b57]" />
                      )}
                    </div>
                    <span className="text-zinc-500 text-[10px]">Lưu ngày: {sig.date}</span>
                  </div>

                  <div className="h-10 max-w-[120px] flex items-center justify-center pr-2 bg-white rounded border border-zinc-300 p-0.5">
                    {sig.type === 'draw' ? (
                      <img src={sig.content} alt="Chữ ký lưu" className="max-h-9 object-contain" />
                    ) : (
                      <span 
                        className="text-md italic font-semibold text-zinc-900 truncate"
                        style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive, sans-serif" }}
                      >
                        {sig.content}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Action Buttons footer */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-4 bg-[#0f0f0f]/95 backdrop-blur-md border-t border-zinc-800/60 z-40 max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.5)] shrink-0 flex gap-3" 
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 font-semibold hover:bg-zinc-850 hover:text-white transition-all cursor-pointer text-xs uppercase tracking-wider"
        >
          Quay lại
        </button>
        <button
          type="button"
          onClick={handleSignAction}
          disabled={sealStatus !== 'applied'}
          className={`flex-1 py-3 bg-gradient-to-r from-[#c29b57] to-[#ebd5ad] hover:opacity-95 text-black font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow transition-all text-xs uppercase tracking-wider ${sealStatus !== 'applied' ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <FileText className="w-4 h-4" />
          Ký và Xác Nhận
        </button>
      </div>
    </div>
  );
}
