import React, { useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import { UserContext } from './UserContext';
import viettelIdcImage from '../assets/images/regenerated_image_1782460662494.jpg';

interface AllNewsViewProps {
  onBack: () => void;
  onNavigateNews: (newsId: string) => void;
}

export default function AllNewsView({ onBack, onNavigateNews }: AllNewsViewProps) {
  const { cmsNews, articlesList } = useContext(UserContext);

  // Combine news sources, prioritizing CMS news and avoiding duplicates
  const combined: any[] = [];
  const seenIds = new Set<string>();

  // Use only CMS news managed by Admin
  (cmsNews || []).forEach((news: any) => {
    if (news && news.id) {
      if (!seenIds.has(news.id)) {
        seenIds.add(news.id);
        combined.push(news);
      }
    }
  });

  const newsList = combined;

  return (
    <div className="bg-[#f7f9fb] h-full overflow-y-auto text-[#191c1e] font-sans antialiased pb-24 flex flex-col">
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
