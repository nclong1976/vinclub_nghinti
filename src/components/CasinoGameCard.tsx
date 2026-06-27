import { CasinoGame } from '../types';
import EditableImage from './EditableImage';

export default function CasinoGameCard({ game }: { game: CasinoGame }) {
  const isClosed = game.status === 'CLOSED';

  return (
    <div className={`bg-zinc-900/40 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full border border-zinc-800/80 group cursor-pointer hover:border-[#c29b57]/30 transition-all duration-300 relative ${isClosed ? 'opacity-65 cursor-not-allowed select-none' : ''}`}>
      <div className="relative aspect-square overflow-hidden bg-zinc-950">
        <EditableImage
          imageKey={`casino-game-${game.id}`}
          defaultSrc={game.imageUrl}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none"></div>
        {isClosed && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center p-3 text-center z-20">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ebd5ad] bg-zinc-900/90 border border-[#D4AF37]/30 py-1.5 px-3 rounded-lg shadow-lg">
              Bảo trì
            </span>
          </div>
        )}
      </div>
      <div className="p-3 bg-zinc-950/40 text-center flex-1 flex items-center justify-center relative z-10 border-t border-zinc-800/40">
        <h3 className="font-bold tracking-wider text-[11.5px] sm:text-[12.5px] text-zinc-100 group-hover:text-[#ebd5ad] transition-colors line-clamp-2 leading-snug uppercase">{game.title}</h3>
      </div>
    </div>
  );
}
