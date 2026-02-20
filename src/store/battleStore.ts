/**
 * 金庸群侠传 - 战斗状态管理
 */

import { create } from 'zustand'
import { BattleCharacter, BattleState } from '@/types'

/** 战斗状态接口 */
interface BattleStateStore {
  /** 战斗是否正在进行 */
  inBattle: boolean
  /** 当前战斗状态 */
  battleState: BattleState
  /** 玩家队伍 */
  playerTeam: BattleCharacter[]
  /** 敌人队伍 */
  enemyTeam: BattleCharacter[]
  /** 当前行动角色 ID */
  currentActorId: string | null
  /** 战斗日志 */
  battleLogs: string[]
  /** 战斗轮数 */
  round: number
  /** 战斗奖励 */
  rewards: BattleRewards | null
  /** 初始化战斗 */
  startBattle: (playerTeam: BattleCharacter[], enemyTeam: BattleCharacter[]) => void
  /** 结束战斗 */
  endBattle: (state: BattleState, rewards?: BattleRewards) => void
  /** 设置战斗状态 */
  setBattleState: (state: BattleState) => void
  /** 设置当前行动角色 */
  setCurrentActor: (actorId: string | null) => void
  /** 添加战斗日志 */
  addLog: (log: string) => void
  /** 增加轮数 */
  nextRound: () => void
  /** 重置战斗 */
  reset: () => void
}

/** 战斗奖励 */
interface BattleRewards {
  exp: number
  silver: number
  items?: string[]
}

/** 创建战斗 Store */
export const useBattleStore = create<BattleStateStore>((set) => ({
  inBattle: false,
  battleState: BattleState.NOT_STARTED,
  playerTeam: [],
  enemyTeam: [],
  currentActorId: null,
  battleLogs: [],
  round: 0,
  rewards: null,

  startBattle: (playerTeam, enemyTeam) => set({
    inBattle: true,
    battleState: BattleState.PLAYER_TURN,
    playerTeam,
    enemyTeam,
    currentActorId: null,
    battleLogs: ['战斗开始！'],
    round: 1,
    rewards: null,
  }),

  endBattle: (state, rewards) => set({
    inBattle: false,
    battleState: state,
    rewards: rewards || null,
  }),

  setBattleState: (state) => set({ battleState: state }),

  setCurrentActor: (actorId) => set({ currentActorId: actorId }),

  addLog: (log) => set((state) => ({
    battleLogs: [...state.battleLogs, log].slice(-50), // 最多保留 50 条
  })),

  nextRound: () => set((state) => ({
    round: state.round + 1,
  })),

  reset: () => set({
    inBattle: false,
    battleState: BattleState.NOT_STARTED,
    playerTeam: [],
    enemyTeam: [],
    currentActorId: null,
    battleLogs: [],
    round: 0,
    rewards: null,
  }),
}))
