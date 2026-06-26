import { useContext } from 'react';
import { UserContext } from './UserContext';

export default function OrderHistoryTab() {
  const { orderHistory } = useContext(UserContext);

  return (
    <div className="px-4">
      <h3 className="text-[14px] text-zinc-400 mb-4">Lịch sử giao dịch</h3>
      {orderHistory.length === 0 ? (
        <div className="text-center text-zinc-500 py-10">Chưa có giao dịch nào.</div>
      ) : (
        <div className="space-y-3">
          {orderHistory.map(order => (
            <div key={order.id} className="bg-[#1e1e1e] border border-white/5 rounded-xl p-4 flex justify-between items-center">
              <div>
                <div className="font-bold text-[14px]">{order.symbol} - {order.type === 'buy' ? 'Mua' : 'Bán'}</div>
                <div className="text-[12px] text-zinc-400">{order.date}</div>
              </div>
              <div className="text-right">
                <div className={`font-bold text-[14px] ${order.type === 'buy' ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                  {order.type === 'buy' ? '-' : '+'}{order.quantity}
                </div>
                <div className="text-[12px] text-zinc-400">Giá: {new Intl.NumberFormat('vi-VN').format(order.price)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
