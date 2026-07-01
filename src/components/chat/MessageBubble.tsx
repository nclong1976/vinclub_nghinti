// ============================================================
// src/components/chat/MessageBubble.tsx
// Hiển thị một tin nhắn — bubble trái/phải, hỗ trợ ảnh
// ============================================================

import React, { useState } from 'react';
import { CheckCheck, Check } from 'lucide-react';
import type { MessageBubbleProps } from './types';

const DEFAULT_AGENT_AVATAR = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop';

function formatTime(ts: any): string {
  if (!ts) return '';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  agentAvatarUrl,
}: MessageBubbleProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const hasImages = message.imageUrls.length > 0;
  const hasText = message.content.trim().length > 0;

  return (
    <>
      <div className={`flex w-full items-end gap-2 mb-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>

        {/* Avatar (chỉ hiện cho admin/agent, bên trái) */}
        {!isOwn && showAvatar && (
          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-zinc-700 bg-zinc-800">
            <img
              src={agentAvatarUrl || DEFAULT_AGENT_AVATAR}
              alt="Agent"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {/* Placeholder avatar space để căn lề khi không show */}
        {!isOwn && !showAvatar && <div className="w-7 shrink-0" />}

        {/* Bubble container */}
        <div className={`flex flex-col gap-1 max-w-[78%] ${isOwn ? 'items-end' : 'items-start'}`}>

          {/* Images grid */}
          {hasImages && (
            <div
              className={`grid gap-1 ${
                message.imageUrls.length === 1 ? 'grid-cols-1' :
                message.imageUrls.length === 2 ? 'grid-cols-2' :
                'grid-cols-2'
              }`}
            >
              {message.imageUrls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxSrc(url)}
                  className="block rounded-xl overflow-hidden border border-zinc-700/60 hover:opacity-90 transition-opacity"
                  type="button"
                >
                  <img
                    src={url}
                    alt={`Ảnh ${idx + 1}`}
                    className="w-full h-auto max-h-56 object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Text bubble */}
          {hasText && (
            <div
              className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                isOwn
                  ? 'bg-[#c29b57] text-black rounded-br-sm font-medium'
                  : 'bg-zinc-800 text-zinc-100 rounded-bl-sm border border-zinc-700/50'
              }`}
            >
              {message.content}
            </div>
          )}

          {/* Timestamp + read receipt */}
          <div className={`flex items-center gap-1 px-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
            <span className="text-[10px] text-zinc-500">
              {formatTime(message.createdAt)}
            </span>
            {isOwn && (
              message.isRead
                ? <CheckCheck className="w-3 h-3 text-[#c29b57]" />
                : <Check className="w-3 h-3 text-zinc-500" />
            )}
          </div>
        </div>
      </div>

      {/* Lightbox / image viewer */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <img
            src={lightboxSrc}
            alt="Xem ảnh"
            className="max-w-full max-h-full rounded-xl object-contain"
          />
        </div>
      )}
    </>
  );
}
