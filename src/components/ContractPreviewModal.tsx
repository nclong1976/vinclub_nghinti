import React, { useState } from 'react';
import { Project } from '../types';
import ContractSign from './ContractSign';
import { X, CheckCircle2 } from 'lucide-react';

interface ContractPreviewModalProps {
  project: Project;
  onClose: () => void;
}

export default function ContractPreviewModal({ project, onClose }: ContractPreviewModalProps) {
  const [signed, setSigned] = useState(false);

  const handleSignComplete = (type: string, content: string) => {
    setSigned(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#080808] w-full max-w-md rounded-none md:rounded-2xl overflow-hidden shadow-2xl flex flex-col relative h-full md:h-auto md:max-h-[92vh] overflow-y-auto scrollbar-hide border border-zinc-800/60">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/60 bg-[#0f0f0f]/95 sticky top-0 z-10 shrink-0">
          <h2 className="font-bold text-white text-[15px] uppercase tracking-wider font-['Montserrat']">Hợp đồng điện tử</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-zinc-800 rounded-full transition-colors active:scale-95"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {signed ? (
            <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-4 animate-in zoom-in-95 my-auto">
              <div className="w-16 h-16 bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-450 mb-2 border border-emerald-900/60">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-['Montserrat'] font-bold text-[18px] text-white">Ký Hợp Đồng Thành Công</h3>
              <p className="text-[13px] text-zinc-400 leading-relaxed max-w-[280px]">
                Chữ ký điện tử của bạn đã được xác thực và lưu trữ thành công cho dự án <strong className="text-white font-bold">{project.title}</strong>.
              </p>
              <button 
                onClick={onClose}
                className="mt-6 w-full py-3.5 bg-gradient-to-r from-[#c29b57] to-[#ebd5ad] text-black font-extrabold rounded-xl uppercase tracking-wider text-[12px] active:scale-95 transition-all shadow-[0_4px_15px_rgba(194,155,87,0.15)]"
              >
                Đóng
              </button>
            </div>
          ) : (
            <div className="h-full bg-[#080808]">
              <ContractSign 
                project={project} 
                amount={project.minInvestAmount} 
                onSignComplete={handleSignComplete} 
                onBack={onClose} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
