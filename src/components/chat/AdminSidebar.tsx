// ============================================================
// src/components/chat/AdminSidebar.tsx
// Sidebar admin: danh sách conversations với unread badge
// ============================================================

import React from 'react';
import { MessageSquare, Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import type { AdminSidebarProps, ChatRoom } from './types';

function formatRelativeTime(ts: any): string {
  if (!ts) return '';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
    const diff = Date.now() - d.getTime();
    if (diff < 60000) return 'Vừa xong';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ`;
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  } catch {
    return '';
  }
}

function RoomCard({
  room,
  isSelected,
  onClick,
}: {
  room: ChatRoom;
  isSelected: boolean;
  onClick: () => void;
}) {
  const initials = room.userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-4 py-3.5 transition-all relative border-b border-zinc-900/60 ${
        isSelected
          ? 'bg-[#c29b57]/10 border-l-2 border-l-[#c29b57]'
          : 'hover:bg-zinc-800/40 border-l-2 border-l-transparent'
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        {room.avatarUrl ? (
          <img
            src={room.avatarUrl}
            alt={room.userName}
            className="w-10 h-10 rounded-full object-cover border border-zinc-700"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c29b57] to-[#7a5e28] flex items-center justify-center text-black font-bold text-sm">
            {initials}
          </div>
        )}
        {/* Online/Active indicator */}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0f0f0f]" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm font-semibold truncate ${isSelected ? 'text-[#ebd5ad]' : 'text-zinc-200'}`}>
            {room.userName}
          </span>
          <span className="text-[10px] text-zinc-500 shrink-0">
            {formatRelativeTime(room.lastMessageAt)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs text-zinc-500 truncate">{room.lastMessage || 'Chưa có tin nhắn'}</p>
          {room.unreadByAdmin > 0 && (
            <span className="shrink-0 min-w-[18px] h-[18px] rounded-full bg-[#c29b57] text-black text-[10px] font-black flex items-center justify-center px-1">
              {room.unreadByAdmin > 99 ? '99+' : room.unreadByAdmin}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function AdminSidebar({
  rooms,
  selectedRoomId,
  onSelectRoom,
  loading = false,
}: AdminSidebarProps) {
  const [search, setSearch] = useState('');

  const filtered = rooms.filter(r =>
    r.userName.toLowerCase().includes(search.toLowerCase()) ||
    r.userEmail.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = rooms.reduce((s, r) => s + r.unreadByAdmin, 0);

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f] border-r border-zinc-800/80 w-72 shrink-0">

      {/* Header */}
      <div className="px-4 py-4 border-b border-zinc-800/80 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4.5 h-4.5 text-[#c29b57]" />
            <h2 className="text-sm font-black text-zinc-100 uppercase tracking-widest">Live Chat</h2>
          </div>
          {totalUnread > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30">
              {totalUnread} mới
            </span>
          )}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-zinc-800/60 rounded-xl px-3 py-2 border border-zinc-700/40 focus-within:border-[#c29b57]/40 transition-colors">
          <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email..."
            className="flex-1 bg-transparent text-xs text-zinc-300 placeholder:text-zinc-600 outline-none"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin text-[#c29b57]" />
            <span className="text-xs">Đang tải danh sách...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-zinc-600 text-center px-4">
            <MessageSquare className="w-8 h-8 opacity-30" />
            <p className="text-xs">
              {search ? 'Không tìm thấy kết quả' : 'Chưa có cuộc hội thoại nào'}
            </p>
          </div>
        ) : (
          filtered.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              isSelected={selectedRoomId === room.id}
              onClick={() => onSelectRoom(room.id)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-zinc-800/80 shrink-0">
        <p className="text-[10px] text-zinc-600 text-center">
          {rooms.length} cuộc hội thoại · {totalUnread} chưa đọc
        </p>
      </div>
    </div>
  );
}
