import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ArrowRight, ShieldCheck, Info, Sparkles, TrendingUp
} from 'lucide-react';
import { useUser } from './UserContext';
import InvestmentModal from './InvestmentModal';
import ContractPreviewModal from './ContractPreviewModal';
import { Project } from '../types';

interface VinfastViewProps {
  onBack: () => void;
}

interface CarModel {
  id: string;
  title: string;
  image: string;
  type: string;
  seats: string;
  range: string;
  promoPrice: number;
  originalPrice: number;
  badge: string;
  dailyYield: string;
  dailyYieldValue: number;
  minInvest: number;
  desc: string;
}

export default function VinfastView({ onBack }: VinfastViewProps) {
  const { balance, setBalance, addTransaction, displayName, cmsVinfast } = useUser();
  const [activeCarId, setActiveCarId] = useState<string>('VF 3');
  
  // Investment state
  const [showInvestModal, setShowInvestModal] = useState<boolean>(false);
  const [showContractPreview, setShowContractPreview] = useState<boolean>(false);

  const vinfastCars = (cmsVinfast || []).map((car: any) => ({
    id: car.title,
    title: car.title,
    image: `https://vinfastauto.com/themes/porto/img/homepage-v2/car/${car.title.replace(' ', '')}.webp`,
    type: 'Electric Vehicle',
    seats: '5',
    range: '400 km',
    promoPrice: 1000000000,
    originalPrice: 1100000000,
    badge: 'Đầu tư',
    dailyYield: `${car.profit}%`,
    dailyYieldValue: parseFloat(car.profit) / 100,
    minInvest: parseFloat(car.minCapital.replace(/\./g, '')),
    desc: `Dòng xe ${car.title} hiện đại.`
  }));

  const selectedCar = vinfastCars.find(c => c.id === activeCarId) || vinfastCars[0];

  if (!selectedCar) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' VNĐ';
  };


  const currentProject: Project = {
    id: selectedCar.id,
    title: `Ủy Thác: ${selectedCar.title}`,
    imageUrl: selectedCar.image,
    interestRate: selectedCar.dailyYield,
    duration: '365 ngày',
    minAmount: formatCurrency(selectedCar.minInvest),
    scale: '150.000+ Tỷ VNĐ',
    progress: 100,
    category: 'VINFAST',
    durationDays: 365,
    minInvestAmount: selectedCar.minInvest,
    interestRateValue: selectedCar.dailyYieldValue
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-900 font-sans select-none pb-24 overflow-y-auto scrollbar-hide">
      
      {/* Premium Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-slate-200 sticky top-0 bg-[#f8fafc]/90 backdrop-blur-md z-30 shadow-sm">
        <button onClick={onBack} className="p-1.5 hover:bg-slate-200/60 rounded-full transition-colors text-slate-800">
          <ChevronLeft className="w-5.5 h-5.5" />
        </button>
        <h2 className="text-[15px] font-extrabold text-[#001839] tracking-wider uppercase font-mono">VinFast Investment</h2>
        <div className="w-6"></div>
      </div>

      <div className="flex flex-col animate-fade-in bg-zinc-950 min-h-screen text-white">
        
        {/* Showcase Area */}
        <section className="relative px-4 pt-6 pb-2">
          {/* Ambient background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-[#c29b57] opacity-[0.15] blur-[60px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-full flex justify-between items-start mb-2">
              <img 
                src="https://vinfastauto.com/themes/porto/img/homepage-v2/logo.svg" 
                alt="VinFast Logo" 
                className="h-8 opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="text-right">
                <p className="text-[#ebd5ad] font-bold text-[10px] tracking-widest uppercase mb-0.5">Mã cổ phiếu</p>
                <p className="text-white font-black text-sm tracking-widest">NASDAQ: VFS</p>
              </div>
            </div>

            <img 
              src={selectedCar.image} 
              alt={selectedCar.title} 
              className="w-full max-w-[320px] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transition-all duration-500 scale-105 my-4"
              referrerPolicy="no-referrer"
            />
            
            <div className="w-full space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[8px] tracking-widest font-black uppercase text-[#c29b57] bg-[#c29b57]/10 px-2 py-0.5 rounded border border-[#c29b57]/20">
                  {selectedCar.badge}
                </span>
                <h1 className="text-[25px] font-black tracking-tight text-white pt-1">
                  Ủy Thác Góp Vốn: {selectedCar.title}
                </h1>
                <p className="text-[11px] text-zinc-400 leading-relaxed mx-auto max-w-sm">
                  {selectedCar.desc}
                </p>
              </div>

              {/* Bento Specs cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-2.5 text-center flex flex-col justify-center space-y-0.5">
                  <span className="text-[7.5px] font-bold text-zinc-500 uppercase tracking-wider">PHÂN KHÚC</span>
                  <span className="text-[11px] font-black text-white">{selectedCar.type}</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-2.5 text-center flex flex-col justify-center space-y-0.5">
                  <span className="text-[7.5px] font-bold text-zinc-500 uppercase tracking-wider">SỨC CHỨA</span>
                  <span className="text-[11px] font-black text-white">{selectedCar.seats}</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-2.5 text-center flex flex-col justify-center space-y-0.5">
                  <span className="text-[7.5px] font-bold text-zinc-500 uppercase tracking-wider">QUÃNG ĐƯỜNG</span>
                  <span className="text-[11px] font-black text-[#c29b57] truncate">{selectedCar.range}</span>
                </div>
              </div>

              {/* Investment summary card */}
              <div className="bg-zinc-900/80 border border-zinc-850 rounded-xl p-3 flex justify-between items-center">
                <div className="space-y-0.5">
                  <p className="text-[8px] text-zinc-500 uppercase tracking-wider font-bold">Lợi nhuận ủy thác bảo đảm</p>
                  <p className="text-[13px] font-black text-emerald-400">{selectedCar.dailyYield} / Ngày</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-zinc-500 uppercase tracking-wider font-bold">Yêu cầu tối thiểu</p>
                  <p className="text-[12px] font-mono font-bold text-[#c29b57]">{formatCurrency(selectedCar.minInvest)}</p>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="space-y-2">
                <button 
                  onClick={() => setShowInvestModal(true)}
                  className="w-full bg-[#c29b57] hover:bg-[#ebd5ad] text-black font-bold text-[12px] py-3.5 rounded-xl flex items-center justify-center gap-2 tracking-widest uppercase transition-all duration-300 active:scale-[0.98] shadow-[0_4px_20px_rgba(194,155,87,0.15)]"
                >
                  ĐẦU TƯ NGAY
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowContractPreview(true)}
                    className="flex-1 border border-[#c29b57] text-[#c29b57] hover:bg-[#c29b57]/10 font-bold text-[11px] py-2 rounded-xl transition-all uppercase tracking-wider"
                  >
                    Xem hợp đồng
                  </button>
                  <button 
                    onClick={() => setShowContractPreview(true)}
                    className="flex-1 border border-[#c29b57] text-[#c29b57] hover:bg-[#c29b57]/10 font-bold text-[11px] py-2 rounded-xl transition-all uppercase tracking-wider"
                  >
                    Ký điện tử
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Selection Carousel */}
        <section className="px-4 py-6 space-y-4 bg-zinc-950">
          <div className="flex items-center justify-between">
            <h3 className="text-[12px] font-bold text-[#ebd5ad] tracking-wider uppercase">Chọn Xe Để Góp Vốn</h3>
            <span className="text-[8px] text-zinc-500 uppercase font-mono">Kéo ngang xem tiếp</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {vinfastCars.map((car) => {
              const isActive = car.id === activeCarId;
              return (
                <div 
                  key={car.id}
                  onClick={() => setActiveCarId(car.id)}
                  className={`min-w-[130px] max-w-[130px] snap-start border rounded-2xl p-3 flex flex-col justify-between aspect-[3/4] transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'bg-zinc-900 border-[#c29b57] shadow-[0_0_15px_rgba(194,155,87,0.1)] scale-[1.02]' 
                      : 'bg-zinc-950 border-zinc-900 opacity-60 hover:opacity-100 hover:border-zinc-800'
                  }`}
                >
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-wider text-zinc-500 block mb-0.5">{car.type}</span>
                    <h4 className={`font-black text-sm ${isActive ? 'text-[#ebd5ad]' : 'text-zinc-300'}`}>{car.title}</h4>
                  </div>
                  <img src={car.image} alt={car.title} className="w-full my-auto drop-shadow-xl" referrerPolicy="no-referrer" />
                  <div>
                    <span className="text-[8px] text-zinc-500 block mb-0.5">Lợi nhuận cam kết</span>
                    <p className="font-mono text-xs font-bold text-emerald-400">{car.dailyYield}/ngày</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {showInvestModal && (
        <InvestmentModal 
          onClose={() => setShowInvestModal(false)}
          project={currentProject}
        />
      )}

      {showContractPreview && (
        <ContractPreviewModal 
          project={currentProject}
          onClose={() => setShowContractPreview(false)}
        />
      )}

    </div>
  );
}
