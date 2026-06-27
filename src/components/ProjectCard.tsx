import { useState } from 'react';
import { Project } from '../types';
import EditableImage from './EditableImage';
import ContractPreviewModal from './ContractPreviewModal';

export default function ProjectCard({ project, onInvest }: { project: Project, onInvest: () => void }) {
  const [showContract, setShowContract] = useState(false);

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl hover:border-[#c29b57]/30 transition-all duration-300 relative group flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950">
        <EditableImage
          imageKey={`project-img-${project.id}`}
          defaultSrc={project.imageUrl || ""}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none"></div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        {/* Title */}
        <div className="flex items-start gap-2.5 mb-3.5">
          <div className="w-1 h-5 bg-[#c29b57] shrink-0 mt-[1.5px] rounded-sm"></div>
          <h3 className="font-bold text-[13.5px] sm:text-[14.5px] text-zinc-100 leading-snug group-hover:text-[#ebd5ad] transition-colors">{project.title}</h3>
        </div>

        {/* 3 Columns Stats - Highly snug and clear for mobile screen sizes */}
        <div className="grid grid-cols-3 gap-1.5 mb-4 border-b border-zinc-800/60 pb-3.5">
          <div className="text-center">
            <div className="text-[#c29b57] font-bold text-[12px] sm:text-[13px]">{project.interestRate}</div>
            <div className="text-zinc-500 text-[9px] mt-0.5 uppercase tracking-wider">Hàng ngày</div>
          </div>
          <div className="text-center border-x border-zinc-800/60">
            <div className="text-[#c29b57] font-bold text-[12px] sm:text-[13px]">{project.duration}</div>
            <div className="text-zinc-500 text-[9px] mt-0.5 uppercase tracking-wider">Thời hạn</div>
          </div>
          <div className="text-center">
            <div className="text-[#c29b57] font-bold text-[12px] sm:text-[13px]">{project.minAmount}</div>
            <div className="text-zinc-500 text-[9px] mt-0.5 uppercase tracking-wider">Tối thiểu</div>
          </div>
        </div>

        {/* Info */}
        <div className="mb-4 space-y-1 text-[11px] sm:text-[12px] border-b border-zinc-800/60 pb-3.5">
          <div className="text-zinc-400 flex items-center justify-between">
            <span>Quy mô:</span>
            <span className="text-zinc-200 font-medium">{project.scale}</span>
          </div>
          <div className="text-[#ebd5ad]/90 text-center font-medium bg-[#c29b57]/5 rounded-lg py-1 border border-[#c29b57]/10 text-[10px] uppercase tracking-wider mt-1">
            Hoàn lãi mỗi ngày, gốc hoàn đáo hạn
          </div>
        </div>

        {/* Button & Progress bar */}
        <div>
          <div className="space-y-2 mb-3.5">
            {project.status === 'ACTIVE' || !project.status ? (
              <>
                <button 
                  onClick={onInvest}
                  className="w-full bg-gradient-to-r from-[#c29b57] to-[#ebd5ad] hover:from-[#ebd5ad] hover:to-[#c29b57] text-black font-bold text-[12.5px] sm:text-[13.5px] py-2.5 rounded-xl transition-all duration-300 shadow-md active:scale-[0.98] cursor-pointer uppercase tracking-wider"
                >
                  Gửi tiền ngay
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowContract(true)}
                    className="flex-1 border border-[#c29b57] text-[#c29b57] hover:bg-[#c29b57]/10 font-bold text-[10px] py-2 rounded-xl transition-all uppercase tracking-wider"
                  >
                    Xem hợp đồng
                  </button>
                  <button 
                    onClick={() => setShowContract(true)}
                    className="flex-1 border border-[#c29b57] text-[#c29b57] hover:bg-[#c29b57]/10 font-bold text-[10px] py-2 rounded-xl transition-all uppercase tracking-wider"
                  >
                    Ký điện tử
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full bg-zinc-800 text-zinc-500 text-[12.5px] sm:text-[13.5px] py-3 rounded-xl flex items-center justify-center font-bold border border-zinc-700/50 uppercase tracking-wider select-none">
                ĐÃ ĐÓNG / ĐỦ VỐN
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-zinc-500 shrink-0">Đã bán:</span>
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#c29b57] to-[#ebd5ad] rounded-full" 
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <span className="text-zinc-300 font-bold shrink-0">{project.progress}%</span>
          </div>
        </div>
      </div>

      {showContract && (
        <ContractPreviewModal project={project} onClose={() => setShowContract(false)} />
      )}
    </div>
  );
}
