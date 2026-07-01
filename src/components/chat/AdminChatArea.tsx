// ============================================================
// src/components/chat/AdminChatArea.tsx
// Khung chat chi tiết phía Admin — hiển thị + trả lời
// ============================================================

import React, { useCallback, useState } from 'react';
import { User, ShieldCheck, MoreVertical } from 'lucide-react';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { useUploadImages } from './useUploadImages';
import { sendChatMessage, markRoomAsRead } from './useChatRealtime';
import type { AdminChatAreaProps } from './types';

const ADMIN_ID = 'admin'; // Định danh admin trong hệ thống

export default function AdminChatArea({
  room,
  messages,
  onSend,
  sending = false,
  messagesLoading = false,
}: AdminChatAreaProps) {

  // Empty state: chưa chọn conversation
  if (!room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#0a0a0a] text-center px-8">
        <div className="w-20 h-20 rounded-3xl bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center text-3xl shadow-inner">
          💬
        </div>
        <div>
          <h3 className="text-zinc-300 font-semibold text-base mb-1">Chọn cuộc hội thoại</h3>
          <p className="text-zinc-600 text-sm leading-relaxed max-w-[250px]">
            Chọn một người dùng từ danh sách bên trái để xem và trả lời tin nhắn.
          </p>
        </div>
      </div>
    );
  }

  const initials = room.userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] overflow-hidden">

      {/* ── Chat Header ───────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-3 px-5 py-3.5 bg-[#111] border-b border-zinc-800/80 shadow-md">
        {/* User Avatar */}
        <div className="relative">
          {room.avatarUrl ? (
            <img
              src={room.avatarUrl}
              alt={room.userName}
              className="w-9 h-9 rounded-full object-cover border border-zinc-700"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c29b57] to-[#7a5e28] flex items-center justify-center text-black font-bold text-sm">
              {initials}
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#111]" />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm truncate">{room.userName}</p>
          <p className="text-zinc-500 text-[11px] truncate">{room.userEmail}</p>
        </div>

        {/* Badge CSKH */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#c29b57]/10 border border-[#c29b57]/25">
          <ShieldCheck className="w-3.5 h-3.5 text-[#c29b57]" />
          <span className="text-[10px] font-bold text-[#c29b57] uppercase tracking-wider">CSKH</span>
        </div>
      </div>

      {/* ── User Info Bar ─────────────────────────────────── */}
      <div className="shrink-0 px-5 py-2.5 bg-zinc-900/40 border-b border-zinc-800/50 flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <User className="w-3.5 h-3.5 text-zinc-500" />
          <span className="font-medium">{room.userName}</span>
        </div>
        <div className="h-3 w-px bg-zinc-700" />
        <span className="text-xs text-zinc-500 truncate">{room.userEmail || room.userId}</span>
        {room.unreadByAdmin > 0 && (
          <>
            <div className="h-3 w-px bg-zinc-700" />
            <span className="text-xs text-amber-400 font-medium">{room.unreadByAdmin} tin chưa đọc</span>
          </>
        )}
      </div>

      {/* ── Messages ──────────────────────────────────────── */}
      <MessageList
        messages={messages}
        currentSenderId={ADMIN_ID}
        loading={messagesLoading}
      />

      {/* ── Input ─────────────────────────────────────────── */}
      <ChatInput
        onSend={onSend}
        sending={sending}
        placeholder={`Trả lời ${room.userName}...`}
      />
    </div>
  );
}
