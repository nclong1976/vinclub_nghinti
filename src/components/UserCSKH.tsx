import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  Send, Paperclip, Image as ImageIcon, MoreVertical, ArrowLeft,
  CheckCircle2, Clock, AlertCircle, FileText, Check
} from 'lucide-react';
import { UserContext } from './UserContext';
import { db } from '../firebase';
import { 
  collection, query, where, orderBy, onSnapshot, addDoc, 
  updateDoc, doc, writeBatch, serverTimestamp 
} from 'firebase/firestore';

export default function UserCSKH({ onBack }: { onBack: () => void }) {
  const userCtx = useContext(UserContext);
  
  // Real-time Chat States
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatText, setChatText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // User Identification mapping
  const userEmail = (userCtx.userId && userCtx.userId !== 'profile') ? userCtx.userId : 'vuhoanglong@vinclub.com';
  const userName = userCtx.displayName || 'Trần Duy Thái';

  const quickReplies = [
    "Chính sách đầu tư",
    "Voucher Vinpearl",
    "Xác thực tài khoản",
    "Câu hỏi thường gặp"
  ];

  // Subscribe to real-time chat messages from Firestore
  useEffect(() => {
    const q = query(
      collection(db, 'chat_messages'),
      where('conversation_id', '==', userEmail),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => {
        const data = d.data();
        let timeStr = '';
        if (data.createdAt) {
          try {
            timeStr = new Date((data.createdAt as any).seconds * 1000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          } catch (e) {
            timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          }
        } else {
          timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        }
        return {
          id: d.id,
          ...data,
          timeFormatted: timeStr
        };
      });
      setChatMessages(msgs);
    }, (error) => {
      console.error("Error subscribing to chat messages in UserCSKH:", error);
    });

    return () => unsubscribe();
  }, [userEmail]);

  // Mark admin messages as read automatically
  useEffect(() => {
    if (chatMessages.length === 0) return;

    const unreadAdminMsgs = chatMessages.filter(
      msg => msg.sender_role === 'admin' && !msg.is_read
    );

    if (unreadAdminMsgs.length > 0) {
      const batch = writeBatch(db);
      unreadAdminMsgs.forEach(msg => {
        const docRef = doc(db, 'chat_messages', msg.id);
        batch.update(docRef, { is_read: true });
      });
      batch.commit().catch(err => console.error("Error marking admin messages as read:", err));
    }
    
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    try {
      setChatText(''); // Snappy typing feel
      
      await addDoc(collection(db, 'chat_messages'), {
        conversation_id: userEmail,
        sender_email: userEmail,
        sender_role: 'user',
        content: text,
        is_read: false,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error sending user message:", err);
      alert("Không gửi được tin nhắn. Vui lòng kiểm tra lại kết nối.");
    }
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(chatText);
  };

  // Mock messages for display if empty
  const displayMessages = chatMessages.length > 0 ? chatMessages : [
    {
      id: 'mock-1',
      sender_role: 'admin',
      content: `Xin chào anh ${userName.split(' ').pop()}, tôi là Minh Anh từ bộ phận hỗ trợ nhà đầu tư VinClub. Tôi có thể giúp gì cho anh hôm nay?`
    }
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
        {displayMessages.map((msg, index) => {
          const isUser = msg.sender_role === 'user';
          const isNextSameSender = index < displayMessages.length - 1 && displayMessages[index + 1].sender_role === msg.sender_role;

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
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-3 flex overflow-x-auto gap-2 no-scrollbar bg-[#f7f9fb] shrink-0">
        {quickReplies.map((reply, idx) => (
          <button 
            key={idx}
            onClick={() => handleSendMessage(reply)}
            className="whitespace-nowrap px-4 py-2 bg-white border border-[#0055c8] text-[#0055c8] rounded-full text-sm font-semibold font-['Plus_Jakarta_Sans'] hover:bg-[#f0f4ff] transition-colors shadow-sm shrink-0"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 bg-[#f7f9fb] border-t border-[#e0e3e5] mb-20 shrink-0">
        <div className="flex items-center gap-2">
          <button className="text-[#43474f] hover:text-[#001839] transition-colors p-1.5 shrink-0">
            <Paperclip className="w-6 h-6 transform -rotate-45" />
          </button>
          <button className="text-[#43474f] hover:text-[#001839] transition-colors p-1.5 shrink-0">
            <ImageIcon className="w-6 h-6" />
          </button>
          
          <form onSubmit={onSubmitForm} className="flex-1 flex items-center bg-[#eceef0] rounded-2xl px-4 py-1">
            <input 
              type="text"
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-transparent border-none outline-none py-2.5 text-[#191c1e] text-[15px] font-['Plus_Jakarta_Sans'] placeholder:text-[#747780]"
            />
          </form>
          
          <button 
            onClick={() => handleSendMessage(chatText)}
            disabled={!chatText.trim()}
            className="w-12 h-12 bg-[#0055c8] disabled:bg-[#abc7ff] text-white rounded-2xl flex items-center justify-center transition-colors shadow-sm shrink-0 ml-1"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
