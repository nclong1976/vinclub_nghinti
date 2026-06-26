import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface WelfareResortViewProps {
  onBack: () => void;
}

export default function WelfareResortView({ onBack }: WelfareResortViewProps) {
  return (
    <div className="flex-1 bg-[#f7f9fb] text-[#001839] antialiased overflow-y-auto scrollbar-hide pb-28">
      {/* TopAppBar */}
      <header className="sticky top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-[#f7f9fb]/90 backdrop-blur-md border-b border-[#e0e3e5]">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-black/5 transition-colors text-[#001839]">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-['Montserrat'] text-[20px] font-bold text-[#001839] tracking-tight">Nghỉ dưỡng đặc quyền</h1>
        <div className="w-10 h-10 -mr-2"></div>
      </header>

      {/* Main Content */}
      <main className="pt-6 px-4 max-w-7xl mx-auto">
        {/* Filter Bar */}
        <section className="mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-3 whitespace-nowrap pb-2">
            <button className="px-5 py-2 rounded-full bg-[#002c5f] text-white font-['Plus_Jakarta_Sans'] text-[14px] font-semibold shadow-sm transition-transform hover:scale-105">Tất cả</button>
            <button className="px-5 py-2 rounded-full bg-white text-[#334155] font-['Plus_Jakarta_Sans'] text-[14px] hover:bg-[#e6e8ea] border border-[#e0e3e5] transition-transform hover:scale-105 shadow-sm">Phú Quốc</button>
            <button className="px-5 py-2 rounded-full bg-white text-[#334155] font-['Plus_Jakarta_Sans'] text-[14px] hover:bg-[#e6e8ea] border border-[#e0e3e5] transition-transform hover:scale-105 shadow-sm">Nha Trang</button>
            <button className="px-5 py-2 rounded-full bg-white text-[#334155] font-['Plus_Jakarta_Sans'] text-[14px] hover:bg-[#e6e8ea] border border-[#e0e3e5] transition-transform hover:scale-105 shadow-sm">Đà Nẵng</button>
            <button className="px-5 py-2 rounded-full bg-white text-[#334155] font-['Plus_Jakarta_Sans'] text-[14px] hover:bg-[#e6e8ea] border border-[#e0e3e5] transition-transform hover:scale-105 shadow-sm">Hạ Long</button>
          </div>
        </section>

        {/* Listing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#e0e3e5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
          >
            <div className="relative h-48 overflow-hidden shrink-0">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz1tFwc08DrrG2RMBg2VxM6vbHvnCRzjV5urYpSS3gF0-FNtSwvrDvlleJzFRXFWY-vXJXDL-88hvykuSYD5JCJKHb3AFjhcmREWiFNZwfcYTRtsUEjOVXES14BcUS4KHYqV9IrPQNyiRbMRlqxNVEb3b-V8s03M1xIUUfBuNSzcEOhHna_-mnKuIQu0EMhF8q3mxD960ogho3dLTlfuYzVqju0Zv8BDiHmQhR00E7gCcnsr40VByXILCTu_OPfuug1tI5RWvXWo4" 
                alt="Vinpearl Resort" 
              />
              <div className="absolute top-4 left-4 bg-[#C49A6C] text-white px-2.5 py-1 rounded text-[11px] font-bold tracking-wider shadow-md">
                GIẢM 35%
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h2 className="font-['Montserrat'] text-[18px] font-semibold leading-snug text-[#001839] mb-2 line-clamp-2">Kỳ nghỉ vương giả tại Vinpearl Luxury</h2>
              <p className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#334155] mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-[#b8860b]" /> Phú Quốc, Việt Nam
              </p>
              <div className="mt-auto pt-4 border-t border-[#e0e3e5] flex justify-between items-center">
                <div>
                  <p className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold tracking-wider text-[#334155] mb-0.5">GIÁ ƯU ĐÃI TỪ</p>
                  <p className="font-['Montserrat'] text-[18px] font-bold text-[#C49A6C]">3.500.000đ</p>
                </div>
                <button className="bg-[#eef4ff] text-[#b8860b] px-5 py-2 rounded-lg hover:bg-[#d7e3ff] transition-colors font-['Plus_Jakarta_Sans'] text-[13px] font-bold">
                  Đặt chỗ
                </button>
              </div>
            </div>
          </motion.article>

          {/* Card 2 */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-[#e0e3e5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
          >
            <div className="relative h-48 overflow-hidden shrink-0">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdtSbUSV9h5wMmDMMmQWKfHy0Pqq8Hk3Cbo2968qaSL63pRe4pFfPSmqvFQQBo9SPTTI7Ng4WIADyk3u-ep5gj0uAgZwKPjFl3oKy3hLZh1OYTkucxHmXE_NKeQDOE8XJwo1hxFwg4aBMIe1NyH5GTWx5P8ix8jrn9hwf2irnuxd19zCjUGZy0QS04DhgaVdM4OaQkqgvcaNyqeLsT09CmKeN3M-Plji7UQ8NoYwXUworQHtEsx6FbO7UNi3w2gwxQSvMufYu9tYY" 
                alt="Vinpearl Golf" 
              />
              <div className="absolute top-4 left-4 bg-[#C49A6C] text-white px-2.5 py-1 rounded text-[11px] font-bold tracking-wider shadow-md">
                ĐẶC QUYỀN GOLD
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h2 className="font-['Montserrat'] text-[18px] font-semibold leading-snug text-[#001839] mb-2 line-clamp-2">Ưu đãi sân Golf 18 hố dành cho chủ thẻ Gold VIP</h2>
              <p className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#334155] mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-[#b8860b]" /> Nha Trang, Việt Nam
              </p>
              <div className="mt-auto pt-4 border-t border-[#e0e3e5] flex justify-between items-center">
                <div>
                  <p className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold tracking-wider text-[#334155] mb-0.5">GIÁ ƯU ĐÃI TỪ</p>
                  <p className="font-['Montserrat'] text-[18px] font-bold text-[#C49A6C]">1.200.000đ</p>
                </div>
                <button className="bg-[#eef4ff] text-[#b8860b] px-5 py-2 rounded-lg hover:bg-[#d7e3ff] transition-colors font-['Plus_Jakarta_Sans'] text-[13px] font-bold">
                  Đặt chỗ
                </button>
              </div>
            </div>
          </motion.article>

          {/* Card 3 */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-[#e0e3e5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
          >
            <div className="relative h-48 overflow-hidden shrink-0">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb5ekjpRrBH-eoR8dvaD0fC5Ijs1psCN7B4wFJcPvxNKxePIb7qxo0zzr_nP-nNjB5dUorKWvbPlYTr7MpITX2eHaRw8DzzvaI_7yCHEiN9K2n2bBWCPk61ooK5YQupUpN0u31b2TuB-_OwxhI6Os3-3XYZg6qNAE5lO_x670kWcOQFMUB3t-NDVfWrbbAECOFvgU567iGsLaA41e8d8renCm3vgIOVoWJ5MAo78RCeDdqWgSzA3fQgWUkJcRB-ZjT-5n5zycTqKk" 
                alt="Vinpearl Hot Spring" 
              />
              <div className="absolute top-4 left-4 bg-[#C49A6C] text-white px-2.5 py-1 rounded text-[11px] font-bold tracking-wider shadow-md">
                TẶNG KÈM SPA
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h2 className="font-['Montserrat'] text-[18px] font-semibold leading-snug text-[#001839] mb-2 line-clamp-2">Gói nghỉ dưỡng khoáng nóng tại Vinpearl Mỹ Lâm</h2>
              <p className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#334155] mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-[#b8860b]" /> Tuyên Quang, Việt Nam
              </p>
              <div className="mt-auto pt-4 border-t border-[#e0e3e5] flex justify-between items-center">
                <div>
                  <p className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold tracking-wider text-[#334155] mb-0.5">GIÁ ƯU ĐÃI TỪ</p>
                  <p className="font-['Montserrat'] text-[18px] font-bold text-[#C49A6C]">2.800.000đ</p>
                </div>
                <button className="bg-[#eef4ff] text-[#b8860b] px-5 py-2 rounded-lg hover:bg-[#d7e3ff] transition-colors font-['Plus_Jakarta_Sans'] text-[13px] font-bold">
                  Đặt chỗ
                </button>
              </div>
            </div>
          </motion.article>
        </div>
      </main>
    </div>
  );
}
