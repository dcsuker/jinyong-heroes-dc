/**
 * 金庸群侠传 - 存档系统
 * 使用 localStorage 实现存档功能
 */

import { SaveData, Character, Quest, LocationId, BagItem } from '@/types'

/** 存档槽位数量 */
const SAVE_SLOTS = 3

/** localStorage 键前缀 */
const SAVE_KEY_PREFIX = 'jinyong_save_'

/**
 * 存档系统类
 */
export class SaveSystem {
  /**
   * 保存游戏到指定槽位
   */
  static save(slot: number, data: SaveData): boolean {
    if (slot < 1 || slot > SAVE_SLOTS) {
      console.error('无效的存档槽位')
      return false
    }

    try {
      const saveData: SaveData = {
        ...data,
        slot,
        timestamp: Date.now(),
      }
      localStorage.setItem(SAVE_KEY_PREFIX + slot, JSON.stringify(saveData))
      return true
    } catch (error) {
      console.error('保存游戏失败:', error)
      return false
    }
  }

  /**
   * 从指定槽位加载游戏
   */
  static load(slot: number): SaveData | null {
    if (slot < 1 || slot > SAVE_SLOTS) {
      console.error('无效的存档槽位')
      return null
    }

    try {
      const saveStr = localStorage.getItem(SAVE_KEY_PREFIX + slot)
      if (!saveStr) {
        return null
      }
      return JSON.parse(saveStr) as SaveData
    } catch (error) {
      console.error('加载游戏失败:', error)
      return null
    }
  }

  /**
   * 删除指定槽位的存档
   */
  static delete(slot: number): boolean {
    if (slot < 1 || slot > SAVE_SLOTS) {
      console.error('无效的存档槽位')
      return false
    }

    try {
      localStorage.removeItem(SAVE_KEY_PREFIX + slot)
      return true
    } catch (error) {
      console.error('删除存档失败:', error)
      return false
    }
  }

  /**
   * 检查指定槽位是否有存档
   */
  static hasSave(slot: number): boolean {
    if (slot < 1 || slot > SAVE_SLOTS) {
      return false
    }
    return localStorage.getItem(SAVE_KEY_PREFIX + slot) !== null
  }

  /**
   * 获取所有存档信息
   */
  static getAllSaves(): Array<{ slot: number; data: SaveData | null }> {
    const saves: Array<{ slot: number; data: SaveData | null }> = []
    for (let i = 1; i <= SAVE_SLOTS; i++) {
      saves.push({
        slot: i,
        data: this.load(i),
      })
    }
    return saves
  }

  /**
   * 格式化时间戳为可读字符串
   */
  static formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  /**
   * 格式化游戏时间为可读字符串
   */
  static formatPlayTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}小时${mins}分钟`
  }

  /**
   * 创建存档数据
   */
  static createSaveData(
    player: Character,
    party: Character[],
    inventory: BagItem[],
    currentLocation: LocationId,
    exploredLocations: LocationId[],
    quests: Quest[],
    playTime: number,
    flags: Record<string, boolean>
  ): SaveData {
    return {
      slot: 0,
      timestamp: 0,
      playTime,
      player,
      party,
      currentLocation,
      inventory,
      exploredLocations,
      quests,
      favorability: {},
      flags,
    }
  }

  /**
   * 清空所有存档
   */
  static clearAll(): void {
    for (let i = 1; i <= SAVE_SLOTS; i++) {
      localStorage.removeItem(SAVE_KEY_PREFIX + i)
    }
  }
}

export default SaveSystem
