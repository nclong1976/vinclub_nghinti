import React, { useContext, useState } from 'react';
import { ArrowLeft, Building2, Banknote, ArrowRight, Handshake, TrendingUp, Clock } from 'lucide-react';
import { UserContext } from './UserContext';

interface VinpearlProjectsViewProps {
  onBack: () => void;
  onSelectProject: (projectId: string) => void;
  onNavigate: (view: any) => void;
}

export default function VinpearlProjectsView({ onBack, onSelectProject, onNavigate }: VinpearlProjectsViewProps) {
  const { adminProjects } = useContext(UserContext);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  const categories = ['Tất cả', 'Vinpearl', 'Vinhomes', 'VinFast'];

  const filteredProjects = selectedCategory === 'Tất cả'
    ? adminProjects
    : adminProjects.filter(p => p.category === selectedCategory);

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] flex flex-col min-h-screen text-[#011632] pb-32">
      {/* Premium Sticky Header */}
      <header className="w-full top-0 sticky z-40 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] flex items-center px-4 h-16 gap-3">
        <button onClick={onBack} id="btn-back-projects" className="text-[#011632] hover:bg-[#f1f5f9] transition-all p-2 rounded-full active:scale-95">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-[18px] text-[#011632] font-['Montserrat'] uppercase tracking-wider">Siêu dự án Đầu tư</h1>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:px-6 pt-6 w-full flex-1 flex flex-col">
        {/* Luxury Banner text */}
        <section className="mb-6 text-center md:text-left">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C49A6C] bg-amber-50 px-3 py-1 rounded-md border border-amber-100 inline-block mb-2 font-['Montserrat']">
            Vingroup Investment
          </span>
          <h2 className="text-[24px] md:text-[32px] font-bold text-[#011632] mb-2 font-['Montserrat'] leading-tight tracking-tight">
            Cơ Hội Đầu Tư Thượng Lưu
          </h2>
          <p className="text-[13px] md:text-[14px] text-[#64748B] max-w-2xl font-['Plus_Jakarta_Sans'] leading-relaxed">
            Danh mục các siêu dự án tầm cỡ quốc tế được quản lý và bảo chứng bởi hệ sinh thái Vingroup. Sinh lời an toàn, vững bền theo thời gian.
          </p>
        </section>

        {/* Categories Tab Selector - Ultra Luxe & Responsive */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-[#F1F5F9] shrink-0">
          {categories.map(cat => (
            <button
              key={cat}
              id={`tab-cat-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-[13px] font-semibold font-['Plus_Jakarta_Sans'] transition-all duration-300 whitespace-nowrap active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-[#011632] text-white shadow-md shadow-[#011632]/10 border border-[#011632]'
                  : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              {cat === 'Tất cả' ? 'Tất cả siêu dự án' : cat}
            </button>
          ))}
        </div>

        {/* Dynamic Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-[#E2E8F0] p-8">
            <Building2 className="w-12 h-12 text-[#94A3B8] mb-3 stroke-1" />
            <p className="text-[#64748B] font-medium font-['Plus_Jakarta_Sans']">Không có dự án nào thuộc mục này hiện tại.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p, index) => (
              <article
                key={p.id}
                id={`project-card-${p.id}`}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-[0_12px_24px_rgba(1,22,50,0.06)] transition-all duration-300 group flex flex-col relative"
              >
                {/* Image Section with Tags */}
                <div className="relative h-44 md:h-52 overflow-hidden bg-[#E2E8F0]">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#94A3B8] bg-slate-50">
                      <Building2 className="w-10 h-10 stroke-1" />
                    </div>
                  )}

                  {/* High-end badge layer */}
                  <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-[#011632] border border-[#E2E8F0] shadow-sm uppercase tracking-wider font-['Plus_Jakarta_Sans']">
                      {p.category}
                    </span>
                    {p.status === 'ACTIVE' ? (
                      <span className="bg-amber-500 text-white px-3 py-1 rounded-lg text-[10px] font-extrabold shadow-sm uppercase tracking-wider font-['Plus_Jakarta_Sans'] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        Đang gọi vốn
                      </span>
                    ) : (
                      <span className="bg-[#64748B] text-white px-3 py-1 rounded-lg text-[10px] font-bold shadow-sm uppercase tracking-wider font-['Plus_Jakarta_Sans']">
                        Đủ vốn
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Project Title */}
                    <h3 className="text-[17px] md:text-[18px] font-bold text-[#011632] mb-3 line-clamp-2 font-['Montserrat'] leading-snug min-h-[48px] group-hover:text-[#C49A6C] transition-colors">
                      {p.title}
                    </h3>

                    {/* Premium 2x2 Mini Stats Grid */}
                    <div className="grid grid-cols-2 gap-3.5 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#F1F5F9] mb-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold font-['Plus_Jakarta_Sans'] flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-[#C49A6C]" /> Lợi nhuận
                        </span>
                        <span className="text-[14px] font-bold text-[#C49A6C] font-['Montserrat']">
                          {p.interestRate}
                        </span>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold font-['Plus_Jakarta_Sans'] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> Kỳ hạn
                        </span>
                        <span className="text-[14px] font-bold text-[#011632] font-['Montserrat']">
                          {p.duration}
                        </span>
                      </div>

                      <div className="flex flex-col gap-0.5 col-span-2 border-t border-[#EDF2F7] pt-2 mt-0.5">
                        <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold font-['Plus_Jakarta_Sans'] flex items-center gap-1">
                          <Banknote className="w-3 h-3 text-emerald-500" /> Vốn đầu tư tối thiểu
                        </span>
                        <span className="text-[14px] font-bold text-[#011632] font-['Montserrat']">
                          {p.minAmount.endsWith('VNĐ') ? p.minAmount : `${p.minAmount} VNĐ`}
                        </span>
                      </div>
                    </div>

                    {/* Capital Progress */}
                    <div className="space-y-1.5 mb-5">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-[#64748B] font-['Plus_Jakarta_Sans']">
                        <span>Tiến độ huy động</span>
                        <span className="text-[#011632] font-extrabold">{p.progress}%</span>
                      </div>
                      <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-[#C49A6C] h-full rounded-full transition-all duration-500"
                          style={{ width: `${p.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {p.status === 'ACTIVE' ? (
                    <button
                      onClick={() => onSelectProject(p.id)}
                      id={`btn-invest-project-${p.id}`}
                      className="w-full text-[13px] py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold font-['Plus_Jakarta_Sans'] bg-[#011632] text-white hover:bg-[#002554] shadow-md shadow-[#011632]/5 active:scale-[0.98]"
                    >
                      Chi tiết dự án <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="w-full bg-[#F1F5F9] text-[#94A3B8] text-[13px] py-3 rounded-xl flex items-center justify-center gap-2 font-bold font-['Plus_Jakarta_Sans'] border border-[#E2E8F0]">
                      ĐÃ ĐÓNG / ĐỦ VỐN
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
