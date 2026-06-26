import React, { useState, useEffect } from 'react';
import { 
  Search, Pin, Trash2, Plus, Sparkles, Check, FolderSync, 
  Cloud, CloudLightning, RefreshCw, LogOut, FileText, 
  Palette, Tag, X, Edit3, CheckSquare, Square, Save, ExternalLink, UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser, KeepNote } from './UserContext';
import { initAuth, googleSignIn, logout } from './GoogleDriveSync';
import { User } from 'firebase/auth';

const NOTE_COLORS = [
  { name: 'Mặc định', class: 'bg-[#18181b] border-zinc-800 text-zinc-100', dot: 'bg-zinc-700' },
  { name: 'Vàng Hoàng Kim', class: 'bg-[#2e2612] border-yellow-700/50 text-yellow-100', dot: 'bg-yellow-500' },
  { name: 'Xanh Ngọc', class: 'bg-[#0f2c24] border-emerald-700/50 text-emerald-100', dot: 'bg-emerald-500' },
  { name: 'Xanh Biển', class: 'bg-[#0f2038] border-blue-700/50 text-blue-100', dot: 'bg-blue-500' },
  { name: 'Hồng Đỏ', class: 'bg-[#2d121c] border-rose-700/50 text-rose-100', dot: 'bg-rose-500' },
  { name: 'Tím Hoàng Gia', class: 'bg-[#201235] border-purple-700/50 text-purple-100', dot: 'bg-purple-500' }
];

export default function KeepNotes() {
  const { keepNotes, updateKeepNotes } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create state
  const [isExpanding, setIsExpanding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newColor, setNewColor] = useState('Mặc định');
  const [isNewPinned, setIsNewPinned] = useState(false);
  const [newTagsString, setNewTagsString] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Edit state
  const [editingNote, setEditingNote] = useState<KeepNote | null>(null);

  // Drive integration state
  const [needsAuth, setNeedsAuth] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setToken(token);
        setNeedsAuth(false);
      },
      () => setNeedsAuth(true)
    );
    return () => unsubscribe();
  }, []);

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setGoogleUser(result.user);
        setNeedsAuth(false);
        triggerToast('Đã kết nối tài khoản Google thành công!', 'success');
      }
    } catch (err) {
      console.error('Login failed:', err);
      triggerToast('Không thể liên kết tài khoản Google.', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logout();
      setGoogleUser(null);
      setToken(null);
      setNeedsAuth(true);
      triggerToast('Đã ngắt kết nối tài khoản Google.', 'info');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Sync to Drive
  const syncWithGoogleDrive = async (actionType: 'upload' | 'download' = 'upload') => {
    if (!token) {
      triggerToast('Vui lòng kết nối Google Account trước.', 'error');
      return;
    }
    setIsSyncing(true);
    setSyncStatus(actionType === 'upload' ? 'Đang sao lưu...' : 'Đang đồng bộ tải về...');

    try {
      // 1. Tìm hoặc tạo thư mục "VinclubKeep"
      let folderId = null;
      const folderQuery = "mimeType='application/vnd.google-apps.folder' and name='VinclubKeep' and trashed=false";
      const searchFolderRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(folderQuery)}&spaces=drive`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const searchFolderData = await searchFolderRes.json();
      
      if (searchFolderData.files && searchFolderData.files.length > 0) {
        folderId = searchFolderData.files[0].id;
      } else {
        const folderMetadata = {
          name: 'VinclubKeep',
          mimeType: 'application/vnd.google-apps.folder'
        };
        const createFolderRes = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(folderMetadata)
        });
        const createFolderData = await createFolderRes.json();
        folderId = createFolderData.id;
      }

      // 2. Tìm file backup "vinclub_keep_notes_backup.json" trong thư mục đó
      let fileId = null;
      const fileQuery = `name='vinclub_keep_notes_backup.json' and '${folderId}' in parents and trashed=false`;
      const searchFileRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(fileQuery)}&spaces=drive`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const searchFileData = await searchFileRes.json();
      if (searchFileData.files && searchFileData.files.length > 0) {
        fileId = searchFileData.files[0].id;
      }

      if (actionType === 'upload') {
        // Sao lưu lên đám mây
        const backupData = JSON.stringify(keepNotes, null, 2);
        const fileBlob = new Blob([backupData], { type: 'application/json' });
        
        if (fileId) {
          // Cập nhật file hiện tại
          const res = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: fileBlob
          });
          if (!res.ok) throw new Error('Cập nhật file sao lưu thất bại');
        } else {
          // Tạo file mới
          const metadata = {
            name: 'vinclub_keep_notes_backup.json',
            parents: [folderId]
          };
          const form = new FormData();
          form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
          form.append('file', fileBlob);

          const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: form
          });
          if (!res.ok) throw new Error('Tạo file sao lưu thất bại');
        }
        triggerToast('Đã sao lưu ghi chú thành công lên Google Drive!', 'success');
      } else {
        // Tải xuống từ đám mây
        if (!fileId) {
          triggerToast('Không tìm thấy bản sao lưu nào trên Drive để tải về.', 'error');
          setIsSyncing(false);
          return;
        }

        const fetchRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!fetchRes.ok) throw new Error('Tải bản sao lưu từ Google Drive thất bại');
        
        const driveNotes: KeepNote[] = await fetchRes.json();
        if (Array.isArray(driveNotes)) {
          await updateKeepNotes(driveNotes);
          triggerToast(`Đã đồng bộ thành công ${driveNotes.length} ghi chú từ Google Drive!`, 'success');
        } else {
          throw new Error('Dữ liệu sao lưu không hợp lệ');
        }
      }
    } catch (err: any) {
      console.error('Drive operation error:', err);
      triggerToast('Đồng bộ đám mây thất bại: ' + (err.message || ''), 'error');
    } finally {
      setIsSyncing(false);
      setSyncStatus('');
    }
  };

  // Add Note
  const handleAddNote = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim() && !newContent.trim()) {
      setIsExpanding(false);
      return;
    }

    const tags = newTagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const note: KeepNote = {
      id: 'NOTE' + Math.floor(Math.random() * 900000 + 100000),
      title: newTitle.trim() || 'Không tiêu đề',
      content: newContent.trim(),
      color: newColor,
      isPinned: isNewPinned,
      tags: tags,
      updatedAt: new Date().toLocaleString('vi-VN')
    };

    const updated = [note, ...keepNotes];
    await updateKeepNotes(updated);

    // Reset fields
    setNewTitle('');
    setNewContent('');
    setNewColor('Mặc định');
    setIsNewPinned(false);
    setNewTagsString('');
    setIsExpanding(false);
    triggerToast('Đã thêm ghi chú mới');
  };

  // Delete Note
  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = keepNotes.filter(n => n.id !== id);
    await updateKeepNotes(updated);
    triggerToast('Đã xóa ghi chú');
  };

  // Toggle Pin
  const handleTogglePin = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = keepNotes.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n);
    await updateKeepNotes(updated);
  };

  // Save Edit Note
  const handleSaveEdit = async () => {
    if (!editingNote) return;
    const updated = keepNotes.map(n => n.id === editingNote.id ? { ...editingNote, updatedAt: new Date().toLocaleString('vi-VN') } : n);
    await updateKeepNotes(updated);
    setEditingNote(null);
    triggerToast('Đã cập nhật ghi chú');
  };

  const getNoteColorClass = (colorName?: string) => {
    const col = NOTE_COLORS.find(c => c.name === colorName);
    return col ? col.class : NOTE_COLORS[0].class;
  };

  const getNoteColorDot = (colorName?: string) => {
    const col = NOTE_COLORS.find(c => c.name === colorName);
    return col ? col.dot : NOTE_COLORS[0].dot;
  };

  // Filter notes
  const filteredNotes = keepNotes.filter(n => {
    const q = searchQuery.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || (n.tags && n.tags.some(t => t.toLowerCase().includes(q)));
  });

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const otherNotes = filteredNotes.filter(n => !n.isPinned);

  return (
    <div className="flex-1 bg-[#09090b] text-zinc-200 min-h-screen pb-12">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border flex items-center gap-2.5 shadow-2xl ${
              toast.type === 'success' ? 'bg-[#0f2c24] border-emerald-500/30 text-emerald-200' :
              toast.type === 'error' ? 'bg-[#2d121c] border-rose-500/30 text-rose-200' :
              'bg-[#1c1917] border-zinc-700 text-zinc-200'
            }`}
          >
            {toast.type === 'success' && <Check className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'error' && <X className="w-4 h-4 text-rose-400" />}
            <span className="text-xs font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Google Drive Connection Panel */}
      <div className="bg-[#121214] border-b border-zinc-800/60 p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-zinc-100 text-sm uppercase tracking-wider flex items-center gap-1.5">
                Google Keep Sổ Tay <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-normal px-2 py-0.5 rounded-full uppercase">Đồng bộ Cloud</span>
              </h2>
              <p className="text-[11px] text-zinc-500">Ghi chép kế hoạch đầu tư và giao dịch VinClub</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {needsAuth ? (
              <button 
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-2 bg-[#1c1917] hover:bg-[#292524] text-zinc-100 font-semibold text-xs px-3.5 py-2 rounded-xl border border-zinc-700/80 transition-colors cursor-pointer"
              >
                {isLoggingIn ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Cloud className="w-3.5 h-3.5 text-blue-400" />
                )}
                Kết nối Google Drive
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-[11px] text-zinc-300">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="max-w-[130px] truncate">{googleUser?.email}</span>
                  <button onClick={handleGoogleLogout} className="ml-1 text-zinc-500 hover:text-red-400 transition-colors">
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>

                <button 
                  onClick={() => syncWithGoogleDrive('upload')}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold text-xs px-3 py-2 rounded-xl border border-amber-500/20 transition-all cursor-pointer"
                  title="Sao lưu toàn bộ ghi chú lên Google Drive"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Sao lưu Cloud
                </button>

                <button 
                  onClick={() => syncWithGoogleDrive('download')}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs px-3 py-2 rounded-xl border border-zinc-700 transition-all cursor-pointer"
                  title="Khôi phục ghi chú từ Google Drive"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  Tải đám mây về
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-8">
        {/* Search Notes */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Tìm kiếm tiêu đề, nội dung hoặc thẻ ghi chú..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161619] border border-zinc-800 rounded-2xl py-3 pl-11 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>

        {/* Create Note Box (Expands Like Google Keep) */}
        <div className="bg-[#121214] border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl">
          {!isExpanding ? (
            <div 
              onClick={() => setIsExpanding(true)}
              className="p-4 flex items-center justify-between text-zinc-500 hover:text-zinc-400 cursor-pointer"
            >
              <span className="text-sm">Tạo nhanh ghi chú mới...</span>
              <Plus className="w-5 h-5 text-amber-500" />
            </div>
          ) : (
            <form onSubmit={handleAddNote} className="p-4 space-y-4">
              {/* Note Header Info */}
              <div className="flex items-center justify-between">
                <input 
                  type="text" 
                  placeholder="Tiêu đề" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-transparent border-none text-zinc-100 font-bold text-base focus:outline-none w-full"
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={() => setIsNewPinned(!isNewPinned)}
                  className={`p-1.5 rounded-lg hover:bg-zinc-800 transition-colors ${isNewPinned ? 'text-amber-400' : 'text-zinc-500'}`}
                  title={isNewPinned ? 'Hủy ghim' : 'Ghim ghi chú'}
                >
                  <Pin className="w-4 h-4" />
                </button>
              </div>

              {/* Note Body */}
              <textarea 
                placeholder="Nhập nội dung ghi chú..." 
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="bg-transparent border-none text-zinc-300 text-sm focus:outline-none w-full min-h-[100px] resize-none"
              />

              {/* Tag builder */}
              <div className="flex items-center gap-2 bg-zinc-950/40 p-2 rounded-xl border border-zinc-800">
                <Tag className="w-3.5 h-3.5 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Thẻ (phân tách bằng dấu phẩy, vd: vinfast, bitcoin)" 
                  value={newTagsString}
                  onChange={(e) => setNewTagsString(e.target.value)}
                  className="bg-transparent border-none text-xs text-zinc-300 focus:outline-none w-full"
                />
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Palette className="w-4 h-4" />
                    <span>Màu: {newColor}</span>
                  </button>

                  {showColorPicker && (
                    <div className="absolute left-0 bottom-10 z-20 bg-zinc-900 border border-zinc-800 p-2 rounded-xl shadow-2xl flex flex-col gap-1 w-44">
                      {NOTE_COLORS.map(col => (
                        <button 
                          key={col.name}
                          type="button"
                          onClick={() => {
                            setNewColor(col.name);
                            setShowColorPicker(false);
                          }}
                          className="flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 w-full text-left"
                        >
                          <span className={`w-3 h-3 rounded-full ${col.dot}`}></span>
                          {col.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsExpanding(false)}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-1.5"
                  >
                    Đóng
                  </button>
                  <button 
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs px-4 py-1.5 rounded-xl transition-all shadow-md"
                  >
                    Lưu ghi chú
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Notes Grid Area */}
        {keepNotes.length === 0 ? (
          <div className="text-center py-12 bg-[#121214]/40 border border-dashed border-zinc-800 rounded-3xl space-y-3">
            <FileText className="w-8 h-8 text-zinc-600 mx-auto" />
            <div>
              <p className="text-zinc-400 text-sm font-semibold">Chưa có ghi chú nào</p>
              <p className="text-zinc-600 text-xs max-w-xs mx-auto mt-1">Hãy bắt đầu tạo ghi chú đầu tiên để lưu lại kế hoạch đầu tư VIP của bạn.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pinned Section */}
            {pinnedNotes.length > 0 && (
              <div className="space-y-3">
                <span className="text-[11px] uppercase text-zinc-500 font-bold tracking-widest pl-1">Đã ghim ({pinnedNotes.length})</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pinnedNotes.map(note => (
                    <div 
                      key={note.id}
                      onClick={() => setEditingNote(note)}
                      className={`group rounded-2xl border p-5 transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between min-h-[160px] shadow-lg relative overflow-hidden ${getNoteColorClass(note.color)}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm tracking-tight line-clamp-2">{note.title}</h4>
                          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => handleTogglePin(note.id, e)}
                              className="p-1 rounded-lg hover:bg-white/10 text-amber-400 transition-colors"
                              title="Hủy ghim"
                            >
                              <Pin className="w-3.5 h-3.5 fill-current" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs opacity-80 whitespace-pre-line line-clamp-4 leading-relaxed font-normal">{note.content}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-2">
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {note.tags.map(tag => (
                              <span key={tag} className="text-[9px] font-semibold bg-black/20 text-white/80 px-2 py-0.5 rounded-full border border-white/10">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-[9px] opacity-40">
                          <span>CN: {note.updatedAt}</span>
                          <button 
                            onClick={(e) => handleDeleteNote(note.id, e)}
                            className="p-1 rounded hover:bg-red-500/10 text-red-400 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"
                            title="Xóa ghi chú"
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

            {/* Other Notes Section */}
            {otherNotes.length > 0 && (
              <div className="space-y-3">
                {pinnedNotes.length > 0 && (
                  <span className="text-[11px] uppercase text-zinc-500 font-bold tracking-widest pl-1">Ghi chú khác ({otherNotes.length})</span>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {otherNotes.map(note => (
                    <div 
                      key={note.id}
                      onClick={() => setEditingNote(note)}
                      className={`group rounded-2xl border p-5 transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between min-h-[160px] shadow-lg relative overflow-hidden ${getNoteColorClass(note.color)}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm tracking-tight line-clamp-2">{note.title}</h4>
                          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => handleTogglePin(note.id, e)}
                              className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-amber-400 transition-colors"
                              title="Ghim ghi chú"
                            >
                              <Pin className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs opacity-80 whitespace-pre-line line-clamp-4 leading-relaxed font-normal">{note.content}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-2">
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {note.tags.map(tag => (
                              <span key={tag} className="text-[9px] font-semibold bg-black/20 text-white/80 px-2 py-0.5 rounded-full border border-white/10">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-[9px] opacity-40">
                          <span>CN: {note.updatedAt}</span>
                          <button 
                            onClick={(e) => handleDeleteNote(note.id, e)}
                            className="p-1 rounded hover:bg-red-500/10 text-red-400 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"
                            title="Xóa ghi chú"
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
          </div>
        )}
      </div>

      {/* Note Detail / Edit Modal */}
      <AnimatePresence>
        {editingNote && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`w-full max-w-lg rounded-3xl border p-6 space-y-4 shadow-2xl relative overflow-hidden ${getNoteColorClass(editingNote.color)}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2">
                <input 
                  type="text" 
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="bg-transparent border-none text-zinc-100 font-bold text-lg focus:outline-none w-full"
                />
                <button 
                  onClick={() => setEditingNote({ ...editingNote, isPinned: !editingNote.isPinned })}
                  className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${editingNote.isPinned ? 'text-amber-400' : 'text-white/40'}`}
                >
                  <Pin className={`w-4 h-4 ${editingNote.isPinned ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Body */}
              <textarea 
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                className="bg-transparent border-none text-zinc-200 text-sm focus:outline-none w-full min-h-[150px] resize-none leading-relaxed"
              />

              {/* Tags block */}
              <div className="flex flex-wrap gap-1.5 items-center p-2 bg-black/10 rounded-xl border border-white/5">
                <Tag className="w-3.5 h-3.5 text-white/50" />
                <input 
                  type="text" 
                  placeholder="Thẻ (phân tách bằng dấu phẩy)"
                  value={editingNote.tags ? editingNote.tags.join(', ') : ''}
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map(t => t.trim());
                    setEditingNote({ ...editingNote, tags });
                  }}
                  className="bg-transparent border-none text-xs text-white/85 focus:outline-none w-full flex-1"
                />
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex items-center gap-1">
                  {NOTE_COLORS.map(col => (
                    <button 
                      key={col.name}
                      onClick={() => setEditingNote({ ...editingNote, color: col.name })}
                      className={`w-5 h-5 rounded-full border transition-transform ${col.dot} ${
                        editingNote.color === col.name ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                      }`}
                      title={col.name}
                    ></button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setEditingNote(null)}
                    className="text-xs opacity-70 hover:opacity-100 transition-opacity px-3 py-1.5 text-white"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={handleSaveEdit}
                    className="bg-white text-black font-bold text-xs px-4 py-1.5 rounded-xl transition-all hover:bg-opacity-90 flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Xác nhận
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
