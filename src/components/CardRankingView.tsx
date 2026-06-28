import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useUser } from './UserContext';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Sparkles, Trophy, Award, Shield, Check, ArrowLeft } from 'lucide-react';

interface CardRankingViewProps {
  onBack: () => void;
}

export default function CardRankingView({ onBack }: CardRankingViewProps) {
  const { displayName, phoneNumber, transactions, userId } = useUser();
  const [pointsData, setPointsData] = useState({
    current_points: 650,
    next_tier_points: 1000,
    next_tier_name: 'GOLD'
  });

  // Fetch real-time points from Firestore
  useEffect(() => {
    if (!userId) return;
    const userDocRef = doc(db, 'users', userId);
    const unsub = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setPointsData({
          current_points: data.current_points !== undefined ? Number(data.current_points) : 650,
          next_tier_points: data.next_tier_points !== undefined ? Number(data.next_tier_points) : 1000,
          next_tier_name: data.next_tier_name || 'GOLD'
        });
      }
    });
    return () => unsub();
  }, [userId]);

  // Calculate user tier based on total deposits (to align with UserContext & Profile tier calculation)
  const totalDeposit = transactions
    .filter(t => t.type === 'deposit' && t.status === 'Thành công')
    .reduce((sum, t) => sum + t.amount, 0);

  let currentTier: 'Member' | 'Gold' | 'VIP' | 'VVIP' = 'Member';
  if (totalDeposit >= 10000000000) {
    currentTier = 'VVIP';
  } else if (totalDeposit >= 5000000000) {
    currentTier = 'VIP';
  } else if (totalDeposit >= 1000000000) {
    currentTier = 'Gold';
  }

  // Card color configurations based on tier
  const cardConfigs = {
    Member: {
      bg: "bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950",
      border: "border-zinc-700/50 shadow-[0_10px_30px_rgba(0,0,0,0.4)]",
      text: "text-zinc-350",
      accent: "text-zinc-400",
      glow: "rgba(255,255,255,0.05)",
      label: "MEMBER",
      bgImage: "https://statics.vinpearl.com/vinclub-member_1723049424.png"
    },
    Gold: {
      bg: "bg-gradient-to-br from-[#f5d061] via-[#c29b57] to-[#8c6b30]",
      border: "border-[#f9e5b9]/40 shadow-[0_10px_35px_rgba(194,155,87,0.35)]",
      text: "text-amber-100",
      accent: "text-[#ebd5ad]",
      glow: "rgba(194,155,87,0.2)",
      label: "GOLD",
      bgImage: "https://storage.googleapis.com/loyalty-public-arczn36dnada/240807164237_previous_photo_card_24fedc53-f059-407e-ac30-e3f7baf0fca7.jpg"
    },
    VIP: {
      bg: "bg-gradient-to-br from-[#e65c00] via-[#c25000] to-[#1a0f00]",
      border: "border-[#ffbe94]/40 shadow-[0_10px_35px_rgba(230,92,0,0.35)]",
      text: "text-orange-100",
      accent: "text-[#ffbe94]",
      glow: "rgba(230,92,0,0.2)",
      label: "VIP",
      bgImage: "https://storage.googleapis.com/loyalty-public-arczn36dnada/240807164461_previous_photo_card_c546ea67-12e3-445d-ad25-b91c8d600830.jpg"
    },
    VVIP: {
      bg: "bg-gradient-to-br from-[#27272a] via-[#09090b] to-[#18181b]",
      border: "border-zinc-800 shadow-[0_10px_40px_rgba(0,0,0,0.6)]",
      text: "text-[#ebd5ad]",
      accent: "text-[#c29b57]",
      glow: "rgba(194,155,87,0.15)",
      label: "VVIP",
      bgImage: "https://storage.googleapis.com/loyalty-public-arczn36dnada/240807164519_previous_photo_card_efd6a076-7d73-46e2-ac0c-713d2dca20f7.jpg"
    }
  };

  const config = cardConfigs[currentTier];

  const maskCardNumber = (phone: string) => {
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '8888';
    const last4 = cleanPhone.slice(-4).padEnd(4, '8');
    return `VC •••• •••• ${last4}`;
  };

  const progressPercent = Math.min(100, Math.max(0, (pointsData.current_points / pointsData.next_tier_points) * 100));

  return (
    <div className="bg-[#f7f9fb] h-full overflow-y-auto pb-36 font-['Plus_Jakarta_Sans'] text-[#191c1e] select-none">
      {/* TopAppBar */}
      <header className="sticky top-0 z-40 bg-white w-full shadow-sm border-b border-slate-100">
        <div className="flex justify-between items-center px-4 py-4 w-full">
          <button 
            onClick={onBack}
            className="text-[#001839] hover:bg-gray-100 transition-colors rounded-full p-2 flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-['Montserrat'] text-[18px] sm:text-[20px] font-bold text-[#001839]">
            Thẻ Thành Viên VinClub
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
        
        {/* Dynamic User Card Section */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[13px] font-extrabold uppercase tracking-widest text-[#5c6066]">Thẻ của bạn</h2>
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className={`relative w-full aspect-[1.58/1] rounded-2xl overflow-hidden ${config.border}`}
            style={{ boxShadow: `0 15px 35px -5px ${config.glow}` }}
          >
            {/* Background Card Image */}
            <img 
              src={config.bgImage} 
              alt={currentTier} 
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            />
            {/* Premium overlays */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/10 to-white/10 pointer-events-none"></div>
            
            {/* Card Content Overlay */}
            <div className="absolute inset-0 p-5 flex flex-col justify-between z-10 text-white">
              
              {/* Top Row: Chip and Logo */}
              <div className="flex justify-between items-start">
                {/* Chip */}
                <div className="w-9 h-6.5 bg-gradient-to-r from-amber-200/90 via-yellow-400/80 to-amber-300/90 rounded-md border border-white/20 relative shadow-inner overflow-hidden">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-black/15"></div>
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-black/15"></div>
                  <div className="absolute w-3.5 h-3.5 rounded-full border border-black/10 top-1.5 left-2.5"></div>
                </div>
                
                {/* Logo */}
                <div className="flex flex-col items-end">
                  <span className="font-['Montserrat'] text-[13px] font-black tracking-[3px] text-white/95">VINCLUB</span>
                  <span className="text-[7px] font-medium tracking-[2.5px] text-white/70 -mt-0.5 uppercase">VIP Elite</span>
                </div>
              </div>

              {/* Center Row: Tier Text */}
              <div className="flex flex-col">
                <span className={`font-['Montserrat'] text-[22px] sm:text-[25px] font-black tracking-[4px] uppercase drop-shadow-md text-white`}>
                  {config.label}
                </span>
              </div>

              {/* Bottom Row: Holder and Number */}
              <div className="flex justify-between items-end">
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-[8px] text-white/50 font-bold tracking-wider uppercase font-['Plus_Jakarta_Sans']">Chủ thẻ</span>
                  <span className="text-[12px] sm:text-[14px] font-extrabold text-white tracking-widest font-['Montserrat'] truncate uppercase">
                    {displayName || 'KHÁCH HÀNG VINCLUB'}
                  </span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[11px] sm:text-[12px] font-mono text-white/90 tracking-widest font-bold">
                    {maskCardNumber(phoneNumber)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Dynamic Progress Section */}
        <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#c29b57]" />
              <span className="text-sm font-bold text-[#001839]">Cột mốc tích lũy</span>
            </div>
            <span className="text-xs font-black text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
              {pointsData.current_points} PTS
            </span>
          </div>

          {currentTier === 'VVIP' ? (
            <div className="space-y-1">
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-zinc-700 to-black h-full rounded-full w-full"></div>
              </div>
              <p className="text-[11px] font-semibold text-zinc-500 mt-1">
                ⭐ Bạn đã đạt thứ hạng cao nhất **VVIP**
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#d4a373] to-[#b48b3b] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-zinc-500">
                <span>Tiến trình: {progressPercent.toFixed(0)}%</span>
                <span>Hạng kế tiếp: **{pointsData.next_tier_name}** ({pointsData.next_tier_points} PTS)</span>
              </div>
              <p className="text-[11.5px] font-medium text-[#334155] border-t border-slate-50 pt-2.5 mt-1.5 leading-relaxed">
                👉 Cần thêm <strong className="text-[#b48b3b]">{pointsData.next_tier_points - pointsData.current_points} điểm</strong> tích lũy để tự động nâng hạng thẻ lên <strong className="text-[#b48b3b]">{pointsData.next_tier_name}</strong>.
              </p>
            </div>
          )}
        </section>

        {/* Highlighted Benefits of Current Tier */}
        <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[#b48b3b]" />
            <h3 className="text-sm font-bold text-[#001839]">Đặc quyền hạng {config.label} của bạn</h3>
          </div>
          
          <div className="space-y-3.5 text-[12.5px] text-[#334155] font-medium leading-relaxed">
            {currentTier === 'Member' && (
              <>
                <div className="flex gap-2.5 items-start">
                  <span className="text-emerald-650 font-bold mt-0.5">✓</span>
                  <p><strong>Y tế Vinmec:</strong> Giảm 30% chi phí khám chữa bệnh tại hệ thống Y tế Vinmec.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-emerald-650 font-bold mt-0.5">✓</span>
                  <p><strong>Đặc quyền đầu tư:</strong> Được quyền tham gia các gói đầu tư sinh lời trong hệ sinh thái.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-emerald-650 font-bold mt-0.5">✓</span>
                  <p><strong>Tích lũy 0.5% – 1%:</strong> Cơ chế hoàn điểm khi phát sinh giao dịch trong hệ sinh thái.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-emerald-650 font-bold mt-0.5">✓</span>
                  <p><strong>Lãi số dư 0.6%:</strong> Tự động cộng 0.6% lãi suất trên tổng số dư tiền mặt lúc 08:00 AM hàng ngày (khi không đầu tư).</p>
                </div>
              </>
            )}
            {currentTier === 'Gold' && (
              <>
                <div className="flex gap-2.5 items-start">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <p><strong>Y tế Vinmec & Vinpearl:</strong> Giảm 30% tại Vinmec và giảm 30% chi phí mua nhà thuộc hệ sinh thái Vinpearl.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <p><strong>Tích lũy tăng cường (1.5% – 3%):</strong> Tỷ lệ tích lũy cao hơn khi phát sinh giao dịch.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <p><strong>Lãi tự động 1.0%:</strong> Tự động cộng lãi suất 1.0%/ngày vào 08:00 AM hàng ngày tính trên tổng tài sản khả dụng + đầu tư.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <p><strong>Fast-track quầy giao dịch:</strong> Được ưu tiên phục vụ tại quầy dịch vụ và hotline.</p>
                </div>
              </>
            )}
            {currentTier === 'VIP' && (
              <>
                <div className="flex gap-2.5 items-start">
                  <span className="text-orange-600 font-bold mt-0.5">✓</span>
                  <p><strong>An sinh & Giáo dục:</strong> Giảm 30% tại Vinmec, Vinpearl BĐS và giảm 30% học phí Vinschool.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-orange-600 font-bold mt-0.5">✓</span>
                  <p><strong>Tích lũy tăng tốc (3.5% – 5%):</strong> Nhận nhiều điểm tích lũy hơn khi chi tiêu.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-orange-600 font-bold mt-0.5">✓</span>
                  <p><strong>Lãi tự động vượt trội 1.5%:</strong> Cộng lãi 1.5%/ngày lúc 08:00 AM hàng ngày trên tổng số dư khả dụng + đang đầu tư.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-orange-600 font-bold mt-0.5">✓</span>
                  <p><strong>VIP Lane & Private Event:</strong> Lối đi ưu tiên riêng biệt tại các khu đón tiếp và vé mời sự kiện giới hạn.</p>
                </div>
              </>
            )}
            {currentTier === 'VVIP' && (
              <>
                <div className="flex gap-2.5 items-start">
                  <span className="text-zinc-850 font-bold mt-0.5">✓</span>
                  <p><strong>Đặc quyền Giáo dục Đẳng cấp:</strong> Tuyển sinh ưu tiên và ưu đãi lộ trình học tại Vinschool & VinUni.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-zinc-850 font-bold mt-0.5">✓</span>
                  <p><strong>Tích lũy tối cao (5.5% – 7%):</strong> Tỷ lệ tích điểm cao nhất toàn hệ thống VinClub.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-zinc-850 font-bold mt-0.5">✓</span>
                  <p><strong>Lãi số dư tối đa 2.0%:</strong> Cộng 2% tiền mặt vào tài khoản lúc 08:00 AM hàng ngày trên tổng toàn bộ số dư và đầu tư.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="text-zinc-850 font-bold mt-0.5">✓</span>
                  <p><strong>Trợ lý cấp cao 24/7:</strong> Có trợ lý riêng phục vụ giao dịch và sở hữu hàng ghế đầu VVIP tại các sự kiện quốc tế.</p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Listing All Tiers Section */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[13px] font-extrabold uppercase tracking-widest text-[#5c6066]">Tất cả hạng thẻ</h2>
          
          {/* Tier Card: Member */}
          <motion.article 
            className={`bg-white rounded-xl border p-5 flex flex-col items-center text-center w-full relative transition-all ${
              currentTier === 'Member' ? 'border-[#c29b57] ring-1 ring-[#c29b57]/20 shadow-md' : 'border-slate-200'
            }`}
          >
            {currentTier === 'Member' && (
              <span className="absolute top-3 right-3 bg-gradient-to-r from-[#d4a373] to-[#b48b3b] text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Check className="w-2.5 h-2.5" /> Hạng Hiện Tại
              </span>
            )}
            <div className="w-3/5 max-w-[200px] aspect-[1.58/1] mb-3 rounded-lg overflow-hidden relative shadow-sm border border-slate-100">
              <img 
                alt="Member"
                className="w-full h-full object-cover" 
                src="https://statics.vinpearl.com/vinclub-member_1723049424.png"
              />
            </div>
            <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#001839]">Member</h3>
            <p className="text-[11.5px] text-slate-500 mb-3.5">Đăng ký tài khoản miễn phí</p>
            
            <div className="w-full text-left border-t border-slate-100 pt-3 space-y-2 text-[12px] text-[#475569] font-['Plus_Jakarta_Sans']">
              <div className="flex gap-2">
                <span className="text-emerald-650 font-bold">✓</span>
                <p><strong>Y tế Vinmec:</strong> Giảm 30% tại hệ thống Y tế Vinmec.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-emerald-650 font-bold">✓</span>
                <p><strong>Lãi suất tự động:</strong> Tự động cộng 0.6% lãi suất lúc 08:00 AM hàng ngày.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-emerald-650 font-bold">✓</span>
                <p><strong>Voucher gia nhập:</strong> Nhận ngay Voucher 50.000 VNĐ sau khi kích hoạt tài khoản.</p>
              </div>
            </div>
          </motion.article>

          {/* Tier Card: Gold */}
          <motion.article 
            className={`bg-white rounded-xl border p-5 flex flex-col items-center text-center w-full relative transition-all ${
              currentTier === 'Gold' ? 'border-[#c29b57] ring-1 ring-[#c29b57]/20 shadow-md' : 'border-slate-200'
            }`}
          >
            {currentTier === 'Gold' && (
              <span className="absolute top-3 right-3 bg-gradient-to-r from-[#d4a373] to-[#b48b3b] text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Check className="w-2.5 h-2.5" /> Hạng Hiện Tại
              </span>
            )}
            <div className="w-3/5 max-w-[200px] aspect-[1.58/1] mb-3 rounded-lg overflow-hidden relative shadow-sm border border-slate-100">
              <img 
                alt="Gold"
                className="w-full h-full object-cover" 
                src="https://storage.googleapis.com/loyalty-public-arczn36dnada/240807164237_previous_photo_card_24fedc53-f059-407e-ac30-e3f7baf0fca7.jpg"
              />
            </div>
            <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#001839]">Gold</h3>
            <p className="text-[11.5px] text-slate-500 mb-3.5">Từ 1 tỷ VND trở lên</p>
            
            <div className="w-full text-left border-t border-slate-100 pt-3 space-y-2 text-[12px] text-[#475569] font-['Plus_Jakarta_Sans']">
              <div className="flex gap-2">
                <span className="text-amber-600 font-bold">✓</span>
                <p><strong>Y tế & Nghỉ dưỡng:</strong> Giảm 30% tại Vinmec và BĐS Vinpearl.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-amber-600 font-bold">✓</span>
                <p><strong>Lãi suất tự động:</strong> Tự động cộng 1.0% lãi suất lúc 08:00 AM hàng ngày.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-amber-600 font-bold">✓</span>
                <p><strong>Điểm tích lũy:</strong> Tăng tỷ lệ tích lũy lên 1.5% – 3% giao dịch.</p>
              </div>
            </div>
          </motion.article>

          {/* Tier Card: VIP */}
          <motion.article 
            className={`bg-white rounded-xl border p-5 flex flex-col items-center text-center w-full relative transition-all ${
              currentTier === 'VIP' ? 'border-[#c29b57] ring-1 ring-[#c29b57]/20 shadow-md' : 'border-slate-200'
            }`}
          >
            {currentTier === 'VIP' && (
              <span className="absolute top-3 right-3 bg-gradient-to-r from-[#d4a373] to-[#b48b3b] text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Check className="w-2.5 h-2.5" /> Hạng Hiện Tại
              </span>
            )}
            <div className="w-3/5 max-w-[200px] aspect-[1.58/1] mb-3 rounded-lg overflow-hidden relative shadow-sm border border-slate-100">
              <img 
                alt="VIP"
                className="w-full h-full object-cover" 
                src="https://storage.googleapis.com/loyalty-public-arczn36dnada/240807164461_previous_photo_card_c546ea67-12e3-445d-ad25-b91c8d600830.jpg"
              />
            </div>
            <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#001839]">VIP</h3>
            <p className="text-[11.5px] text-slate-500 mb-3.5">Từ 5 tỷ VND trở lên</p>
            
            <div className="w-full text-left border-t border-slate-100 pt-3 space-y-2 text-[12px] text-[#475569] font-['Plus_Jakarta_Sans']">
              <div className="flex gap-2">
                <span className="text-[#e65c00] font-bold">✓</span>
                <p><strong>Đặc quyền An sinh & BĐS:</strong> Giảm 30% Vinmec, Vinpearl, Vinschool.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#e65c00] font-bold">✓</span>
                <p><strong>Lãi suất tự động:</strong> Tự động cộng 1.5% lãi suất lúc 08:00 AM hàng ngày.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#e65c00] font-bold">✓</span>
                <p><strong>Trải nghiệm biệt lập:</strong> VIP Lane ưu tiên, sự kiện giới hạn.</p>
              </div>
            </div>
          </motion.article>

          {/* Tier Card: VVIP */}
          <motion.article 
            className={`bg-[#fdfdfd] rounded-xl border p-5 flex flex-col items-center text-center w-full relative transition-all ${
              currentTier === 'VVIP' ? 'border-[#c29b57] ring-1 ring-[#c29b57]/20 shadow-md' : 'border-slate-200'
            }`}
          >
            {currentTier === 'VVIP' && (
              <span className="absolute top-3 right-3 bg-gradient-to-r from-[#d4a373] to-[#b48b3b] text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Check className="w-2.5 h-2.5" /> Hạng Hiện Tại
              </span>
            )}
            <div className="w-3/5 max-w-[200px] aspect-[1.58/1] mb-3 rounded-lg overflow-hidden relative shadow-sm border border-slate-100">
              <img 
                alt="VVIP"
                className="w-full h-full object-cover" 
                src="https://storage.googleapis.com/loyalty-public-arczn36dnada/240807164519_previous_photo_card_efd6a076-7d73-46e2-ac0c-713d2dca20f7.jpg"
              />
            </div>
            <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#001839]">VVIP</h3>
            <p className="text-[11.5px] text-slate-500 mb-3.5">Từ 10 tỷ VND trở lên</p>
            
            <div className="w-full text-left border-t border-slate-100 pt-3 space-y-2 text-[12px] text-[#475569] font-['Plus_Jakarta_Sans']">
              <div className="flex gap-2">
                <span className="text-zinc-800 font-bold">✓</span>
                <p><strong>Tuyển sinh Vinschool & VinUni:</strong> Tuyển sinh ưu tiên và đặc quyền học tập.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-zinc-800 font-bold">✓</span>
                <p><strong>Lãi suất tự động tối đa:</strong> Tự động cộng 2.0% lãi suất lúc 08:00 AM hàng ngày.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-zinc-800 font-bold">✓</span>
                <p><strong>Phục vụ cá nhân hóa:</strong> Trợ lý Senior Assistant hỗ trợ riêng 24/7.</p>
              </div>
            </div>
          </motion.article>

        </section>

      </main>
    </div>
  );
}
