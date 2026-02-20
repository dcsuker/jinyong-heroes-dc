/**
 * 金庸群侠传 - 玩家状态管理
 */

import { create } from 'zustand'
import { Character, Item, Quest, LocationId, CharacterType } from '@/types'
import { GUO_JING } from '@/data/characters'

/** 玩家状态接口 */
interface PlayerState {
  /** 玩家角色 */
  player: Character
  /** 队伍成员 */
  party: Character[]
  /** 背包物品 */
  inventory: Item[]
  /** 当前所在地 ID */
  currentLocation: LocationId
  /** 已探索的地点 ID 列表 */
  exploredLocations: LocationId[]
  /** 接取的任务列表 */
  quests: Quest[]
  /** 游戏标志（用于剧情分支） */
  flags: Record<string, boolean>
  /** 游戏时间（分钟） */
  playTime: number
  /** 银两数量 */
  silver: number
  /** 金叶数量 */
  gold: number
  /** 设置玩家 */
  setPlayer: (player: Character) => void
  /** 添加队伍成员 */
  addPartyMember: (member: Character) => void
  /** 移除队伍成员 */
  removePartyMember: (memberId: string) => void
  /** 添加物品到背包 */
  addItem: (item: Item, count?: number) => void
  /** 从背包移除物品 */
  removeItem: (itemId: string, count?: number) => boolean
  /** 检查是否有某物品 */
  hasItem: (itemId: string, count?: number) => boolean
  /** 设置当前位置 */
  setCurrentLocation: (locationId: LocationId) => void
  /** 标记地点为已探索 */
  exploreLocation: (locationId: LocationId) => void
  /** 添加任务 */
  addQuest: (quest: Quest) => void
  /** 更新任务状态 */
  updateQuest: (questId: string, updates: Partial<Quest>) => void
  /** 移除任务 */
  removeQuest: (questId: string) => void
  /** 设置游戏标志 */
  setFlag: (flag: string, value: boolean) => void
  /** 检查标志 */
  hasFlag: (flag: string) => boolean
  /** 增加游戏时间 */
  addPlayTime: (minutes: number) => void
  /** 增加银两 */
  addSilver: (amount: number) => void
  /** 减少银两 */
  spendSilver: (amount: number) => boolean
  /** 增加金叶 */
  addGold: (amount: number) => void
  /** 减少金叶 */
  spendGold: (amount: number) => boolean
  /** 重置状态（新游戏） */
  reset: () => void
}

/** 创建初始玩家角色 */
function createInitialPlayer(): Character {
  return {
    ...GUO_JING,
    id: 'player',
    type: CharacterType.PLAYER,
    name: '少侠',
    favorability: 0,
    recruitable: false,
  }
}

/** 创建玩家 Store */
export const usePlayerStore = create<PlayerState>((set, get) => ({
  player: createInitialPlayer(),
  party: [],
  inventory: [],
  currentLocation: 'linan',
  exploredLocations: ['linan'],
  quests: [],
  flags: {},
  playTime: 0,
  silver: 100,
  gold: 10,

  setPlayer: (player) => set({ player }),

  addPartyMember: (member) => set((state) => ({
    party: [...state.party, member],
  })),

  removePartyMember: (memberId) => set((state) => ({
    party: state.party.filter(m => m.id !== memberId),
  })),

  addItem: (item: Item) => set((state) => ({
    inventory: [...state.inventory, { ...item }],
  })),

  removeItem: (itemId: string) => {
    const state = get()
    const index = state.inventory.findIndex(i => i.id === itemId)
    if (index < 0) return false
    set((state) => ({
      inventory: state.inventory.filter((_, i) => i !== index),
    }))
    return true
  },

  hasItem: (itemId, count = 1) => {
    const state = get()
    const item = state.inventory.find(i => i.id === itemId)
    if (!item) return false
    return item.maxStack >= count || count <= 1
  },

  setCurrentLocation: (locationId) => set({ currentLocation: locationId }),

  exploreLocation: (locationId) => set((state) => ({
    exploredLocations: state.exploredLocations.includes(locationId)
      ? state.exploredLocations
      : [...state.exploredLocations, locationId],
  })),

  addQuest: (quest) => set((state) => ({
    quests: [...state.quests, quest],
  })),

  updateQuest: (questId, updates) => set((state) => ({
    quests: state.quests.map(q => q.id === questId ? { ...q, ...updates } : q),
  })),

  removeQuest: (questId) => set((state) => ({
    quests: state.quests.filter(q => q.id !== questId),
  })),

  setFlag: (flag, value) => set((state) => ({
    flags: { ...state.flags, [flag]: value },
  })),

  hasFlag: (flag) => get().flags[flag] || false,

  addPlayTime: (minutes) => set((state) => ({
    playTime: state.playTime + minutes,
  })),

  addSilver: (amount) => set((state) => ({
    silver: state.silver + amount,
  })),

  spendSilver: (amount) => {
    const state = get()
    if (state.silver < amount) return false
    set({ silver: state.silver - amount })
    return true
  },

  addGold: (amount) => set((state) => ({
    gold: state.gold + amount,
  })),

  spendGold: (amount) => {
    const state = get()
    if (state.gold < amount) return false
    set({ gold: state.gold - amount })
    return true
  },

  reset: () => set({
    player: createInitialPlayer(),
    party: [],
    inventory: [],
    currentLocation: 'linan',
    exploredLocations: ['linan'],
    quests: [],
    flags: {},
    playTime: 0,
    silver: 100,
    gold: 10,
  }),
}))
