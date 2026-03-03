import { useEffect, useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { LOCATIONS } from '../data/locations';
import { CHARACTERS } from '../data/characters';
import { QUESTS } from '../data/quests';
import { audioManager } from '../utils/audioManager';

export default function TownScreen() {
  const { currentLocation, setScreen, setCurrentDialogue, activeQuests, acceptQuest } = useGameStore();
  const [message, setMessage] = useState('');

  const location = LOCATIONS[currentLocation];

  useEffect(() => {
    const mapped = audioManager.getBGMForLocation(currentLocation) ?? 'town';
    audioManager.playBGM(mapped);
  }, [currentLocation]);

  const npcIds = location?.npcs ?? [];

  const npcQuestState = useMemo(() => {
    const completed = useGameStore.getState().completedQuests;
    return npcIds.reduce<Record<string, { canGive: boolean; canComplete: boolean }>>((acc, npcId) => {
      const canGive = Object.values(QUESTS).some(
        (q) => q.giver === npcId && !activeQuests[q.id] && !completed.includes(q.id)
      );
      const canComplete = Object.values(activeQuests).some((quest) => {
        const targetIdx = quest.objectives.findIndex(
          (obj) => (obj.type === 'talk' || obj.type === 'return') && obj.target === npcId
        );
        if (targetIdx < 0) return false;
        return quest.objectives.every((obj, idx) => idx === targetIdx || obj.progress >= (obj.count ?? 1));
      });
      acc[npcId] = { canGive, canComplete };
      return acc;
    }, {});
  }, [activeQuests, npcIds]);

  const onTalk = (npcId: string) => {
    audioManager.playSFX('talk');
    setCurrentDialogue(npcId);
    setScreen('dialogue');
  };

  const onQuest = (npcId: string) => {
    const state = npcQuestState[npcId];
    if (!state) return;

    if (state.canGive) {
      const completed = useGameStore.getState().completedQuests;
      const quest = Object.values(QUESTS).find(
        (q) => q.giver === npcId && !activeQuests[q.id] && !completed.includes(q.id)
      );
      if (quest) {
        acceptQuest(quest);
        setMessage(`已接任务: ${quest.name}`);
      }
    } else if (state.canComplete) {
      const { updateQuestProgress, completeQuest, gainExp, addGold, addItem, modifyAffinity } = useGameStore.getState();
      const quest = Object.values(activeQuests).find((q) => {
        const targetIdx = q.objectives.findIndex(
          (obj) => (obj.type === 'talk' || obj.type === 'return') && obj.target === npcId
        );
        if (targetIdx < 0) return false;
        return q.objectives.every((obj, idx) => idx === targetIdx || obj.progress >= (obj.count ?? 1));
      });

      if (quest) {
        quest.objectives.forEach((obj, idx) => {
          if ((obj.type === 'talk' || obj.type === 'return') && obj.target === npcId) {
            updateQuestProgress(quest.id, idx, obj.count ?? 1);
          }
        });
        const updated = useGameStore.getState().activeQuests[quest.id];
        if (updated && updated.objectives.every((obj) => obj.progress >= (obj.count ?? 1))) {
          completeQuest(quest.id);
          gainExp(quest.reward.exp);
          addGold(quest.reward.gold);
          if (quest.reward.item) addItem(quest.reward.item, 1);
          if (quest.reward.affinity) {
            Object.entries(quest.reward.affinity).forEach(([charId, amount]) => modifyAffinity(charId, amount));
          }
          setMessage(`任务完成: ${quest.name}`);
        }
      }
    }

    setTimeout(() => setMessage(''), 2500);
  };

  return (
    <div className="w-full h-full bg-ink flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gold/30 bg-ink-dark">
        <div>
          <h2 className="text-2xl font-bold text-gold">{location?.name ?? currentLocation}</h2>
          <p className="text-parchment/60 text-sm">{location?.description ?? '城镇'}</p>
        </div>
        <button
          onClick={() => setScreen('worldmap')}
          className="px-4 py-2 border border-gold/50 text-gold/70 rounded hover:border-gold hover:text-gold"
        >
          离开
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {message && <p className="mb-4 text-gold">{message}</p>}

        <div className="grid gap-3 max-w-3xl">
          {npcIds.length === 0 && <p className="text-parchment/50">此地暂无可交互 NPC。</p>}

          {npcIds.map((npcId) => {
            const npc = CHARACTERS[npcId];
            if (!npc) return null;
            const questState = npcQuestState[npcId];

            return (
              <div key={npcId} className="bg-ink-dark border border-gold/20 p-4 rounded-lg">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-gold font-bold">{npc.name}</p>
                    <p className="text-parchment/60 text-sm">{npc.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onTalk(npcId)}
                      className="px-3 py-1 bg-crimson text-parchment rounded hover:bg-crimson-light"
                    >
                      对话
                    </button>
                    {(questState?.canGive || questState?.canComplete) && (
                      <button
                        onClick={() => onQuest(npcId)}
                        className="px-3 py-1 bg-gold text-ink-dark rounded hover:opacity-90"
                      >
                        {questState.canGive ? '接任务' : '交任务'}
                      </button>
                    )}
                    <button
                      onClick={() => setScreen('battle')}
                      className="px-3 py-1 border border-red-500/60 text-red-300 rounded hover:bg-red-500/20"
                    >
                      切磋
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}