import React from 'react';
import { 
  ArrowLeft, Waves, SquareActivity, GraduationCap, ShoppingBag, ChevronRight, Sparkles, CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useUser } from './UserContext';

import welfareVinpearl from '../assets/images/welfare/vinpearl.jpg';
import welfareVinhomes from '../assets/images/welfare/vinhomes.jpg';
import welfareDiamondCheckup from '../assets/images/welfare/diamond-checkup.jpg';
import bannerFeatured from '../assets/images/welfare/banner-featured.jpg';
import bannerMedical from '../assets/images/welfare/banner-medical.jpg';
import bannerShopping from '../assets/images/welfare/banner-shopping.jpg';

interface WelfareConsultationViewProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export default function WelfareConsultationView({ onBack, onNavigate }: WelfareConsultationViewProps) {
  const { displayName, transactions, balance, isIdentityVerified } = useUser();
  return (
    <div className="flex-1 flex flex-col bg-[#f7f9fb] h-full relative text-[#001839] overflow-y-auto pb-24 scrollbar-hide">
      {/* Header Sticky */}
      <div className="sticky top-0 z-50 bg-[#f7f9fb]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="w-10 h-10 -ml-2 flex items-center justify-center text-[#001839] rounded-full hover:bg-black/5 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold font-['Montserrat'] tracking-tight text-[#001839]">Ưu đãi phúc lợi</h1>
        <div className="w-10 h-10 -mr-2"></div>
      </div>

      <div className="px-4 py-2 space-y-8">
        
        {/* VIP Card */}
        {(() => {
          const totalDeposit = (transactions || [])
            .filter(t => t.type === 'deposit' && t.status === 'Thành công')
            .reduce((sum, t) => sum + t.amount, 0);

          let userTier = 'Member';
          let tierCardBg = 'bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#475569]';
          let tierTitle = 'MEMBER';
          let vipCardColor = 'border-[#475569]/30';

          if (totalDeposit >= 10000000000) {
            userTier = 'VVIP';
            tierCardBg = 'bg-gradient-to-br from-[#121214] via-[#27272a] to-[#09090b]';
            tierTitle = 'VVIP TINH HOA';
            vipCardColor = 'border-zinc-800/40 shadow-zinc-900/30';
          } else if (totalDeposit >= 5000000000) {
            userTier = 'VIP';
            tierCardBg = 'bg-gradient-to-br from-[#1a0505] via-[#4a0e0e] to-[#120202]';
            tierTitle = 'VIP MEMBER';
            vipCardColor = 'border-rose-950/40';
          } else if (totalDeposit >= 1000000000) {
            userTier = 'Gold';
            tierCardBg = 'bg-gradient-to-br from-[#dfbc80] via-[#c29b57] to-[#8c6221]';
            tierTitle = 'GOLD VIP';
            vipCardColor = 'border-[#ebd5ad]/30';
          }

          const vPoints = Math.floor((balance || 0) / 10000);
          const vouchersCount = isIdentityVerified ? 16 : 15;
          const memberCode = `VC-${(displayName || 'USER').slice(0,4).toUpperCase()}-${Math.floor((totalDeposit + balance) % 9000 + 1000)}`;

          return (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative rounded-3xl p-6 overflow-hidden shadow-xl border ${vipCardColor} ${tierCardBg}`}
              >
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-[shimmer_3s_infinite] pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <p className="text-white/70 text-[10px] font-bold tracking-widest uppercase mb-1 font-['Plus_Jakarta_Sans']">Thẻ hội viên</p>
                    <h2 className="text-white text-2xl font-black font-['Montserrat'] tracking-tight drop-shadow-sm">{tierTitle}</h2>
                  </div>
                  <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner">
                    <span className="font-extrabold italic text-white text-sm pr-0.5 font-mono">V</span>
                  </div>
                </div>

                <div className="mb-8 relative z-10">
                  <p className="text-white/50 text-[9px] uppercase tracking-widest font-black font-['Plus_Jakarta_Sans'] mb-0.5">Mã số hội viên</p>
                  <p className="font-mono text-sm tracking-widest font-bold text-white/95">{memberCode}</p>
                </div>

                <div className="flex justify-between items-end relative z-10 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-white/60 text-[9px] font-bold tracking-widest uppercase mb-0.5 font-['Plus_Jakarta_Sans']">Hội viên</p>
                    <p className="text-white text-sm font-bold font-['Plus_Jakarta_Sans']">{displayName || 'Hội viên'}</p>
                  </div>
                  <div className="text-right flex gap-6">
                    <div>
                      <p className="text-white/60 text-[9px] font-bold tracking-widest uppercase mb-0.5 font-['Plus_Jakarta_Sans']">Tích lũy</p>
                      <p className="text-white text-[15px] font-bold font-['Montserrat']">{vPoints} <span className="text-[10px] font-medium text-white/70">pts</span></p>
                    </div>
                    <div>
                      <p className="text-white/60 text-[9px] font-bold tracking-widest uppercase mb-0.5 font-['Plus_Jakarta_Sans']">Voucher</p>
                      <p className="text-white text-[15px] font-bold font-['Montserrat']">{vouchersCount} <span className="text-[10px] font-medium text-white/70">có sẵn</span></p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Current Tier Privileges Info Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white rounded-2xl p-4 border border-[#e0e3e5] shadow-xs flex flex-col gap-3 font-['Plus_Jakarta_Sans']"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[13px] font-bold text-[#001839] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#b8860b]" /> Đặc quyền hạng {userTier} hiện tại của bạn
                  </span>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-600">Đang hoạt động</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-[12px] text-[#334155]">
                  <div className="flex items-start gap-1.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Lãi số dư tự động</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {userTier === 'VVIP' ? '2.0% / ngày' :
                         userTier === 'VIP' ? '1.5% / ngày' :
                         userTier === 'Gold' ? '1.0% / ngày' :
                         '0.6% / ngày (không đầu tư)'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Ưu đãi Y tế Vinmec</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Giảm 30% chi phí</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Tích điểm giao dịch</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {userTier === 'VVIP' ? '5.5% – 7.0%' :
                         userTier === 'VIP' ? '3.5% – 5.0%' :
                         userTier === 'Gold' ? '1.5% – 3.0%' :
                         '0.5% – 1.0%'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Hỗ trợ trải nghiệm</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {userTier === 'VVIP' ? 'Trợ lý riêng VVIP 24/7' :
                         userTier === 'VIP' ? 'Chuyên viên VIP riêng' :
                         userTier === 'Gold' ? 'Ưu tiên Fast-track' :
                         'Standard CSKH'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          );
        })()}

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-[22px] font-semibold text-[#001839] mb-4 font-['Montserrat'] tracking-tight">Danh mục</h3>
          <div className="grid grid-cols-4 gap-3">
            <button 
              onClick={() => onNavigate && onNavigate('welfare_resort')}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-[#e0e3e5] shadow-sm group-hover:border-[#b8860b] group-hover:shadow-md transition-all">
                <Waves className="w-6 h-6 text-[#001839]" />
              </div>
              <span className="text-[12px] text-[#334155] font-medium font-['Plus_Jakarta_Sans']">Nghỉ dưỡng</span>
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('welfare_medical')}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-[#e0e3e5] shadow-sm group-hover:border-[#b8860b] group-hover:shadow-md transition-all">
                <SquareActivity className="w-6 h-6 text-[#001839]" />
              </div>
              <span className="text-[12px] text-[#334155] font-medium font-['Plus_Jakarta_Sans']">Y tế</span>
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('welfare_education')}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-[#e0e3e5] shadow-sm group-hover:border-[#b8860b] group-hover:shadow-md transition-all">
                <GraduationCap className="w-6 h-6 text-[#001839]" />
              </div>
              <span className="text-[12px] text-[#334155] font-medium font-['Plus_Jakarta_Sans']">Giáo dục</span>
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('welfare_shopping')}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-[#e0e3e5] shadow-sm group-hover:border-[#b8860b] group-hover:shadow-md transition-all">
                <ShoppingBag className="w-6 h-6 text-[#001839]" />
              </div>
              <span className="text-[12px] text-[#334155] font-medium font-['Plus_Jakarta_Sans']">Mua sắm</span>
            </button>
          </div>
        </motion.div>

        {/* Featured Privileges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative h-28 rounded-2xl overflow-hidden mb-6 shadow-sm border border-[#e0e3e5] group">
            <img src={bannerFeatured} alt="Đặc quyền tiêu biểu" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#001839]/80 via-[#001839]/40 to-transparent"></div>
            <div className="absolute inset-y-0 left-5 flex items-center">
              <h3 className="text-[22px] font-bold text-white font-['Montserrat'] tracking-tight drop-shadow-md">Đặc quyền tiêu biểu</h3>
            </div>
            <button 
              onClick={() => onNavigate && onNavigate('welfare_resort')}
              className="absolute right-4 bottom-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] px-3.5 py-1.5 rounded-full font-bold font-['Plus_Jakarta_Sans'] hover:bg-white/35 transition-colors flex items-center gap-1 shadow-sm uppercase tracking-wider cursor-pointer"
            >
              Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Item 1 */}
            <div className="bg-white rounded-xl border border-[#e0e3e5] overflow-hidden flex shadow-sm hover:shadow-md transition-shadow">
              <div className="w-32 h-32 shrink-0 bg-gray-200">
                <img src={welfareVinpearl} alt="Vinpearl" className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex flex-col justify-between flex-1">
                <div>
                  <span className="inline-block px-1.5 py-0.5 bg-[#f2eaeb] text-[#8c6767] text-[10px] font-bold tracking-wider rounded uppercase mb-1">VINPEARL</span>
                  <h4 className="font-semibold text-[#001839] text-[14px] leading-tight font-['Plus_Jakarta_Sans']">Ưu đãi 30% khi đặt phòng toàn quốc</h4>
                </div>
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={() => onNavigate && onNavigate('welfare_resort')}
                    className="bg-[#eef4ff] text-[#b8860b] px-4 py-1.5 rounded text-sm font-semibold font-['Plus_Jakarta_Sans'] hover:bg-[#d7e3ff] transition-colors"
                  >
                    Sử dụng
                  </button>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="bg-white rounded-xl border border-[#e0e3e5] overflow-hidden flex shadow-sm hover:shadow-md transition-shadow">
              <div className="w-32 h-32 shrink-0 bg-gray-200">
                <img src="https://upload.urbox.vn/strapi/Gallery_Vinmec_1_6ec1560ff5.jpg" alt="Vinmec" className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex flex-col justify-between flex-1">
                <div>
                  <span className="inline-block px-1.5 py-0.5 bg-[#eef4ff] text-[#b8860b] text-[10px] font-bold tracking-wider rounded uppercase mb-1">VINMEC</span>
                  <h4 className="font-semibold text-[#001839] text-[14px] leading-tight font-['Plus_Jakarta_Sans']">Gói khám sức khỏe tổng quát đặc quyền</h4>
                </div>
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={() => onNavigate && onNavigate('welfare_medical')}
                    className="bg-[#eef4ff] text-[#b8860b] px-4 py-1.5 rounded text-sm font-semibold font-['Plus_Jakarta_Sans'] hover:bg-[#d7e3ff] transition-colors"
                  >
                    Sử dụng
                  </button>
                </div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="bg-white rounded-xl border border-[#e0e3e5] overflow-hidden flex shadow-sm hover:shadow-md transition-shadow">
              <div className="w-32 h-32 shrink-0 bg-gray-200">
                <img src={welfareVinhomes} alt="Vinhomes" className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex flex-col justify-between flex-1">
                <div>
                  <span className="inline-block px-1.5 py-0.5 bg-[#eef4ff] text-[#b8860b] text-[10px] font-bold tracking-wider rounded uppercase mb-1">VINHOMES</span>
                  <h4 className="font-semibold text-[#001839] text-[14px] leading-tight font-['Plus_Jakarta_Sans']">Ưu đãi 30% khi mua căn hộ và các sản phẩm BĐS</h4>
                </div>
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={() => onNavigate && onNavigate('welfare_vinhomes')}
                    className="bg-[#eef4ff] text-[#b8860b] px-4 py-1.5 rounded text-sm font-semibold font-['Plus_Jakarta_Sans'] hover:bg-[#d7e3ff] transition-colors"
                  >
                    Sử dụng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ưu đãi Y tế Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <div className="relative h-28 rounded-2xl overflow-hidden mb-6 shadow-sm border border-[#e0e3e5] group">
            <img src={bannerMedical} alt="Ưu đãi Y tế" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#001839]/80 via-[#001839]/40 to-transparent"></div>
            <div className="absolute inset-y-0 left-5 flex items-center">
              <h3 className="text-[22px] font-bold text-white font-['Montserrat'] tracking-tight drop-shadow-md">Ưu đãi Y tế</h3>
            </div>
            <button 
              onClick={() => onNavigate && onNavigate('welfare_medical')}
              className="absolute right-4 bottom-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] px-3.5 py-1.5 rounded-full font-bold font-['Plus_Jakarta_Sans'] hover:bg-white/35 transition-colors flex items-center gap-1 shadow-sm uppercase tracking-wider cursor-pointer"
            >
              Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-[#ebd5ad] overflow-hidden shadow-sm flex flex-col relative group cursor-pointer hover:shadow-md transition-all">
              <div className="h-28 relative flex items-center justify-center border-b border-[#ebd5ad]/20 overflow-hidden">
                <img src={welfareDiamondCheckup} alt="Gói Diamond" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-black/10"></div>
                <img src="https://vinmec.com/static/images/logo_vinmec.png" alt="Vinmec" className="h-8 object-contain z-10 brightness-0 invert" onError={(e) => { e.currentTarget.src = ''; e.currentTarget.className = 'hidden'; }} />
                <SquareActivity className="w-8 h-8 text-white absolute -right-1 -bottom-1 opacity-40 z-10" />
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-[#dfa135] uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">Gói Diamond</p>
                  <h4 className="text-[13px] font-semibold text-[#001839] leading-tight font-['Plus_Jakarta_Sans'] line-clamp-2">Khám sức khỏe tổng quát toàn diện</h4>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 line-through">40,000,000đ</span>
                  <span className="text-[14px] font-bold text-[#dfa135]">Miễn phí</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e0e3e5] overflow-hidden shadow-sm flex flex-col relative group cursor-pointer hover:shadow-md transition-all">
              <div className="h-28 relative flex items-center justify-center border-b border-[#e0e3e5] overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600" alt="Nha khoa" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                 <div className="absolute inset-0 bg-black/10"></div>
                 <img src="https://vinmec.com/static/images/logo_vinmec.png" alt="Vinmec" className="h-8 object-contain z-10 brightness-0 invert" onError={(e) => { e.currentTarget.src = ''; e.currentTarget.className = 'hidden'; }} />
                 <span className="absolute top-2 left-2 bg-[#b8860b] text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase z-10 shadow-sm">-30%</span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-[#b8860b] uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">Nha khoa</p>
                  <h4 className="text-[13px] font-semibold text-[#001839] leading-tight font-['Plus_Jakarta_Sans'] line-clamp-2">Thẩm mỹ nha khoa cao cấp</h4>
                </div>
                <div className="mt-3">
                  <span className="text-[11px] text-gray-500">Giảm trực tiếp</span>
                  <span className="text-[14px] font-bold text-[#001839] block">30% phí dịch vụ</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ưu đãi Mua sắm Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 mb-4"
        >
          <div className="relative h-28 rounded-2xl overflow-hidden mb-6 shadow-sm border border-[#e0e3e5] group">
            <img src={bannerShopping} alt="Ưu đãi Mua sắm" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#001839]/80 via-[#001839]/40 to-transparent"></div>
            <div className="absolute inset-y-0 left-5 flex items-center">
              <h3 className="text-[22px] font-bold text-white font-['Montserrat'] tracking-tight drop-shadow-md">Ưu đãi Mua sắm</h3>
            </div>
            <button 
              onClick={() => onNavigate && onNavigate('welfare_shopping')}
              className="absolute right-4 bottom-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] px-3.5 py-1.5 rounded-full font-bold font-['Plus_Jakarta_Sans'] hover:bg-white/35 transition-colors flex items-center gap-1 shadow-sm uppercase tracking-wider cursor-pointer"
            >
              Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-[#ebd5ad] overflow-hidden shadow-sm flex flex-col relative group cursor-pointer hover:shadow-md transition-all">
              <div className="h-28 relative flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600" alt="VinWonders" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/25"></div>
                <ShoppingBag className="w-10 h-10 text-white relative z-10 drop-shadow-md" />
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-[#dfa135] uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">VinWonders</p>
                  <h4 className="text-[13px] font-semibold text-[#001839] leading-tight font-['Plus_Jakarta_Sans'] line-clamp-2">Combo Mua sắm & Ẩm thực</h4>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[#001839]">Voucher</span>
                  <span className="text-[14px] font-bold text-[#dfa135]">5.000.000đ</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e0e3e5] overflow-hidden shadow-sm flex flex-col relative group cursor-pointer hover:shadow-md transition-all">
              <div className="h-28 relative flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600" alt="Phụ kiện VinFast" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm relative z-10 border border-white/20">
                  <span className="text-white font-black font-['Montserrat'] italic text-xl pr-1 tracking-tighter">VF</span>
                </div>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-[#b8860b] uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">Phụ kiện VinFast</p>
                  <h4 className="text-[13px] font-semibold text-[#001839] leading-tight font-['Plus_Jakarta_Sans'] line-clamp-2">Giảm giá phụ kiện xe điện chính hãng</h4>
                </div>
                <div className="mt-3">
                  <span className="text-[11px] text-gray-500">Chiết khấu VIP</span>
                  <span className="text-[14px] font-bold text-[#001839] block">Lên đến 15%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

    </div>
  );
}
