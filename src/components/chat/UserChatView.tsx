// ============================================================
// src/components/chat/UserChatView.tsx
// Màn hình CSKH phía User — giao diện live chat đầy đủ
// ============================================================

import React, { useCallback, useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Wifi } from 'lucide-react';
import { useUser } from '../UserContext';
import {
  useMessages,
  ensureChatRoom,
  sendChatMessage,
  markAdminMessagesRead,
} from './useChatRealtime';
import { useUploadImages } from './useUploadImages';
import ChatInput from './ChatInput';
import MessageList from './MessageList';

const AGENT_AVATAR = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop';

const QUICK_REPLIES = [
  'Chính sách đầu tư',
  'Rút tiền & Phí',
  'Xác thực tài khoản',
  'Voucher Vinpearl',
  'Câu hỏi thường gặp',
];

interface Props {
  onBack: () => void;
}

export default function UserChatView({ onBack }: Props) {
  const { userId, displayName, avatarImage } = useUser() as any;
  const roomId = userId || 'guest';

  const { messages, loading } = useMessages(roomId);
  const { uploadImages, uploading } = useUploadImages();
  const [sending, setSending] = useState(false);
  const [roomReady, setRoomReady] = useState(false);

  // Tạo room nếu chưa tồn tại
  useEffect(() => {
    if (!roomId || roomId === 'guest') return;
    ensureChatRoom(roomId, displayName || 'Người dùng', userId || '', avatarImage || undefined)
      .then(() => setRoomReady(true))
      .catch(console.error);
  }, [roomId, displayName, userId, avatarImage]);

  // Đánh dấu đã đọc tin nhắn từ admin khi mở chat
  useEffect(() => {
    if (roomId && messages.length > 0) {
      markAdminMessagesRead(roomId).catch(console.error);
    }
  }, [roomId, messages.length]);

  // Gửi tin nhắn
  const handleSend = useCallback(async (text: string, files: File[]) => {
    if ((!text.trim() && files.length === 0) || sending) return;
    setSending(true);
    try {
      // Upload ảnh trước
      const imageUrls = files.length > 0
        ? await uploadImages(files, roomId)
        : [];

      await sendChatMessage({
        roomId,
        senderId: userId || 'guest',
        senderType: 'user',
        senderName: displayName || 'Người dùng',
        content: text,
        imageUrls,
      });
    } catch (err) {
      console.error('[UserChatView] handleSend error:', err);
      alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  }, [sending, roomId, userId, displayName, uploadImages]);

  // Quick reply
  const handleQuickReply = useCallback((reply: string) => {
    handleSend(reply, []);
  }, [handleSend]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] overflow-hidden">

      {/* ── Header ────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 bg-[#111] border-b border-zinc-800/80 shadow-md">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Agent info */}
        <div className="relative">
          <img
            src={AGENT_AVATAR}
            alt="CSKH Agent"
            className="w-9 h-9 rounded-full object-cover border border-zinc-700"
          />
          {/* Online dot */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#111]" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-none truncate">Hỗ trợ VinClub</p>
          <p className="text-emerald-400 text-[11px] mt-0.5 flex items-center gap-1">
            <Wifi className="w-2.5 h-2.5" /> Đang online
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Bảo mật</span>
        </div>
      </div>

      {/* ── Messages ──────────────────────────────────────── */}
      <MessageList
        messages={messages}
        currentSenderId={userId || 'guest'}
        agentAvatarUrl={AGENT_AVATAR}
        loading={loading && !roomReady}
      />

      {/* ── Quick Replies ──────────────────────────────────── */}
      {messages.length === 0 && !loading && (
        <div
          className="shrink-0 flex gap-2 px-4 pb-2 overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          {QUICK_REPLIES.map((r, i) => (
            <button
              key={i}
              onClick={() => handleQuickReply(r)}
              className="whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-800/60 text-[#c29b57] border border-[#c29b57]/30 hover:bg-[#c29b57]/10 transition-colors shrink-0"
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* ── Chat Input ────────────────────────────────────── */}
      <ChatInput
        onSend={handleSend}
        sending={sending || uploading}
        placeholder="Nhập tin nhắn cho CSKH..."
        disabled={!roomReady && roomId !== 'guest'}
      />
    </div>
  );
}
