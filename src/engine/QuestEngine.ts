/**
 * 金庸群侠传 - 任务系统引擎
 * 实现任务接取、追踪、完成等功能
 */

import {
  Quest,
  QuestStatus,
  QuestType,
  CharacterId,
  LocationId,
  ItemId,
} from '@/types'

/** 任务引擎类 */
export class QuestEngine {
  /** 当前任务列表 */
  private quests: Quest[] = []
  /** 任务更新回调 */
  private onUpdate: (quests: Quest[]) => void

  constructor(onUpdate: (quests: Quest[]) => void) {
    this.onUpdate = onUpdate
  }

  /**
   * 添加任务
   */
  addQuest(quest: Quest): void {
    if (!this.quests.find(q => q.id === quest.id)) {
      this.quests.push(quest)
      this.onUpdate([...this.quests])
    }
  }

  /**
   * 移除任务
   */
  removeQuest(questId: string): void {
    this.quests = this.quests.filter(q => q.id !== questId)
    this.onUpdate([...this.quests])
  }

  /**
   * 获取所有任务
   */
  getAllQuests(): Quest[] {
    return [...this.quests]
  }

  /**
   * 获取进行中的任务
   */
  getActiveQuests(): Quest[] {
    return this.quests.filter(q => q.status === QuestStatus.IN_PROGRESS)
  }

  /**
   * 获取已完成的任务
   */
  getCompletedQuests(): Quest[] {
    return this.quests.filter(q => q.status === QuestStatus.COMPLETED)
  }

  /**
   * 根据 ID 获取任务
   */
  getQuestById(questId: string): Quest | undefined {
    return this.quests.find(q => q.id === questId)
  }

  /**
   * 接取任务
   */
  acceptQuest(questId: string): boolean {
    const quest = this.getQuestById(questId)
    if (!quest || quest.status !== QuestStatus.NOT_STARTED) {
      return false
    }

    quest.status = QuestStatus.IN_PROGRESS
    this.onUpdate([...this.quests])
    return true
  }

  /**
   * 完成任务
   */
  completeQuest(questId: string): boolean {
    const quest = this.getQuestById(questId)
    if (!quest || !this.isQuestComplete(questId)) {
      return false
    }

    quest.status = QuestStatus.COMPLETED
    this.onUpdate([...this.quests])
    return true
  }

  /**
   * 失败任务
   */
  failQuest(questId: string): boolean {
    const quest = this.getQuestById(questId)
    if (!quest || quest.status === QuestStatus.COMPLETED) {
      return false
    }

    quest.status = QuestStatus.FAILED
    this.onUpdate([...this.quests])
    return true
  }

  /**
   * 更新任务目标进度
   */
  updateObjective(questId: string, objectiveId: string, progress: number): void {
    const quest = this.getQuestById(questId)
    if (!quest) return

    const objective = quest.objectives.find(o => o.id === objectiveId)
    if (!objective) return

    objective.current = progress
    objective.completed = progress >= objective.required

    // 检查任务是否可以完成
    if (this.isQuestComplete(questId)) {
      quest.status = QuestStatus.IN_PROGRESS // 标记为可完成状态
    }

    this.onUpdate([...this.quests])
  }

  /**
   * 增加任务目标进度
   */
  incrementObjective(questId: string, objectiveId: string, amount: number = 1): void {
    const quest = this.getQuestById(questId)
    if (!quest) return

    const objective = quest.objectives.find(o => o.id === objectiveId)
    if (!objective) return

    objective.current = Math.min(objective.current + amount, objective.required)
    objective.completed = objective.current >= objective.required

    this.onUpdate([...this.quests])
  }

  /**
   * 检查任务是否完成
   */
  isQuestComplete(questId: string): boolean {
    const quest = this.getQuestById(questId)
    if (!quest) return false

    return quest.objectives.every(o => o.completed)
  }

  /**
   * 检查任务目标是否完成
   */
  isObjectiveComplete(questId: string, objectiveId: string): boolean {
    const quest = this.getQuestById(questId)
    if (!quest) return false

    const objective = quest.objectives.find(o => o.id === objectiveId)
    return objective?.completed || false
  }

  /**
   * 检查是否可以接取任务
   */
  canAcceptQuest(questId: string, conditions: {
    requiredQuests?: string[]
    minLevel?: number
    requiredCharacter?: CharacterId
    requiredLocation?: LocationId
    requiredItems?: { itemId: ItemId; count: number }[]
  }): boolean {
    const quest = this.getQuestById(questId)
    if (!quest) return false

    // 检查是否已经接取
    if (quest.status !== QuestStatus.NOT_STARTED) {
      return false
    }

    // 检查前置任务
    if (conditions.requiredQuests) {
      for (const reqQuestId of conditions.requiredQuests) {
        const reqQuest = this.getQuestById(reqQuestId)
        if (!reqQuest || reqQuest.status !== QuestStatus.COMPLETED) {
          return false
        }
      }
    }

    // 检查等级
    if (conditions.minLevel) {
      // 需要玩家等级信息
    }

    return true
  }

  /**
   * 重置任务
   */
  resetQuest(questId: string): void {
    const quest = this.getQuestById(questId)
    if (!quest) return

    quest.status = QuestStatus.NOT_STARTED
    quest.objectives.forEach(o => {
      o.current = 0
      o.completed = false
    })

    this.onUpdate([...this.quests])
  }

  /**
   * 根据类型筛选任务
   */
  getQuestsByType(type: QuestType): Quest[] {
    return this.quests.filter(q => q.type === type)
  }

  /**
   * 清空所有任务
   */
  clearAllQuests(): void {
    this.quests = []
    this.onUpdate([])
  }
}

export default QuestEngine
