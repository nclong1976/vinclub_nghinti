import { ChevronLeft, Home } from 'lucide-react';
import { useState } from 'react';
import { Stock } from '../types';
import StockChartTab from './StockChartTab';
import StockTradeTab from './StockTradeTab';
import OrderHistoryTab from './OrderHistoryTab';

export default function StockDetail({ stock, onBack, onHome }: { stock: Stock, onBack: () => void, onHome: () => void }) {
  const [activeTab, setActiveTab] = useState<'chart' | 'trade' | 'history'>('chart');

  return (
    <div className="flex flex-col h-full bg-[#121212] text-white">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-white/5 sticky top-0 bg-[#121212] z-20">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1 -ml-1 hover:bg-white/5 rounded-full transition-colors text-[#c29b57]">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-[15px] sm:text-[16px] font-medium text-[#c29b57] tracking-widest uppercase">
            Vingroup Chứng Khoán
          </h2>
        </div>
        <button onClick={onHome} className="p-1 hover:bg-white/5 rounded-full transition-colors text-[#c29b57]">
          <Home className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 py-4 flex gap-2">
        <button 
          onClick={() => setActiveTab('chart')}
          className={`flex-1 py-3 text-[14px] font-medium rounded-xl transition-all ${activeTab === 'chart' ? 'bg-[#c29b57] text-black shadow-[0_2px_10px_rgba(194,155,87,0.3)]' : 'bg-[#1e1e1e] text-zinc-400 border border-white/5 hover:text-zinc-200'}`}
        >
          Biểu đồ
        </button>
        <button 
          onClick={() => setActiveTab('trade')}
          className={`flex-1 py-3 text-[14px] font-medium rounded-xl transition-all ${activeTab === 'trade' ? 'bg-[#c29b57] text-black shadow-[0_2px_10px_rgba(194,155,87,0.3)]' : 'bg-[#1e1e1e] text-zinc-400 border border-white/5 hover:text-zinc-200'}`}
        >
          Giao dịch
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-[14px] font-medium rounded-xl transition-all ${activeTab === 'history' ? 'bg-[#c29b57] text-black shadow-[0_2px_10px_rgba(194,155,87,0.3)]' : 'bg-[#1e1e1e] text-zinc-400 border border-white/5 hover:text-zinc-200'}`}
        >
          Lịch sử
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-8">
        {activeTab === 'chart' ? (
          <StockChartTab stock={stock} />
        ) : activeTab === 'trade' ? (
          <StockTradeTab stock={stock} />
        ) : (
          <OrderHistoryTab />
        )}
      </div>
    </div>
  );
}
