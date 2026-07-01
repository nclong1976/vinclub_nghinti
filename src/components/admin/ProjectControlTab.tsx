import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, Check, X, ShieldAlert, Sliders, Play, Pause, Plus, Trash2, Clock, CheckSquare, Square, Building2
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, query, onSnapshot, doc, setDoc, updateDoc, getDocs } from 'firebase/firestore';

interface AssetCard {
  id: string;
  num: string;
  title: string;
  status: 'ACTIVE' | 'STANDBY';
  checked: boolean;
}

interface CasinoGameSettings {
  id: string;
  title: string;
  isOpen: boolean;
  schedules: string[];
  payoutRatio: string;
}

export default function ProjectControlTab() {
  const [loading, setLoading] = useState(true);
  
  // Real-time investment projects (Vinpearl, Vinhomes, VinFast)
  const [projects, setProjects] = useState<any[]>([]);
  
  // Market & Overview States
  const [vicPrice, setVicPrice] = useState(45.20);
  const [vicChange, setVicChange] = useState(2.4);
  const [vhmPrice, setVhmPrice] = useState(41.05);
  const [vhmChange, setVhmChange] = useState(-0.8);
  const [totalPortfolio, setTotalPortfolio] = useState('$1.24B');
  const [dailyVolume, setDailyVolume] = useState('12.5M');
  const [marketTrend, setMarketTrend] = useState<'Bullish' | 'Bearish'>('Bullish');

  // Asset Sections
  const [vinpearlChecked, setVinpearlChecked] = useState(true);
  const [vinpearlAssets, setVinpearlAssets] = useState<AssetCard[]>([
    { id: 'vp-1', num: '01', title: 'Siêu đô thị Thể thao Quốc tế / Vinhomes Olympic (Hà Nội)', status: 'ACTIVE', checked: true },
    { id: 'vp-2', num: '02', title: 'Đại đô thị phức hợp Hạ Long Xanh (Quảng Ninh)', status: 'STANDBY', checked: true },
    { id: 'vp-3', num: '03', title: 'Siêu đô thị biển Vinhomes Green Paradise / Khu đô thị lấn biển Cần Giờ', status: 'ACTIVE', checked: true },
    { id: 'vp-4', num: '04', title: 'Khu phức hợp Làng Vân (Đà Nẵng)', status: 'STANDBY', checked: true },
    { id: 'vp-5', num: '05', title: 'Giai đoạn mở rộng Quần thể Phú Quốc United Center (Kiên Giang)', status: 'ACTIVE', checked: true },
    { id: 'vp-6', num: '06', title: 'Sân vận động Trống Đồng Vinhomes Olympic', status: 'ACTIVE', checked: true },
    { id: 'vp-7', num: '07', title: 'Siêu dự án Vinhomes Hạ Long Xanh', status: 'ACTIVE', checked: true },
    { id: 'vp-8', num: '08', title: 'Quần thể Đông Tây Land Resort', status: 'ACTIVE', checked: true },
    { id: 'vp-9', num: '09', title: 'Khu phức hợp nghỉ dưỡng Làng Vân', status: 'ACTIVE', checked: true },
    { id: 'vp-10', num: '10', title: 'Đại đô thị sinh thái Dream City', status: 'ACTIVE', checked: true },
  ]);

  const [vinhomesChecked, setVinhomesChecked] = useState(true);
  const [vinhomesAssets, setVinhomesAssets] = useState<AssetCard[]>([
    { id: 'vh-1', num: '01', title: 'Quỹ phát triển giáo dục liên cấp', status: 'STANDBY', checked: true },
    { id: 'vh-2', num: '02', title: 'Quỹ Phát Triển Y Tế & Chăm Sóc Sức Khỏe', status: 'STANDBY', checked: true },
    { id: 'vh-3', num: '03', title: 'Quỹ Phát Triển Thương Mại Dịch Vụ Cao Cấp', status: 'ACTIVE', checked: false },
    { id: 'vh-4', num: '04', title: 'Quỹ Phát Triển Công Nghệ Công Nghiệp', status: 'ACTIVE', checked: true },
    { id: 'vh-5', num: '05', title: 'Vingroup Ventures', status: 'STANDBY', checked: true },
  ]);

  // Stock Market Intervention
  const [stockChecked, setStockChecked] = useState(true);
  const [interventionStates, setInterventionStates] = useState<Record<string, boolean>>({
    VIC: true,
    VHM: true,
    VFS: true
  });

  // VinFast
  const [vinfastChecked, setVinfastChecked] = useState(true);
  const [vinfastAssets, setVinfastAssets] = useState<AssetCard[]>([
    { id: 'vf-6', num: '01', title: 'VF6', status: 'STANDBY', checked: false },
    { id: 'vf-7', num: '02', title: 'VF7', status: 'STANDBY', checked: false },
    { id: 'vf-8', num: '03', title: 'VF8', status: 'ACTIVE', checked: true },
    { id: 'vf-9', num: '04', title: 'VF9', status: 'STANDBY', checked: false },
  ]);

  // Casino Management
  const [casinoChecked, setCasinoChecked] = useState(true);
  const [casinoGames, setCasinoGames] = useState<CasinoGameSettings[]>([
    { id: 'dice', title: 'XÚC XẮC', isOpen: true, schedules: ['08:00 - 12:00', '15:00 - 18:00'], payoutRatio: '1:1.2' },
    { id: 'baccarat', title: 'BACCARAT LONG HỔ', isOpen: true, schedules: ['20:00 - 02:00'], payoutRatio: '1:1.2' },
    { id: 'tiger', title: 'TIGER BACCARAT', isOpen: false, schedules: [], payoutRatio: '1:1.5' },
  ]);

  // Sync to/from Firestore Settings doc
  useEffect(() => {
    const docRef = doc(db, 'system', 'project_control');
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.vicPrice !== undefined) setVicPrice(data.vicPrice);
        if (data.vicChange !== undefined) setVicChange(data.vicChange);
        if (data.vhmPrice !== undefined) setVhmPrice(data.vhmPrice);
        if (data.vhmChange !== undefined) setVhmChange(data.vhmChange);
        if (data.totalPortfolio !== undefined) setTotalPortfolio(data.totalPortfolio);
        if (data.dailyVolume !== undefined) setDailyVolume(data.dailyVolume);
        if (data.marketTrend !== undefined) setMarketTrend(data.marketTrend);

        if (data.projects !== undefined) {
          setProjects(data.projects);
        } else {
          const fallbackProjects = [
            {
              id: '1',
              title: 'Vinpearl Harbour Nha Trang',
              imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBs0Ws0FoM0Koq9Z7wZHIw_aGBFvrr7MaTjqqbtfEfaNqrDge_XgDHRSN6PWfQX8bdWRjxdDKQleYOwyZa5ibrF4NJ94BKG3-XJMtetJ6YaQr_M0OgWWcmF_L_RjvBEE8pNkYq_bZ63EHu7i3fPvcpINwnEv3S9EDHDyKXEMfLNycvf_1SmBsHwdIAXZGl3CojGzobPiBDJsARvkb1M8BxttP6NZvOp54fnqGdKzBQR8E7jjeBBmtbpuzjCjyrPB9ZpcjLm2Y8mPaU',
              interestRate: '2.6%',
              duration: '5 ngày',
              minAmount: '1.2 Tỷ',
              scale: '35.000 Tỷ VNĐ',
              progress: 65,
              category: 'Vinpearl',
              durationDays: 5,
              minInvestAmount: 1200000000,
              interestRateValue: 0.026,
              status: 'ACTIVE',
              targetCapital: 35000000000000,
              raisedCapital: 22750000000000
            },
            {
              id: '2',
              title: 'Vinhomes Royal Island',
              imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
              interestRate: '3.2%',
              duration: '10 ngày',
              minAmount: '2.5 Tỷ',
              scale: '55.000 Tỷ VNĐ',
              progress: 42,
              category: 'Vinhomes',
              durationDays: 10,
              minInvestAmount: 2500000000,
              interestRateValue: 0.032,
              status: 'ACTIVE',
              targetCapital: 55000000000000,
              raisedCapital: 23100000000000
            },
            {
              id: '3',
              title: 'VinFast Global Giga-Factory',
              imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
              interestRate: '4.5%',
              duration: '15 ngày',
              minAmount: '5.0 Tỷ',
              scale: '120.000 Tỷ VNĐ',
              progress: 88,
              category: 'VinFast',
              durationDays: 15,
              minInvestAmount: 5000000000,
              interestRateValue: 0.045,
              status: 'ACTIVE',
              targetCapital: 120000000000000,
              raisedCapital: 105600000000000
            },
            {
              id: '4',
              title: 'Vinpearl Eco-Retreat',
              imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
              interestRate: '2.8%',
              duration: '7 ngày',
              minAmount: '1.5 Tỷ',
              scale: '38.000 Tỷ VNĐ',
              progress: 25,
              category: 'Vinpearl',
              durationDays: 7,
              minInvestAmount: 1500000000,
              interestRateValue: 0.028,
              status: 'ACTIVE',
              targetCapital: 38000000000000,
              raisedCapital: 950000000000
            },
            {
              id: '5',
              title: 'VinFast Smart City Hub',
              imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
              interestRate: '3.5%',
              duration: '12 ngày',
              minAmount: '3.0 Tỷ',
              scale: '85.000 Tỷ VNĐ',
              progress: 12,
              category: 'VinFast',
              durationDays: 12,
              minInvestAmount: 3000000000,
              interestRateValue: 0.035,
              status: 'ACTIVE',
              targetCapital: 85000000000000,
              raisedCapital: 10200000000000
            },
            {
              id: '6',
              title: 'Sân vận động Trống Đồng Vinhomes Olympic',
              imageUrl: 'https://vinhome.com.vn/wp-content/uploads/2025/12/san-van-dong-trong-dong-vinhomes-olympic-ha-noi-3.webp',
              interestRate: '3.8%',
              duration: '12 ngày',
              minAmount: '2.0 Tỷ',
              scale: '925.000 Tỷ VNĐ',
              progress: 45,
              category: 'Vinpearl',
              durationDays: 12,
              minInvestAmount: 2000000000,
              interestRateValue: 0.038,
              status: 'ACTIVE',
              targetCapital: 925000000000000,
              raisedCapital: 416250000000000
            },
            {
              id: '7',
              title: 'Siêu dự án Vinhomes Hạ Long Xanh',
              imageUrl: 'https://vinhomehalongxanh.com.vn/wp-content/uploads/2026/02/Vinhomes-Ha-Long-Xanh-scaled.jpg',
              interestRate: '3.5%',
              duration: '10 ngày',
              minAmount: '1.8 Tỷ',
              scale: '456.639 Tỷ VNĐ',
              progress: 30,
              category: 'Vinpearl',
              durationDays: 10,
              minInvestAmount: 1800000000,
              interestRateValue: 0.035,
              status: 'ACTIVE',
              targetCapital: 456639000000000,
              raisedCapital: 136991700000000
            },
            {
              id: '8',
              title: 'Quần thể Đông Tây Land Resort',
              imageUrl: 'https://dongtayland.vn/wp-content/uploads/2025/09/Cover-2.jpg',
              interestRate: '3.0%',
              duration: '8 ngày',
              minAmount: '1.5 Tỷ',
              scale: '240.000 Tỷ VNĐ',
              progress: 52,
              category: 'Vinpearl',
              durationDays: 8,
              minInvestAmount: 1500000000,
              interestRateValue: 0.030,
              status: 'ACTIVE',
              targetCapital: 240000000000000,
              raisedCapital: 124800000000000
            },
            {
              id: '9',
              title: 'Khu phức hợp nghỉ dưỡng Làng Vân',
              imageUrl: 'https://reb.vn/wp-content/uploads/2025/07/Khu-phuc-hop-du-lich-va-do-thi-nghi-duong-Lang-Van.jpg',
              interestRate: '2.9%',
              duration: '7 ngày',
              minAmount: '1.2 Tỷ',
              scale: '44.000 Tỷ VNĐ',
              progress: 61,
              category: 'Vinpearl',
              durationDays: 7,
              minInvestAmount: 1200000000,
              interestRateValue: 0.029,
              status: 'ACTIVE',
              targetCapital: 44000000000000,
              raisedCapital: 26840000000000
            },
            {
              id: '10',
              title: 'Đại đô thị sinh thái Dream City',
              imageUrl: 'https://ktmt.vnmediacdn.com/images/2021/12/17/13-1639726425-a9.jpg',
              interestRate: '3.1%',
              duration: '9 ngày',
              minAmount: '1.6 Tỷ',
              scale: '66.000 Tỷ VNĐ',
              progress: 38,
              category: 'Vinpearl',
              durationDays: 9,
              minInvestAmount: 1600000000,
              interestRateValue: 0.031,
              status: 'ACTIVE',
              targetCapital: 66000000000000,
              raisedCapital: 25080000000000
            }
          ];
          setProjects(fallbackProjects);
          setDoc(docRef, { projects: fallbackProjects }, { merge: true }).catch(console.error);
        }

        if (data.vinpearlAssets !== undefined) setVinpearlAssets(data.vinpearlAssets);
        if (data.vinhomesAssets !== undefined) setVinhomesAssets(data.vinhomesAssets);
        if (data.interventionStates !== undefined) setInterventionStates(data.interventionStates);
        if (data.vinfastAssets !== undefined) setVinfastAssets(data.vinfastAssets);
        if (data.casinoGames !== undefined) setCasinoGames(data.casinoGames);

        if (data.vinpearlChecked !== undefined) setVinpearlChecked(data.vinpearlChecked);
        if (data.vinhomesChecked !== undefined) setVinhomesChecked(data.vinhomesChecked);
        if (data.stockChecked !== undefined) setStockChecked(data.stockChecked);
        if (data.vinfastChecked !== undefined) setVinfastChecked(data.vinfastChecked);
        if (data.casinoChecked !== undefined) setCasinoChecked(data.casinoChecked);
      }
      setLoading(false);
    }, (err) => {
      console.warn("Offline or missing project_control doc, loading defaults", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const saveState = async (updates: any) => {
    try {
      const docRef = doc(db, 'system', 'project_control');
      await setDoc(docRef, updates, { merge: true });
    } catch (e) {
      console.error("Error saving Project Control state:", e);
    }
  };

  const updateProjectField = (id: string, field: string, value: any) => {
    const updated = projects.map(p => {
      if (p.id === id) {
        let updatedProj = { ...p, [field]: value };
        if (field === 'progress') {
          const numProgress = Number(value);
          const target = p.targetCapital || 35000000000000;
          updatedProj.raisedCapital = Math.round(target * (numProgress / 100));
        }
        if (field === 'interestRate') {
          const rateVal = parseFloat(value.replace('%', '')) / 100;
          updatedProj.interestRateValue = isNaN(rateVal) ? 0 : rateVal;
        }
        if (field === 'minAmount') {
          const match = value.match(/([\d.]+)\s*(Tỷ|Triệu)/i);
          if (match) {
            const num = parseFloat(match[1]);
            const unit = match[2].toLowerCase();
            updatedProj.minInvestAmount = num * (unit === 'tỷ' ? 10**9 : 10**6);
          }
        }
        return updatedProj;
      }
      return p;
    });
    setProjects(updated);
    saveState({ projects: updated });
  };

  const toggleAssetCheck = (section: 'vinpearl' | 'vinhomes' | 'vinfast', id: string) => {
    if (section === 'vinpearl') {
      const updated = vinpearlAssets.map(a => a.id === id ? { ...a, checked: !a.checked } : a);
      setVinpearlAssets(updated);
      saveState({ vinpearlAssets: updated });
    } else if (section === 'vinhomes') {
      const updated = vinhomesAssets.map(a => a.id === id ? { ...a, checked: !a.checked } : a);
      setVinhomesAssets(updated);
      saveState({ vinhomesAssets: updated });
    } else if (section === 'vinfast') {
      const updated = vinfastAssets.map(a => a.id === id ? { ...a, checked: !a.checked } : a);
      setVinfastAssets(updated);
      saveState({ vinfastAssets: updated });
    }
  };

  const toggleAssetStatus = (section: 'vinpearl' | 'vinhomes' | 'vinfast', id: string) => {
    if (section === 'vinpearl') {
      const updated = vinpearlAssets.map(a => a.id === id ? { ...a, status: (a.status === 'ACTIVE' ? 'STANDBY' : 'ACTIVE') as 'ACTIVE' | 'STANDBY' } : a);
      setVinpearlAssets(updated);
      saveState({ vinpearlAssets: updated });
    } else if (section === 'vinhomes') {
      const updated = vinhomesAssets.map(a => a.id === id ? { ...a, status: (a.status === 'ACTIVE' ? 'STANDBY' : 'ACTIVE') as 'ACTIVE' | 'STANDBY' } : a);
      setVinhomesAssets(updated);
      saveState({ vinhomesAssets: updated });
    } else if (section === 'vinfast') {
      const updated = vinfastAssets.map(a => a.id === id ? { ...a, status: (a.status === 'ACTIVE' ? 'STANDBY' : 'ACTIVE') as 'ACTIVE' | 'STANDBY' } : a);
      setVinfastAssets(updated);
      saveState({ vinfastAssets: updated });
    }
  };

  const toggleIntervention = (symbol: string) => {
    const updated = {
      ...interventionStates,
      [symbol]: !interventionStates[symbol]
    };
    setInterventionStates(updated);
    saveState({ interventionStates: updated });
  };

  const toggleCasinoOpen = (id: string) => {
    const updated = casinoGames.map(g => g.id === id ? { ...g, isOpen: !g.isOpen } : g);
    setCasinoGames(updated);
    saveState({ casinoGames: updated });
  };

  const changePayoutRatio = (id: string, ratio: string) => {
    const updated = casinoGames.map(g => g.id === id ? { ...g, payoutRatio: ratio } : g);
    setCasinoGames(updated);
    saveState({ casinoGames: updated });
  };

  const addCasinoSchedule = (id: string) => {
    const timeStr = window.prompt("Nhập khung giờ hẹn (ví dụ: 12:00 - 14:00):");
    if (!timeStr) return;
    const updated = casinoGames.map(g => g.id === id ? { ...g, schedules: [...g.schedules, timeStr] } : g);
    setCasinoGames(updated);
    saveState({ casinoGames: updated });
  };

  const removeCasinoSchedule = (id: string, index: number) => {
    const updated = casinoGames.map(g => {
      if (g.id === id) {
        const nextScheds = [...g.schedules];
        nextScheds.splice(index, 1);
        return { ...g, schedules: nextScheds };
      }
      return g;
    });
    setCasinoGames(updated);
    saveState({ casinoGames: updated });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Market Status Card */}
        <div className="lg:col-span-5 bg-[#1a1b21] border border-[#4f453b]/40 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#ecbe8e]/5 rounded-full blur-2xl"></div>
          
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#ecbe8e]" />
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#d3c4b7]">MARKET STATUS</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border-r border-[#4f453b]/20 pr-4">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">VIC</div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-2xl font-bold text-white">{vicPrice.toFixed(2)}</span>
                <span className={`text-xs font-bold ${vicChange >= 0 ? 'text-[#34d399]' : 'text-[#f43f5e]'}`}>
                  {vicChange >= 0 ? `+${vicChange}%` : `${vicChange}%`}
                </span>
              </div>
            </div>
            <div className="pl-4">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">VHM</div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-2xl font-bold text-white">{vhmPrice.toFixed(2)}</span>
                <span className={`text-xs font-bold ${vhmChange >= 0 ? 'text-[#34d399]' : 'text-[#f43f5e]'}`}>
                  {vhmChange >= 0 ? `+${vhmChange}%` : `${vhmChange}%`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Overview Card */}
        <div className="lg:col-span-7 bg-[#1a1b21] border border-[#4f453b]/40 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#abc7ff]/5 rounded-full blur-3xl"></div>
          
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-[#abc7ff]" />
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#d3c4b7]">INVESTMENT OVERVIEW</h3>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <div>
              <div className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">TOTAL PORTFOLIO</div>
              <div className="font-heading text-xl md:text-2xl font-bold text-[#ecbe8e]">{totalPortfolio}</div>
            </div>
            <div className="border-l border-[#4f453b]/20 pl-3 md:pl-4">
              <div className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">DAILY VOLUME</div>
              <div className="font-heading text-xl md:text-2xl font-semibold text-white">{dailyVolume}</div>
            </div>
            <div className="border-l border-[#4f453b]/20 pl-3 md:pl-4">
              <div className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">TREND</div>
              <div className={`font-heading text-xl md:text-2xl font-bold ${marketTrend === 'Bullish' ? 'text-[#34d399]' : 'text-[#f43f5e]'}`}>{marketTrend}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Real-time Super Investment Projects Control Section */}
      <div className="bg-[#1a1b21] border border-[#4f453b]/40 rounded-xl p-5 space-y-6">
        <div className="flex justify-between items-center border-b border-[#4f453b]/15 pb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#ecbe8e]" />
            <div>
              <h3 className="font-heading text-xs font-black uppercase tracking-wider text-white">ĐIỀU HÀNH QUẢN LÝ SIÊU DỰ ÁN ĐẦU TƯ</h3>
              <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Cập nhật tiến độ gọi vốn & trạng thái hoạt động của các siêu dự án đầu tư</p>
            </div>
          </div>
          <span className="text-[9px] font-bold bg-[#ecbe8e]/10 border border-[#ecbe8e]/20 text-[#ecbe8e] px-2.5 py-1 rounded-full uppercase tracking-widest">
            Realtime Sync
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 text-xs font-medium italic">Đang tải danh sách siêu dự án...</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-[#111318] border border-[#4f453b]/20 rounded-xl p-4 flex flex-col justify-between hover:border-[#ecbe8e]/20 transition-all duration-300">
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-zinc-900 border border-[#4f453b]/10">
                    <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        proj.category === 'Vinpearl' ? 'bg-[#ecbe8e]/10 text-[#ecbe8e]' :
                        proj.category === 'Vinhomes' ? 'bg-[#34d399]/10 text-[#34d399]' : 'bg-[#abc7ff]/10 text-[#abc7ff]'
                      }`}>
                        {proj.category}
                      </span>
                      <span className={`text-[10px] font-black tracking-widest uppercase ${
                        proj.status === 'ACTIVE' ? 'text-[#34d399]' :
                        proj.status === 'CLOSED' ? 'text-red-500' : 'text-zinc-500'
                      }`}>
                        {proj.status}
                      </span>
                    </div>
                    <h4 className="font-heading text-xs font-bold text-[#e2e2e9] leading-snug">{proj.title}</h4>
                    <p className="text-[9px] text-zinc-500 font-mono">ID: #{proj.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-[#4f453b]/10 pt-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wider">Trạng thái hoạt động</label>
                    <div className="flex gap-1.5">
                      {['ACTIVE', 'CLOSED', 'MAINTENANCE'].map((st) => (
                        <button
                          key={st}
                          onClick={() => updateProjectField(proj.id, 'status', st)}
                          className={`text-[9px] font-bold px-2 py-1.5 rounded transition-colors uppercase tracking-wider flex-1 text-center border ${
                            proj.status === st 
                              ? 'bg-[#ecbe8e]/10 text-[#ecbe8e] border-[#ecbe8e]/40 shadow-[0_0_8px_rgba(236,190,142,0.1)]' 
                              : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                          }`}
                        >
                          {st === 'ACTIVE' ? 'Mở' : st === 'CLOSED' ? 'Đóng' : 'Bảo Trì'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wider">Tiến độ gọi vốn: {proj.progress}%</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={proj.progress}
                        onChange={(e) => updateProjectField(proj.id, 'progress', parseInt(e.target.value))}
                        className="w-full accent-[#ecbe8e] bg-zinc-800 rounded-lg appearance-none h-1 cursor-pointer"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={proj.progress}
                        onChange={(e) => updateProjectField(proj.id, 'progress', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-12 bg-zinc-900 border border-zinc-800 text-white rounded px-1.5 py-0.5 text-center font-mono text-[10px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 border-t border-[#4f453b]/10 pt-3 mt-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 block uppercase tracking-wider">Lãi suất</label>
                    <input
                      type="text"
                      value={proj.interestRate}
                      onChange={(e) => updateProjectField(proj.id, 'interestRate', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 block uppercase tracking-wider">Đầu tư tối thiểu</label>
                    <input
                      type="text"
                      value={proj.minAmount}
                      onChange={(e) => updateProjectField(proj.id, 'minAmount', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 block uppercase tracking-wider">Quy mô dự án</label>
                    <input
                      type="text"
                      value={proj.scale}
                      onChange={(e) => updateProjectField(proj.id, 'scale', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checklist Sections */}
      <div className="space-y-6">

        {/* VINPEARL Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setVinpearlChecked(!vinpearlChecked);
                saveState({ vinpearlChecked: !vinpearlChecked });
              }}
              className="text-[#ecbe8e]"
            >
              {vinpearlChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-zinc-600" />}
            </button>
            <h4 className="font-heading text-xs font-black uppercase tracking-wider text-white">VINPEARL</h4>
          </div>

          {vinpearlChecked && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {vinpearlAssets.map((asset) => (
                <div key={asset.id} className="bg-[#1a1b21] border border-[#4f453b]/40 rounded-lg p-3.5 flex flex-col justify-between min-h-[140px] hover:border-[#ecbe8e]/40 transition-colors relative group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-zinc-600 font-mono">{asset.num}</span>
                    <button 
                      onClick={() => toggleAssetCheck('vinpearl', asset.id)}
                      className="text-zinc-500 hover:text-[#ecbe8e] transition-colors"
                    >
                      {asset.checked ? <CheckSquare className="w-4 h-4 text-[#ecbe8e]" /> : <Square className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <h5 className="font-heading text-[11px] font-bold text-[#e2e2e9] leading-snug flex-1 mb-3">
                    {asset.title}
                  </h5>

                  <div className="flex justify-between items-center mt-auto border-t border-[#4f453b]/10 pt-2">
                    <span className={`text-[10px] font-black tracking-widest uppercase ${asset.status === 'ACTIVE' ? 'text-[#34d399]' : 'text-zinc-500'}`}>
                      {asset.status}
                    </span>
                    <button 
                      onClick={() => toggleAssetStatus('vinpearl', asset.id)}
                      className="text-[9px] font-bold text-[#ecbe8e] hover:underline uppercase tracking-wider"
                    >
                      Đổi Trạng Thái
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* VINHOMES Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setVinhomesChecked(!vinhomesChecked);
                saveState({ vinhomesChecked: !vinhomesChecked });
              }}
              className="text-[#ecbe8e]"
            >
              {vinhomesChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-zinc-600" />}
            </button>
            <h4 className="font-heading text-xs font-black uppercase tracking-wider text-white">VINHOMES</h4>
          </div>

          {vinhomesChecked && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {vinhomesAssets.map((asset) => (
                <div key={asset.id} className="bg-[#1a1b21] border border-[#4f453b]/40 rounded-lg p-3.5 flex flex-col justify-between min-h-[140px] hover:border-[#ecbe8e]/40 transition-colors relative group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-zinc-600 font-mono">{asset.num}</span>
                    <button 
                      onClick={() => toggleAssetCheck('vinhomes', asset.id)}
                      className="text-zinc-500 hover:text-[#ecbe8e] transition-colors"
                    >
                      {asset.checked ? <CheckSquare className="w-4 h-4 text-[#ecbe8e]" /> : <Square className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <h5 className="font-heading text-[11px] font-bold text-[#e2e2e9] leading-snug flex-1 mb-3">
                    {asset.title}
                  </h5>

                  <div className="flex justify-between items-center mt-auto border-t border-[#4f453b]/10 pt-2">
                    <span className={`text-[10px] font-black tracking-widest uppercase ${asset.status === 'ACTIVE' ? 'text-[#34d399]' : 'text-zinc-500'}`}>
                      {asset.status}
                    </span>
                    <button 
                      onClick={() => toggleAssetStatus('vinhomes', asset.id)}
                      className="text-[9px] font-bold text-[#ecbe8e] hover:underline uppercase tracking-wider"
                    >
                      Đổi Trạng Thái
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* STOCK MARKET INTERVENTION Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setStockChecked(!stockChecked);
                saveState({ stockChecked: !stockChecked });
              }}
              className="text-[#ecbe8e]"
            >
              {stockChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-zinc-600" />}
            </button>
            <h4 className="font-heading text-xs font-black uppercase tracking-wider text-white">STOCK MARKET INTERVENTION (ĐẦU TƯ CHỨNG KHOÁN)</h4>
          </div>

          {stockChecked && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['VIC', 'VHM', 'VFS'].map((symbol) => (
                <div key={symbol} className="bg-[#1a1b21] border border-[#4f453b]/40 rounded-xl p-5 hover:border-[#ecbe8e]/30 transition-colors">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-heading text-base font-black text-white">{symbol}</span>
                    <span className="text-[10px] font-bold tracking-widest text-[#34d399] uppercase">NORMAL</span>
                  </div>
                  
                  <div className="space-y-3 border-t border-[#4f453b]/15 pt-4">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">MARKET INTERVENTION</div>
                    
                    <div className="flex justify-between items-center bg-[#111318] p-3 rounded-lg border border-[#4f453b]/10">
                      <div>
                        <div className="text-[10px] font-bold text-[#34d399] tracking-wider uppercase">WIN MODE</div>
                        <div className="text-[9px] text-zinc-500">Force market to winning state</div>
                      </div>
                      
                      <button 
                        onClick={() => toggleIntervention(symbol)}
                        className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative ${interventionStates[symbol] ? 'bg-[#34d399]' : 'bg-zinc-700'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${interventionStates[symbol] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* VINFAST Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setVinfastChecked(!vinfastChecked);
                saveState({ vinfastChecked: !vinfastChecked });
              }}
              className="text-[#ecbe8e]"
            >
              {vinfastChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-zinc-600" />}
            </button>
            <h4 className="font-heading text-xs font-black uppercase tracking-wider text-white">VINFAST</h4>
          </div>

          {vinfastChecked && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {vinfastAssets.map((asset) => (
                <div key={asset.id} className="bg-[#1a1b21] border border-[#4f453b]/40 rounded-lg p-3.5 flex flex-col justify-between min-h-[120px] hover:border-[#ecbe8e]/40 transition-colors relative group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-zinc-600 font-mono">{asset.num}</span>
                    <button 
                      onClick={() => toggleAssetCheck('vinfast', asset.id)}
                      className="text-zinc-500 hover:text-[#ecbe8e] transition-colors"
                    >
                      {asset.checked ? <CheckSquare className="w-4 h-4 text-[#ecbe8e]" /> : <Square className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <h5 className="font-heading text-xs font-black text-[#e2e2e9] mb-3">
                    {asset.title}
                  </h5>

                  <div className="flex justify-between items-center mt-auto border-t border-[#4f453b]/10 pt-2">
                    <span className={`text-[10px] font-black tracking-widest uppercase ${asset.status === 'ACTIVE' ? 'text-[#34d399]' : 'text-zinc-500'}`}>
                      {asset.status}
                    </span>
                    <button 
                      onClick={() => toggleAssetStatus('vinfast', asset.id)}
                      className="text-[9px] font-bold text-[#ecbe8e] hover:underline uppercase tracking-wider"
                    >
                      Đổi Trạng Thái
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CASINO MANAGEMENT Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setCasinoChecked(!casinoChecked);
                saveState({ casinoChecked: !casinoChecked });
              }}
              className="text-[#ecbe8e]"
            >
              {casinoChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-zinc-600" />}
            </button>
            <h4 className="font-heading text-xs font-black uppercase tracking-wider text-white">CASINO MANAGEMENT (QUẢN LÝ CASINO)</h4>
          </div>

          {casinoChecked && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {casinoGames.map((game) => (
                <div key={game.id} className="bg-[#1a1b21] border border-[#4f453b]/40 rounded-xl p-5 hover:border-[#ecbe8e]/30 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-heading text-xs font-black tracking-wider text-white">{game.title}</span>
                      <button 
                        onClick={() => toggleCasinoOpen(game.id)}
                        className={`px-3 py-1 text-[9px] font-black rounded-full uppercase border transition-colors ${
                          game.isOpen 
                            ? 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30' 
                            : 'bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/30'
                        }`}
                      >
                        ● {game.isOpen ? 'MỞ CƯỢC' : 'ĐÓNG CƯỢC'}
                      </button>
                    </div>

                    {/* Auto Schedules */}
                    <div className="bg-[#111318] border border-[#4f453b]/10 rounded-lg p-3 space-y-3 mb-4">
                      <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#ecbe8e]" /> HẸN GIỜ TỰ ĐỘNG</span>
                        <button 
                          onClick={() => addCasinoSchedule(game.id)}
                          className="p-1 hover:bg-zinc-800 rounded text-[#ecbe8e] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {game.schedules.length === 0 ? (
                        <div className="text-[10px] text-zinc-600 italic">Chưa có lịch trình tự động</div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {game.schedules.map((sched, sIdx) => (
                            <span key={sched} className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] py-1 px-2.5 rounded-md flex items-center gap-1.5">
                              {sched}
                              <button 
                                onClick={() => removeCasinoSchedule(game.id, sIdx)}
                                className="text-zinc-600 hover:text-red-400 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payout Ratio Selection */}
                  <div className="space-y-2 border-t border-[#4f453b]/10 pt-4 mt-auto">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">PAYOUT RATIO (TỶ LỆ TRẢ THƯỞNG)</div>
                    <div className="grid grid-cols-3 gap-2">
                      {['1:1', '1:1.2', '1:1.5'].map((ratio) => (
                        <button 
                          key={ratio}
                          onClick={() => changePayoutRatio(game.id, ratio)}
                          className={`text-xs py-2 rounded-md font-bold transition-colors border ${
                            game.payoutRatio === ratio 
                              ? 'bg-[#ecbe8e]/10 text-[#ecbe8e] border-[#ecbe8e]/50 shadow-[0_0_8px_rgba(236,190,142,0.15)]' 
                              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
