import React, { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, Paperclip, Image as ImageIcon } from "lucide-react";
import { useChatRooms } from "../../hooks/useChatRooms";
import { useMessages } from "../../hooks/useMessages";
import { useUsers } from "../../hooks/useUsers";
import { sendMessageAsAdmin, markRoomAsReadByAdmin } from "../../services/chatService";
import { rtdb } from "../../lib/firebase";
import { ref, update, onValue } from "firebase/database";

export default function AdminChatSupport() {
  const { rooms, loading: roomsLoading } = useChatRooms();
  const { users } = useUsers();
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const { messages, loading: msgsLoading } = useMessages(activeUserId);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageIconClick = () => {
    imageInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeUserId) return;
    const file = files[0];

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Url = event.target?.result as string;
      if (!base64Url) return;

      let type: 'image' | 'video' | 'file' = 'file';
      if (file.type.startsWith('image/')) {
        type = 'image';
      } else if (file.type.startsWith('video/')) {
        type = 'video';
      }

      setSending(true);
      try {
        await sendMessageAsAdmin(activeUserId, "admin", file.name, type, base64Url, file.name);
      } catch (err) {
        console.error("Lỗi gửi tập tin admin:", err);
      } finally {
        setSending(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const [threadStatuses, setThreadStatuses] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Listen to thread statuses in RTDB
    const statusesRef = ref(rtdb, "chat_statuses");
    const handleSnapshot = (snapshot: any) => {
      if (snapshot.exists()) {
        setThreadStatuses(snapshot.val());
      } else {
        setThreadStatuses({});
      }
    };
    onValue(statusesRef, handleSnapshot);
  }, []);

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
      await sendMessageAsAdmin(activeUserId, "admin", inputText.trim());
      setInputText("");
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
    } finally {
      setSending(false);
    }
  };

  const handleToggleThreadStatus = async (userId: string) => {
    const current = threadStatuses[userId] || "pending";
    const nextStatus = current === "pending" ? "completed" : "pending";
    await update(ref(rtdb, `chat_statuses`), {
      [userId]: nextStatus,
    });
  };

  const getUserInfo = (userId: string) => {
    const user = users.find((u) => u.uid === userId);
    return {
      displayName: user ? user.displayName : userId.replace(/_/g, "."),
      email: user ? user.email : userId.replace(/_/g, "."),
    };
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-row bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg font-sans">
      {/* Chat Threads Sidebar */}
      <div className="w-[260px] flex-shrink-0 border-r border-zinc-850 flex flex-col bg-zinc-950/30">
        <div className="p-4 border-b border-zinc-850">
          <h3 className="font-bold text-[#ebd5ad] font-['Montserrat'] tracking-wide uppercase text-xs">Kênh hỗ trợ chat</h3>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase font-semibold">Tất cả cuộc hội thoại</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-850/60">
          {roomsLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-850/40">
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
                    <div className="h-2 bg-zinc-800/60 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-[#c29b57]/20 border border-[#c29b57]/10 rounded w-8 shrink-0"></div>
                </div>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="p-8 text-center text-zinc-650 text-xs">
              Không có cuộc trò chuyện nào.
            </div>
          ) : (
            rooms.map((room) => {
              const { displayName } = getUserInfo(room.userId);
              const isSelected = activeUserId === room.userId;
              const status = threadStatuses[room.userId] || "pending";

              return (
                <div
                  key={room.userId}
                  onClick={() => handleSelectRoom(room.userId)}
                  className={`p-4 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected ? "bg-[#c29b57]/10 border-l-[3px] border-[#c29b57]" : "hover:bg-zinc-850/20"
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="font-bold text-zinc-100 flex items-center gap-2">
                      <span className="truncate text-xs">{displayName}</span>
                      {room.unreadByAdmin && (
                        <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-bounce">
                          MỚI
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate mt-1">{room.lastMessage}</p>
                  </div>
                  <span
                    className={`text-[8px] font-black px-2 py-0.5 rounded shrink-0 uppercase tracking-widest ${
                      status === "completed"
                        ? "bg-emerald-950 text-emerald-450 border border-emerald-900"
                        : "bg-amber-950 text-amber-450 border border-amber-900"
                    }`}
                  >
                    {status === "completed" ? "Đã xong" : "Xử lý"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Canvas */}
      <div className="flex-1 min-w-[300px] flex flex-col bg-zinc-900/60 overflow-hidden">
        {activeUserId ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 bg-zinc-950/40 border-b border-zinc-850 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-zinc-100 text-xs">{getUserInfo(activeUserId).displayName}</h4>
                <p className="text-[9px] text-zinc-500 font-mono tracking-wider">{getUserInfo(activeUserId).email}</p>
              </div>

              {/* Toggle Status */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleThreadStatus(activeUserId)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border ${
                    (threadStatuses[activeUserId] || "pending") === "completed"
                      ? "bg-emerald-950 text-emerald-450 border-emerald-900 hover:bg-emerald-900"
                      : "bg-amber-950 text-amber-300 border-amber-900 hover:bg-amber-900"
                  }`}
                >
                  Trạng thái: {(threadStatuses[activeUserId] || "pending") === "completed" ? "Đã hoàn thành ✓" : "Đang xử lý 💬"}
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {msgsLoading ? (
                <p className="text-center text-zinc-650 text-xs py-8">Đang tải tin nhắn...</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-zinc-650 text-xs py-8">Chưa có tin nhắn nào.</p>
              ) : (
                messages.map((msg) => {
                  const isAdminMsg = msg.senderId === "admin";
                  return (
                    <div key={msg.id} className={`flex w-full ${isAdminMsg ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-md flex flex-col gap-1.5 ${
                          isAdminMsg
                            ? "bg-[#c29b57] text-black rounded-tr-sm font-semibold"
                            : "bg-zinc-800 text-zinc-100 rounded-tl-sm border border-zinc-700/60"
                        }`}
                      >
                        {msg.type === 'image' ? (
                          <div className="space-y-1">
                            <img 
                              src={msg.fileUrl} 
                              alt="sent image" 
                              className="max-w-full rounded-lg max-h-60 object-contain cursor-zoom-in" 
                              onClick={() => window.open(msg.fileUrl, '_blank')} 
                            />
                            {msg.text && msg.text !== msg.fileName && <p className="mt-1">{msg.text}</p>}
                          </div>
                        ) : msg.type === 'video' ? (
                          <div className="space-y-1">
                            <video src={msg.fileUrl} controls className="max-w-full rounded-lg max-h-60" />
                            {msg.text && msg.text !== msg.fileName && <p className="mt-1">{msg.text}</p>}
                          </div>
                        ) : msg.type === 'file' ? (
                          <div className={`flex items-center gap-2 p-2 rounded-lg border ${isAdminMsg ? 'bg-black/10 border-black/20' : 'bg-zinc-900/80 border-zinc-700'}`}>
                            <Paperclip className={`w-4 h-4 shrink-0 ${isAdminMsg ? 'text-black' : 'text-[#ebd5ad]'}`} />
                            <div className="min-w-0 flex-1">
                              <p className={`font-bold text-[11px] truncate ${isAdminMsg ? 'text-black' : 'text-zinc-100'}`}>{msg.fileName || 'Tập tin'}</p>
                              <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className={`text-[10px] hover:underline font-extrabold ${isAdminMsg ? 'text-black/80' : 'text-[#c29b57]'}`}>Tải xuống</a>
                            </div>
                          </div>
                        ) : (
                          <p>{msg.text}</p>
                        )}
                        <span className={`text-[8px] self-end mt-0.5 ${isAdminMsg ? "text-black/60" : "text-zinc-500"}`}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : ""}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Chat Reply Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-4 bg-zinc-950/40 border-t border-zinc-850 flex items-center gap-2"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
              <input type="file" ref={imageInputRef} accept="image/*,video/*" onChange={handleFileChange} style={{ display: 'none' }} />
              
              <button 
                type="button"
                onClick={handlePaperclipClick} 
                className="text-zinc-400 hover:text-white transition-colors p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 cursor-pointer shrink-0"
              >
                <Paperclip className="w-4 h-4 transform -rotate-45" />
              </button>
              <button 
                type="button"
                onClick={handleImageIconClick} 
                className="text-zinc-400 hover:text-white transition-colors p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 cursor-pointer shrink-0"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder="Nhập phản hồi hỗ trợ cho hội viên..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={sending}
                className="flex-1 bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:border-[#c29b57] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="bg-[#c29b57] disabled:bg-zinc-800 text-black disabled:text-zinc-600 font-bold text-xs px-5 py-3 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-md shrink-0 self-stretch"
              >
                {sending ? "..." : "Gửi"}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-3 p-6 overflow-hidden">
            <MessageSquare className="w-12 h-12 text-[#c29b57]/60 animate-pulse" />
            <p className="text-xs font-semibold text-center max-w-xs break-words leading-relaxed text-zinc-400">
              Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu hỗ trợ
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
