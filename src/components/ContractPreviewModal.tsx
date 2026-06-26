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
      <div className="bg-white w-full max-w-md rounded-none md:rounded-2xl overflow-hidden shadow-2xl flex flex-col relative h-full md:h-auto md:max-h-[92vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 bg-[#f7f9fb] sticky top-0 z-10 shrink-0">
          <h2 className="font-bold text-[#001839] text-[16px] uppercase tracking-wider">Hợp đồng điện tử</h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {signed ? (
            <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-[18px] text-[#001839]">Ký Hợp Đồng Thành Công</h3>
              <p className="text-[13px] text-zinc-500">
                Chữ ký điện tử của bạn đã được xác thực và lưu trữ thành công cho dự án <strong className="text-[#001839]">{project.title}</strong>.
              </p>
              <button 
                onClick={onClose}
                className="mt-6 w-full py-3 bg-[#001839] text-white rounded-xl font-bold uppercase tracking-wider"
              >
                Đóng
              </button>
            </div>
          ) : (
            <div className="h-full">
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
