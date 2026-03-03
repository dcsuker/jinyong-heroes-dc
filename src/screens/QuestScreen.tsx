import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { QUESTS } from '../data/quests';
import { CHARACTERS } from '../data/characters';
import { LOCATIONS } from '../data/locations';
import { ITEMS } from '../data/items';

export default function QuestScreen() {
  const { activeQuests, completedQuests, setScreen, currentLocation } = useGameStore();

  const previousQuestById = useMemo(() => {
    return Object.values(QUESTS).reduce<Record<string, string>>((acc, quest) => {
      if (quest.nextQuest) acc[quest.nextQuest] = quest.id;
      return acc;
    }, {});
  }, []);

  const localNpcIds = new Set(LOCATIONS[currentLocation]?.npcs ?? []);

  const questGiverLocation = useMemo(() => {
    return Object.values(QUESTS).reduce<Record<string, string>>((acc, quest) => {
      if (quest.giver === 'system') {
        acc[quest.id] = '系统触发';
        return acc;
      }
      const location = Object.values(LOCATIONS).find((loc) => (loc.npcs ?? []).includes(quest.giver));
      acc[quest.id] = location?.name ?? '未知地点';
      return acc;
    }, {});
  }, []);

  const availableQuests = Object.values(QUESTS).filter((q) => {
    if (activeQuests[q.id] || completedQuests.includes(q.id)) return false;

    const previousQuest = previousQuestById[q.id];
    if (previousQuest && !completedQuests.includes(previousQuest)) return false;

    if (q.giver !== 'system' && !localNpcIds.has(q.giver)) return false;
    return true;
  });

  return (
    <div className="w-full h-full bg-ink flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gold/30 bg-ink-dark">
        <h2 className="text-2xl font-bold text-gold">任务</h2>
        <button
          onClick={() => setScreen('worldmap')}
          className="px-4 py-2 border border-gold/50 text-gold/70 rounded hover:border-gold hover:text-gold"
        >
          返回
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gold mb-4">进行中</h3>
            {Object.values(activeQuests).length > 0 ? (
              <div className="grid gap-4">
                {Object.values(activeQuests).map((quest) => (
                  <div key={quest.id} className="bg-ink-dark border border-gold/30 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-parchment text-lg">{quest.name}</h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            quest.type === 'main' ? 'bg-crimson text-parchment' : 'bg-blue-600 text-parchment'
                          }`}
                        >
                          {quest.type === 'main' ? '主线' : '支线'}
                        </span>
                      </div>
                      <span className="text-gold text-sm">{quest.giver}</span>
                    </div>
                    <p className="text-parchment/80 text-sm mb-3">{quest.description}</p>
                    <div className="space-y-2">
                      {quest.objectives.map((obj, idx) => {
                        const target = obj.target || '';
                        return (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-parchment/60">
                              {obj.type === 'kill' && `击败 ${CHARACTERS[target]?.name || target}`}
                              {obj.type === 'battle' && `战斗击败 ${CHARACTERS[target]?.name || target}`}
                              {obj.type === 'collect' && `收集 ${ITEMS[target]?.name || target}`}
                              {obj.type === 'talk' && `与 ${CHARACTERS[target]?.name || target} 对话`}
                              {obj.type === 'visit' && `前往 ${LOCATIONS[target]?.name || target}`}
                              {obj.type === 'reach' && `到达 ${LOCATIONS[target]?.name || target}`}
                              {obj.type === 'find' && `寻找 ${ITEMS[target]?.name || target}`}
                              {obj.type === 'learn' && `学习 ${target}`}
                              {obj.type === 'puzzle' && `解开 ${target}`}
                              {obj.type === 'return' && `返回找到 ${CHARACTERS[target]?.name || target}`}
                            </span>
                            <span className={obj.progress >= (obj.count || 1) ? 'text-green-400' : 'text-parchment/40'}>
                              {obj.progress}/{obj.count || 1}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gold/20 text-sm text-parchment/60">
                      奖励: {quest.reward.exp} 经验, {quest.reward.gold} 银两
                      {quest.reward.item && `, ${ITEMS[quest.reward.item]?.name || '物品'}`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-parchment/40 text-center py-8">暂无进行中的任务</p>
            )}
          </div>

          {availableQuests.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gold mb-4">可接任务</h3>
              <div className="grid gap-4">
                {availableQuests.slice(0, 5).map((quest) => (
                  <div key={quest.id} className="bg-ink-dark border border-gold/20 p-4 rounded-lg opacity-80">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-parchment">{quest.name}</h4>
                        <p className="text-parchment/60 text-sm mt-1">{quest.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gold/80">
                          {quest.giver === 'system'
                            ? '系统任务，满足条件后自动触发'
                            : `请在城镇与发布人对话接取（${questGiverLocation[quest.id] || '未知地点'}）`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {completedQuests.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gold mb-4">已完成</h3>
              <div className="grid gap-2">
                {completedQuests.map((questId) => {
                  const quest = QUESTS[questId];
                  if (!quest) return null;
                  return (
                    <div
                      key={questId}
                      className="bg-ink-dark/50 border border-gold/10 p-3 rounded flex justify-between items-center"
                    >
                      <span className="text-parchment/60">{quest.name}</span>
                      <span className="text-green-400 text-sm">完成</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
