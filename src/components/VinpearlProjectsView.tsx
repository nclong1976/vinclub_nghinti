import React, { useContext } from 'react';
import { ArrowLeft, Building2, Banknote, ArrowRight, Handshake } from 'lucide-react';
import { UserContext } from './UserContext';

interface VinpearlProjectsViewProps {
  onBack: () => void;
  onSelectProject: (projectId: string) => void;
  onNavigate: (view: any) => void;
}

export default function VinpearlProjectsView({ onBack, onSelectProject, onNavigate }: VinpearlProjectsViewProps) {
  const { adminProjects } = useContext(UserContext);

  return (
    <div className="flex-1 overflow-y-auto bg-[#f7f9fb] flex flex-col min-h-screen text-[#001839] pb-32">
      <header className="w-full top-0 sticky z-40 bg-white border-b border-[#E2E8F0] flex items-center px-4 h-16 gap-3">
        <button onClick={onBack} className="text-[#001839] hover:bg-[#f2f4f6] transition-colors p-2 rounded-full active:opacity-80">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-[20px] text-[#001839] font-['Montserrat']">Siêu dự án Đầu tư</h1>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 md:px-6 pt-8 w-full">
        <section className="mb-8 text-center md:text-left">
          <h2 className="text-[28px] md:text-[40px] font-bold text-[#001839] mb-2 font-['Montserrat'] leading-tight tracking-tight">Cơ hội sinh lời vượt trội</h2>
          <p className="text-[14px] md:text-[16px] text-[#475569] max-w-2xl font-['Plus_Jakarta_Sans'] leading-relaxed">
            Danh mục các siêu dự án trọng điểm với tiềm năng tăng trưởng bứt phá, dành riêng cho các nhà đầu tư chiến lược.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminProjects.map(p => (
            <article key={p.id} className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
              <div className="relative h-48 md:h-60 overflow-hidden bg-[#e6e8ea]">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                    <Building2 className="w-12 h-12" />
                  </div>
                )}
                
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  {p.title === 'VinFast Global Giga-Factory' ? (
                    <div className="bg-[#001839] text-white px-3.5 py-1.5 rounded-md border border-[#001839] shadow-sm flex items-center gap-1.5">
                      <Handshake className="w-3.5 h-3.5 text-white" />
                      <span className="text-[11px] font-bold tracking-wide uppercase font-['Plus_Jakarta_Sans']">Đối tác chiến lược</span>
                    </div>
                  ) : (
                    <div className="bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#E2E8F0] shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#C49A6C]"></span>
                      <span className="text-[11px] font-bold text-[#001839] tracking-wider uppercase font-['Plus_Jakarta_Sans']">Đang gọi vốn</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-[20px] md:text-[22px] font-bold text-[#001839] mb-4 line-clamp-2 font-['Montserrat'] min-h-[56px] leading-tight">
                  {p.title}
                </h3>
                
                <div className="space-y-4 flex-1 mb-6">
                  <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-3">
                    <span className="text-[14px] text-[#475569] flex items-center gap-2 font-['Plus_Jakarta_Sans'] font-medium">
                      <Building2 className="w-[18px] h-[18px] text-[#64748B]" /> Quy mô
                    </span>
                    <span className="text-[20px] font-bold text-[#001839] font-['Montserrat']">
                      {p.scale || `${(p.targetCapital || 0)/10**9} Tỷ VNĐ`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-3">
                    <span className="text-[14px] text-[#475569] flex items-center gap-2 font-['Plus_Jakarta_Sans'] font-medium">
                      <Banknote className="w-[18px] h-[18px] text-[#64748B]" /> Đầu tư tối thiểu
                    </span>
                    <span className="text-[20px] font-bold text-[#C49A6C] font-['Montserrat']">
                      {p.minAmount.endsWith('VNĐ') ? p.minAmount : `${p.minAmount} VNĐ`}
                    </span>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2 text-[#475569] font-['Plus_Jakarta_Sans']">
                      <span>Tiến độ huy động</span>
                      <span className="text-[#001839]">{p.progress}%</span>
                    </div>
                    <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#001839] h-1.5 rounded-full transition-all duration-500" style={{ width: `${p.progress}%` }}></div>
                    </div>
                  </div>
                </div>

                {p.status === 'ACTIVE' ? (
                  <button 
                    onClick={() => onSelectProject(p.id)} 
                    className={`w-full text-[14px] py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-bold font-['Plus_Jakarta_Sans'] active:scale-[0.98] ${
                      p.title === 'VinFast Global Giga-Factory'
                        ? 'bg-white text-[#001839] border border-[#E2E8F0] hover:bg-gray-50 hover:border-gray-300'
                        : 'bg-[#001839] text-white hover:bg-[#002c5f] shadow-[0_4px_12px_rgba(0,24,57,0.15)]'
                    }`}
                  >
                    Chi tiết <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-full bg-[#F1F5F9] text-[#94A3B8] text-[14px] py-3 rounded-lg flex items-center justify-center gap-2 font-bold font-['Plus_Jakarta_Sans'] border border-[#E2E8F0]">
                    ĐÃ ĐÓNG / ĐỦ VỐN
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
