import React, { useState, useEffect, useRef } from 'react';
import { useUser } from './UserContext';
import { db } from '../firebase';
import { 
  collection, onSnapshot, doc, setDoc, addDoc, 
  updateDoc, deleteDoc, query, orderBy, where, getDoc 
} from 'firebase/firestore';
import { 
  Building2, Users, MessageSquare, Plus, Edit, Trash2, Eye, EyeOff, 
  LogOut, Check, X, Search, ShieldCheck, DollarSign, Clock, Send, 
  AlertCircle, ShieldAlert, Lock, Unlock, RefreshCw, CheckCircle2,
  FileText, Activity, CreditCard, ChevronRight
} from 'lucide-react';
import { Project } from '../types';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function AdminDashboard() {
  const { role, logout, displayName } = useUser();

  // Middleware Guard: Verify client-side permissions
  const isAdminRole = role === 'admin' || role === 'super_admin' || role === 'support_admin' || role === 'finance_admin';
  if (!isAdminRole) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6 text-center select-none font-sans">
        <ShieldAlert className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold font-['Montserrat'] uppercase tracking-wider mb-2">403 - TRUY CẬP BỊ TỪ CHỐI</h1>
        <p className="text-zinc-400 text-sm max-w-md mb-6 leading-relaxed">
          Tài khoản của bạn không được cấp quyền quản trị viên tối cao để truy cập bảng điều khiển này. Hệ thống đã chặn truy cập bất hợp pháp.
        </p>
        <button 
          onClick={() => logout()} 
          className="bg-rose-600 hover:bg-rose-500 px-6 py-2.5 rounded-xl font-bold transition-colors cursor-pointer active:scale-95 text-xs uppercase tracking-widest shadow-md"
        >
          Đăng xuất / Về Đăng nhập
        </button>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'analytics' | 'projects' | 'users' | 'approvals' | 'cskh'>('analytics');
  
  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Projects Management States
  const [projects, setProjects] = useState<Project[]>([]);
  const [vinpearlProjects, setVinpearlProjects] = useState<Project[]>([]);
  const [projectType, setProjectType] = useState<'standard' | 'vinpearl'>('standard');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    id: '',
    title: '',
    imageUrl: '',
    interestRate: '1.40 %',
    interestRateValue: 0.014,
    duration: '8640 phút',
    durationDays: 6,
    minAmount: '30.000.000 VNĐ',
    minInvestAmount: 30000000,
    scale: '10.300.000.000 VNĐ',
    progress: 97,
    category: 'Y TẾ',
    status: 'ACTIVE' as 'ACTIVE' | 'CLOSED'
  });

  // VIP Config Limits (gold, vip, vvip limit in VND)
  const [vipConfig, setVipConfig] = useState({
    goldLimit: 1000000000,
    vipLimit: 5000000000,
    vvipLimit: 10000000000
  });
  const [isVipConfigOpen, setIsVipConfigOpen] = useState(false);
  const [goldFormVal, setGoldFormVal] = useState('1.000.000.000');
  const [vipFormVal, setVipFormVal] = useState('5.000.000.000');
  const [vvipFormVal, setVvipFormVal] = useState('10.000.000.000');

  // User Management States
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Manual Balance Adjustment Form
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustNote, setAdjustNote] = useState('');
  const [adjustType, setAdjustType] = useState<'add' | 'subtract'>('add');

  // Transaction Approvals States
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'deposit' | 'withdraw'>('all');
  const [selectedBillImage, setSelectedBillImage] = useState<string | null>(null);

  // Support Chat States
  const [chatThreads, setChatThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<any[]>([]);
  const [adminReplyText, setAdminReplyText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  
  // Real-time Chat Thread statuses (pending/completed)
  const [threadStatuses, setThreadStatuses] = useState<{ [key: string]: 'pending' | 'completed' }>({});

  // Helper: Log Admin Action to Firestore
  const logAdminAction = async (action: string) => {
    try {
      await addDoc(collection(db, 'audit_logs'), {
        adminName: displayName || 'Admin Tối Cao',
        action,
        createdAt: new Date()
      });
    } catch (err) {
      console.error("Error logging admin action:", err);
    }
  };

  // Load Audit Logs in real-time
  useEffect(() => {
    const q = query(collection(db, 'audit_logs'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => {
        const data = d.data();
        let timeStr = '';
        if (data.createdAt) {
          try {
            timeStr = new Date((data.createdAt as any).seconds * 1000).toLocaleString('vi-VN');
          } catch {
            timeStr = new Date().toLocaleString('vi-VN');
          }
        } else {
          timeStr = new Date().toLocaleString('vi-VN');
        }
        return { id: d.id, ...data, timeFormatted: timeStr };
      });
      setAuditLogs(items);
    });
    return () => unsub();
  }, []);

  // Load standard projects in real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
      items.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      setProjects(items);
    });
    return () => unsub();
  }, []);

  // Load Vinpearl projects in real-time
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'system', 'project_control'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.projects) {
          setVinpearlProjects(data.projects);
        }
      }
    });
    return () => unsub();
  }, []);

  // Load users in real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(items);
    });
    return () => unsub();
  }, []);

  // Load VIP Config
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'system', 'vip_config'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const config = {
          goldLimit: data.goldLimit !== undefined ? Number(data.goldLimit) : 1000000000,
          vipLimit: data.vipLimit !== undefined ? Number(data.vipLimit) : 5000000000,
          vvipLimit: data.vvipLimit !== undefined ? Number(data.vvipLimit) : 10000000000
        };
        setVipConfig(config);
        setGoldFormVal(new Intl.NumberFormat('vi-VN').format(config.goldLimit));
        setVipFormVal(new Intl.NumberFormat('vi-VN').format(config.vipLimit));
        setVvipFormVal(new Intl.NumberFormat('vi-VN').format(config.vvipLimit));
      }
    });
    return () => unsub();
  }, []);

  // Load Chat Support threads
  useEffect(() => {
    const q = query(collection(db, 'chat_messages'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      const threadsMap: { [key: string]: any } = {};
      messages.forEach((msg: any) => {
        const convId = msg.conversation_id;
        if (!convId) return;

        if (!threadsMap[convId]) {
          threadsMap[convId] = {
            conversation_id: convId,
            lastMessage: msg.content,
            lastMessageTime: msg.createdAt,
            unreadCount: msg.sender_role === 'user' && !msg.is_read ? 1 : 0
          };
        } else if (msg.sender_role === 'user' && !msg.is_read) {
          threadsMap[convId].unreadCount += 1;
        }
      });

      const threadsList = Object.values(threadsMap);
      setChatThreads(threadsList);
    });
    return () => unsub();
  }, []);

  // Load Chat Support Thread statuses (pending/completed)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'chat_threads'), (snap) => {
      const statuses: { [key: string]: 'pending' | 'completed' } = {};
      snap.docs.forEach(d => {
        statuses[d.id] = d.data().status || 'pending';
      });
      setThreadStatuses(statuses);
    });
    return () => unsub();
  }, []);

  // Load messages for selected thread
  useEffect(() => {
    if (!selectedThread) return;
    const q = query(
      collection(db, 'chat_messages'), 
      where('conversation_id', '==', selectedThread),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => {
        const data = d.data();
        let timeStr = '';
        if (data.createdAt) {
          try {
            timeStr = new Date((data.createdAt as any).seconds * 1000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          } catch {
            timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          }
        } else {
          timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        }
        return { id: d.id, ...data, timeFormatted: timeStr };
      });
      setThreadMessages(msgs);
      
      // Mark as read
      const unreadMsgs = msgs.filter(m => m.sender_role === 'user' && !m.is_read);
      unreadMsgs.forEach(async (m) => {
        await updateDoc(doc(db, 'chat_messages', m.id), { is_read: true });
      });
    });
    return () => unsub();
  }, [selectedThread]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages]);

  // Sync selected user details modal
  useEffect(() => {
    if (!selectedUser) return;
    const found = users.find(u => u.id === selectedUser.id);
    if (found) setSelectedUser(found);
  }, [users]);

  // Project modal handlers
  const openProjectModal = (proj?: Project) => {
    if (proj) {
      setEditingProject(proj);
      setProjectForm({
        id: proj.id,
        title: proj.title,
        imageUrl: proj.imageUrl || '',
        interestRate: proj.interestRate || '1.40 %',
        interestRateValue: proj.interestRateValue || 0.014,
        duration: proj.duration || '8640 phút',
        durationDays: proj.durationDays || 6,
        minAmount: proj.minAmount || '30.000.000 VNĐ',
        minInvestAmount: proj.minInvestAmount || 30000000,
        scale: proj.scale || '10.300.000.000 VNĐ',
        progress: proj.progress || 0,
        category: proj.category || (projectType === 'standard' ? 'Y TẾ' : 'VINPEARL'),
        status: (proj.status as any) || 'ACTIVE'
      });
    } else {
      setEditingProject(null);
      const activeList = projectType === 'standard' ? projects : vinpearlProjects;
      const nextId = activeList.length > 0 ? String(Math.max(...activeList.map(p => parseInt(p.id) || 0)) + 1) : '1';
      setProjectForm({
        id: nextId,
        title: '',
        imageUrl: '',
        interestRate: '1.40 %',
        interestRateValue: 0.014,
        duration: '8640 phút',
        durationDays: 6,
        minAmount: '30.000.000 VNĐ',
        minInvestAmount: 30000000,
        scale: '10.300.000.000 VNĐ',
        progress: 0,
        category: projectType === 'standard' ? 'Y TẾ' : 'VINPEARL',
        status: 'ACTIVE'
      });
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim()) return;

    const dataToSave = {
      ...projectForm,
      interestRateValue: Number(projectForm.interestRateValue),
      durationDays: Number(projectForm.durationDays),
      minInvestAmount: Number(projectForm.minInvestAmount),
      progress: Number(projectForm.progress)
    };

    try {
      if (projectType === 'standard') {
        await setDoc(doc(db, 'projects', projectForm.id), dataToSave);
      } else {
        let updated: Project[];
        if (editingProject) {
          updated = vinpearlProjects.map(p => p.id === projectForm.id ? dataToSave : p);
        } else {
          updated = [...vinpearlProjects, dataToSave];
        }
        await setDoc(doc(db, 'system', 'project_control'), { projects: updated }, { merge: true });
      }
      setIsProjectModalOpen(false);
      setEditingProject(null);
      await logAdminAction(`Lưu thay đổi dự án ID ${projectForm.id}: "${projectForm.title}"`);
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Không lưu được dự án!");
    }
  };

  const handleDeleteProject = async (id: string) => {
    const projName = projects.find(p => p.id === id)?.title || vinpearlProjects.find(p => p.id === id)?.title || id;
    if (window.confirm("Bạn có chắc chắn muốn xóa dự án này không?")) {
      try {
        if (projectType === 'standard') {
          await deleteDoc(doc(db, 'projects', id));
        } else {
          const updated = vinpearlProjects.filter(p => p.id !== id);
          await setDoc(doc(db, 'system', 'project_control'), { projects: updated }, { merge: true });
        }
        await logAdminAction(`Xóa dự án ID ${id}: "${projName}"`);
      } catch (err) {
        console.error("Error deleting project:", err);
      }
    }
  };

  const toggleProjectStatus = async (proj: Project) => {
    const nextStatus = proj.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      if (projectType === 'standard') {
        await updateDoc(doc(db, 'projects', proj.id), { status: nextStatus });
      } else {
        const updated = vinpearlProjects.map(p => p.id === proj.id ? { ...p, status: nextStatus } : p);
        await setDoc(doc(db, 'system', 'project_control'), { projects: updated }, { merge: true });
      }
      await logAdminAction(`Cập nhật trạng thái dự án "${proj.title}" sang: ${nextStatus === 'ACTIVE' ? 'HIỂN THỊ' : 'ẨN'}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Save VIP tier config limits
  const handleSaveVipConfigLimits = async (e: React.FormEvent) => {
    e.preventDefault();
    const gVal = parseFloat(goldFormVal.replace(/\D/g, ''));
    const vVal = parseFloat(vipFormVal.replace(/\D/g, ''));
    const vvVal = parseFloat(vvipFormVal.replace(/\D/g, ''));

    if (isNaN(gVal) || isNaN(vVal) || isNaN(vvVal)) {
      alert("Hạn mức nhập vào không hợp lệ!");
      return;
    }

    try {
      await setDoc(doc(db, 'system', 'vip_config'), {
        goldLimit: gVal,
        vipLimit: vVal,
        vvipLimit: vvVal
      });
      setIsVipConfigOpen(false);
      await logAdminAction(`Cập nhật hạn mức phân hạng thẻ VIP: Gold (${gVal.toLocaleString('vi-VN')} VND), VIP (${vVal.toLocaleString('vi-VN')} VND), VVIP (${vvVal.toLocaleString('vi-VN')} VND)`);
    } catch (err) {
      console.error("Error setting VIP limits:", err);
    }
  };

  // Manual Adjust Balance handler
  const handleAdjustBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const val = parseFloat(adjustAmount.replace(/\D/g, ''));
    if (isNaN(val) || val <= 0) {
      alert("Số tiền điều chỉnh không hợp lệ!");
      return;
    }

    const currentBal = selectedUser.balance || 0;
    const finalBal = adjustType === 'add' ? currentBal + val : currentBal - val;
    if (finalBal < 0) {
      alert("Số dư tài khoản sau khi trừ không thể nhỏ hơn 0!");
      return;
    }

    const txs = selectedUser.transactions || [];
    const newTx = {
      id: 'TX' + Math.floor(Math.random() * 900000 + 100000),
      type: adjustType === 'add' ? 'bonus' : 'withdraw',
      amount: val,
      status: 'Thành công',
      date: new Date().toLocaleString('vi-VN'),
      note: adjustNote.trim() || `Điều chỉnh bởi Admin (${adjustType === 'add' ? 'Cộng' : 'Trừ'} số dư)`
    };

    try {
      await updateDoc(doc(db, 'users', selectedUser.id), {
        balance: finalBal,
        transactions: [newTx, ...txs]
      });
      setAdjustAmount('');
      setAdjustNote('');
      await logAdminAction(`${adjustType === 'add' ? 'Cộng thêm' : 'Khấu trừ'} ${val.toLocaleString('vi-VN')} VNĐ vào số dư của hội viên "${selectedUser.displayName || selectedUser.id}"`);
      alert("Đã điều chỉnh tài khoản thành công!");
    } catch (err) {
      console.error(err);
    }
  };

  // Transaction Approvals (Approve / Reject)
  const handleApproveTransaction = async (userId: string, txId: string, type: 'deposit' | 'withdraw', amount: number) => {
    const userRef = doc(db, 'users', userId);
    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) return;
      const userData = snap.data();
      const txs = userData.transactions || [];
      
      const updatedTxs = txs.map((t: any) => t.id === txId ? { ...t, status: 'Thành công' } : t);
      const updates: any = { transactions: updatedTxs };

      if (type === 'deposit') {
        updates.balance = (userData.balance || 0) + amount;
        
        const deposits = userData.depositsList || [];
        const newRecord = {
          id: txId,
          amount,
          date: new Date().toLocaleString('vi-VN'),
          status: 'Thành công'
        };
        updates.depositsList = [newRecord, ...deposits];
      }

      await updateDoc(userRef, updates);
      await logAdminAction(`Duyệt lệnh ${type === 'deposit' ? 'nạp tiền' : 'rút tiền'} thành công cho hội viên "${userData.displayName || userId}" số tiền: ${amount.toLocaleString('vi-VN')} VNĐ`);
      alert("Đã duyệt giao dịch thành công!");
    } catch (err) {
      console.error("Error approving transaction:", err);
    }
  };

  const handleRejectTransaction = async (userId: string, txId: string, type: 'deposit' | 'withdraw', amount: number) => {
    const reason = window.prompt("Nhập lý do từ chối giao dịch này:");
    if (reason === null) return;

    const userRef = doc(db, 'users', userId);
    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) return;
      const userData = snap.data();
      const txs = userData.transactions || [];

      const updatedTxs = txs.map((t: any) => t.id === txId ? { ...t, status: 'Thất bại', note: reason || 'Từ chối bởi admin' } : t);
      const updates: any = { transactions: updatedTxs };

      if (type === 'withdraw') {
        updates.balance = (userData.balance || 0) + amount;
      }

      await updateDoc(userRef, updates);
      await logAdminAction(`Từ chối lệnh ${type === 'deposit' ? 'nạp tiền' : 'rút tiền'} của hội viên "${userData.displayName || userId}" số tiền: ${amount.toLocaleString('vi-VN')} VNĐ. Lý do: ${reason}`);
      alert("Đã từ chối giao dịch!");
    } catch (err) {
      console.error("Error rejecting transaction:", err);
    }
  };

  const toggleUserLock = async (u: any) => {
    const isLocked = !u.isLocked;
    try {
      await updateDoc(doc(db, 'users', u.id), { isLocked });
      await logAdminAction(`${isLocked ? 'Khóa (Ban)' : 'Mở khóa (Unban)'} tài khoản của hội viên "${u.displayName || u.id}"`);
    } catch (err) {
      console.error("Error locking user:", err);
    }
  };

  // Support Chat: Send admin reply
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !selectedThread) return;

    try {
      const reply = adminReplyText;
      setAdminReplyText(''); 
      await addDoc(collection(db, 'chat_messages'), {
        conversation_id: selectedThread,
        sender_email: 'admin',
        sender_role: 'admin',
        content: reply,
        is_read: false,
        createdAt: new Date()
      });
      await setDoc(doc(db, 'chat_threads', selectedThread), { status: 'pending' }, { merge: true });
    } catch (err) {
      console.error("Error sending admin reply:", err);
    }
  };

  // Toggle chat thread status
  const handleToggleThreadStatus = async (convId: string) => {
    const current = threadStatuses[convId] || 'pending';
    const nextStatus = current === 'pending' ? 'completed' : 'pending';
    try {
      await setDoc(doc(db, 'chat_threads', convId), { status: nextStatus }, { merge: true });
      await logAdminAction(`Thay đổi trạng thái hỗ trợ chat của hội thoại "${convId}" sang: ${nextStatus === 'completed' ? 'Đã hoàn thành' : 'Đang xử lý'}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Helper: calculate totals and vip rank for user
  const getUserStats = (userObj: any) => {
    const txs = userObj?.transactions || [];
    const successfulDeposits = txs.filter((t: any) => t.type === 'deposit' && t.status === 'Thành công');
    const totalDeposits = successfulDeposits.reduce((sum: number, t: any) => sum + t.amount, 0);
    const totalWithdrawals = txs.filter((t: any) => t.type === 'withdraw' && t.status === 'Thành công').reduce((sum: number, t: any) => sum + t.amount, 0);

    let calculatedTier = 'MEMBER';
    if (totalDeposits >= vipConfig.vvipLimit) {
      calculatedTier = 'VVIP';
    } else if (totalDeposits >= vipConfig.vipLimit) {
      calculatedTier = 'VIP';
    } else if (totalDeposits >= vipConfig.goldLimit) {
      calculatedTier = 'GOLD';
    }

    const activeInvests = txs.filter((t: any) => t.type === 'invest');

    return { totalDeposits, totalWithdrawals, calculatedTier, activeInvests };
  };

  // Extract all pending transactions (deposits & withdrawals) across all users
  const pendingTransactions: any[] = [];
  users.forEach(u => {
    if (u.transactions && Array.isArray(u.transactions)) {
      u.transactions.forEach(t => {
        if (t.status === 'Đang xử lý' && (t.type === 'deposit' || t.type === 'withdraw')) {
          pendingTransactions.push({
            ...t,
            user: {
              id: u.id,
              displayName: u.displayName,
              phoneNumber: u.phoneNumber,
              bankInfo: u.bankInfo,
              balance: u.balance || 0
            }
          });
        }
      });
    }
  });

  // Filter pending transactions based on approvals tab filter
  const filteredApprovals = pendingTransactions.filter(t => {
    if (approvalFilter === 'deposit') return t.type === 'deposit';
    if (approvalFilter === 'withdraw') return t.type === 'withdraw';
    return true;
  });

  // Filter users list
  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phoneNumber?.includes(searchQuery) ||
    u.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getChatUserInfo = (convId: string) => {
    const u = users.find(usr => usr.id === convId);
    if (!u) return { displayName: convId, phoneNumber: 'N/A', balance: 0, tier: 'MEMBER' };
    const { calculatedTier } = getUserStats(u);
    return {
      displayName: u.displayName || 'Khách Hàng',
      phoneNumber: u.phoneNumber || 'Không có SĐT',
      balance: u.balance || 0,
      tier: calculatedTier
    };
  };

  // Calculation for KPI Cards & Analytics Charts
  const totalUserBalance = users.reduce((sum, u) => sum + (u.balance || 0), 0);

  const getDepositStats = () => {
    let today = 0;
    let week = 0;
    let month = 0;
    let total = 0;

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const startOfWeek = new Date(now.getTime() - now.getDay() * oneDay);
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    users.forEach(u => {
      if (u.transactions && Array.isArray(u.transactions)) {
        u.transactions.forEach((t: any) => {
          if (t.type === 'deposit' && t.status === 'Thành công') {
            total += t.amount;
            
            let txDate = new Date();
            if (t.date) {
              const parts = t.date.split(',')[0].trim().split('/');
              if (parts.length === 3) {
                txDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
              }
            }
            const diffTime = now.getTime() - txDate.getTime();
            if (diffTime < oneDay && txDate.getDate() === now.getDate()) {
              today += t.amount;
            }
            if (txDate >= startOfWeek) {
              week += t.amount;
            }
            if (txDate >= startOfMonth) {
              month += t.amount;
            }
          }
        });
      }
    });

    return { today, week, month, total };
  };

  const depositStats = getDepositStats();

  const totalWithdrawalsVal = users.reduce((sum, u) => {
    const txs = u.transactions || [];
    const sumW = txs.filter((t: any) => t.type === 'withdraw' && t.status === 'Thành công').reduce((s: number, t: any) => s + t.amount, 0);
    return sum + sumW;
  }, 0);

  // Generate Recharts daily data
  const getChartData = () => {
    const datesMap: { [key: string]: { date: string; deposit: number; withdraw: number } } = {};
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      datesMap[dateStr] = { date: dateStr, deposit: 0, withdraw: 0 };
    }

    users.forEach(u => {
      if (u.transactions && Array.isArray(u.transactions)) {
        u.transactions.forEach((t: any) => {
          if (t.status === 'Thành công') {
            let txDateStr = '';
            if (t.date) {
              const parts = t.date.split(',')[0].trim().split('/');
              if (parts.length >= 2) {
                txDateStr = `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}`;
              }
            }
            if (txDateStr && datesMap[txDateStr]) {
              if (t.type === 'deposit') {
                datesMap[txDateStr].deposit += t.amount;
              } else if (t.type === 'withdraw') {
                datesMap[txDateStr].withdraw += t.amount;
              }
            }
          }
        });
      }
    });

    return Object.values(datesMap);
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none antialiased">
      {/* Top Navbar */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-[#b48b3b] flex items-center justify-center text-black font-black shadow-lg">
            VC
          </div>
          <div>
            <h1 className="font-bold text-[18px] font-['Montserrat'] tracking-wider text-[#ebd5ad] uppercase">VinClub Admin Panel</h1>
            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">Hệ thống quản lý tối cao</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-zinc-800 border border-zinc-700/80 px-4 py-2 rounded-lg text-xs font-semibold text-zinc-300">
            🟢 Đang hoạt động
          </div>
          <button 
            onClick={() => logout()}
            className="flex items-center gap-2 bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800/80 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between py-6">
          <div className="space-y-2 px-3">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer ${
                activeTab === 'analytics' ? 'bg-[#c29b57] text-black shadow-md' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              <Activity className="w-5 h-5" />
              Tổng quan hệ thống
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer ${
                activeTab === 'projects' ? 'bg-[#c29b57] text-black shadow-md' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              <Building2 className="w-5 h-5" />
              Quản lý Dự án
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer ${
                activeTab === 'users' ? 'bg-[#c29b57] text-black shadow-md' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              Quản lý Người dùng
            </button>
            <button 
              onClick={() => setActiveTab('approvals')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer relative ${
                activeTab === 'approvals' ? 'bg-[#c29b57] text-black shadow-md' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              Phê duyệt Giao dịch
              {pendingTransactions.length > 0 && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 min-w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1.5 shadow-md">
                  {pendingTransactions.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('cskh')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer relative ${
                activeTab === 'cskh' ? 'bg-[#c29b57] text-black shadow-md' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Hỗ trợ CSKH
              {chatThreads.some(t => t.unreadCount > 0) && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></span>
              )}
            </button>
          </div>

          <div className="px-6 text-center text-[11px] text-zinc-650">
            VinClub Admin v2.0 &copy; 2026
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-zinc-950 p-6 overflow-y-auto">
          {/* Dashboard Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[20px] font-bold font-['Montserrat'] text-[#ebd5ad] uppercase tracking-wide">Tổng quan hệ thống</h2>
                <p className="text-[12px] text-zinc-400 mt-1">Nắm bắt nhanh số dư tài khoản, doanh thu nạp/rút và nhật ký bảo mật</p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Total Balance */}
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-md">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Tổng số dư hội viên</span>
                    <DollarSign className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-zinc-100 truncate">{totalUserBalance.toLocaleString('vi-VN')} VNĐ</div>
                    <p className="text-[10px] text-zinc-500 mt-1">Tổng tiền khả dụng trong ví các user</p>
                  </div>
                </div>

                {/* Total Deposit */}
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-md">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Doanh thu nạp (Thành công)</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-zinc-100 truncate">{depositStats.total.toLocaleString('vi-VN')} VNĐ</div>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Hôm nay: <strong className="text-emerald-400">+{depositStats.today.toLocaleString('vi-VN')}</strong>
                    </p>
                  </div>
                </div>

                {/* Total Withdraw */}
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-md">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Tổng đã giải ngân rút</span>
                    <Clock className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-zinc-100 truncate">{totalWithdrawalsVal.toLocaleString('vi-VN')} VNĐ</div>
                    <p className="text-[10px] text-zinc-500 mt-1">Tổng tiền mặt đã được admin phê duyệt xuất quỹ</p>
                  </div>
                </div>

                {/* Registered users */}
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-md">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Tổng hội viên đăng ký</span>
                    <Users className="w-5 h-5 text-[#c29b57]" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-zinc-100">{users.length} tài khoản</div>
                    <p className="text-[10px] text-zinc-500 mt-1">Gồm hội viên thường và đối tác liên kết</p>
                  </div>
                </div>
              </div>

              {/* Chart & Live Status Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recharts AreaChart for cash flows */}
                <div className="xl:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
                  <div>
                    <h3 className="font-bold text-zinc-100 text-sm">Xu hướng Giao dịch (7 ngày qua)</h3>
                    <p className="text-[10px] text-zinc-500">So sánh dòng tiền nạp vào và rút ra của toàn hệ thống</p>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorDeposit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorWithdraw" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                        <YAxis stroke="#71717a" fontSize={10} tickLine={false} tickFormatter={(v) => (v / 1000000).toLocaleString() + 'M'} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                          labelStyle={{ color: '#a1a1aa', fontWeight: 'bold', fontSize: '11px' }}
                          itemStyle={{ fontSize: '12px' }}
                          formatter={(value: any) => [Number(value).toLocaleString('vi-VN') + ' VNĐ']}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
                        <Area type="monotone" name="Nạp tiền" dataKey="deposit" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDeposit)" />
                        <Area type="monotone" name="Rút tiền" dataKey="withdraw" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWithdraw)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Info Box */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-zinc-100 text-sm">Cấu hình Tỷ giá & VIP</h3>
                    <p className="text-[10px] text-zinc-500">Xem nhanh các thông số hạn mức lõi hệ thống</p>
                  </div>
                  
                  <div className="space-y-3.5 text-xs text-zinc-350">
                    <div className="flex justify-between items-center border-b border-zinc-800/60 pb-2">
                      <span>Mức Gold (Vàng):</span>
                      <strong className="text-zinc-200 font-mono">{(vipConfig.goldLimit || 0).toLocaleString('vi-VN')} VNĐ</strong>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-800/60 pb-2">
                      <span>Mức VIP (Bạch Kim):</span>
                      <strong className="text-zinc-200 font-mono">{(vipConfig.vipLimit || 0).toLocaleString('vi-VN')} VNĐ</strong>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-800/60 pb-2">
                      <span>Mức VVIP (Kim Cương):</span>
                      <strong className="text-zinc-200 font-mono">{(vipConfig.vvipLimit || 0).toLocaleString('vi-VN')} VNĐ</strong>
                    </div>
                    <div className="flex justify-between items-center pb-1">
                      <span>Yêu cầu giao dịch đang xử lý:</span>
                      <span className="bg-rose-950 text-rose-350 px-2 py-0.5 rounded font-black font-mono">
                        {pendingTransactions.length} lệnh
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('users')}
                    className="w-full bg-[#c29b57]/15 border border-[#c29b57]/40 hover:bg-[#c29b57]/20 text-[#ebd5ad] font-bold text-xs py-3 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Xem chi tiết hạn mức &rarr;
                  </button>
                </div>
              </div>

              {/* Audit Logs Section */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-4">
                <div>
                  <h3 className="font-bold text-zinc-100 text-sm flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#c29b57]" /> Nhật ký Hoạt động Quản trị (Audit Logs)
                  </h3>
                  <p className="text-[10px] text-zinc-500">Lịch sử ghi nhận thao tác thay đổi cơ sở dữ liệu của admin trong hệ thống</p>
                </div>

                <div className="overflow-x-auto max-h-80 border border-zinc-800/60 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-950 text-[10px] font-black uppercase tracking-wider text-zinc-500 border-b border-zinc-850">
                        <th className="px-4 py-3 w-1/4">Thời gian</th>
                        <th className="px-4 py-3 w-1/5">Tài khoản Admin</th>
                        <th className="px-4 py-3">Hành động thực hiện</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 text-xs text-zinc-300 font-medium">
                      {auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-zinc-850/10 transition-colors">
                          <td className="px-4 py-3 font-mono text-[10.5px] text-zinc-400">{log.timeFormatted}</td>
                          <td className="px-4 py-3 font-bold text-zinc-200">{log.adminName}</td>
                          <td className="px-4 py-3 text-zinc-350 leading-relaxed">{log.action}</td>
                        </tr>
                      ))}
                      {auditLogs.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-8 text-center text-zinc-600 italic">
                            Chưa có nhật ký hoạt động nào.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Projects Management Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-[20px] font-bold font-['Montserrat'] text-[#ebd5ad] uppercase tracking-wide">Quản lý Dự án Đầu tư</h2>
                  <p className="text-[12px] text-zinc-400 mt-1">Quản lý danh sách các gói góp vốn đầu tư toàn hệ thống</p>
                </div>
                <button 
                  onClick={() => openProjectModal()}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#c29b57] to-[#ebd5ad] hover:from-[#ebd5ad] hover:to-[#c29b57] text-black font-extrabold text-sm px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Thêm Dự án mới
                </button>
              </div>

              {/* Project Type Toggle Selector */}
              <div className="flex bg-zinc-900 border border-zinc-850 p-1 rounded-xl self-start w-fit">
                <button 
                  onClick={() => setProjectType('standard')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${projectType === 'standard' ? 'bg-[#c29b57] text-black shadow-md' : 'text-zinc-450 hover:text-white'}`}
                >
                  Dự án Đầu tư Chung
                </button>
                <button 
                  onClick={() => setProjectType('vinpearl')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${projectType === 'vinpearl' ? 'bg-[#c29b57] text-black shadow-md' : 'text-zinc-450 hover:text-white'}`}
                >
                  Siêu dự án Vinpearl (Hạ Long Xanh, Trống Đồng...)
                </button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {(projectType === 'standard' ? projects : vinpearlProjects).map(proj => (
                  <div key={proj.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
                    <div className="h-44 w-full bg-zinc-950 relative">
                      {proj.imageUrl ? (
                        <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover opacity-80" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                          <Building2 className="w-12 h-12" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-black/60 border border-zinc-800 px-3 py-1 rounded text-[10px] font-bold text-[#c29b57] uppercase tracking-wider">
                        {proj.category}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-zinc-500 uppercase">Mã ID: {proj.id}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded ${proj.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-zinc-850 text-zinc-400 border border-zinc-700'}`}>
                            {proj.status === 'ACTIVE' ? 'ĐANG MỞ' : 'ĐÃ ĐÓNG'}
                          </span>
                        </div>
                        <h3 className="font-bold text-[15px] text-zinc-100 line-clamp-2 leading-snug">{proj.title}</h3>
                      </div>

                      <div className="grid grid-cols-3 gap-2 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/60 text-center">
                        <div>
                          <div className="text-[#c29b57] font-black text-xs">{proj.interestRate}</div>
                          <div className="text-[9px] text-zinc-500 font-bold uppercase mt-0.5">Lãi suất</div>
                        </div>
                        <div className="border-x border-zinc-800/60">
                          <div className="text-[#c29b57] font-black text-xs">{proj.duration}</div>
                          <div className="text-[9px] text-zinc-500 font-bold uppercase mt-0.5">Thời hạn</div>
                        </div>
                        <div>
                          <div className="text-[#c29b57] font-black text-xs truncate">{proj.minAmount}</div>
                          <div className="text-[9px] text-zinc-500 font-bold uppercase mt-0.5">Tối thiểu</div>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-zinc-450 border-t border-zinc-800/60 pt-3">
                        <div className="flex justify-between">
                          <span>Quy mô vốn:</span>
                          <span className="text-zinc-200 font-bold">{proj.scale}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] shrink-0">Tiến độ:</span>
                          <div className="flex-1 h-2 bg-zinc-950 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#c29b57] to-[#ebd5ad] rounded-full" style={{ width: `${proj.progress}%` }}></div>
                          </div>
                          <span className="font-bold text-zinc-300 text-[11px] shrink-0">{proj.progress}%</span>
                        </div>
                      </div>

                      <div className="flex gap-2 border-t border-zinc-800/60 pt-4 mt-2">
                        <button 
                          onClick={() => openProjectModal(proj)}
                          className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700/60 hover:bg-zinc-750 text-zinc-300 font-bold text-xs py-2.5 rounded-xl cursor-pointer transition-colors active:scale-95"
                        >
                          <Edit className="w-3.5 h-3.5" /> Sửa
                        </button>
                        <button 
                          onClick={() => toggleProjectStatus(proj)}
                          className={`flex-1 flex items-center justify-center gap-2 border font-bold text-xs py-2.5 rounded-xl cursor-pointer transition-colors active:scale-95 ${
                            proj.status === 'ACTIVE' 
                              ? 'bg-amber-950/40 border-amber-800/60 text-amber-300 hover:bg-amber-950/70'
                              : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-950/70'
                          }`}
                        >
                          {proj.status === 'ACTIVE' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          {proj.status === 'ACTIVE' ? 'Ẩn' : 'Hiện'}
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(proj.id)}
                          className="flex items-center justify-center bg-rose-950/30 border border-rose-900/60 hover:bg-rose-950/70 text-rose-350 w-11 h-10 rounded-xl cursor-pointer transition-colors active:scale-95"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
                <div>
                  <h2 className="text-[20px] font-bold font-['Montserrat'] text-[#ebd5ad] uppercase tracking-wide">Quản lý Người dùng & Hạng VIP</h2>
                  <p className="text-[12px] text-zinc-400 mt-1 font-medium">Bấm vào bất kỳ hội viên để quản lý dòng tiền, số dư và lịch sử thăng hạng</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsVipConfigOpen(true)}
                    className="bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-[#ebd5ad] font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
                  >
                    ⚙️ Cấu hình Hạng VIP
                  </button>

                  {/* Search Bar */}
                  <div className="relative w-full md:w-64">
                    <input 
                      type="text" 
                      placeholder="Tìm tên, SĐT hoặc ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-200 focus:border-[#c29b57] focus:outline-none"
                    />
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-950/70 text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-850">
                        <th className="px-5 py-4">Hội viên</th>
                        <th className="px-5 py-4">Mã Tài khoản</th>
                        <th className="px-5 py-4">VIP Rank</th>
                        <th className="px-5 py-4">Số dư hiện tại</th>
                        <th className="px-5 py-4">Trạng thái</th>
                        <th className="px-5 py-4 text-right">Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 text-xs text-zinc-300 font-medium">
                      {filteredUsers.map(u => {
                        const { calculatedTier } = getUserStats(u);
                        const isBanned = u.isLocked;

                        return (
                          <tr key={u.id} className="hover:bg-zinc-850/20 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#f0e1c9] text-[#8b6b4e] font-extrabold flex items-center justify-center text-sm shrink-0">
                                  {u.avatarImage ? (
                                    <img src={u.avatarImage} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                                  ) : (
                                    u.displayName?.substring(0, 2).toUpperCase() || 'TT'
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-zinc-100 flex items-center gap-1.5">
                                    {u.displayName || 'Khách Hàng'}
                                    {u.role === 'super_admin' && (
                                      <span className="bg-amber-950 text-[#c29b57] text-[8px] font-black px-1.5 py-0.5 rounded border border-amber-900 uppercase">SUPER</span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-zinc-500 mt-0.5">SĐT: {u.phoneNumber || 'Không có'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 font-mono text-[10px] text-zinc-400">
                              {u.id}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                                calculatedTier === 'VVIP' ? 'bg-purple-950/80 border-purple-800 text-purple-300' :
                                calculatedTier === 'VIP' ? 'bg-orange-950/80 border-orange-850 text-orange-350' :
                                calculatedTier === 'GOLD' ? 'bg-amber-950/80 border-amber-850 text-amber-300' :
                                'bg-zinc-800 border-zinc-700 text-zinc-400'
                              }`}>
                                {calculatedTier}
                              </span>
                            </td>
                            <td className="px-5 py-4 font-bold text-zinc-100 text-sm">
                              {(u.balance || 0).toLocaleString('vi-VN')} VNĐ
                            </td>
                            <td className="px-5 py-4">
                              {isBanned ? (
                                <span className="bg-rose-950 text-rose-350 border border-rose-900 text-[8px] font-black px-2 py-0.5 rounded-md uppercase">
                                  Bị khóa (Banned)
                                </span>
                              ) : (
                                <span className="bg-emerald-950 text-emerald-350 border border-emerald-900 text-[8px] font-black px-2 py-0.5 rounded-md uppercase">
                                  Hoạt động
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <button 
                                onClick={() => setSelectedUser(u)}
                                className="bg-[#c29b57] text-black font-extrabold px-3 py-1.5 rounded-lg text-xs cursor-pointer active:scale-95 transition-all"
                              >
                                Xem Chi Tiết &rarr;
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Transaction Approvals Tab */}
          {activeTab === 'approvals' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
                <div>
                  <h2 className="text-[20px] font-bold font-['Montserrat'] text-[#ebd5ad] uppercase tracking-wide">Phê duyệt Nạp & Rút tiền</h2>
                  <p className="text-[12px] text-zinc-400 mt-1 font-medium">Xét duyệt hồ sơ minh chứng hóa đơn nạp và khấu trừ giải ngân rút tiền</p>
                </div>

                {/* Filter Selector */}
                <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl w-fit self-start md:self-auto">
                  <button 
                    onClick={() => setApprovalFilter('all')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${approvalFilter === 'all' ? 'bg-[#c29b57] text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Tất cả ({pendingTransactions.length})
                  </button>
                  <button 
                    onClick={() => setApprovalFilter('deposit')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${approvalFilter === 'deposit' ? 'bg-[#c29b57] text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Yêu cầu Nạp ({pendingTransactions.filter(t => t.type === 'deposit').length})
                  </button>
                  <button 
                    onClick={() => setApprovalFilter('withdraw')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${approvalFilter === 'withdraw' ? 'bg-[#c29b57] text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Yêu cầu Rút ({pendingTransactions.filter(t => t.type === 'withdraw').length})
                  </button>
                </div>
              </div>

              {/* Approvals Table */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-950/70 text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-850">
                        <th className="px-5 py-4">Hội viên</th>
                        <th className="px-5 py-4">Loại giao dịch</th>
                        <th className="px-5 py-4">Số tiền giao dịch</th>
                        <th className="px-5 py-4">Chi tiết / Chứng từ</th>
                        <th className="px-5 py-4">Thời gian</th>
                        <th className="px-5 py-4 text-right">Thao tác duyệt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 text-xs text-zinc-300 font-medium">
                      {filteredApprovals.map(t => (
                        <tr key={t.id} className="hover:bg-zinc-850/20 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-bold text-zinc-100">{t.user?.displayName || 'Không tên'}</div>
                            <div className="text-[10px] text-zinc-500 mt-0.5">SĐT: {t.user?.phoneNumber || 'N/A'}</div>
                          </td>
                          <td className="px-5 py-4">
                            {t.type === 'deposit' ? (
                              <span className="bg-emerald-950 text-emerald-450 border border-emerald-900 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                NẠP TIỀN
                              </span>
                            ) : (
                              <span className="bg-rose-950 text-rose-450 border border-rose-900 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                RÚT TIỀN
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 font-bold text-zinc-100 text-sm">
                            {(t.amount || 0).toLocaleString('vi-VN')} VNĐ
                          </td>
                          <td className="px-5 py-4">
                            {t.type === 'deposit' ? (
                              t.proofImage ? (
                                <button 
                                  onClick={() => setSelectedBillImage(t.proofImage)}
                                  className="text-[#c29b57] hover:underline font-bold flex items-center gap-1.5"
                                >
                                  📄 Xem hóa đơn ảnh
                                </button>
                              ) : (
                                <span className="text-zinc-500">Không có ảnh bill</span>
                              )
                            ) : (
                              t.user?.bankInfo ? (
                                <div className="space-y-0.5 bg-zinc-950 p-2.5 rounded-lg border border-zinc-850 text-[11px] font-mono leading-tight max-w-[220px]">
                                  <div>Ngân hàng: <strong>{t.user.bankInfo.bankName}</strong></div>
                                  <div>Số TK: <strong>{t.user.bankInfo.bankAccount}</strong></div>
                                  <div>Chủ thẻ: <strong>{t.user.bankInfo.cardHolder}</strong></div>
                                </div>
                              ) : (
                                <span className="text-rose-450 font-bold">Chưa liên kết ngân hàng</span>
                              )
                            )}
                          </td>
                          <td className="px-5 py-4 text-zinc-400 font-mono text-[10px]">
                            {t.date}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleApproveTransaction(t.user.id, t.id, t.type, t.amount)}
                                className="bg-emerald-900 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/80 font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" /> Duyệt
                              </button>
                              <button 
                                onClick={() => handleRejectTransaction(t.user.id, t.id, t.type, t.amount)}
                                className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800/80 font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
                              >
                                <X className="w-3.5 h-3.5" /> Từ chối
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredApprovals.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-5 py-12 text-center text-zinc-500 font-bold">
                            🎉 Hoàn thành! Không có yêu cầu nạp/rút tiền nào đang chờ duyệt.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Support CSKH Tab */}
          {activeTab === 'cskh' && (
            <div className="h-[calc(100vh-140px)] flex bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
              
              {/* Chat Threads Sidebar */}
              <div className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-950/30">
                <div className="p-4 border-b border-zinc-800">
                  <h3 className="font-bold text-[#ebd5ad] font-['Montserrat'] tracking-wide uppercase">Kênh hỗ trợ chat</h3>
                  <p className="text-[10px] text-zinc-500 mt-1 uppercase font-semibold">Tất cả cuộc hội thoại</p>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-zinc-850/60">
                  {chatThreads.map(thread => {
                    const { displayName } = getChatUserInfo(thread.conversation_id);
                    const isSelected = selectedThread === thread.conversation_id;
                    const status = threadStatuses[thread.conversation_id] || 'pending';

                    return (
                      <div 
                        key={thread.conversation_id}
                        onClick={() => setSelectedThread(thread.conversation_id)}
                        className={`p-4 cursor-pointer transition-all flex items-center justify-between ${
                          isSelected ? 'bg-[#c29b57]/10 border-l-[3px] border-[#c29b57]' : 'hover:bg-zinc-850/20'
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="font-bold text-zinc-100 flex items-center gap-2">
                            <span className="truncate">{displayName}</span>
                            {thread.unreadCount > 0 && (
                              <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-bounce">
                                {thread.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 truncate mt-1">{thread.lastMessage}</p>
                        </div>
                        
                        {/* Status Tag */}
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded shrink-0 uppercase tracking-widest ${
                          status === 'completed' ? 'bg-emerald-950 text-emerald-450 border border-emerald-900' : 'bg-amber-950 text-amber-450 border border-amber-900'
                        }`}>
                          {status === 'completed' ? 'Đã xong' : 'Xử lý'}
                        </span>
                      </div>
                    );
                  })}
                  {chatThreads.length === 0 && (
                    <div className="p-8 text-center text-zinc-600 text-xs">
                      Không có cuộc trò chuyện nào.
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="flex-1 flex flex-col bg-zinc-900/60">
                {selectedThread ? (
                  <>
                    {/* Header */}
                    <div className="px-6 py-4 bg-zinc-950/40 border-b border-zinc-850 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-zinc-100">{getChatUserInfo(selectedThread).displayName}</h4>
                        <p className="text-[9px] text-zinc-500 font-mono tracking-wider">{selectedThread}</p>
                      </div>
                      
                      {/* Thread Quick info and state action */}
                      <div className="flex items-center gap-3">
                        <div className="text-[11px] text-zinc-400 font-bold border-r border-zinc-800 pr-4 mr-1">
                          Số dư: <strong className="text-[#ebd5ad]">{getChatUserInfo(selectedThread).balance.toLocaleString('vi-VN')} VNĐ</strong>
                          <span className="mx-2 text-zinc-600">|</span>
                          Hạng: <strong className="text-amber-400">{getChatUserInfo(selectedThread).tier}</strong>
                        </div>

                        <button 
                          onClick={() => handleToggleThreadStatus(selectedThread)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                            (threadStatuses[selectedThread] || 'pending') === 'completed'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-850 hover:bg-emerald-900'
                              : 'bg-amber-950 text-amber-300 border-amber-900 hover:bg-amber-900'
                          }`}
                        >
                          Trạng thái: {(threadStatuses[selectedThread] || 'pending') === 'completed' ? 'Đã hoàn thành ✓' : 'Đang xử lý 💬'}
                        </button>
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {threadMessages.map(msg => {
                        const isAdminMsg = msg.sender_role === 'admin';
                        return (
                          <div key={msg.id} className={`flex w-full ${isAdminMsg ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-md flex flex-col gap-1 ${
                              isAdminMsg 
                                ? 'bg-[#c29b57] text-black rounded-tr-sm font-semibold' 
                                : 'bg-zinc-800 text-zinc-100 rounded-tl-sm border border-zinc-700/60'
                            }`}>
                              <p>{msg.content}</p>
                              <span className={`text-[8px] self-end mt-0.5 ${isAdminMsg ? 'text-black/60' : 'text-zinc-500'}`}>
                                {msg.timeFormatted}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Reply Form */}
                    <form onSubmit={handleSendAdminReply} className="p-4 bg-zinc-950/40 border-t border-zinc-850 flex gap-3">
                      <input 
                        type="text"
                        placeholder="Nhập phản hồi hỗ trợ cho hội viên..."
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:border-[#c29b57] focus:outline-none"
                      />
                      <button 
                        type="submit"
                        disabled={!adminReplyText.trim()}
                        className="bg-[#c29b57] disabled:bg-zinc-800 text-black disabled:text-zinc-650 font-bold text-xs px-5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-md"
                      >
                        <Send className="w-4 h-4" />
                        Gửi
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-zinc-550 gap-3">
                    <MessageSquare className="w-12 h-12 text-zinc-750" />
                    <p className="text-xs font-semibold">Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu hỗ trợ</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bill Image Preview Modal */}
      {selectedBillImage && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center p-4 z-[99999] backdrop-blur-md">
          <button 
            onClick={() => setSelectedBillImage(null)}
            className="absolute top-6 right-6 bg-zinc-900 border border-zinc-800 text-zinc-350 p-2.5 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 flex items-center justify-center shadow-2xl">
            <img src={selectedBillImage} alt="Hóa đơn nạp tiền" className="max-w-full max-h-[80vh] object-contain select-none" />
          </div>
          <span className="text-zinc-500 text-xs mt-3 font-semibold uppercase tracking-wider">Hóa đơn xác minh chuyển khoản của hội viên</span>
        </div>
      )}

      {/* VIP config setup limits modal */}
      {isVipConfigOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-4"
          >
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-[#ebd5ad] font-['Montserrat'] text-base uppercase tracking-wider">Cấu hình Hạng Thẻ VIP</h3>
              <button onClick={() => setIsVipConfigOpen(false)} className="text-zinc-450 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVipConfigLimits} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">Hạn mức VÀNG (GOLD) - VNĐ</label>
                <input 
                  type="text"
                  value={goldFormVal}
                  onChange={(e) => setGoldFormVal(new Intl.NumberFormat('vi-VN').format(Number(e.target.value.replace(/\D/g, ''))))}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs text-zinc-205 focus:border-[#c29b57] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">Hạn mức VIP - VNĐ</label>
                <input 
                  type="text"
                  value={vipFormVal}
                  onChange={(e) => setVipFormVal(new Intl.NumberFormat('vi-VN').format(Number(e.target.value.replace(/\D/g, ''))))}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs text-zinc-205 focus:border-[#c29b57] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">Hạn mức VVIP - VNĐ</label>
                <input 
                  type="text"
                  value={vvipFormVal}
                  onChange={(e) => setVvipFormVal(new Intl.NumberFormat('vi-VN').format(Number(e.target.value.replace(/\D/g, ''))))}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs text-zinc-205 focus:border-[#c29b57] focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-zinc-800">
                <button 
                  type="button"
                  onClick={() => setIsVipConfigOpen(false)}
                  className="flex-1 bg-zinc-800 border border-zinc-700 hover:bg-zinc-750 text-zinc-300 font-bold text-xs py-2.5 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#c29b57] to-[#ebd5ad] text-black font-extrabold text-xs py-2.5 rounded-xl cursor-pointer shadow-md"
                >
                  Lưu cấu hình
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* User Details Modal (Complete controls for User & Financial Control) */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-[999] backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl flex flex-col gap-5 my-8"
          >
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#f0e1c9] text-[#8b6b4e] font-black flex items-center justify-center text-lg shadow-inner">
                  {selectedUser.avatarImage ? (
                    <img src={selectedUser.avatarImage} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    selectedUser.displayName?.substring(0, 2).toUpperCase() || 'TT'
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[#ebd5ad] font-['Montserrat'] text-lg flex items-center gap-2">
                    {selectedUser.displayName || 'Khách Hàng'}
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                      getUserStats(selectedUser).calculatedTier === 'VVIP' ? 'bg-purple-950/80 border-purple-800 text-purple-300' :
                      getUserStats(selectedUser).calculatedTier === 'VIP' ? 'bg-orange-950/80 border-orange-850 text-orange-350' :
                      getUserStats(selectedUser).calculatedTier === 'GOLD' ? 'bg-amber-950/80 border-amber-850 text-amber-300' :
                      'bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}>
                      {getUserStats(selectedUser).calculatedTier}
                    </span>
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-medium">SĐT: {selectedUser.phoneNumber || 'Không có'} | ID: {selectedUser.id}</p>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-zinc-450 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Financial Overview stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-850 text-center">
                <div className="text-zinc-450 text-[10px] font-bold uppercase tracking-wider mb-1">Số dư khả dụng</div>
                <div className="text-zinc-100 font-extrabold text-sm truncate">
                  {(selectedUser.balance || 0).toLocaleString('vi-VN')} VNĐ
                </div>
              </div>
              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-850 text-center">
                <div className="text-zinc-450 text-[10px] font-bold uppercase tracking-wider mb-1">Tổng tiền đã nạp</div>
                <div className="text-emerald-450 font-extrabold text-sm truncate">
                  {getUserStats(selectedUser).totalDeposits.toLocaleString('vi-VN')} VNĐ
                </div>
              </div>
              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-850 text-center">
                <div className="text-zinc-450 text-[10px] font-bold uppercase tracking-wider mb-1">Tổng tiền đã rút</div>
                <div className="text-rose-450 font-extrabold text-sm truncate">
                  {getUserStats(selectedUser).totalWithdrawals.toLocaleString('vi-VN')} VNĐ
                </div>
              </div>
            </div>

            {/* Sub-grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1 overflow-hidden">
              
              {/* Left Column: Participating Projects & Actions */}
              <div className="space-y-4 flex flex-col justify-between">
                
                {/* Active Projects */}
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-850 flex-1 flex flex-col justify-between min-h-[160px]">
                  <h4 className="font-bold text-xs text-[#ebd5ad] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Góp vốn tham gia
                  </h4>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {getUserStats(selectedUser).activeInvests.map((inv: any) => (
                      <div key={inv.id} className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-850 text-[11px] flex justify-between items-center gap-2">
                        <div className="truncate font-semibold text-zinc-300">
                          {inv.contractProjectTitle || 'Dự án VinClub'}
                        </div>
                        <span className="text-[#c29b57] font-bold shrink-0">
                          {inv.amount.toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                    ))}
                    {getUserStats(selectedUser).activeInvests.length === 0 && (
                      <p className="text-[11px] text-zinc-650 italic text-center py-6">
                        Chưa tham gia dự án nào.
                      </p>
                    )}
                  </div>
                </div>

                {/* Account operations */}
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-850">
                  <h4 className="font-bold text-xs text-rose-350 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" /> Thao tác quản trị
                  </h4>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => toggleUserLock(selectedUser)}
                      className={`flex-1 flex items-center justify-center gap-2 border font-bold text-xs py-2.5 rounded-xl cursor-pointer transition-all active:scale-95 ${
                        selectedUser.isLocked 
                          ? 'bg-rose-900/30 border-rose-800 text-rose-350 hover:bg-rose-900/60'
                          : 'bg-zinc-800 border-zinc-700/80 text-zinc-300 hover:bg-zinc-750'
                      }`}
                    >
                      {selectedUser.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      {selectedUser.isLocked ? 'Mở Khóa Hội Viên' : 'Khóa Tài Khoản'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Adjust Balance */}
              <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-850 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#ebd5ad] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" /> Điều chỉnh số dư thủ công
                  </h4>
                  <p className="text-[10px] text-zinc-500 mb-3 leading-tight">Cộng thưởng hoặc khấu trừ tài sản tiền mặt để xử lý nghiệp vụ</p>
                  
                  <form onSubmit={handleAdjustBalance} className="space-y-3.5">
                    {/* Action Selector */}
                    <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                      <button 
                        type="button" 
                        onClick={() => setAdjustType('add')}
                        className={`py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${adjustType === 'add' ? 'bg-emerald-900 text-emerald-100 font-extrabold shadow' : 'text-zinc-500 hover:text-zinc-350'}`}
                      >
                        ➕ Cộng tiền
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setAdjustType('subtract')}
                        className={`py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${adjustType === 'subtract' ? 'bg-rose-950 text-rose-200 font-extrabold shadow' : 'text-zinc-500 hover:text-zinc-350'}`}
                      >
                        ➖ Trừ tiền
                      </button>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 mb-1 uppercase tracking-wider">Số tiền (VNĐ)</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Nhập số tiền..."
                          value={adjustAmount ? new Intl.NumberFormat('vi-VN').format(Number(adjustAmount.replace(/\D/g, ''))) : ''}
                          onChange={(e) => setAdjustAmount(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-bold text-zinc-100 focus:outline-none"
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-500 font-bold">VNĐ</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 mb-1 uppercase tracking-wider">Lý do điều chỉnh</label>
                      <textarea 
                        rows={2}
                        value={adjustNote}
                        onChange={(e) => setAdjustNote(e.target.value)}
                        placeholder="Nhập lý do cộng/trừ số dư..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                        required
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#c29b57] text-black font-black text-xs py-2.5 rounded-xl cursor-pointer hover:bg-[#ebd5ad] active:scale-95 transition-all shadow-md"
                    >
                      Xác Nhận Thực Hiện
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
