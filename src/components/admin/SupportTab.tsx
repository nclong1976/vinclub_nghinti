import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, MessageSquare, Shield, HelpCircle, User, History, CheckCircle, 
  Image as ImageIcon, Paperclip, Terminal, Star, ArrowRight, Search, 
  Activity, Award, FileText, UserCheck, ShieldCheck, Trash2, Copy, Check, Loader2, Plus
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';

interface SupportTabProps {
  allUsers: any[];
  selectedChatUser: any | null;
  setSelectedChatUser: (user: any) => void;
  adminChatMessages: any[];
  adminChatText: string;
  setAdminChatText: (text: string) => void;
  handleSendAdminMessage: () => Promise<void>;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function SupportTab({
  allUsers,
  selectedChatUser,
  setSelectedChatUser,
  adminChatMessages,
  adminChatText,
  setAdminChatText,
  handleSendAdminMessage,
  chatEndRef,
}: SupportTabProps) {

  const [searchQuery, setSearchQuery] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);

  // Media Vault States
  const [showMediaVault, setShowMediaVault] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Real-time listen to media vault storage
  useEffect(() => {
    const q = query(collection(db, 'media_vault'), orderBy('uploadedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const files: any[] = [];
      snap.forEach(d => {
        files.push({ id: d.id, ...d.data() });
      });
      setMediaFiles(files);
    }, (error) => {
      console.error("Error loading media files from Firestore:", error);
    });
    return () => unsub();
  }, []);

  // File size formatting helper
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = 1;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Upload handler converting to Base64
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Chỉ hỗ trợ tải lên tệp tin định dạng ảnh!');
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      alert('Để tối ưu hiệu năng lưu trữ, vui lòng tải ảnh dưới 1.5 MB!');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Url = event.target?.result as string;
      if (!base64Url) {
        setUploading(false);
        return;
      }

      try {
        await addDoc(collection(db, 'media_vault'), {
          name: file.name,
          url: base64Url,
          size: file.size,
          type: file.type,
          uploadedAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Error uploading to media vault:", err);
        alert("Lỗi tải tệp lên Kho Lưu Trữ.");
      } finally {
        setUploading(false);
        // Reset the file input
        e.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  // Delete media handler
  const handleDeleteMedia = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tệp này khỏi Kho Lưu Trữ không?')) return;
    try {
      await deleteDoc(doc(db, 'media_vault', id));
    } catch (err) {
      console.error("Error deleting file:", err);
      alert("Lỗi khi xóa tệp.");
    }
  };

  // Copy link handler
  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Send image to chat handler
  const handleSendImageToChat = async (imageUrl: string) => {
    if (!selectedChatUser) return;
    try {
      await addDoc(collection(db, 'chat_messages'), {
        conversation_id: selectedChatUser.id,
        sender_email: 'admin',
        sender_role: 'admin',
        content: imageUrl,
        is_read: false,
        createdAt: serverTimestamp()
      });
      setShowMediaVault(false);
    } catch (e) {
      console.error("Error sending image message:", e);
    }
  };

  // Filter out admin, system, and profile IDs
  const chatUsers = allUsers.filter(u => u.id !== 'admin' && u.id !== 'profile');

  // Filter users based on search
  const filteredUsers = chatUsers.filter(u => {
    const name = (u.displayName || '').toLowerCase();
    const phone = (u.phoneNumber || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const id = u.id.toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || phone.includes(query) || email.includes(query) || id.includes(query);
  });

  // Automatically trigger a subtle typing indicator effect when the user selects a new chat
  useEffect(() => {
    if (selectedChatUser) {
      setTypingIndicator(true);
      const timer = setTimeout(() => {
        setTypingIndicator(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedChatUser]);

  // Handle Enter key on chat text
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (adminChatText.trim()) {
        handleSendAdminMessage();
      }
    }
  };

  // Helper: Get formatted display balance
  const formatBalance = (bal?: number) => {
    const val = bal || 0;
    if (val >= 1_000_000_000) {
      return `$${(val / 24000000000).toFixed(2)}M USD (${(val / 1_000_000_000).toFixed(1)} Tỷđ)`;
    } else if (val >= 1_000_000) {
      return `${(val / 1_000_000).toFixed(0)} Triệuđ`;
    }
    return `${val.toLocaleString('vi-VN')} đ`;
  };

  // Helper: Get user VIP rank
  const getUserRank = (u: any) => {
    const bal = u.balance || 0;
    if (bal >= 5_000_000_000) return { title: 'VIP DIAMOND', color: 'text-[#ecbe8e] bg-[#ecbe8e]/10 border-[#ecbe8e]/20' };
    if (bal >= 1_000_000_000) return { title: 'PLATINUM VIP', color: 'text-[#abc7ff] bg-[#abc7ff]/10 border-[#abc7ff]/20' };
    return { title: 'STANDARD MEMBER', color: 'text-zinc-400 bg-zinc-800/40 border-zinc-700/30' };
  };

  // Dynamic Trust Score
  const getTrustScore = (u: any) => {
    const hasCccd = !!u.cccd;
    const hasPhone = !!u.phoneNumber;
    const hasEmail = !!u.email;
    const score = (hasCccd ? 40 : 0) + (hasPhone ? 30 : 0) + (hasEmail ? 20 : 0) + 10;
    return score;
  };

  // Unsplash images mapped for beautiful user dossier mockups
  const userImages: { [key: string]: string } = {
    'Nguyễn Hoàng Nam': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    'Trần Duy Thái': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    'Lê Thùy Dương': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    'Phạm Minh Tuấn': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  };

  const getAvatarUrl = (displayName: string) => {
    return userImages[displayName] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
  };

  return (
    <div className="bg-[#1a1b21] border border-[#4f453b]/40 rounded-xl overflow-hidden h-[680px] flex flex-col xl:flex-row animate-in fade-in duration-300">
      
      {/* 1. LEFT COLUMN: ACTIVE CHATS DIRECTORY */}
      <div className="w-full xl:w-80 border-b xl:border-b-0 xl:border-r border-[#4f453b]/20 flex flex-col bg-[#111318]/50 shrink-0">
        
        {/* Directory Header with Pulse */}
        <div className="p-4 border-b border-[#4f453b]/15 bg-[#111318]/70 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#ecbe8e] animate-pulse" />
            <h4 className="font-heading text-xs font-black uppercase tracking-wider text-white">
              Hỗ Trợ Trực Tuyến
            </h4>
          </div>
          <span className="text-[9px] font-black tracking-widest text-[#34d399] bg-[#34d399]/10 border border-[#34d399]/20 px-2 py-0.5 rounded-full uppercase">
            {filteredUsers.length} LIVE
          </span>
        </div>

        {/* Directory Search */}
        <div className="p-3 border-b border-[#4f453b]/10 bg-[#111318]/20">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Tìm kiếm phiên hỗ trợ..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-[#4f453b]/20 rounded-lg py-1.5 pl-9 pr-3 text-[11px] font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecbe8e]/50 transition-colors"
            />
          </div>
        </div>

        {/* List Scroll */}
        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[#4f453b]/10">
          {filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-600 italic">Không có người dùng nào trực tuyến.</div>
          ) : (
            filteredUsers.map(u => {
              const isSelected = selectedChatUser?.id === u.id;
              const rank = getUserRank(u);
              
              return (
                <div 
                  key={u.id}
                  onClick={() => setSelectedChatUser(u)}
                  className={`p-4 transition-all duration-200 cursor-pointer relative ${
                    isSelected 
                      ? 'bg-[#ecbe8e]/10 border-l-4 border-[#ecbe8e]' 
                      : 'hover:bg-white/[0.01]'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="relative shrink-0">
                      <img 
                        src={getAvatarUrl(u.displayName || '')} 
                        alt={u.displayName || 'User'} 
                        className="w-10 h-10 rounded-lg object-cover border border-[#4f453b]/20"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#34d399] border-2 border-[#111318] rounded-full"></span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-heading text-xs font-bold text-white truncate max-w-[120px]">
                          {u.displayName || 'Vô Danh'}
                        </p>
                        <span className="text-[8px] font-mono text-zinc-500">2 phút trước</span>
                      </div>
                      
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5 font-medium">
                        {u.cccd ? `Yêu cầu KYC từ thẻ ID: ${u.cccd}` : 'Yêu cầu tư vấn danh mục đầu tư'}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest ${rank.color}`}>
                          {rank.title}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. CENTER COLUMN: TACTICAL CHAT WORKSPACE */}
      <div className="flex-1 flex flex-col bg-[#111318]/10 justify-between min-w-0">
        {selectedChatUser ? (
          <>
            {/* Chat Workspace Header */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-[#4f453b]/15 bg-[#111318]/40 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#34d399] animate-pulse"></div>
                <div>
                  <h3 className="font-heading text-xs font-black uppercase tracking-wider text-white">
                    Phòng Truyền Tin #{selectedChatUser.id.substring(0, 4).toUpperCase()}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                    Đang kết nối: {selectedChatUser.displayName || 'Người dùng'} (Nhà Đầu Tư)
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowMediaVault(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#ecbe8e]/40 hover:bg-[#ecbe8e]/10 text-[#ecbe8e] rounded text-[10px] font-black uppercase tracking-wider transition-all"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  KHO MEDIA
                </button>
                <button 
                  onClick={() => setShowHistoryModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#4f453b]/30 rounded text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:border-[#ecbe8e]/40 transition-colors"
                >
                  <History className="w-3.5 h-3.5" />
                  Lịch sử
                </button>
                <button 
                  onClick={() => setSelectedChatUser(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ecbe8e] hover:bg-[#ecbe8e]/80 text-[#000D1A] font-bold text-[10px] rounded uppercase tracking-wider transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Hoàn thành
                </button>
              </div>
            </div>

            {/* Chat Feed Messages area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar bg-[#0c0e13]/25">
              
              {/* Top Security notification banner */}
              <div className="flex justify-center">
                <span className="bg-zinc-900/60 border border-[#4f453b]/10 px-4 py-1.5 rounded-full text-[8px] font-mono text-zinc-500 tracking-wider uppercase">
                  Kết nối bảo mật mã hóa 256-bit AES thiết lập thành công
                </span>
              </div>

              {/* Messages Mapping */}
              {adminChatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
                  <MessageSquare className="w-12 h-12 opacity-20 text-[#ecbe8e]" />
                  <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                    Gõ tin nhắn để bắt đầu truyền tin
                  </p>
                </div>
              ) : (
                adminChatMessages.map((msg, index) => {
                  const isAdmin = msg.sender_role === 'admin' || msg.sender_email === 'admin';
                  return (
                    <div 
                      key={msg.id || index} 
                      className={`flex gap-3 max-w-[85%] ${isAdmin ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                    >
                      {/* Avatar */}
                      <div className="shrink-0">
                        {isAdmin ? (
                          <div className="w-8 h-8 rounded-lg bg-[#ecbe8e] flex items-center justify-center text-[#000D1A] font-black text-xs">
                            AD
                          </div>
                        ) : (
                          <img 
                            src={getAvatarUrl(selectedChatUser.displayName || '')} 
                            alt="User" 
                            className="w-8 h-8 rounded-lg object-cover border border-[#4f453b]/20"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>

                      {/* Content Box */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className={`text-[9px] font-black uppercase tracking-wider ${isAdmin ? 'text-[#ecbe8e] text-right w-full block' : 'text-zinc-500'}`}>
                            {isAdmin ? 'Quản trị viên Aegis' : (selectedChatUser.displayName || 'Nhà đầu tư')}
                          </p>
                        </div>
                        
                        <div className={`rounded-xl text-xs font-semibold leading-relaxed ${
                          isAdmin ? 'rounded-tr-none' : 'rounded-tl-none'
                        } ${
                          msg.content && (msg.content.startsWith('data:image/') || msg.content.match(/\.(jpeg|jpg|gif|png|webp)/i))
                            ? 'p-1 bg-[#1a1b21]/40 border border-[#4f453b]/20 overflow-hidden'
                            : `p-4 border ${isAdmin ? 'bg-[#ecbe8e]/10 border-[#ecbe8e]/30 text-white' : 'bg-[#1a1b21]/90 border-[#4f453b]/25 text-zinc-300 shadow-sm'}`
                        }`}>
                          {msg.content && (msg.content.startsWith('data:image/') || msg.content.match(/\.(jpeg|jpg|gif|png|webp)/i)) ? (
                            <div className="space-y-1">
                              <img 
                                src={msg.content} 
                                alt="Shared Media" 
                                className="max-w-xs max-h-56 object-cover rounded-lg hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
                                onClick={() => window.open(msg.content, '_blank')}
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ) : (
                            msg.content
                          )}
                        </div>
                        
                        <p className={`text-[8px] font-mono text-zinc-500 ${isAdmin ? 'text-right' : 'text-left'}`}>
                          {msg.timeFormatted || 'Vừa xong'}
                        </p>
                      </div>

                    </div>
                  );
                })
              )}

              {/* Dynamic typing indicator */}
              {typingIndicator && (
                <div className="flex gap-2 ml-10 items-center bg-[#1a1b21]/60 px-3 py-2 rounded-full border border-zinc-900 w-16">
                  <div className="w-1.5 h-1.5 bg-[#ecbe8e] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#ecbe8e] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-[#ecbe8e] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Premium Tactical Input bar */}
            <div className="p-4 border-t border-[#4f453b]/20 bg-[#1a1b21]/90 shrink-0">
              <div className="max-w-4xl mx-auto flex items-end gap-2.5 bg-[#111318]/80 p-2.5 rounded-xl border border-[#4f453b]/30 focus-within:border-[#ecbe8e]/60 transition-all duration-300">
                <button 
                  onClick={() => setShowMediaVault(true)}
                  className="p-2 text-[#ecbe8e] hover:bg-[#ecbe8e]/10 rounded-lg transition-colors flex items-center justify-center"
                  title="Thêm ảnh chụp hỗ trợ"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={() => setShowMediaVault(true)}
                  className="p-2 text-zinc-500 hover:bg-zinc-800 rounded-lg transition-colors flex items-center justify-center"
                  title="Đính kèm tài liệu hỗ trợ"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <textarea 
                  value={adminChatText}
                  onChange={e => setAdminChatText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập nội dung phản hồi chiến lược..." 
                  rows={1}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-semibold text-white placeholder-zinc-500 resize-none py-2 custom-scrollbar focus:outline-none"
                />

                <button 
                  onClick={handleSendAdminMessage}
                  disabled={!adminChatText.trim()}
                  className="w-10 h-10 flex items-center justify-center bg-[#ecbe8e] text-[#000D1A] rounded-lg hover:shadow-[0_0_15px_rgba(236,190,142,0.3)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-between items-center mt-2 px-2 max-w-4xl mx-auto">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                  <Terminal className="w-3.5 h-3.5 text-[#ecbe8e]" />
                  Bấm Enter để gửi
                </div>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                  Bản ghi mật được bảo vệ bởi Aegis Security Protocol
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
            <HelpCircle className="w-12 h-12 opacity-20 text-[#ecbe8e]" />
            <div className="text-center space-y-1">
              <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                Vui lòng chọn một phiên hỗ trợ từ cột danh sách bên trái
              </p>
              <p className="text-[9px] text-zinc-600 uppercase font-semibold">hoặc quản lý tài nguyên lưu trữ đa phương tiện</p>
            </div>
            <button 
              onClick={() => setShowMediaVault(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[#4f453b]/30 rounded text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-[#ecbe8e] hover:border-[#ecbe8e]/60 transition-all bg-[#111318]/40"
            >
              <ImageIcon className="w-4 h-4 text-[#ecbe8e]" />
              MỞ KHO MEDIA AN NINH
            </button>
          </div>
        )}
      </div>

      {/* 3. RIGHT COLUMN: INVESTOR DOSSIER STATS PANEL */}
      {selectedChatUser && (
        <aside className="w-full xl:w-72 border-t xl:border-t-0 xl:border-l border-[#4f453b]/20 bg-[#111318]/70 flex flex-col p-5 shrink-0 z-10 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            
            {/* Dossier Header */}
            <div className="border-b border-[#4f453b]/15 pb-4">
              <h4 className="font-heading text-[10px] font-black text-[#ecbe8e] uppercase tracking-widest mb-3">
                Chi Tiết Nhà Đầu Tư
              </h4>
              <div className="relative rounded-xl overflow-hidden border border-[#4f453b]/20 mb-3">
                <img 
                  src={getAvatarUrl(selectedChatUser.displayName || '')} 
                  alt="Dossier avatar" 
                  className="w-full h-40 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111318] to-transparent"></div>
              </div>
              <h3 className="font-heading text-sm font-black text-white">
                {selectedChatUser.displayName || 'Vô Danh'}
              </h3>
              <p className="text-[9px] text-zinc-500 font-mono mt-0.5">
                ID Tài khoản: {selectedChatUser.id}
              </p>
            </div>

            {/* Dossier Metrics */}
            <div className="space-y-3.5">
              
              <div className="bg-[#1a1b21] border border-[#4f453b]/15 p-3 rounded-lg">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Tổng Tài Sản Quản Lý (AUM)
                </span>
                <p className="font-heading text-sm font-black text-[#ecbe8e] mt-1">
                  {formatBalance(selectedChatUser.balance)}
                </p>
              </div>

              {/* Dynamic Trust Score Progress Bar */}
              <div className="bg-[#1a1b21] border border-[#4f453b]/15 p-3 rounded-lg">
                <div className="flex justify-between items-center text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                  <span>Điểm Tin Cậy</span>
                  <span className="text-[#34d399]">{getTrustScore(selectedChatUser)} / 100</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-2 border border-zinc-800">
                  <div 
                    className="h-full bg-[#34d399] rounded-full transition-all duration-500"
                    style={{ width: `${getTrustScore(selectedChatUser)}%` }}
                  ></div>
                </div>
              </div>

              {/* Key Notes */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Ghi chú quan trọng
                </span>
                <div className="bg-[#111318]/50 border border-[#4f453b]/10 rounded-lg p-3 space-y-2 text-[11px] font-semibold text-zinc-400 leading-relaxed">
                  <div className="flex gap-2 items-start">
                    <Star className="w-3.5 h-3.5 text-[#ecbe8e] shrink-0 mt-0.5" />
                    <span>Ưu tiên tư vấn các siêu dự án nghỉ dưỡng Vinpearl.</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Star className="w-3.5 h-3.5 text-[#ecbe8e] shrink-0 mt-0.5" />
                    <span>Hệ thống ghi nhận tài khoản đã KYC thẻ CCCD thành công.</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Dossier Quick actions */}
            <div className="space-y-2 border-t border-[#4f453b]/10 pt-4 mt-4">
              <button className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-[#4f453b]/35 hover:border-[#ecbe8e]/30 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-all">
                Xem Hồ Sơ Đầy Đủ
              </button>
              <button className="w-full py-2.5 bg-zinc-800/40 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors">
                Chuyển Giao Hỗ Trợ
              </button>
            </div>

          </div>
        </aside>
      )}

      {/* 4. HISTORY MODAL OVERLAY */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#1a1b21] border border-[#4f453b]/40 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[#4f453b]/15 pb-3">
              <h4 className="font-heading text-xs font-black text-white uppercase tracking-wider">
                Lịch Sử Hội Thoại Gần Đây
              </h4>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="text-zinc-500 hover:text-white text-xs font-bold"
              >
                Đóng
              </button>
            </div>
            <div className="space-y-2 text-[11px] font-semibold text-zinc-400">
              <p>Hệ thống hỗ trợ tự động ghi nhận nhật ký hỗ trợ:</p>
              <div className="bg-zinc-950 p-3.5 rounded border border-[#4f453b]/10 space-y-2 text-[10px] font-mono leading-relaxed text-zinc-500">
                <div>[14:30] Khởi tạo kết nối phiên mới</div>
                <div>[14:32] Khách hàng yêu cầu tư vấn lãi suất Vinpearl Harbour</div>
                <div>[14:35] Admin cung cấp bảng cập nhật chiết khấu</div>
                <div>[14:36] Khách hàng đồng ý nâng hạn mức thành công</div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-[#ecbe8e] text-[#000D1A] font-bold text-[10px] uppercase rounded tracking-wider"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. AEGIS COMMAND MEDIA VAULT MODAL */}
      {showMediaVault && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#1a1b21] border border-[#ecbe8e]/30 rounded-xl max-w-4xl w-full h-[580px] overflow-hidden shadow-2xl flex flex-col text-[#e2e2e9]">
            
            {/* Header */}
            <div className="px-6 py-4 bg-[#111318] border-b border-[#4f453b]/20 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-[#ecbe8e]/10 border border-[#ecbe8e]/30 rounded text-[#ecbe8e]">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-xs font-black uppercase tracking-wider text-white">AEGIS TACTICAL MEDIA VAULT</h3>
                  <p className="text-[9px] text-zinc-500 font-mono">BẢO MẬT CẤP ĐỘ 5 • HỆ THỐNG LƯU TRỮ ĐA PHƯƠNG TIỆN</p>
                </div>
              </div>
              <button 
                onClick={() => setShowMediaVault(false)}
                className="text-zinc-500 hover:text-white transition-colors p-1"
                title="Đóng kho lưu trữ"
              >
                <HelpCircle className="w-5 h-5 rotate-45" />
              </button>
            </div>

            {/* Main Area divided into left uploader and right gallery */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* Left Zone: Drag & Drop Uploader */}
              <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#4f453b]/20 p-5 flex flex-col justify-between bg-[#111318]/40 shrink-0">
                <div className="space-y-4">
                  <span className="text-[10px] font-black tracking-widest text-[#ecbe8e] uppercase block">Tải Lên File Mới</span>
                  <p className="text-[11px] font-medium text-zinc-500 leading-relaxed">
                    Tải ảnh lên hệ thống bảo mật Aegis. Ảnh sau khi tải lên sẽ được lưu trữ đám mây và sẵn sàng để nhúng vào tin nhắn hỗ trợ hoặc các bài viết tin tức.
                  </p>
                  
                  {/* Upload box */}
                  <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-[#4f453b]/30 rounded-xl cursor-pointer hover:border-[#ecbe8e]/50 hover:bg-[#ecbe8e]/5 transition-all relative group p-4 text-center">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      disabled={uploading}
                    />
                    
                    {uploading ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-8 h-8 text-[#ecbe8e] animate-spin" />
                        <span className="text-[10px] font-bold text-[#ecbe8e] uppercase tracking-wider">Đang mã hóa & lưu trữ...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Plus className="w-8 h-8 text-[#ecbe8e]/60 group-hover:text-[#ecbe8e] group-hover:scale-110 transition-all" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Chọn File Ảnh</span>
                        <span className="text-[9px] font-mono text-zinc-500">Chấp nhận PNG, JPG, WEBP (Tối đa 1.5MB)</span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider space-y-1 bg-zinc-950 p-3 rounded-lg border border-[#4f453b]/10 mt-4 md:mt-0">
                  <div className="flex justify-between">
                    <span>Tổng dung lượng:</span>
                    <span className="font-mono text-zinc-400">Vô hạn</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tổng số tệp:</span>
                    <span className="font-mono text-[#ecbe8e] font-black">{mediaFiles.length} tệp</span>
                  </div>
                </div>
              </div>

              {/* Right Zone: Media Gallery Catalog */}
              <div className="flex-1 p-5 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-4 shrink-0">
                  <span className="text-[10px] font-black tracking-widest text-[#ecbe8e] uppercase">Bộ Sưu Tập Tài Nguyên</span>
                  <span className="text-[9px] text-zinc-500 font-mono uppercase">Click ảnh để xem kích thước đầy đủ</span>
                </div>

                {/* Media grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                  {mediaFiles.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-2.5 py-12">
                      <FileText className="w-10 h-10 opacity-20 text-[#ecbe8e]" />
                      <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 text-center">
                        Kho lưu trữ trống • Hãy tải ảnh đầu tiên của bạn lên
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {mediaFiles.map((file) => (
                        <div 
                          key={file.id} 
                          className="bg-[#111318]/60 border border-[#4f453b]/15 rounded-xl overflow-hidden group hover:border-[#ecbe8e]/50 transition-all flex flex-col justify-between"
                        >
                          {/* Image preview area */}
                          <div className="relative h-28 bg-[#0c0e12] flex items-center justify-center overflow-hidden">
                            <img 
                              src={file.url} 
                              alt={file.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Overlay quick action on hover */}
                            <div className="absolute inset-0 bg-[#0c0e12]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                              {selectedChatUser && (
                                <button 
                                  onClick={() => handleSendImageToChat(file.url)}
                                  className="w-full py-1 bg-[#ecbe8e] text-[#000D1A] rounded text-[9px] font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
                                >
                                  Gửi vào Chat
                                </button>
                              )}
                              <button 
                                onClick={() => handleCopyLink(file.url, file.id)}
                                className="w-full py-1 bg-[#1a1b21] hover:bg-[#1a1b21]/80 text-white rounded text-[9px] font-black uppercase tracking-wider border border-[#ecbe8e]/20 hover:border-[#ecbe8e]/40 transition-colors flex items-center justify-center gap-1"
                              >
                                {copiedId === file.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-[#34d399]" />
                                    Đã sao chép
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-[#ecbe8e]" />
                                    Copy Link
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* File info footer */}
                          <div className="p-2.5 bg-[#111318] border-t border-[#4f453b]/10 space-y-1">
                            <p className="text-[10px] font-bold text-white truncate" title={file.name}>
                              {file.name}
                            </p>
                            <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 uppercase">
                              <span>{formatFileSize(file.size)}</span>
                              <button 
                                onClick={() => handleDeleteMedia(file.id)}
                                className="text-zinc-600 hover:text-[#f43f5e] transition-colors p-0.5 rounded"
                                title="Xóa ảnh"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
