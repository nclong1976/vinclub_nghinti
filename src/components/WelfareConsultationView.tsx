import React from 'react';
import { 
  ArrowLeft, Waves, SquareActivity, GraduationCap, ShoppingBag, ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface WelfareConsultationViewProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export default function WelfareConsultationView({ onBack, onNavigate }: WelfareConsultationViewProps) {
  return (
    <div className="flex-1 flex flex-col bg-[#f7f9fb] min-h-screen relative text-[#001839] overflow-y-auto pb-24 scrollbar-hide">
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl p-6 overflow-hidden shadow-lg border border-[#ebd5ad]/30"
          style={{
            backgroundColor: '#001839'
          }}
        >
          {/* Shine effect */}
          <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[shimmer_3s_infinite]"></div>
          
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <p className="text-white/80 text-[10px] font-bold tracking-widest uppercase mb-1 font-['Plus_Jakarta_Sans']">Hạng thành viên</p>
              <h2 className="text-white text-3xl font-black font-['Montserrat'] tracking-tight drop-shadow-sm">GOLD VIP</h2>
            </div>
            <div className="w-8 h-5 border border-white/40 rounded-sm flex flex-col justify-between p-1 opacity-80">
               <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-end relative z-10">
            <div>
              <p className="text-white/80 text-[10px] font-bold tracking-widest uppercase mb-0.5 font-['Plus_Jakarta_Sans']">VPoint hiện có</p>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-2xl font-bold font-['Montserrat']">12,500</span>
                <span className="text-white/90 text-sm font-semibold">pts</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-[10px] font-bold tracking-widest uppercase mb-0.5 font-['Plus_Jakarta_Sans']">Voucher</p>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-white text-2xl font-bold font-['Montserrat']">15</span>
                <span className="text-white/90 text-sm font-semibold">có sẵn</span>
              </div>
            </div>
          </div>
        </motion.div>

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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[22px] font-semibold text-[#001839] font-['Montserrat'] tracking-tight">Đặc quyền tiêu biểu</h3>
            <button className="text-[#b8860b] text-sm font-medium font-['Plus_Jakarta_Sans'] flex items-center hover:underline">
              Xem tất cả <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Item 1 */}
            <div className="bg-white rounded-xl border border-[#e0e3e5] overflow-hidden flex shadow-sm hover:shadow-md transition-shadow">
              <div className="w-32 h-32 shrink-0 bg-gray-200">
                <img src="https://vinpearl.com/sites/default/files/2021-02/vinpearl-resort-spa-nha-trang-bay.jpg" alt="Vinpearl" className="w-full h-full object-cover" />
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
              <div className="w-32 h-32 shrink-0 bg-[#001839] flex items-center justify-center p-4">
                <div className="w-16 h-16 rounded-full border-2 border-[#b8860b] shadow-[0_0_15px_rgba(62,151,255,0.5)] flex items-center justify-center relative">
                   <div className="w-8 h-8 rounded-full border-2 border-[#b8860b] flex items-center justify-center absolute -top-2 left-1/2 -translate-x-1/2 bg-[#001839] z-10"></div>
                   <div className="w-10 h-1 bg-[#b8860b] absolute bottom-0 shadow-[0_0_10px_rgba(62,151,255,0.8)]"></div>
                   <div className="w-6 h-6 border-2 border-[#b8860b] rounded-full absolute"></div>
                </div>
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
              <div className="w-32 h-32 shrink-0 bg-[#001839] flex items-center justify-center p-4 relative">
                <div className="w-16 h-16 rounded-full border-2 border-[#b8860b] shadow-[0_0_15px_rgba(62,151,255,0.5)] flex items-center justify-center relative">
                   <div className="w-8 h-8 rounded-full border-2 border-[#b8860b] flex items-center justify-center absolute -top-2 left-1/2 -translate-x-1/2 bg-[#001839] z-10"></div>
                   <div className="w-10 h-1 bg-[#b8860b] absolute bottom-0 shadow-[0_0_10px_rgba(62,151,255,0.8)]"></div>
                   <div className="w-6 h-6 border-2 border-[#b8860b] rounded-full absolute"></div>
                </div>
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[22px] font-semibold text-[#001839] font-['Montserrat'] tracking-tight">Ưu đãi Y tế</h3>
            <button 
              onClick={() => onNavigate && onNavigate('welfare_medical')}
              className="text-[#b8860b] text-sm font-medium font-['Plus_Jakarta_Sans'] flex items-center hover:underline"
            >
              Xem tất cả <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-[#ebd5ad] overflow-hidden shadow-sm flex flex-col relative group cursor-pointer hover:shadow-md transition-all">
              <div className="h-28 bg-[#001839] relative flex items-center justify-center p-3 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                <img src="https://vinmec.com/static/images/logo_vinmec.png" alt="Vinmec" className="h-8 object-contain z-10 brightness-0 invert" onError={(e) => { e.currentTarget.src = ''; e.currentTarget.className = 'hidden'; }} />
                <SquareActivity className="w-10 h-10 text-[#dfbc80] absolute -right-2 -bottom-2 opacity-50" />
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
              <div className="h-28 bg-[#f8f9fa] relative flex items-center justify-center p-3 border-b border-[#e0e3e5]">
                 <img src="https://vinmec.com/static/images/logo_vinmec.png" alt="Vinmec" className="h-8 object-contain z-10" onError={(e) => { e.currentTarget.src = ''; e.currentTarget.className = 'hidden'; }} />
                 <span className="absolute top-2 left-2 bg-[#001839] text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">-30%</span>
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[22px] font-semibold text-[#001839] font-['Montserrat'] tracking-tight">Ưu đãi Mua sắm</h3>
            <button 
              onClick={() => onNavigate && onNavigate('welfare_shopping')}
              className="text-[#b8860b] text-sm font-medium font-['Plus_Jakarta_Sans'] flex items-center hover:underline"
            >
              Xem tất cả <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-[#ebd5ad] overflow-hidden shadow-sm flex flex-col relative group cursor-pointer hover:shadow-md transition-all">
              <div className="h-28 bg-gradient-to-br from-[#dfbc80] to-[#a17036] relative flex items-center justify-center p-3">
                <ShoppingBag className="w-10 h-10 text-white opacity-90 drop-shadow-md" />
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
              <div className="h-28 bg-gradient-to-br from-[#001839] to-[#000a18] relative flex items-center justify-center p-3">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
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
