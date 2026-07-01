// ============================================================
// src/components/chat/AdminLiveChatView.tsx
// Layout Admin 2-cột: Sidebar + ChatArea
// Dùng trong AdminConsole hoặc standalone
// ============================================================

import React, { useState, useCallback, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminChatArea from './AdminChatArea';
import { useChatRooms, useMessages, sendChatMessage, markRoomAsRead } from './useChatRealtime';
import { useUploadImages } from './useUploadImages';
import type { ChatRoom } from './types';

const ADMIN_SENDER_NAME = 'Hỗ trợ VinClub';

export default function AdminLiveChatView() {
  const { rooms, loading: roomsLoading } = useChatRooms();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const { messages, loading: messagesLoading } = useMessages(selectedRoomId);
  const { uploadImages, uploading } = useUploadImages();
  const [sending, setSending] = useState(false);

  // Lấy room đang chọn
  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || null;

  // Khi chọn room mới, đánh dấu đã đọc
  useEffect(() => {
    if (selectedRoomId) {
      markRoomAsRead(selectedRoomId).catch(console.error);
    }
  }, [selectedRoomId]);

  // Khi có tin nhắn mới, đánh dấu đọc nếu đang xem room đó
  useEffect(() => {
    if (selectedRoomId && messages.length > 0) {
      markRoomAsRead(selectedRoomId).catch(console.error);
    }
  }, [messages.length, selectedRoomId]);

  // Gửi tin nhắn từ admin
  const handleSend = useCallback(async (text: string, files: File[]) => {
    if (!selectedRoomId || (!text.trim() && files.length === 0) || sending) return;
    setSending(true);
    try {
      const imageUrls = files.length > 0
        ? await uploadImages(files, selectedRoomId)
        : [];

      await sendChatMessage({
        roomId: selectedRoomId,
        senderId: 'admin',
        senderType: 'admin',
        senderName: ADMIN_SENDER_NAME,
        content: text,
        imageUrls,
      });
    } catch (err) {
      console.error('[AdminLiveChatView] handleSend error:', err);
      alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  }, [selectedRoomId, sending, uploadImages]);

  return (
    <div className="flex h-full bg-[#0a0a0a] overflow-hidden">
      {/* Sidebar: danh sách conversations */}
      <AdminSidebar
        rooms={rooms}
        selectedRoomId={selectedRoomId}
        onSelectRoom={setSelectedRoomId}
        loading={roomsLoading}
      />

      {/* Chat area: hiển thị và trả lời */}
      <AdminChatArea
        room={selectedRoom}
        messages={messages}
        onSend={handleSend}
        sending={sending || uploading}
        messagesLoading={messagesLoading}
      />
    </div>
  );
}
