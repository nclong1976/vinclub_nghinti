import React, { useState, useRef, useEffect } from "react";
import { useChatRooms } from "../../hooks/useChatRooms";
import { useMessages } from "../../hooks/useMessages";
import { sendMessageAsAdmin, markRoomAsReadByAdmin } from "../../services/chatService";
import { rtdbAuth } from "../../lib/firebase";

export default function AdminChatSupport() {
  const { rooms, loading: roomsLoading } = useChatRooms();
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const { messages, loading: msgsLoading } = useMessages(activeUserId);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const adminId = rtdbAuth.currentUser?.uid ?? "admin";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectRoom = async (userId: string) => {
    setActiveUserId(userId);
    await markRoomAsReadByAdmin(userId);
  };

  const handleSend = async () => {
    if (!inputText.trim() || !activeUserId || sending) return;
    setSending(true);
    try {
      await sendMessageAsAdmin(activeUserId, adminId, inputText.trim());
      setInputText("");
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar: Danh sách phòng chat */}
      <aside className="w-72 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">Hỗ trợ CSKH</h2>
          <p className="text-xs text-gray-500 mt-0.5">{rooms.length} cuộc hội thoại</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {roomsLoading ? (
            <p className="p-4 text-gray-400 text-sm text-center">Đang tải...</p>
          ) : rooms.length === 0 ? (
            <p className="p-4 text-gray-400 text-sm text-center">Chưa có cuộc hội thoại.</p>
          ) : (
            rooms.map((room) => (
              <button
                key={room.userId}
                onClick={() => handleSelectRoom(room.userId)}
                className={`w-full text-left px-4 py-3 border-b hover:bg-blue-50 transition-colors ${
                  activeUserId === room.userId ? "bg-blue-100 border-l-2 border-l-blue-500" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm truncate max-w-[150px]">
                    {room.userId.slice(0, 12)}...
                  </span>
                  {room.unreadByAdmin && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 flex-shrink-0">
                      MỚI
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{room.lastMessage}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {room.updatedAt ? new Date(room.updatedAt).toLocaleTimeString("vi-VN") : ""}
                </p>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Khu vực chat chính */}
      <main className="flex-1 flex flex-col">
        {!activeUserId ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-2">
            <span className="text-4xl">💬</span>
            <p>Chọn một cuộc hội thoại để bắt đầu</p>
          </div>
        ) : (
          <>
            <div className="bg-white border-b px-4 py-3 font-semibold text-gray-700 flex items-center gap-2">
              <span>🧑</span>
              <span>User: {activeUserId}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {msgsLoading ? (
                <p className="text-center text-gray-400 text-sm py-8">Đang tải tin nhắn...</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">Chưa có tin nhắn.</p>
              ) : (
                messages.map((msg) => {
                  const isAdmin = msg.senderId === adminId;
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                          isAdmin
                            ? "bg-blue-500 text-white rounded-br-sm"
                            : "bg-white border text-gray-800 rounded-bl-sm shadow-sm"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${isAdmin ? "text-blue-100" : "text-gray-400"}`}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString("vi-VN") : ""}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>
            <div className="bg-white border-t p-3 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Nhập tin nhắn trả lời..."
                className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                disabled={sending}
              />
              <button
                onClick={handleSend}
                disabled={sending || !inputText.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-full px-5 py-2 text-sm font-medium transition-colors"
              >
                {sending ? "..." : "Gửi"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
