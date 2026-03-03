import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ITEMS } from '../data/items';
import { QUESTS } from '../data/quests';
import type { GameScreen, Quest } from '../types';

interface PlayerState {
  name: string;
  level: number;
  exp: number;
  expNext: number;
  hp: number;
  hpMax: number;
  mp: number;
  mpMax: number;
  atk: number;
  def: number;
  spd: number;
  wis: number;
  charm: number;
  fameGood: number;
  fameEvil: number;
  skills: string[];
  equipped: { weapon: string; armor: string; accessory: string };
  charAffinities: Record<string, number>;
  sectAffinities: Record<string, number>;
  // 基础属性（不含装备加成）
  baseStats: {
    atk: number;
    def: number;
    spd: number;
    wis: number;
    charm: number;
    hpMax: number;
    mpMax: number;
  };
}

interface GameStore {
  // 状态
  screen: GameScreen;
  player: PlayerState;
  party: string[];
  inventory: Array<{ id: string; count: number }>;
  gold: number;
  currentLocation: string;
  flags: Record<string, boolean | string | number>;
  activeQuests: Record<string, Quest>;
  completedQuests: string[];
  playTime: number;
  visitedLocations: string[];

  // 动作
  setScreen: (screen: GameScreen) => void;
  addPartyMember: (charId: string) => boolean;
  removePartyMember: (charId: string) => void;
  addItem: (itemId: string, count?: number) => void;
  removeItem: (itemId: string, count?: number) => boolean;
  addGold: (amount: number) => void;
  setLocation: (locationId: string) => void;
  setFlag: (key: string, value: boolean | string | number) => void;
  getFlag: (key: string) => boolean | string | number | undefined;
  modifyReputation: (type: 'good' | 'evil', amount: number) => void;
  modifyAffinity: (charId: string, amount: number) => void;
  modifySectAffinity: (sectId: string, amount: number) => void;
  acceptQuest: (quest: Quest) => void;
  updateQuestProgress: (questId: string, objectiveIdx: number, progress: number) => void;
  completeQuest: (questId: string) => void;
  gainExp: (amount: number) => void;
  healParty: (percent?: number) => void;
  tickPlayTime: (delta: number) => void;
  resetGame: () => void;
  equipItem: (itemId: string, slot: 'weapon' | 'armor' | 'accessory') => void;
  unequipItem: (slot: 'weapon' | 'armor' | 'accessory') => void;
  useItem: (itemId: string) => boolean;
  recalculateStats: () => void;
  // 对话系统
  currentDialogue: string | null;
  setCurrentDialogue: (charId: string | null) => void;
}

const defaultPlayer: PlayerState = {
  name: '侠客',
  level: 1,
  exp: 0,
  expNext: 100,
  hp: 80,
  hpMax: 80,
  mp: 50,
  mpMax: 50,
  atk: 30,
  def: 25,
  spd: 40,
  wis: 35,
  charm: 30,
  fameGood: 0,
  fameEvil: 0,
  skills: ['pu_tong_quan_fa'],
  equipped: { weapon: '', armor: '', accessory: '' },
  charAffinities: {},
  sectAffinities: {},
  baseStats: {
    atk: 30,
    def: 25,
    spd: 40,
    wis: 35,
    charm: 30,
    hpMax: 80,
    mpMax: 50,
  },
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      screen: 'mainmenu',
      player: defaultPlayer,
      party: ['player'],
      inventory: [],
      gold: 100,
      currentLocation: 'jiaxing',
      flags: {},
      activeQuests: {},
      completedQuests: [],
      playTime: 0,
      visitedLocations: ['jiaxing'],
      currentDialogue: null,

      setScreen: (screen) => set({ screen }),

      setCurrentDialogue: (charId) => set({ currentDialogue: charId }),

      addPartyMember: (charId) => {
        const { party } = get();
        if (party.length >= 4 || party.includes(charId)) return false;
        set({ party: [...party, charId] });
        return true;
      },

      removePartyMember: (charId) =>
        set((s) => ({
          party: s.party.filter((id) => id !== charId),
        })),

      addItem: (itemId, count = 1) =>
        set((s) => {
          const inv = [...s.inventory];
          const idx = inv.findIndex((i) => i.id === itemId);
          const nextCount = idx >= 0 ? inv[idx].count + count : count;
          if (idx >= 0) {
            inv[idx] = { ...inv[idx], count: nextCount };
          } else {
            inv.push({ id: itemId, count: nextCount });
          }

          const activeQuests = Object.fromEntries(
            Object.entries(s.activeQuests).map(([questId, quest]) => {
              const objectives = quest.objectives.map((obj) => {
                if (
                  (obj.type === 'collect' || obj.type === 'find') &&
                  obj.target === itemId
                ) {
                  return {
                    ...obj,
                    progress: Math.min(obj.count ?? 1, nextCount),
                  };
                }
                return obj;
              });
              return [questId, { ...quest, objectives }];
            })
          );

          return { inventory: inv, activeQuests };
        }),

      removeItem: (itemId, count = 1) => {
        const inv = get().inventory;
        const item = inv.find((i) => i.id === itemId);
        if (!item || item.count < count) return false;
        set((s) => ({
          inventory: s.inventory
            .map((i) =>
              i.id === itemId ? { ...i, count: i.count - count } : i
            )
            .filter((i) => i.count > 0),
        }));
        return true;
      },

      addGold: (amount) => set((s) => ({ gold: Math.max(0, s.gold + amount) })),

      setLocation: (locationId) =>
        set((s) => {
          const activeQuests = Object.fromEntries(
            Object.entries(s.activeQuests).map(([questId, quest]) => {
              const objectives = quest.objectives.map((obj) => {
                if (
                  (obj.type === 'visit' || obj.type === 'reach') &&
                  obj.target === locationId
                ) {
                  return {
                    ...obj,
                    progress: obj.count ?? 1,
                  };
                }
                return obj;
              });
              return [questId, { ...quest, objectives }];
            })
          );

          return {
            currentLocation: locationId,
            visitedLocations: s.visitedLocations.includes(locationId)
              ? s.visitedLocations
              : [...s.visitedLocations, locationId],
            activeQuests,
          };
        }),

      setFlag: (key, value) =>
        set((s) => ({ flags: { ...s.flags, [key]: value } })),
      getFlag: (key) => get().flags[key],

      modifyReputation: (type, amount) =>
        set((s) => ({
          player: {
            ...s.player,
            fameGood:
              type === 'good'
                ? Math.min(100, Math.max(0, s.player.fameGood + amount))
                : s.player.fameGood,
            fameEvil:
              type === 'evil'
                ? Math.min(100, Math.max(0, s.player.fameEvil + amount))
                : s.player.fameEvil,
          },
        })),

      modifyAffinity: (charId, amount) =>
        set((s) => ({
          player: {
            ...s.player,
            charAffinities: {
              ...s.player.charAffinities,
              [charId]: Math.max(
                -100,
                Math.min(
                  100,
                  (s.player.charAffinities[charId] ?? 0) + amount
                )
              ),
            },
          },
        })),

      modifySectAffinity: (sectId, amount) =>
        set((s) => ({
          player: {
            ...s.player,
            sectAffinities: {
              ...s.player.sectAffinities,
              [sectId]: Math.max(
                -100,
                Math.min(
                  100,
                  (s.player.sectAffinities[sectId] ?? 0) + amount
                )
              ),
            },
          },
        })),

      acceptQuest: (quest) =>
        set((s) => {
          const inventoryCountById = Object.fromEntries(
            s.inventory.map((entry) => [entry.id, entry.count])
          );
          const patchedObjectives = quest.objectives.map((obj) => {
            if (
              (obj.type === 'visit' || obj.type === 'reach') &&
              obj.target === s.currentLocation
            ) {
              return {
                ...obj,
                progress: obj.count ?? 1,
              };
            }

            if (obj.type === 'collect' || obj.type === 'find') {
              const ownedCount = inventoryCountById[obj.target ?? ''] ?? 0;
              if (ownedCount > 0) {
                return {
                  ...obj,
                  progress: Math.min(obj.count ?? 1, ownedCount),
                };
              }
            }

            return obj;
          });

          return {
            activeQuests: {
              ...s.activeQuests,
              [quest.id]: { ...quest, objectives: patchedObjectives },
            },
          };
        }),

      updateQuestProgress: (questId, objectiveIdx, progress) =>
        set((s) => {
          const quest = s.activeQuests[questId];
          if (!quest) return s;
          const objectives = [...quest.objectives];
          objectives[objectiveIdx] = {
            ...objectives[objectiveIdx],
            progress,
          };
          return {
            activeQuests: {
              ...s.activeQuests,
              [questId]: { ...quest, objectives },
            },
          };
        }),

      completeQuest: (questId) =>
        set((s) => {
          const finishedQuest = s.activeQuests[questId];
          const { [questId]: _, ...rest } = s.activeQuests;
          const completedQuests = [...s.completedQuests, questId];
          const nextQuestId = finishedQuest?.nextQuest;
          const shouldUnlockNextQuest =
            !!nextQuestId &&
            !!QUESTS[nextQuestId] &&
            !rest[nextQuestId] &&
            !completedQuests.includes(nextQuestId);

          return {
            activeQuests: shouldUnlockNextQuest
              ? { ...rest, [nextQuestId!]: QUESTS[nextQuestId!] }
              : rest,
            completedQuests,
          };
        }),

      gainExp: (amount) =>
        set((s) => {
          let newExp = s.player.exp + amount;
          let newLevel = s.player.level;
          let newExpNext = s.player.expNext;
          let newHpMax = s.player.baseStats.hpMax;
          let newMpMax = s.player.baseStats.mpMax;

          // 升级循环
          while (newExp >= newExpNext) {
            newExp -= newExpNext;
            newLevel++;
            newExpNext = Math.floor(newExpNext * 1.5);
            newHpMax += 10;
            newMpMax += 5;
          }

          // 计算装备加成
          const equippedStats = { atk: 0, def: 0, spd: 0, wis: 0, charm: 0, hpMax: 0, mpMax: 0 };
          ['weapon', 'armor', 'accessory'].forEach((slot) => {
            const itemId = s.player.equipped[slot as keyof typeof s.player.equipped];
            if (itemId) {
              const item = ITEMS[itemId];
              if (item && item.effect) {
                Object.entries(item.effect).forEach(([key, value]) => {
                  if (typeof value === 'number' && key in equippedStats) {
                    equippedStats[key as keyof typeof equippedStats] += value;
                  }
                });
              }
            }
          });

          const totalHpMax = newHpMax + equippedStats.hpMax;
          const totalMpMax = newMpMax + equippedStats.mpMax;
          const hpLevelGain = Math.max(0, newHpMax - s.player.baseStats.hpMax);
          const mpLevelGain = Math.max(0, newMpMax - s.player.baseStats.mpMax);

          return {
            player: {
              ...s.player,
              exp: newExp,
              level: newLevel,
              expNext: newExpNext,
              baseStats: {
                ...s.player.baseStats,
                hpMax: newHpMax,
                mpMax: newMpMax,
              },
              hpMax: totalHpMax,
              mpMax: totalMpMax,
              hp: Math.min(totalHpMax, s.player.hp + hpLevelGain),
              mp: Math.min(totalMpMax, s.player.mp + mpLevelGain),
            },
          };
        }),

      healParty: () =>
        set((s) => ({
          player: { ...s.player, hp: s.player.hpMax, mp: s.player.mpMax },
        })),

      tickPlayTime: (delta) =>
        set((s) => ({ playTime: s.playTime + delta })),

      resetGame: () =>
        set({
          screen: 'mainmenu',
          player: defaultPlayer,
          party: ['player'],
          inventory: [],
          gold: 100,
          currentLocation: 'jiaxing',
          flags: {},
          activeQuests: {},
          completedQuests: [],
          playTime: 0,
          visitedLocations: ['jiaxing'],
          currentDialogue: null,
        }),

      // 计算装备加成后的属性
      recalculateStats: () => {
        const { player } = get();
        const { equipped, baseStats } = player;

        // 初始化为基础属性
        let bonusAtk = 0, bonusDef = 0, bonusSpd = 0, bonusWis = 0, bonusCharm = 0;
        let bonusHpMax = 0, bonusMpMax = 0;

        // 计算所有装备的加成
        Object.values(equipped).forEach(itemId => {
          if (!itemId) return;
          const item = ITEMS[itemId];
          if (!item || !item.effect) return;

          const effect = item.effect;
          if (effect.atk) bonusAtk += effect.atk as number;
          if (effect.def) bonusDef += effect.def as number;
          if (effect.spd) bonusSpd += effect.spd as number;
          if (effect.wis) bonusWis += effect.wis as number;
          if (effect.charm) bonusCharm += effect.charm as number;
          if (effect.hp) bonusHpMax += effect.hp as number;
          if (effect.mp) bonusMpMax += effect.mp as number;
        });

        // 更新玩家属性
        set((s) => ({
          player: {
            ...s.player,
            atk: baseStats.atk + bonusAtk,
            def: baseStats.def + bonusDef,
            spd: baseStats.spd + bonusSpd,
            wis: baseStats.wis + bonusWis,
            charm: baseStats.charm + bonusCharm,
            hpMax: baseStats.hpMax + bonusHpMax,
            mpMax: baseStats.mpMax + bonusMpMax,
            // 确保当前HP/MP不超过新的最大值
            hp: Math.min(s.player.hp, baseStats.hpMax + bonusHpMax),
            mp: Math.min(s.player.mp, baseStats.mpMax + bonusMpMax),
          },
        }));
      },

      equipItem: (itemId, slot) => {
        const { inventory, player, recalculateStats } = get();
        const hasItem = inventory.find(i => i.id === itemId);
        if (!hasItem) return;

        // 如果该位置已有装备，先卸下
        const currentEquipped = player.equipped[slot];

        set((s) => {
          const newInventory = [...s.inventory];
          // 移除新装备
          const itemIdx = newInventory.findIndex(i => i.id === itemId);
          if (itemIdx >= 0) {
            newInventory[itemIdx] = { ...newInventory[itemIdx], count: newInventory[itemIdx].count - 1 };
            if (newInventory[itemIdx].count <= 0) {
              newInventory.splice(itemIdx, 1);
            }
          }

          // 如果有旧装备，加回背包
          if (currentEquipped) {
            const oldIdx = newInventory.findIndex(i => i.id === currentEquipped);
            if (oldIdx >= 0) {
              newInventory[oldIdx] = { ...newInventory[oldIdx], count: newInventory[oldIdx].count + 1 };
            } else {
              newInventory.push({ id: currentEquipped, count: 1 });
            }
          }

          return {
            inventory: newInventory,
            player: {
              ...s.player,
              equipped: { ...s.player.equipped, [slot]: itemId },
            },
          };
        });

        // 重新计算属性
        recalculateStats();
      },

      unequipItem: (slot) => {
        const { player, recalculateStats } = get();
        const itemId = player.equipped[slot];
        if (!itemId) return;

        set((s) => {
          const newInventory = [...s.inventory];
          const idx = newInventory.findIndex(i => i.id === itemId);
          if (idx >= 0) {
            newInventory[idx] = { ...newInventory[idx], count: newInventory[idx].count + 1 };
          } else {
            newInventory.push({ id: itemId, count: 1 });
          }

          return {
            inventory: newInventory,
            player: {
              ...s.player,
              equipped: { ...s.player.equipped, [slot]: '' },
            },
          };
        });

        // 重新计算属性
        recalculateStats();
      },

      useItem: (itemId) => {
        const { inventory } = get();
        const itemEntry = inventory.find(i => i.id === itemId);
        if (!itemEntry || itemEntry.count <= 0) return false;

        // 这里简单处理，实际应该根据物品效果处理
        set((s) => {
          const newInventory = s.inventory
            .map(i => i.id === itemId ? { ...i, count: i.count - 1 } : i)
            .filter(i => i.count > 0);

          return { inventory: newInventory };
        });

        return true;
      },
    }),
    {
      name: 'jin-yong-save',
      version: 1,
      partialize: (state) => ({
        // 不保存当前屏幕状态，下次打开总是从主菜单开始
        player: state.player,
        party: state.party,
        inventory: state.inventory,
        gold: state.gold,
        currentLocation: state.currentLocation,
        flags: state.flags,
        activeQuests: state.activeQuests,
        completedQuests: state.completedQuests,
        playTime: state.playTime,
        visitedLocations: state.visitedLocations,
      }),
    }
  )
);
