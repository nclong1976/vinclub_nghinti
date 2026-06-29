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
  const isVipCard = currentView === 'cardRanking';

  const goldGradient = "from-[#FFE082] via-[#c29b57] to-[#8D6E63]"; 

  return (
    <nav 
      className="absolute bottom-0 left-0 right-0 bg-[#0c0c0e] border-t border-zinc-800/80 flex items-end justify-between px-4 pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.4)] z-50 select-none h-20"
      style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
    >
      
      {/* Trang chủ */}
      <button 
        onClick={() => onViewChange && onViewChange('home')}
        className="flex flex-col items-center justify-center flex-1 cursor-pointer outline-none focus:outline-none relative group"
      >
        <div className="p-1 mb-1 transition-transform duration-200 group-active:scale-90">
          <svg 
            className={`h-6 w-6 transition-all duration-300 ${
              isHome 
                ? 'text-[#c29b57] filter drop-shadow-[0_2px_8px_rgba(194,155,87,0.4)]' 
                : 'text-zinc-500 hover:text-zinc-350'
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L3 9H5V21H19V9H21L12 2Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 21V12H15V21" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className={`text-[8.5px] font-black tracking-widest uppercase transition-colors duration-300 ${
          isHome ? 'text-[#c29b57]' : 'text-zinc-500'
        }`}>
          Trang chủ
        </span>
        {isHome && (
          <motion.div 
            layoutId="activeIndicator"
            className="absolute -bottom-1.5 w-1 h-1 bg-[#c29b57] rounded-full shadow-[0_0_8px_#c29b57]"
          />
        )}
      </button>

      {/* Thẻ VIP (Central Medallion Button) */}
      <button 
        onClick={() => onViewChange && onViewChange('cardRanking')}
        className="flex flex-col items-center justify-center flex-1 -mt-9 cursor-pointer outline-none focus:outline-none relative z-10"
      >
        <motion.div 
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className={`w-14 h-14 bg-gradient-to-br ${goldGradient} rounded-full flex items-center justify-center shadow-[0_6px_20px_rgba(194,155,87,0.35)] border-2 border-[#121214] mb-1.5`}
        >
          <svg className="w-7 h-7 text-zinc-950" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.21008 13.8L5.00008 23L12.0001 20L19.0001 23L15.7901 13.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 5L13.1 7.2H15.5L13.7 8.8L14.3 11.2L12 9.8L9.7 11.2L10.3 8.8L8.5 7.2H10.9L12 5Z" fill="currentColor"/>
          </svg>
        </motion.div>
        <span className={`text-[8.5px] font-black tracking-widest uppercase transition-colors duration-300 ${
          isVipCard ? 'text-[#c29b57]' : 'text-zinc-500'
        }`}>
          Thẻ VIP
        </span>
      </button>

      {/* Cá nhân */}
      <button 
        onClick={() => onViewChange && onViewChange('profile')}
        className="flex flex-col items-center justify-center flex-1 cursor-pointer outline-none focus:outline-none relative group"
      >
        <div className="p-1 mb-1 transition-transform duration-200 group-active:scale-90">
          <svg 
            className={`h-6 w-6 transition-all duration-300 ${
              isProfile 
                ? 'text-[#c29b57] filter drop-shadow-[0_2px_8px_rgba(194,155,87,0.4)]' 
                : 'text-zinc-500 hover:text-zinc-350'
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 21V19C6 16.2386 8.23858 14 11 14H13C15.7614 14 18 16.2386 18 19V21" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className={`text-[8.5px] font-black tracking-widest uppercase transition-colors duration-300 ${
          isProfile ? 'text-[#c29b57]' : 'text-zinc-500'
        }`}>
          Cá nhân
        </span>
        {isProfile && (
          <motion.div 
            layoutId="activeIndicator"
            className="absolute -bottom-1.5 w-1 h-1 bg-[#c29b57] rounded-full shadow-[0_0_8px_#c29b57]"
          />
        )}
      </button>

      {/* CSKH */}
      <button 
        onClick={() => onViewChange && onViewChange('cskh')}
        className="flex flex-col items-center justify-center flex-1 cursor-pointer outline-none focus:outline-none relative group"
      >
        <div className="p-1 mb-1 transition-transform duration-200 group-active:scale-90">
          <svg 
            className={`h-6 w-6 transition-all duration-300 ${
              isCskh 
                ? 'text-[#c29b57] filter drop-shadow-[0_2px_8px_rgba(194,155,87,0.4)]' 
                : 'text-zinc-500 hover:text-zinc-350'
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 11C3 7.13401 6.13401 4 10 4H14C17.866 4 21 7.13401 21 11V18C21 19.6569 19.6569 21 18 21H17" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="2" y="10" width="3" height="6" rx="1.5" fill="currentColor" stroke="currentColor" strokeWidth="1.8" />
            <rect x="19" y="10" width="3" height="6" rx="1.5" fill="currentColor" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 16C17.5 19 14.5 20 12 20" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className={`text-[8.5px] font-black tracking-widest uppercase transition-colors duration-300 ${
          isCskh ? 'text-[#c29b57]' : 'text-zinc-500'
        }`}>
          CSKH
        </span>
        {isCskh && (
          <motion.div 
            layoutId="activeIndicator"
            className="absolute -bottom-1.5 w-1 h-1 bg-[#c29b57] rounded-full shadow-[0_0_8px_#c29b57]"
          />
        )}
      </button>

    </nav>
  );
}
