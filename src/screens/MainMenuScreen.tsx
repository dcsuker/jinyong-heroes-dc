import { useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { QUESTS } from '../data/quests';

const SAVE_KEY = 'jin-yong-save';

export default function MainMenuScreen() {
  const { setScreen, resetGame, acceptQuest, playTime, activeQuests, completedQuests, inventory, gold, currentLocation } = useGameStore();
  const [message, setMessage] = useState('');

  const hasProgress = useMemo(() => {
    const persisted = localStorage.getItem(SAVE_KEY);
    const hasStateSnapshot = !!persisted;
    const hasRuntimeProgress =
      playTime > 0 ||
      completedQuests.length > 0 ||
      Object.keys(activeQuests).length > 0 ||
      inventory.length > 0 ||
      gold !== 100 ||
      currentLocation !== 'jiaxing';
    return hasStateSnapshot && hasRuntimeProgress;
  }, [activeQuests, completedQuests.length, currentLocation, gold, inventory.length, playTime]);

  const handleNewGame = () => {
    resetGame();
    const startingQuest = QUESTS['main_01_beginning'];
    if (startingQuest) {
      acceptQuest(startingQuest);
    }
    setScreen('worldmap');
  };

  const handleContinue = () => {
    if (!hasProgress) {
      setMessage('未检测到可继续的进度，请先开始新游戏。');
      return;
    }
    setMessage('');
    setScreen('worldmap');
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-ink via-ink-light to-ink relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-6xl md:text-8xl font-bold text-gold mb-4 tracking-wider drop-shadow-[0_4px_8px_rgba(200,169,110,0.5)]">
          金庸群侠传
        </h1>
        <p className="text-xl md:text-2xl text-parchment/80 tracking-widest font-light">
          飞雪连天射白鹿 笑书神侠倚碧鸳
        </p>
      </div>

      <div className="flex flex-col gap-4 w-64">
        <button
          onClick={handleNewGame}
          className="px-8 py-4 bg-ink-dark border-2 border-gold text-gold text-xl font-bold
                     hover:bg-gold hover:text-ink-dark transition-all duration-300
                     shadow-[0_0_15px_rgba(200,169,110,0.3)] hover:shadow-[0_0_25px_rgba(200,169,110,0.6)]
                     active:scale-95"
        >
          新游戏
        </button>
        <button
          onClick={handleContinue}
          disabled={!hasProgress}
          className={`px-8 py-4 border-2 text-xl font-bold transition-all duration-300 active:scale-95 ${
            hasProgress
              ? 'bg-ink-dark border-gold text-gold hover:bg-gold hover:text-ink-dark shadow-[0_0_15px_rgba(200,169,110,0.3)] hover:shadow-[0_0_25px_rgba(200,169,110,0.6)]'
              : 'bg-stone-800 border-stone-600 text-stone-400 cursor-not-allowed'
          }`}
        >
          继续游戏
        </button>
        <button
          onClick={() => setScreen('character')}
          className="px-8 py-4 bg-ink-dark border-2 border-gold/60 text-gold/80 text-lg font-bold
                     hover:border-gold hover:text-gold transition-all duration-300
                     active:scale-95"
        >
          角色
        </button>
        <button
          onClick={() => window.close()}
          className="px-8 py-4 bg-ink-dark border-2 border-gold/60 text-gold/80 text-lg font-bold
                     hover:border-crimson hover:text-crimson transition-all duration-300
                     active:scale-95"
        >
          退出
        </button>
      </div>

      {message && <p className="mt-4 text-amber-300 text-sm">{message}</p>}

      <div className="absolute bottom-8 text-parchment/40 text-sm">
        v1.0.0 | React + TypeScript + Tailwind CSS
      </div>
    </div>
  );
}
