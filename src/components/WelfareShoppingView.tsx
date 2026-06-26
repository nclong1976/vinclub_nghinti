import React from 'react';
import { ArrowLeft, ArrowRight, ShoppingBag, Car, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface WelfareShoppingViewProps {
  onBack: () => void;
}

export default function WelfareShoppingView({ onBack }: WelfareShoppingViewProps) {
  return (
    <div className="flex-1 bg-[#f7f9fb] text-[#001839] antialiased flex flex-col min-h-screen overflow-y-auto scrollbar-hide pb-28">
      {/* TopAppBar */}
      <header className="sticky top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-[#f7f9fb]/90 backdrop-blur-md border-b border-[#e0e3e5]">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-black/5 transition-colors text-[#001839]">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-['Montserrat'] text-[20px] font-bold text-[#001839] tracking-tight">Đặc quyền Mua sắm</h1>
        <div className="w-10 h-10 -mr-2"></div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow pt-6 px-4 w-full max-w-[1280px] mx-auto md:px-6">
        {/* Hero Banner */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-sm border border-[#e0e3e5] group cursor-pointer" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBhymxFY8z43o9n7j6pftouB4KQqDm81qF7X2NN1nCEGiWNgZZqtNBEz3Q7ZpJWWH4MTpEBc94gg7VktaYVGttc5-iUri2S2LOLXQpx5BsOAGlcpe0cAi2H8u_gY4Vv-C4nZy0vVJ4FsjWbTcPGbCa_az84fsSlqjQF0UjI6n_RJyZsz7lJ6WAyzrAFowtaaG9aTAM1CYyOYJq7OeFUYDtxWveeoJcoEag6i5KFjCCyMXQugkHGr_AzXfw6U8Ydh4lmgtzgN8_MZY4')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#001839]/90 via-[#001839]/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white font-['Plus_Jakarta_Sans'] text-[11px] font-bold tracking-wider rounded shadow-sm mb-3">ĐẶC QUYỀN MỚI</span>
              <h2 className="font-['Montserrat'] text-[24px] md:text-[32px] font-semibold text-white mb-1">Hoàn tiền 5%</h2>
              <p className="font-['Plus_Jakarta_Sans'] text-[15px] text-white/90">Khi mua sắm tại hệ thống Vincom Mega Mall</p>
            </div>
            <div className="absolute inset-0 border border-transparent group-hover:border-[#b8860b]/50 transition-colors duration-300 rounded-xl"></div>
          </div>
        </motion.section>

        {/* Exclusive Vouchers Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-['Montserrat'] text-[20px] font-semibold text-[#001839]">Voucher ưu đãi</h3>
            <button className="text-[#b8860b] font-['Plus_Jakarta_Sans'] text-[13px] font-bold tracking-wider hover:underline flex items-center">
              TẤT CẢ <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Voucher Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-[#ebd5ad] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex"
            >
              <div className="w-1/3 bg-[#fcfaf5] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCwNBinFB3-3aqVmpztw9RQt8g2IxzcxdBjwGc31JGsAO8y_vovsP3ghaPhfSKNG_-ndhdUSYCP6nzjmB93n7XyEMWF5oeCSfNUA2U3VvMvflzMb-36gjAw73OUoueiP6X-9SE_ov93Ci6fQuc85kh4n4maMXHLxieCD1lKlloNMnmH8WhGVk3EU51w1lhR2_520Di1d3wDmcEkZF-NPfZWsey-gh2ujaXinPSOBBfSBvC_oMjrkbd6nf3hsh_nXbItdNW2XaLzJ08')"}}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/90"></div>
                <ShoppingBag className="text-[#b8860b] w-8 h-8 relative z-10" />
              </div>
              <div className="p-4 w-2/3 flex flex-col justify-between">
                <div>
                  <p className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold tracking-wider text-[#334155] mb-1">THỜI TRANG CAO CẤP</p>
                  <h4 className="font-['Montserrat'] text-[18px] font-semibold text-[#001839] mb-2">Voucher 500.000đ</h4>
                  <p className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#334155] leading-relaxed">Áp dụng cho hóa đơn từ 5.000.000đ tại các gian hàng thời trang Vincom Center.</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-['Plus_Jakarta_Sans'] text-[12px] text-[#00875A] flex items-center font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Còn 45 lượt
                  </span>
                  <button className="bg-[#001839] text-white px-4 py-2 rounded-lg font-['Plus_Jakarta_Sans'] text-[13px] font-bold hover:bg-[#002c5f] transition-colors">Nhận ngay</button>
                </div>
              </div>
            </motion.div>

            {/* Voucher Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-[#ebd5ad] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex"
            >
              <div className="w-1/3 bg-[#fcfaf5] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5c3tnGDAOernEXw4fQXnG1-fC2wUslp2Ws8NH43e6tdGcFGw1WSEgMvrc3w2-Y0NOCuTBt0CJP1mplIrhdo5EdAUFUy9fVEZYmv6pRO28cFYIuIBZOaf4XjL5HDuWWNceHEQO2U9TnmUvuxoCg2_yEoG9-6rRtaLxl8ZONQm5wiWKLGmW5kiTOB4dgs7BPEQWocO6gQ75wGjeNewTJVUrnusqEJIKsns_ZHBx-dvmkROwO1NyljGx-4GQo2xKfZIQsMDZ0h4S_LI')"}}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/90"></div>
                <Car className="text-[#b8860b] w-8 h-8 relative z-10" />
              </div>
              <div className="p-4 w-2/3 flex flex-col justify-between">
                <div>
                  <p className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold tracking-wider text-[#334155] mb-1">DỊCH VỤ VIP</p>
                  <h4 className="font-['Montserrat'] text-[18px] font-semibold text-[#001839] mb-2">Đỗ xe miễn phí</h4>
                  <p className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#334155] leading-relaxed">Đặc quyền đỗ xe tại khu vực VIP dành riêng cho hội viên tại hệ thống Vincom.</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-['Plus_Jakarta_Sans'] text-[12px] text-[#00875A] flex items-center font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Không giới hạn
                  </span>
                  <button className="bg-[#001839] text-white px-4 py-2 rounded-lg font-['Plus_Jakarta_Sans'] text-[13px] font-bold hover:bg-[#002c5f] transition-colors">Kích hoạt</button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Terms & Info */}
        <section className="mt-8 border-t border-[#e0e3e5] pt-6">
          <p className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#334155] text-center">Các ưu đãi áp dụng theo điều khoản và điều kiện của VinFast Invest và đối tác Vincom.</p>
        </section>
      </main>
    </div>
  );
}
