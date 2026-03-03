import { useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CHARACTERS } from '../data/characters';

export default function DialogueScreen() {
  const {
    currentDialogue,
    setCurrentDialogue,
    setScreen,
    modifyAffinity,
    addPartyMember,
    player,
  } = useGameStore();

  const [done, setDone] = useState(false);

  const char = currentDialogue ? CHARACTERS[currentDialogue] : null;
  const affinity = useMemo(() => {
    if (!currentDialogue) return 0;
    return player.charAffinities[currentDialogue] ?? 0;
  }, [currentDialogue, player.charAffinities]);

  if (!char) {
    return (
      <div className="w-full h-full bg-ink flex items-center justify-center">
        <button
          onClick={() => setScreen('town')}
          className="px-4 py-2 border border-gold/50 text-gold rounded"
        >
          返回城镇
        </button>
      </div>
    );
  }

  const leave = () => {
    setCurrentDialogue(null);
    setScreen('town');
  };

  const handleFriendly = () => {
    modifyAffinity(char.id, 5);
    setDone(true);
  };

  const handleRecruit = () => {
    const ok = addPartyMember(char.id);
    setDone(ok);
  };

  const handleBattle = () => {
    setCurrentDialogue(null);
    setScreen('battle');
  };

  return (
    <div className="w-full h-full bg-ink flex flex-col">
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-ink-dark border border-gold/30 rounded-lg p-6">
          <h2 className="text-2xl text-gold font-bold mb-2">{char.name}</h2>
          <p className="text-parchment/70 mb-4">好感度: {affinity}</p>
          <p className="text-parchment mb-6">
            {done ? `${char.name} 对你的态度有所变化。` : `${char.description}`}
          </p>

          <div className="flex flex-wrap gap-3">
            <button onClick={handleFriendly} className="px-4 py-2 bg-crimson text-parchment rounded">
              寒暄
            </button>
            {char.recruitable && (
              <button onClick={handleRecruit} className="px-4 py-2 bg-green-700 text-parchment rounded">
                邀请入队
              </button>
            )}
            <button onClick={handleBattle} className="px-4 py-2 border border-red-500/60 text-red-300 rounded">
              切磋
            </button>
            <button onClick={leave} className="px-4 py-2 border border-gold/50 text-gold rounded">
              离开
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}