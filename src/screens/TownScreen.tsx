import { useEffect, useMemo, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { LOCATIONS } from '../data/locations';
import { CHARACTERS } from '../data/characters';
import { QUESTS } from '../data/quests';
import { audioManager } from '../utils/audioManager';

interface MapSpot {
  id: string;
  label: string;
  x: number;
  y: number;
  npcId?: string;
  kind: 'poi' | 'npc';
}

const JIAXING_SPOTS: MapSpot[] = [
  { id: 'inn', label: '悦来客栈', x: 24, y: 58, npcId: 'innkeeper', kind: 'npc' },
  { id: 'market', label: '河街集市', x: 60, y: 44, npcId: 'merchant', kind: 'npc' },
  { id: 'story', label: '茶楼书棚', x: 42, y: 28, npcId: 'jiaxing_storyteller', kind: 'npc' },
  { id: 'yamen', label: '巡捕岗亭', x: 74, y: 28, npcId: 'jiaxing_constable', kind: 'npc' },
  { id: 'dockman', label: '乌篷船埠', x: 76, y: 72, npcId: 'jiaxing_boatman', kind: 'npc' },
  { id: 'clinic', label: '月河药铺', x: 18, y: 34, npcId: 'jiaxing_doctor', kind: 'npc' },
  { id: 'yanyu', label: '烟雨楼远眺', x: 56, y: 78, kind: 'poi' },
  { id: 'iron_spear_temple', label: '铁枪庙旧址', x: 10, y: 66, kind: 'poi' },
  { id: 'little_penglai', label: '小蓬莱石坊', x: 88, y: 50, kind: 'poi' },
];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export default function TownScreen() {
  const {
    currentLocation,
    setScreen,
    setCurrentDialogue,
    activeQuests,
    acceptQuest,
    setFlag,
    getFlag,
    addGold,
  } = useGameStore();
  const [message, setMessage] = useState('');
  const [playerPos, setPlayerPos] = useState({ x: 36, y: 62 });

  const location = LOCATIONS[currentLocation];
  const isJiaxing = currentLocation === 'jiaxing';

  useEffect(() => {
    const mapped = audioManager.getBGMForLocation(currentLocation) ?? 'town';
    audioManager.playBGM(mapped);
  }, [currentLocation]);

  useEffect(() => {
    if (!isJiaxing) return;
    setPlayerPos({ x: 36, y: 62 });
  }, [isJiaxing]);

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
    audioManager.playSFX('talk');
    setCurrentDialogue(npcId);
    setScreen('dialogue');
  };

  const onQuest = (npcId: string) => {
    const state = npcQuestState[npcId];
    if (!state) return;

    if (state.canGive) {
      const completed = useGameStore.getState().completedQuests;
      const quest = Object.values(QUESTS).find((q) => {
        if (q.giver !== npcId || activeQuests[q.id] || completed.includes(q.id)) return false;
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

  const interactNpc = (npcId: string) => {
    const state = npcQuestState[npcId];
    if (state?.canGive || state?.canComplete) {
      onQuest(npcId);
    }
    onTalk(npcId);
  };

  const triggerPoiEvent = (spot: MapSpot) => {
    const flagKey = `jiaxing.poi.${spot.id}`;
    if (!getFlag(flagKey)) {
      setFlag(flagKey, true);
      if (spot.id === 'yanyu') {
        addGold(20);
        setMessage('你在烟雨楼远眺处发现旧钱囊，获得银两 20。');
      } else if (spot.id === 'iron_spear_temple') {
        setMessage('铁枪庙旧址香火未绝，似乎藏着旧江湖恩怨。');
      } else if (spot.id === 'little_penglai') {
        setMessage('小蓬莱石坊题字残缺，或许与某段旧约有关。');
      } else {
        setMessage(`你调查了 ${spot.label}。`);
      }
    } else {
      setMessage(`你再次来到 ${spot.label}。`);
    }
    setTimeout(() => setMessage(''), 1800);
  };

  const jiaxingNpcSpots = useMemo(
    () => JIAXING_SPOTS.filter((s) => s.kind === 'npc' && s.npcId && npcIds.includes(s.npcId)),
    [npcIds]
  );
  const jiaxingPoiSpots = useMemo(() => JIAXING_SPOTS.filter((s) => s.kind === 'poi'), []);

  const pressedKeysRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!isJiaxing) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        pressedKeysRef.current.add(key);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      pressedKeysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      pressedKeysRef.current.clear();
    };
  }, [isJiaxing]);

  useEffect(() => {
    if (!isJiaxing) return;
    let raf = 0;
    let last = performance.now();
    const speed = 24;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const keys = pressedKeysRef.current;
      let dx = 0;
      let dy = 0;

      if (keys.has('arrowup') || keys.has('w')) dy -= 1;
      if (keys.has('arrowdown') || keys.has('s')) dy += 1;
      if (keys.has('arrowleft') || keys.has('a')) dx -= 1;
      if (keys.has('arrowright') || keys.has('d')) dx += 1;

      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        const step = speed * dt;
        setPlayerPos((prev) => ({
          x: clamp(prev.x + (dx / len) * step, 6, 94),
          y: clamp(prev.y + (dy / len) * step, 8, 92),
        }));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isJiaxing]);

  const nearbySpot = useMemo(() => {
    if (!isJiaxing) return null;
    let nearest: { spot: MapSpot; dist: number } | null = null;
    for (const spot of [...jiaxingNpcSpots, ...jiaxingPoiSpots]) {
      const dist = Math.hypot(playerPos.x - spot.x, playerPos.y - spot.y);
      if (dist <= 8.8 && (!nearest || dist < nearest.dist)) {
        nearest = { spot, dist };
      }
    }
    return nearest?.spot ?? null;
  }, [isJiaxing, jiaxingNpcSpots, jiaxingPoiSpots, playerPos]);

  useEffect(() => {
    if (!isJiaxing) return;
    const onInteract = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'e') return;
      if (!nearbySpot) {
        setMessage('附近没有可互动目标');
        setTimeout(() => setMessage(''), 1200);
        return;
      }
      if (nearbySpot.kind === 'npc' && nearbySpot.npcId) {
        interactNpc(nearbySpot.npcId);
      } else {
        triggerPoiEvent(nearbySpot);
      }
    };

    window.addEventListener('keydown', onInteract);
    return () => window.removeEventListener('keydown', onInteract);
  }, [isJiaxing, nearbySpot]);

  const renderJiaxingMap = () => (
    <div className="relative h-[520px] rounded-xl overflow-hidden border border-gold/30 bg-stone-900 select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(217,119,6,0.2),transparent_42%),radial-gradient(circle_at_82%_78%,rgba(56,189,248,0.18),transparent_46%),linear-gradient(145deg,#171513,#23201d_55%,#1a1815)]" />

      <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M4 76 C 18 70, 34 72, 48 74 C 66 77, 82 73, 96 80" fill="none" stroke="#64748b" strokeWidth="2.2" />
        <path d="M12 30 L30 40 L40 56 L26 62 L12 52 Z" fill="#302c27" opacity="0.55" />
        <path d="M46 24 L64 32 L76 46 L60 54 L46 42 Z" fill="#302c27" opacity="0.52" />
        <path d="M70 22 L84 28 L90 40 L82 52 L70 46 Z" fill="#302c27" opacity="0.5" />
        <path d="M38 34 L48 40 L58 46" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.25" />
      </svg>

      <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded bg-ink-dark/85 border border-gold/30 text-amber-200">
        嘉兴城内图（WASD/方向键移动，E 互动）
      </div>

      {JIAXING_SPOTS.map((spot) => {
        const npc = spot.npcId ? CHARACTERS[spot.npcId] : null;
        const isNear = nearbySpot?.id === spot.id;
        return (
          <button
            key={spot.id}
            onClick={() => {
              if (spot.kind === 'npc' && spot.npcId) interactNpc(spot.npcId);
              else triggerPoiEvent(spot);
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            title={spot.label}
          >
            <span
              className={`block w-4 h-4 rounded-full border-2 transition-all ${
                spot.kind === 'npc'
                  ? isNear
                    ? 'bg-green-400 border-green-100 shadow-[0_0_14px_rgba(74,222,128,0.8)] scale-110'
                    : 'bg-amber-400 border-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.65)] group-hover:scale-125'
                  : isNear
                  ? 'bg-sky-400 border-sky-100 shadow-[0_0_14px_rgba(56,189,248,0.72)] scale-110'
                  : 'bg-sky-400/80 border-sky-100 shadow-[0_0_10px_rgba(56,189,248,0.48)] group-hover:scale-110'
              }`}
            />
            <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap text-[11px] px-2 py-0.5 rounded bg-ink-dark/90 border border-amber-700/30 text-amber-100 opacity-90 group-hover:opacity-100">
              {npc ? `${npc.portrait} ${npc.name}` : spot.label}
            </span>
          </button>
        );
      })}

      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-emerald-500 border-2 border-emerald-100 shadow-[0_0_14px_rgba(16,185,129,0.8)] flex items-center justify-center text-sm"
        style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
        title="主角"
      >
        🧑
      </div>

      {nearbySpot && (
        <div className="absolute bottom-3 left-3 text-xs text-green-300 bg-ink-dark/85 px-2 py-1 rounded border border-green-700/40">
          按 E 互动：{nearbySpot.label}
        </div>
      )}
      <div className="absolute bottom-3 right-3 text-[11px] text-parchment/75 bg-ink-dark/80 px-2 py-1 rounded border border-gold/20">
        金色点: NPC | 蓝色点: 地标
      </div>
    </div>
  );

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
          {message && <p className="mb-4 text-gold">{message}</p>}
          {renderJiaxingMap()}
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
