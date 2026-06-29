import React, { useState, useRef, useEffect } from "react";
import { useMessages } from "../../hooks/useMessages";
import { sendMessageAsUser } from "../../services/chatService";
import { rtdbAuth } from "../../lib/firebase";

export default function UserChat() {
  const currentUser = rtdbAuth.currentUser;
  const userId = currentUser?.uid ?? null;

  const { messages, loading } = useMessages(userId);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !userId || sending) return;
    setSending(true);
    try {
      await sendMessageAsUser(userId, inputText.trim());
      setInputText("");
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
    } finally {
      setSending(false);
    }
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-2">
        <span className="text-3xl">🔒</span>
        <p>Vui lòng đăng nhập để sử dụng chat.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
            AD
          </div>
          <div>
            <h3 className="font-semibold text-sm">Hỗ trợ trực tuyến</h3>
            <p className="text-xs text-blue-100">Thường phản hồi trong vài phút</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-sm">Đang tải...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-2">👋</p>
            <p className="text-gray-500 text-sm">Xin chào! Bạn cần hỗ trợ gì?</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === userId;
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                {!isMine && (
                  <div className="w-7 h-7 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-2 flex-shrink-0 self-end mb-1">
                    AD
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                    isMine
                      ? "bg-blue-500 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border rounded-bl-sm shadow-sm"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${isMine ? "text-blue-100" : "text-gray-400"}`}>
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3 bg-white flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nhập tin nhắn..."
          disabled={sending}
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          disabled={sending || !inputText.trim()}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors flex-shrink-0"
        >
          {sending ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
