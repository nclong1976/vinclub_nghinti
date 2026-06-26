import { ChevronLeft } from 'lucide-react';

export default function CasinoHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-[#0f0f0f] px-4 py-4 flex items-center gap-2 sticky top-0 z-20 shadow-lg border-b border-zinc-900/80">
      <button 
        onClick={onBack} 
        className="p-1 -ml-1 hover:bg-zinc-900/50 rounded-full transition-colors active:scale-95 text-[#c29b57]"
      >
        <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
      </button>
      <div className="flex-1 text-center pr-6">
        <h2 className="text-[13px] sm:text-[14px] font-bold text-[#ebd5ad] tracking-widest uppercase leading-snug">
          CASINO CORONA PHÚ QUỐC
        </h2>
        <p className="text-[9px] text-zinc-500 font-medium tracking-wider">Hệ thống trò chơi thượng lưu đặc quyền</p>
      </div>
    </div>
  );
}
