import React, { useState, useContext } from 'react';
import { ArrowLeft, Bell, MapPin, Building2, Wallet, TrendingUp, DollarSign, FileText } from 'lucide-react';
import { UserContext } from './UserContext';
import ContractPreviewModal from './ContractPreviewModal';

interface VinpearlProjectDetailViewProps {
  projectId?: string;
  onBack: () => void;
  onInvest: () => void;
  onNavigateToDeposit: () => void;
}

export default function VinpearlProjectDetailView({ projectId, onBack, onInvest, onNavigateToDeposit }: VinpearlProjectDetailViewProps) {
  const { adminProjects, updateProjectStatus, updateProjectDetails, role, balance } = useContext(UserContext);
  const isAdmin = role === 'admin' || role === 'super_admin';
  const [showContract, setShowContract] = useState(false);

  // Look up the selected project, or default to the first project in adminProjects
  const project = adminProjects.find(p => p.id === projectId) || adminProjects[0];

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#050505] text-zinc-550">
        Đang tải dữ liệu dự án...
      </div>
    );
  }

  // Set localized locations
  const getProjectLocation = (title: string) => {
    if (title.includes('Trống Đồng')) return 'Hà Nội, Việt Nam';
    if (title.includes('Hạ Long Xanh')) return 'Quảng Ninh, Việt Nam';
    if (title.includes('Harbour')) return 'Nha Trang, Việt Nam';
    if (title.includes('Royal')) return 'Vũ Yên, Hải Phòng, Việt Nam';
    return 'Việt Nam';
  };

  const getProjectDescription = (title: string) => {
    if (title.includes('Trống Đồng')) {
      return 'Quỹ Phát Triển Thể Dục Thể Thao phục vụ xây dựng và phát triển dự án Sân Vận Động Trống Đồng hiện đại bậc nhất quốc gia. Dự án tạo lập hạ tầng huấn luyện, đào tạo thi đấu thể chất chất lượng cao, thúc đẩy phong trào thể dục thể thao và bóng đá nước nhà phát triển vượt bậc.';
    }
    if (title.includes('Hạ Long Xanh')) {
      return 'Đại đô thị phức hợp sinh thái nghỉ dưỡng Hạ Long Xanh tại Quảng Ninh là dự án siêu đô thị thông minh hiện đại hàng đầu Việt Nam. Tận dụng vị thế vịnh kỳ quan độc bản, dự án kiến tạo không gian sống, du lịch và giao thương thượng lưu chuẩn mực quốc tế.';
    }
    if (title.includes('Harbour')) {
      return 'Vinpearl Harbour Nha Trang là siêu quần thể nghỉ dưỡng, vui chơi giải trí và thương mại dịch vụ mang tầm quốc tế.';
    }
    return 'Dự án đầu tư chiến lược thuộc hệ sinh thái. Cam kết lợi nhuận hấp dẫn cùng các đặc quyền ưu đãi vượt trội dành riêng cho các nhà đầu tư.';
  };

  const targetCapital = project.targetCapital || 35000000000000;
  const raisedCapital = project.raisedCapital || (targetCapital * (project.progress / 100));
  const remainingCapital = targetCapital - raisedCapital;

  const formatCapital = (val: number) => {
    return (val / 10**9).toLocaleString('vi-VN') + ' Tỷ';
  };

  return (
    <div className="bg-[#050505] text-zinc-100 font-['Plus_Jakarta_Sans'] antialiased flex flex-col h-full relative overflow-y-auto w-full">
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
          height: 4px;
          cursor: pointer;
          background: #222222;
          border-radius: 2px;
        }
        .custom-range-slider::-webkit-slider-thumb {
          height: 12px;
          width: 12px;
          border-radius: 9999px;
          background: #c29b57;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -4px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.6);
          border: 1px solid #ebd5ad;
          transition: transform 0.1s;
        }
        .custom-range-slider::-webkit-slider-thumb:active {
          transform: scale(1.35);
        }
      `}</style>

      {/* TopAppBar */}
      <header className="bg-[#050505]/95 backdrop-blur-md text-white font-['Montserrat'] sticky top-0 w-full z-50 flex items-center justify-between px-5 py-4 pt-[calc(env(safe-area-inset-top)+1rem)] border-b border-zinc-900 shadow-md shrink-0">
        <button 
          onClick={onBack} 
          className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-all active:scale-95 duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-400 hover:text-white" />
        </button>
        <h1 className="font-bold text-[15px] tracking-widest uppercase">Đầu tư Chi tiết</h1>
        <button className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-all active:scale-95 duration-200">
          <Bell className="w-5 h-5 text-zinc-400 hover:text-white" />
        </button>
      </header>
      
      <main className="w-full px-5 py-5 flex flex-col gap-6 flex-1 pb-36">
        {/* Minimal Hero Section */}
        <section className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-900/60 bg-zinc-950">
          {project.imageUrl ? (
            <img 
              className="w-full h-56 object-cover opacity-75" 
              alt={project.title} 
              src={project.imageUrl}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-56 bg-zinc-950 flex items-center justify-center text-zinc-800">
              <Building2 className="w-12 h-12" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent flex flex-col justify-end p-5">
            <h2 className="font-['Montserrat'] text-[18px] font-bold text-white mb-2 leading-tight">
              {project.title}
            </h2>
            <div className="flex items-center text-zinc-400 gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c29b57]" />
              <span className="text-[12px] font-medium">{getProjectLocation(project.title)}</span>
            </div>
          </div>

          {/* iOS Style Switch in Corner */}
          {isAdmin && (
            <div className="absolute top-3 right-3 z-30 flex items-center gap-2 bg-[#000000]/70 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-zinc-900/60 shadow-lg">
              <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest select-none">
                {project.status === 'ACTIVE' ? 'Đầu tư Mở' : 'Khóa'}
              </span>
              <div 
                onClick={() => {
                  const nextStatus = project.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
                  updateProjectStatus(project.id, nextStatus);
                }}
                className={`w-9 h-5 rounded-full p-0.5 transition-all duration-200 cursor-pointer ${
                  project.status === 'ACTIVE' ? 'bg-[#c29b57]' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-200 ${
                  project.status === 'ACTIVE' ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
            </div>
          )}
        </section>

        {/* Minimal Progress Section */}
        <section className="bg-[#0b0b0b] rounded-2xl p-5 border border-zinc-900/60 shadow-md">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="font-['Montserrat'] text-[14px] font-bold text-[#c29b57] tracking-wider mb-1 uppercase">Tiến độ huy động</h3>
              <p className="text-[12px] text-zinc-500">
                Mục tiêu: <span className="font-bold text-white">{project.scale ? project.scale : `${formatCapital(targetCapital)} VNĐ`}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="font-['Montserrat'] text-[20px] text-[#c29b57] font-black block leading-none">
                {project.progress}%
              </span>
            </div>
          </div>

          {/* Interactive Range Progress Bar */}
          {isAdmin ? (
            <div className="relative flex items-center w-full h-6">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={project.progress} 
                onChange={(e) => {
                  updateProjectDetails(project.id, { progress: Number(e.target.value) });
                }}
                className="custom-range-slider"
              />
            </div>
          ) : (
            <div className="relative flex items-center w-full h-4 my-1">
              <div className="w-full bg-[#222222] rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-[#c29b57] h-full rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-3 text-[11px] font-semibold text-zinc-500">
            <span>Đã đạt: {formatCapital(raisedCapital)} VNĐ</span>
            <span>Còn lại: {formatCapital(remainingCapital)} VNĐ</span>
          </div>
        </section>

        {/* Financial Metrics (Minimal) */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-[#0b0b0b] rounded-xl p-4 border border-zinc-900/60 flex flex-col gap-1 shadow-sm">
            <Building2 className="w-4 h-4 text-[#c29b57] mb-1" />
            <span className="text-[11px] text-zinc-500">Quy mô</span>
            <span className="font-['Montserrat'] text-[14px] font-bold text-white">
              {project.scale ? project.scale.replace(' VNĐ', '') : formatCapital(targetCapital)}
            </span>
          </div>
          <div className="bg-[#0b0b0b] rounded-xl p-4 border border-zinc-900/60 flex flex-col gap-1 shadow-sm">
            <Wallet className="w-4 h-4 text-[#c29b57] mb-1" />
            <span className="text-[11px] text-zinc-500">Đã góp</span>
            <span className="font-['Montserrat'] text-[14px] font-bold text-white">
              {formatCapital(raisedCapital)}
            </span>
          </div>
          <div className="bg-[#0b0b0b] rounded-xl p-4 border border-zinc-900/60 flex flex-col gap-1 shadow-sm">
            <TrendingUp className="w-4 h-4 text-[#c29b57] mb-1" />
            <span className="text-[11px] text-zinc-500">Cần huy động</span>
            <span className="font-['Montserrat'] text-[14px] font-bold text-white">
              {formatCapital(remainingCapital)}
            </span>
          </div>
          <div className="bg-[#c29b57]/5 rounded-xl p-4 border border-[#c29b57]/20 flex flex-col gap-1 shadow-sm">
            <DollarSign className="w-4 h-4 text-[#c29b57] mb-1" />
            <span className="text-[11px] text-[#c29b57] font-semibold">Tối thiểu</span>
            <span className="font-['Montserrat'] text-[14px] font-bold text-[#c29b57]">
              {project.minAmount}
            </span>
          </div>
        </section>

        {/* Minimal Description */}
        <section className="bg-[#0b0b0b] rounded-2xl p-5 border border-zinc-900/60 shadow-md">
          <h3 className="font-['Montserrat'] text-[14px] font-bold text-[#c29b57] mb-3 flex items-center gap-2 uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            Tổng quan
          </h3>
          <p className="text-[12px] text-zinc-400 leading-relaxed font-['Plus_Jakarta_Sans'] font-medium">
            {getProjectDescription(project.title)}
          </p>
        </section>
      </main>

      {/* CTA Bottom Section */}
      <div 
        className="fixed bottom-0 left-0 right-0 w-full p-4 bg-[#050505]/95 backdrop-blur-md border-t border-zinc-900/60 z-40 max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.7)] shrink-0" 
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        <div className="flex flex-col gap-3">
          <div className="flex w-full gap-2">
            <button 
              onClick={() => setShowContract(true)}
              className="flex-1 bg-transparent hover:bg-zinc-900 text-zinc-300 border border-zinc-800 text-[10px] font-bold py-3 px-1 rounded-xl transition-all active:scale-95 duration-200 uppercase tracking-widest"
            >
              Hợp đồng
            </button>
            <button 
              onClick={() => setShowContract(true)}
              className="flex-1 bg-transparent hover:bg-zinc-900 text-[#c29b57] border border-[#c29b57]/30 text-[10px] font-bold py-3 px-1 rounded-xl transition-all active:scale-95 duration-200 uppercase tracking-widest"
            >
              Ký điện tử
            </button>
          </div>
          <button 
            onClick={() => {
              if (balance < project.minInvestAmount) {
                onNavigateToDeposit();
              } else {
                onInvest();
              }
            }}
            disabled={project.status !== 'ACTIVE'}
            className={`w-full text-[11px] py-3.5 rounded-xl transition-all duration-200 uppercase tracking-widest font-bold ${
              project.status === 'ACTIVE'
                ? 'bg-gradient-to-r from-[#c29b57] to-[#ebd5ad] text-black shadow-[0_4px_15px_rgba(194,155,87,0.15)] active:scale-95'
                : 'bg-zinc-950 border border-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
          >
            Đầu tư ngay
          </button>
        </div>
      </div>

      {showContract && (
        <ContractPreviewModal project={project} onClose={() => setShowContract(false)} />
      )}
    </div>
  );
}
