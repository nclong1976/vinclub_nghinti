import React, { useMemo } from 'react';
import { 
  Users, DollarSign, CheckCircle, ArrowUpRight, TrendingUp
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface OverviewTabProps {
  activeUsersCount: number;
  totalInvestment: number;
}

export default function OverviewTab({ activeUsersCount, totalInvestment }: OverviewTabProps) {
  const dynamicChartData = useMemo(() => {
    return [
      { name: 'Vinpearl', value: totalInvestment * 0.45, color: '#ecbe8e' },
      { name: 'VinFast', value: totalInvestment * 0.25, color: '#abc7ff' },
      { name: 'Vinhomes', value: totalInvestment * 0.20, color: '#34d399' },
      { name: 'Casino', value: totalInvestment * 0.10, color: '#f43f5e' },
    ];
  }, [totalInvestment]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active Users */}
        <div className="bg-[#1a1b21] border border-[#4f453b]/40 p-6 rounded-xl flex flex-col justify-between min-h-[140px] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Users className="w-16 h-16 text-white" />
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-2">ACTIVE MEMBERS</span>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-4xl font-black text-white">{activeUsersCount}</span>
              <span className="text-[#34d399] text-xs font-bold flex items-center bg-[#34d399]/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +14.2%
              </span>
            </div>
          </div>
          <div className="text-[10px] text-zinc-500 mt-4 border-t border-[#4f453b]/10 pt-2 font-semibold">Updated in real-time via Firestore</div>
        </div>

        {/* Total Funds */}
        <div className="bg-[#1a1b21] border border-[#4f453b]/40 p-6 rounded-xl flex flex-col justify-between min-h-[140px] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <DollarSign className="w-16 h-16 text-[#ecbe8e]" />
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-2">TOTAL INVESTMENTS</span>
            <span className="font-heading text-3xl font-black text-[#ecbe8e] truncate block">
              {totalInvestment.toLocaleString('vi-VN')}đ
            </span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-4 border-t border-[#4f453b]/10 pt-2 font-semibold">Combined club wallet deposits</div>
        </div>

        {/* System Uptime */}
        <div className="bg-[#1a1b21] border border-[#4f453b]/40 p-6 rounded-xl flex flex-col justify-between min-h-[140px] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <CheckCircle className="w-16 h-16 text-[#34d399]" />
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-2">SYSTEM INTEGRITY</span>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-4xl font-black text-[#34d399]">99.9%</span>
              <span className="text-[#34d399]/50 text-[10px] font-bold tracking-widest uppercase">ONLINE</span>
            </div>
          </div>
          <div className="text-[10px] text-zinc-500 mt-4 border-t border-[#4f453b]/10 pt-2 font-semibold">Active server endpoints: Live</div>
        </div>

      </div>

      {/* Allocation Chart */}
      <div className="bg-[#1a1b21] border border-[#4f453b]/40 p-6 rounded-xl h-96 flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-heading text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#ecbe8e]" /> PORTFOLIO SECTOR ALLOCATION
          </h3>
          <span className="text-[9px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1 rounded-full uppercase tracking-wider">
            Live telemetry
          </span>
        </div>
        
        <div className="flex-1 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dynamicChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#4f453b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#4f453b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.02)'}}
                contentStyle={{ backgroundColor: '#111318', borderColor: '#4f453b', borderRadius: '4px' }}
                itemStyle={{ color: '#fff', fontSize: '12px' }}
                formatter={(value: any) => [`${value.toLocaleString('vi-VN')} đ`, 'Vốn đầu tư']}
              />
              <Bar dataKey="value" radius={[2, 2, 0, 0]} maxBarSize={50}>
                {dynamicChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
