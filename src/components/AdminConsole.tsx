import React, { useState, useEffect, useContext, useMemo } from 'react';
import { 
  ChevronLeft, Users, DollarSign, TrendingUp, CheckCircle, XCircle, ShieldAlert,
  Search, Lock, Unlock, ArrowUpRight, CreditCard, Filter, FileText, Bell, MessageSquare,
  Image as ImageIcon, Settings, History, ExternalLink, KeyRound,
  Save, Percent, Coins, Power, Edit
} from 'lucide-react';
import { UserContext } from './UserContext';
import { Project } from '../types';
import { db, auth } from '../firebase';
import { collection, query, onSnapshot, updateDoc, doc, getDoc, where, orderBy, addDoc, serverTimestamp, setDoc, runTransaction } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const chartData = [
  { name: 'Vinpearl', value: 45, color: '#D4AF37' },
  { name: 'VinFast', value: 25, color: '#3b82f6' },
  { name: 'Vinhomes', value: 20, color: '#10b981' },
  { name: 'Casino', value: 10, color: '#f43f5e' },
];

interface ProjectEditCardProps {
  project: Project;
  onSave: (id: string, updates: Partial<Project>) => Promise<void>;
}

function ProjectEditCard({ project, onSave }: ProjectEditCardProps) {
  const [title, setTitle] = useState(project.title);
  const [category, setCategory] = useState(project.category);
  const [interestRateValue, setInterestRateValue] = useState(project.interestRateValue);
  const [minInvestAmount, setMinInvestAmount] = useState(project.minInvestAmount);
  const [scale, setScale] = useState(project.scale || '');
  const [durationDays, setDurationDays] = useState(project.durationDays || 5);
  const [progress, setProgress] = useState(project.progress || 0);
  const [imageUrl, setImageUrl] = useState(project.imageUrl || '');
  const [status, setStatus] = useState(project.status || 'ACTIVE');
  const [isSaving, setIsSaving] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    setTitle(project.title);
    setCategory(project.category);
    setInterestRateValue(project.interestRateValue);
    setMinInvestAmount(project.minInvestAmount);
    setScale(project.scale || '');
    setDurationDays(project.durationDays || 5);
    setProgress(project.progress || 0);
    setImageUrl(project.imageUrl || '');
    setStatus(project.status || 'ACTIVE');
  }, [project]);

  const handleToggleStatus = async () => {
    const nextStatus = status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    setStatus(nextStatus);
    setIsSaving(true);
    try {
      await onSave(project.id, { status: nextStatus });
    } catch (e) {
      console.error(e);
      setStatus(status);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await onSave(project.id, {
        title,
        category,
        interestRateValue: Number(interestRateValue),
        minInvestAmount: Number(minInvestAmount),
        scale,
        durationDays: Number(durationDays),
        progress: Number(progress),
        imageUrl,
      });
      alert(`Đã cập nhật dự án "${title}" thành công!`);
    } catch (e) {
      console.error(e);
      alert('Lỗi cập nhật dự án!');
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)} Tỷ VNĐ`;
    if (val >= 1000000) return `${(val / 1000000).toFixed(0)} Triệu VNĐ`;
    return `${val.toLocaleString('vi-VN')} VNĐ`;
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* The Bank Card */}
      <div 
        className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/30 shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all hover:border-[#D4AF37]/60 duration-300 group hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] flex flex-col justify-between p-6 min-h-[380px] w-full"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 13, 26, 0.7) 0%, rgba(0, 9, 18, 0.95) 100%), url(${imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Top Header */}
        <div className="flex justify-between items-start w-full z-10">
          <div className="flex items-center gap-3">
            {/* Gold Chip */}
            <div className="w-10 h-8 rounded-md bg-gradient-to-br from-[#ebd5ad] via-[#c29b57] to-[#ebd5ad] border border-amber-600/20 flex flex-col justify-between p-1 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]">
              <div className="h-[2px] bg-amber-800/30 rounded-sm"></div>
              <div className="flex justify-between w-full h-[8px]">
                <div className="w-[10px] h-full bg-amber-800/30 rounded-sm"></div>
                <div className="w-[10px] h-full bg-amber-800/30 rounded-sm"></div>
              </div>
              <div className="h-[2px] bg-amber-800/30 rounded-sm"></div>
            </div>
            {/* Brand Label */}
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-widest text-[#ebd5ad] uppercase font-['Montserrat']">VINCLUB INVEST</span>
              <span className="text-[8px] font-semibold text-zinc-400 uppercase tracking-widest leading-none mt-0.5">{category} Card</span>
            </div>
          </div>
          
          {/* Status Toggle Switch */}
          <div className="flex items-center gap-2 bg-black/45 border border-white/5 py-1.5 px-3 rounded-full backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              {status === 'ACTIVE' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-zinc-600'}`}></span>
            </span>
            <span className="text-[9px] font-bold text-zinc-300 mr-1.5 uppercase tracking-wider">{status === 'ACTIVE' ? 'Mở' : 'Khóa'}</span>
            <button 
              type="button"
              onClick={handleToggleStatus}
              disabled={isSaving}
              className={`relative inline-flex h-5.5 w-10 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                  status === 'ACTIVE' ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Card Middle: Project Title */}
        <div className="my-5 z-10 flex flex-col justify-end">
          <label className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">Tên Dự Án</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-b border-transparent hover:border-[#D4AF37]/35 focus:border-[#D4AF37] text-white font-['Montserrat'] font-bold text-lg md:text-xl outline-none transition-all py-1"
            title="Nhấp vào để sửa tên dự án"
          />
        </div>

        {/* Card Controls Grid */}
        <div className="grid grid-cols-2 gap-4 z-10">
          {/* Lãi Suất */}
          <div className="bg-black/45 border border-white/5 rounded-2xl p-3 backdrop-blur-md flex flex-col justify-center">
            <label className="block text-[8px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">LÃI SUẤT (%/Kỳ)</label>
            <div className="relative flex items-center">
              <input 
                type="number" 
                step="0.1"
                value={(interestRateValue * 100).toFixed(1)} 
                onChange={(e) => setInterestRateValue(Number(e.target.value) / 100)}
                className="w-full bg-transparent border-none text-white font-bold text-base outline-none p-0 focus:ring-0"
              />
              <span className="text-[#ebd5ad] font-bold text-sm ml-1">%</span>
            </div>
          </div>

          {/* Đầu Tư Tối Thiểu */}
          <div className="bg-black/45 border border-white/5 rounded-2xl p-3 backdrop-blur-md flex flex-col justify-center">
            <label className="block text-[8px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">TỐI THIỂU (VNĐ)</label>
            <input 
              type="number" 
              value={minInvestAmount} 
              onChange={(e) => setMinInvestAmount(Number(e.target.value))}
              className="w-full bg-transparent border-none text-[#ebd5ad] font-bold text-sm outline-none p-0 focus:ring-0"
            />
            <span className="text-[8px] text-zinc-400 block mt-0.5 truncate">{formatCurrency(minInvestAmount)}</span>
          </div>

          {/* Tiến Độ Huy Động */}
          <div className="col-span-2 bg-black/45 border border-white/5 rounded-2xl p-3.5 backdrop-blur-md flex flex-col justify-center">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">TIẾN ĐỘ HUY ĐỘNG</label>
              <span className="text-xs font-bold text-white">{progress}%</span>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="0"
                max="100"
                value={progress} 
                onChange={(e) => setProgress(Number(e.target.value))}
                className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="flex justify-between items-center mt-5 z-10 pt-2.5 border-t border-white/5">
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            {showMore ? 'Ẩn cấu hình phụ' : 'Cấu hình phụ...'}
          </button>
          
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="bg-gradient-to-r from-[#ebd5ad] to-[#c29b57] hover:from-[#c29b57] hover:to-[#ebd5ad] disabled:from-zinc-700 disabled:to-zinc-800 disabled:text-zinc-500 text-black font-black py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all active:scale-[0.97] text-[10px] uppercase tracking-wider shadow-[0_4px_16px_rgba(194,155,87,0.25)] cursor-pointer"
          >
            <Save className="w-3 h-3" />
            {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
          </button>
        </div>
      </div>

      {/* Expanded Sub-configs */}
      {showMore && (
        <div className="bg-[#000d1a]/50 border border-zinc-800/80 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-300 backdrop-blur-md">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] border-b border-zinc-800/50 pb-2 mb-2">Cấu hình nâng cao / thông tin phụ</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Phân Khu / Danh Mục</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              >
                <option value="Vinpearl">Vinpearl</option>
                <option value="Vinhomes">Vinhomes</option>
                <option value="VinFast">VinFast</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Quy Mô Tổng Thể</label>
              <input 
                type="text" 
                value={scale} 
                onChange={(e) => setScale(e.target.value)}
                placeholder="Ví dụ: 35.000 Tỷ VNĐ"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Kỳ Hạn Đầu Tư (ngày)</label>
              <input 
                type="number" 
                value={durationDays} 
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Đường Dẫn Hình Ảnh (URL)</label>
              <input 
                type="text" 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectEditParamsForm({ project, onSave }: { project: Project, onSave: (id: string, updates: Partial<Project>) => Promise<void> }) {
  const [title, setTitle] = useState(project.title);
  const [interestRateValue, setInterestRateValue] = useState(project.interestRateValue);
  const [minInvestAmount, setMinInvestAmount] = useState(project.minInvestAmount);
  const [scale, setScale] = useState(project.scale || '');
  const [durationDays, setDurationDays] = useState(project.durationDays || 5);
  const [progress, setProgress] = useState(project.progress || 0);
  const [imageUrl, setImageUrl] = useState(project.imageUrl || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(project.id, {
        title,
        interestRateValue: Number(interestRateValue),
        minInvestAmount: Number(minInvestAmount),
        scale,
        durationDays: Number(durationDays),
        progress: Number(progress),
        imageUrl
      });
      alert(`Đã lưu cấu hình dự án "${title}" thành công!`);
    } catch (e) {
      console.error(e);
      alert('Lỗi lưu cấu hình!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 text-zinc-300 font-body">
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Tên dự án / xe / cổ phiếu</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-[#1e293b]/50 border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-[#D4AF37] transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Lãi suất (% / chu kỳ)</label>
          <div className="relative flex items-center">
            <input 
              type="number" 
              step="0.1"
              value={(interestRateValue * 100).toFixed(1)} 
              onChange={(e) => setInterestRateValue(Number(e.target.value) / 100)}
              className="w-full bg-[#1e293b]/50 border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-[#D4AF37] transition-all"
            />
            <span className="absolute right-3 text-zinc-400 font-bold">%</span>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Tối thiểu (VNĐ)</label>
          <input 
            type="number" 
            value={minInvestAmount} 
            onChange={(e) => setMinInvestAmount(Number(e.target.value))}
            className="w-full bg-[#1e293b]/50 border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-[#D4AF37] transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Kỳ hạn (ngày)</label>
          <input 
            type="number" 
            value={durationDays} 
            onChange={(e) => setDurationDays(Number(e.target.value))}
            className="w-full bg-[#1e293b]/50 border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-[#D4AF37] transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Tiến độ huy động (%)</label>
          <div className="flex items-center gap-2 mt-1">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={progress} 
              onChange={(e) => setProgress(Number(e.target.value))}
              className="flex-1 accent-[#D4AF37] h-1"
            />
            <span className="text-xs font-bold text-white w-8 text-right">{progress}%</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Quy mô / Phân khúc</label>
        <input 
          type="text" 
          value={scale} 
          onChange={(e) => setScale(e.target.value)}
          className="w-full bg-[#1e293b]/50 border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-[#D4AF37] transition-all"
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Đường dẫn ảnh (URL)</label>
        <input 
          type="text" 
          value={imageUrl} 
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full bg-[#1e293b]/50 border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-[#D4AF37] transition-all"
        />
      </div>

      <button 
        type="button" 
        onClick={handleSave} 
        disabled={isSaving}
        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#ebd5ad] hover:from-[#ebd5ad] hover:to-[#D4AF37] text-black font-black uppercase tracking-wider py-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.2)] active:scale-[0.98] mt-2 cursor-pointer"
      >
        {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
      </button>
    </div>
  );
}

export default function AdminConsole({ onBack }: { onBack: () => void }) {
  const userCtx = useContext(UserContext);
  const { cmsBanners, updateCmsBanners, cmsNews, updateCmsNews, cmsVinfast, updateCmsVinfast } = userCtx;
  const [activeTab, setActiveTab] = useState<'overview' | 'finance' | 'users' | 'projects' | 'cms' | 'notifications' | 'support' | 'audit_logs'>('overview');
  const [projectSubTab, setProjectSubTab] = useState<'vinpearl' | 'vinhomes' | 'vinfast' | 'stocks' | 'casino'>('vinpearl');

  const [activeSchedulerGameId, setActiveSchedulerGameId] = useState<string | null>(null);
  const [newScheduleStart, setNewScheduleStart] = useState('08:00');
  const [newScheduleEnd, setNewScheduleEnd] = useState('12:00');

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingCallback, setEditingCallback] = useState<((id: string, updates: Partial<Project>) => Promise<void>) | null>(null);

  const [globalSearch, setGlobalSearch] = useState('');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [cmsSubTab, setCmsSubTab] = useState<'news' | 'banners' | 'vinfast'>('news');
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newsForm, setNewsForm] = useState<any>({});
  const [localVinfast, setLocalVinfast] = useState<any[]>(cmsVinfast || []);
  
  useEffect(() => {
    setLocalVinfast(cmsVinfast || []);
  }, [cmsVinfast]);

  const saveVinfastChanges = () => {
    updateCmsVinfast(localVinfast);
    alert('Đã lưu thay đổi thông số xe!');
  };

  const vinfastProjects = (userCtx.cmsVinfast || []).map((car: any) => ({
    id: car.title,
    title: car.title,
    imageUrl: `https://vinfastauto.com/themes/porto/img/homepage-v2/car/${car.title.replace(' ', '')}.webp`,
    interestRateValue: parseFloat(car.profit) / 100,
    minInvestAmount: parseFloat(car.minCapital.replace(/\./g, '') || '0'),
    progress: car.progress !== undefined ? car.progress : 100,
    status: car.status || 'ACTIVE',
    category: 'VinFast',
    scale: `${car.kw} kW`,
    durationDays: 365
  } as Project));

  const stockProjects = (userCtx.standardStocks || []).map((stock: any) => ({
    id: stock.symbol,
    title: `${stock.name} (${stock.symbol})`,
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=500&auto=format&fit=crop',
    interestRateValue: (stock.changePercent || 0) / 100,
    minInvestAmount: stock.price || 0,
    progress: 100,
    status: stock.status || 'ACTIVE',
    category: 'Chứng khoán',
    scale: stock.volume || '0',
    durationDays: 1
  } as Project));

  const casinoProjects = (userCtx.casinoGames || []).map((game: any) => ({
    id: game.id,
    title: game.title,
    imageUrl: game.imageUrl,
    interestRateValue: 0,
    minInvestAmount: 0,
    progress: 100,
    status: game.status || 'ACTIVE',
    category: 'Casino Corona',
    scale: 'Casino Game',
    durationDays: 1
  } as Project));
  
  const handleApproveTransaction = async (
    transaction: any,
    userId: string
  ) => {
    if (processingIds.has(transaction.id)) return;

    setProcessingIds(prev => new Set(prev).add(transaction.id));

    try {
      const userRef = doc(db, 'users', userId);

      await runTransaction(db, async (firestoreTx) => {
        const userSnap = await firestoreTx.get(userRef);

        if (!userSnap.exists()) {
          throw new Error('Người dùng không tồn tại.');
        }

        const userData = userSnap.data();
        const currentTransactions = userData.transactions || [];
        
        const txIndex = currentTransactions.findIndex((t: any) => t.id === transaction.id);
        if (txIndex === -1) {
          throw new Error('Giao dịch không tồn tại.');
        }

        const txData = currentTransactions[txIndex];
        if (txData.status !== 'Đang xử lý') {
          throw new Error(`Giao dịch này đã được xử lý (${txData.status}).`);
        }

        const currentBalance = userData.balance ?? 0;
        const amount = txData.amount;
        let newBalance = currentBalance;

        if (txData.type === 'deposit') {
          newBalance = currentBalance + amount;
        }

        const updatedTransactions = [...currentTransactions];
        updatedTransactions[txIndex] = {
          ...txData,
          status: 'Thành công',
          processedAt: new Date().toLocaleString('vi-VN'),
          processedBy: auth.currentUser?.uid ?? 'unknown',
        };

        const updates: any = {
          transactions: updatedTransactions,
          balance: newBalance
        };

        if (txData.type === 'deposit') {
          const updatedDeposits = (userData.depositsList || []).map((dep: any) => {
            if (dep.txId === transaction.id || (dep.amount === amount && dep.status === 'Đang xử lý')) {
              return { ...dep, status: 'Thành công' };
            }
            return dep;
          });
          updates.depositsList = updatedDeposits;
        }

        firestoreTx.update(userRef, updates);
      });

      await addAuditLog(`Phê duyệt giao dịch ${transaction.type === 'deposit' ? 'nạp' : 'rút'} ${transaction.amount.toLocaleString('vi-VN')}đ cho user ${userId}`, userId, 'Đang xử lý', 'Thành công');
      console.log(`✅ Giao dịch ${transaction.id} đã được phê duyệt.`);
      alert(`Giao dịch ${transaction.id} đã được phê duyệt.`);
    } catch (error: any) {
      alert(`Lỗi phê duyệt: ${error.message}`);
      console.error('handleApproveTransaction error:', error);
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(transaction.id);
        return next;
      });
    }
  };

  const handleRejectTransaction = async (
    transaction: any,
    userId: string
  ) => {
    if (processingIds.has(transaction.id)) return;

    const reason = window.prompt(`Nhập lý do từ chối giao dịch ${transaction.id}:`);
    if (reason === null) return;

    setProcessingIds(prev => new Set(prev).add(transaction.id));

    try {
      const userRef = doc(db, 'users', userId);

      await runTransaction(db, async (firestoreTx) => {
        const userSnap = await firestoreTx.get(userRef);

        if (!userSnap.exists()) {
          throw new Error('Người dùng không tồn tại.');
        }

        const userData = userSnap.data();
        const currentTransactions = userData.transactions || [];
        
        const txIndex = currentTransactions.findIndex((t: any) => t.id === transaction.id);
        if (txIndex === -1) {
          throw new Error('Giao dịch không tồn tại.');
        }

        const txData = currentTransactions[txIndex];
        if (txData.status !== 'Đang xử lý') {
          throw new Error(`Giao dịch này đã được xử lý (${txData.status}).`);
        }

        const currentBalance = userData.balance ?? 0;
        const amount = txData.amount;
        let newBalance = currentBalance;

        if (txData.type === 'withdraw' || txData.type === 'invest') {
          newBalance = currentBalance + amount;
        }

        const updatedTransactions = [...currentTransactions];
        updatedTransactions[txIndex] = {
          ...txData,
          status: 'Thất bại',
          reason: reason || 'Giao dịch không hợp lệ',
          processedAt: new Date().toLocaleString('vi-VN'),
          processedBy: auth.currentUser?.uid ?? 'unknown',
        };

        const updates: any = {
          transactions: updatedTransactions,
          balance: newBalance
        };

        if (txData.type === 'deposit') {
          const updatedDeposits = (userData.depositsList || []).map((dep: any) => {
            if (dep.txId === transaction.id || (dep.amount === amount && dep.status === 'Đang xử lý')) {
              return { ...dep, status: 'Thất bại' };
            }
            return dep;
          });
          updates.depositsList = updatedDeposits;
        }

        firestoreTx.update(userRef, updates);
      });

      await addAuditLog(`Từ chối giao dịch ${transaction.type === 'deposit' ? 'nạp' : 'rút'} ${transaction.amount.toLocaleString('vi-VN')}đ cho user ${userId}. Lý do: ${reason || 'Không hợp lệ'}`, userId, 'Đang xử lý', 'Thất bại');
      console.log(`❌ Giao dịch ${transaction.id} đã bị từ chối.`);
      alert(`Giao dịch ${transaction.id} đã bị từ chối.`);
    } catch (error: any) {
      alert(`Lỗi từ chối: ${error.message}`);
      console.error('handleRejectTransaction error:', error);
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(transaction.id);
        return next;
      });
    }
  };
  
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsub = onSnapshot(q, (snap) => {
      const users: any[] = [];
      snap.forEach(d => {
        users.push({ id: d.id, ...d.data() });
      });
      setAllUsers(users);
      setLoadingUsers(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoadingUsers(false);
    });
    return () => unsub();
  }, []);

  const [usersTabFilter, setUsersTabFilter] = useState<'pending' | 'verified' | 'locked'>('pending');

  const { pendingKycUsers, verifiedUsers, lockedUsers } = useMemo(() => {
    const pending: any[] = [];
    const verified: any[] = [];
    const locked: any[] = [];
    
    allUsers.forEach(u => {
      const matchSearch = (u.displayName?.toLowerCase() || '').includes(globalSearch.toLowerCase()) || 
                          (u.phoneNumber?.toLowerCase() || '').includes(globalSearch.toLowerCase()) ||
                          (u.id?.toLowerCase() || '').includes(globalSearch.toLowerCase());
      if (matchSearch) {
        if (u.isLocked) {
          locked.push(u);
        } else if (u.isIdentityVerified) {
          verified.push(u);
        } else if (u.kycStatus === 'pending' || u.cccdFrontImage || u.cccdBackImage) {
          pending.push(u);
        }
      }
    });
    return { pendingKycUsers: pending, verifiedUsers: verified, lockedUsers: locked };
  }, [allUsers, globalSearch]);

  const displayedUsers = useMemo(() => {
    if (usersTabFilter === 'pending') return pendingKycUsers;
    if (usersTabFilter === 'verified') return verifiedUsers;
    return lockedUsers;
  }, [usersTabFilter, pendingKycUsers, verifiedUsers, lockedUsers]);

  const activeUsersCount = allUsers.length;
  const totalInvestment = allUsers.reduce((sum, u) => sum + (u.balance || 0), 0);

  const dynamicChartData = useMemo(() => {
    return [
      { name: 'Vinpearl', value: totalInvestment * 0.45, color: '#D4AF37' },
      { name: 'VinFast', value: totalInvestment * 0.25, color: '#3b82f6' },
      { name: 'Vinhomes', value: totalInvestment * 0.20, color: '#10b981' },
      { name: 'Casino', value: totalInvestment * 0.10, color: '#f43f5e' },
    ];
  }, [totalInvestment]);
  
  const [financeTabFilter, setFinanceTabFilter] = useState<'pending' | 'success' | 'rejected'>('pending');

  const { pendingTransactions, successTransactions, rejectedTransactions } = useMemo(() => {
    const pending: any[] = [];
    const success: any[] = [];
    const rejected: any[] = [];
    allUsers.forEach(u => {
      if (u.transactions) {
        u.transactions.forEach((t: any) => {
          const tx = { ...t, userId: u.id, userName: u.displayName || u.id, userPhone: u.phoneNumber || '', userBalance: u.balance || 0 };
          if (t.status === 'Đang xử lý') {
            pending.push(tx);
          } else if (t.status === 'Thành công') {
            success.push(tx);
          } else if (t.status === 'Thất bại') {
            rejected.push(tx);
          }
        });
      }
    });
    const sortFn = (a: any, b: any) => {
      if (!b.date || !a.date) return 0;
      return b.date.localeCompare(a.date);
    };
    pending.sort(sortFn);
    success.sort(sortFn);
    rejected.sort(sortFn);
    return { pendingTransactions: pending, successTransactions: success, rejectedTransactions: rejected };
  }, [allUsers]);

  const displayedTransactions = useMemo(() => {
    if (financeTabFilter === 'pending') return pendingTransactions;
    if (financeTabFilter === 'success') return successTransactions;
    return rejectedTransactions;
  }, [financeTabFilter, pendingTransactions, successTransactions, rejectedTransactions]);

  const navItems = [
    { id: 'overview', icon: TrendingUp, label: 'Tổng quan' },
    { id: 'finance', icon: DollarSign, label: 'Duyệt Nạp/Rút', badge: (loadingUsers || activeTab === 'finance') ? 0 : pendingTransactions.length },
    { id: 'users', icon: Users, label: 'Người dùng & KYC' },
    { id: 'projects', icon: FileText, label: 'Điều hành dự án' },
    { id: 'cms', icon: FileText, label: 'Content CMS' },
    { id: 'notifications', icon: Bell, label: 'Thông báo Push' },
    { id: 'support', icon: MessageSquare, label: 'Hỗ trợ trực tuyến' },
    ...((userCtx.role === 'admin' || userCtx.role === 'super_admin') ? [
      { id: 'audit_logs', icon: ShieldAlert, label: 'Audit Logs' }
    ] : [])
  ];

  if (userCtx.role !== 'admin' && userCtx.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-[#000D1A] flex flex-col items-center justify-center text-[#D4AF37] font-['Plus_Jakarta_Sans']">
        <ShieldAlert className="w-16 h-16 mb-4 text-red-500" />
        <h1 className="text-2xl font-bold mb-2 text-white">Truy cập bị từ chối</h1>
        <p className="text-[#A0B0C0] mb-8">Bạn không có quyền truy cập vào Phân hệ Quản trị Viên.</p>
        <button onClick={onBack} className="bg-[#D4AF37] text-[#000D1A] px-6 py-2 rounded font-bold hover:bg-[#b5952f] transition-colors">
          Quay lại trang chủ
        </button>
      </div>
    );
  }


  const rejectTransaction = async (tx: any) => {
    console.log('Attempting to reject transaction:', tx);
    const reason = window.prompt(`Nhập lý do từ chối giao dịch ${tx.id}:`);
    if (reason === null) return;
    try {
      const userDocRef = doc(db, 'users', tx.userId);
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) {
        console.error('User not found:', tx.userId);
        alert('Lỗi: Không tìm thấy người dùng!');
        return;
      }
      const userData = userSnap.data();
      
      const newTransactions = (userData.transactions || []).map((t: any) => {
        if (t.id === tx.id) return { ...t, status: 'Thất bại', reason: reason || 'Giao dịch không hợp lệ' };
        return t;
      });

      let newBalance = userData.balance || 0;
      if (tx.type === 'withdraw' || tx.type === 'invest') {
        newBalance += tx.amount;
      }

      const updates: any = {
        transactions: newTransactions,
        balance: newBalance
      };

      if (tx.type === 'deposit') {
        const updatedDeposits = (userData.depositsList || []).map((dep: any) => {
          if (dep.txId === tx.id || (dep.amount === tx.amount && dep.status === 'Đang xử lý')) {
            return { ...dep, status: 'Thất bại' };
          }
          return dep;
        });
        updates.depositsList = updatedDeposits;
      }

      await updateDoc(userDocRef, updates);
      alert('Đã từ chối giao dịch thành công.');
    } catch (e) {
      console.error('Error rejecting transaction:', e);
      alert(`Lỗi khi từ chối (có thể do mất kết nối mạng): ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  const [kycUserModal, setKycUserModal] = useState<any | null>(null);
  const [selectedTxDetails, setSelectedTxDetails] = useState<any | null>(null);

  const approveKyc = async (userId: string) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { 
        isIdentityVerified: true,
        kycStatus: 'verified',
        kycRejectReason: null
      });
      await addAuditLog(`Phê duyệt KYC cho user ${userId}`, userId, 'pending', 'verified');
      alert('Đã xác thực KYC thành công.');
      setKycUserModal(null);
    } catch (e) {
      console.error(e);
      alert('Lỗi xác thực KYC.');
    }
  };

  const rejectKyc = async (userId: string) => {
    const reason = window.prompt('Nhập lý do từ chối KYC:');
    if (reason === null) return;
    
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { 
        isIdentityVerified: false,
        kycStatus: 'rejected',
        kycRejectReason: reason || 'Thông tin không hợp lệ'
      });
      await addAuditLog(`Từ chối KYC cho user ${userId}. Lý do: ${reason || 'Thông tin không hợp lệ'}`, userId, 'pending', 'rejected');
      alert('Đã từ chối KYC.');
      setKycUserModal(null);
    } catch (e) {
      console.error(e);
      alert('Lỗi từ chối KYC.');
    }
  };

  const toggleUserLock = async (userId: string, isLocked: boolean) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { isLocked: !isLocked });
      await addAuditLog(`${!isLocked ? 'Khóa' : 'Mở khóa'} tài khoản user ${userId}`, userId, isLocked ? 'locked' : 'active', !isLocked ? 'locked' : 'active');
      alert(!isLocked ? 'Đã khóa tài khoản.' : 'Đã mở khóa tài khoản.');
    } catch (e) {
      console.error(e);
    }
  };

  const resetUserPassword = async (userId: string) => {
    const newPass = window.prompt('Nhập mật khẩu mới cho người dùng này:');
    if (!newPass) {
      if (newPass !== null) alert('Mật khẩu không được để trống.');
      return;
    }
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { password: newPass });
      await addAuditLog(`Reset mật khẩu cho user ${userId}`, userId, '******', 'Mật khẩu mới đã được đặt');
      alert(`Đã reset mật khẩu cho user ${userId} thành công.`);
    } catch (e: any) {
      console.error(e);
      alert(`Lỗi reset mật khẩu: ${e.message}`);
    }
  };

  const updateUserRole = async (userId: string, oldRole: string, newRole: string) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { role: newRole });
      await addAuditLog(`Thay đổi vai trò của user ${userId} từ ${oldRole} thành ${newRole}`, userId, oldRole, newRole);
      alert(`Đã cập nhật vai trò của user ${userId} thành ${newRole}.`);
    } catch (e: any) {
      console.error(e);
      alert(`Lỗi thay đổi vai trò: ${e.message}`);
    }
  };

  const handleUpdateProjectStatus = async (projectId: string, newStatus: 'ACTIVE' | 'MAINTENANCE' | 'CLOSED', projectTitle: string) => {
    try {
      await userCtx.updateProjectStatus(projectId, newStatus);
      await addAuditLog(`Cập nhật trạng thái dự án "${projectTitle}" thành ${newStatus}`);
    } catch (e) {
      console.error(e);
    }
  };

  const [selectedChatUser, setSelectedChatUser] = useState<any | null>(null);
  const [adminChatMessages, setAdminChatMessages] = useState<any[]>([]);
  const [adminChatText, setAdminChatText] = useState('');
  const chatEndRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedChatUser) return;
    const q = query(
      collection(db, 'chat_messages'),
      where('conversation_id', '==', selectedChatUser.id),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => {
        const data = d.data();
        let timeStr = '';
        if (data.createdAt) {
          try {
            timeStr = new Date((data.createdAt as any).seconds * 1000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          } catch (e) {
            timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          }
        }
        return { id: d.id, ...data, timeFormatted: timeStr };
      });
      setAdminChatMessages(msgs);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => unsub();
  }, [selectedChatUser]);

  const handleSendAdminMessage = async () => {
    if (!adminChatText.trim() || !selectedChatUser) return;
    try {
      const text = adminChatText;
      setAdminChatText('');
      await addDoc(collection(db, 'chat_messages'), {
        conversation_id: selectedChatUser.id,
        sender_email: 'admin',
        sender_role: 'admin',
        content: text,
        is_read: false,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error(e);
    }
  };

  const [tickerInput, setTickerInput] = useState('');
  const [tickerMessages, setTickerMessages] = useState<string[]>([]);
  
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'ticker'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().messages) {
        setTickerMessages(docSnap.data().messages);
      }
    });
    return () => unsub();
  }, []);

  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    if (userCtx.role !== 'admin' && userCtx.role !== 'super_admin') return;

    const q = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const logs: any[] = [];
      snap.forEach(docSnap => {
        const data = docSnap.data();
        let timeStr = '';
        if (data.timestamp) {
          try {
            timeStr = new Date((data.timestamp as any).seconds * 1000).toLocaleString('vi-VN');
          } catch (e) {
            timeStr = new Date().toLocaleString('vi-VN');
          }
        } else if (data.time) {
          timeStr = data.time;
        }
        logs.push({ id: docSnap.id, ...data, timeFormatted: timeStr });
      });
      setAuditLogs(logs);
    }, (error) => {
      console.error("Error fetching audit logs:", error);
    });
    return () => unsub();
  }, [userCtx.role]);

  const addAuditLog = async (action: string, targetUserId?: string, oldValue?: string, newValue?: string) => {
    try {
      await addDoc(collection(db, 'audit_logs'), {
        action,
        adminName: userCtx.displayName || auth.currentUser?.email || 'Admin',
        adminId: auth.currentUser?.uid || 'unknown',
        timestamp: serverTimestamp(),
        targetUserId: targetUserId || '',
        oldValue: oldValue || '',
        newValue: newValue || '',
      });
    } catch (e) {
      console.error("Error creating audit log in Firestore:", e);
    }
  };

  const handlePushTicker = async () => {
    if (!tickerInput.trim()) return;
    try {
      await setDoc(doc(db, 'settings', 'ticker'), {
        messages: [tickerInput.trim(), ...tickerMessages].slice(0, 5)
      });
      setTickerInput('');
      alert('Đã cập nhật Ticker Banner.');
    } catch (e) {
      console.error(e);
      alert('Lỗi cập nhật Ticker.');
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#000D1A] text-zinc-100 font-['Plus_Jakarta_Sans'] selection:bg-[#D4AF37] selection:text-[#000D1A]">
      <header className="bg-[#001F3F] border-b border-[#D4AF37]/20 px-6 py-4 flex items-center justify-between shrink-0 shadow-md relative z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#D4AF37] hover:text-white transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-bold text-sm hidden sm:inline">Thoát Quyền Admin</span>
            <span className="font-bold text-sm sm:hidden">Thoát</span>
          </button>
          <div className="h-6 w-px bg-zinc-700 hidden sm:block"></div>
          <h1 className="text-lg font-black text-[#D4AF37] uppercase tracking-wider hidden sm:block">VinClub Control</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              className="bg-[#000D1A] border border-zinc-700 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors w-48"
            />
          </div>
          <div className="flex items-center gap-2 bg-[#000D1A] px-3 py-1.5 rounded-lg border border-[#D4AF37]/30">
            <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm font-bold text-[#D4AF37]">Admin</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-20 md:w-64 bg-[#001F3F] border-r border-[#D4AF37]/20 flex flex-col py-6 shrink-0 transition-all">
          <nav className="flex flex-col gap-3 px-3 md:px-4">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3.5 rounded-xl transition-all relative overflow-hidden group ${activeTab === item.id ? 'bg-[#D4AF37] text-[#000D1A] shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'text-zinc-400 hover:bg-[#000D1A] hover:text-white'}`}
              >
                {activeTab === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-[shimmer_3s_infinite] pointer-events-none"></div>
                )}
                <item.icon className="w-5 h-5 shrink-0 relative z-10" />
                <span className="font-bold hidden md:block relative z-10">{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="absolute top-2 right-2 md:static ml-auto bg-rose-500 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 rounded-full relative z-10 shadow-[0_0_10px_rgba(244,63,94,0.5)]">{item.badge}</span>
                ) : null}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#000D1A]">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-4 flex items-center gap-2">
                Phòng điều hành số <span className="text-[#D4AF37] font-normal text-lg">/ Dashboard</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#001F3F] border border-[#D4AF37]/30 p-6 rounded-2xl flex flex-col shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Users className="w-16 h-16 text-white" />
                  </div>
                  <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3">Active Users</span>
                  <div className="flex items-end gap-3 z-10">
                    <span className="text-5xl font-black text-white">{activeUsersCount}</span>
                    <span className="text-[#D4AF37] text-sm font-bold flex items-center mb-1 bg-[#D4AF37]/10 px-2 py-0.5 rounded"><ArrowUpRight className="w-4 h-4 mr-1"/> 12%</span>
                  </div>
                </div>
                <div className="bg-[#001F3F] border border-[#D4AF37]/30 p-6 rounded-2xl flex flex-col shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <DollarSign className="w-16 h-16 text-[#D4AF37]" />
                  </div>
                  <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3">Tổng Dòng Vốn</span>
                  <div className="flex items-end gap-3 z-10">
                    <span className="text-4xl font-black text-[#D4AF37]">{totalInvestment.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
                <div className="bg-[#001F3F] border border-[#D4AF37]/30 p-6 rounded-2xl flex flex-col shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  </div>
                  <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3">System Uptime</span>
                  <div className="flex items-end gap-3 z-10">
                    <span className="text-5xl font-black text-green-400">99.9%</span>
                    <span className="text-green-400/50 text-sm font-bold mb-1 tracking-wide">ONLINE</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#001F3F] border border-[#D4AF37]/20 p-6 rounded-2xl h-96 flex flex-col relative overflow-hidden shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-bold text-lg">Phân bổ dòng vốn các cổng</h3>
                  <span className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full border border-zinc-700">Trực tiếp (Live)</span>
                </div>
                <div className="flex-1 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dynamicChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                      <Tooltip 
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        contentStyle={{ backgroundColor: '#000D1A', borderColor: '#3f3f46', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: any) => [`${value.toLocaleString('vi-VN')} đ`, 'Vốn đầu tư']}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                        {dynamicChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">Trung tâm phê duyệt <span className="text-[#D4AF37] font-normal text-lg">/ Giao dịch</span></h2>
              </div>
              
              <div className="flex gap-4 border-b border-zinc-800 pb-2">
                <button 
                  onClick={() => setFinanceTabFilter('pending')}
                  className={`px-4 py-2 font-bold rounded-t-lg transition-colors flex items-center gap-2 ${financeTabFilter === 'pending' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-zinc-400 hover:text-white'}`}
                >
                  Chờ duyệt (Pending)
                  {pendingTransactions.length > 0 && <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingTransactions.length}</span>}
                </button>
                <button 
                  onClick={() => setFinanceTabFilter('success')}
                  className={`px-4 py-2 font-bold rounded-t-lg transition-colors flex items-center gap-2 ${financeTabFilter === 'success' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-400 hover:text-white'}`}
                >
                  Thành công (Success)
                </button>
                <button 
                  onClick={() => setFinanceTabFilter('rejected')}
                  className={`px-4 py-2 font-bold rounded-t-lg transition-colors flex items-center gap-2 ${financeTabFilter === 'rejected' ? 'text-rose-400 border-b-2 border-rose-400' : 'text-zinc-400 hover:text-white'}`}
                >
                  Đã hủy (Rejected)
                </button>
              </div>

              <div className="bg-[#001F3F] border border-[#D4AF37]/30 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs md:text-sm whitespace-nowrap table-auto md:table-fixed">
                    <thead className="bg-[#000D1A] text-[#D4AF37] text-[11px] md:text-xs uppercase font-black tracking-wider border-b border-[#D4AF37]/30">
                      <tr>
                        <th className="px-4 py-3.5 w-24">Mã GD</th>
                        <th className="px-4 py-3.5 w-36">Thời gian</th>
                        <th className="px-4 py-3.5">Tài khoản</th>
                        <th className="px-4 py-3.5 w-28">Cổng GD</th>
                        <th className="px-4 py-3.5 w-36">Số tiền</th>
                        <th className="px-4 py-3.5 w-48 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {loadingUsers ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-16 text-center text-[#D4AF37] bg-[#001F3F]">
                            <svg className="animate-spin h-8 w-8 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                            </svg>
                            <p className="text-base font-medium">Đang tải dữ liệu từ hệ thống...</p>
                          </td>
                        </tr>
                      ) : displayedTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-16 text-center text-zinc-500 bg-[#001F3F]">
                            <CheckCircle className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                            <p className="text-base font-medium">Không có dữ liệu giao dịch</p>
                          </td>
                        </tr>
                      ) : (
                        displayedTransactions.map((tx) => {
                          const isOverBalance = tx.type === 'withdraw' && tx.amount > tx.userBalance && financeTabFilter === 'pending';
                          return (
                            <tr key={tx.id} className={`transition-colors group ${isOverBalance ? 'bg-rose-500/10' : 'hover:bg-[#D4AF37]/5'}`}>
                              <td className="px-4 py-3 font-mono text-[#D4AF37] text-xs">#{tx.id.substring(0, 8).toUpperCase()}</td>
                              <td className="px-4 py-3 text-zinc-400 text-xs">{tx.date}</td>
                              <td className="px-4 py-3 font-bold text-white">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 shrink-0">
                                    {tx.userName.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="truncate max-w-[120px] md:max-w-[200px] text-xs md:text-sm">{tx.userName}</span>
                                    <span className="text-[10px] text-zinc-500 font-mono">{tx.userPhone || '---'}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-bold border block w-max ${
                                  tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                  tx.type === 'withdraw' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                                  'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                }`}>
                                  {tx.type === 'deposit' ? 'Nạp tiền' : tx.type === 'withdraw' ? 'Rút tiền' : 'Đầu tư'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-col">
                                  <span className="font-black text-white text-xs md:text-sm">{tx.amount?.toLocaleString('vi-VN')} đ</span>
                                  {isOverBalance && (
                                    <span className="text-[9px] text-rose-400 font-bold mt-0.5 bg-rose-500/20 px-1.5 py-0.5 rounded w-max">[VƯỢT QUÁ SỐ DƯ]</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                {financeTabFilter === 'pending' ? (
                                  <div className="flex justify-end gap-2">
                                    <button 
                                      onClick={() => setSelectedTxDetails(tx)}
                                      className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 transition-colors"
                                    >
                                      Chi tiết
                                    </button>
                                    <button 
                                      onClick={() => handleRejectTransaction(tx, tx.userId)}
                                      disabled={processingIds.has(tx.id)}
                                      className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                                        processingIds.has(tx.id)
                                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                                          : 'bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 border-rose-500/30'
                                      }`}
                                    >
                                      Từ chối
                                    </button>
                                    <button 
                                      onClick={() => handleApproveTransaction(tx, tx.userId)}
                                      disabled={processingIds.has(tx.id)}
                                      className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors shadow-lg ${
                                        processingIds.has(tx.id)
                                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                                          : 'bg-emerald-500 hover:bg-emerald-400 text-[#000D1A] shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                      }`}
                                    >
                                      {processingIds.has(tx.id) ? (
                                        <span className="flex items-center gap-1">
                                          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10"
                                              stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8v8z"/>
                                          </svg>
                                          Đang xử lý...
                                        </span>
                                      ) : 'Phê duyệt'}
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex justify-end items-center gap-3">
                                    <button 
                                      onClick={() => setSelectedTxDetails(tx)}
                                      className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 transition-colors"
                                    >
                                      Chi tiết
                                    </button>
                                    <span className={`font-bold text-xs md:text-sm ${financeTabFilter === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                      {financeTabFilter === 'success' ? 'Đã duyệt' : 'Đã từ chối'}
                                      {financeTabFilter === 'rejected' && tx.reason && (
                                        <div className="text-[10px] text-zinc-500 mt-0.5 max-w-[150px] truncate text-right" title={tx.reason}>{tx.reason}</div>
                                      )}
                                    </span>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">Quản lý người dùng <span className="text-[#D4AF37] font-normal text-lg">/ Định danh KYC</span></h2>
              </div>
              
              <div className="flex gap-4 border-b border-zinc-800 pb-2">
                <button 
                  onClick={() => setUsersTabFilter('pending')}
                  className={`px-4 py-2 font-bold rounded-t-lg transition-colors flex items-center gap-2 ${usersTabFilter === 'pending' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-zinc-400 hover:text-white'}`}
                >
                  Chờ duyệt KYC
                  {pendingKycUsers.length > 0 && <span className="bg-amber-500 text-[#000D1A] text-xs px-2 py-0.5 rounded-full">{pendingKycUsers.length}</span>}
                </button>
                <button 
                  onClick={() => setUsersTabFilter('verified')}
                  className={`px-4 py-2 font-bold rounded-t-lg transition-colors flex items-center gap-2 ${usersTabFilter === 'verified' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-400 hover:text-white'}`}
                >
                  Đã xác minh
                </button>
                <button 
                  onClick={() => setUsersTabFilter('locked')}
                  className={`px-4 py-2 font-bold rounded-t-lg transition-colors flex items-center gap-2 ${usersTabFilter === 'locked' ? 'text-rose-400 border-b-2 border-rose-400' : 'text-zinc-400 hover:text-white'}`}
                >
                  Bị khóa / Vi phạm
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedUsers.map(u => (
                  <div key={u.id} className="bg-[#001F3F] border border-[#D4AF37]/30 rounded-2xl p-6 relative overflow-hidden flex flex-col gap-5 shadow-lg group hover:border-[#D4AF37]/60 transition-colors">
                    {u.isLocked && <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>}
                    {!u.isLocked && u.isIdentityVerified && <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>}
                    {!u.isLocked && !u.isIdentityVerified && <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>}
                    
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#000D1A] to-zinc-900 border border-[#D4AF37]/40 rounded-full flex items-center justify-center text-2xl font-black text-[#D4AF37] shadow-inner shrink-0">
                          {(u.displayName?.[0] || 'U').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-lg truncate max-w-[140px]">{u.displayName || u.phoneNumber}</h3>
                            {u.isIdentityVerified && <span title="Đã xác minh"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /></span>}
                            {u.tierName && (
                              <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider shrink-0 ${u.tierName === 'VVIP' ? 'bg-black text-[#D4AF37] border border-[#D4AF37]' : u.tierName === 'VIP' ? 'bg-[#D4AF37] text-black' : u.tierName === 'Gold' ? 'bg-zinc-300 text-zinc-800' : 'bg-zinc-800 text-zinc-400'}`}>
                                {u.tierName}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-zinc-400 font-mono mt-0.5 block">{u.phoneNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#000D1A] rounded-xl p-4 flex justify-between items-center border border-zinc-800/80">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">Trạng thái</span>
                        <span className={`text-sm font-bold ${u.isLocked ? 'text-rose-400' : u.isIdentityVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {u.isLocked ? 'Đã khóa' : u.isIdentityVerified ? 'Đã xác minh' : 'Chờ KYC'}
                        </span>
                      </div>
                      <div className="w-px h-10 bg-zinc-800"></div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">Số dư</span>
                        <span className="text-sm font-black text-[#D4AF37]">{(u.balance || 0).toLocaleString('vi-VN')} đ</span>
                      </div>
                    </div>

                    {/* Phân quyền người dùng & quản trị */}
                    <div className="bg-[#000D1A] rounded-xl p-4 border border-zinc-800/80 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-semibold uppercase tracking-wider">Vai trò:</span>
                        <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase tracking-wider ${
                          u.role === 'super_admin' ? 'bg-rose-500 text-white' :
                          u.role === 'admin' ? 'bg-[#D4AF37] text-black' :
                          u.role === 'finance_admin' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          u.role === 'support_admin' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                          'bg-zinc-800 text-zinc-300'
                        }`}>
                          {u.role || 'user'}
                        </span>
                      </div>
                      
                      {userCtx.role === 'super_admin' && (
                        <div className="flex items-center gap-2 mt-1 pt-1 border-t border-zinc-800/60">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase shrink-0">Chuyển quyền:</span>
                          <select
                            value={u.role || 'user'}
                            onChange={(e) => updateUserRole(u.id, u.role || 'user', e.target.value)}
                            className="bg-black border border-zinc-800 hover:border-[#D4AF37]/50 rounded text-xs px-2 py-1 text-zinc-300 w-full focus:outline-none"
                          >
                            <option value="user">User (Người chơi)</option>
                            <option value="support_admin">Support Admin</option>
                            <option value="finance_admin">Finance Admin</option>
                            <option value="admin">System Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Khôi phục mật khẩu */}
                    {(userCtx.role === 'super_admin' || userCtx.role === 'admin' || userCtx.role === 'support_admin') && (
                      <button
                        onClick={() => resetUserPassword(u.id)}
                        className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 hover:border-amber-500/40 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5" /> Đặt lại mật khẩu (Reset Password)
                      </button>
                    )}

                    <div className="flex justify-between items-center mt-auto pt-2 gap-2">
                      <div className="flex-1">
                        {!u.isIdentityVerified && !u.isLocked ? (
                          <button onClick={() => setKycUserModal(u)} className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-[#000D1A] text-xs font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            <FileText className="w-3.5 h-3.5"/> Xem tài liệu KYC
                          </button>
                        ) : u.isIdentityVerified && !u.isLocked ? (
                          <button onClick={() => setKycUserModal(u)} className="w-full py-2 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                            <FileText className="w-3.5 h-3.5"/> Xem hồ sơ
                          </button>
                        ) : null}
                      </div>
                      <button 
                        onClick={() => toggleUserLock(u.id, !!u.isLocked)}
                        className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all w-[110px] shrink-0 ${u.isLocked ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'}`}
                      >
                        {u.isLocked ? <><Unlock className="w-3.5 h-3.5"/> Mở khóa</> : <><Lock className="w-3.5 h-3.5"/> Khóa TK</>}
                      </button>
                    </div>
                  </div>
                ))}
                {displayedUsers.length === 0 && (
                  <div className="col-span-full py-16 text-center text-zinc-500 bg-[#001F3F] border border-zinc-800/50 rounded-2xl">
                    <Users className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                    <p className="text-base font-medium">Không có người dùng nào trong danh sách này</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (() => {
            const vicStock = userCtx.standardStocks.find(s => s.symbol === 'VIC');
            const vhmStock = userCtx.standardStocks.find(s => s.symbol === 'VHM');
            return (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto text-zinc-100 font-sans pb-16">
                
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#202a40]/60 pb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider font-mono">Trung tâm Điều hành Dự án</h2>
                    <p className="text-xs text-zinc-400 mt-1 font-body font-medium">
                      Hệ thống điều hành tổng thể siêu dự án, quỹ đầu tư, can thiệp tỷ giá chứng khoán và quản lý casino.
                    </p>
                  </div>
                  
                  {/* Search and Profile Controls */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search commands..." 
                        className="bg-[#131824] border border-[#202a40]/60 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-[#D4AF37] w-48 transition-all"
                      />
                    </div>
                    <button className="text-zinc-400 hover:text-white transition-colors p-1.5 bg-[#131824] border border-[#202a40]/60 rounded-xl">
                      <span className="text-xs">🔔</span>
                    </button>
                    <button className="text-zinc-400 hover:text-white transition-colors p-1.5 bg-[#131824] border border-[#202a40]/60 rounded-xl">
                      <span className="text-xs">⚙️</span>
                    </button>
                    <div className="flex items-center gap-2.5 bg-[#131824] border border-[#202a40]/60 rounded-xl px-3 py-1.5">
                      <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold text-[10px]">
                        AD
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white leading-none uppercase">Admin User</span>
                        <span className="text-[8px] text-[#D4AF37] font-semibold tracking-wider mt-0.5 uppercase">MASTER KEY</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stat overview cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* MARKET STATUS */}
                  <div className="bg-[#131824] border border-[#202a40]/60 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-3">
                      <span className="text-[#ebd5ad]">📈</span> MARKET STATUS
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#0c0f17]/60 border border-zinc-800/40 rounded-2xl p-4">
                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">VIC</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-white">
                            {vicStock ? (vicStock.price / 1000).toFixed(2) : '45.20'}
                          </span>
                          <span className={`text-[10px] font-bold ${vicStock && vicStock.changePercent >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                            {vicStock && vicStock.changePercent >= 0 ? '+' : ''}{vicStock ? vicStock.changePercent.toFixed(2) : '+2.4'}%
                          </span>
                        </div>
                      </div>
                      <div className="bg-[#0c0f17]/60 border border-zinc-800/40 rounded-2xl p-4">
                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">VHM</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-white">
                            {vhmStock ? (vhmStock.price / 1000).toFixed(2) : '41.05'}
                          </span>
                          <span className={`text-[10px] font-bold ${vhmStock && vhmStock.changePercent >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                            {vhmStock && vhmStock.changePercent >= 0 ? '+' : ''}{vhmStock ? vhmStock.changePercent.toFixed(2) : '-0.8'}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* INVESTMENT OVERVIEW */}
                  <div className="bg-[#131824] border border-[#202a40]/60 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-3">
                      <span className="text-[#ebd5ad]">💼</span> INVESTMENT OVERVIEW
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-[#0c0f17]/60 border border-zinc-800/40 rounded-2xl p-3.5 flex flex-col justify-between">
                        <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">TOTAL PORTFOLIO</span>
                        <span className="text-lg font-black text-white mt-1">$1.24B</span>
                      </div>
                      <div className="bg-[#0c0f17]/60 border border-zinc-800/40 rounded-2xl p-3.5 flex flex-col justify-between">
                        <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">DAILY VOLUME</span>
                        <span className="text-lg font-black text-white mt-1">12.5M</span>
                      </div>
                      <div className="bg-[#0c0f17]/60 border border-zinc-800/40 rounded-2xl p-3.5 flex flex-col justify-between">
                        <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">TREND</span>
                        <span className="text-lg font-black text-[#10b981] mt-1 uppercase tracking-widest font-mono">Bullish</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category 1: VINPEARL */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-[#202a40]/60 pb-3">
                    <button 
                      onClick={async () => {
                        const allActive = userCtx.adminProjects.every(p => p.status === 'ACTIVE');
                        await userCtx.updateAllProjectsStatus(allActive ? 'CLOSED' : 'ACTIVE');
                      }}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        userCtx.adminProjects.every(p => p.status === 'ACTIVE') ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                        userCtx.adminProjects.every(p => p.status === 'ACTIVE') ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                    <h3 className="text-sm font-black tracking-widest text-[#ebd5ad] uppercase font-mono flex items-center gap-2">
                      VINPEARL
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {userCtx.adminProjects.map((p, idx) => {
                      const isClosed = p.status === 'CLOSED';
                      return (
                        <div 
                          key={p.id}
                          onClick={() => {
                            setEditingProject(p);
                            setEditingCallback(() => userCtx.updateProjectDetails);
                          }}
                          className={`group relative aspect-[3/4] rounded-2xl border border-zinc-800 hover:border-[#D4AF37]/50 bg-[#131824] flex flex-col justify-between p-4 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.08)] ${isClosed ? 'opacity-70' : ''}`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <span className="text-[10px] font-mono text-zinc-600 font-bold">0{idx + 1}</span>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await userCtx.updateProjectDetails(p.id, { status: isClosed ? 'ACTIVE' : 'CLOSED' });
                              }}
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                                !isClosed ? 'bg-blue-500 border-blue-500 text-white' : 'border-zinc-700 text-transparent hover:border-zinc-500'
                              }`}
                            >
                              {!isClosed && <span className="text-[10px]">✓</span>}
                            </button>
                          </div>
                          <div className="flex-1 flex items-center my-3">
                            <h4 className="text-[11px] font-bold text-slate-100 line-clamp-4 leading-relaxed group-hover:text-[#ebd5ad] transition-colors">{p.title}</h4>
                          </div>
                          <div className="flex justify-between items-center text-[8px] font-black tracking-widest uppercase">
                            <span className={isClosed ? 'text-zinc-500' : 'text-blue-400'}>{isClosed ? 'STANDBY' : 'ACTIVE'}</span>
                            <span className="text-[#D4AF37]/50 opacity-0 group-hover:opacity-100 transition-opacity">EDIT ⚙️</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category 2: VINHOMES */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 border-b border-[#202a40]/60 pb-3">
                    <button 
                      onClick={async () => {
                        const allActive = userCtx.standardProjects.every(p => p.status === 'ACTIVE');
                        await userCtx.updateAllStandardProjectsStatus(allActive ? 'CLOSED' : 'ACTIVE');
                      }}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        userCtx.standardProjects.every(p => p.status === 'ACTIVE') ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                        userCtx.standardProjects.every(p => p.status === 'ACTIVE') ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                    <h3 className="text-sm font-black tracking-widest text-[#ebd5ad] uppercase font-mono flex items-center gap-2">
                      VINHOMES
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {userCtx.standardProjects.map((p, idx) => {
                      const isClosed = p.status === 'CLOSED';
                      return (
                        <div 
                          key={p.id}
                          onClick={() => {
                            setEditingProject(p);
                            setEditingCallback(() => userCtx.updateStandardProjectDetails);
                          }}
                          className={`group relative aspect-[3/4] rounded-2xl border border-zinc-800 hover:border-[#D4AF37]/50 bg-[#131824] flex flex-col justify-between p-4 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.08)] ${isClosed ? 'opacity-70' : ''}`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <span className="text-[10px] font-mono text-zinc-600 font-bold">0{idx + 1}</span>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await userCtx.updateStandardProjectDetails(p.id, { status: isClosed ? 'ACTIVE' : 'CLOSED' });
                              }}
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                                !isClosed ? 'bg-blue-500 border-blue-500 text-white' : 'border-zinc-700 text-transparent hover:border-zinc-500'
                              }`}
                            >
                              {!isClosed && <span className="text-[10px]">✓</span>}
                            </button>
                          </div>
                          <div className="flex-1 flex items-center my-3">
                            <h4 className="text-[11px] font-bold text-slate-100 line-clamp-4 leading-relaxed group-hover:text-[#ebd5ad] transition-colors">{p.title}</h4>
                          </div>
                          <div className="flex justify-between items-center text-[8px] font-black tracking-widest uppercase">
                            <span className={isClosed ? 'text-zinc-500' : 'text-blue-400'}>{isClosed ? 'STANDBY' : 'ACTIVE'}</span>
                            <span className="text-[#D4AF37]/50 opacity-0 group-hover:opacity-100 transition-opacity">EDIT ⚙️</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category 3: STOCK MARKET INTERVENTION (ĐẦU TƯ CHỨNG KHOÁN) */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 border-b border-[#202a40]/60 pb-3">
                    <button 
                      onClick={async () => {
                        const allActive = userCtx.standardStocks.every(s => s.status === 'ACTIVE');
                        await userCtx.updateAllStocksStatus(allActive ? 'CLOSED' : 'ACTIVE');
                      }}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        userCtx.standardStocks.every(s => s.status === 'ACTIVE') ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                        userCtx.standardStocks.every(s => s.status === 'ACTIVE') ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                    <h3 className="text-sm font-black tracking-widest text-[#ebd5ad] uppercase font-mono flex items-center gap-2">
                      STOCK MARKET INTERVENTION (ĐẦU TƯ CHỨNG KHOÁN)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['VIC', 'VHM', 'VFS'].map(symbol => {
                      const stock = userCtx.standardStocks.find(s => s.symbol === symbol);
                      if (!stock) return null;
                      const isWinMode = !!stock.winMode;
                      const isClosed = stock.status === 'CLOSED';

                      return (
                        <div 
                          key={stock.symbol}
                          onClick={() => {
                            setEditingProject({
                              id: stock.symbol,
                              title: `${stock.name} (${stock.symbol})`,
                              imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=500&auto=format&fit=crop',
                              interestRate: `${stock.changePercent}%`,
                              duration: '1 ngày',
                              minAmount: `${stock.price.toLocaleString()} VNĐ`,
                              scale: stock.volume,
                              progress: 100,
                              category: 'Chứng khoán',
                              durationDays: 1,
                              minInvestAmount: stock.price,
                              interestRateValue: stock.changePercent / 100,
                              status: stock.status
                            });
                            setEditingCallback(() => async (id, updates) => {
                              const changes: any = {};
                              if (updates.minInvestAmount !== undefined) changes.price = updates.minInvestAmount;
                              if (updates.interestRateValue !== undefined) {
                                changes.changePercent = Number((updates.interestRateValue * 100).toFixed(2));
                                changes.change = Math.round(changes.price * (changes.changePercent / 100));
                              }
                              if (updates.title !== undefined) {
                                const nameMatch = updates.title.match(/^(.*?)\s*\(/);
                                changes.name = nameMatch ? nameMatch[1].trim() : updates.title;
                              }
                              if (updates.scale !== undefined) changes.volume = updates.scale;
                              await userCtx.updateStockDetails(id, changes);
                            });
                          }}
                          className={`bg-[#131824] border border-[#202a40]/60 rounded-3xl p-5 flex flex-col justify-between min-h-[160px] relative transition-all duration-300 hover:border-[#D4AF37]/40 hover:shadow-[0_8px_30px_rgba(212,175,55,0.05)] cursor-pointer ${isClosed ? 'opacity-70' : ''}`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <span className="text-xl font-black text-white tracking-widest">{stock.symbol}</span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${isWinMode ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                              {isWinMode ? 'WIN MODE ACTIVE' : 'NORMAL'}
                            </span>
                          </div>

                          <div className="my-3">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">MARKET INTERVENTION</span>
                          </div>

                          <div className="flex items-center justify-between bg-[#0c0f17]/80 border border-zinc-800/40 rounded-xl p-3 mt-1" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-[#ebd5ad] tracking-wider uppercase leading-none">WIN MODE</span>
                              <span className="text-[8px] text-zinc-500 mt-1">Force market to winning state</span>
                            </div>
                            
                            <button
                              onClick={async () => {
                                await userCtx.updateStockDetails(stock.symbol, { winMode: !isWinMode });
                              }}
                              className={`relative inline-flex h-5.5 w-10 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isWinMode ? 'bg-[#D4AF37]' : 'bg-zinc-700'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                                  isWinMode ? 'translate-x-4.5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category 4: VINFAST */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 border-b border-[#202a40]/60 pb-3">
                    <button 
                      onClick={async () => {
                        const allActive = vinfastProjects.every(p => p.status === 'ACTIVE');
                        await userCtx.updateAllVinfastStatus(allActive ? 'CLOSED' : 'ACTIVE');
                      }}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        vinfastProjects.every(p => p.status === 'ACTIVE') ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                        vinfastProjects.every(p => p.status === 'ACTIVE') ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                    <h3 className="text-sm font-black tracking-widest text-[#ebd5ad] uppercase font-mono flex items-center gap-2">
                      VINFAST
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {vinfastProjects.map((p, idx) => {
                      const isClosed = p.status === 'CLOSED';
                      return (
                        <div 
                          key={p.id}
                          onClick={() => {
                            setEditingProject(p);
                            setEditingCallback(() => async (id, updates) => {
                              const updatedCars = userCtx.cmsVinfast.map((car: any) => {
                                if (car.title === id) {
                                  const newCar = { ...car };
                                  if (updates.title !== undefined) newCar.title = updates.title;
                                  if (updates.interestRateValue !== undefined) newCar.profit = (updates.interestRateValue * 100).toFixed(1);
                                  if (updates.minInvestAmount !== undefined) newCar.minCapital = updates.minInvestAmount.toLocaleString('vi-VN').replace(/,/g, '.');
                                  if (updates.progress !== undefined) newCar.progress = updates.progress;
                                  if (updates.status !== undefined) newCar.status = updates.status;
                                  if (updates.scale !== undefined) newCar.kw = updates.scale.replace(/\D/g, '');
                                  return newCar;
                                }
                                return car;
                              });
                              await userCtx.updateCmsVinfast(updatedCars);
                            });
                          }}
                          className={`group relative aspect-[3/4] rounded-2xl border border-zinc-800 hover:border-[#D4AF37]/50 bg-[#131824] flex flex-col justify-between p-4 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.08)] ${isClosed ? 'opacity-70' : ''}`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <span className="text-[10px] font-mono text-zinc-600 font-bold">0{idx + 1}</span>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                const updatedCars = userCtx.cmsVinfast.map((car: any) => {
                                  if (car.title === p.id) {
                                    return { ...car, status: isClosed ? 'ACTIVE' : 'CLOSED' };
                                  }
                                  return car;
                                });
                                await userCtx.updateCmsVinfast(updatedCars);
                              }}
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                                !isClosed ? 'bg-blue-500 border-blue-500 text-white' : 'border-zinc-700 text-transparent hover:border-zinc-500'
                              }`}
                            >
                              {!isClosed && <span className="text-[10px]">✓</span>}
                            </button>
                          </div>
                          <div className="flex-1 flex items-center my-3">
                            <h4 className="text-[12px] font-black text-slate-100 uppercase tracking-widest leading-relaxed group-hover:text-[#ebd5ad] transition-colors">{p.title}</h4>
                          </div>
                          <div className="flex justify-between items-center text-[8px] font-black tracking-widest uppercase">
                            <span className={isClosed ? 'text-zinc-500' : 'text-blue-400'}>{isClosed ? 'STANDBY' : 'ACTIVE'}</span>
                            <span className="text-[#D4AF37]/50 opacity-0 group-hover:opacity-100 transition-opacity">EDIT ⚙️</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category 5: CASINO MANAGEMENT (QUẢN LÝ CASINO) */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 border-b border-[#202a40]/60 pb-3">
                    <button 
                      onClick={async () => {
                        const allActive = userCtx.casinoGames.every(g => g.status === 'ACTIVE');
                        await userCtx.updateAllCasinoGamesStatus(allActive ? 'CLOSED' : 'ACTIVE');
                      }}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        userCtx.casinoGames.every(g => g.status === 'ACTIVE') ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                        userCtx.casinoGames.every(g => g.status === 'ACTIVE') ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                    <h3 className="text-sm font-black tracking-widest text-[#ebd5ad] uppercase font-mono flex items-center gap-2">
                      CASINO MANAGEMENT (QUẢN LÝ CASINO)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {userCtx.casinoGames.map(game => {
                      const isClosed = game.status === 'CLOSED';
                      const payout = game.payoutRatio || '1:1.2';
                      const schedules = game.schedule || [];
                      const isSchedulerOpen = activeSchedulerGameId === game.id;

                      const handleToggleBetStatus = async () => {
                        await userCtx.updateCasinoGameDetails(game.id, {
                          status: isClosed ? 'ACTIVE' : 'CLOSED'
                        });
                      };

                      const handleAddSchedule = async () => {
                        const timeString = `${newScheduleStart} - ${newScheduleEnd}`;
                        if (schedules.includes(timeString)) return;
                        const updatedSchedules = [...schedules, timeString];
                        await userCtx.updateCasinoGameDetails(game.id, {
                          schedule: updatedSchedules
                        });
                        setActiveSchedulerGameId(null);
                      };

                      const handleDeleteSchedule = async (timeToRemove: string) => {
                        const updatedSchedules = schedules.filter(s => s !== timeToRemove);
                        await userCtx.updateCasinoGameDetails(game.id, {
                          schedule: updatedSchedules
                        });
                      };

                      const handleSelectPayout = async (ratio: '1:1' | '1:1.2' | '1:1.5') => {
                        await userCtx.updateCasinoGameDetails(game.id, {
                          payoutRatio: ratio
                        });
                      };

                      return (
                        <div 
                          key={game.id}
                          className="bg-[#131824] border border-[#202a40]/60 rounded-3xl p-5 flex flex-col justify-between min-h-[300px] transition-all duration-300 hover:border-[#D4AF37]/35"
                        >
                          {/* Header: Title & Status pill */}
                          <div className="flex justify-between items-center w-full mb-4">
                            <span className="text-sm font-black text-slate-100 uppercase tracking-wider">{game.title}</span>
                            <button
                              type="button"
                              onClick={handleToggleBetStatus}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all ${
                                !isClosed 
                                  ? 'bg-emerald-500/10 text-[#10b981] border-emerald-500/20' 
                                  : 'bg-rose-500/10 text-[#f43f5e] border-rose-500/20'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${!isClosed ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                              {!isClosed ? 'MỞ CƯỢC' : 'ĐÓNG CƯỢC'}
                            </button>
                          </div>

                          {/* Scheduler section */}
                          <div className="bg-[#0c0f17]/60 border border-zinc-800/40 rounded-2xl p-4 flex-1 flex flex-col justify-between mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1 font-mono">
                                ⏰ HẸN GIỜ TỰ ĐỘNG
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (isSchedulerOpen) {
                                    setActiveSchedulerGameId(null);
                                  } else {
                                    setActiveSchedulerGameId(game.id);
                                  }
                                }}
                                className="text-[#D4AF37] hover:text-[#ebd5ad] font-bold text-sm"
                              >
                                {isSchedulerOpen ? '✕' : '＋'}
                              </button>
                            </div>

                            {/* Scheduler list / form */}
                            <div className="flex-1 flex flex-col justify-center space-y-2">
                              {isSchedulerOpen ? (
                                <div className="space-y-2 p-2 bg-zinc-950/80 border border-zinc-800/50 rounded-xl">
                                  <div className="flex items-center justify-between gap-2">
                                    <input 
                                      type="text" 
                                      value={newScheduleStart}
                                      onChange={(e) => setNewScheduleStart(e.target.value)}
                                      placeholder="08:00"
                                      className="w-16 bg-[#131824] border border-zinc-800 text-[10px] text-white text-center rounded py-1 outline-none focus:border-[#D4AF37]"
                                    />
                                    <span className="text-zinc-500 text-[10px]">đến</span>
                                    <input 
                                      type="text" 
                                      value={newScheduleEnd}
                                      onChange={(e) => setNewScheduleEnd(e.target.value)}
                                      placeholder="12:00"
                                      className="w-16 bg-[#131824] border border-zinc-800 text-[10px] text-white text-center rounded py-1 outline-none focus:border-[#D4AF37]"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={handleAddSchedule}
                                    className="w-full bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-wider rounded py-1 hover:bg-[#ebd5ad] transition-all"
                                  >
                                    Thêm
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-1.5 items-center justify-start min-h-[40px]">
                                  {schedules.map(timeStr => (
                                    <span 
                                      key={timeStr} 
                                      className="flex items-center gap-1 px-2.5 py-1 bg-zinc-950/80 border border-zinc-850 rounded-lg text-[9px] text-zinc-300 font-mono font-bold"
                                    >
                                      {timeStr}
                                      <button 
                                        type="button"
                                        onClick={() => handleDeleteSchedule(timeStr)}
                                        className="text-rose-500 hover:text-rose-400 font-bold ml-1 text-[8px]"
                                      >
                                        ✕
                                      </button>
                                    </span>
                                  ))}
                                  {schedules.length === 0 && (
                                    <span className="text-[10px] text-zinc-500 font-medium italic">Chưa có lịch trình</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Payout ratio section */}
                          <div>
                            <span className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-wider block mb-2">PAYOUT RATIO (TỶ LỆ TRẢ THƯỞNG)</span>
                            <div className="grid grid-cols-3 gap-2">
                              {(['1:1', '1:1.2', '1:1.5'] as const).map(ratio => (
                                <button
                                  key={ratio}
                                  type="button"
                                  onClick={() => handleSelectPayout(ratio)}
                                  className={`py-2 rounded-xl text-[10px] font-bold transition-all border ${
                                    payout === ratio 
                                      ? 'bg-[#D4AF37]/10 text-[#ebd5ad] border-[#D4AF37]' 
                                      : 'bg-[#0c0f17]/40 text-zinc-400 border-zinc-800/80 hover:text-zinc-200'
                                  }`}
                                >
                                  {ratio}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Project Parameters Edit Modal */}
                {editingProject && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in" onClick={() => setEditingProject(null)}>
                    <div className="bg-[#131824] border border-[#D4AF37]/30 rounded-3xl p-6 max-w-lg w-full shadow-[0_20px_50px_rgba(212,175,55,0.15)] space-y-5 animate-in scale-in duration-300" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <span className="text-[#D4AF37]">⚙️</span> Cấu hình dự án
                        </h3>
                        <button 
                          onClick={() => setEditingProject(null)} 
                          className="text-zinc-400 hover:text-white transition-colors p-1"
                        >
                          ✕
                        </button>
                      </div>
                      <ProjectEditParamsForm 
                        project={editingProject} 
                        onSave={async (id, updates) => {
                          if (editingCallback) {
                            await editingCallback(id, updates);
                          }
                          setEditingProject(null);
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Nhật ký vận hành */}
                <div className="bg-[#131824] border border-[#202a40]/60 rounded-3xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-mono">
                    <History className="w-5 h-5 text-[#D4AF37]" /> NHẬT KÝ VẬN HÀNH
                  </h3>
                  <div className="space-y-2 text-xs font-mono text-zinc-400 max-h-60 overflow-y-auto scrollbar-hide">
                    {userCtx.auditLog.map(log => (
                        <div key={log.id} className="border-b border-zinc-800/40 py-2 flex justify-between items-start gap-4">
                            <span className="text-[#D4AF37] shrink-0 font-bold">{log.time}</span>
                            <span className="flex-1 text-zinc-300">{log.adminName}: {log.action}</span>
                        </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })()}

          {activeTab === 'cms' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">Content CMS <span className="text-[#D4AF37] font-normal text-lg">/ Quản lý nội dung</span></h2>
                <div className="flex gap-2">
                  {(['news', 'banners', 'vinfast'] as const).map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setCmsSubTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${cmsSubTab === tab ? 'bg-[#D4AF37] text-[#000D1A]' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                    >
                      {tab === 'news' ? 'Tin tức' : tab === 'banners' ? 'Banner' : 'VinFast'}
                    </button>
                  ))}
                </div>
              </div>
              
              {cmsSubTab === 'news' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Danh sách Tin tức</h3>
                    <button 
                      onClick={() => setIsAddingNews(true)}
                      className="px-4 py-2 bg-[#D4AF37] text-[#000D1A] font-bold rounded-lg hover:bg-[#b5952f] transition-colors"
                    >
                      + Thêm bài viết
                    </button>
                  </div>
                  {isAddingNews && (
                    <div className="bg-[#001F3F] border border-[#D4AF37]/30 rounded-lg p-6 space-y-4">
                      <input type="text" placeholder="Tiêu đề" className="w-full bg-[#000D1A] border border-zinc-700 rounded-lg p-3 text-white" 
                        onChange={(e) => setNewsForm({...newsForm, title: e.target.value})} />
                      <select className="w-full bg-[#000D1A] border border-zinc-700 rounded-lg p-3 text-white"
                        onChange={(e) => setNewsForm({...newsForm, category: e.target.value})}>
                        <option value="Tin tức VinFast">Tin tức VinFast</option>
                        <option value="Hệ sinh thái">Hệ sinh thái</option>
                        <option value="Công nghệ">Công nghệ</option>
                      </select>
                      <input type="text" placeholder="URL Hình ảnh" className="w-full bg-[#000D1A] border border-zinc-700 rounded-lg p-3 text-white"
                        onChange={(e) => setNewsForm({...newsForm, image: e.target.value})} />
                      <textarea placeholder="Nội dung chi tiết" className="w-full bg-[#000D1A] border border-zinc-700 rounded-lg p-3 text-white h-32"
                        onChange={(e) => setNewsForm({...newsForm, content: e.target.value})} />
                      <div className="flex gap-3">
                        <button onClick={() => {
                          if (newsForm.id) {
                            updateCmsNews(cmsNews.map(n => n.id === newsForm.id ? { ...n, ...newsForm } : n));
                          } else {
                            updateCmsNews([{id: Date.now().toString(), date: new Date().toLocaleDateString(), ...newsForm}, ...cmsNews]);
                          }
                          setIsAddingNews(false);
                          setNewsForm({});
                        }} className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-lg">Xuất bản</button>
                        <button onClick={() => setIsAddingNews(false)} className="px-6 py-2 bg-zinc-700 text-white font-bold rounded-lg">Hủy</button>
                      </div>
                    </div>
                  )}
                  <div className="space-y-3">
                    {cmsNews.map((news, index) => (
                      <div key={news.id || index} className="bg-[#001F3F] border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img src={news.image || undefined} alt={news.title} className="w-16 h-12 object-cover rounded" />
                          <div>
                            <p className="text-white font-bold">{news.title}</p>
                            <p className="text-zinc-400 text-xs">{news.category} • {news.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {
                            setNewsForm(news);
                            setIsAddingNews(true);
                          }} className="p-2 text-zinc-400 hover:text-white">Sửa</button>
                          <button onClick={() => updateCmsNews(cmsNews.filter((_, i) => i !== index))} className="p-2 text-red-400 hover:text-red-300">Xóa</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {cmsSubTab === 'banners' && (
                <div className="space-y-4">
                  {cmsBanners.map((banner, index) => (
                    <div key={index} className="bg-[#001F3F] border border-zinc-800 rounded-lg p-4 flex gap-4">
                      {banner ? (
                        <img src={banner} alt={`Banner ${index + 1}`} className="w-32 h-20 object-cover rounded-lg" />
                      ) : (
                        <div className="w-32 h-20 bg-zinc-700 rounded-lg flex items-center justify-center text-zinc-500 text-xs">No Image</div>
                      )}
                      <input 
                        type="text" 
                        value={banner}
                        onChange={(e) => {
                          const newBanners = [...cmsBanners];
                          newBanners[index] = e.target.value;
                          updateCmsBanners(newBanners);
                        }}
                        className="flex-1 bg-[#000D1A] border border-zinc-700 rounded-lg p-3 text-white"
                      />
                    </div>
                  ))}
                  <button 
                    onClick={() => updateCmsBanners([...cmsBanners, ''])}
                    className="w-full py-3 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Thêm Banner
                  </button>
                </div>
              )}
              {cmsSubTab === 'vinfast' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Quản lý danh mục xe VinFast</h3>
                    <button 
                      onClick={saveVinfastChanges}
                      className="px-6 py-2 bg-[#D4AF37] text-[#000D1A] font-bold rounded-lg hover:bg-[#b5952f] transition-colors"
                    >
                      Lưu thay đổi
                    </button>
                  </div>

                  <div className="bg-[#001F3F] border border-zinc-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-white">
                      <thead>
                        <tr className="bg-[#000D1A] text-[#D4AF37] text-sm uppercase tracking-wider">
                          <th className="p-4">Dòng xe</th>
                          <th className="p-4">Công suất (kW)</th>
                          <th className="p-4">Lợi nhuận (%/Ngày)</th>
                          <th className="p-4">Góp vốn tối thiểu (VNĐ)</th>
                          <th className="p-4">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {localVinfast.map((car, index) => (
                          <tr key={index} className="hover:bg-[#002b55]/50 transition-colors">
                            <td className="p-4 font-bold text-lg">{car.title}</td>
                            <td className="p-2">
                              <input type="text" value={car.kw || ''} placeholder="kW" className="w-full bg-[#000D1A] border border-zinc-700 rounded-lg p-2 text-white focus:border-[#D4AF37] outline-none"
                                onChange={(e) => {
                                  const newCars = [...localVinfast];
                                  newCars[index] = {...newCars[index], kw: e.target.value};
                                  setLocalVinfast(newCars);
                                }}/>
                            </td>
                            <td className="p-2">
                              <input type="text" value={car.profit || ''} placeholder="%" className="w-full bg-[#000D1A] border border-zinc-700 rounded-lg p-2 text-white focus:border-[#D4AF37] outline-none"
                                onChange={(e) => {
                                  const newCars = [...localVinfast];
                                  newCars[index] = {...newCars[index], profit: e.target.value};
                                  setLocalVinfast(newCars);
                                }}/>
                            </td>
                            <td className="p-2">
                              <input type="text" value={car.minCapital || ''} placeholder="VNĐ" className="w-full bg-[#000D1A] border border-zinc-700 rounded-lg p-2 text-white focus:border-[#D4AF37] outline-none"
                                onChange={(e) => {
                                  const newCars = [...localVinfast];
                                  newCars[index] = {...newCars[index], minCapital: e.target.value};
                                  setLocalVinfast(newCars);
                                }}/>
                            </td>
                            <td className="p-2">
                                <button 
                                  onClick={saveVinfastChanges}
                                  className="px-4 py-2 bg-[#D4AF37] text-[#000D1A] font-bold rounded-lg hover:bg-[#b5952f] transition-colors"
                                >
                                  Lưu
                                </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">Push Notifications <span className="text-[#D4AF37] font-normal text-lg">/ Ticker Banner</span></h2>
              </div>
              <div className="bg-[#001F3F] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-lg max-w-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Cập nhật nội dung chạy chữ (Ticker Banner)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-2">Nội dung thông báo mới</label>
                    <textarea 
                      value={tickerInput}
                      onChange={e => setTickerInput(e.target.value)}
                      className="w-full bg-[#000D1A] border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                      rows={4}
                      placeholder="Nhập nội dung hiển thị trên Ticker Banner (ví dụ: Khách hàng ***829 vừa rút thành công 3.292.000.000 VNĐ)"
                    ></textarea>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handlePushTicker} className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b5952f] text-[#000D1A] font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center gap-2">
                      <Bell className="w-5 h-5" /> Phát sóng thông báo
                    </button>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-zinc-800">
                    <h4 className="font-bold text-sm text-zinc-400 mb-3">Thông báo đang hiển thị</h4>
                    <div className="space-y-2">
                      {tickerMessages.map((msg, idx) => (
                        <div key={idx} className="bg-[#000D1A] p-3 rounded-lg border border-zinc-800 text-sm text-white">
                          <span className="text-emerald-400 mr-2">#{idx + 1}</span> {msg}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">Support Console <span className="text-[#D4AF37] font-normal text-lg">/ Hỗ trợ CSKH</span></h2>
              </div>
              <div className="flex flex-1 overflow-hidden bg-[#001F3F] border border-[#D4AF37]/30 rounded-2xl shadow-lg">
                {/* Users List */}
                <div className="w-1/3 border-r border-zinc-800 flex flex-col">
                  <div className="p-4 border-b border-zinc-800">
                    <h3 className="font-bold text-white mb-2">Đang hoạt động</h3>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input 
                        type="text" 
                        placeholder="Tìm người dùng..." 
                        className="w-full bg-[#000D1A] border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {allUsers.map(u => (
                      <button 
                        key={u.id}
                        onClick={() => setSelectedChatUser(u)}
                        className={`w-full p-4 flex items-center gap-3 border-b border-zinc-800/50 transition-colors text-left ${selectedChatUser?.id === u.id ? 'bg-[#D4AF37]/10 border-l-2 border-l-[#D4AF37]' : 'hover:bg-zinc-800/50'}`}
                      >
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-[#D4AF37]">
                          {(u.displayName?.[0] || 'U').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-white truncate">{u.displayName || u.phoneNumber}</h4>
                          <p className="text-xs text-zinc-500 truncate">{u.phoneNumber}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-[#000D1A]">
                  {selectedChatUser ? (
                    <>
                      <div className="p-4 border-b border-zinc-800 bg-[#001F3F] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-[#D4AF37]">
                            {(selectedChatUser.displayName?.[0] || 'U').toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-white">{selectedChatUser.displayName || selectedChatUser.phoneNumber}</h3>
                            <span className="text-xs text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Đang trực tuyến</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {adminChatMessages.length === 0 ? (
                          <div className="text-center text-zinc-500 mt-10">Chưa có tin nhắn nào.</div>
                        ) : (
                          adminChatMessages.map(msg => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender_role === 'admin' ? 'items-end' : 'items-start'}`}>
                              <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.sender_role === 'admin' ? 'bg-[#D4AF37] text-[#000D1A] rounded-tr-sm' : 'bg-zinc-800 text-white rounded-tl-sm'}`}>
                                <p className="text-sm">{msg.content}</p>
                              </div>
                              <span className="text-[10px] text-zinc-500 mt-1">{msg.timeFormatted}</span>
                            </div>
                          ))
                        )}
                        <div ref={chatEndRef} />
                      </div>
                      
                      <div className="p-4 border-t border-zinc-800 bg-[#001F3F]">
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={adminChatText}
                            onChange={e => setAdminChatText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendAdminMessage()}
                            placeholder={`Nhắn tin cho ${selectedChatUser.displayName || selectedChatUser.phoneNumber}...`}
                            className="flex-1 bg-[#000D1A] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                          />
                          <button 
                            onClick={handleSendAdminMessage}
                            className="p-3 bg-[#D4AF37] text-[#000D1A] rounded-xl hover:bg-[#b5952f] transition-colors"
                          >
                            <MessageSquare className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                      <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                      <p>Chọn một người dùng để bắt đầu hỗ trợ</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit_logs' && (userCtx.role === 'admin' || userCtx.role === 'super_admin') && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-[#D4AF37]" />
                  Nhật ký Hệ thống <span className="text-[#D4AF37] font-normal text-lg">/ Audit Logs</span>
                </h2>
              </div>

              <div className="bg-[#001F3F] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Lịch sử hoạt động của Quản trị viên</h3>
                  <span className="text-xs font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20">
                    {auditLogs.length} bản ghi
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Thời gian</th>
                        <th className="px-6 py-4">Quản trị viên</th>
                        <th className="px-6 py-4">Hành động</th>
                        <th className="px-6 py-4">Mã Admin UID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50 text-sm text-zinc-200">
                      {auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">
                            Chưa có bản ghi hoạt động nào trong hệ thống.
                          </td>
                        </tr>
                      ) : (
                        auditLogs.map(log => (
                          <tr key={log.id} className="hover:bg-zinc-800/20 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-zinc-400 whitespace-nowrap">
                              {log.timeFormatted}
                            </td>
                            <td className="px-6 py-4 font-bold text-[#D4AF37] whitespace-nowrap">
                              {log.adminName}
                            </td>
                            <td className="px-6 py-4 text-zinc-200">
                              {log.action}
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-zinc-500 whitespace-nowrap">
                              {log.adminId || '---'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* KYC Modal */}
      {kycUserModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#001F3F] border border-[#D4AF37]/30 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-[#D4AF37]/20 flex justify-between items-center bg-[#000D1A] rounded-t-2xl">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#D4AF37]" />
                Thẩm định KYC: {kycUserModal.displayName || kycUserModal.phoneNumber}
              </h3>
              <button onClick={() => setKycUserModal(null)} className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-800 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <p className="text-zinc-400 text-sm font-bold mb-2">Thông tin đăng ký</p>
                <div className="bg-[#000D1A] rounded-xl p-4 border border-zinc-800 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">Số điện thoại</span>
                    <span className="text-sm font-bold text-white">{kycUserModal.phoneNumber || '---'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">CCCD</span>
                    <span className="text-sm font-mono text-[#D4AF37] font-bold">{kycUserModal.cccd || '---'}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-zinc-400 text-sm font-bold mb-2">Ảnh mặt trước CCCD</p>
                <div className="bg-[#000D1A] border border-zinc-800 rounded-xl overflow-hidden min-h-[200px] flex items-center justify-center">
                  {kycUserModal.cccdFrontImage ? (
                    <img src={kycUserModal.cccdFrontImage} alt="Mặt trước" className="w-full h-auto object-contain max-h-[300px]" />
                  ) : (
                    <span className="text-zinc-600 font-medium">Chưa có ảnh</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-zinc-400 text-sm font-bold mb-2">Ảnh mặt sau CCCD</p>
                <div className="bg-[#000D1A] border border-zinc-800 rounded-xl overflow-hidden min-h-[200px] flex items-center justify-center">
                  {kycUserModal.cccdBackImage ? (
                    <img src={kycUserModal.cccdBackImage} alt="Mặt sau" className="w-full h-auto object-contain max-h-[300px]" />
                  ) : (
                    <span className="text-zinc-600 font-medium">Chưa có ảnh</span>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-[#D4AF37]/20 bg-[#000D1A] rounded-b-2xl flex justify-between gap-3">
              <button 
                onClick={() => setKycUserModal(null)}
                className="px-6 py-2.5 rounded-xl font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                Đóng
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={() => rejectKyc(kycUserModal.id)}
                  className="px-6 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-black uppercase tracking-wider rounded-xl border border-rose-500/30 transition-colors flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5" /> Từ chối
                </button>
                <button 
                  onClick={() => approveKyc(kycUserModal.id)}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#000D1A] font-black uppercase tracking-wider rounded-xl transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" /> Phê duyệt KYC
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTxDetails && (() => {
        const selectedUser = allUsers.find(u => u.id === selectedTxDetails.userId);
        const selectedUserTransactions = selectedUser?.transactions || [];
        const isOverBalance = selectedTxDetails.type === 'withdraw' && selectedTxDetails.amount > selectedTxDetails.userBalance;
        
        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-[#000D1A] border border-[#D4AF37]/50 rounded-2xl w-full max-w-4xl shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col overflow-hidden max-h-[90vh] my-8 animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="p-6 border-b border-[#D4AF37]/20 flex justify-between items-center bg-gradient-to-r from-[#001F3F] to-[#000D1A]">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#D4AF37]">Chi Tiết Giao Dịch:</span> #{selectedTxDetails.id.toUpperCase()}
                </h3>
                <button 
                  onClick={() => setSelectedTxDetails(null)} 
                  className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-800 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              {/* Content (Scrollable) */}
              <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
                {/* 2-column key metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Transaction Metadata */}
                  <div className="space-y-4 bg-[#001F3F] p-5 rounded-xl border border-zinc-800">
                    <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-xs border-b border-zinc-800 pb-2">Thông tin giao dịch</h4>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                      <span className="text-zinc-400">Loại giao dịch:</span>
                      <span className="font-bold text-white capitalize">
                        {selectedTxDetails.type === 'deposit' ? 'Nạp tiền' : selectedTxDetails.type === 'withdraw' ? 'Rút tiền' : 'Đầu tư'}
                      </span>
                      
                      <span className="text-zinc-400">Số tiền:</span>
                      <span className="font-black text-[#D4AF37] text-base">
                        {selectedTxDetails.amount?.toLocaleString('vi-VN')} đ
                      </span>
                      
                      <span className="text-zinc-400">Thời gian tạo:</span>
                      <span className="text-white font-mono">{selectedTxDetails.date}</span>
                      
                      <span className="text-zinc-400">Trạng thái:</span>
                      <span className={`font-bold ${
                        selectedTxDetails.status === 'Đang xử lý' ? 'text-amber-400' :
                        selectedTxDetails.status === 'Thành công' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {selectedTxDetails.status}
                      </span>

                      {selectedTxDetails.reason && (
                        <>
                          <span className="text-zinc-400">Lý do từ chối:</span>
                          <span className="text-rose-400 font-medium italic">{selectedTxDetails.reason}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Column: User Metadata */}
                  <div className="space-y-4 bg-[#001F3F] p-5 rounded-xl border border-zinc-800">
                    <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-xs border-b border-zinc-800 pb-2">Thông tin người chơi</h4>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                      <span className="text-zinc-400">Tài khoản ID:</span>
                      <span className="font-mono text-white truncate text-xs" title={selectedTxDetails.userId}>{selectedTxDetails.userId}</span>
                      
                      <span className="text-zinc-400">Họ tên / Nickname:</span>
                      <span className="font-bold text-white">{selectedTxDetails.userName}</span>
                      
                      <span className="text-zinc-400">Số điện thoại:</span>
                      <span className="font-mono text-white">{selectedTxDetails.userPhone || '---'}</span>
                      
                      <span className="text-zinc-400">Số dư ví hiện tại:</span>
                      <span className="font-bold text-emerald-400">
                        {selectedTxDetails.userBalance?.toLocaleString('vi-VN')} đ
                      </span>

                      {isOverBalance && (
                        <div className="col-span-2 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2 mt-1">
                          ⚠️ Cảnh báo: Số dư ví hiện tại nhỏ hơn số tiền rút!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Player Notes */}
                <div className="bg-[#001F3F] p-5 rounded-xl border border-zinc-800 space-y-2">
                  <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-xs border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" /> Ghi chú từ Player
                  </h4>
                  <div className="p-3 bg-black/40 border border-zinc-800 rounded-lg text-zinc-300 min-h-[50px]">
                    {selectedTxDetails.note || <span className="text-zinc-500 italic">Không có lời nhắn/ghi chú từ player cho giao dịch này.</span>}
                  </div>
                </div>

                {/* Proof Image Section */}
                {selectedTxDetails.type === 'deposit' && (
                  <div className="bg-[#001F3F] p-5 rounded-xl border border-zinc-800 space-y-3">
                    <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-xs border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" /> Ảnh chứng từ nạp tiền
                    </h4>
                    
                    {selectedTxDetails.proofImage ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative border border-zinc-800 rounded-lg overflow-hidden max-h-[350px] w-full flex items-center justify-center bg-black/60">
                          <img 
                            src={selectedTxDetails.proofImage} 
                            alt="Chứng từ nạp tiền" 
                            className="max-h-[350px] object-contain transition-transform hover:scale-105 duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <a 
                          href={selectedTxDetails.proofImage} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-bold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Mở ảnh trong tab mới để xem chi tiết
                        </a>
                      </div>
                    ) : (
                      <div className="p-6 text-center border-2 border-dashed border-zinc-800 rounded-lg text-zinc-500 flex flex-col items-center justify-center gap-2">
                        <ImageIcon className="w-8 h-8 text-zinc-600" />
                        <span className="text-xs">Không có ảnh minh chứng được gửi kèm.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Lịch sử giao dịch của user đó */}
                <div className="bg-[#001F3F] p-5 rounded-xl border border-zinc-800 space-y-3">
                  <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-xs border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                    <History className="w-4 h-4" /> Lịch sử giao dịch gần đây của {selectedTxDetails.userName}
                  </h4>
                  <div className="overflow-x-auto max-h-[220px] border border-zinc-800/80 rounded-lg">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-[#000D1A] text-[#D4AF37] text-[10px] uppercase font-black tracking-wider border-b border-[#D4AF37]/20 sticky top-0">
                        <tr>
                          <th className="px-4 py-2.5">Thời gian</th>
                          <th className="px-4 py-2.5">Loại</th>
                          <th className="px-4 py-2.5">Số tiền</th>
                          <th className="px-4 py-2.5">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50 bg-black/20">
                        {selectedUserTransactions.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-zinc-500 italic">Không có lịch sử giao dịch nào khác.</td>
                          </tr>
                        ) : (
                          [...selectedUserTransactions].sort((a: any, b: any) => (b.date || '').localeCompare(a.date || '')).slice(0, 5).map((utx: any, idx: number) => (
                            <tr key={idx} className="hover:bg-white/5">
                              <td className="px-4 py-2 font-mono text-zinc-400">{utx.date}</td>
                              <td className="px-4 py-2">
                                <span className={`font-bold ${
                                  utx.type === 'deposit' ? 'text-emerald-400' :
                                  utx.type === 'withdraw' ? 'text-rose-400' : 'text-sky-400'
                                }`}>
                                  {utx.type === 'deposit' ? 'Nạp tiền' : utx.type === 'withdraw' ? 'Rút tiền' : utx.type === 'invest' ? 'Đầu tư' : utx.type}
                                </span>
                              </td>
                              <td className="px-4 py-2 font-bold text-white">{utx.amount?.toLocaleString('vi-VN')} đ</td>
                              <td className="px-4 py-2 font-semibold">
                                <span className={
                                  utx.status === 'Thành công' ? 'text-emerald-400' :
                                  utx.status === 'Đang xử lý' ? 'text-amber-400' : 'text-rose-500'
                                }>
                                  {utx.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Footer with Approvals */}
              <div className="p-6 border-t border-[#D4AF37]/20 flex justify-end gap-3 bg-[#000D1A]">
                <button 
                  onClick={() => setSelectedTxDetails(null)}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-all"
                >
                  Đóng
                </button>
                
                {selectedTxDetails.status === 'Đang xử lý' && (
                  <>
                    <button 
                      onClick={async () => {
                        const txToProcess = selectedTxDetails;
                        setSelectedTxDetails(null);
                        await handleRejectTransaction(txToProcess, txToProcess.userId);
                      }}
                      disabled={processingIds.has(selectedTxDetails.id)}
                      className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/30 font-bold rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Từ chối
                    </button>
                    <button 
                      onClick={async () => {
                        const txToProcess = selectedTxDetails;
                        setSelectedTxDetails(null);
                        await handleApproveTransaction(txToProcess, txToProcess.userId);
                      }}
                      disabled={processingIds.has(selectedTxDetails.id)}
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#000D1A] font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" /> Phê duyệt
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
