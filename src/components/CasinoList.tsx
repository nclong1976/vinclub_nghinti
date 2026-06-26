import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { CasinoGame } from '../types';
import CasinoGameCard from './CasinoGameCard';
import CasinoHeader from './CasinoHeader';

export default function CasinoList({ onBack }: { onBack: () => void }) {
  const [games, setGames] = useState<CasinoGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const q = query(collection(db, "casinoGames"));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          import('../data').then(({ casinoGames: localGames }) => {
            setGames(localGames);
            setLoading(false);
          });
          return;
        }
        const gamesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CasinoGame));
        gamesData.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        setGames(gamesData);
      } catch (error) {
        console.error("Error fetching casino games:", error);
        import('../data').then(({ casinoGames: localGames }) => {
          setGames(localGames);
        });
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0b0b0b] relative">
      <CasinoHeader onBack={onBack} />
      
      <div className="p-3.5 sm:p-4 overflow-y-auto flex-1 pb-28 scrollbar-hide">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
          {games.map(game => (
            <CasinoGameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
}
