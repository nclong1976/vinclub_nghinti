import React, { useState } from 'react';
import { 
  Shield, Lock, Unlock, KeyRound, Check, X, ShieldAlert, BadgeCheck, Eye,
  MapPin, Compass, Radio, Users, Sparkles, LayoutGrid, List, RotateCcw, 
  ShieldCheck, Mail, Phone, ExternalLink, Calendar, Wallet, Layers
} from 'lucide-react';

interface UsersTabProps {
  usersTabFilter: 'pending' | 'verified' | 'locked';
  setUsersTabFilter: (val: 'pending' | 'verified' | 'locked') => void;
  displayedUsers: any[];
  setKycUserModal: (user: any) => void;
  toggleUserLock: (userId: string, isLocked: boolean) => Promise<void>;
  resetUserPassword: (userId: string) => Promise<void>;
  updateUserRole: (userId: string, oldRole: string, newRole: string) => Promise<void>;
  approveKyc: (userId: string) => Promise<void>;
  rejectKyc: (userId: string) => Promise<void>;
}

// Regional hub stats for the KYC Map section
interface RegionalHub {
  id: string;
  name: string;
  x: number; // SVG coordinate percent
  y: number; // SVG coordinate percent
  activeCount: number;
  verifiedRate: string;
  avgAum: string;
  status: 'ONLINE' | 'STANDBY';
}

export default function UsersTab({
  usersTabFilter,
  setUsersTabFilter,
  displayedUsers,
  setKycUserModal,
  toggleUserLock,
  resetUserPassword,
  updateUserRole,
  approveKyc,
  rejectKyc,
}: UsersTabProps) {
  // View states: '3d' for beautiful cards, 'table' for lists
  const [viewMode, setViewMode] = useState<'3d' | 'table'>('3d');
  
  // Selected regional hub on the map for extra interactivity
  const [selectedHub, setSelectedHub] = useState<string | null>(null);

  // Regional Hubs Data
  const hubs: RegionalHub[] = [
    { id: 'hanoi', name: 'Hà Nội', x: 42, y: 18, activeCount: 14, verifiedRate: '98%', avgAum: '4.2 Tỷ', status: 'ONLINE' },
    { id: 'haiphong', name: 'Hải Phòng', x: 49, y: 22, activeCount: 8, verifiedRate: '95%', avgAum: '6.8 Tỷ', status: 'ONLINE' },
    { id: 'danang', name: 'Đà Nẵng', x: 58, y: 48, activeCount: 11, verifiedRate: '92%', avgAum: '3.1 Tỷ', status: 'ONLINE' },
    { id: 'nhatrang', name: 'Nha Trang', x: 62, y: 68, activeCount: 22, verifiedRate: '100%', avgAum: '12.5 Tỷ', status: 'ONLINE' },
    { id: 'hcmc', name: 'TP. Hồ Chí Minh', x: 48, y: 82, activeCount: 31, verifiedRate: '97%', avgAum: '8.4 Tỷ', status: 'ONLINE' },
  ];

  // Formatting helpers
  const formatRegDate = (u: any) => {
    if (u.createdAt) {
      try {
        if (typeof u.createdAt === 'object' && u.createdAt.seconds) {
          return new Date(u.createdAt.seconds * 1000).toLocaleDateString('vi-VN');
        }
        return new Date(u.createdAt).toLocaleDateString('vi-VN');
      } catch (e) {
        // ignore fallback
      }
    }
    return '24.10.2024';
  };

  const formatBalance = (bal?: number) => {
    const value = bal || 0;
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)} Tỷ đ`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)} Tr đ`;
    }
    return `${value.toLocaleString('vi-VN')} đ`;
  };

  const maskPhone = (phone?: string) => {
    if (!phone) return 'Chưa cập nhật';
    const clean = phone.trim();
    if (clean.length < 6) return clean;
    return `${clean.slice(0, 4)} *** ${clean.slice(-3)}`;
  };

  const getFormattedId = (id: string) => {
    const prefix = 'ID';
    const part1 = id.substring(0, 4).toUpperCase();
    const part2 = id.slice(-4).toUpperCase();
    return `${prefix}-${part1}-${part2}`;
  };

  const getUserRank = (u: any) => {
    if (u.role === 'admin' || u.role === 'super_admin') {
      return 'SYSTEM ADMIN';
    }
    const balance = u.balance || 0;
    if (balance >= 5_000_000_000) {
      return 'PLATINUM VIP';
    }
    if (balance >= 1_000_000_000) {
      return 'GOLD MEMBER';
    }
    return 'STANDARD MEMBER';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. REAL-TIME KYC MAP & REGIONAL WAR ROOM */}
      <div className="bg-[#1a1b21] border border-[#4f453b]/40 rounded-xl p-5 space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#4f453b]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-[#ecbe8e] animate-pulse" />
            <div>
              <h3 className="font-heading text-xs font-black uppercase tracking-wider text-white">BẢN ĐỒ KYC & KHU VỰC THỜI GIAN THỰC</h3>
              <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Hệ thống giám sát định vị tài khoản định danh & kết nối khu vực</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[9px] font-bold bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] px-2.5 py-1 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-[#34d399] rounded-full animate-ping"></span>
              LIVE TRACKING
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Beautiful minimalist SVG Vietnam Map */}
          <div className="lg:col-span-5 bg-[#111318] border border-[#4f453b]/20 rounded-lg p-4 flex flex-col items-center justify-center relative overflow-hidden h-[300px]">
            {/* Background cyber grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40"></div>
            
            {/* Hologram Circle */}
            <div className="absolute w-52 h-52 border border-[#4f453b]/10 rounded-full animate-spin [animation-duration:20s] pointer-events-none"></div>
            <div className="absolute w-36 h-36 border border-dashed border-[#ecbe8e]/10 rounded-full animate-spin [animation-duration:10s] [animation-direction:reverse] pointer-events-none"></div>

            {/* Simulated Vietnam Outline SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full max-w-[180px] text-zinc-800 relative z-10 select-none">
              {/* Simplified stylized Vietnam geo line path */}
              <path 
                d="M40,5 C43,7 41,12 45,15 C48,17 50,20 48,24 C46,26 44,28 47,31 C51,34 54,38 56,42 C57,45 54,49 58,52 C61,54 62,59 63,64 C64,68 60,72 58,75 C55,78 51,80 48,84 C45,87 43,92 45,95" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeDasharray="2,3"
                className="text-zinc-700/60"
              />
              <path 
                d="M40,5 C43,7 41,12 45,15 C48,17 50,20 48,24 C46,26 44,28 47,31 C51,34 54,38 56,42 C57,45 54,49 58,52 C61,54 62,59 63,64 C64,68 60,72 58,75 C55,78 51,80 48,84 C45,87 43,92 45,95" 
                fill="none" 
                stroke="#4f453b" 
                strokeWidth="0.8" 
                strokeLinecap="round"
                className="opacity-70"
              />

              {/* Paracel Islands (Hoàng Sa) */}
              <circle cx="80" cy="40" r="1" fill="#4f453b" />
              <circle cx="83" cy="42" r="1.5" fill="#4f453b" />
              <circle cx="85" cy="39" r="0.8" fill="#4f453b" />
              
              {/* Spratly Islands (Trường Sa) */}
              <circle cx="78" cy="78" r="1.2" fill="#4f453b" />
              <circle cx="82" cy="80" r="0.8" fill="#4f453b" />
              <circle cx="85" cy="84" r="1.5" fill="#4f453b" />

              {/* Glowing Interactive Hub Pins */}
              {hubs.map((hub) => {
                const isSelected = selectedHub === hub.id;
                return (
                  <g 
                    key={hub.id} 
                    className="cursor-pointer" 
                    onClick={() => setSelectedHub(isSelected ? null : hub.id)}
                  >
                    {/* Pulsing Outer Ring */}
                    <circle 
                      cx={hub.x} 
                      cy={hub.y} 
                      r={isSelected ? 6 : 4} 
                      fill="none" 
                      stroke="#ecbe8e" 
                      strokeWidth="1"
                      className="animate-ping" 
                      style={{ transformOrigin: `${hub.x}px ${hub.y}px`, animationDuration: '1.8s' }}
                    />
                    {/* Glowing Core */}
                    <circle 
                      cx={hub.x} 
                      cy={hub.y} 
                      r={isSelected ? 3.5 : 2.5} 
                      fill={isSelected ? '#ecbe8e' : '#34d399'} 
                      className="transition-all duration-300"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Legend Map Indicators */}
            <div className="absolute bottom-3 left-3 bg-black/60 border border-zinc-800 rounded px-2 py-1 text-[8px] font-bold font-mono tracking-wider flex items-center gap-3 z-20">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#34d399] rounded-full"></span> ONLINE HUBS</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#ecbe8e] rounded-full"></span> SELECTED</span>
            </div>
          </div>

          {/* Right: Hub details cards list */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hubs.map((hub) => {
                const isSelected = selectedHub === hub.id;
                return (
                  <div 
                    key={hub.id}
                    onClick={() => setSelectedHub(isSelected ? null : hub.id)}
                    className={`p-3.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                      isSelected 
                        ? 'bg-[#ecbe8e]/10 border-[#ecbe8e] shadow-[0_0_15px_rgba(236,190,142,0.1)]' 
                        : 'bg-[#111318] border-[#4f453b]/20 hover:border-[#4f453b]/45'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#ecbe8e]' : 'text-zinc-500'}`} />
                        <span className="text-xs font-bold font-heading text-white">{hub.name}</span>
                      </div>
                      <span className="text-[8px] font-black tracking-widest text-[#34d399] bg-[#34d399]/10 px-1.5 py-0.5 rounded border border-[#34d399]/15">
                        {hub.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 border-t border-zinc-900 pt-2 mt-2 font-mono text-[9px] text-zinc-400">
                      <div>
                        <span className="text-zinc-500 block uppercase tracking-wider text-[8px]">Kết nối</span>
                        <span className="text-white font-bold">{hub.activeCount} Live</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block uppercase tracking-wider text-[8px]">Tỷ lệ KYC</span>
                        <span className="text-[#34d399] font-bold">{hub.verifiedRate}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block uppercase tracking-wider text-[8px]">Tổng AUM TB</span>
                        <span className="text-[#ecbe8e] font-bold">{hub.avgAum}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected hub detail action/alert */}
            <div className="bg-[#111318] border border-[#4f453b]/15 rounded-lg p-3 flex items-center justify-between text-xs font-semibold text-zinc-400">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#ecbe8e]" />
                <span>
                  {selectedHub 
                    ? `Đang tập trung giám sát hệ thống nút thắt: ${hubs.find(h => h.id === selectedHub)?.name}` 
                    : 'Nhấp chọn một trạm kết nối trên bản đồ để xem chi tiết liên kết KYC.'}
                </span>
              </div>
              {selectedHub && (
                <button 
                  onClick={() => setSelectedHub(null)}
                  className="text-[9px] text-[#ecbe8e] hover:underline uppercase tracking-widest font-bold"
                >
                  Xóa lọc
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-TABS & VIEW CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#4f453b]/20 pb-2">
        {/* Navigation Filters */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setUsersTabFilter('pending')}
            className={`px-4 py-2 font-heading text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 border-b-2 ${
              usersTabFilter === 'pending' 
                ? 'text-amber-500 border-amber-500' 
                : 'text-zinc-500 hover:text-zinc-300 border-transparent'
            }`}
          >
            CHỜ DUYỆT KYC
            {displayedUsers.length > 0 && usersTabFilter === 'pending' && (
              <span className="bg-amber-500/10 text-amber-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-500/20">
                {displayedUsers.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setUsersTabFilter('verified')}
            className={`px-4 py-2 font-heading text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 border-b-2 ${
              usersTabFilter === 'verified' 
                ? 'text-[#34d399] border-[#34d399]' 
                : 'text-zinc-500 hover:text-zinc-300 border-transparent'
            }`}
          >
            ĐÃ XÁC MINH (KYC OK)
            {displayedUsers.length > 0 && usersTabFilter === 'verified' && (
              <span className="bg-[#34d399]/10 text-[#34d399] text-[9px] font-black px-2 py-0.5 rounded-full border border-[#34d399]/20">
                {displayedUsers.length}
              </span>
            )}
          </button>

        </div>

        {/* View Layout Toggles (3D Cards vs Table) */}
        <div className="flex items-center bg-[#111318] border border-[#4f453b]/30 rounded p-1">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              viewMode === '3d'
                ? 'bg-[#ecbe8e]/15 text-[#ecbe8e]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Thẻ định danh 3D"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Thẻ 3D
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              viewMode === 'table'
                ? 'bg-[#ecbe8e]/15 text-[#ecbe8e]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Dạng bảng dữ liệu"
          >
            <List className="w-3.5 h-3.5" />
            Danh Sách
          </button>
        </div>
      </div>

      {/* 3. CONTENT AREA */}
      {displayedUsers.length === 0 ? (
        <div className="bg-[#1a1b21] border border-[#4f453b]/20 p-12 text-center rounded-xl text-zinc-600">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-30 text-zinc-600" />
          <p className="text-xs font-heading font-bold uppercase tracking-wider text-zinc-500">Không tìm thấy người dùng phù hợp trong bộ lọc</p>
        </div>
      ) : viewMode === '3d' ? (
        
        /* 3D CARDS GRID INTERFACE */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedUsers.map((u) => {
            const rank = getUserRank(u);
            const formattedId = getFormattedId(u.id);
            const formattedBalance = formatBalance(u.balance);
            const regDate = formatRegDate(u);
            const maskedPhone = maskPhone(u.phoneNumber);

            return (
              <div key={u.id} className="card-container h-[230px] cursor-pointer group">
                <div className="card-flipper">
                  
                  {/* FRONT SIDE */}
                  <div className="card-front bg-[#1a1c20]/90 backdrop-blur-sm border border-[#c49a6c]/30 rounded-xl p-5 flex flex-col justify-between luxe-glow">
                    
                    {/* Header: Photo and Status badge */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full border border-[#ecbe8e]/40 overflow-hidden relative shrink-0">
                          {/* Silhouette or user photo */}
                          <img 
                            className="w-full h-full object-cover" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqHrKVz_fuZuo6sYQWmud3etUn4beEB_faXk5XrTku3nJ4sCwYqUPyXChqzPq5vfQ6TgO1kIEvBqEmQuNmAdoYT9qbW3JjwlZ19s3OiVFFLODDPGj_tgGGYwBr1aPhqeA3RAhpFf8_SLM4ucwtglNTkq3sZprpF0nvzih4HdcC-aGEThvdlZ3bPd7K0-vxqs5wIp0U4eqFlNu_6Nn3CuV6LYZJjE3ki7LfmdF7Gzu7FBWtsH4fWnrG3J_qowuYRBxAkFK9IWRWPl8"
                            alt={u.displayName || 'Avatar'}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h3 className="font-heading text-xs font-black uppercase tracking-wider text-white truncate max-w-[110px]" title={u.displayName || 'Chưa cập nhật'}>
                            {u.displayName || 'Vô Danh'}
                          </h3>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[8px] font-bold text-[#ecbe8e] tracking-wider uppercase bg-[#ecbe8e]/5 px-1 py-0.5 rounded flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              {rank}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Top-Right: Active / Locked status indicator */}
                      <div className={`px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                        u.isLocked 
                          ? 'bg-[#f43f5e]/10 border-[#f43f5e]/20 text-[#f43f5e]' 
                          : u.isIdentityVerified 
                            ? 'bg-[#34d399]/10 border-[#34d399]/20 text-[#34d399]' 
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isLocked ? 'bg-[#f43f5e]' : u.isIdentityVerified ? 'bg-[#34d399]' : 'bg-amber-500'}`}></span>
                        <span className="font-bold text-[8px] tracking-wider uppercase">
                          {u.isLocked ? 'LOCKED' : u.isIdentityVerified ? 'ACTIVE' : 'PENDING'}
                        </span>
                      </div>
                    </div>

                    {/* Middle Info */}
                    <div className="mt-4 border-t border-zinc-800/60 pt-3">
                      <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-400">
                        <span>SỐ DƯ:</span>
                        <span className="font-heading font-black text-white">{formattedBalance}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-400 mt-1">
                        <span>HỒ SƠ:</span>
                        <span className="text-[#ecbe8e] font-bold uppercase tracking-wider text-[9px]">
                          {u.cccd ? 'ĐÃ KÈM CCCD' : 'CHƯA KYC'}
                        </span>
                      </div>
                    </div>

                    {/* Bottom: ID and Flip Hint */}
                    <div className="mt-auto pt-2 flex justify-between items-end border-t border-[#4f453b]/10 border-dashed">
                      <div>
                        <p className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest">ACCOUNT ID</p>
                        <p className="font-mono text-[10px] text-zinc-300 font-medium tracking-wider">{formattedId}</p>
                      </div>
                      <div className="text-[9px] font-bold text-[#ecbe8e] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>CHI TIẾT</span>
                        <RotateCcw className="w-3 h-3 animate-pulse" />
                      </div>
                    </div>

                  </div>

                  {/* BACK SIDE */}
                  <div className="card-back bg-[#1a1c20] border border-[#ecbe8e]/50 rounded-xl p-5 flex flex-col justify-between shadow-[0_0_20px_rgba(236,190,142,0.1)]">
                    
                    <div>
                      {/* Back Header */}
                      <div className="flex justify-between items-center mb-3 pb-1.5 border-b border-[#4f453b]/15">
                        <span className="text-[9px] font-black text-[#ecbe8e] uppercase tracking-widest">DOSSIER DETAILS</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          u.role === 'admin' || u.role === 'super_admin' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          {u.role || 'MEMBER'}
                        </span>
                      </div>

                      {/* Information Grid */}
                      <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-[10px] font-semibold font-mono text-zinc-400">
                        <div>
                          <span className="text-[7px] text-zinc-500 block uppercase tracking-wider">REG. DATE</span>
                          <span className="text-white font-medium">{regDate}</span>
                        </div>
                        <div>
                          <span className="text-[7px] text-zinc-500 block uppercase tracking-wider">CONTACT</span>
                          <span className="text-white font-medium truncate block">{maskedPhone}</span>
                        </div>
                        <div className="col-span-2 border-t border-zinc-900 pt-1.5">
                          <span className="text-[7px] text-zinc-500 block uppercase tracking-wider">EMAIL</span>
                          <span className="text-white font-medium truncate block text-[9px]">{u.email || 'Chưa cấu hình'}</span>
                        </div>
                        {u.cccd && (
                          <div className="col-span-2 border-t border-zinc-900 pt-1.5">
                            <span className="text-[7px] text-zinc-500 block uppercase tracking-wider">CCCD/ID NUMBER</span>
                            <span className="text-white font-bold tracking-widest text-[9.5px] block">{u.cccd}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Integrated Administrative Quick Actions */}
                    <div className="mt-auto space-y-1.5 border-t border-[#4f453b]/10 pt-2 relative z-30">
                      
                      {/* KYC Approvals Section */}
                      {(u.kycStatus === 'pending' || u.cccdFrontImage || u.cccdBackImage) && !u.isIdentityVerified && (
                        <div className="grid grid-cols-3 gap-1">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setKycUserModal(u); }}
                            className="px-1.5 py-1 text-[8px] font-bold rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors uppercase tracking-wider flex items-center justify-center gap-0.5"
                          >
                            <Eye className="w-2.5 h-2.5" /> Xem
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); rejectKyc(u.id); }}
                            className="px-1.5 py-1 text-[8px] font-bold rounded bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#f43f5e] hover:bg-[#f43f5e] hover:text-white transition-colors uppercase tracking-wider text-center"
                          >
                            Từ chối
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); approveKyc(u.id); }}
                            className="px-1.5 py-1 text-[8px] font-bold rounded bg-[#34d399] text-[#000D1A] hover:bg-[#34d399]/80 transition-colors uppercase tracking-wider text-center"
                          >
                            Duyệt
                          </button>
                        </div>
                      )}

                      {/* General Admin settings */}
                      <div className="flex gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleUserLock(u.id, u.isLocked); }}
                          className={`flex-1 px-2 py-1 text-[8px] font-black rounded border uppercase tracking-widest transition-all flex items-center justify-center gap-1 ${
                            u.isLocked 
                              ? 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/20 hover:bg-[#34d399] hover:text-[#000D1A]' 
                              : 'bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/20 hover:bg-[#f43f5e] hover:text-white'
                          }`}
                        >
                          {u.isLocked ? <Unlock className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                          {u.isLocked ? 'MỞ KHÓA' : 'KHÓA'}
                        </button>

                        <button 
                          onClick={(e) => { e.stopPropagation(); resetUserPassword(u.id); }}
                          className="px-2 py-1 text-[8px] font-bold rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors uppercase tracking-wider flex items-center justify-center gap-0.5"
                          title="Đặt lại mật khẩu mặc định"
                        >
                          <KeyRound className="w-2.5 h-2.5" /> MK
                        </button>

                        <select 
                          value={u.role || 'user'} 
                          onChange={(e) => { e.stopPropagation(); updateUserRole(u.id, u.role || 'user', e.target.value); }}
                          className="bg-zinc-900 text-zinc-400 text-[8px] font-bold px-1 py-1 rounded border border-zinc-800 focus:outline-none focus:border-[#ecbe8e] flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="user">USER</option>
                          <option value="support">SUP</option>
                          <option value="admin">ADM</option>
                        </select>
                      </div>

                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        
        /* STANDARD DETAILED TABLE LIST VIEW */
        <div className="bg-[#1a1b21] border border-[#4f453b]/30 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#111318] border-b border-[#4f453b]/25 text-zinc-400 font-mono text-[9px] uppercase tracking-wider">
                  <th className="py-4 px-5">Người dùng</th>
                  <th className="py-4 px-5">Mức tài khoản</th>
                  <th className="py-4 px-5">Số điện thoại</th>
                  <th className="py-4 px-5">Số dư ví</th>
                  <th className="py-4 px-5">Mã CCCD/ID</th>
                  <th className="py-4 px-5">Trạng thái</th>
                  <th className="py-4 px-5 text-right">Điều khiển</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4f453b]/10">
                {displayedUsers.map((u) => {
                  const rank = getUserRank(u);
                  const formattedBalance = formatBalance(u.balance);

                  return (
                    <tr key={u.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-[#111318] border border-[#4f453b]/20 flex items-center justify-center font-black text-[#ecbe8e] text-[11px] uppercase">
                            {u.displayName ? u.displayName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="font-heading text-xs font-bold text-white block leading-tight">{u.displayName || 'Vô danh'}</span>
                            <span className="font-mono text-[9px] text-zinc-500 block">ID: {u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-[9px] font-bold text-[#ecbe8e] tracking-wider uppercase bg-[#ecbe8e]/5 border border-[#ecbe8e]/10 px-2 py-0.5 rounded">
                          {rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-zinc-300 font-medium">{u.phoneNumber || 'Chưa cập nhật'}</td>
                      <td className="py-3.5 px-5 font-heading font-black text-white">{formattedBalance}</td>
                      <td className="py-3.5 px-5 font-mono text-zinc-300 font-medium">{u.cccd || '---'}</td>
                      <td className="py-3.5 px-5">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase border ${
                          u.isLocked 
                            ? 'bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/20' 
                            : u.isIdentityVerified 
                              ? 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/20' 
                              : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          {u.isLocked ? 'ĐÃ KHÓA' : u.isIdentityVerified ? 'XÁC MINH' : 'CHỜ DUYỆT'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex justify-end gap-2">
                          {/* Quick KYC approval if pending */}
                          {(u.kycStatus === 'pending' || u.cccdFrontImage || u.cccdBackImage) && !u.isIdentityVerified && (
                            <button 
                              onClick={() => setKycUserModal(u)}
                              className="px-2 py-1 text-[9px] font-bold rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Xem KYC
                            </button>
                          )}
                          <button 
                            onClick={() => toggleUserLock(u.id, u.isLocked)}
                            className={`px-2 py-1 text-[9px] font-bold rounded border uppercase tracking-wider transition-all flex items-center gap-1 ${
                              u.isLocked 
                                ? 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/20 hover:bg-[#34d399] hover:text-[#000D1A]' 
                                : 'bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/20 hover:bg-[#f43f5e]'
                            }`}
                          >
                            {u.isLocked ? 'Mở khóa' : 'Khóa'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
