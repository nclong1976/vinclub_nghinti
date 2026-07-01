// ============================================================
// src/components/chat/types.ts
// Định nghĩa tất cả interface/type cho hệ thống Live Chat
// ============================================================

import { Timestamp } from 'firebase/firestore';

/** Phiên chat của một người dùng */
export interface ChatRoom {
  id: string;               // = userId
  userId: string;
  userName: string;
  userEmail: string;
  status: 'active' | 'closed';
  lastMessage: string;
  lastMessageAt: Timestamp | null;
  unreadByAdmin: number;    // Số tin nhắn user gửi, admin chưa đọc
  avatarUrl?: string;
}

/** Một tin nhắn trong cuộc hội thoại */
export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderType: 'user' | 'admin';
  senderName: string;
  content: string;
  imageUrls: string[];
  isRead: boolean;
  createdAt: Timestamp | null;
}

/** Dữ liệu raw từ Firestore trước khi parse */
export type ChatMessageRaw = Omit<ChatMessage, 'id' | 'createdAt'> & {
  createdAt?: any;
};

export type ChatRoomRaw = Omit<ChatRoom, 'id' | 'lastMessageAt'> & {
  lastMessageAt?: any;
};

/** Props cho ChatInput component */
export interface ChatInputProps {
  onSend: (text: string, imageFiles: File[]) => Promise<void>;
  sending?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

/** Props cho MessageBubble component */
export interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;           // true = tin nhắn của mình (bên phải)
  showAvatar?: boolean;
  agentAvatarUrl?: string;
}

/** Props cho MessageList component */
export interface MessageListProps {
  messages: ChatMessage[];
  currentSenderId: string;
  agentAvatarUrl?: string;
  loading?: boolean;
}

/** Props cho AdminSidebar component */
export interface AdminSidebarProps {
  rooms: ChatRoom[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  loading?: boolean;
}

/** Props cho AdminChatArea component */
export interface AdminChatAreaProps {
  room: ChatRoom | null;
  messages: ChatMessage[];
  onSend: (text: string, imageFiles: File[]) => Promise<void>;
  sending?: boolean;
  messagesLoading?: boolean;
}
