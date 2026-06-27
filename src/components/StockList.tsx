import { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { ChevronLeft } from 'lucide-react';
import { Stock } from '../types';
import { UserContext } from './UserContext';

export default function StockList({ onBack, onSelectStock }: { onBack: () => void, onSelectStock: (stock: Stock) => void }) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const { getAdjustedStocks } = useContext(UserContext);

  useEffect(() => {
    const q = query(collection(db, "stocks"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        import('../data').then(({ stocks: localStocks }) => {
          setStocks(localStocks.map(s => ({ ...s, status: s.status || 'ACTIVE' })));
        });
        return;
      }
      const stocksData = snapshot.docs.map(doc => {
        const data = doc.data();
        return { symbol: doc.id, status: data.status || 'ACTIVE', ...data } as Stock;
      });
      setStocks(stocksData);
    }, (error) => {
      console.error("Error listening to stocks:", error);
      import('../data').then(({ stocks: localStocks }) => {
        setStocks(localStocks);
      });
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#121212] text-white">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3 border-b border-white/10 sticky top-0 bg-[#121212] z-20">
        <button onClick={onBack} className="p-1 -ml-1 hover:bg-white/5 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-[#c29b57]" />
        </button>
        <h2 className="text-[17px] font-medium text-[#c29b57] tracking-wider uppercase">Vingroup Chứng Khoán</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {getAdjustedStocks(stocks).map(stock => (
          <button 
            key={stock.symbol}
            onClick={() => onSelectStock(stock)}
            className="w-full bg-[#1e1e1e] border border-white/5 rounded-xl p-4 flex justify-between items-center hover:bg-[#252525] transition-colors active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#c29b57]/20 border border-[#c29b57]/50 flex items-center justify-center text-[#c29b57] font-bold text-sm shrink-0">
                {stock.symbol}
              </div>
              <div className="text-left">
                <div className="font-bold text-[15px]">{stock.name}</div>
                <div className="text-zinc-400 text-[12px] mt-0.5">{stock.volume}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-[15px]">{new Intl.NumberFormat('vi-VN').format(stock.price)}</div>
              <div className={`text-[12px] font-medium mt-0.5 ${stock.change >= 0 ? 'text-[#00ff00]' : 'text-[#ff4d4f]'}`}>
                {stock.change >= 0 ? '+' : ''}{new Intl.NumberFormat('vi-VN').format(stock.change)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent}%)
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
