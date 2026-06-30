import React, { useState } from 'react';
import { 
  ArrowLeft, Home, Download, Upload, Archive, TrendingUp, Gift, User, 
  CreditCard, Lock, KeyRound, Wallet, LogOut, CheckCircle2, AlertCircle, 
  PlusCircle, RefreshCw, Smartphone, Landmark, QrCode, ShieldCheck,
  Search, Copy, Check, ChevronDown, ChevronUp, SlidersHorizontal, Filter,
  Calendar, ArrowUpDown, Sparkles, Coins, FileText, ExternalLink, ChevronRight, Cloud, UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EditableImage from './EditableImage';
import { useUser, Transaction, BankInfo } from './UserContext';
import EditProfileModal from './EditProfileModal';
import AccountVerification from './AccountVerification';
import GoogleDriveSync from './GoogleDriveSync';
import KeepNotes from './KeepNotes';

export default function Profile({ onBack, onHome, initialSubView, onNavigate }: { onBack: () => void, onHome: () => void, initialSubView?: string | null, onNavigate?: (view: string) => void }) {
  const { 
    displayName, 
    avatarImage, 
    balance, 
    setBalance,
    bankInfo, 
    setBankInfo, 
    transactions, 
    addTransaction,
    profits, 
    addProfit,
    bonuses, 
    addBonus,
    depositsList, 
    addDepositRecord,
    changePassword,
    changeWithdrawalPassword,
    logout,
    role,
    phoneNumber,
    birthYear,
    cccd,
    address,
    userId,
    isIdentityVerified,
    kycStatus,
    kycRejectReason,
    updateUserField
  } = useUser();

  const [activeSubView, setActiveSubView] = useState<string | null>(initialSubView || null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Form states
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState<'momo' | 'bank_qr' | 'bank_transfer'>('bank_qr');
  const [depositNote, setDepositNote] = useState('');
  const [depositProof, setDepositProof] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPass, setWithdrawPass] = useState('');
  
  // Bank Link states
  const [bankName, setBankName] = useState(bankInfo?.bankName || '');
  const [bankAccount, setBankAccount] = useState(bankInfo?.bankAccount || '');
  const [cardHolder, setCardHolder] = useState(bankInfo?.cardHolder || '');
  const [bankWithdrawalPass, setBankWithdrawalPass] = useState('');

  // Password states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Withdrawal password states
  const [oldWPassword, setOldWPassword] = useState('');
  const [newWPassword, setNewWPassword] = useState('');
  const [confirmNewWPassword, setConfirmNewWPassword] = useState('');

  // Advanced Transaction View states
  const [txSearchTerm, setTxSearchTerm] = useState('');
  const [txFilterType, setTxFilterType] = useState<'all' | 'deposit' | 'withdraw' | 'invest' | 'profit' | 'bonus'>('all');
  const [txFilterStatus, setTxFilterStatus] = useState<'all' | 'Thành công' | 'Đang xử lý' | 'Thất bại'>('all');
  const [txSortBy, setTxSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);

  // Feedback states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const isAdmin = role === 'admin' || role === 'super_admin' || role === 'support_admin' || role === 'finance_admin';

  const menuItems = [
    { id: 'transaction_history', icon: <Archive className="w-5 h-5" />, label: 'Lịch sử giao dịch' },
    { id: 'profit_history', icon: <TrendingUp className="w-5 h-5" />, label: 'Lịch sử lợi nhuận' },
    { id: 'bonus_history', icon: <Gift className="w-5 h-5" />, label: 'Lịch sử tiền thưởng' },
    { id: 'profile_info', icon: <User className="w-5 h-5" />, label: 'Thông tin hồ sơ' },
    { id: 'bank_link', icon: <CreditCard className="w-5 h-5" />, label: 'Liên kết ngân hàng' },
    { id: 'change_password', icon: <Lock className="w-5 h-5" />, label: 'Thay đổi mật khẩu' },
    { id: 'change_withdrawal_password', icon: <KeyRound className="w-5 h-5" />, label: 'Thay đổi mật khẩu rút tiền' },
    { id: 'deposits', icon: <Wallet className="w-5 h-5" />, label: 'Khoản tiền gửi' },
    { id: 'drive_sync', icon: <Cloud className="w-5 h-5" />, label: 'Đồng bộ Google Drive' },
    { id: 'keep_notes', icon: <FileText className="w-5 h-5 text-amber-500" />, label: 'Sổ tay Google Keep' },
  ];



  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' VNĐ';
  };

  const handleMenuClick = (id: string) => {
    if (id === 'profile_info') {
      setIsEditProfileOpen(true);
    } else {
      setActiveSubView(id);
    }
  };

  // Deposit handler
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(depositAmount.replace(/\D/g, ''));
    if (!amt || amt < 10000) {
      showToast('Số tiền gửi tối thiểu là 10.000 VNĐ', 'error');
      return;
    }
    
    addDepositRecord(amt, depositNote, depositProof || '');
    showToast(`Đã tạo yêu cầu gửi tiền ${formatCurrency(amt)} thành công! Đang chuyển hướng đến CSKH...`, 'success');
    setDepositAmount('');
    setDepositNote('');
    setDepositProof(null);

    if (onNavigate) {
      onNavigate('cskh');
    } else {
      setActiveSubView('deposits');
    }
  };

  // Withdraw handler
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankInfo) {
      showToast('Vui lòng liên kết ngân hàng trước khi rút tiền', 'error');
      setActiveSubView('bank_link');
      return;
    }

    const amt = Number(withdrawAmount.replace(/\D/g, ''));
    if (!amt || amt < 50000) {
      showToast('Số tiền rút tối thiểu là 50.000 VNĐ', 'error');
      return;
    }

    if (amt > balance) {
      showToast('Số dư khả dụng không đủ', 'error');
      return;
    }

    if (!withdrawPass) {
      showToast('Vui lòng nhập mật khẩu rút tiền', 'error');
      return;
    }

    const success = changeWithdrawalPassword(withdrawPass, withdrawPass); // verify password exists and matches
    if (!success) {
      showToast('Mật khẩu rút tiền không chính xác', 'error');
      return;
    }

    // Deduct and log transaction
    setBalance(prev => prev - amt);
    addTransaction({
      type: 'withdraw',
      amount: amt,
      status: 'Đang xử lý'
    });

    showToast('Hệ thống đang xét duyệt, xin chờ trong giây lát.', 'success');
    setWithdrawAmount('');
    setWithdrawPass('');
    setActiveSubView('transaction_history');
  };

  // Bank Link handler
  const handleBankLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !bankAccount || !cardHolder || !bankWithdrawalPass) {
      showToast('Vui lòng điền đầy đủ các thông tin', 'error');
      return;
    }

    if (updateUserField) {
      updateUserField('currentWithdrawalPassword', bankWithdrawalPass).catch(console.error);
    }
    
    setBankInfo({
      bankName,
      bankAccount,
      cardHolder: cardHolder.toUpperCase()
    });
    showToast('Liên kết tài khoản ngân hàng và đăng ký mật khẩu rút tiền thành công!', 'success');
  };

  const handleUnlinkBank = () => {
    setBankInfo(null);
    setBankName('');
    setBankAccount('');
    setCardHolder('');
    setBankWithdrawalPass('');
    showToast('Đã hủy liên kết ngân hàng', 'success');
  };

  // Change Password
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      showToast('Vui lòng nhập đầy đủ mật khẩu', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast('Mật khẩu mới không trùng khớp', 'error');
      return;
    }
    const success = changePassword(oldPassword, newPassword);
    if (success) {
      showToast('Đổi mật khẩu tài khoản thành công!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setActiveSubView(null);
    } else {
      showToast('Mật khẩu cũ không chính xác', 'error');
    }
  };

  // Change Withdrawal Password
  const handleChangeWithdrawalPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldWPassword || !newWPassword || !confirmNewWPassword) {
      showToast('Vui lòng nhập đầy đủ mật khẩu', 'error');
      return;
    }
    if (newWPassword !== confirmNewWPassword) {
      showToast('Mật khẩu mới không trùng khớp', 'error');
      return;
    }
    const success = changeWithdrawalPassword(oldWPassword, newWPassword);
    if (success) {
      showToast('Đổi mật khẩu rút tiền thành công!', 'success');
      setOldWPassword('');
      setNewWPassword('');
      setConfirmNewWPassword('');
      setActiveSubView(null);
    } else {
      showToast('Mật khẩu cũ không chính xác', 'error');
    }
  };

  // Claim Daily Bonus
  const handleDailyCheckin = () => {
    const lastCheckin = localStorage.getItem('last-checkin-date');
    const today = new Date().toDateString();

    if (lastCheckin === today) {
      showToast('Bạn đã điểm danh nhận thưởng ngày hôm nay rồi!', 'error');
      return;
    }

    // Check KYC status first
    if (!isIdentityVerified && kycStatus !== 'verified') {
      showToast('Tài khoản phải được xác thực thành công (KYC) mới được điểm danh hàng ngày!', 'error');
      return;
    }

    // Check deposits of the current day
    const todayStrEnCA = new Date().toLocaleDateString('en-CA');
    const todayStrViVN = new Date().toLocaleDateString('vi-VN');
    
    const todayDepositAmt = transactions
      .filter(t => {
        if (t.type !== 'deposit' || t.status !== 'Thành công') return false;
        if (t.timestamp) {
          const txDateStr = new Date(t.timestamp).toLocaleDateString('en-CA');
          if (txDateStr === todayStrEnCA) return true;
        }
        if (t.date) {
          if (t.date.includes(todayStrViVN) || t.date === todayStrViVN) return true;
        }
        return false;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    if (todayDepositAmt < 2000000) {
      showToast('Tài khoản phải nạp tiền từ 2.000.000 VNĐ trở lên trong ngày hôm nay mới được điểm danh!', 'error');
      return;
    }

    const rewardAmount = 50000; // 50,000 VND
    addBonus(rewardAmount, 'Thưởng điểm danh hàng ngày');
    localStorage.setItem('last-checkin-date', today);
    showToast(`Điểm danh thành công! Nhận được ${formatCurrency(rewardAmount)}`, 'success');
  };

  const totalDeposit = transactions
    .filter(t => t.type === 'deposit' && t.status === 'Thành công')
    .reduce((sum, t) => sum + t.amount, 0);

  let tierImage = 'https://statics.vinpearl.com/vinclub-member_1723049424.png';
  let tierName = 'Member';
  if (totalDeposit >= 10000000000) {
    tierImage = 'https://storage.googleapis.com/loyalty-public-arczn36dnada/240807164519_previous_photo_card_efd6a076-7d73-46e2-ac0c-713d2dca20f7.jpg';
    tierName = 'VVIP';
  } else if (totalDeposit >= 5000000000) {
    tierImage = 'https://storage.googleapis.com/loyalty-public-arczn36dnada/240807164461_previous_photo_card_c546ea67-12e3-445d-ad25-b91c8d600830.jpg';
    tierName = 'VIP';
  } else if (totalDeposit >= 1000000000) {
    tierImage = 'https://storage.googleapis.com/loyalty-public-arczn36dnada/240807164237_previous_photo_card_24fedc53-f059-407e-ac30-e3f7baf0fca7.jpg';
    tierName = 'Gold';
  }

  const renderSubView = () => {
    if (activeSubView === 'verification') {
      return <AccountVerification onBack={() => setActiveSubView(null)} />;
    }

    const title = menuItems.find(m => m.id === activeSubView)?.label || 
                 (activeSubView === 'deposit' ? 'Gửi tiền' : activeSubView === 'withdraw' ? 'Rút tiền' : '');

    let content = null;
    switch (activeSubView) {
      case 'deposit':
        content = (
          <form onSubmit={handleDepositSubmit} className="p-3 flex flex-col gap-3">
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-zinc-800 flex flex-col gap-3">
              <div>
                <h3 className="text-zinc-300 font-medium text-xs mb-2">Chọn phương thức:</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    type="button"
                    onClick={() => setDepositMethod('bank_qr')}
                    className={`py-2 px-1 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${depositMethod === 'bank_qr' ? 'border-[#c29b57] bg-[#c29b57]/10 text-[#ebd5ad]' : 'border-zinc-800 bg-black/40 text-zinc-400'}`}
                  >
                    <QrCode className="w-4 h-4 text-[#c29b57]" />
                    <span className="text-[10px] font-medium">QR Bank</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setDepositMethod('bank_transfer')}
                    className={`py-2 px-1 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${depositMethod === 'bank_transfer' ? 'border-[#c29b57] bg-[#c29b57]/10 text-[#ebd5ad]' : 'border-zinc-800 bg-black/40 text-zinc-400'}`}
                  >
                    <Landmark className="w-4 h-4 text-zinc-300" />
                    <span className="text-[10px] font-medium">Chuyển Khoản</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setDepositMethod('momo')}
                    className={`py-2 px-1 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${depositMethod === 'momo' ? 'border-[#c29b57] bg-[#c29b57]/10 text-[#ebd5ad]' : 'border-zinc-800 bg-black/40 text-zinc-400'}`}
                  >
                    <Smartphone className="w-4 h-4 text-pink-500" />
                    <span className="text-[10px] font-medium">Ví MoMo</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">Số tiền nạp (VNĐ)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={depositAmount ? new Intl.NumberFormat('vi-VN').format(Number(depositAmount.replace(/\D/g, ''))) : ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setDepositAmount(val);
                    }}
                    placeholder="Tối thiểu 10.000 VNĐ" 
                    className="w-full bg-black border border-zinc-700 rounded-lg pl-3 pr-10 py-2 text-sm text-zinc-200 font-bold focus:border-[#c29b57] focus:outline-none" 
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 font-medium text-xs">VNĐ</span>
                </div>
                
                {/* Preset amounts row */}
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {['50000', '200000', '1000000', '5000000'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDepositAmount(preset)}
                      className="py-1 bg-zinc-800/60 text-zinc-300 text-[10px] rounded hover:bg-zinc-700 border border-zinc-700 transition-colors"
                    >
                      +{new Intl.NumberFormat('vi-VN').format(Number(preset))}
                    </button>
                  ))}
                </div>
              </div>

              {depositMethod === 'bank_qr' && (
                <div className="bg-black/60 rounded-lg p-2.5 border border-zinc-800/80 flex items-center gap-3">
                  <div className="w-16 h-16 bg-white p-1 rounded-md shrink-0 flex items-center justify-center">
                    <img src="https://storage.googleapis.com/a1aa/image/qr_stub.png" alt="QR Code" className="w-full h-full object-contain" onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/80x80/png?text=QR+CODE";
                    }} />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-bold text-zinc-300 text-[11px] mb-0.5">Quét mã QR để chuyển tiền 24/7</p>
                    <p className="text-[10px] text-zinc-400 truncate">Nội dung: <span className="text-[#c29b57] font-mono font-bold uppercase">{displayName}NAP</span></p>
                  </div>
                </div>
              )}

              {/* Lời nhắn / Ghi chú */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">Ghi chú từ Player (Lời nhắn)</label>
                <input
                  type="text"
                  value={depositNote}
                  onChange={(e) => setDepositNote(e.target.value)}
                  placeholder="Ví dụ: Chuyển khoản từ Nguyen Van A..."
                  className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:border-[#c29b57] focus:outline-none"
                />
              </div>

              {/* Chứng từ giao dịch */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">Ảnh minh chứng giao dịch (Chứng từ nạp tiền)</label>
                
                <div 
                  onClick={() => document.getElementById('proof-upload-input')?.click()}
                  className="border border-dashed border-zinc-700 hover:border-[#c29b57]/60 bg-black/40 rounded-lg p-2.5 cursor-pointer transition-all flex items-center justify-between"
                >
                  <input 
                    id="proof-upload-input" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => setDepositProof(event.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-300 text-xs">
                      {depositProof ? '✓ Đã tải ảnh minh chứng' : 'Tải biên lai / hóa đơn'}
                    </span>
                  </div>
                  {depositProof && (
                    <div className="w-7 h-7 rounded overflow-hidden border border-zinc-800 shrink-0 relative group">
                      <img src={depositProof} alt="Proof" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setDepositProof(null); }}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Xóa"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick mock receipt select */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500">Mẫu chứng minh:</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDepositProof('https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop');
                    }}
                    className="text-[9px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                  >
                    Techcombank
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDepositProof('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=600&auto=format&fit=crop');
                    }}
                    className="text-[9px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                  >
                    Momo
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 rounded-lg bg-[#c29b57] text-black font-semibold hover:bg-[#ebd5ad] transition-colors shadow-lg text-xs"
              >
                Xác nhận nạp tiền
              </button>
            </div>
          </form>
        );
        break;

      case 'withdraw':
        content = (
          <form onSubmit={handleWithdrawSubmit} className="p-4 flex flex-col gap-4">
            {!bankInfo ? (
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-zinc-800 text-center flex flex-col items-center gap-4">
                <AlertCircle className="w-12 h-12 text-[#c29b57] opacity-80" />
                <div className="text-zinc-300">
                  <p className="font-semibold mb-1">Chưa liên kết ngân hàng</p>
                  <p className="text-xs text-zinc-400">Bạn cần cập nhật và liên kết thông tin thẻ ngân hàng trước khi thực hiện giao dịch rút tiền.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setActiveSubView('bank_link')}
                  className="w-full py-2.5 rounded-lg bg-[#c29b57] text-black font-semibold hover:bg-[#ebd5ad] transition-colors"
                >
                  Liên kết ngay
                </button>
              </div>
            ) : (
              <div className="bg-[#1a1a1a] p-5 rounded-xl border border-zinc-800">
                <div className="mb-4 bg-black/60 rounded-lg p-3.5 border border-zinc-800">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-zinc-500">Rút về tài khoản:</span>
                    <span className="text-[#c29b57] font-semibold">{bankInfo.bankName}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Chủ tài khoản:</span>
                    <span className="text-zinc-200 font-bold uppercase">{bankInfo.cardHolder}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-zinc-500">Số tài khoản:</span>
                    <span className="text-zinc-300 font-mono">{bankInfo.bankAccount ? ("*****" + bankInfo.bankAccount.substring(5)) : ""}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Số dư khả dụng: <span className="text-zinc-200">{formatCurrency(balance)}</span></label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={withdrawAmount ? new Intl.NumberFormat('vi-VN').format(Number(withdrawAmount.replace(/\D/g, ''))) : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setWithdrawAmount(val);
                      }}
                      placeholder="Nhập số tiền muốn rút..." 
                      className="w-full bg-black border border-zinc-700 rounded-lg pl-4 pr-24 py-3 text-zinc-200 font-bold focus:border-[#c29b57] focus:outline-none" 
                    />
                    <button 
                      type="button"
                      onClick={() => setWithdrawAmount(String(balance))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c29b57] font-semibold text-xs hover:text-[#ebd5ad] transition-colors"
                    >
                      RÚT TẤT CẢ
                    </button>
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">Yêu cầu rút tối thiểu: 50.000 VNĐ</span>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Mật khẩu rút tiền</label>
                  <input 
                    type="password" 
                    maxLength={6}
                    value={withdrawPass}
                    onChange={(e) => setWithdrawPass(e.target.value.replace(/\D/g, ''))}
                    placeholder="Mật khẩu rút tiền (mặc định: 112233)" 
                    className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-zinc-200 focus:border-[#c29b57] focus:outline-none text-center tracking-[0.5em] font-bold" 
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 rounded-lg bg-[#c29b57] text-black font-semibold hover:bg-[#ebd5ad] transition-colors shadow-lg shadow-[#c29b57]/10"
                >
                  Xác nhận yêu cầu rút tiền
                </button>
              </div>
            )}
          </form>
        );
        break;

      case 'transaction_history': {
        const safeGetTime = (dateStr: string) => {
          if (!dateStr) return 0;
          if (dateStr.includes('T')) return new Date(dateStr).getTime();
          const parts = dateStr.split(/[\s,]+/);
          const datePart = parts.find(p => p.includes('/'));
          const timePart = parts.find(p => p.includes(':'));
          if (datePart) {
            const dParts = datePart.split('/');
            const day = parseInt(dParts[0], 10);
            const month = parseInt(dParts[1], 10) - 1;
            const year = parseInt(dParts[2], 10);
            let hours = 0, minutes = 0, seconds = 0;
            if (timePart) {
              const tParts = timePart.split(':');
              hours = parseInt(tParts[0], 10) || 0;
              minutes = parseInt(tParts[1], 10) || 0;
              seconds = parseInt(tParts[2], 10) || 0;
            }
            return new Date(year, month, day, hours, minutes, seconds).getTime();
          }
          const parsed = Date.parse(dateStr);
          return isNaN(parsed) ? 0 : parsed;
        };

        // Filter and sort transactions
        const filteredTransactions = transactions
          .filter((tx) => {
            // Type filter
            if (txFilterType !== 'all' && tx.type !== txFilterType) return false;
            // Status filter
            if (txFilterStatus !== 'all' && tx.status !== txFilterStatus) return false;
            // Search filter
            if (txSearchTerm) {
              const query = txSearchTerm.toLowerCase();
              const idMatches = tx.id.toLowerCase().includes(query);
              const typeMatches = (tx.type || '').toLowerCase().includes(query);
              const statusMatches = (tx.status || '').toLowerCase().includes(query);
              const projectMatches = (tx.contractProjectTitle || '').toLowerCase().includes(query);
              const amountMatches = String(tx.amount).includes(query);
              const dateMatches = (tx.date || '').toLowerCase().includes(query);
              return idMatches || typeMatches || statusMatches || projectMatches || amountMatches || dateMatches;
            }
            return true;
          })
          .sort((a, b) => {
            if (txSortBy === 'date_desc') {
              return safeGetTime(b.date) - safeGetTime(a.date) || b.id.localeCompare(a.id);
            }
            if (txSortBy === 'date_asc') {
              return safeGetTime(a.date) - safeGetTime(b.date) || a.id.localeCompare(b.id);
            }
            if (txSortBy === 'amount_desc') {
              return b.amount - a.amount;
            }
            if (txSortBy === 'amount_asc') {
              return a.amount - b.amount;
            }
            return 0;
          });

        // Compute bento stats
        const totalDeposits = transactions
          .filter(t => t.type === 'deposit' && t.status === 'Thành công')
          .reduce((sum, t) => sum + t.amount, 0);

        const totalWithdrawals = transactions
          .filter(t => t.type === 'withdraw' && t.status === 'Thành công')
          .reduce((sum, t) => sum + t.amount, 0);

        const totalProfitsAndBonuses = transactions
          .filter(t => (t.type === 'profit' || t.type === 'bonus') && t.status === 'Thành công')
          .reduce((sum, t) => sum + t.amount, 0);

        const handleCopyTxId = (id: string) => {
          navigator.clipboard.writeText(id).then(() => {
            setCopiedTxId(id);
            setTimeout(() => setCopiedTxId(null), 2000);
          });
        };

        content = (
          <div className="p-4 flex flex-col gap-5 bg-gradient-to-b from-[#0a0a0a] to-[#121212] h-full text-zinc-100">
            {/* Real-time sync bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/60 rounded-lg border border-zinc-800/80 text-[11px] text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-medium tracking-wide">Thời gian thực (Firestore Cloud DB)</span>
              </div>
              <span className="text-zinc-500 font-mono text-[10px] uppercase">Kết nối SSL an toàn</span>
            </div>

            {/* Bento Stats Summary Card */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-[#111] border border-zinc-800/80 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Tổng Nạp (Thành công)</span>
                <span className="text-[11.5px] font-bold text-emerald-500 font-mono">
                  +{new Intl.NumberFormat('vi-VN').format(totalDeposits)}
                </span>
              </div>
              <div className="bg-[#111] border border-zinc-800/80 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Tổng Rút (Thành công)</span>
                <span className="text-[11.5px] font-bold text-rose-500 font-mono">
                  -{new Intl.NumberFormat('vi-VN').format(totalWithdrawals)}
                </span>
              </div>
              <div className="bg-[#111] border border-[#c29b57]/20 rounded-xl p-3 flex flex-col justify-between bg-gradient-to-br from-[#c29b57]/5 to-[#111]">
                <span className="text-[9px] font-bold text-[#c29b57] uppercase tracking-wider block mb-1">Lợi Nhuận / Thưởng</span>
                <span className="text-[11.5px] font-bold text-[#ebd5ad] font-mono">
                  +{new Intl.NumberFormat('vi-VN').format(totalProfitsAndBonuses)}
                </span>
              </div>
            </div>

            {/* Premium Filter Controls with Search */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-3.5 space-y-3.5">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo Mã giao dịch, loại, số tiền..."
                  value={txSearchTerm}
                  onChange={(e) => setTxSearchTerm(e.target.value)}
                  className="w-full bg-black/60 border border-zinc-800 hover:border-zinc-700 focus:border-[#c29b57] rounded-lg pl-9 pr-8 py-2.5 text-xs text-zinc-200 outline-none transition-all placeholder:text-zinc-600 font-medium"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                {txSearchTerm && (
                  <button
                    onClick={() => setTxSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs font-bold"
                  >
                    Xóa
                  </button>
                )}
              </div>

              {/* Type Filter Tabs (Horizontal Scrollable) */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'deposit', label: 'Nạp tiền' },
                  { id: 'withdraw', label: 'Rút tiền' },
                  { id: 'invest', label: 'Đầu tư' },
                  { id: 'profit', label: 'Lợi nhuận' },
                  { id: 'bonus', label: 'Thưởng' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setTxFilterType(tab.id as any);
                      setExpandedTxId(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all border ${
                      txFilterType === tab.id
                        ? 'bg-[#c29b57] text-black border-[#c29b57] font-bold shadow-md shadow-[#c29b57]/10'
                        : 'bg-black/40 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Additional Dropdowns: Status and Sorting */}
              <div className="grid grid-cols-2 gap-2">
                {/* Status Selector */}
                <div className="relative">
                  <select
                    value={txFilterStatus}
                    onChange={(e) => {
                      setTxFilterStatus(e.target.value as any);
                      setExpandedTxId(null);
                    }}
                    className="w-full bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 text-[10.5px] text-zinc-300 outline-none hover:border-zinc-700 transition-all cursor-pointer appearance-none"
                  >
                    <option value="all">🟢 Trạng thái: Tất cả</option>
                    <option value="Thành công">Thành công</option>
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Thất bại">Thất bại</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                </div>

                {/* Sorting Selector */}
                <div className="relative">
                  <select
                    value={txSortBy}
                    onChange={(e) => setTxSortBy(e.target.value as any)}
                    className="w-full bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 text-[10.5px] text-zinc-300 outline-none hover:border-zinc-700 transition-all cursor-pointer appearance-none"
                  >
                    <option value="date_desc">🕒 Mới nhất</option>
                    <option value="date_asc">🕒 Cũ nhất</option>
                    <option value="amount_desc">💰 Số tiền giảm dần</option>
                    <option value="amount_asc">💰 Số tiền tăng dần</option>
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Danh sách giao dịch ({filteredTransactions.length})
                </span>
                {filteredTransactions.length > 0 && (
                  <span className="text-[10px] text-[#c29b57] font-semibold">Chạm để xem biên lai</span>
                )}
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="bg-[#111] border border-zinc-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-zinc-900/80 flex items-center justify-center border border-zinc-800">
                    <SlidersHorizontal className="w-5 h-5 text-zinc-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-300 font-bold text-xs">Không tìm thấy giao dịch nào</p>
                    <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                      Vui lòng điều chỉnh lại bộ lọc tìm kiếm hoặc nạp tiền để thực hiện giao dịch đầu tiên.
                    </p>
                  </div>
                  {(txSearchTerm || txFilterType !== 'all' || txFilterStatus !== 'all') && (
                    <button
                      onClick={() => {
                        setTxSearchTerm('');
                        setTxFilterType('all');
                        setTxFilterStatus('all');
                      }}
                      className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[#c29b57] text-[10.5px] font-bold rounded-lg transition-all"
                    >
                      Đặt lại bộ lọc
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <AnimatePresence initial={false}>
                    {filteredTransactions.map((tx) => {
                      const isExpanded = expandedTxId === tx.id;
                      const txIcon = 
                        tx.type === 'deposit' ? <Download className="w-4 h-4 text-emerald-400" /> :
                        tx.type === 'withdraw' ? <Upload className="w-4 h-4 text-rose-400" /> :
                        tx.type === 'invest' ? <Coins className="w-4 h-4 text-[#ebd5ad]" /> :
                        tx.type === 'profit' ? <TrendingUp className="w-4 h-4 text-amber-400" /> :
                        <Gift className="w-4 h-4 text-[#c29b57]" />;

                      const isPositive = tx.type === 'deposit' || tx.type === 'profit' || tx.type === 'bonus';

                      return (
                        <div
                          key={tx.id}
                          className={`bg-zinc-950 rounded-xl border transition-all duration-300 overflow-hidden ${
                            isExpanded 
                              ? 'border-[#c29b57] bg-zinc-900/40 shadow-lg shadow-black/80' 
                              : 'border-zinc-800/80 hover:border-zinc-700'
                          }`}
                        >
                          {/* Card Header Row (Clickable) */}
                          <div
                            onClick={() => setExpandedTxId(isExpanded ? null : tx.id)}
                            className="p-4 flex justify-between items-center cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                isExpanded ? 'bg-zinc-800 border border-[#c29b57]/30' : 'bg-zinc-900 border border-zinc-800'
                              }`}>
                                {txIcon}
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-zinc-200 font-bold text-xs uppercase tracking-wide">
                                  {tx.type === 'deposit' ? 'Nạp tiền' : 
                                   tx.type === 'withdraw' ? 'Rút tiền' : 
                                   tx.type === 'invest' ? 'Góp vốn dự án' :
                                   tx.type === 'profit' ? 'Lợi nhuận phát sinh' : 'Tiền thưởng VIP'}
                                </span>
                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                                  <span>{tx.date}</span>
                                  <span>•</span>
                                  <span className="font-mono">{tx.id}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3.5">
                              <div className="flex flex-col items-end gap-1">
                                <span className={`font-bold text-[13px] font-mono ${
                                  isPositive ? 'text-emerald-500' : 'text-rose-500'
                                }`}>
                                  {isPositive ? '+' : '-'} {new Intl.NumberFormat('vi-VN').format(tx.amount)} đ
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider ${
                                  tx.status === 'Thành công' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' : 
                                  tx.status === 'Đang xử lý' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/40' : 
                                  'bg-rose-950/40 text-rose-400 border border-rose-900/40'
                                }`}>
                                  {tx.status}
                                </span>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-zinc-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-zinc-500" />
                              )}
                            </div>
                          </div>

                          {/* Expandable Custom High-Fidelity Slip Drawer */}
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                              className="border-t border-zinc-900 px-4 pb-4 pt-1"
                            >
                              <div className="bg-[#121212]/80 rounded-lg p-3.5 border border-zinc-800/60 relative overflow-hidden space-y-3">
                                {/* Watermark logo style */}
                                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#c29b57]/5 rounded-full pointer-events-none flex items-center justify-center border border-[#c29b57]/10">
                                  <Sparkles className="w-10 h-10 text-[#c29b57]/20" />
                                </div>

                                <div className="border-b border-dashed border-zinc-800 pb-2 text-center">
                                  <span className="text-[10px] font-black tracking-[0.2em] text-[#c29b57] uppercase">BIÊN LAI ĐIỆN TỬ VINCLUB</span>
                                  <p className="text-[8px] text-zinc-500">Mã hóa giao dịch lưu trữ Blockchain</p>
                                </div>

                                <div className="space-y-1.5 text-xs">
                                  <div className="flex justify-between items-center">
                                    <span className="text-zinc-500">Mã giao dịch:</span>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-zinc-200 font-mono font-bold tracking-wide">{tx.id}</span>
                                      <button
                                        onClick={() => handleCopyTxId(tx.id)}
                                        className="text-zinc-500 hover:text-[#c29b57] p-1 rounded hover:bg-zinc-800 transition-all cursor-pointer"
                                        title="Copy Transaction ID"
                                      >
                                        {copiedTxId === tx.id ? (
                                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <span className="text-zinc-500">Thời gian tạo:</span>
                                    <span className="text-zinc-300 font-medium">{tx.date}</span>
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <span className="text-zinc-500">Hình thức:</span>
                                    <span className="text-[#ebd5ad] font-bold uppercase text-[10px] tracking-wide">
                                      {tx.type === 'deposit' ? 'Chuyển khoản nạp tiền' : 
                                       tx.type === 'withdraw' ? 'Rút tiền tài khoản ngân hàng' : 
                                       tx.type === 'invest' ? 'Góp vốn đầu tư VIP' :
                                       tx.type === 'profit' ? 'Cộng lãi tự động hằng ngày' : 'Tiền thưởng chương trình tri ân'}
                                    </span>
                                  </div>

                                  {/* Conditionally Render Project Name for Investments */}
                                  {tx.contractProjectTitle && (
                                    <div className="flex justify-between items-start">
                                      <span className="text-zinc-500 shrink-0">Chi tiết dự án:</span>
                                      <span className="text-zinc-200 font-bold text-right pl-4">{tx.contractProjectTitle}</span>
                                    </div>
                                  )}

                                  {/* Rendering digital signatures for contract agreements */}
                                  {tx.signatureContent && (
                                    <div className="mt-2.5 pt-2 border-t border-zinc-900 space-y-1.5">
                                      <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-zinc-500">Bảo chứng điện tử:</span>
                                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                          <ShieldCheck className="w-3 h-3" /> Đã ký số bảo an
                                        </span>
                                      </div>
                                      <div className="bg-black/80 rounded border border-zinc-800/80 p-2 text-center relative overflow-hidden">
                                        <p className="text-[9px] text-zinc-500 mb-1 uppercase tracking-wider">Hợp đồng điện tử ký bởi</p>
                                        {tx.signatureType === 'draw' ? (
                                          <div className="inline-block bg-white/5 p-1 rounded border border-zinc-800">
                                            <img src={tx.signatureContent} alt="Signature" className="max-h-8 object-contain invert brightness-125" />
                                          </div>
                                        ) : (
                                          <span className="font-serif italic text-sm font-extrabold text-amber-500 tracking-wider">
                                            {tx.signatureContent}
                                          </span>
                                        )}
                                        <p className="text-[8px] font-mono text-[#c29b57] mt-1.5 opacity-85">
                                          Hash SHA-256: {tx.id.substring(2)}F8A{Math.floor(Math.random() * 900 + 100)}E9D
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  <div className="border-t border-zinc-900 pt-2 flex justify-between items-center text-xs">
                                    <span className="text-zinc-400 font-bold">Số tiền:</span>
                                    <span className={`font-mono font-black text-sm ${
                                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                                    }`}>
                                      {isPositive ? '+' : '-'} {new Intl.NumberFormat('vi-VN').format(tx.amount)} VNĐ
                                    </span>
                                  </div>

                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-zinc-500">Phí giao dịch:</span>
                                    <span className="text-emerald-400 font-bold">MIỄN PHÍ (0đ)</span>
                                  </div>

                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-zinc-500">Mã hóa đối soát:</span>
                                    <span className="text-zinc-500 font-mono tracking-widest uppercase">SSL_SECURE_GATEWAY</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        );
        break;
      }

      case 'profit_history':
        content = (
          <div className="p-4 flex flex-col gap-3">
            {profits.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-zinc-500 text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-zinc-800/40 flex items-center justify-center mb-2">
                  <TrendingUp className="w-8 h-8 text-zinc-600" />
                </div>
                <p className="text-zinc-400 font-medium">Chưa nhận lợi nhuận</p>
                <p className="text-xs text-zinc-500">Các hoạt động phân bổ cổ tức, lãi suất đầu tư sẽ cập nhật tại đây.</p>
              </div>
            ) : (
              profits.map((pf) => (
                <div key={pf.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <span className="text-zinc-200 font-semibold text-sm">{pf.description}</span>
                    <span className="text-[11px] text-zinc-500">{pf.date}</span>
                  </div>
                  <span className="text-green-500 font-bold text-sm">+{formatCurrency(pf.amount)}</span>
                </div>
              ))
            )}
          </div>
        );
        break;

      case 'bonus_history':
        content = (
          <div className="p-4 flex flex-col gap-4">
            {/* Daily check-in panel */}
            <div className="bg-gradient-to-br from-[#c29b57]/20 to-[#1a1a1a] p-5 rounded-xl border border-[#c29b57]/30 flex flex-col gap-3.5 text-center items-center">
              <Gift className="w-12 h-12 text-[#c29b57]" />
              <div>
                <h3 className="text-[#ebd5ad] font-bold text-base">Điểm Danh Hàng Ngày</h3>
                <p className="text-xs text-zinc-400 mt-1">Mỗi ngày điểm danh nhận ngay quà tặng 50.000 VNĐ vào tài khoản chính.</p>
              </div>
              <button 
                onClick={handleDailyCheckin}
                className="w-full py-2.5 rounded-lg bg-[#c29b57] hover:bg-[#ebd5ad] text-black font-bold text-sm transition-colors shadow-md shadow-[#c29b57]/20"
              >
                Nhận 50.000 VNĐ Ngay
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <h4 className="text-zinc-400 font-medium text-xs uppercase tracking-wider px-1">Lịch sử nhận thưởng</h4>
              {bonuses.length === 0 ? (
                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-zinc-800 text-center text-zinc-500 text-xs">
                  Chưa có lịch sử tiền thưởng
                </div>
              ) : (
                bonuses.map((bn) => (
                  <div key={bn.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-200 font-medium text-sm">{bn.description}</span>
                      <span className="text-[11px] text-zinc-500">{bn.date}</span>
                    </div>
                    <span className="text-green-500 font-bold text-sm">+{formatCurrency(bn.amount)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        );
        break;

      case 'bank_link':
        content = (
          <div className="p-4 flex flex-col gap-4">
            {bankInfo ? (
              <div className="flex flex-col gap-4">
                {/* Credit Card Style Render */}
                <div className="relative w-full aspect-[1.6/1] rounded-2xl p-6 overflow-hidden bg-gradient-to-tr from-[#151922] via-[#242c3c] to-[#12161e] border border-zinc-700/80 shadow-2xl flex flex-col justify-between">
                  {/* Chip & Bank Name */}
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[#c29b57] text-lg font-bold tracking-wider uppercase italic">{bankInfo.bankName}</span>
                      <span className="text-[8px] text-zinc-400 tracking-widest uppercase">VINCLUB PLATINUM</span>
                    </div>
                    <div className="w-10 h-7 rounded bg-gradient-to-b from-yellow-300 to-[#c29b57] opacity-80 border border-[#ebd5ad]/20"></div>
                  </div>

                  {/* Card Number */}
                  <div className="text-zinc-200 text-lg sm:text-xl font-mono tracking-[0.25em] my-2">
                    {(() => {
                      const formatted = bankInfo.bankAccount.replace(/(.{4})/g, '$1 ').trim();
                      let digitCount = 0;
                      let result = '';
                      for (let i = 0; i < formatted.length; i++) {
                        const char = formatted[i];
                        if (char >= '0' && char <= '9') {
                          if (digitCount < 5) {
                            result += '*';
                            digitCount++;
                          } else {
                            result += char;
                          }
                        } else {
                          result += char;
                        }
                      }
                      return result;
                    })()}
                  </div>

                  {/* Card Holder */}
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-zinc-500 uppercase tracking-wider">CHỦ THẺ</span>
                      <span className="text-zinc-200 font-bold tracking-wider text-sm uppercase">{bankInfo.cardHolder}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[8px] text-zinc-500 uppercase tracking-wider">HẠN SỬ DỤNG</span>
                      <span className="text-zinc-300 font-mono text-xs">12/32</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleUnlinkBank}
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-xl border border-red-500/20 transition-colors"
                >
                  Hủy liên kết tài khoản ngân hàng
                </button>
              </div>
            ) : (
              <form onSubmit={handleBankLinkSubmit} className="bg-[#1a1a1a] p-5 rounded-xl border border-zinc-800 flex flex-col gap-4">
                <h3 className="text-zinc-200 font-medium text-sm border-b border-zinc-800 pb-3">Liên kết tài khoản ngân hàng</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Tên ngân hàng</label>
                  <input 
                    type="text" 
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Ví dụ: Vietcombank, Techcombank..." 
                    className="w-full bg-[#0d0d0d] border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-[#c29b57] focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Số tài khoản</label>
                  <input 
                    type="text" 
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                    placeholder="Nhập số tài khoản..." 
                    className="w-full bg-[#0d0d0d] border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-[#c29b57] focus:outline-none font-mono" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Tên chủ tài khoản</label>
                  <input 
                    type="text" 
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Nhập tên không dấu..." 
                    className="w-full bg-[#0d0d0d] border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-[#c29b57] focus:outline-none uppercase" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Mật khẩu rút tiền (Đăng ký mới)</label>
                  <input 
                    type="password" 
                    value={bankWithdrawalPass}
                    onChange={(e) => setBankWithdrawalPass(e.target.value)}
                    placeholder="Đặt mật khẩu rút tiền mới..." 
                    className="w-full bg-[#0d0d0d] border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-[#c29b57] focus:outline-none font-mono" 
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 mt-3 rounded-lg bg-[#c29b57] text-black font-semibold hover:bg-[#ebd5ad] transition-colors"
                >
                  Liên kết tài khoản
                </button>
              </form>
            )}
          </div>
        );
        break;

      case 'change_password':
        content = (
          <form onSubmit={handleChangePasswordSubmit} className="p-4 flex flex-col gap-4">
            <div className="bg-[#1a1a1a] p-5 rounded-xl border border-zinc-800 flex flex-col gap-4">
              <h3 className="text-zinc-200 font-medium text-sm border-b border-zinc-800 pb-3">Thay đổi mật khẩu đăng nhập</h3>
              
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Mật khẩu cũ</label>
                <input 
                  type="password" 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại (mặc định: 123456)" 
                  className="w-full bg-[#0d0d0d] border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-[#c29b57] focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Mật khẩu mới</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới..." 
                  className="w-full bg-[#0d0d0d] border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-[#c29b57] focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Xác nhận mật khẩu mới</label>
                <input 
                  type="password" 
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..." 
                  className="w-full bg-[#0d0d0d] border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-[#c29b57] focus:outline-none" 
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 mt-4 rounded-lg bg-[#c29b57] text-black font-semibold hover:bg-[#ebd5ad] transition-colors"
              >
                Cập nhật mật khẩu
              </button>
            </div>
          </form>
        );
        break;

      case 'change_withdrawal_password':
        content = (
          <form onSubmit={handleChangeWithdrawalPasswordSubmit} className="p-4 flex flex-col gap-4">
            <div className="bg-[#1a1a1a] p-5 rounded-xl border border-zinc-800 flex flex-col gap-4">
              <h3 className="text-zinc-200 font-medium text-sm border-b border-zinc-800 pb-3">Thay đổi mật khẩu rút tiền</h3>
              
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Mật khẩu rút tiền hiện tại</label>
                <input 
                  type="password" 
                  maxLength={6}
                  value={oldWPassword}
                  onChange={(e) => setOldWPassword(e.target.value.replace(/\D/g, ''))}
                  placeholder="Mật khẩu hiện tại (mặc định: 112233)" 
                  className="w-full bg-[#0d0d0d] border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-[#c29b57] focus:outline-none font-mono tracking-widest text-center" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Mật khẩu rút tiền mới (6 số)</label>
                <input 
                  type="password" 
                  maxLength={6}
                  value={newWPassword}
                  onChange={(e) => setNewWPassword(e.target.value.replace(/\D/g, ''))}
                  placeholder="Nhập 6 số mật khẩu mới..." 
                  className="w-full bg-[#0d0d0d] border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-[#c29b57] focus:outline-none font-mono tracking-widest text-center" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase">Xác nhận mật khẩu rút tiền mới</label>
                <input 
                  type="password" 
                  maxLength={6}
                  value={confirmNewWPassword}
                  onChange={(e) => setConfirmNewWPassword(e.target.value.replace(/\D/g, ''))}
                  placeholder="Nhập lại 6 số mật khẩu mới..." 
                  className="w-full bg-[#0d0d0d] border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-200 focus:border-[#c29b57] focus:outline-none font-mono tracking-widest text-center" 
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 mt-4 rounded-lg bg-[#c29b57] text-black font-semibold hover:bg-[#ebd5ad] transition-colors"
              >
                Cập nhật mật khẩu rút tiền
              </button>
            </div>
          </form>
        );
        break;

      case 'deposits':
        content = (
          <div className="p-4 flex flex-col gap-3">
            {depositsList.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-zinc-500 text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-zinc-800/40 flex items-center justify-center mb-2">
                  <Wallet className="w-8 h-8 text-zinc-600" />
                </div>
                <p className="text-zinc-400 font-medium">Chưa có khoản gửi nào</p>
                <p className="text-xs text-zinc-500">Mọi lệnh nạp tiền chưa hoàn thành hoặc đang chờ duyệt sẽ nằm ở đây.</p>
              </div>
            ) : (
              depositsList.map((dep) => (
                <div key={dep.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <span className="text-zinc-200 font-semibold text-sm">Nạp tiền vào tài khoản</span>
                    <span className="text-[11px] text-zinc-500">{dep.date}</span>
                    <span className="text-[10px] text-zinc-600 font-mono">ID: {dep.id}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-green-500 font-bold text-sm">+{formatCurrency(dep.amount)}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      dep.status === 'Thành công' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {dep.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        );
        break;

      case 'drive_sync':
        content = (
          <div className="p-4">
            <GoogleDriveSync onSyncComplete={() => showToast('Đồng bộ hợp đồng thành công!', 'success')} />
          </div>
        );
        break;

      case 'keep_notes':
        content = (
          <div className="p-0">
            <KeepNotes />
          </div>
        );
        break;

      default:
        content = <div className="p-4 text-zinc-400">Đang phát triển...</div>;
    }

    return (
      <div className="flex-1 overflow-y-auto bg-[#0d0d0d] flex flex-col h-full pb-36">
        <div className="flex items-center justify-between p-4 bg-[#0d0d0d] sticky top-0 z-20 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveSubView(null)} className="p-1 -ml-1 text-zinc-300 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-zinc-200 font-medium text-lg uppercase tracking-wide">{title}</h1>
          </div>
        </div>
        {content}
      </div>
    );
  };

  if (activeSubView) {
    return (
      <div className="relative flex-1 flex flex-col h-full">
        {renderSubView()}
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[250] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
            toast.type === 'success' ? 'bg-green-950/90 text-green-300 border-green-800' : 'bg-red-950/90 text-red-300 border-red-800'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-xs font-semibold">{toast.message}</span>
          </div>
        )}
      </div>
    );
  }

  const maskPhone = (phone: string) => {
    if (!phone) return '09******66';
    const trimmed = phone.trim();
    if (trimmed.length >= 10) {
      return trimmed.substring(0, 2) + '******' + trimmed.substring(trimmed.length - 2);
    }
    if (trimmed.length < 6) return trimmed;
    return trimmed.substring(0, 2) + '*'.repeat(trimmed.length - 4) + trimmed.substring(trimmed.length - 2);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-32 bg-[#fbfbf9] flex flex-col h-full relative pt-8">
      {/* Tier Card */}
      <div className="px-4 mt-2">
        <div className="rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative flex flex-col items-center bg-[#b48b3b] overflow-hidden w-full text-center">
          {/* Subtle metal shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-white/5 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 w-full flex flex-col items-center">
            {/* Avatar */}
            <div className="relative mb-3">
               <div className="w-[84px] h-[84px] bg-[#f9e9c3] rounded-full flex items-center justify-center border-[3px] border-white overflow-hidden shadow-sm">
                 {avatarImage ? (
                    <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-[#b48b3b] text-3xl font-semibold font-['Montserrat'] tracking-wide">
                      {displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'TT'}
                    </span>
                  )}
               </div>
               <button 
                 onClick={() => setIsEditProfileOpen(true)} 
                 className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 text-gray-500 hover:text-[#b48b3b] transition-colors active:scale-90"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
               </button>
            </div>
            
            <h2 className="text-white text-[20px] font-bold font-['Montserrat'] mb-1 tracking-wide">{displayName || 'Trần Duy Thái'}</h2>
            <p className="text-white/80 text-[13px] font-['Plus_Jakarta_Sans'] mb-5 font-normal tracking-wide">{maskPhone(phoneNumber)}</p>
  
            {/* Divider line */}
            <div className="w-full h-[1px] bg-white/20 mb-5"></div>

            <div className="w-full flex items-center">
               <div className="flex-1 flex flex-col items-center">
                  <span className="text-white font-extrabold text-[17px] font-['Montserrat'] uppercase tracking-wider">{tierName}</span>
                  <span className="text-white/70 text-[11px] mt-0.5 font-['Plus_Jakarta_Sans'] font-medium">Hạng thành viên</span>
               </div>
               <div className="w-[1px] h-9 bg-white/20"></div>
               <div className="flex-1 flex flex-col items-center">
                  <div className="flex items-center justify-center text-white font-extrabold text-[17px] font-['Montserrat'] tracking-wide">
                    {formatCurrency(balance).replace(' VNĐ', '')} 
                    <div className="w-4.5 h-4.5 bg-[#f9e9c3] rounded-full flex items-center justify-center ml-1.5 shadow-sm text-[#b48b3b]">
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-white/70 text-[11px] mt-0.5 font-['Plus_Jakarta_Sans'] font-medium">VND khả dụng</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Box / Verified Status */}
      {/* Warning Box / Verified Status */}
      <div className="px-4 mt-5">
        {(() => {
          if (isIdentityVerified) {
            return (
              <div 
                className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 flex gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] cursor-pointer hover:shadow-md transition-shadow duration-250"
                onClick={() => setActiveSubView('verification')}
              >
                <div className="mt-0.5 shrink-0 w-10 h-10 bg-[#e6f4ea] text-[#00875A] rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[15px] mb-1 font-['Montserrat'] tracking-tight text-[#00875A]">
                    Tài khoản đã xác minh
                  </h3>
                  <p className="text-[#334155] text-[12px] leading-relaxed font-['Plus_Jakarta_Sans'] font-medium">
                    Tài khoản của bạn đã được bảo mật và sẵn sàng cho các giao dịch.
                  </p>
                </div>
              </div>
            );
          }

          if (kycStatus === 'pending') {
            return (
              <div 
                className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 flex gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] cursor-pointer hover:shadow-md transition-shadow duration-250"
                onClick={() => setActiveSubView('verification')}
              >
                <div className="mt-0.5 shrink-0 w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[15px] mb-1 font-['Montserrat'] tracking-tight text-amber-600">
                    Đang chờ phê duyệt
                  </h3>
                  <p className="text-[#334155] text-[12px] leading-relaxed font-['Plus_Jakarta_Sans'] font-medium">
                    Hồ sơ xác thực của bạn đang được hệ thống phê duyệt. Vui lòng quay lại sau.
                  </p>
                </div>
              </div>
            );
          }

          if (kycStatus === 'rejected') {
            return (
              <div 
                className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-4 flex gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] cursor-pointer hover:shadow-md transition-shadow duration-250"
                onClick={() => setActiveSubView('verification')}
              >
                <div className="mt-0.5 shrink-0 w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[15px] mb-1 font-['Montserrat'] tracking-tight text-rose-600">
                    Xác thực bị từ chối
                  </h3>
                  <p className="text-[#334155] text-[12px] mb-2 leading-relaxed font-['Plus_Jakarta_Sans'] font-medium">
                    Lý do: {kycRejectReason || 'Thông tin không hợp lệ'}. Vui lòng xác thực lại.
                  </p>
                  <span className="text-rose-600 font-bold text-[13px] font-['Plus_Jakarta_Sans']">Xác thực lại</span>
                </div>
              </div>
            );
          }

          return (
            <div 
              className="bg-[#fff9e6] border border-[#ffe0b2] rounded-xl p-4 flex gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] cursor-pointer hover:shadow-md transition-shadow duration-250"
              onClick={() => setActiveSubView('verification')}
            >
              <div className="mt-0.5 shrink-0 w-10 h-10 bg-[#ffb74d] rounded-full flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[15px] mb-1 font-['Montserrat'] tracking-tight text-[#001839]">
                  Tài khoản chưa xác thực
                </h3>
                <p className="text-zinc-600 text-[12px] mb-2.5 leading-relaxed font-['Plus_Jakarta_Sans'] font-medium">
                  Vui lòng xác thực để nhận các đặc quyền và tài khoản được bảo mật tốt nhất.
                </p>
                <span className="text-[#b48b3b] font-bold text-[13px] font-['Plus_Jakarta_Sans']">Xác thực ngay</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Tiện ích Menu */}
      <div className="px-4 mt-6">
        <h3 className="text-[#191c1e] font-bold text-[18px] mb-3 font-['Montserrat'] tracking-tight">Tiện ích</h3>
        <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] overflow-hidden">
          <button onClick={() => handleMenuClick('profile_info')} className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-[#f2f4f6]">
             <div className="flex items-center gap-3">
               <User className="w-5 h-5 text-[#001839]" />
               <span className="text-[#191c1e] font-medium text-[15px] font-['Plus_Jakarta_Sans']">Thông tin hồ sơ</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          <button onClick={() => handleMenuClick('verification')} className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-[#f2f4f6]">
             <div className="flex items-center gap-3">
               <ShieldCheck className="w-5 h-5 text-[#001839]" />
               <span className="text-[#191c1e] font-medium text-[15px] font-['Plus_Jakarta_Sans']">Xác thực tài khoản</span>
             </div>
             <div className="flex items-center gap-1.5">
               <span className={`text-[12px] font-bold ${isIdentityVerified ? 'text-emerald-600' : kycStatus === 'pending' ? 'text-amber-500' : kycStatus === 'rejected' ? 'text-rose-500' : 'text-[#b48b3b]'}`}>
                 {isIdentityVerified ? 'Đã xác minh' : kycStatus === 'pending' ? 'Chờ duyệt' : kycStatus === 'rejected' ? 'Từ chối' : 'Chưa xác thực'}
               </span>
               <ChevronRight className="w-4 h-4 text-gray-400" />
             </div>
          </button>
          <button onClick={() => handleMenuClick('bank_link')} className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-[#f2f4f6]">
             <div className="flex items-center gap-3">
               <Landmark className="w-5 h-5 text-[#001839]" />
               <span className="text-[#191c1e] font-medium text-[15px] font-['Plus_Jakarta_Sans']">Liên kết ngân hàng</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          <button onClick={() => handleMenuClick('change_password')} className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-[#f2f4f6]">
             <div className="flex items-center gap-3">
               <Lock className="w-5 h-5 text-[#001839]" />
               <span className="text-[#191c1e] font-medium text-[15px] font-['Plus_Jakarta_Sans']">Thay đổi mật khẩu</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          <button onClick={() => handleMenuClick('change_withdrawal_password')} className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors">
             <div className="flex items-center gap-3">
               <KeyRound className="w-5 h-5 text-[#001839]" />
               <span className="text-[#191c1e] font-medium text-[15px] font-['Plus_Jakarta_Sans']">Thay đổi mật khẩu rút tiền</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Dành cho bạn Menu */}
      <div className="px-4 mt-6">
        <h3 className="text-[#191c1e] font-bold text-[18px] mb-3 font-['Montserrat'] tracking-tight">Dành cho bạn</h3>
        <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] overflow-hidden">
          <button onClick={() => handleMenuClick('deposit')} className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-[#f2f4f6]">
             <div className="flex items-center gap-3">
               <Download className="w-5 h-5 text-[#001839]" />
               <span className="text-[#191c1e] font-medium text-[15px] font-['Plus_Jakarta_Sans']">Gửi tiền</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          <button onClick={() => handleMenuClick('withdraw')} className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-[#f2f4f6]">
             <div className="flex items-center gap-3">
               <Upload className="w-5 h-5 text-[#001839]" />
               <span className="text-[#191c1e] font-medium text-[15px] font-['Plus_Jakarta_Sans']">Rút tiền</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          <button onClick={() => handleMenuClick('transaction_history')} className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-[#f2f4f6]">
             <div className="flex items-center gap-3">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#001839]"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
               <span className="text-[#191c1e] font-medium text-[15px] font-['Plus_Jakarta_Sans']">Lịch sử giao dịch</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          <button onClick={() => handleMenuClick('profit_history')} className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-[#f2f4f6]">
             <div className="flex items-center gap-3">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#001839]"><path d="M16 4h4v4"/><path d="M14 10l6-6"/><path d="M4 20h16"/><path d="M4 14l5-5 3 3 6-6"/></svg>
               <span className="text-[#191c1e] font-medium text-[15px] font-['Plus_Jakarta_Sans']">Lịch sử lợi nhuận</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          <button onClick={() => handleMenuClick('bonus_history')} className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors">
             <div className="flex items-center gap-3">
               <Gift className="w-5 h-5 text-[#001839]" />
               <span className="text-[#191c1e] font-medium text-[15px] font-['Plus_Jakarta_Sans']">Lịch sử tiền thưởng</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {isAdmin && (
        <div className="px-4 mt-6">
          <h3 className="text-[#191c1e] font-bold text-[18px] mb-3 font-['Montserrat'] tracking-tight">Quản trị</h3>
          <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] overflow-hidden">
             <button onClick={() => handleMenuClick('admin_console')} className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors">
               <div className="flex items-center gap-3">
                 <ShieldCheck className="w-5 h-5 text-amber-500" />
                 <span className="text-[#191c1e] font-medium text-[15px] font-['Plus_Jakarta_Sans']">Bảng Quản trị Admin</span>
               </div>
               <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="px-4 mt-8 mb-10">
        <button 
          onClick={() => logout()}
          className="w-full py-3.5 rounded-xl bg-white border border-[#e0e3e5] text-[#ba1a1a] font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm font-['Montserrat'] tracking-wide"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </div>

      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[250] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'success' ? 'bg-green-50 text-[#00875A] border-green-200' : 'bg-red-50 text-[#ba1a1a] border-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium font-['Plus_Jakarta_Sans']">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
