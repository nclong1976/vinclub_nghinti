// ============================================================
// src/components/chat/MessageList.tsx
// Danh sách tin nhắn với auto-scroll và date dividers
// ============================================================

import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import MessageBubble from './MessageBubble';
import type { MessageListProps, ChatMessage } from './types';

function getDateLabel(ts: any): string {
  if (!ts) return '';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Hôm nay';
    if (d.toDateString() === yesterday.toDateString()) return 'Hôm qua';
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '';
  }
}

/** Nhóm messages theo ngày */
function groupByDate(messages: ChatMessage[]): { label: string; items: ChatMessage[] }[] {
  const groups: { label: string; items: ChatMessage[] }[] = [];
  let currentLabel = '';

  messages.forEach(msg => {
    const label = getDateLabel(msg.createdAt);
    if (label !== currentLabel) {
      currentLabel = label;
      groups.push({ label, items: [] });
    }
    groups[groups.length - 1].items.push(msg);
  });

  return groups;
}

export default function MessageList({
  messages,
  currentSenderId,
  agentAvatarUrl,
  loading = false,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-zinc-500">
        <Loader2 className="w-6 h-6 animate-spin text-[#c29b57]" />
        <span className="text-xs">Đang tải lịch sử chat...</span>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center text-2xl shadow-inner">
          💬
        </div>
        <p className="text-zinc-400 text-sm font-medium">Bắt đầu cuộc trò chuyện</p>
        <p className="text-zinc-600 text-xs leading-relaxed max-w-[220px]">
          Đội ngũ CSKH VinClub sẵn sàng hỗ trợ bạn 24/7.
        </p>
      </div>
    );
  }

  const groups = groupByDate(messages);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}
    >
      {groups.map((group, gIdx) => (
        <React.Fragment key={gIdx}>
          {/* Date divider */}
          {group.label && (
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-[10px] font-medium text-zinc-500 bg-[#0f0f0f] px-2 whitespace-nowrap">
                {group.label}
              </span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
          )}

          {/* Messages */}
          {group.items.map((msg, mIdx) => {
            const isOwn = msg.senderId === currentSenderId || msg.senderType === (
              // If currentSenderId is 'admin', own = admin messages
              currentSenderId === 'admin' ? 'admin' : 'user'
            );

            // Avoid re-showing avatar for consecutive same-sender messages
            const nextMsg = group.items[mIdx + 1];
            const showAvatar = !isOwn && (
              !nextMsg || nextMsg.senderType !== msg.senderType
            );

            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={isOwn}
                showAvatar={showAvatar}
                agentAvatarUrl={agentAvatarUrl}
              />
            );
          })}
        </React.Fragment>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
