import React, { useState, useRef, useEffect, useContext } from "react";
import { 
  Send, Paperclip, Image as ImageIcon, MoreVertical
} from 'lucide-react';
import { UserContext } from "./UserContext";
import { useMessages } from "../hooks/useMessages";
import { sendMessageAsUser, registerUserToDb } from "../services/chatService";

export default function UserChat() {
  const userCtx = useContext(UserContext);
  
  const rawUserId = userCtx?.userId && userCtx.userId !== 'profile' ? userCtx.userId : 'vuhoanglong@vinclub.com';
  // Firebase RTDB keys cannot contain '.', '#', '$', '[', or ']'
  const userId = rawUserId.replace(/[\.\#\$\[\]]/g, "_");
  const userName = userCtx?.displayName || 'Trần Duy Thái';

  const { messages, loading } = useMessages(userId);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isImageOnly: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
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
        await sendMessageAsUser(userId, file.name, type, base64Url, file.name);
      } catch (err) {
        console.error("Lỗi gửi tập tin:", err);
      } finally {
        setSending(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Register user details to RTDB for admin visibility
  useEffect(() => {
    if (userId) {
      registerUserToDb(userId, rawUserId, userName).catch(err => {
        console.error("Error registering user to RTDB:", err);
      });
    }
  }, [userId, rawUserId, userName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || !userId || sending) return;
    setSending(true);
    try {
      await sendMessageAsUser(userId, text.trim());
      setInputText("");
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
    } finally {
      setSending(false);
    }
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  const quickReplies = [
    "Chính sách đầu tư",
    "Voucher Vinpearl",
    "Xác thực tài khoản",
    "Câu hỏi thường gặp"
  ];

  return (
    <div className="flex-1 bg-[#f7f9fb] flex flex-col relative h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#f7f9fb] sticky top-0 z-20 border-b border-[#e0e3e5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#e0e3e5] bg-white flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" alt="Agent" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-[#001839] font-bold text-[18px] font-['Montserrat'] tracking-tight">Investor Support</h1>
        </div>
        <button className="p-2 text-[#43474f] hover:text-[#001839] transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Agent Info Area */}
      <div className="pt-6 pb-4 flex flex-col items-center bg-[#f7f9fb]">
        <h2 className="text-[#001839] text-[24px] font-bold font-['Montserrat'] mb-2">Nguyễn Minh Anh</h2>
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-[#e0e3e5] shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00875A]"></div>
          <span className="text-[#43474f] text-sm font-medium font-['Plus_Jakarta_Sans']">Online</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 pb-4">
        {loading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-sm font-['Plus_Jakarta_Sans']">Đang tải cuộc trò chuyện...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex w-full justify-start mb-6">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white shrink-0 mr-3 self-end border border-[#e0e3e5]">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" alt="Agent" className="w-full h-full object-cover" />
            </div>
            <div className="px-4 py-3.5 max-w-[80%] font-['Plus_Jakarta_Sans'] text-[15px] leading-relaxed shadow-sm bg-white text-[#191c1e] rounded-2xl rounded-tl-sm border border-[#e0e3e5]">
              Xin chào anh {userName.split(' ').pop()}, tôi là Minh Anh từ bộ phận hỗ trợ nhà đầu tư VinClub. Tôi có thể giúp gì cho anh hôm nay?
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.senderId === userId;
            const isNextSameSender = index < messages.length - 1 && messages[index + 1].senderId === msg.senderId;

            return (
              <div key={msg.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} ${isNextSameSender ? 'mb-2' : 'mb-6'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white shrink-0 mr-3 self-end border border-[#e0e3e5]">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" alt="Agent" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div 
                  className={`px-4 py-3.5 max-w-[80%] font-['Plus_Jakarta_Sans'] text-[15px] leading-relaxed shadow-sm ${
                    isUser 
                      ? 'bg-[#001839] text-white rounded-2xl rounded-tr-sm' 
                      : 'bg-white text-[#191c1e] rounded-2xl rounded-tl-sm border border-[#e0e3e5]'
                  }`}
                >
                  {msg.type === 'image' ? (
                    <div className="space-y-1">
                      <img 
                        src={msg.fileUrl} 
                        alt="sent image" 
                        className="max-w-full rounded-lg max-h-60 object-contain cursor-pointer" 
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
                    <div className={`flex items-center gap-2 p-2.5 rounded-lg border ${isUser ? 'bg-white/10 border-white/20' : 'bg-black/5 border-black/10'}`}>
                      <Paperclip className={`w-5 h-5 shrink-0 ${isUser ? 'text-blue-300' : 'text-[#b8860b]'}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`font-semibold text-xs truncate ${isUser ? 'text-white' : 'text-[#001839]'}`}>{msg.fileName || 'Tập tin'}</p>
                        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className={`text-[10px] hover:underline font-bold ${isUser ? 'text-blue-300' : 'text-[#0055c8]'}`}>Tải xuống</a>
                      </div>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                  <span className={`text-[10px] block mt-1 ${isUser ? 'text-blue-200 text-right' : 'text-gray-400'}`}>
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : ""}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-3 flex overflow-x-auto gap-2 no-scrollbar bg-[#f7f9fb] shrink-0">
        {quickReplies.map((reply, idx) => (
          <button 
            key={idx}
            onClick={() => handleSend(reply)}
            className="whitespace-nowrap px-4 py-2 bg-white border border-[#0055c8] text-[#0055c8] rounded-full text-sm font-semibold font-['Plus_Jakarta_Sans'] hover:bg-[#f0f4ff] transition-colors shadow-sm shrink-0"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 bg-[#f7f9fb] border-t border-[#e0e3e5] mb-20 shrink-0">
        <div className="flex items-center gap-2">
          <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e, false)} style={{ display: 'none' }} />
          <input type="file" ref={imageInputRef} accept="image/*,video/*" onChange={(e) => handleFileChange(e, true)} style={{ display: 'none' }} />
          
          <button onClick={handlePaperclipClick} className="text-[#43474f] hover:text-[#001839] transition-colors p-1.5 shrink-0">
            <Paperclip className="w-6 h-6 transform -rotate-45" />
          </button>
          <button onClick={handleImageIconClick} className="text-[#43474f] hover:text-[#001839] transition-colors p-1.5 shrink-0">
            <ImageIcon className="w-6 h-6" />
          </button>
          
          <form onSubmit={onSubmitForm} className="flex-1 flex items-center bg-[#eceef0] rounded-2xl px-4 py-1">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập tin nhắn..."
              disabled={sending}
              className="flex-1 bg-transparent border-none outline-none py-2.5 text-[#191c1e] text-[15px] font-['Plus_Jakarta_Sans'] placeholder:text-[#747780]"
            />
          </form>
          
          <button 
            onClick={() => handleSend(inputText)}
            disabled={!inputText.trim() || sending}
            className="w-12 h-12 bg-[#0055c8] disabled:bg-[#abc7ff] text-white rounded-2xl flex items-center justify-center transition-colors shadow-sm shrink-0 ml-1"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
