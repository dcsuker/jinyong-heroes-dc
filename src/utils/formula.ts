/**
 * 金庸群侠传 - 战斗公式计算工具
 */

import { Character, BattleCharacter, Skill, StatusEffect } from '@/types'

/**
 * 计算角色的先攻值（决定行动顺序）
 * @param character 角色对象
 * @returns 先攻值
 */
export function calculateInitiative(character: Character): number {
  const base = character.baseStats.agility
  const levelBonus = character.level * 0.5
  const randomFactor = Math.random() * 10
  return base + levelBonus + randomFactor
}

/**
 * 计算伤害值
 * @param attacker 攻击者
 * @param defender 防御者
 * @param skill 使用的武功（可选）
 * @param isCrit 是否暴击
 * @returns 伤害值
 */
export function calculateDamage(
  attacker: Character,
  defender: Character,
  skill?: Skill,
  isCrit: boolean = false
): number {
  // 基础攻击力
  const baseAttack = attacker.baseStats.attack + attacker.baseStats.strength * 0.5

  // 武功加成
  const skillMultiplier = skill ? skill.effect.damageMultiplier : 1.0

  // 防御减免
  const defense = defender.baseStats.defense
  const defenseMultiplier = Math.max(0.3, 1 - defense / (defense + 100))

  // 基础伤害
  let damage = baseAttack * skillMultiplier * defenseMultiplier

  // 随机波动 (0.85 - 1.15)
  const randomFactor = 0.85 + Math.random() * 0.3
  damage *= randomFactor

  // 暴击加成
  if (isCrit) {
    damage *= 1.5
  }

  // 确保最小伤害为 1
  return Math.max(1, Math.floor(damage))
}

/**
 * 计算暴击率
 * @param attacker 攻击者
 * @param skill 使用的武功（可选）
 * @returns 暴击率 (0-1)
 */
export function calculateCritRate(attacker: Character, skill?: Skill): number {
  const baseCrit = 0.05 // 基础 5% 暴击率
  const agilityBonus = attacker.baseStats.agility * 0.002
  const skillCrit = skill ? (skill.effect.critRate || 0) / 100 : 0
  return Math.min(0.5, baseCrit + agilityBonus + skillCrit) // 最多 50%
}

/**
 * 计算命中率
 * @param attacker 攻击者
 * @param defender 防御者
 * @param skill 使用的武功（可选）
 * @returns 命中率 (0-1)
 */
export function calculateAccuracy(
  attacker: Character,
  defender: Character,
  skill?: Skill
): number {
  const baseAccuracy = skill ? skill.effect.accuracy / 100 : 0.9
  const attackerAgility = attacker.baseStats.agility
  const defenderAgility = defender.baseStats.agility
  const agilityDiff = (attackerAgility - defenderAgility) * 0.002
  return Math.max(0.5, Math.min(1.0, baseAccuracy + agilityDiff))
}

/**
 * 判断是否命中
 * @param attacker 攻击者
 * @param defender 防御者
 * @param skill 使用的武功（可选）
 * @returns 是否命中
 */
export function checkHit(
  attacker: Character,
  defender: Character,
  skill?: Skill
): boolean {
  const accuracy = calculateAccuracy(attacker, defender, skill)
  return Math.random() < accuracy
}

/**
 * 判断是否暴击
 * @param attacker 攻击者
 * @param skill 使用的武功（可选）
 * @returns 是否暴击
 */
export function checkCrit(attacker: Character, skill?: Skill): boolean {
  const critRate = calculateCritRate(attacker, skill)
  return Math.random() < critRate
}

/**
 * 计算内力消耗
 * @param character 角色
 * @param skill 使用的武功
 * @returns 实际内力消耗值
 */
export function calculateManaCost(character: Character, skill: Skill): number {
  const baseCost = skill.effect.manaCost
  // 悟性高可以減少消耗
  const intelligenceBonus = Math.max(0.5, 1 - character.baseStats.intelligence * 0.01)
  return Math.floor(baseCost * intelligenceBonus)
}

/**
 * 检查角色是否有足够的内力
 * @param character 角色
 * @param skill 使用的武功
 * @returns 是否有足够内力
 */
export function hasEnoughMana(character: Character, skill: Skill): boolean {
  const cost = calculateManaCost(character, skill)
  return character.baseStats.mana >= cost
}

/**
 * 计算状态效果伤害
 * @param character 受状态影响的角色
 * @param effect 状态效果类型
 * @returns 状态造成的伤害
 */
export function calculateStatusDamage(character: Character, effect: StatusEffect): number {
  switch (effect) {
    case StatusEffect.POISON:
      return Math.floor(character.baseStats.maxHealth * 0.05) // 5% 最大生命值
    case StatusEffect.BURN:
      return Math.floor(character.baseStats.maxHealth * 0.04) // 4% 最大生命值
    default:
      return 0
  }
}

/**
 * 计算治疗量
 * @param healer 治疗者
 * @param baseHeal 基础治疗量
 * @returns 实际治疗量
 */
export function calculateHeal(healer: Character, baseHeal: number): number {
  const intelligenceBonus = healer.baseStats.intelligence * 0.2
  const randomFactor = 0.9 + Math.random() * 0.2
  return Math.floor((baseHeal + intelligenceBonus) * randomFactor)
}

/**
 * 计算获得的经验值
 * @param defeatedEnemy 被击败的敌人
 * @param winnerLevel 胜利者等级
 * @returns 获得的经验值
 */
export function calculateExpGain(defeatedEnemy: Character, winnerLevel: number): number {
  const baseExp = defeatedEnemy.level * 10
  const levelDiff = defeatedEnemy.level - winnerLevel
  const levelBonus = levelDiff > 0 ? 1 + levelDiff * 0.1 : 0.5
  return Math.floor(baseExp * levelBonus)
}

/**
 * 计算升级所需经验值
 * @param level 当前等级
 * @returns 升级所需经验值
 */
export function calculateExpToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

/**
 * 检查角色是否可以升级
 * @param character 角色
 * @returns 是否可以升级
 */
export function canLevelUp(character: Character): boolean {
  if (character.level >= character.maxLevel) return false
  const expNeeded = calculateExpToNextLevel(character.level)
  return character.exp >= expNeeded
}

/**
 * 升级角色属性
 * @param character 角色
 */
export function levelUp(character: Character): void {
  if (!canLevelUp(character)) return

  character.level++
  character.exp -= calculateExpToNextLevel(character.level - 1)

  // 属性提升
  character.baseStats.maxHealth += 20
  character.baseStats.maxMana += 10
  character.baseStats.strength += 2
  character.baseStats.agility += 2
  character.baseStats.intelligence += 1
  character.baseStats.defense += 2
  character.baseStats.attack += 3

  // 恢复部分生命值和内力
  character.baseStats.health = character.baseStats.maxHealth
  character.baseStats.mana = character.baseStats.maxMana
}

/**
 * 创建战斗角色
 * @param character 基础角色数据
 * @returns 战斗角色对象
 */
export function createBattleCharacter(character: Character): BattleCharacter {
  return {
    character,
    currentHealth: character.baseStats.health,
    currentMana: character.baseStats.mana,
    statusEffects: [],
    hasActed: false,
    initiative: calculateInitiative(character),
  }
}

/**
 * 检查角色是否存活
 * @param battleChar 战斗角色
 * @returns 是否存活
 */
export function isAlive(battleChar: BattleCharacter): boolean {
  return battleChar.currentHealth > 0
}

/**
 * 对战斗角色造成伤害
 * @param battleChar 战斗角色
 * @param damage 伤害值
 * @returns 实际伤害值
 */
export function dealDamage(battleChar: BattleCharacter, damage: number): number {
  // 无敌状态
  if (battleChar.statusEffects.some(e => e.effect === StatusEffect.INVINCIBLE)) {
    return 0
  }

  const actualDamage = Math.min(damage, battleChar.currentHealth)
  battleChar.currentHealth -= actualDamage
  return actualDamage
}

/**
 * 对战斗角色进行治疗
 * @param battleChar 战斗角色
 * @param healAmount 治疗量
 * @param maxHealth 最大生命值
 * @returns 实际治疗量
 */
export function healDamage(
  battleChar: BattleCharacter,
  healAmount: number,
  maxHealth: number
): number {
  const missingHealth = maxHealth - battleChar.currentHealth
  const actualHeal = Math.min(healAmount, missingHealth)
  battleChar.currentHealth += actualHeal
  return actualHeal
}

/**
 * 消耗内力
 * @param battleChar 战斗角色
 * @param amount 消耗量
 * @returns 是否成功消耗
 */
export function consumeMana(
  battleChar: BattleCharacter,
  amount: number
): boolean {
  if (battleChar.currentMana < amount) return false
  battleChar.currentMana -= amount
  return true
}

/**
 * 添加状态效果
 * @param battleChar 战斗角色
 * @param effect 状态效果
 * @param turns 持续回合数
 */
export function addStatusEffect(
  battleChar: BattleCharacter,
  effect: StatusEffect,
  turns: number
): void {
  const existing = battleChar.statusEffects.find(e => e.effect === effect)
  if (existing) {
    existing.turns = Math.max(existing.turns, turns)
  } else {
    battleChar.statusEffects.push({ effect, turns })
  }
}

/**
 * 移除状态效果
 * @param battleChar 战斗角色
 * @param effect 状态效果
 */
export function removeStatusEffect(
  battleChar: BattleCharacter,
  effect: StatusEffect
): void {
  battleChar.statusEffects = battleChar.statusEffects.filter(e => e.effect !== effect)
}

/**
 * 回合结束处理（状态效果更新等）
 * @param battleChar 战斗角色
 * @returns 本回合受到的状态伤害
 */
export function onTurnEnd(battleChar: BattleCharacter): number {
  let totalDamage = 0

  // 处理状态效果
  battleChar.statusEffects = battleChar.statusEffects.filter(se => {
    if (se.turns <= 0) return false

    // 处理状态伤害
    if ([StatusEffect.POISON, StatusEffect.BURN].includes(se.effect)) {
      totalDamage += calculateStatusDamage(battleChar.character, se.effect)
    }

    se.turns--
    return se.turns > 0
  })

  // 扣除状态伤害
  if (totalDamage > 0) {
    battleChar.currentHealth = Math.max(0, battleChar.currentHealth - totalDamage)
  }

  // 重置行动状态
  battleChar.hasActed = false

  return totalDamage
}
