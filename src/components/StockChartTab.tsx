import { Heart, AlignJustify, Link2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ResponsiveContainer, XAxis, YAxis, BarChart, Bar, Cell } from 'recharts';
import { Stock } from '../types';
import { generateMockChartData } from '../data';

const CustomCandlestick = (props: any) => {
  const { x, y, width, height, open, close, high, low, max, min, chartHeight } = props;
  const isGrowing = close >= open;
  const color = isGrowing ? '#00ff00' : '#ff4d4f';
  
  // Calculate y positions for high and low based on the scale
  // This is a bit tricky with Recharts Bar custom shape without accessing the scales directly
  // A simpler approach for the custom shape is to let Recharts handle the body and we just draw the wick if possible,
  // or just render the body.
  // Actually, if we pass [Math.min(open, close), Math.max(open, close)] as dataKey, y and height are the body.
  const wickX = x + width / 2;
  
  // Let's just draw the body for now to keep it safe and avoid scale calculation issues inside custom shape
  return (
    <g>
      <rect x={x} y={y} width={width} height={Math.max(height, 1)} fill={color} />
      {/* Wick drawing is complex without the exact scale. We'll skip wicks for a simpler pseudo-candlestick */}
    </g>
  );
};

export default function StockChartTab({ stock }: { stock: Stock }) {
  const [timeframe, setTimeframe] = useState('15m');
  const data = useMemo(() => {
    const rawData = generateMockChartData(stock.price);
    // Format data for Recharts BarChart array format [min, max]
    return rawData.map(d => ({
      ...d,
      body: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
      isGrowing: d.close >= d.open
    }));
  }, [stock.price, timeframe]); // Regenerate on timeframe change for visual effect

  const minPrice = Math.min(...data.map(d => d.low));
  const maxPrice = Math.max(...data.map(d => d.high));
  const isPositive = stock.change >= 0;

  return (
    <div className="px-4">
      {/* Stock Info Header */}
      <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#c29b57] text-black flex items-center justify-center font-bold text-[13px] shrink-0">
              {stock.symbol}
            </div>
            <div>
              <div className="text-[14px] font-medium tracking-wide flex items-center gap-1.5">
                {stock.name} / VND
                <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-[#00ff00]' : 'bg-[#ff4d4f]'}`}></div>
              </div>
            </div>
          </div>
          <button className="text-zinc-400 hover:text-white transition-colors">
            <Heart className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-end gap-3">
          <div className="text-[28px] font-bold leading-none">{new Intl.NumberFormat('vi-VN').format(stock.price)}</div>
          <div className={`text-[13px] font-medium mb-1 ${isPositive ? 'text-[#00ff00]' : 'text-[#ff4d4f]'}`}>
            {isPositive ? '+' : ''}{new Intl.NumberFormat('vi-VN').format(stock.change)} ({isPositive ? '+' : ''}{stock.changePercent}%)
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3 text-zinc-400 text-[12px]">
          <div>Khối lượng: {stock.volume}</div>
          <div>{new Intl.NumberFormat('vi-VN').format(stock.price + 1500)}</div> {/* Just a mock high value display */}
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-[13px] text-zinc-300">Khung thời gian</div>
        <div className="flex items-center gap-4 text-zinc-400">
          <AlignJustify className="w-4 h-4" />
          <Link2 className="w-4 h-4" />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {['1m', '30m', '1h', '15m'].map(tf => (
          <button 
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-1.5 text-[13px] font-medium rounded-lg transition-colors ${timeframe === tf ? 'bg-[#c29b57] text-black' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full bg-[#1e1e1e] rounded-xl border border-white/5 p-2 relative overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <YAxis 
              domain={[minPrice, maxPrice]} 
              tick={{ fill: '#71717a', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              orientation="right"
              tickFormatter={(val) => new Intl.NumberFormat('vi-VN').format(val)}
            />
            <Bar dataKey="body" shape={<CustomCandlestick />}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isGrowing ? '#00ff00' : '#ff4d4f'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Mock current price label */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#00ff00] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-l-sm">
          {new Intl.NumberFormat('vi-VN').format(stock.price)}
        </div>
      </div>
    </div>
  );
}
