import { motion } from 'motion/react';
import { useUser } from './UserContext';

export default function BottomNav({ 
  currentView, 
  onViewChange 
}: { 
  currentView?: string; 
  onViewChange?: (view: string) => void 
}) {
  const isHome = currentView === 'home';
  const isProfile = currentView === 'profile';
  const isCskh = currentView === 'cskh';

  const { transactions } = useUser();
  const totalDeposit = transactions
    .filter(t => t.type === 'deposit' && t.status === 'Thành công')
    .reduce((sum, t) => sum + t.amount, 0);

  let vipColorClass = "from-[#9e9e9e] to-[#5e5e5e]"; // Default Member color (silver-ish)
  if (totalDeposit >= 10000000000) {
    vipColorClass = "from-[#4a4a4a] to-[#121212]"; // VVIP (black/dark)
  } else if (totalDeposit >= 5000000000) {
    vipColorClass = "from-[#e65c00] to-[#F9D423]"; // VIP (orange/gold)
  } else if (totalDeposit >= 1000000000) {
    vipColorClass = "from-[#E5C185] to-[#A67C37]"; // Gold
  }

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-[#C49A6C]/20 flex items-end justify-between px-4 pt-2 max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-50 select-none"
      style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
    >
      
      {/* Trang chủ */}
      <button 
        onClick={() => onViewChange && onViewChange('home')}
        className="flex flex-col items-center justify-center flex-1 cursor-pointer outline-none focus:outline-none"
      >
        <div className="p-1 mb-1">
          <svg 
            className={`h-6 w-6 transition-colors ${isHome ? 'text-[#d4a373]' : 'text-zinc-500'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
            <circle cx="12" cy="3" r="1" fill="currentColor"></circle>
          </svg>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${isHome ? 'text-[#d4a373]' : 'text-zinc-500'}`}>
          Trang chủ
        </span>
      </button>

      {/* THẺ VIP (Central Button) */}
      <button 
        onClick={() => onViewChange && onViewChange('qr')}
        className="flex flex-col items-center justify-center flex-1 -mt-8 cursor-pointer outline-none focus:outline-none relative"
      >
        <motion.div 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 bg-gradient-to-b ${vipColorClass} rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(196,154,108,0.4)] border-2 border-[#121212] mb-1`}
        >
          <svg className="w-8 h-8 text-[#121212]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 15h6v6H3v-6zm2 2v2h2v-2H5zm10-2h2v2h-2v-2zm2 2h2v2h-2v-2zm0-2h2v2h-2v-2zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2zM13 13h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2z"></path>
          </svg>
        </motion.div>
        <span className="text-[10px] font-bold text-[#d4a373] uppercase tracking-widest">
          THẺ VIP
        </span>
      </button>

      {/* Cá nhân */}
      <button 
        onClick={() => onViewChange && onViewChange('profile')}
        className="flex flex-col items-center justify-center flex-1 cursor-pointer outline-none focus:outline-none"
      >
        <div className="p-1 mb-1">
          <svg 
            className={`h-6 w-6 transition-colors ${isProfile ? 'text-[#d4a373]' : 'text-zinc-500'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
          </svg>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${isProfile ? 'text-[#d4a373]' : 'text-zinc-500'}`}>
          Cá nhân
        </span>
      </button>

      {/* CSKH 24/7 */}
      <button 
        onClick={() => onViewChange && onViewChange('cskh')}
        className="flex flex-col items-center justify-center flex-1 cursor-pointer outline-none focus:outline-none"
      >
        <div className="p-1 mb-1">
          <svg 
            className={`h-6 w-6 transition-colors ${isCskh ? 'text-[#d4a373]' : 'text-zinc-500'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
          </svg>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${isCskh ? 'text-[#d4a373]' : 'text-zinc-500'}`}>
          CSKH 24/7
        </span>
      </button>

    </nav>
  );
}
