import React from 'react';
import { ShieldAlert, Clock, User, HardDrive } from 'lucide-react';

interface AuditLogsTabProps {
  auditLogs: any[];
}

export default function AuditLogsTab({ auditLogs }: AuditLogsTabProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center border-b border-[#4f453b]/10 pb-3">
        <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-500" /> Hệ thống giám sát bảo mật
        </h4>
        <span className="text-[9px] font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
          Audit mode enabled
        </span>
      </div>

      <div className="bg-[#1a1b21] border border-[#4f453b]/40 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs md:text-sm whitespace-nowrap table-auto md:table-fixed">
            <thead className="bg-[#111318] text-[#ecbe8e] text-[10px] uppercase font-black tracking-wider border-b border-[#4f453b]/30">
              <tr>
                <th className="px-4 py-3.5 w-44 font-mono">Thời gian</th>
                <th className="px-4 py-3.5 w-48 font-heading">Quản trị viên</th>
                <th className="px-4 py-3.5 font-heading">Hành vi tác động</th>
                <th className="px-4 py-3.5 w-32 font-mono">ID Mục tiêu</th>
                <th className="px-4 py-3.5 w-40 font-mono">Giá trị sau đổi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4f453b]/10 font-mono text-[11px] text-zinc-400">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-zinc-600 font-heading">
                    <ShieldAlert className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                    <p className="text-xs font-bold tracking-wider uppercase">Không có dữ liệu audit logs nào</p>
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.01] transition-colors duration-200">
                    <td className="px-4 py-3 text-zinc-500 text-[11px] font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-600" /> {log.timeFormatted || log.time}
                    </td>
                    <td className="px-4 py-3 font-semibold text-zinc-300">
                      <span className="flex items-center gap-1.5 text-white">
                        <User className="w-3.5 h-3.5 text-[#ecbe8e]" /> {log.adminName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-300 whitespace-normal break-words font-heading text-xs font-medium">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 text-[#ecbe8e] font-mono text-[10px]">
                      {log.targetUserId ? `#${log.targetUserId.substring(0, 8).toUpperCase()}` : '---'}
                    </td>
                    <td className="px-4 py-3 text-[#34d399] font-mono text-[10px] truncate max-w-[150px]" title={log.newValue}>
                      {log.newValue || '---'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
