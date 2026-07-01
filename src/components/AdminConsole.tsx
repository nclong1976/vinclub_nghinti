import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { 
  ChevronLeft, Users, DollarSign, TrendingUp, CheckCircle, XCircle, ShieldAlert,
  Search, Lock, Unlock, ArrowUpRight, Filter, FileText, Bell, MessageSquare,
  Image as ImageIcon, Settings, History, ExternalLink, KeyRound, Clock, LogOut, Sliders, List
} from 'lucide-react';
import { UserContext } from './UserContext';
import { db, auth } from '../firebase';
import { collection, query, onSnapshot, updateDoc, doc, getDoc, where, orderBy, addDoc, serverTimestamp, setDoc, runTransaction } from 'firebase/firestore';

// Import modular sub-tabs
import ProjectControlTab from './admin/ProjectControlTab';
import OverviewTab from './admin/OverviewTab';
import FinanceTab from './admin/FinanceTab';
import UsersTab from './admin/UsersTab';
import CmsTab from './admin/CmsTab';
import NotificationsTab from './admin/NotificationsTab';
import SupportTab from './admin/SupportTab';
import AuditLogsTab from './admin/AuditLogsTab';
import AdminLiveChatView from './chat/AdminLiveChatView';


export default function AdminConsole({ onBack }: { onBack: () => void }) {
  const userCtx = useContext(UserContext);
  const { cmsBanners, updateCmsBanners, cmsNews, updateCmsNews, cmsVinfast, updateCmsVinfast } = userCtx;
  const [activeTab, setActiveTab] = useState<'overview' | 'finance' | 'users' | 'projects' | 'cms' | 'notifications' | 'support' | 'audit_logs'>('projects');

  const [globalSearch, setGlobalSearch] = useState('');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [cmsSubTab, setCmsSubTab] = useState<'news' | 'banners' | 'vinfast'>('news');
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newsForm, setNewsForm] = useState<any>({});
  const [localVinfast, setLocalVinfast] = useState<any[]>(cmsVinfast || []);
  
  // Modals state
  const [kycUserModal, setKycUserModal] = useState<any | null>(null);
  const [selectedTxDetails, setSelectedTxDetails] = useState<any | null>(null);

  // CSKH Chat states
  const [selectedChatUser, setSelectedChatUser] = useState<any | null>(null);
  const [adminChatMessages, setAdminChatMessages] = useState<any[]>([]);
  const [adminChatText, setAdminChatText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Ticker state
  const [tickerInput, setTickerInput] = useState('');
  const [tickerMessages, setTickerMessages] = useState<string[]>([]);

  // Users state
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    setLocalVinfast(cmsVinfast || []);
  }, [cmsVinfast]);

  const saveVinfastChanges = () => {
    updateCmsVinfast(localVinfast);
    alert('Đã lưu thay đổi thông số xe!');
  };

  // Real-time listen to all users
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

  // Real-time listen to ticker banner setting
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'ticker'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().messages) {
        setTickerMessages(docSnap.data().messages);
      }
    });
    return () => unsub();
  }, []);

  // Real-time listen to audit logs
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

  // Real-time listen to CSKH Chat of selected user
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

  // Helper logger
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

  // Finance Approval Logic
  const handleApproveTransaction = async (transaction: any, userId: string) => {
    if (processingIds.has(transaction.id)) return;
    setProcessingIds(prev => new Set(prev).add(transaction.id));

    try {
      const userRef = doc(db, 'users', userId);
      await runTransaction(db, async (firestoreTx) => {
        const userSnap = await firestoreTx.get(userRef);
        if (!userSnap.exists()) throw new Error('Người dùng không tồn tại.');

        const userData = userSnap.data();
        const currentTransactions = userData.transactions || [];
        const txIndex = currentTransactions.findIndex((t: any) => t.id === transaction.id);
        if (txIndex === -1) throw new Error('Giao dịch không tồn tại.');

        const txData = currentTransactions[txIndex];
        if (txData.status !== 'Đang xử lý') throw new Error(`Giao dịch này đã được xử lý (${txData.status}).`);

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
      alert(`Giao dịch đã được phê duyệt.`);
    } catch (error: any) {
      alert(`Lỗi phê duyệt: ${error.message}`);
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(transaction.id);
        return next;
      });
    }
  };

  const handleRejectTransaction = async (transaction: any, userId: string) => {
    if (processingIds.has(transaction.id)) return;
    const reason = window.prompt(`Nhập lý do từ chối giao dịch:`);
    if (reason === null) return;

    setProcessingIds(prev => new Set(prev).add(transaction.id));

    try {
      const userRef = doc(db, 'users', userId);
      await runTransaction(db, async (firestoreTx) => {
        const userSnap = await firestoreTx.get(userRef);
        if (!userSnap.exists()) throw new Error('Người dùng không tồn tại.');

        const userData = userSnap.data();
        const currentTransactions = userData.transactions || [];
        const txIndex = currentTransactions.findIndex((t: any) => t.id === transaction.id);
        if (txIndex === -1) throw new Error('Giao dịch không tồn tại.');

        const txData = currentTransactions[txIndex];
        if (txData.status !== 'Đang xử lý') throw new Error(`Giao dịch này đã được xử lý (${txData.status}).`);

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
      alert(`Giao dịch đã bị từ chối.`);
    } catch (error: any) {
      alert(`Lỗi từ chối: ${error.message}`);
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(transaction.id);
        return next;
      });
    }
  };

  // KYC Management
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
    } catch (e) {
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
    } catch (e) {
      alert('Lỗi từ chối KYC.');
    }
  };

  // Account Operations
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
      alert(`Đã reset mật khẩu thành công.`);
    } catch (e: any) {
      alert(`Lỗi reset mật khẩu: ${e.message}`);
    }
  };

  const updateUserRole = async (userId: string, oldRole: string, newRole: string) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { role: newRole });
      await addAuditLog(`Thay đổi vai trò của user ${userId} từ ${oldRole} thành ${newRole}`, userId, oldRole, newRole);
      alert(`Đã cập nhật vai trò thành công.`);
    } catch (e: any) {
      alert(`Lỗi thay đổi vai trò: ${e.message}`);
    }
  };

  // Chat Support
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

  // Ticker announcer
  const handlePushTicker = async () => {
    if (!tickerInput.trim()) return;
    try {
      await setDoc(doc(db, 'settings', 'ticker'), {
        messages: [tickerInput.trim(), ...tickerMessages].slice(0, 5)
      });
      setTickerInput('');
      alert('Đã cập nhật Ticker Banner.');
    } catch (e) {
      alert('Lỗi cập nhật Ticker.');
    }
  };

  // Search filter computes
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

  const [usersTabFilter, setUsersTabFilter] = useState<'pending' | 'verified' | 'locked'>('pending');
  const displayedUsers = useMemo(() => {
    if (usersTabFilter === 'pending') return pendingKycUsers;
    if (usersTabFilter === 'verified') return verifiedUsers;
    return lockedUsers;
  }, [usersTabFilter, pendingKycUsers, verifiedUsers, lockedUsers]);

  const [financeTabFilter, setFinanceTabFilter] = useState<'pending' | 'success' | 'rejected'>('pending');
  const { pendingTransactions, successTransactions, rejectedTransactions } = useMemo(() => {
    const pending: any[] = [];
    const success: any[] = [];
    const rejected: any[] = [];
    allUsers.forEach(u => {
      if (u.transactions) {
        u.transactions.forEach((t: any) => {
          const tx = { ...t, userId: u.id, userName: u.displayName || u.id, userPhone: u.phoneNumber || '', userBalance: u.balance || 0 };
          const matchSearch = (tx.userName?.toLowerCase() || '').includes(globalSearch.toLowerCase()) || 
                              (tx.userPhone?.toLowerCase() || '').includes(globalSearch.toLowerCase()) ||
                              (tx.id?.toLowerCase() || '').includes(globalSearch.toLowerCase());
          if (matchSearch) {
            if (t.status === 'Đang xử lý') {
              pending.push(tx);
            } else if (t.status === 'Thành công') {
              success.push(tx);
            } else if (t.status === 'Thất bại') {
              rejected.push(tx);
            }
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
  }, [allUsers, globalSearch]);

  const displayedTransactions = useMemo(() => {
    if (financeTabFilter === 'pending') return pendingTransactions;
    if (financeTabFilter === 'success') return successTransactions;
    return rejectedTransactions;
  }, [financeTabFilter, pendingTransactions, successTransactions, rejectedTransactions]);

  const totalInvestment = useMemo(() => {
    return allUsers.reduce((sum, u) => sum + (u.balance || 0), 0);
  }, [allUsers]);

  const sidebarNavItems = [
    { id: 'overview', icon: TrendingUp, label: 'Overview' },
    { id: 'finance', icon: List, label: 'Transactions', badge: pendingTransactions.length },
    { id: 'users', icon: Users, label: 'User Management' },
    { id: 'projects', icon: Sliders, label: 'Project Control' },
    { id: 'cms', icon: FileText, label: 'CMS' },
    { id: 'audit_logs', icon: Clock, label: 'Audit Logs' },
    { id: 'support', icon: MessageSquare, label: 'CSKH' },
  ];

  if (userCtx.role !== 'admin' && userCtx.role !== 'super_admin') {
    return (
      <div className="min-h-[100dvh] bg-[#111318] flex flex-col items-center justify-center text-[#ecbe8e] font-sans">
        <ShieldAlert className="w-12 h-12 mb-4 text-[#f43f5e]" />
        <h1 className="text-xl font-heading font-bold mb-2 text-white uppercase tracking-wider">Access Denied</h1>
        <p className="text-zinc-500 text-xs mb-8">Bạn không có thẩm quyền truy cập Phân hệ Điều hành tối cao.</p>
        <button onClick={onBack} className="bg-[#ecbe8e] text-[#000D1A] px-5 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#ecbe8e]/80 transition-colors">
          Quay lại Trang Chủ
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] bg-[#111318] text-[#e2e2e9] font-sans overflow-hidden select-none">
      
      {/* 240px Fixed Sidebar */}
      <aside className="w-60 bg-[#0c0e12] border-r border-[#4f453b]/20 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-[#4f453b]/10 bg-black/10">
            <h1 className="font-heading text-sm font-black text-[#ecbe8e] tracking-wider uppercase">Command Center</h1>
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mt-1">EXECUTIVE ADMIN</span>
          </div>

          {/* Navigation link stacks */}
          <nav className="p-4 space-y-1.5">
            {sidebarNavItems.map(item => {
              const isSelected = activeTab === item.id;
              return (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all duration-200 relative ${
                    isSelected 
                      ? 'bg-[#ecbe8e]/10 text-[#ecbe8e] border-l-2 border-[#ecbe8e]' 
                      : 'text-zinc-500 hover:bg-white/[0.01] hover:text-zinc-300'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${isSelected ? 'text-[#ecbe8e]' : 'text-zinc-500'}`} />
                    {item.label}
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-[#f43f5e]/10 text-[#f43f5e] text-[9px] font-black px-1.5 py-0.5 rounded-full border border-[#f43f5e]/25 shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#4f453b]/10 bg-black/10 space-y-1">
          <button 
            onClick={() => setActiveTab('support')}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded text-zinc-500 hover:text-zinc-300 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <MessageSquare className="w-4 h-4" /> Support
          </button>
          <button 
            onClick={onBack}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded text-[#f43f5e] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Transparent Glassmorphism Header */}
        <header className="h-16 border-b border-[#4f453b]/10 px-8 flex items-center justify-between shrink-0 bg-[#111318]/80 backdrop-blur-md relative z-20">
          <div>
            <h2 className="font-heading text-xs font-black uppercase tracking-wider text-white">
              {activeTab === 'projects' && 'Trung tâm Điều hành Dự án'}
              {activeTab === 'overview' && 'TỔNG QUAN TÀI CHÍNH'}
              {activeTab === 'finance' && 'TRUNG TÂM PHÊ DUYỆT GIAO DỊCH'}
              {activeTab === 'users' && 'BẢN ĐỒ KYC & NGƯỜI DÙNG'}
              {activeTab === 'cms' && 'CONTENT MANAGEMENT SYSTEM (CMS)'}
              {activeTab === 'notifications' && 'TRUYỀN THÔNG ĐA PHƯƠNG TIỆN'}
              {activeTab === 'support' && 'HỖ TRỢ CSKH TRỰC TUYẾN'}
              {activeTab === 'audit_logs' && 'NHẬT KÝ KIỂM TOÁN AN NINH (AUDIT LOGS)'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            
            {/* Minimal Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search commands..." 
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
                className="bg-[#0c0e12]/60 border border-[#4f453b]/25 rounded-full pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-[#ecbe8e]/50 text-white transition-colors w-52 placeholder-zinc-600"
              />
            </div>

            {/* Profile badge controls */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('notifications')}
                className="p-1.5 text-zinc-500 hover:text-white rounded transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#f43f5e] rounded-full"></span>
              </button>
              
              <button 
                onClick={() => setActiveTab('cms')}
                className="p-1.5 text-zinc-500 hover:text-white rounded transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              
              <div className="h-6 w-px bg-[#4f453b]/20"></div>

              <div className="flex items-center gap-2.5">
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80" 
                  alt="Admin User" 
                  className="w-8 h-8 rounded-full border border-[#ecbe8e]/20 object-cover" 
                  referrerPolicy="no-referrer"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-white leading-none">Admin User</div>
                  <span className="text-[8px] text-[#ecbe8e] font-black tracking-widest uppercase mt-0.5 block">MASTER KEY</span>
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* Tab content workspace area — fullscreen for chat tab */}
        <div className={`flex-1 overflow-hidden ${
          activeTab === 'support' ? 'flex' : 'overflow-y-auto p-8 max-w-7xl w-full mx-auto pb-24 scrollbar-thin'
        }`}>
          
          {activeTab === 'projects' && <ProjectControlTab />}
          
          {activeTab === 'overview' && (
            <OverviewTab 
              activeUsersCount={allUsers.length} 
              totalInvestment={totalInvestment} 
            />
          )}

          {activeTab === 'finance' && (
            <FinanceTab 
              financeTabFilter={financeTabFilter}
              setFinanceTabFilter={setFinanceTabFilter}
              loadingUsers={loadingUsers}
              displayedTransactions={displayedTransactions}
              processingIds={processingIds}
              handleApproveTransaction={handleApproveTransaction}
              handleRejectTransaction={handleRejectTransaction}
              setSelectedTxDetails={setSelectedTxDetails}
            />
          )}

          {activeTab === 'users' && (
            <UsersTab 
              usersTabFilter={usersTabFilter}
              setUsersTabFilter={setUsersTabFilter}
              displayedUsers={displayedUsers}
              setKycUserModal={setKycUserModal}
              toggleUserLock={toggleUserLock}
              resetUserPassword={resetUserPassword}
              updateUserRole={updateUserRole}
              approveKyc={approveKyc}
              rejectKyc={rejectKyc}
            />
          )}

          {activeTab === 'cms' && (
            <CmsTab 
              cmsSubTab={cmsSubTab}
              setCmsSubTab={setCmsSubTab}
              cmsNews={cmsNews}
              updateCmsNews={updateCmsNews}
              cmsBanners={cmsBanners}
              updateCmsBanners={updateCmsBanners}
              localVinfast={localVinfast}
              setLocalVinfast={setLocalVinfast}
              saveVinfastChanges={saveVinfastChanges}
              isAddingNews={isAddingNews}
              setIsAddingNews={setIsAddingNews}
              newsForm={newsForm}
              setNewsForm={setNewsForm}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsTab 
              tickerMessages={tickerMessages}
              tickerInput={tickerInput}
              setTickerInput={setTickerInput}
              handlePushTicker={handlePushTicker}
            />
          )}

          {activeTab === 'support' && (
            <AdminLiveChatView />
          )}


          {activeTab === 'audit_logs' && (
            <AuditLogsTab 
              auditLogs={auditLogs} 
            />
          )}

        </div>

      </div>

      {/* POPUP MODAL: KYC Document Details review */}
      {kycUserModal && (
        <div className="fixed inset-0 z-50 bg-[#0c0e12]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1b21] border border-[#4f453b]/40 rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col">
            
            <div className="px-6 py-4 bg-[#111318] border-b border-[#4f453b]/15 flex justify-between items-center">
              <h3 className="font-heading text-xs font-black uppercase tracking-wider text-white">YÊU CẦU ĐỊNH DANH KYC</h3>
              <button 
                onClick={() => setKycUserModal(null)}
                className="text-zinc-500 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[450px]">
              <div className="bg-zinc-950 p-4 rounded border border-zinc-900 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block mb-0.5">Tên thành viên:</span>
                  <span className="font-bold text-white">{kycUserModal.displayName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-0.5">Số điện thoại:</span>
                  <span className="font-mono text-zinc-300 font-bold">{kycUserModal.phoneNumber || '---'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-0.5">Năm sinh:</span>
                  <span className="font-bold text-zinc-300">{kycUserModal.birthYear || '---'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-0.5">Số CCCD:</span>
                  <span className="font-mono text-[#ecbe8e] font-black">{kycUserModal.cccd || '---'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block tracking-wider">Hồ sơ giấy tờ đính kèm</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase block">Ảnh mặt trước CCCD</span>
                    {kycUserModal.cccdFrontImage ? (
                      <div className="border border-zinc-900 rounded bg-black/60 overflow-hidden h-36 flex items-center justify-center">
                        <img src={kycUserModal.cccdFrontImage} alt="" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                    ) : (
                      <div className="border border-dashed border-zinc-800 h-36 rounded flex items-center justify-center text-zinc-600 text-xs italic">Không đính kèm</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase block">Ảnh mặt sau CCCD</span>
                    {kycUserModal.cccdBackImage ? (
                      <div className="border border-zinc-900 rounded bg-black/60 overflow-hidden h-36 flex items-center justify-center">
                        <img src={kycUserModal.cccdBackImage} alt="" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                    ) : (
                      <div className="border border-dashed border-zinc-800 h-36 rounded flex items-center justify-center text-zinc-600 text-xs italic">Không đính kèm</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#4f453b]/10 flex justify-end gap-2.5 bg-[#111318]">
              <button 
                onClick={() => setKycUserModal(null)}
                className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-wider"
              >
                Đóng
              </button>
              <button 
                onClick={async () => {
                  const targetId = kycUserModal.id;
                  setKycUserModal(null);
                  await rejectKyc(targetId);
                }}
                className="px-4 py-2 text-xs font-bold rounded bg-[#f43f5e]/10 border border-[#f43f5e]/25 text-[#f43f5e] hover:bg-[#f43f5e] hover:text-white uppercase tracking-wider"
              >
                Từ chối hồ sơ
              </button>
              <button 
                onClick={async () => {
                  const targetId = kycUserModal.id;
                  setKycUserModal(null);
                  await approveKyc(targetId);
                }}
                className="px-5 py-2 text-xs font-bold rounded bg-[#34d399] text-[#000D1A] uppercase tracking-wider"
              >
                Phê duyệt KYC
              </button>
            </div>

          </div>
        </div>
      )}

      {/* POPUP MODAL: Transaction Details receipt review */}
      {selectedTxDetails && (
        <div className="fixed inset-0 z-50 bg-[#0c0e12]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1b21] border border-[#4f453b]/40 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
            
            <div className="px-6 py-4 bg-[#111318] border-b border-[#4f453b]/15 flex justify-between items-center">
              <h3 className="font-heading text-xs font-black uppercase tracking-wider text-white">Biên lai giao dịch chi tiết</h3>
              <button 
                onClick={() => setSelectedTxDetails(null)}
                className="text-zinc-500 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[450px]">
              
              <div className="bg-zinc-950 p-4 rounded border border-zinc-900 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Mã Giao dịch:</span>
                  <span className="text-white font-bold">{selectedTxDetails.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Người thực hiện:</span>
                  <span className="text-[#ecbe8e] font-bold">{selectedTxDetails.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Thời gian yêu cầu:</span>
                  <span className="text-zinc-400">{selectedTxDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Trạng thái:</span>
                  <span className={`font-bold ${
                    selectedTxDetails.status === 'Thành công' ? 'text-[#34d399]' :
                    selectedTxDetails.status === 'Đang xử lý' ? 'text-amber-400' : 'text-[#f43f5e]'
                  }`}>
                    {selectedTxDetails.status}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#4f453b]/10 pt-2 mt-2">
                  <span className="text-zinc-500">Yêu cầu thanh khoản:</span>
                  <span className="text-white font-extrabold text-sm">{selectedTxDetails.amount?.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              {/* Player text notes */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block tracking-wider">Lời nhắn từ thành viên</span>
                <div className="bg-[#111318] p-3 rounded text-zinc-300 text-xs italic">
                  {selectedTxDetails.note || 'Không đính kèm tin nhắn bổ sung.'}
                </div>
              </div>

              {/* Bank Transfer Receipt image */}
              {selectedTxDetails.type === 'deposit' && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase block tracking-wider">Chứng minh chuyển tiền (Ảnh chuyển khoản)</span>
                  {selectedTxDetails.proofImage ? (
                    <div className="border border-zinc-900 rounded bg-black/60 overflow-hidden h-44 flex items-center justify-center">
                      <img src={selectedTxDetails.proofImage} alt="" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                  ) : (
                    <div className="border border-dashed border-zinc-800 h-24 rounded flex items-center justify-center text-zinc-600 text-xs italic">Không tải lên ảnh biên lai chuyển tiền</div>
                  )}
                </div>
              )}

            </div>

            <div className="p-4 border-t border-[#4f453b]/10 flex justify-end gap-2.5 bg-[#111318]">
              <button 
                onClick={() => setSelectedTxDetails(null)}
                className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-wider"
              >
                Đóng
              </button>
              
              {selectedTxDetails.status === 'Đang xử lý' && (
                <>
                  <button 
                    onClick={async () => {
                      const tx = selectedTxDetails;
                      setSelectedTxDetails(null);
                      await handleRejectTransaction(tx, tx.userId);
                    }}
                    className="px-4 py-2 text-xs font-bold rounded bg-[#f43f5e]/10 border border-[#f43f5e]/25 text-[#f43f5e] hover:bg-[#f43f5e] hover:text-white uppercase tracking-wider"
                  >
                    Từ chối
                  </button>
                  <button 
                    onClick={async () => {
                      const tx = selectedTxDetails;
                      setSelectedTxDetails(null);
                      await handleApproveTransaction(tx, tx.userId);
                    }}
                    className="px-5 py-2 text-xs font-bold rounded bg-[#34d399] text-[#000D1A] uppercase tracking-wider"
                  >
                    Phê duyệt nạp
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
