import { motion } from 'motion/react';

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
  const isInvest = currentView === 'vinpearl_projects' || currentView === 'vinpearl_project_detail' || currentView === 'vinpearl_invest';

  const vipColorClass = "from-[#d4a373] to-[#b48b3b]"; 

  return (
    <nav 
      className="absolute bottom-0 left-0 right-0 bg-white border-t border-zinc-200/80 flex items-end justify-between px-4 pt-2.5 shadow-[0_-4px_25px_rgba(0,0,0,0.04)] z-50 select-none h-18"
      style={{ paddingBottom: 'calc(1.2rem + env(safe-area-inset-bottom))' }}
    >
      
      {/* Trang chủ */}
      <button 
        onClick={() => onViewChange && onViewChange('home')}
        className="flex flex-col items-center justify-center flex-1 cursor-pointer outline-none focus:outline-none"
      >
        <div className="p-1 mb-0.5">
          <svg 
            className={`h-5.5 w-5.5 transition-colors ${isHome ? 'text-[#b48b3b]' : 'text-zinc-400'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"></path>
          </svg>
        </div>
        <span className={`text-[9px] font-bold tracking-widest uppercase ${isHome ? 'text-[#b48b3b]' : 'text-zinc-400'}`}>
          Trang chủ
        </span>
      </button>

      {/* Đầu tư (Central Button) */}
      <button 
        onClick={() => onViewChange && onViewChange('vinpearl_projects')}
        className="flex flex-col items-center justify-center flex-1 -mt-7 cursor-pointer outline-none focus:outline-none relative z-10"
      >
        <motion.div 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className={`w-13 h-13 bg-gradient-to-b ${vipColorClass} rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(180,140,59,0.3)] border-2 border-white mb-0.5`}
        >
          <svg className="w-6.5 h-6.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="6" />
            <path d="M9.5 13.5L8.5 22l3.5-2.5 3.5 2.5-1-8.5" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points="12,5 12.8,7.3 15.2,7.3 13.2,8.7 14,11 12,9.6 10,11 10.8,8.7 8.8,7.3 11.2,7.3" fill="currentColor" />
          </svg>
        </motion.div>
        <span className={`text-[9px] font-bold uppercase tracking-widest ${isInvest ? 'text-[#b48b3b]' : 'text-zinc-450'}`}>
          Đầu tư
        </span>
      </button>

      {/* Cá nhân */}
      <button 
        onClick={() => onViewChange && onViewChange('profile')}
        className="flex flex-col items-center justify-center flex-1 cursor-pointer outline-none focus:outline-none"
      >
        <div className="p-1 mb-0.5">
          <svg 
            className={`h-5.5 w-5.5 transition-colors ${isProfile ? 'text-[#b48b3b]' : 'text-zinc-400'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"></path>
          </svg>
        </div>
        <span className={`text-[9px] font-bold tracking-widest uppercase ${isProfile ? 'text-[#b48b3b]' : 'text-zinc-400'}`}>
          Cá nhân
        </span>
      </button>

      {/* CSKH */}
      <button 
        onClick={() => onViewChange && onViewChange('cskh')}
        className="flex flex-col items-center justify-center flex-1 cursor-pointer outline-none focus:outline-none"
      >
        <div className="p-1 mb-0.5">
          <svg 
            className={`h-5.5 w-5.5 transition-colors ${isCskh ? 'text-[#b48b3b]' : 'text-zinc-400'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18.4 12c.4 3.8-3 7-7 7s-7-3.2-7-7c0-2 .8-3.9 2.2-5.3L11.4 2v4M15 11h.01M9 11h.01M12 14h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"></path>
          </svg>
        </div>
        <span className={`text-[9px] font-bold tracking-widest uppercase ${isCskh ? 'text-[#b48b3b]' : 'text-zinc-400'}`}>
          CSKH
        </span>
      </button>

    </nav>
  );
}
