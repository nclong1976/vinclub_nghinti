import React, { useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import { UserContext } from './UserContext';

interface AllNewsViewProps {
  onBack: () => void;
  onNavigateNews: (newsId: string) => void;
}

export default function AllNewsView({ onBack, onNavigateNews }: AllNewsViewProps) {
  const { cmsNews, articlesList } = useContext(UserContext);

  // Combine news sources, prioritizing CMS news and avoiding duplicates
  const combined: any[] = [];
  const seenIds = new Set<string>();

  // 1. Add CMS news
  cmsNews.forEach((news: any) => {
    if (news && news.id) {
      seenIds.add(news.id);
      combined.push(news);
    }
  });

  // 2. Add Firestore articles collection (seeded list and user additions)
  articlesList.forEach((news: any) => {
    if (news && news.id && !seenIds.has(news.id)) {
      seenIds.add(news.id);
      combined.push({
        id: news.id,
        title: news.title,
        category: news.category || 'Tin tức',
        image: news.imageUrl || news.image || 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?q=80&w=800',
        date: news.date || 'Hôm nay',
        content: news.content || '',
        author: news.author || 'Ban Biên Tập'
      });
    }
  });

  // 3. Add original core static news as fallback if they aren't included
  const coreStaticNews = [
    {
      id: 'vf8_2022',
      title: 'Dấu ấn VF 8 2022: Ô tô điện Việt Nam vươn tầm thế giới',
      category: 'Tin tức VinFast',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyCc4Qoq8kyofdXBrLbmR8ddJwJ9-2DPWzDAbrNZZw4q_MoGr1YJVhHZiyOyXdpvpXPb4IN6HKlPvY-EvdqlRkhzt5QXa01EKyRkTJk0UPIrC9lIYL4PkYpnlYgGhQQPKlUrw4_iUQEwOS6rg8ygp9JjELCxtG7rlyCAR4e90sPlOWlAIy9LvjE7UZcrAflzVxVGmwG71pQN92-4dMJSxA6W3DAgkpHAwTzpPNXo4EizkvEmRuowlnHgF-A2wBKekCIHXiTDT6nn0',
      date: '25 Th06, 2026',
      author: 'VinFast News'
    },
    {
      id: 'stations',
      title: 'Hệ thống trạm sạc thông minh phủ sóng toàn quốc',
      category: 'Hệ sinh thái',
      image: 'https://lh3.googleusercontent.com/aida/AP1WRLvZWBkBQLreNDuqVmR_wuzFG0k2QIM1DOMR-ZMpS5DRezuNNzVUVw9lMkWpgxMBFw2g3GJxHyQ8GeWXV_WayZauS5-108wukYNM6c7kffFYnHKVpfqo5T7rCqfyb6iOHbShCIQinH66eyMQ3Wo9ukU4B8GxEyVh6u8ULoJ0pAaIDdlSNe9zQ4I87ME6DUPxcwEtn41fZWZFYDX9RNEnOjjKwRPhezwGNgtGIy78Dl_Yd5HyfgE59oEfDxs',
      date: '24 Th06, 2026',
      author: 'VinFast News'
    },
    {
      id: 'app',
      title: 'Công nghệ điều khiển thông minh qua ứng dụng VinFast',
      category: 'Công nghệ',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3pApHIixibJvbua8jNv134XdqsMGn1bWVL41PCtaMTTiyADwdVHFr4MdVnHt8Gi2Un6h076SLVLzwmTBWm8Xes4PtgEeVBSHy57ummWSa342XRaO5KP_kogAhDXAteIMejIpXAgMCB9UBzDM7gI-TSoXMajTfFwHdH2H4N6qi_XN23x335eZMwBgiBxu2xnVj2C5RD2Ds8HueAz4XwX8XJgO0B1EKnm9kEk64MCw98bgMfuq6KcIh2DbvrXHv_kmTsN6_2m-Qk9o',
      date: '23 Th06, 2026',
      author: 'VinFast News'
    }
  ];

  coreStaticNews.forEach((news: any) => {
    if (!seenIds.has(news.id)) {
      seenIds.add(news.id);
      combined.push(news);
    }
  });

  const newsList = combined;

  return (
    <div className="bg-[#f7f9fb] min-h-screen text-[#191c1e] font-sans antialiased pb-24 flex flex-col">
      {/* Header */}
      <header className="bg-white text-[#001839] sticky top-0 w-full z-50 flex items-center justify-between px-4 h-16 shadow-sm shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors active:scale-95 duration-200">
          <ArrowLeft className="w-6 h-6 text-[#001839]" />
        </button>
        <h1 className="text-[16px] font-bold tracking-wide uppercase">Tin tức cập nhật</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-2xl mx-auto w-full">
        {newsList.map((news: any) => (
          <div 
            key={news.id}
            onClick={() => onNavigateNews(news.id)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform flex flex-col"
          >
            <div className="aspect-[16/9] w-full bg-gray-200 relative">
              <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#d4a373] text-[10px] font-bold tracking-widest uppercase bg-[#d4a373]/10 px-2 py-0.5 rounded">
                  {news.category}
                </span>
                <span className="text-gray-400 text-[11px] font-medium">{news.date}</span>
              </div>
              <h3 className="font-bold text-gray-900 leading-snug">{news.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
