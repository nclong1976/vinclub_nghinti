import React from 'react';
import { motion } from 'motion/react';

interface CardRankingViewProps {
  onBack: () => void;
}

export default function CardRankingView({ onBack }: CardRankingViewProps) {
  return (
    <div className="bg-[#f7f9fb] min-h-screen pb-24 font-['Plus_Jakarta_Sans'] text-[#191c1e] select-none">
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
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center"
        >
          <div className="w-4/5 max-w-[280px] aspect-[1.58/1] mb-4 rounded-lg overflow-hidden relative shadow-md">
            <img 
              alt="Member"
              className="w-full h-full object-cover" 
              src="https://statics.vinpearl.com/vinclub-member_1723049424.png"
            />
          </div>
          <h2 className="font-['Montserrat'] text-[24px] font-semibold text-[#001839] mb-2">Member</h2>
          <p className="text-[16px] text-[#43474f]">Đăng ký miễn phí</p>
        </motion.article>

        {/* Tier Card: Gold */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center relative overflow-hidden"
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
          <h2 className="font-['Montserrat'] text-[24px] font-semibold text-[#001839] mb-2">Gold</h2>
          <p className="text-[16px] text-[#43474f]">Từ 1 tỷ VND trở lên - Hạng Gold (Thẻ Vàng)</p>
        </motion.article>

        {/* Tier Card: VIP */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center relative overflow-hidden"
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
          <h2 className="font-['Montserrat'] text-[24px] font-semibold text-[#001839] mb-2">VIP</h2>
          <p className="text-[16px] text-[#43474f]">Từ 5 tỷ VND trở lên - Hạng VIP (Thẻ VIP)</p>
        </motion.article>

        {/* Tier Card: VVIP */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-[#fdfdfd] rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center relative overflow-hidden"
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
          <h2 className="font-['Montserrat'] text-[24px] font-semibold text-[#001839] mb-2">VVIP</h2>
          <p className="text-[16px] text-[#43474f]">Từ 10 tỷ VND trở lên - Hạng VVIP (Hạng cao nhất)</p>
        </motion.article>

      </main>
    </div>
  );
}
