import { Heart } from 'lucide-react';
import { useState, useContext } from 'react';
import { Stock } from '../types';
import { UserContext } from './UserContext';

const PROFIT_RATIOS = [0.05, 0.10, 0.20, 0.30];
const TIMES_1 = [1, 2, 4, 6];
const PROFIT_LEVELS = [0.10, 0.20, 0.30];
const TIMES_2 = [4, 6];

export default function StockTradeTab({ stock }: { stock: Stock }) {
  const [profitRatio, setProfitRatio] = useState<number>(PROFIT_RATIOS[0]);
  const [time1, setTime1] = useState<number>(TIMES_1[0]);
  const [profitLevel, setProfitLevel] = useState<number>(PROFIT_LEVELS[0]);
  const [time2, setTime2] = useState<number>(TIMES_2[0]);
  const [amount, setAmount] = useState<number>(0);
  const { placeOrder } = useContext(UserContext);

  const isPositive = stock.change >= 0;

  // Calculate estimated return.
  const estimatedReturn = amount + (amount * profitRatio);

  const handleOrder = async (type: 'buy' | 'sell') => {
    const quantity = Math.floor(amount / stock.price);
    if (quantity === 0) {
        alert("Số tiền đầu tư không đủ để mua cổ phiếu.");
        return;
    }
    const result = await placeOrder(stock.symbol, quantity, stock.price, type);
    if (result.success) {
        alert("Giao dịch thành công!");
    } else {
        alert(result.message || "Giao dịch thất bại.");
    }
  };

  return (
    <div className="px-4 pb-24">
      {/* Stock Info Row */}
      <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-4 mb-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#c29b57] text-black flex items-center justify-center font-bold text-[14px] shrink-0">
            {stock.symbol}
          </div>
          <div className="text-[15px] font-medium flex items-center gap-2">
            {stock.symbol} / VND
            <span className={isPositive ? 'text-[#00ff00]' : 'text-[#ff4d4f]'}>
              {isPositive ? '+' : ''}{stock.changePercent}%
            </span>
          </div>
        </div>
        <button className="text-zinc-400 hover:text-white transition-colors">
          <Heart className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5 mb-4 space-y-6">
        
        {/* Tỷ lệ lợi nhuận */}
        <div>
          <div className="text-[13px] text-zinc-300 mb-3">Tỷ lệ lợi nhuận</div>
          <div className="flex gap-2">
            {PROFIT_RATIOS.map(ratio => (
              <button 
                key={ratio}
                onClick={() => setProfitRatio(ratio)}
                className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors ${profitRatio === ratio ? 'bg-[#c29b57] text-black' : 'bg-[#2a2a2a] text-zinc-400 hover:bg-[#333]'}`}
              >
                {ratio * 100}%
              </button>
            ))}
          </div>
        </div>

        {/* Thời gian */}
        <div>
          <div className="text-[13px] text-zinc-300 mb-3">Thời gian</div>
          <div className="flex gap-2">
            {TIMES_1.map(t => (
              <button 
                key={t}
                onClick={() => setTime1(t)}
                className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors ${time1 === t ? 'bg-[#c29b57] text-black' : 'bg-[#2a2a2a] text-zinc-400 hover:bg-[#333]'}`}
              >
                {t} Phút
              </button>
            ))}
          </div>
        </div>

        {/* Mức lợi nhuận */}
        <div>
          <div className="text-[13px] text-zinc-300 mb-3">Mức lợi nhuận</div>
          <div className="flex gap-2">
            {PROFIT_LEVELS.map(level => (
              <button 
                key={level}
                onClick={() => setProfitLevel(level)}
                className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors ${profitLevel === level ? 'bg-[#c29b57] text-black' : 'bg-[#2a2a2a] text-zinc-400 hover:bg-[#333]'}`}
              >
                {level * 100}%
              </button>
            ))}
            <div className="flex-1"></div> {/* Spacer to align left */}
          </div>
        </div>

        {/* Thời gian đầu tư */}
        <div>
          <div className="text-[13px] text-zinc-300 mb-3">Thời gian đầu tư</div>
          <div className="flex gap-2">
            {TIMES_2.map(t => (
              <button 
                key={t}
                onClick={() => setTime2(t)}
                className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors ${time2 === t ? 'bg-[#c29b57] text-black' : 'bg-[#2a2a2a] text-zinc-400 hover:bg-[#333]'}`}
              >
                {t} Phút
              </button>
            ))}
            <div className="flex-1"></div>
            <div className="flex-1"></div>
          </div>
        </div>

      </div>

      {/* Số tiền đầu tư */}
      <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5 mb-24">
        <div className="text-[13px] text-zinc-300 mb-4">Số tiền đầu tư</div>
        
        {/* Slider Mockup */}
        <div className="w-full h-1 bg-black rounded-full mb-6 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#c29b57] rounded-full border-2 border-[#1e1e1e]"></div>
          <input 
            type="range" 
            min="0" 
            max="10000000" 
            step="100000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Input */}
        <div className="relative">
          <input 
            type="text" 
            value={new Intl.NumberFormat('vi-VN').format(amount)}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setAmount(Number(val));
            }}
            className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 pl-4 pr-16 text-white font-bold text-[16px] outline-none focus:border-[#c29b57] transition-colors"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium text-[14px]">
            VND
          </div>
        </div>

        <div className="text-right mt-3 text-[#c29b57] text-[13px] font-medium">
          ≈ {new Intl.NumberFormat('vi-VN').format(estimatedReturn)} VND
        </div>
      </div>
      
      {/* Trading Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#121212] border-t border-white/5 flex gap-4">
        <button 
            onClick={() => handleOrder('buy')}
            className="flex-1 py-4 bg-[#10b981] text-white font-bold rounded-xl"
        >
            Mua
        </button>
        <button 
            onClick={() => handleOrder('sell')}
            className="flex-1 py-4 bg-[#f43f5e] text-white font-bold rounded-xl"
        >
            Bán
        </button>
      </div>
    </div>
  );
}
