import { 
  ArrowLeft, 
  Globe2, 
  LayoutGrid, 
  Cpu, 
  TrendingUp, 
  Building, 
  BriefcaseMedical, 
  Palmtree,
  ShieldCheck,
  Battery,
  Bot,
  Flag,
  Euro,
  Compass,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import reasonGreenVision from '../assets/images/welfare/reason-green-vision.jpg';
import reasonVingroup from '../assets/images/welfare/reason-vingroup.jpg';

export default function InvestmentReasonsView({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f7f9fb] flex flex-col w-full max-w-2xl mx-auto h-full scrollbar-hide">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-4 py-3 border-b border-[#e0e3e5] flex items-center justify-between sticky top-0 z-20">
        <button 
          onClick={onBack}
          className="w-10 h-10 -ml-2 flex items-center justify-center text-[#001839] hover:bg-[#f2f4f6] rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-lg font-bold text-[#001839]">Lí do đầu tư</span>
        <div className="w-10 h-10 -mr-2"></div>
      </div>

      <div className="px-4 py-8 space-y-6 pb-8">
        
        {/* Title Area */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 mb-8"
        >
          <h1 className="font-['Montserrat'] text-[28px] leading-[36px] font-bold text-[#001839]">Chiến lược Phát triển</h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[#334155] text-[14px] px-2 leading-relaxed">
            Đồng hành cùng VinFast kiến tạo tương lai di chuyển thông minh và bền vững toàn cầu.
          </p>
        </motion.div>

        {/* Card 1: Tầm nhìn Xanh toàn cầu */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl overflow-hidden border border-[#e0e3e5] shadow-sm"
        >
          <div className="h-40 relative">
            <img 
              src={reasonGreenVision} 
              alt="Tầm nhìn xanh" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001839]/90 to-transparent"></div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
              <Globe2 className="w-5 h-5 text-[#d4a373]" />
              <h2 className="font-['Montserrat'] text-[20px] font-semibold tracking-tight">Tầm nhìn Xanh toàn cầu</h2>
            </div>
          </div>
          <div className="p-5 space-y-5">
            <p className="font-['Plus_Jakarta_Sans'] text-[#334155] text-[14px] leading-relaxed">
              Hệ sinh thái di chuyển điện hóa toàn diện, phủ sóng mạnh mẽ với tốc độ tăng trưởng ấn tượng.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f2f4f6] rounded-lg p-4 flex flex-col justify-center">
                <span className="font-['Montserrat'] text-[20px] font-bold text-[#001839]">150.000+</span>
                <span className="font-['Plus_Jakarta_Sans'] text-[12px] text-[#334155] mt-1">Cổng sạc toàn quốc</span>
              </div>
              <div className="bg-[#f2f4f6] rounded-lg p-4 flex flex-col justify-center">
                <span className="font-['Montserrat'] text-[20px] font-bold text-[#001839]">50+</span>
                <span className="font-['Plus_Jakarta_Sans'] text-[12px] text-[#334155] mt-1">Quốc gia mở rộng</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Hệ sinh thái Vingroup */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl overflow-hidden border border-[#e0e3e5] shadow-sm"
        >
          <div className="h-40 relative">
            <img 
              src={reasonVingroup} 
              alt="Hệ sinh thái Vingroup" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001839]/90 to-transparent"></div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
              <LayoutGrid className="w-5 h-5 text-[#d4a373]" />
              <h2 className="font-['Montserrat'] text-[20px] font-semibold tracking-tight">Hệ sinh thái Vingroup</h2>
            </div>
          </div>
          <div className="p-5 space-y-5">
            <p className="font-['Plus_Jakarta_Sans'] text-[#334155] text-[14px] leading-relaxed">
              Hậu thuẫn bởi Vingroup, tạo ra sự cộng hưởng sức mạnh chưa từng có từ các thương hiệu dẫn đầu.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#334155]">
                  <Building className="w-4 h-4" />
                </div>
                <span className="font-['Plus_Jakarta_Sans'] text-[14px] text-[#001839]">Vinhomes - Bất động sản cao cấp</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#334155]">
                  <BriefcaseMedical className="w-4 h-4" />
                </div>
                <span className="font-['Plus_Jakarta_Sans'] text-[14px] text-[#001839]">Vinmec - Y tế tiêu chuẩn quốc tế</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#334155]">
                  <Palmtree className="w-4 h-4" />
                </div>
                <span className="font-['Plus_Jakarta_Sans'] text-[14px] text-[#001839]">Vinpearl - Du lịch nghỉ dưỡng</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Công nghệ đột phá */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#001839] rounded-xl overflow-hidden shadow-sm p-6 relative"
        >
          {/* Decorative background chip pattern */}
          <div className="absolute top-4 right-4 opacity-10">
             <Cpu className="w-32 h-32" />
          </div>

          <div className="flex items-center gap-2 text-[#b8860b] mb-4 relative z-10">
            <Cpu className="w-5 h-5" />
            <h2 className="font-['Montserrat'] text-[20px] font-semibold tracking-tight">Công nghệ đột phá</h2>
          </div>
          
          <p className="font-['Plus_Jakarta_Sans'] text-[#d4a373] text-[14px] leading-relaxed mb-6 relative z-10">
            Dẫn đầu xu hướng công nghệ ô tô thế giới với các giải pháp tiên tiến nhất.
          </p>

          <div className="space-y-5 relative z-10">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#b8860b] mt-0.5" />
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-white text-[14px]">Hệ thống ADAS tiên tiến</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[#d4a373] text-[12px] mt-0.5">Trợ lái thông minh cấp độ 2+</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Battery className="w-5 h-5 text-[#b8860b] mt-0.5" />
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-white text-[14px]">Nghiên cứu Pin thể rắn</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[#d4a373] text-[12px] mt-0.5">Tối ưu hiệu suất và phạm vi hoạt động</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Bot className="w-5 h-5 text-[#b8860b] mt-0.5" />
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-white text-[14px]">Trợ lý ảo AI tích hợp</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[#d4a373] text-[12px] mt-0.5">Cá nhân hóa trải nghiệm người dùng</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Tiềm năng tài chính */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl overflow-hidden border border-[#e0e3e5] shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-[#d7e3ff] flex items-center justify-center text-[#b8860b]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="font-['Montserrat'] text-[20px] font-semibold text-[#001839] tracking-tight">Tiềm năng tài chính</h2>
          </div>
          
          <p className="font-['Plus_Jakarta_Sans'] text-[#334155] text-[14px] leading-relaxed mb-6">
            Cột mốc lịch sử niêm yết trên sàn Nasdaq (Mỹ) với mã VFS, khẳng định vị thế thương hiệu toàn cầu.
          </p>

          <div className="space-y-3">
            <div className="bg-[#f2f4f6] rounded-lg p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#d7e3ff] flex items-center justify-center shrink-0">
                <Flag className="w-5 h-5 text-[#b8860b]" />
              </div>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[#001839] text-[14px]">Thị trường Mỹ</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[#334155] text-[13px] mt-0.5">Nhà máy sản xuất tại Bắc Carolina</p>
              </div>
            </div>

            <div className="bg-[#f2f4f6] rounded-lg p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#d7e3ff] flex items-center justify-center shrink-0">
                <Euro className="w-5 h-5 text-[#b8860b]" />
              </div>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[#001839] text-[14px]">Thị trường Châu Âu</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[#334155] text-[13px] mt-0.5">Mở rộng mạng lưới phân phối</p>
              </div>
            </div>

            <div className="bg-[#f2f4f6] rounded-lg p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#d7e3ff] flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5 text-[#b8860b]" />
              </div>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[#001839] text-[14px]">Đông Nam Á</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[#334155] text-[13px] mt-0.5">Chiến lược phủ sóng toàn khu vực</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Fixed Bottom Action */}
      <div className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#e0e3e5] p-4 max-w-2xl mx-auto z-20">
        <button 
          onClick={() => onBack()}
          className="w-full bg-[#b8860b] hover:bg-[#286eea] text-white font-['Plus_Jakarta_Sans'] font-semibold text-[16px] py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          Đầu tư ngay
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-[#747780] font-['Plus_Jakarta_Sans'] text-[12px] mt-3">
          Vốn đầu tư tối thiểu từ 10.000.000 VNĐ
        </p>
      </div>

    </div>
  );
}
