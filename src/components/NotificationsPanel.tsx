import { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Notification } from '../types';
import { useUser } from './UserContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCheck, 
  Sparkles, 
  Award, 
  Megaphone, 
  Gift, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Bell,
  Inbox
} from 'lucide-react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export default function NotificationsPanel({ isOpen, onClose, onUnreadCountChange }: NotificationsPanelProps) {
  const { userId } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'privilege' | 'event' | 'promotion'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Active user key for localStorage
  const userKey = useMemo(() => userId || 'guest', [userId]);

  // Load read notification IDs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`read-notifications-${userKey}`);
    if (saved) {
      try {
        setReadIds(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing read notification IDs", e);
      }
    } else {
      setReadIds([]);
    }
  }, [userKey]);

  // Sync real-time notifications from Firestore
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Notification[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title || '',
          content: data.content || '',
          type: data.type || 'system',
          date: data.date || '',
          createdAt: data.createdAt || Date.now(),
        });
      });
      setNotifications(items);
      setLoading(false);
    }, (error) => {
      console.error("Error subscribing to notifications:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !readIds.includes(n.id)).length;
  }, [notifications, readIds]);

  // Expose unread count to parent component
  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  // Mark a single notification as read
  const handleMarkAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      localStorage.setItem(`read-notifications-${userKey}`, JSON.stringify(updated));
    }
    // Toggle expand
    setExpandedId(expandedId === id ? null : id);
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(allIds);
    localStorage.setItem(`read-notifications-${userKey}`, JSON.stringify(allIds));
  };

  // Filter notifications by active tab
  const filteredNotifications = useMemo(() => {
    if (activeTab === 'all') return notifications;
    if (activeTab === 'privilege') {
      return notifications.filter(n => n.type === 'privilege');
    }
    if (activeTab === 'event') {
      return notifications.filter(n => n.type === 'event' || n.type === 'news');
    }
    if (activeTab === 'promotion') {
      return notifications.filter(n => n.type === 'promotion');
    }
    return notifications;
  }, [notifications, activeTab]);

  // Helper to get type-specific badge, styling & icon
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'privilege':
        return {
          icon: <Award className="w-4 h-4 text-[#c29b57]" />,
          bg: 'bg-[#c29b57]/10',
          border: 'border-[#c29b57]/30',
          label: 'Đặc quyền',
          textColor: 'text-[#c29b57]'
        };
      case 'event':
      case 'news':
        return {
          icon: <Megaphone className="w-4 h-4 text-emerald-400" />,
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          label: 'Sự kiện',
          textColor: 'text-emerald-400'
        };
      case 'promotion':
        return {
          icon: <Gift className="w-4 h-4 text-amber-500" />,
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          label: 'Ưu đãi',
          textColor: 'text-amber-500'
        };
      default:
        return {
          icon: <Sparkles className="w-4 h-4 text-zinc-400" />,
          bg: 'bg-zinc-800',
          border: 'border-zinc-700',
          label: 'Thông báo',
          textColor: 'text-zinc-400'
        };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark overlay backdrop */}
          <motion.div
            id="notifications-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Notifications Drawer */}
          <motion.div
            id="notifications-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800/80 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header section */}
            <div className="p-6 border-b border-zinc-900 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#c29b57]/10 border border-[#c29b57]/20">
                    <Bell className="w-5 h-5 text-[#c29b57]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black tracking-widest text-[#ebd5ad] uppercase font-mono">
                      HỘP THƯ THÔNG BÁO
                    </h2>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {unreadCount > 0 
                        ? `Bạn có ${unreadCount} tin nhắn chưa đọc` 
                        : 'Không có thông báo mới'}
                    </p>
                  </div>
                </div>

                <button 
                  id="close-notifications-btn"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full border border-zinc-800/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Header Actions */}
              {unreadCount > 0 && (
                <div className="flex justify-end mt-1">
                  <button
                    id="mark-all-read-btn"
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-[#c29b57] hover:text-[#ebd5ad] transition-colors cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Đánh dấu đã đọc tất cả
                  </button>
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="px-6 py-2 border-b border-zinc-900 flex gap-2 overflow-x-auto scrollbar-none">
              <button
                id="tab-all"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  activeTab === 'all' 
                    ? 'bg-[#c29b57]/10 text-[#ebd5ad] border border-[#c29b57]/30' 
                    : 'text-zinc-400 hover:text-zinc-200 bg-transparent border border-transparent'
                }`}
              >
                Tất cả ({notifications.length})
              </button>
              <button
                id="tab-privilege"
                onClick={() => setActiveTab('privilege')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  activeTab === 'privilege' 
                    ? 'bg-[#c29b57]/10 text-[#ebd5ad] border border-[#c29b57]/30' 
                    : 'text-zinc-400 hover:text-zinc-200 bg-transparent border border-transparent'
                }`}
              >
                Đặc quyền
              </button>
              <button
                id="tab-event"
                onClick={() => setActiveTab('event')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  activeTab === 'event' 
                    ? 'bg-[#c29b57]/10 text-[#ebd5ad] border border-[#c29b57]/30' 
                    : 'text-zinc-400 hover:text-zinc-200 bg-transparent border border-transparent'
                }`}
              >
                Sự kiện
              </button>
              <button
                id="tab-promotion"
                onClick={() => setActiveTab('promotion')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  activeTab === 'promotion' 
                    ? 'bg-[#c29b57]/10 text-[#ebd5ad] border border-[#c29b57]/30' 
                    : 'text-zinc-400 hover:text-zinc-200 bg-transparent border border-transparent'
                }`}
              >
                Ưu đãi
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
                  <div className="w-6 h-6 border-2 border-[#c29b57]/30 border-t-[#c29b57] rounded-full animate-spin" />
                  <p className="text-xs">Đang tải hộp thư...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900/60 border border-zinc-800/40 flex items-center justify-center text-zinc-600 mb-4 shadow-inner">
                    <Inbox className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-300">Hộp thư trống</h3>
                  <p className="text-xs text-zinc-500 max-w-[240px] mt-1 leading-relaxed">
                    Bạn hiện không có thông báo nào trong phân mục này.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const isRead = readIds.includes(notif.id);
                  const isExpanded = expandedId === notif.id;
                  const styles = getTypeStyles(notif.type);

                  return (
                    <motion.div
                      key={notif.id}
                      id={`notif-card-${notif.id}`}
                      layout
                      className={`group border rounded-xl transition-all overflow-hidden ${
                        isRead 
                          ? 'bg-zinc-950/40 border-zinc-900/60 hover:bg-zinc-900/10' 
                          : 'bg-gradient-to-r from-[#c29b57]/5 to-transparent border-[#c29b57]/20 hover:from-[#c29b57]/10'
                      }`}
                    >
                      {/* Card Header clickable area */}
                      <div
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="p-4 cursor-pointer flex gap-3.5 items-start select-none"
                      >
                        {/* Type Icon Badge */}
                        <div className={`p-2 rounded-xl border ${styles.bg} ${styles.border} shrink-0 mt-0.5 transition-transform group-hover:scale-105`}>
                          {styles.icon}
                        </div>

                        {/* Title and Date */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${styles.bg} ${styles.textColor} border ${styles.border}`}>
                              {styles.label}
                            </span>
                            {!isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#c29b57] animate-pulse" />
                            )}
                          </div>

                          <h4 className={`text-xs font-semibold leading-relaxed transition-colors ${
                            isRead 
                              ? 'text-zinc-300 group-hover:text-white' 
                              : 'text-[#ebd5ad] group-hover:text-[#fff0d6]'
                          }`}>
                            {notif.title}
                          </h4>

                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{notif.date}</span>
                          </div>
                        </div>

                        {/* Expand Icon */}
                        <div className="text-zinc-600 group-hover:text-zinc-400 p-0.5 mt-1 shrink-0">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>

                      {/* Expandable Content Body */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                          >
                            <div className="px-4 pb-4 pt-1 border-t border-zinc-900/80 bg-zinc-950/60">
                              <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line text-justify pr-2">
                                {notif.content}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer view */}
            <div className="p-4 border-t border-zinc-900 bg-zinc-950 flex justify-center">
              <button
                id="close-notifications-bottom-btn"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/20 hover:bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer text-center"
              >
                Đóng hộp thư
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
