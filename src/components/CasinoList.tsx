import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { CasinoGame } from '../types';
import CasinoGameCard from './CasinoGameCard';
import CasinoHeader from './CasinoHeader';

export default function CasinoList({ onBack }: { onBack: () => void }) {
  const [games, setGames] = useState<CasinoGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "casinoGames"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        import('../data').then(({ casinoGames: localGames }) => {
          setGames(localGames.map(g => ({ ...g, status: g.status || 'ACTIVE' })));
          setLoading(false);
        });
        return;
      }
      const gamesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          status: data.status || 'ACTIVE',
          ...data 
        } as CasinoGame;
      });
      gamesData.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      setGames(gamesData);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to casino games:", error);
      import('../data').then(({ casinoGames: localGames }) => {
        setGames(localGames);
        setLoading(false);
      });
    });
    return () => unsubscribe();
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
