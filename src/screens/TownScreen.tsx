import { useEffect, useMemo, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { LOCATIONS } from '../data/locations';
import { CHARACTERS } from '../data/characters';
import { QUESTS } from '../data/quests';
import { audioManager } from '../utils/audioManager';
import { TownRenderer, type TownDebugInfo, type TownInteractionTarget } from '../engine/pixi/TownRenderer';

const JIAXING_TRIGGER_LABELS: Record<string, string> = {
  yuelai_inn: '悦来客栈',
  tea_house: '茶楼书棚',
  yamen_post: '巡捕岗亭',
  nanhu_dock: '南湖船埠',
  iron_spear_temple: '铁枪庙旧址',
  little_penglai: '小蓬莱石坊',
  yanyu_tower: '烟雨楼远眺',
};

export default function TownScreen() {
  const {
    currentLocation,
    setScreen,
    activeQuests,
    acceptQuest,
    setFlag,
    getFlag,
    addGold,
  } = useGameStore();
  const [message, setMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState<TownDebugInfo>({
    focused: false,
    nearestId: null,
    nearestKind: null,
    nearestLabel: null,
    nearestDistance: null,
    canInteract: false,
    lastKey: null,
    lastAction: 'init',
    ts: Date.now(),
  });
  const pixiHostRef = useRef<HTMLDivElement | null>(null);
  const interactionHandlerRef = useRef<(target: TownInteractionTarget) => void>(() => undefined);
  const dialogueOpeningRef = useRef(false);

  const location = LOCATIONS[currentLocation];
  const isJiaxing = currentLocation === 'jiaxing';

  useEffect(() => {
    const mapped = audioManager.getBGMForLocation(currentLocation) ?? 'town';
    audioManager.playBGM(mapped);
  }, [currentLocation]);

  const npcIds = location?.npcs ?? [];
  const previousQuestById = useMemo(() => {
    return Object.values(QUESTS).reduce<Record<string, string>>((acc, quest) => {
      if (quest.nextQuest) acc[quest.nextQuest] = quest.id;
      return acc;
    }, {});
  }, []);

  const npcQuestState = useMemo(() => {
    const completed = useGameStore.getState().completedQuests;
    return npcIds.reduce<Record<string, { canGive: boolean; canComplete: boolean }>>((acc, npcId) => {
      const canGive = Object.values(QUESTS).some((q) => {
        if (q.giver !== npcId || activeQuests[q.id] || completed.includes(q.id)) return false;
        const prev = previousQuestById[q.id];
        return !prev || completed.includes(prev);
      });
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
  }, [activeQuests, npcIds, previousQuestById]);

  const onTalk = (npcId: string) => {
    if (dialogueOpeningRef.current) return;
    if (!CHARACTERS[npcId]) {
      setMessage(`NPC 数据缺失: ${npcId}`);
      setTimeout(() => setMessage(''), 1500);
      return;
    }
    dialogueOpeningRef.current = true;
    audioManager.playSFX('talk');
    useGameStore.setState({ currentDialogue: npcId, screen: 'dialogue' });
    window.setTimeout(() => {
      dialogueOpeningRef.current = false;
    }, 280);
  };

  const onQuest = (npcId: string) => {
    const latest = useGameStore.getState();
    const completed = latest.completedQuests;
    const state = {
      canGive: Object.values(QUESTS).some((q) => {
        if (q.giver !== npcId || latest.activeQuests[q.id] || completed.includes(q.id)) return false;
        const prev = previousQuestById[q.id];
        return !prev || completed.includes(prev);
      }),
      canComplete: Object.values(latest.activeQuests).some((quest) => {
        const targetIdx = quest.objectives.findIndex(
          (obj) => (obj.type === 'talk' || obj.type === 'return') && obj.target === npcId
        );
        if (targetIdx < 0) return false;
        return quest.objectives.every((obj, idx) => idx === targetIdx || obj.progress >= (obj.count ?? 1));
      }),
    };
    if (!state) return;

    if (state.canGive) {
      const quest = Object.values(QUESTS).find((q) => {
        if (q.giver !== npcId || latest.activeQuests[q.id] || completed.includes(q.id)) return false;
        const prev = previousQuestById[q.id];
        return !prev || completed.includes(prev);
      });
      if (quest) {
        acceptQuest(quest);
        setMessage(`已接任务: ${quest.name}`);
      }
    } else if (state.canComplete) {
      const { updateQuestProgress, completeQuest, addItem, modifyAffinity } = useGameStore.getState();
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
          useGameStore.getState().gainExp(quest.reward.exp);
          useGameStore.getState().addGold(quest.reward.gold);
          if (quest.reward.item) addItem(quest.reward.item, 1);
          if (quest.reward.affinity) {
            Object.entries(quest.reward.affinity).forEach(([charId, amount]) => modifyAffinity(charId, amount));
          }
          setMessage(`任务完成: ${quest.name}`);
        }
      }
    }

    setTimeout(() => setMessage(''), 2200);
  };

  const progressTalkObjectives = (npcId: string) => {
    const { activeQuests, updateQuestProgress } = useGameStore.getState();
    let updated = false;
    Object.values(activeQuests).forEach((quest) => {
      quest.objectives.forEach((obj, idx) => {
        if (obj.type !== 'talk' || obj.target !== npcId) return;
        const target = obj.count ?? 1;
        if (obj.progress >= target) return;
        updateQuestProgress(quest.id, idx, target);
        updated = true;
      });
    });
    return updated;
  };

  const interactNpc = (npcId: string) => {
    const progressed = progressTalkObjectives(npcId);
    onQuest(npcId);
    if (progressed) {
      setMessage((prev) => prev || '任务进度已更新');
      setTimeout(() => setMessage(''), 1200);
    }
    onTalk(npcId);
  };

  const triggerPoiEventById = (triggerId: string, fallbackLabel: string) => {
    const label = JIAXING_TRIGGER_LABELS[triggerId] ?? fallbackLabel;
    const flagKey = `jiaxing.poi.${triggerId}`;

    if (!getFlag(flagKey)) {
      setFlag(flagKey, true);
      if (triggerId === 'yanyu_tower') {
        addGold(20);
        setMessage('你在烟雨楼远眺处发现旧钱囊，获得银两 20。');
      } else if (triggerId === 'iron_spear_temple') {
        setMessage('铁枪庙旧址香火未绝，似乎藏着旧江湖恩怨。');
      } else if (triggerId === 'little_penglai') {
        setMessage('小蓬莱石坊题字残缺，或许与某段旧约有关。');
      } else {
        setMessage(`你调查了 ${label}。`);
      }
    } else {
      setMessage(`你再次来到 ${label}。`);
    }

    setTimeout(() => setMessage(''), 1800);
  };

  interactionHandlerRef.current = (target: TownInteractionTarget) => {
    if (dialogueOpeningRef.current) return;
    if (target.kind === 'npc') {
      if (npcIds.includes(target.id)) {
        interactNpc(target.id);
        return;
      }
      setMessage(`无法与 ${target.label} 互动。`);
      setTimeout(() => setMessage(''), 1200);
      return;
    }

    triggerPoiEventById(target.id, target.label);
  };

  useEffect(() => {
    if (!isJiaxing || !pixiHostRef.current) return;
    const savedPos = (() => {
      const raw = getFlag('jiaxing.playerTile');
      if (typeof raw !== 'string') return undefined;
      const [sx, sy] = raw.split(',').map((v) => Number(v.trim()));
      if (!Number.isFinite(sx) || !Number.isFinite(sy)) return undefined;
      return { x: sx, y: sy };
    })();

    const renderer = new TownRenderer({
      onInteract: (target) => interactionHandlerRef.current(target),
      onDebug: (info) => setDebugInfo(info),
      initialPlayerTile: savedPos,
    });

    renderer.mount(pixiHostRef.current).catch((error: unknown) => {
      const msg = error instanceof Error ? error.message : 'unknown error';
      setMessage(`Pixi 初始化失败: ${msg}`);
    });

    return () => {
      try {
        const pos = renderer.getPlayerTilePosition();
        if (pos) {
          setFlag('jiaxing.playerTile', `${pos.x},${pos.y}`);
        }
        renderer.destroy();
      } catch (error) {
        console.error('Town renderer destroy failed:', error);
      }
    };
  }, [getFlag, isJiaxing, setFlag]);

  if (isJiaxing) {
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
          {message && <p className="mb-4 text-gold text-lg">{message}</p>}

          <div className="relative h-[720px] rounded-xl overflow-hidden border border-gold/30 bg-stone-900 select-none">
            <div ref={pixiHostRef} className="absolute inset-0" />

            <div className="pointer-events-none absolute top-3 left-3 text-sm px-3 py-1.5 rounded bg-ink-dark/85 border border-gold/30 text-amber-200">
              嘉兴城内图（WASD/方向键移动，空格互动）
            </div>

            <div className="pointer-events-none absolute bottom-3 right-3 text-sm text-parchment/75 bg-ink-dark/80 px-3 py-1.5 rounded border border-gold/20">
              金色方块: NPC | 蓝色方块: 地标
            </div>

            <div className="pointer-events-none absolute left-3 bottom-3 max-w-[55%] text-xs leading-5 bg-black/70 border border-green-600/60 text-green-200 rounded px-3 py-2">
              <div>DEBUG 焦点: {debugInfo.focused ? '画布已聚焦' : '未聚焦(先点击地图)'}</div>
              <div>DEBUG 最近目标: {debugInfo.nearestLabel ?? '-'} [{debugInfo.nearestKind ?? '-'}]</div>
              <div>DEBUG 目标ID: {debugInfo.nearestId ?? '-'} | 距离: {debugInfo.nearestDistance?.toFixed(1) ?? '-'}</div>
              <div>DEBUG 可交互: {debugInfo.canInteract ? '是' : '否'} | 按键: {debugInfo.lastKey ?? '-'}</div>
              <div>DEBUG 最后动作: {debugInfo.lastAction}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
