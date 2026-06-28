import React from 'react';
import { motion } from 'motion/react';

interface CardRankingViewProps {
  onBack: () => void;
}

export default function CardRankingView({ onBack }: CardRankingViewProps) {
  return (
    <div className="bg-[#f7f9fb] h-full overflow-y-auto pb-24 font-['Plus_Jakarta_Sans'] text-[#191c1e] select-none">
      {/* TopAppBar */}
      <header className="sticky top-0 z-40 bg-white w-full shadow-sm">
        <div className="flex justify-between items-center px-4 py-4 w-full">
          <button 
            onClick={onBack}
            className="text-[#001839] hover:bg-gray-100 transition-colors rounded-full p-2 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="font-['Montserrat'] text-[24px] leading-[32px] font-bold text-[#001839]">
            Hạng Thẻ VinClub
          </h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-8 flex flex-col gap-8">
        
        {/* Tier Card: Member */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center w-full"
        >
          <div className="w-4/5 max-w-[280px] aspect-[1.58/1] mb-4 rounded-lg overflow-hidden relative shadow-md">
            <img 
              alt="Member"
              className="w-full h-full object-cover" 
              src="https://statics.vinpearl.com/vinclub-member_1723049424.png"
            />
          </div>
          <h2 className="font-['Montserrat'] text-[24px] font-semibold text-[#001839] mb-1">Member</h2>
          <p className="text-[14px] text-slate-500 mb-4">Đăng ký tài khoản miễn phí</p>
          
          <div className="w-full text-left border-t border-slate-100 pt-4 space-y-3 text-[13px] text-[#334155] font-['Plus_Jakarta_Sans']">
            <div className="flex gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <p><strong>Ưu đãi y tế:</strong> Giảm 30% chi phí khám chữa bệnh tại hệ thống Y tế Vinmec.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <p><strong>Đặc quyền đầu tư:</strong> Được quyền tham gia các gói đầu tư hiện có trong hệ sinh thái của VinClub.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <p><strong>Cơ chế tích lũy tài khoản (Tiền gửi không kỳ hạn):</strong> Tỷ lệ tích lũy đạt 0.5% – 1% giá trị khi phát sinh giao dịch trong hệ sinh thái.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <p><strong>Đặc biệt (Logic tích lũy số dư):</strong> Trường hợp người dùng có số dư tiền mặt trong ứng dụng và không tham gia vào các gói đầu tư, hệ thống sẽ tự động tính toán và cộng 0.6% trên tổng số tiền hiện có vào lúc 08:00 AM hàng ngày.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <p><strong>Ưu đãi gia nhập:</strong> Nhận ngay Voucher chào mừng (Welcome Voucher) trị giá 50.000 VNĐ sau khi xác thực tài khoản thành công. Số tiền này được hệ thống cộng trực tiếp vào tài khoản khả dụng ngay sau khi hoàn tất kích hoạt.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <p><strong>Dịch vụ:</strong> Tiếp cận hệ thống chăm sóc khách hàng tiêu chuẩn qua Hotline/App.</p>
            </div>
          </div>
        </motion.article>

        {/* Tier Card: Gold */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center relative overflow-hidden w-full"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E5C185] to-[#A67C37]"></div>
          <div className="w-4/5 max-w-[280px] aspect-[1.58/1] mb-4 rounded-lg overflow-hidden relative shadow-md">
            <img 
              alt="Gold"
              className="w-full h-full object-cover" 
              src="https://storage.googleapis.com/loyalty-public-arczn36dnada/240807164237_previous_photo_card_24fedc53-f059-407e-ac30-e3f7baf0fca7.jpg"
            />
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-[shimmer_3s_infinite] pointer-events-none"></div>
          </div>
          <h2 className="font-['Montserrat'] text-[24px] font-semibold text-[#001839] mb-1">Gold</h2>
          <p className="text-[14px] text-slate-500 mb-4">Từ 1 tỷ VND trở lên - Hạng Gold (Thẻ Vàng)</p>

          <div className="w-full text-left border-t border-slate-100 pt-4 space-y-3 text-[13px] text-[#334155] font-['Plus_Jakarta_Sans']">
            <div className="flex gap-2">
              <span className="text-amber-600 font-bold">✓</span>
              <p><strong>Ưu đãi y tế:</strong> Giảm 30% chi phí khám chữa bệnh tại hệ thống Y tế Vinmec.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-amber-600 font-bold">✓</span>
              <p><strong>Ưu đãi bất động sản:</strong> Giảm 30% chi phí mua nhà thuộc hệ thống Vinpearl.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-amber-600 font-bold">✓</span>
              <p><strong>Đặc quyền đầu tư:</strong> Được quyền tham gia các gói đầu tư hiện có trong hệ sinh thái của VinClub.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-amber-600 font-bold">✓</span>
              <p><strong>Cơ chế tích lũy tài khoản:</strong> Nâng tỷ lệ tích lũy lên 1.5% – 3% giá trị khi phát sinh giao dịch trong hệ sinh thái.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-amber-600 font-bold">✓</span>
              <p><strong>Logic tích lũy số dư:</strong> Tự động cộng 1% tiền mặt trực tiếp vào tài khoản vào lúc 08:00 AM mỗi ngày, tính trên tổng số tiền hiện có (bao gồm số dư ví khả dụng và số tiền đang đầu tư).</p>
            </div>
            <div className="flex gap-2">
              <span className="text-amber-600 font-bold">✓</span>
              <p><strong>Ưu đãi dịch vụ:</strong> Giảm giá trực tiếp 5% – 10% khi sử dụng các dịch vụ cao cấp (nghỉ dưỡng, ẩm thực, mua sắm) và nhận quà tặng/voucher độc quyền vào ngày sinh nhật.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-amber-600 font-bold">✓</span>
              <p><strong>Đặc quyền trải nghiệm:</strong> Ưu tiên xử lý yêu cầu/giao dịch tại quầy và tổng đài chăm sóc khách hàng (Fast-track tiêu chuẩn).</p>
            </div>
          </div>
        </motion.article>

        {/* Tier Card: VIP */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center relative overflow-hidden w-full"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e65c00] to-[#F9D423]"></div>
          <div className="w-4/5 max-w-[280px] aspect-[1.58/1] mb-4 rounded-lg overflow-hidden relative shadow-md">
            <img 
              alt="VIP"
              className="w-full h-full object-cover" 
              src="https://storage.googleapis.com/loyalty-public-arczn36dnada/240807164461_previous_photo_card_c546ea67-12e3-445d-ad25-b91c8d600830.jpg"
            />
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-[shimmer_3s_infinite] pointer-events-none"></div>
          </div>
          <h2 className="font-['Montserrat'] text-[24px] font-semibold text-[#001839] mb-1">VIP</h2>
          <p className="text-[14px] text-slate-500 mb-4">Từ 5 tỷ VND trở lên - Hạng VIP (Thẻ VIP)</p>

          <div className="w-full text-left border-t border-slate-100 pt-4 space-y-3 text-[13px] text-[#334155] font-['Plus_Jakarta_Sans']">
            <div className="flex gap-2">
              <span className="text-[#e65c00] font-bold">✓</span>
              <p><strong>Ưu đãi An sinh & BĐS cao cấp:</strong> Giảm ngay 30% chi phí khám chữa bệnh trên toàn hệ thống Y tế Vinmec; giảm ngay 30% giá trị khi mua nhà thuộc hệ thống Vinpearl; giảm ngay 30% học phí khi con cái theo học tại hệ thống trường học Vinschool.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[#e65c00] font-bold">✓</span>
              <p><strong>Đặc quyền tài chính & Cơ chế tích lũy tài sản (Vượt trội so với Hạng Vàng):</strong> Toàn quyền tham gia mọi gói đầu tư sinh lời trong hệ sinh thái VinClub. Tăng tốc tốc độ tích điểm: Đạt từ 3.5% – 5% giá trị trên mỗi giao dịch phát sinh.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[#e65c00] font-bold">✓</span>
              <p><strong>Cơ chế cộng tiền tự động siêu đặc quyền:</strong> Tự động cộng thẳng 1.5% tiền mặt vào tài khoản của bạn vào lúc 08:00 AM mỗi ngày. Tỷ lệ này được tính trên tổng toàn bộ số tiền hiện có trong hệ thống VinClub (bao gồm cả số dư tiền mặt khả dụng và số tiền đang tham gia đầu tư).</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[#e65c00] font-bold">✓</span>
              <p><strong>Ưu đãi dịch vụ & Quà tặng thượng lưu:</strong> Hưởng mức chiết khấu sâu từ 10% – 15% cho tất cả các dịch vụ cao cấp (nghỉ dưỡng, ẩm thực, mua sắm). Miễn phí nâng hạng phòng khách sạn hoặc hạng dịch vụ cao cấp nhất khi đặt lịch trước (ưu tiên khi còn trống). Sở hữu các bộ quà tặng thiết kế riêng biệt (Premium Gift) vào các dịp Lễ, Tết và ngày Sinh nhật của chủ thẻ.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[#e65c00] font-bold">✓</span>
              <p><strong>Đặc quyền trải nghiệm biệt lập:</strong> Tận hưởng lối đi riêng biệt (VIP Lane) giúp loại bỏ thời gian chờ đợi tại tất cả các khu vực đón tiếp, quầy giao dịch trực tiếp. Được phục vụ riêng bởi Chuyên viên chăm sóc khách hàng độc lập (VIP Account Manager). Nhận thẻ mời tham dự các sự kiện giới hạn (Private Event) của thương hiệu.</p>
            </div>
          </div>
        </motion.article>

        {/* Tier Card: VVIP */}
        {/* Tier Card: VVIP */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-[#fdfdfd] rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center relative overflow-hidden w-full"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-700 to-black"></div>
          <div className="w-4/5 max-w-[280px] aspect-[1.58/1] mb-4 rounded-lg overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <img 
              alt="VVIP"
              className="w-full h-full object-cover" 
              src="https://storage.googleapis.com/loyalty-public-arczn36dnada/240807164519_previous_photo_card_efd6a076-7d73-46e2-ac0c-713d2dca20f7.jpg"
            />
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-[shimmer_3s_infinite] pointer-events-none"></div>
          </div>
          <h2 className="font-['Montserrat'] text-[24px] font-semibold text-[#001839] mb-1">VVIP</h2>
          <p className="text-[14px] text-slate-500 mb-4">Từ 10 tỷ VND trở lên - Hạng VVIP (Hạng cao nhất)</p>

          <div className="w-full text-left border-t border-slate-100 pt-4 space-y-3 text-[13px] text-[#334155] font-['Plus_Jakarta_Sans']">
            <div className="flex gap-2">
              <span className="text-zinc-800 font-bold">✓</span>
              <p><strong>Đặc quyền Giáo dục Đẳng cấp Quốc tế:</strong> Thụ hưởng các chính sách ưu đãi đặc biệt và lộ trình tuyển sinh ưu tiên tại Hệ thống giáo dục Vinschool và Đại học tinh hoa VinUniversity (VinUni).</p>
            </div>
            <div className="flex gap-2">
              <span className="text-zinc-800 font-bold">✓</span>
              <p><strong>Đặc quyền tài chính & Cơ chế tích lũy tài sản (Mức tối cao của hệ thống):</strong> Tốc độ tích điểm cao nhất hệ thống: Đạt từ 5.5% – 7% giá trị trên mỗi giao dịch phát sinh (hoặc áp dụng cơ chế đặc quyền nhân đôi điểm thưởng trong các chiến dịch lớn).</p>
            </div>
            <div className="flex gap-2">
              <span className="text-zinc-800 font-bold">✓</span>
              <p><strong>Cơ chế cộng tiền tự động siêu đặc quyền:</strong> Tự động cộng thẳng 2% tiền mặt trực tiếp vào tài khoản của bạn vào lúc 08:00 AM mỗi ngày. Tỷ lệ này được tính trên tổng toàn bộ số tiền hiện có trong hệ thống VinClub (bao gồm cả số dư tiền mặt khả dụng và số tiền đang tham gia đầu tư).</p>
            </div>
            <div className="flex gap-2">
              <span className="text-zinc-800 font-bold">✓</span>
              <p><strong>Ưu đãi dịch vụ & Quà tặng cá nhân hóa cao cấp:</strong> Miễn phí hoàn toàn một số dịch vụ đi kèm nâng cao hạng sang (xe đưa đón hạng sang độc quyền, đặc quyền sử dụng phòng chờ VIP tại các điểm đến). Thiết kế và chế tác quà tặng cá nhân hóa cao cấp (Bespoke Gift) hoàn toàn dựa theo sở thích, phong cách cá nhân của chủ thẻ.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-zinc-800 font-bold">✓</span>
              <p><strong>Đặc quyền trải nghiệm & Tận hưởng biệt lập:</strong> Phục vụ và hỗ trợ toàn diện 24/7 bởi Trợ lý cấp cao độc lập (Dedicated Senior Assistant). Quyền tiếp cận, trải nghiệm và đặt chỗ trước đối với các sản phẩm, dịch vụ hoặc phiên bản giới hạn (Limited Edition) trước khi công bố ra thị trường. Sở hữu vé mời VIP hàng ghế đầu (VVIP Front-row) tại tất cả các sự kiện đẳng cấp quốc tế.</p>
            </div>
          </div>
        </motion.article>

      </main>
    </div>
  );
}
