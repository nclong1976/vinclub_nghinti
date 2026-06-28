import React, { useContext } from 'react';
import { ArrowLeft, Building2, Banknote, ArrowRight } from 'lucide-react';
import { UserContext } from './UserContext';

interface VinpearlProjectsViewProps {
  onBack: () => void;
  onSelectProject: (projectId: string) => void;
  onNavigate: (view: any) => void;
  onNavigateToDeposit: () => void;
}

export default function VinpearlProjectsView({ onBack, onSelectProject, onNavigate, onNavigateToDeposit }: VinpearlProjectsViewProps) {
  const { adminProjects, updateProjectStatus, updateProjectDetails, role, balance } = useContext(UserContext);
  const isAdmin = role === 'admin' || role === 'super_admin';

  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f6f8] flex flex-col w-full text-zinc-850 pb-32">
      {/* Custom range slider CSS style */}
      <style>{`
        .custom-range-slider {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }
        .custom-range-slider:focus {
          outline: none;
        }
        .custom-range-slider::-webkit-slider-runnable-track {
          width: 100%;
          height: 5px;
          cursor: pointer;
          background: #e2e8f0;
          border-radius: 99px;
        }
        .custom-range-slider::-webkit-slider-thumb {
          height: 14px;
          width: 14px;
          border-radius: 9999px;
          background: #a2855a;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -4.5px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          border: 1.5px solid #ffffff;
          transition: transform 0.1s;
        }
        .custom-range-slider::-webkit-slider-thumb:active {
          transform: scale(1.3);
        }
      `}</style>

      {/* Premium Minimal Header */}
      <header className="w-full top-0 sticky z-40 bg-white border-b border-zinc-200/80 flex items-center px-4 h-16 gap-3 shrink-0 shadow-sm">
        <button 
          onClick={onBack} 
          className="text-[#001839] hover:bg-gray-100 transition-all p-2 rounded-full active:scale-90 flex items-center justify-center"
        >
          <ArrowLeft className="w-5.5 h-5.5" />
        </button>
        <h1 className="font-bold text-[18px] text-[#001839] tracking-tight font-['Montserrat']">
          Đầu tư Vinpearl
        </h1>
      </header>

      <main className="px-5 pt-6 w-full flex-1 flex flex-col">
        {/* Simple Title */}
        <section className="mb-6">
          <h2 className="text-[20px] font-bold text-[#a2855a] mb-1 font-['Montserrat'] tracking-wide">
            SIÊU DỰ ÁN CHIẾN LƯỢC
          </h2>
          <p className="text-[12.5px] text-zinc-450 font-['Plus_Jakarta_Sans'] font-medium">
            Danh mục đầu tư bất động sản & công nghệ đẳng cấp thuộc hệ sinh thái.
          </p>
        </section>

        {/* Minimal Projects List */}
        <div className="flex flex-col gap-6">
          {adminProjects.map(p => {
            const interestRateStr = p.interestRate.endsWith('%') ? p.interestRate.slice(0, -1) : p.interestRate;
            const interestRateVal = Number(interestRateStr);
            const formattedInterest = (isNaN(interestRateVal) ? p.interestRateValue * 100 : interestRateVal).toFixed(2) + ' %';
            const totalMinutes = p.durationDays * 24 * 60;

            return (
              <article 
                key={p.id} 
                className="bg-white rounded-2xl border border-zinc-200/60 overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col transition-all duration-300"
              >
                {/* Image with iOS Switch Switcher */}
                <div className="relative h-44 overflow-hidden bg-zinc-100 shrink-0">
                  {p.imageUrl ? (
                    <img 
                      src={p.imageUrl} 
                      alt={p.title} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 bg-zinc-50">
                      <Building2 className="w-10 h-10" />
                    </div>
                  )}
                  
                  {/* iOS Style Switch in Corner */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-md">
                      <span className="text-[8px] font-bold text-white uppercase tracking-widest select-none">
                        {p.status === 'ACTIVE' ? 'Đầu tư Mở' : 'Khóa'}
                      </span>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextStatus = p.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
                          updateProjectStatus(p.id, nextStatus);
                        }}
                        className={`w-9 h-5 rounded-full p-0.5 transition-all duration-200 cursor-pointer ${
                          p.status === 'ACTIVE' ? 'bg-[#a2855a]' : 'bg-zinc-650'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-200 ${
                          p.status === 'ACTIVE' ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Minimal Card Body */}
                <div className="p-5 flex-1 flex flex-col gap-4 bg-white">
                  <div className="flex items-start">
                    <div className="w-1.5 h-7.5 bg-[#a23b3b] rounded-full mr-3 shrink-0 mt-0.5"></div>
                    <h3 className="text-[15.5px] font-bold text-[#001839] font-['Montserrat'] leading-snug tracking-tight">
                      {p.title}
                    </h3>
                  </div>

                  {/* 3 Columns Stat Grid with dividers */}
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-4 text-center">
                    <div className="flex-1 flex flex-col items-center">
                      <span className="text-[#a23b3b] font-extrabold text-[15px] font-['Montserrat']">{formattedInterest}</span>
                      <span className="text-zinc-400 text-[9.5px] mt-1 font-semibold font-['Plus_Jakarta_Sans'] leading-normal">Lãi suất hàng ngày</span>
                    </div>
                    <div className="w-[1px] h-7 bg-zinc-200"></div>
                    <div className="flex-1 flex flex-col items-center">
                      <span className="text-[#a23b3b] font-extrabold text-[15px] font-['Montserrat']">{totalMinutes} phút</span>
                      <span className="text-zinc-400 text-[9.5px] mt-1 font-semibold font-['Plus_Jakarta_Sans'] leading-normal">Thời hạn của dự án</span>
                    </div>
                    <div className="w-[1px] h-7 bg-zinc-200"></div>
                    <div className="flex-1 flex flex-col items-center">
                      <span className="text-[#a23b3b] font-extrabold text-[15px] font-['Montserrat']">{p.minAmount.replace(' VNĐ', '')}</span>
                      <span className="text-zinc-400 text-[9.5px] mt-1 font-semibold font-['Plus_Jakarta_Sans'] leading-normal">Số tiền bắt đầu</span>
                    </div>
                  </div>

                  {/* Scale & Payout info */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[13px] font-semibold text-zinc-700">
                      <span>Quy mô dự án:</span>
                      <span className="text-[#001839] font-bold text-[14px] font-['Montserrat']">
                        {p.scale}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px] font-medium font-['Plus_Jakarta_Sans']">
                      Hoàn lãi hàng ngày, trả gốc khi đáo hạn
                    </p>
                  </div>

                  {/* Action button */}
                  <button 
                    onClick={() => {
                      if (balance < p.minInvestAmount) {
                        onNavigateToDeposit();
                      } else {
                        onSelectProject(p.id);
                      }
                    }} 
                    className={`w-full text-[13px] py-3 rounded-xl transition-all duration-200 flex items-center justify-center font-bold tracking-wider active:scale-[0.98] shadow-sm ${
                      p.status === 'ACTIVE'
                        ? 'bg-[#a2855a] text-white hover:bg-[#967a50]'
                        : 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
                    }`}
                    disabled={p.status !== 'ACTIVE'}
                  >
                    Gửi tiền ngay
                  </button>

                   {/* Interactive Progress Bar with range slider */}
                  <div className="flex items-center justify-between text-[13px] font-semibold text-zinc-700" onClick={(e) => e.stopPropagation()}>
                    <span className="text-zinc-500">Tiến độ:</span>
                    {isAdmin ? (
                      <div className="flex-1 mx-3 relative flex items-center h-4">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={p.progress} 
                          onChange={(e) => {
                            updateProjectDetails(p.id, { progress: Number(e.target.value) });
                          }}
                          className="custom-range-slider"
                        />
                      </div>
                    ) : (
                      <div className="flex-1 mx-3 relative flex items-center h-4">
                        <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-[#a2855a] h-full rounded-full transition-all duration-300"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <span className="text-[#001839] font-bold font-['Montserrat']">{p.progress}%</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
