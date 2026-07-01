import React from 'react';
import { CheckCircle, XCircle, FileText, Image as ImageIcon, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

interface FinanceTabProps {
  financeTabFilter: 'pending' | 'success' | 'rejected';
  setFinanceTabFilter: (val: 'pending' | 'success' | 'rejected') => void;
  loadingUsers: boolean;
  displayedTransactions: any[];
  processingIds: Set<string>;
  handleApproveTransaction: (tx: any, userId: string) => Promise<void>;
  handleRejectTransaction: (tx: any, userId: string) => Promise<void>;
  setSelectedTxDetails: (tx: any) => void;
}

export default function FinanceTab({
  financeTabFilter,
  setFinanceTabFilter,
  loadingUsers,
  displayedTransactions,
  processingIds,
  handleApproveTransaction,
  handleRejectTransaction,
  setSelectedTxDetails,
}: FinanceTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Tab Filter buttons */}
      <div className="flex gap-4 border-b border-[#4f453b]/20 pb-2">
        <button 
          onClick={() => setFinanceTabFilter('pending')}
          className={`px-4 py-2 font-heading text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
            financeTabFilter === 'pending' 
              ? 'text-[#ecbe8e] border-b-2 border-[#ecbe8e]' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          YÊU CẦU CHỜ DUYỆT
          {displayedTransactions.length > 0 && financeTabFilter === 'pending' && (
            <span className="bg-amber-500/10 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/20">
              {displayedTransactions.length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setFinanceTabFilter('success')}
          className={`px-4 py-2 font-heading text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
            financeTabFilter === 'success' 
              ? 'text-[#34d399] border-b-2 border-[#34d399]' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          THÀNH CÔNG
        </button>
        <button 
          onClick={() => setFinanceTabFilter('rejected')}
          className={`px-4 py-2 font-heading text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
            financeTabFilter === 'rejected' 
              ? 'text-rose-400 border-b-2 border-rose-400' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          ĐÃ HỦY
        </button>
      </div>

      {/* Transactions Container */}
      <div className="bg-[#1a1b21] border border-[#4f453b]/40 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs md:text-sm whitespace-nowrap table-auto md:table-fixed">
            <thead className="bg-[#111318] text-[#ecbe8e] text-[10px] uppercase font-black tracking-wider border-b border-[#4f453b]/30">
              <tr>
                <th className="px-4 py-3.5 w-24 font-mono">Mã GD</th>
                <th className="px-4 py-3.5 w-36 font-mono">Thời gian</th>
                <th className="px-4 py-3.5">Tài khoản</th>
                <th className="px-4 py-3.5 w-28">Cổng GD</th>
                <th className="px-4 py-3.5 w-36">Số tiền</th>
                <th className="px-4 py-3.5 w-48 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4f453b]/10">
              {loadingUsers ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-[#ecbe8e]">
                    <svg className="animate-spin h-6 w-6 mx-auto mb-3 text-[#ecbe8e]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    <p className="text-xs font-bold tracking-wider uppercase text-zinc-500">Đang tải cơ sở dữ liệu...</p>
                  </td>
                </tr>
              ) : displayedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-zinc-600">
                    <CheckCircle className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                    <p className="text-xs font-bold tracking-wider uppercase">Không có yêu cầu giao dịch</p>
                  </td>
                </tr>
              ) : (
                displayedTransactions.map((tx) => {
                  const isOverBalance = tx.type === 'withdraw' && tx.amount > tx.userBalance && financeTabFilter === 'pending';
                  return (
                    <tr key={tx.id} className={`transition-colors duration-200 ${isOverBalance ? 'bg-[#f43f5e]/5' : 'hover:bg-white/[0.02]'}`}>
                      
                      {/* Tx ID */}
                      <td className="px-4 py-3 font-mono text-[#ecbe8e] text-xs">
                        #{tx.id ? tx.id.substring(0, 8).toUpperCase() : 'GD-TEMP'}
                      </td>
                      
                      {/* Date */}
                      <td className="px-4 py-3 text-zinc-500 text-[11px] font-medium font-mono">{tx.date}</td>
                      
                      {/* User */}
                      <td className="px-4 py-3 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-[#111318] border border-[#4f453b]/20 flex items-center justify-center text-xs text-[#ecbe8e] shrink-0 font-black">
                            {tx.userName ? tx.userName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate max-w-[120px] md:max-w-[200px] text-xs font-heading font-bold">{tx.userName}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">{tx.userPhone || '---'}</span>
                          </div>
                        </div>
                      </td>
                      
                      {/* Type Gateway */}
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase border block w-max ${
                          tx.type === 'deposit' 
                            ? 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/20' 
                            : tx.type === 'withdraw' 
                            ? 'bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/20' 
                            : 'bg-[#abc7ff]/10 text-[#abc7ff] border-[#abc7ff]/20'
                        }`}>
                          {tx.type === 'deposit' ? 'NẠP TIỀN' : tx.type === 'withdraw' ? 'RÚT TIỀN' : 'ĐẦU TƯ'}
                        </span>
                      </td>
                      
                      {/* Amount */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-heading text-xs font-extrabold text-white">
                            {tx.amount?.toLocaleString('vi-VN')} đ
                          </span>
                          {isOverBalance && (
                            <span className="text-[8px] text-rose-400 font-bold mt-0.5 bg-rose-500/20 px-1 py-0.5 rounded border border-rose-500/30 w-max">
                              [SỐ DƯ KHÔNG ĐỦ]
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        {financeTabFilter === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setSelectedTxDetails(tx)}
                              className="px-2.5 py-1 text-[10px] font-bold rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 transition-colors uppercase tracking-wider"
                            >
                              Chi tiết
                            </button>
                            <button 
                              onClick={() => handleRejectTransaction(tx, tx.userId)}
                              disabled={processingIds.has(tx.id)}
                              className="px-2.5 py-1 text-[10px] font-bold rounded bg-[#f43f5e]/10 hover:bg-[#f43f5e] text-[#f43f5e] hover:text-white border border-[#f43f5e]/20 transition-colors uppercase tracking-wider"
                            >
                              Từ chối
                            </button>
                            <button 
                              onClick={() => handleApproveTransaction(tx, tx.userId)}
                              disabled={processingIds.has(tx.id)}
                              className="px-2.5 py-1 text-[10px] font-bold rounded bg-[#34d399] hover:bg-[#34d399]/80 text-[#000D1A] transition-colors uppercase tracking-wider"
                            >
                              {processingIds.has(tx.id) ? '...' : 'Duyệt'}
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end items-center gap-3">
                            <button 
                              onClick={() => setSelectedTxDetails(tx)}
                              className="px-2.5 py-1 text-[10px] font-bold rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 transition-colors uppercase tracking-wider"
                            >
                              Xem
                            </button>
                            <span className={`font-heading text-xs font-bold uppercase tracking-wider ${financeTabFilter === 'success' ? 'text-[#34d399]' : 'text-[#f43f5e]'}`}>
                              {financeTabFilter === 'success' ? 'Đã duyệt' : 'Từ chối'}
                            </span>
                          </div>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
