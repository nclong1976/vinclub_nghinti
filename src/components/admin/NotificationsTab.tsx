import React, { useState } from 'react';
import { Bell, Megaphone, Send, ShieldAlert, Trash2 } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

interface NotificationsTabProps {
  tickerMessages: string[];
  tickerInput: string;
  setTickerInput: (val: string) => void;
  handlePushTicker: () => Promise<void>;
}

export default function NotificationsTab({
  tickerMessages,
  tickerInput,
  setTickerInput,
  handlePushTicker,
}: NotificationsTabProps) {
  
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annType, setAnnType] = useState<'privilege' | 'event' | 'system' | 'news' | 'promotion'>('system');

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) {
      alert('Vui lòng điền đủ tiêu đề và nội dung thông báo!');
      return;
    }

    try {
      await addDoc(collection(db, 'notifications'), {
        title: annTitle.trim(),
        content: annContent.trim(),
        type: annType,
        date: new Date().toLocaleDateString('vi-VN'),
        createdAt: Date.now()
      });

      setAnnTitle('');
      setAnnContent('');
      alert('Đã phát hành thông báo mới thành công!');
    } catch (e: any) {
      console.error(e);
      alert('Lỗi khi đăng thông báo: ' + e.message);
    }
  };

  const handleClearAllTicker = async () => {
    if (!window.confirm('Xóa sạch danh sách chạy chữ Ticker?')) return;
    try {
      await setDoc(doc(db, 'settings', 'ticker'), {
        messages: []
      });
      alert('Đã dọn dẹp tin nhắn Ticker.');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
      
      {/* Running Ticker notices */}
      <div className="bg-[#1a1b21] border border-[#4f453b]/40 rounded-xl p-6 space-y-4">
        <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-[#ecbe8e]" /> Chạy chữ thông báo đỉnh (Ticker Banner)
        </h4>
        <p className="text-[10px] text-zinc-500">Tin nhắn ngắn chạy cuộn ở thanh trên cùng của ứng dụng người dùng</p>

        <div className="flex gap-2">
          <input 
            type="text" 
            value={tickerInput}
            onChange={e => setTickerInput(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#ecbe8e] text-white"
            placeholder="Nhập tin nhắn chạy chữ mới..."
          />
          <button 
            onClick={handlePushTicker}
            className="px-4 py-2 text-xs font-bold rounded bg-[#ecbe8e] text-[#000D1A] hover:bg-[#ecbe8e]/80 transition-colors uppercase tracking-wider"
          >
            Đăng
          </button>
        </div>

        <div className="border-t border-[#4f453b]/10 pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tin nhắn hiện tại (Tối đa 5)</span>
            {tickerMessages.length > 0 && (
              <button 
                onClick={handleClearAllTicker}
                className="text-red-400 hover:text-red-500 text-[10px] font-bold uppercase"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {tickerMessages.length === 0 ? (
            <div className="text-xs text-zinc-600 italic py-2">Không có tin nhắn chạy chữ nào đang hoạt động.</div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {tickerMessages.map((msg, idx) => (
                <div key={idx} className="bg-zinc-950 border border-zinc-900 p-2 rounded text-zinc-300 text-xs font-medium font-heading">
                  {msg}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Broadcaster */}
      <div className="bg-[#1a1b21] border border-[#4f453b]/40 rounded-xl p-6">
        <form onSubmit={handleSendNotification} className="space-y-4">
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#ecbe8e]" /> Phát hành thông báo sự kiện & quyền lợi
          </h4>
          <p className="text-[10px] text-zinc-500">Đăng tin này vào hòm thư thông báo của toàn bộ thành viên</p>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Tiêu đề thông báo</label>
            <input 
              type="text" 
              value={annTitle}
              onChange={e => setAnnTitle(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#ecbe8e] text-white"
              placeholder="Nhập tiêu đề thông báo..."
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Phân mục thông báo</label>
            <select 
              value={annType}
              onChange={e => setAnnType(e.target.value as any)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#ecbe8e] text-zinc-400"
            >
              <option value="system">Hệ thống (System)</option>
              <option value="event">Sự kiện (Event)</option>
              <option value="privilege">Quyền lợi đặc quyền (Privilege)</option>
              <option value="news">Tin mới (News)</option>
              <option value="promotion">Khuyến mãi (Promotion)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Nội dung thông báo</label>
            <textarea 
              value={annContent}
              onChange={e => setAnnContent(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#ecbe8e] text-white h-24"
              placeholder="Nhập nội dung thông báo đầy đủ..."
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-2.5 rounded bg-[#ecbe8e] hover:bg-[#ecbe8e]/80 text-[#000D1A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/5"
          >
            <Send className="w-4 h-4" /> Gửi tới tất cả thành viên
          </button>
        </form>
      </div>

    </div>
  );
}
