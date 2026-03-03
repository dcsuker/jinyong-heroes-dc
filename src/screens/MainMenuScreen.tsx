import { useGameStore } from '../store/gameStore';
import { QUESTS } from '../data/quests';

export default function MainMenuScreen() {
  const { setScreen, resetGame, acceptQuest } = useGameStore();

  const handleNewGame = () => {
    resetGame();
    // 自动接受初始任务"初入江湖"
    const startingQuest = QUESTS['main_01_beginning'];
    if (startingQuest) {
      acceptQuest(startingQuest);
    }
    setScreen('worldmap');
  };

  const handleContinue = () => {
    setScreen('worldmap');
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-ink via-ink-light to-ink relative overflow-hidden">
      {/* 飘落粒子效果 */}
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

      {/* 标题 */}
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-6xl md:text-8xl font-bold text-gold mb-4 tracking-wider drop-shadow-[0_4px_8px_rgba(200,169,110,0.5)]">
          金庸群侠传
        </h1>
        <p className="text-xl md:text-2xl text-parchment/80 tracking-widest font-light">
          飞雪连天射白鹿 笑书神侠倚碧鸳
        </p>
      </div>

      {/* 按钮列表 */}
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
          className="px-8 py-4 bg-ink-dark border-2 border-gold text-gold text-xl font-bold
                     hover:bg-gold hover:text-ink-dark transition-all duration-300
                     shadow-[0_0_15px_rgba(200,169,110,0.3)] hover:shadow-[0_0_25px_rgba(200,169,110,0.6)]
                     active:scale-95"
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

      {/* 底部版本信息 */}
      <div className="absolute bottom-8 text-parchment/40 text-sm">
        v1.0.0 | React + TypeScript + Tailwind CSS
      </div>
    </div>
  );
}
