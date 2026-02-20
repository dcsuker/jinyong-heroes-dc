/**
 * 金庸群侠传 - 游戏全局状态管理
 */

import { create } from 'zustand'
import { GameMode, GameSettings } from '@/types'

/** 游戏设置默认值 */
const DEFAULT_SETTINGS: GameSettings = {
  musicVolume: 0.7,
  sfxVolume: 0.8,
  textSpeed: 50,
  fullscreen: false,
}

/** 游戏全局状态接口 */
interface GameState {
  /** 当前游戏模式 */
  gameMode: GameMode
  /** 游戏设置 */
  settings: GameSettings
  /** 是否已加载完成 */
  isLoaded: boolean
  /** 设置游戏模式 */
  setGameMode: (mode: GameMode) => void
  /** 更新设置 */
  updateSettings: (settings: Partial<GameSettings>) => void
  /** 标记为已加载 */
  setLoaded: () => void
}

/** 创建游戏 Store */
export const useGameStore = create<GameState>((set) => ({
  gameMode: GameMode.MENU,
  settings: DEFAULT_SETTINGS,
  isLoaded: false,

  setGameMode: (mode) => set({ gameMode: mode }),

  updateSettings: (settings) => set((state) => ({
    settings: { ...state.settings, ...settings },
  })),

  setLoaded: () => set({ isLoaded: true }),
}))
