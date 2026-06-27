import { Heart, Wallet, Briefcase } from 'lucide-react';
import { useState, useContext } from 'react';
import { Stock } from '../types';
import { UserContext } from './UserContext';

export default function StockTradeTab({ stock }: { stock: Stock }) {
  const [quantity, setQuantity] = useState<number>(0);
  const { placeOrder, balance, portfolio } = useContext(UserContext);

  const isPositive = stock.change >= 0;
  
  // Find current holding of this stock
  const currentHolding = portfolio.find(p => p.symbol === stock.symbol)?.quantity || 0;
  
  const estimatedCost = quantity * stock.price;

  const handleOrder = async (type: 'buy' | 'sell') => {
    if (stock.status === 'CLOSED') {
      alert("Cổ phiếu này đã bị tạm ngừng giao dịch.");
      return;
    }
    if (quantity <= 0) {
        alert("Vui lòng nhập số lượng hợp lệ.");
        return;
    }
    const result = await placeOrder(stock.symbol, quantity, stock.price, type);
    if (result.success) {
        alert("Giao dịch thành công!");
        setQuantity(0); // Reset after success
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

      {/* Account Info Row */}
      <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5 mb-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-[12px] text-zinc-400 mb-1 flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5" /> Số dư khả dụng
          </div>
          <div className="text-[14px] font-bold text-white">
            {new Intl.NumberFormat('vi-VN').format(balance)} VND
          </div>
        </div>
        <div>
          <div className="text-[12px] text-zinc-400 mb-1 flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" /> Số lượng đang nắm giữ
          </div>
          <div className="text-[14px] font-bold text-[#c29b57]">
            {new Intl.NumberFormat('vi-VN').format(currentHolding)} cổ phiếu
          </div>
        </div>
      </div>

      {/* Số lượng mua bán */}
      <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5 mb-24">
        <div className="text-[13px] text-zinc-300 mb-4 flex justify-between">
          <span>Số lượng cổ phiếu (đặt lệnh)</span>
          <span className="text-zinc-500">Giá: {new Intl.NumberFormat('vi-VN').format(stock.price)} VND/CP</span>
        </div>
        
        {/* Input */}
        <div className="relative">
          <input 
            type="text" 
            value={new Intl.NumberFormat('vi-VN').format(quantity)}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setQuantity(Number(val));
            }}
            className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 pl-4 pr-16 text-white font-bold text-[16px] outline-none focus:border-[#c29b57] transition-colors"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium text-[14px]">
            Cổ phiếu
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
          <span className="text-[13px] text-zinc-400">Tổng giá trị ước tính:</span>
          <span className="text-[16px] font-bold text-[#c29b57]">
            {new Intl.NumberFormat('vi-VN').format(estimatedCost)} VND
          </span>
        </div>
      </div>
      
      {/* Trading Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#121212] border-t border-white/5 flex gap-4">
        {stock.status === 'CLOSED' ? (
          <div className="w-full py-4 bg-zinc-800 text-zinc-500 font-bold rounded-xl flex items-center justify-center border border-zinc-700/50 uppercase tracking-wider select-none">
            TẠM NGỪNG GIAO DỊCH
          </div>
        ) : (
          <>
            <button 
                onClick={() => handleOrder('buy')}
                className="flex-1 py-4 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-xl transition-colors cursor-pointer"
            >
                Mua
            </button>
            <button 
                onClick={() => handleOrder('sell')}
                className="flex-1 py-4 bg-[#f43f5e] hover:bg-[#e11d48] text-white font-bold rounded-xl transition-colors cursor-pointer"
            >
                Bán
            </button>
          </>
        )}
      </div>
    </div>
  );
}
