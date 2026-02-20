/**
 * 金庸群侠传 - 战斗引擎
 * 实现完整的回合制战斗系统
 */

import {
  BattleCharacter,
  BattleAction,
  BattleState,
  Character,
  BattleActionResult,
  BattleActionType,
} from '@/types'
import {
  calculateDamage,
  checkHit,
  checkCrit,
  calculateManaCost,
  createBattleCharacter,
  isAlive,
  dealDamage,
  consumeMana,
  onTurnEnd,
} from '@/utils/formula'
import { randomChoice, chance } from '@/utils/random'
import { getSkillById } from '@/data/skills'

/** 战斗引擎类 */
export class BattleEngine {
  /** 玩家队伍 */
  private playerTeam: BattleCharacter[]
  /** 敌人队伍 */
  private enemyTeam: BattleCharacter[]
  /** 当前战斗状态 */
  private battleState: BattleState
  /** 当前行动角色索引 */
  private currentActorIndex: number
  /** 行动顺序列表 */
  private initiativeOrder: BattleCharacter[]
  /** 战斗日志回调 */
  private onLog: (log: string) => void
  /** 战斗结束回调 */
  private onBattleEnd: (victory: boolean) => void

  constructor(
    playerTeam: Character[],
    enemyTeam: Character[],
    onLog: (log: string) => void,
    onBattleEnd: (victory: boolean) => void
  ) {
    this.playerTeam = playerTeam.map(createBattleCharacter)
    this.enemyTeam = enemyTeam.map(createBattleCharacter)
    this.battleState = BattleState.PLAYER_TURN
    this.onLog = onLog
    this.onBattleEnd = onBattleEnd

    // 计算行动顺序
    this.initiativeOrder = this.calculateInitiativeOrder()
    this.currentActorIndex = 0
  }

  /**
   * 计算行动顺序
   */
  private calculateInitiativeOrder(): BattleCharacter[] {
    const allCharacters = [...this.playerTeam, ...this.enemyTeam]
    return allCharacters
      .filter(isAlive)
      .sort((a, b) => b.initiative - a.initiative)
  }

  /**
   * 获取当前行动角色
   */
  getCurrentActor(): BattleCharacter | null {
    if (this.currentActorIndex >= this.initiativeOrder.length) {
      return null
    }
    return this.initiativeOrder[this.currentActorIndex]
  }

  /**
   * 检查是否是玩家回合
   */
  isPlayerTurn(): boolean {
    const actor = this.getCurrentActor()
    if (!actor) return false
    return this.playerTeam.some(m => m.character.id === actor.character.id)
  }

  /**
   * 执行玩家行动
   */
  executePlayerAction(action: BattleAction): BattleActionResult[] {
    const actor = this.getCurrentActor()
    if (!actor || !this.isPlayerTurn()) {
      return []
    }

    const results: BattleActionResult[] = []

    switch (action.type) {
      case 'attack':
        results.push(this.executeAttack(actor, action.targetIds[0]))
        break
      case 'skill':
        if (action.skillId) {
          results.push(this.executeSkill(actor, action.skillId, action.targetIds))
        }
        break
      case 'item':
        if (action.itemId) {
          results.push(this.useItem(actor, action.itemId, action.targetIds[0]))
        }
        break
      case 'defend':
        results.push(this.executeDefend(actor))
        break
      case 'flee':
        this.tryFlee(actor)
        break
    }

    // 标记角色已行动
    actor.hasActed = true

    // 处理状态效果
    this.processStatusEffects(actor)

    // 检查战斗是否结束
    if (this.checkBattleEnd()) {
      return results
    }

    // 继续下一个角色行动
    this.nextTurn()

    return results
  }

  /**
   * 执行普通攻击
   */
  private executeAttack(attacker: BattleCharacter, targetId: string): BattleActionResult {
    const target = this.findCharacter(targetId)
    if (!target) {
      return {
        characterId: attacker.character.id,
        type: BattleActionType.ATTACK,
        targetIds: [],
        description: `${attacker.character.name} 攻击落空了`,
      }
    }

    // 检查命中
    if (!checkHit(attacker.character, target.character)) {
      this.onLog(`${attacker.character.name} 攻击 ${target.character.name}，但被闪避了！`)
      return {
        characterId: attacker.character.id,
        type: BattleActionType.ATTACK,
        targetIds: [targetId],
        description: `${attacker.character.name} 攻击 ${target.character.name}，但被闪避了`,
      }
    }

    // 计算伤害
    const isCrit = checkCrit(attacker.character)
    const damage = calculateDamage(attacker.character, target.character, undefined, isCrit)
    const actualDamage = dealDamage(target, damage)

    const critText = isCrit ? '（暴击！）' : ''
    this.onLog(`${attacker.character.name} 攻击 ${target.character.name}${critText}，造成${actualDamage}点伤害！`)

    return {
      characterId: attacker.character.id,
      type: BattleActionType.ATTACK,
      targetIds: [targetId],
      damage: actualDamage,
      isCrit,
      description: `${attacker.character.name} 攻击 ${target.character.name}${critText}，造成${actualDamage}点伤害`,
    }
  }

  /**
   * 执行武功
   */
  private executeSkill(
    attacker: BattleCharacter,
    skillId: string,
    targetIds: string[]
  ): BattleActionResult {
    // 从数据中查找技能
    const skill = getSkillById(skillId)
    if (!skill) {
      this.onLog(`${attacker.character.name} 尝试使用武功，但失败了`)
      return {
        characterId: attacker.character.id,
        type: BattleActionType.SKILL,
        targetIds: [],
        description: `${attacker.character.name} 尝试使用武功，但失败了`,
      }
    }

    // 检查内力
    const manaCost = calculateManaCost(attacker.character, skill)
    if (!consumeMana(attacker, manaCost)) {
      this.onLog(`${attacker.character.name} 内力不足，无法使用${skill.name}`)
      return {
        characterId: attacker.character.id,
        type: BattleActionType.SKILL,
        targetIds: [],
        description: `${attacker.character.name} 内力不足`,
      }
    }

    const results: BattleActionResult[] = []
    for (const targetId of targetIds) {
      const target = this.findCharacter(targetId)
      if (!target) continue

      // 检查命中
      if (!checkHit(attacker.character, target.character, skill)) {
        this.onLog(`${attacker.character.name} 使用${skill.name}攻击${target.character.name}，但被闪避了！`)
        continue
      }

      // 计算伤害
      const isCrit = checkCrit(attacker.character, skill)
      const damage = calculateDamage(attacker.character, target.character, skill, isCrit)
      const actualDamage = dealDamage(target, damage)

      const critText = isCrit ? '（暴击！）' : ''
      this.onLog(`${attacker.character.name} 使用${skill.name}${critText}，对${target.character.name}造成${actualDamage}点伤害！`)

      results.push({
        characterId: attacker.character.id,
        type: BattleActionType.SKILL,
        targetIds: [targetId],
        damage: actualDamage,
        isCrit,
        description: `${attacker.character.name} 使用${skill.name}${critText}，造成${actualDamage}点伤害`,
      })
    }

    return {
      characterId: attacker.character.id,
      type: BattleActionType.SKILL,
      targetIds,
      damage: results.reduce((sum, r) => sum + (r.damage || 0), 0),
      description: `${attacker.character.name} 使用${skill.name}`,
    }
  }

  /**
   * 执行防御
   */
  private executeDefend(defender: BattleCharacter): BattleActionResult {
    this.onLog(`${defender.character.name} 摆出防御姿态`)
    return {
      characterId: defender.character.id,
      type: BattleActionType.DEFEND,
      targetIds: [],
      description: `${defender.character.name} 防御`,
    }
  }

  /**
   * 使用物品
   */
  private useItem(
    user: BattleCharacter,
    _itemId: string,
    _targetId: string
  ): BattleActionResult {
    // 这里简化处理，实际应该从数据中查找物品
    this.onLog(`${user.character.name} 使用了物品`)
    return {
      characterId: user.character.id,
      type: BattleActionType.ITEM,
      targetIds: [],
      description: `${user.character.name} 使用物品`,
    }
  }

  /**
   * 尝试逃跑
   */
  private tryFlee(actor: BattleCharacter): void {
    // 50% 基础逃跑成功率
    if (chance(50)) {
      this.battleState = BattleState.FLED
      this.onLog(`${actor.character.name} 成功逃脱战斗！`)
      this.onBattleEnd(false)
    } else {
      this.onLog(`${actor.character.name} 逃跑失败！`)
    }
  }

  /**
   * 执行敌人 AI 行动
   */
  executeEnemyAI(): BattleActionResult[] {
    const actor = this.getCurrentActor()
    if (!actor || this.isPlayerTurn()) {
      return []
    }

    const results: BattleActionResult[] = []

    // 简单的 AI 逻辑
    const alivePlayers = this.playerTeam.filter(isAlive)

    if (alivePlayers.length === 0) {
      return results
    }

    // 30% 概率使用技能，70% 概率普通攻击
    if (chance(30) && actor.character.skillIds.length > 0) {
      // 使用技能
      const skillId = actor.character.skillIds[0] // 简化：使用第一个技能
      const target = randomChoice(alivePlayers)
      if (target) {
        results.push(this.executeSkill(actor, skillId, [target.character.id]))
      }
    } else {
      // 普通攻击 - 优先攻击血量最低的目标
      const target = alivePlayers.reduce((min, p) =>
        p.currentHealth < min.currentHealth ? p : min
      )
      results.push(this.executeAttack(actor, target.character.id))
    }

    actor.hasActed = true
    this.processStatusEffects(actor)

    if (!this.checkBattleEnd()) {
      this.nextTurn()
    }

    return results
  }

  /**
   * 处理状态效果
   */
  private processStatusEffects(character: BattleCharacter): void {
    const damage = onTurnEnd(character)
    if (damage > 0) {
      this.onLog(`${character.character.name} 受到状态效果影响，损失${damage}点生命值`)
    }
  }

  /**
   * 继续下一个角色行动
   */
  private nextTurn(): void {
    // 重新排序（因为可能有角色死亡）
    this.initiativeOrder = this.calculateInitiativeOrder()

    // 检查是否还有行动者
    if (this.initiativeOrder.length === 0) {
      this.onLog('战斗结束')
      return
    }

    // 移动到下一个行动者
    this.currentActorIndex = (this.currentActorIndex + 1) % this.initiativeOrder.length

    // 如果回到第一个行动者，增加轮数
    if (this.currentActorIndex === 0) {
      // 新回合开始
    }
  }

  /**
   * 查找角色
   */
  private findCharacter(id: string): BattleCharacter | null {
    return (
      this.playerTeam.find(c => c.character.id === id) ||
      this.enemyTeam.find(c => c.character.id === id) ||
      null
    )
  }

  /**
   * 检查战斗是否结束
   */
  private checkBattleEnd(): boolean {
    const alivePlayers = this.playerTeam.filter(isAlive)
    const aliveEnemies = this.enemyTeam.filter(isAlive)

    if (aliveEnemies.length === 0) {
      this.battleState = BattleState.VICTORY
      this.onLog('战斗胜利！')
      this.onBattleEnd(true)
      return true
    }

    if (alivePlayers.length === 0) {
      this.battleState = BattleState.DEFEAT
      this.onLog('战斗失败...')
      this.onBattleEnd(false)
      return true
    }

    return false
  }

  /**
   * 获取战斗状态
   */
  getBattleState(): BattleState {
    return this.battleState
  }

  /**
   * 获取玩家队伍
   */
  getPlayerTeam(): BattleCharacter[] {
    return this.playerTeam
  }

  /**
   * 获取敌人队伍
   */
  getEnemyTeam(): BattleCharacter[] {
    return this.enemyTeam
  }
}

export default BattleEngine
