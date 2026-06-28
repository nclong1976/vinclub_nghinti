import React, { useState, useEffect, useRef } from 'react';
import { useUser } from './UserContext';
import EditableImage from './EditableImage';
import { ViewState } from '../App';
import viettelIdcImage from '../assets/images/regenerated_image_1782460662494.jpg';
import newNewsImage from '../assets/images/regenerated_image_1782512288743.jpg';
import vinfastIcon from '../assets/images/logo-vinfast-1.png';
import vinpearlIcon from '../assets/images/logo-vinpearl-1.png';
import { db } from '../firebase';
import { doc, onSnapshot, collection, query } from 'firebase/firestore';
import NotificationsPanel from './NotificationsPanel';

interface HomeViewProps {
  onNavigate: (view: ViewState, subView?: string | null) => void;
}

export default function HomeView({
  onNavigate
}: HomeViewProps) {
  const { displayName, balance, cmsNews, articlesList, userId, transactions, avatarImage } = useUser();

  const totalDeposit = (transactions || [])
    .filter((t: any) => t.type === 'deposit' && t.status === 'Thành công')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  let tierName = 'MEMBER';
  if (totalDeposit >= 10000000000) {
    tierName = 'VVIP';
  } else if (totalDeposit >= 5000000000) {
    tierName = 'VIP';
  } else if (totalDeposit >= 1000000000) {
    tierName = 'GOLD';
  }
  const [tickerMessages, setTickerMessages] = useState<string[]>([
    "Khách hàng ***829 vừa rút thành công 3.292.000.000 VNĐ",
    "Khách hàng ***415 vừa rút thành công 1.500.000.000 VNĐ",
    "Khách hàng ***992 vừa rút thành công 5.800.000.000 VNĐ"
  ]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'ticker'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().messages) {
        setTickerMessages(docSnap.data().messages);
      }
    });
    return () => unsub();
  }, []);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [shouldRing, setShouldRing] = useState(false);
  const prevCountRef = useRef(0);

  const [pointsData, setPointsData] = useState({
    current_points: 650,
    next_tier_points: 1000,
    next_tier_name: 'GOLD'
  });
  const [animatedWidth, setAnimatedWidth] = useState(0);

  // Active user key for localStorage
  const userKey = userId || 'guest';

  // Load read notification IDs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`read-notifications-${userKey}`);
    if (saved) {
      try {
        setReadIds(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      setReadIds([]);
    }
  }, [userKey, isNotificationsOpen]);

  // Sync real-time notifications from Firestore
  useEffect(() => {
    const q = query(collection(db, "notifications"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setNotifications(items);
    }, (error) => {
      console.error(error);
    });
    return () => unsubscribe();
  }, []);

  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;
  const hasUnread = unreadCount > 0;

  // Explicit state variables matching technical design guidelines
  const has_unread = hasUnread;
  const notification_count = unreadCount;

  useEffect(() => {
    if (unreadCount > prevCountRef.current && prevCountRef.current > 0) {
      setShouldRing(true);
      const timer = setTimeout(() => setShouldRing(false), 500);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  // Sync real-time points from Firestore
  useEffect(() => {
    if (!userId) return;
    const userDocRef = doc(db, 'users', userId);
    const unsub = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setPointsData({
          current_points: data.current_points !== undefined ? Number(data.current_points) : 650,
          next_tier_points: data.next_tier_points !== undefined ? Number(data.next_tier_points) : 1000,
          next_tier_name: data.next_tier_name || 'GOLD'
        });
      }
    });
    return () => unsub();
  }, [userId]);

  // Personal deposit-based milestones
  let nextTierName = 'GOLD';
  let nextTierLimit = 1000000000; // 1 Billion

  if (totalDeposit >= 10000000000) {
    nextTierName = 'MAX';
    nextTierLimit = 10000000000;
  } else if (totalDeposit >= 5000000000) {
    nextTierName = 'VVIP';
    nextTierLimit = 10000000000;
  } else if (totalDeposit >= 1000000000) {
    nextTierName = 'VIP';
    nextTierLimit = 5000000000;
  } else {
    nextTierName = 'GOLD';
    nextTierLimit = 1000000000;
  }

  const progressPercent = Math.min(100, Math.max(0, (totalDeposit / nextTierLimit) * 100));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(progressPercent);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPercent]);

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return 'TT';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Combine dynamic news sources to display in the homepage section
  const homeNews: any[] = [];
  const seenHomeNewsIds = new Set<string>();

  // 1. Add CMS news first
  (cmsNews || []).forEach((news: any) => {
    if (news && news.id) {
      seenHomeNewsIds.add(news.id);
      homeNews.push(news);
    }
  });

  // 2. Add Firestore articles
  (articlesList || []).forEach((news: any) => {
    if (news && news.id && !seenHomeNewsIds.has(news.id)) {
      seenHomeNewsIds.add(news.id);
      homeNews.push({
        id: news.id,
        title: news.title,
        category: news.category || 'Tin tức',
        image: news.imageUrl || news.image || 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?q=80&w=800',
        date: news.date || 'Hôm nay',
        author: news.author || 'Ban Biên Tập'
      });
    }
  });

  // 3. Fallbacks for original static news
  const staticNewsList = [
    {
      id: 'viettel_idc_vingroup',
      title: 'Cộng hưởng sức mạnh: Viettel IDC và Vingroup bắt tay nâng cấp toàn diện hệ sinh thái VinClub',
      category: 'Tin tức hợp tác',
      image: viettelIdcImage,
      date: '26 Th06, 2026',
      author: 'VinClub News'
    },
    {
      id: 'vf8_2022',
      title: 'Dấu ấn VF 8 2022: Ô tô điện Việt Nam vươn tầm thế giới',
      category: 'Tin tức VinFast',
      image: newNewsImage,
      date: '25 Th06, 2026',
      author: 'VinFast News'
    },
    {
      id: 'stations',
      title: 'Hệ thống trạm sạc thông minh phủ sóng toàn quốc',
      category: 'Hệ sinh thái',
      image: 'https://lh3.googleusercontent.com/aida/AP1WRLvZWBkBQLreNDuqVmR_wuzFG0k2QIM1DOMR-ZMpS5DRezuNNzVUVw9lMkWpgxMBFw2g3GJxHyQ8GeWXV_WayZauS5-108wukYNM6c7kffFYnHKVpfqo5T7rCqfyb6iOHbShCIQinH66eyMQ3Wo9ukU4B8GxEyVh6u8ULoJ0pAaIDdlSNe9zQ4I87ME6DUPxcwEtn41fZWZFYDX9RNEnOjjKwRPhezwGNgtGIy78Dl_Yd5HyfgE59oEfDxs',
      date: '24 Th06, 2026',
      author: 'VinFast News'
    },
    {
      id: 'app',
      title: 'Công nghệ điều khiển thông minh qua ứng dụng VinFast',
      category: 'Công nghệ',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3pApHIixibJvbua8jNv134XdqsMGn1bWVL41PCtaMTTiyADwdVHFr4MdVnHt8Gi2Un6h076SLVLzwmTBWm8Xes4PtgEeVBSHy57ummWSa342XRaO5KP_kogAhDXAteIMejIpXAgMCB9UBzDM7gI-TSoXMajTfFwHdH2H4N6qi_XN23x335eZMwBgiBxu2xnVj2C5RD2Ds8HueAz4XwX8XJgO0B1EKnm9kEk64MCw98bgMfuq6KcIh2DbvrXHv_kmTsN6_2m-Qk9o',
      date: '23 Th06, 2026',
      author: 'VinFast News'
    }
  ];

  staticNewsList.forEach((news: any) => {
    if (!seenHomeNewsIds.has(news.id)) {
      seenHomeNewsIds.add(news.id);
      homeNews.push(news);
    }
  });

  const initials = getInitials(displayName);

  return (
    <div className="flex-1 flex flex-col bg-white text-zinc-800 pb-36 overflow-y-auto overflow-x-hidden scrollbar-hide">
      
      {/* Dynamic Keyframe Animations */}
      <style>{`
        .status-progress-bar {
          height: 4px;
          background: #E5E5EA;
          border-radius: 2px;
          width: 100%;
          position: relative;
        }
        .status-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%);
          border-radius: 2px;
          width: 0%;
          transition: width 1s ease-in-out;
        }
        @keyframes ring {
          0% { transform: rotate(0deg); }
          15% { transform: rotate(-15deg); }
          30% { transform: rotate(15deg); }
          45% { transform: rotate(-10deg); }
          60% { transform: rotate(10deg); }
          75% { transform: rotate(-5deg); }
          90% { transform: rotate(5deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-ring {
          animation: ring 0.5s ease-in-out;
        }
        .bell-btn:hover .bell-icon,
        .bell-btn:active .bell-icon {
          transform: scale(1.08);
          color: #BF953F;
          fill: currentColor;
          fill-opacity: 0.25;
          filter: brightness(1.1);
        }
        .service-icon-container {
          width: 60px;
          height: 60px;
          background-color: #fef9ed;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        .service-icon-container:hover {
          transform: scale(1.05);
        }
        .marquee-container {
          flex: 1;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        .marquee-content {
          display: inline-flex;
          gap: 2rem;
          white-space: nowrap;
          animation: marquee 25s linear infinite;
          padding-left: 100%;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      {/* Ticker Banner */}
      <div className="mx-4 mt-4 bg-[#121212] rounded-xl p-3 flex items-center justify-between border border-[#C49A6C]/20 shadow-lg relative z-10 select-none">
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <div className="relative flex-shrink-0">
            <svg className="w-5 h-5 text-[#d4a373]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00FF00] rounded-full border-2 border-[#121212] animate-pulse"></div>
          </div>

          <div className="marquee-container">
            <div className="marquee-content">
              {tickerMessages.map((msg, idx) => (
                <span key={idx} className="text-xs font-semibold text-[#00FF00]">{msg}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Header Profile Info */}
      <header className="text-gray-800 pt-8 pb-6 px-5 border-b border-gray-100 select-none">
        <div className="flex items-center justify-between">
          {/* Profile and Member Badge */}
          <div 
            onClick={() => onNavigate('profile')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-[#f0e1c9] flex items-center justify-center text-[#8b6b4e] font-extrabold text-lg shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
              {avatarImage ? (
                <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                initials
              )}
            </div>
            <div className="bg-[#bc8f5f] px-3 py-1.5 rounded-md font-extrabold text-xs tracking-widest text-white shadow-sm">
              {tierName}
            </div>
          </div>
          
          {/* Tier Status */}
          <div 
            onClick={() => onNavigate('cardRanking')}
            className="flex flex-col items-end flex-1 ml-4 max-w-[180px] cursor-pointer hover:opacity-80 transition-all select-none"
          >
            <div className="flex items-center text-[10px] font-extrabold mb-1.5 text-zinc-500 uppercase tracking-wider">
              <span className="mr-0.5">Hạng tiếp theo: {nextTierName}</span>
              <svg className="h-3 w-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
              </svg>
            </div>
            <div className="status-progress-bar">
              <div className="status-progress-fill" style={{ width: `${animatedWidth}%` }}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats Block */}
      <section className="flex justify-between items-center px-4 mt-6 gap-3 select-none" data-purpose="balance-cards">
        <div className="flex items-center gap-2">
          {/* Balance Card */}
          <div 
            onClick={() => onNavigate('profile', 'bank_link')}
            className="bg-white border border-gray-100 rounded-xl px-3 py-2 flex items-center shadow-sm hover:bg-gray-50/80 cursor-pointer transition-colors"
          >
            <div className="w-6 h-6 bg-orange-100 rounded-md flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2l-8 4.5v9L10 20l8-4.5v-9L10 2z"></path>
              </svg>
            </div>
            <span className="text-sm font-black text-gray-800 tracking-tight">
              {balance !== undefined ? balance.toLocaleString('vi-VN') : '0'} VND
            </span>
          </div>

          {/* Voucher Card */}
          <div 
            onClick={() => onNavigate('profile', 'bonus_history')}
            className="bg-white border border-gray-100 rounded-xl px-3 py-2 flex items-center shadow-sm hover:bg-gray-50/80 cursor-pointer transition-colors"
          >
            <div className="w-6 h-6 text-orange-400 mr-2 flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M0 6a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V6zm3 1a1 1 0 00-1 1v4a1 1 0 001 1h1a1 1 0 001-1V8a1 1 0 00-1-1H3z"></path>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-500">0 voucher</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications Button */}
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 cursor-pointer active:scale-95 transition-all text-gray-850 relative bell-btn"
            title="Thông báo"
          >
            <svg 
              className={`w-5 h-5 transition-transform bell-icon ${shouldRing ? 'animate-ring' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            
            {hasUnread && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 bg-[#FF3B30] text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white animate-in zoom-in-50 duration-200">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Hero Carousel Promotional Banner */}
      <section className="mt-6 px-4 select-none relative">
        <EditableImage
          imageKey="home-hero-banner"
          defaultSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuArgRgKyPS8zsZIIZWdDRMF6dNGQbs9w5bLgb-oMVV9rP88z2mzBZF-OVwnvThYjsAsD7mPrKso9BeMyySvBVSwgOjCm8cASyeBdmqec8WW-yx82OtxPoWO3deNwLMwHhVfBG9hOhIshIc7eSFXScUp4UUeeCx-d6ATMdz7LnsM4L9CeMtQ44SjkXZoNFfZhVPbkaXg8BwXWxTukQlvS8UB1Txi3oh7CVAxLHwhI8Y-1DmUU39pzo10MXHa8uvwVoxOkpRzRGjJ5zw"
          className="relative rounded-2xl overflow-hidden shadow-md aspect-square bg-white flex items-center justify-center border border-zinc-100"
          isBackground={true}
          backgroundSize="contain"
        >
          {/* Card Ranking Link overlay */}
          <button 
            onClick={() => onNavigate('cardRanking')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0055c8] text-sm font-bold tracking-tight drop-shadow-md hover:scale-105 transition-transform"
            style={{ textShadow: '0 0 4px rgba(255,255,255,0.8), 0 0 2px rgba(255,255,255,0.8)' }}
          >
            Xếp hạng thẻ
          </button>
        </EditableImage>
        
        {/* Carousel Dots */}
        <div className="flex justify-center mt-3 space-x-1.5" data-purpose="carousel-pagination">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
          <div className="w-4 h-1.5 rounded-full bg-[#d4a373]"></div>
        </div>
      </section>

      {/* Service Grid - 8 Items */}
      <section className="mt-8 px-4 grid grid-cols-4 gap-y-8 gap-x-2 select-none" data-purpose="main-services-grid">
        
        {/* Item 1: Ưu đãi phúc lợi */}
        <button 
          onClick={() => onNavigate('welfare_consultation')}
          className="flex flex-col items-center text-center cursor-pointer group outline-none"
        >
          <div className="service-icon-container mb-2">
            <img alt="Ưu đãi phúc lợi" className="w-12 h-12 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqD34rmyDdWZ_6yT7ttUHzQaoO_DQwXdgTdiCelU5luVi8QEp7IVS22L8LYINnkhd925i8FeX1SUi4eqJI2_c8v_J7sb1iLMKL2F0jX5YeKGwsYub63b_rmDTo_kE8r9Brq-_bmDEPAF9qCAoS6hwiTvyXKSS_eH-bUX4hrtMJQoHHf8f1xRwccKxbKHkaV5cHHsrzD090x7Lsbl5aSPJ7ioVcgCPwPcZAUpL82WCcdpBeKMa1MzOTk-zfVtSgtHVWJwGuMHfFqg_4Eg" />
          </div>
          <span className="text-[11px] font-bold leading-tight text-gray-700 group-hover:text-amber-700 transition-colors">Ưu đãi phúc lợi</span>
        </button>

        {/* Item 2: Vinpearl */}
        <button 
          onClick={() => onNavigate('vinpearl_projects')}
          className="flex flex-col items-center text-center cursor-pointer group outline-none"
        >
          <div className="service-icon-container mb-2">
            <img alt="Vinpearl" className="w-8 h-8 object-contain" src={vinpearlIcon} />
          </div>
          <span className="text-[11px] font-bold leading-tight text-gray-700 group-hover:text-amber-700 transition-colors">Vinpearl<br/><br/></span>
        </button>

        {/* Item 3: VinFast */}
        <button 
          onClick={() => onNavigate('vinfast')}
          className="flex flex-col items-center text-center cursor-pointer group outline-none"
        >
          <div className="service-icon-container mb-2">
            <EditableImage
              imageKey="home-vinfast-logo"
              defaultSrc={vinfastIcon}
              isBackground={false}
              className="w-8 h-8 flex items-center justify-center relative object-contain"
            />
          </div>
          <span className="text-[11px] font-bold leading-tight text-gray-700 group-hover:text-amber-700 transition-colors">VinFast</span>
        </button>

        {/* Item 4: Casino Corona */}
        <button 
          onClick={() => onNavigate('casino')}
          className="flex flex-col items-center text-center cursor-pointer group outline-none"
        >
          <div className="service-icon-container mb-2">
            <img alt="Cassino Corona" className="w-8 h-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCkFHYSiKymlHD6DTKyoAwGYrIw8ajF8Dm6i9shDZY4OG96o0p8wF3CFtNA3q9aEuXUYUkur6x39Gw57gGn-UFRBuJkuUEwJ0eiWM7KSKyX-jTEQC9VYdds3rgfOUcBAiLQwknFmZGBoDn1ZILS5QSC977x_ZBlfjRo1OECRciGFYKa2z4L_B-X66-cnDah8VT-hbLut6CQW-QKLgM9xoozDcnuArvioSWJXe0DvqSwnoltg04i8L3aGd6n6Rp8Zh2sRQAYB0bm9s" />
          </div>
          <span className="text-[11px] font-bold leading-tight text-gray-700 group-hover:text-amber-700 transition-colors">Cassino&nbsp;<br/>Corona<br/></span>
        </button>

        {/* Item 5: Lí do nên đầu tư */}
        <button 
          onClick={() => onNavigate('investment_reasons')}
          className="flex flex-col items-center text-center cursor-pointer group outline-none"
        >
          <div className="service-icon-container mb-2">
            <img alt="Lí do nên đầu tư" className="w-12 h-12 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN2K3ds59mmTsvt6rGulVFd9Jg8FzX9mR-FzJICii-Rw4rT_Ube-t6yEtXzK0jLzN2hKor_UlFbeU0mckPaWn04Wqqfahv8yrttmdSLNLLs6FFd_zRi0OnpLeJNQfxUGL-g5q_J1okngFI2EOExORFpUD4MnZJ31hdC94vL-tpEYo32IeP52x2bfMx19nVtQRlU-SWP3EreWM5CxThhtBwcsDCHPP-Yds820U1cE2URYGkr_RDSsePaQ2iEEeyma1eMOa8uX56m2n_dg" />
          </div>
          <span className="text-[11px] font-bold leading-tight text-gray-700 group-hover:text-amber-700 transition-colors">Lí do nên đầu tư</span>
        </button>

        {/* Item 6: Vinhomes */}
        <button 
          onClick={() => onNavigate('projects')}
          className="flex flex-col items-center text-center cursor-pointer group outline-none"
        >
          <div className="service-icon-container mb-2">
            <img alt="Vinhomes" className="w-12 h-12 object-contain" src="https://vinhomesgpark.vn/wp-content/uploads/2024/08/logo-vinhomes-png.webp" />
          </div>
          <span className="text-[11px] font-bold leading-tight text-gray-700 group-hover:text-amber-700 transition-colors">Vinhomes</span>
        </button>

        {/* Item 7: Mua chứng khoán */}
        <button 
          onClick={() => onNavigate('stockList')}
          className="flex flex-col items-center text-center cursor-pointer group outline-none"
        >
          <div className="service-icon-container mb-2">
            <img alt="Mua chứng khoán" className="w-8 h-8 object-contain border border-[#f7efc6]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG9ufIXtdpd6vkUk08c0WLBbeJvTYXdeeoIuF6LOFJhokIDNY1JkbNq6BrdO5QygOIwW5_pzNQToH90hKRbsEx9qrh28zQHFonJpdb0jroJ7c2DPoCeh73anLKwMFL19YL-P0ByuPisWGZ4pV3imgvP0M6IAPnFVaazcA2AlIyb1fm0zMx_1OGsIPQG9JsL4NiYyQwLL76_JK73xg9VDYshOECWXSuFCGZ_LLcHFAIYUwCDLelmP6ByDVzdf5mt2Wc5vxm2W8bQ2w" />
          </div>
          <span className="text-[11px] font-bold leading-tight text-gray-700 group-hover:text-amber-700 transition-colors">Mua chứng khoán&nbsp;</span>
        </button>

        {/* Item 8: Xếp hạng thẻ */}
        <button 
          onClick={() => onNavigate('cardRanking')}
          className="flex flex-col items-center text-center cursor-pointer group outline-none"
        >
          <div className="service-icon-container mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#c89f00]">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
          <span className="text-[11px] font-bold leading-tight text-gray-700 group-hover:text-amber-700 transition-colors">Xếp hạng thẻ</span>
        </button>
      </section>

      {/* News Section */}
      <section className="mt-10 px-4 select-none" data-purpose="news-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Tin tức cập nhật</h2>
          <button 
            onClick={() => onNavigate('all_news')}
            className="text-[#d4a373] text-xs font-semibold hover:opacity-80 cursor-pointer"
          >
            Xem tất cả
          </button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {homeNews.map((news: any) => (
            <div 
              key={news.id}
              onClick={() => onNavigate('news_detail', news.id)}
              className="flex-shrink-0 w-[280px] bg-white rounded-[20px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100/80 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group"
            >
              <div className="aspect-[16/10] w-full overflow-hidden relative bg-gray-100">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                <img 
                  alt={news.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                  src={news.image} 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 flex flex-col justify-between min-h-[100px]">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#d4a373] text-[9px] font-bold tracking-widest uppercase bg-[#d4a373]/10 px-2 py-0.5 rounded-sm">
                      {news.category || 'Tin tức'}
                    </span>
                    <span className="text-gray-400 text-[10px] font-medium">{news.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 leading-[1.4] line-clamp-2 group-hover:text-[#d4a373] transition-colors">
                    {news.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </div>
  );
}
