/**
 * 金庸群侠传 Web RPG - 全局类型定义
 */

// ============= 基础类型 =============

/** 角色 ID 类型 */
export type CharacterId = string

/** 技能 ID 类型 */
export type SkillId = string

/** 地点 ID 类型 */
export type LocationId = string

/** 门派 ID 类型 */
export type SectId = string

/** 物品 ID 类型 */
export type ItemId = string

/** 任务 ID 类型 */
export type QuestId = string

// ============= 角色类型 =============

/** 角色属性 */
export interface CharacterStats {
  /** 生命值 */
  health: number
  /** 最大生命值 */
  maxHealth: number
  /** 内力值 */
  mana: number
  /** 最大内力值 */
  maxMana: number
  /** 力量 - 影响物理攻击 */
  strength: number
  /** 敏捷 - 影响速度和闪避 */
  agility: number
  /** 悟性 - 影响学习速度 */
  intelligence: number
  /** 防御 */
  defense: number
  /** 攻击力 */
  attack: number
}

/** 角色类型 */
export enum CharacterType {
  /** 玩家 */
  PLAYER = 'player',
  /** 可招募 NPC */
  ALLY = 'ally',
  /** 敌人 */
  ENEMY = 'enemy',
  /** 中立 NPC */
  NEUTRAL = 'neutral',
}

/** 角色数据 */
export interface Character {
  /** 唯一 ID */
  id: CharacterId
  /** 姓名 */
  name: string
  /** 称号 */
  title?: string
  /** 描述 */
  description: string
  /** 所属小说 */
  novel: string
  /** 所属门派 */
  sectId?: SectId
  /** 角色类型 */
  type: CharacterType
  /** 等级 */
  level: number
  /** 经验值 */
  exp: number
  /** 最大等级 */
  maxLevel: number
  /** 基础属性 */
  baseStats: CharacterStats
  /** 当前属性（含装备加成） */
  currentStats?: CharacterStats
  /** 已学武功 ID 列表 */
  skillIds: SkillId[]
  /** 装备的物品 ID 列表 */
  itemIds: ItemId[]
  /** 好感度（-100 到 100） */
  favorability: number
  /** 是否可以招募 */
  recruitable: boolean
  /** 角色立绘颜色（用于 CSS 绘制） */
  avatarColor: string
}

// ============= 武功技能类型 =============

/** 武功类型 */
export enum SkillType {
  /** 内功 */
  INTERNAL = 'internal',
  /** 轻功 */
  QINGGONG = 'qinggong',
  /** 掌法 */
  PALM = 'palm',
  /** 拳法 */
  FIST = 'fist',
  /** 指法 */
  FINGER = 'finger',
  /** 剑法 */
  SWORD = 'sword',
  /** 刀法 */
  BLADE = 'blade',
  /** 棍法 */
  STAFF = 'staff',
  /** 暗器 */
  PROJECTILE = 'projectile',
  /** 特殊武功 */
  SPECIAL = 'special',
}

/** 武功目标类型 */
export enum SkillTargetType {
  /** 单体 */
  SINGLE = 'single',
  /** 全体 */
  ALL = 'all',
  /** 前排 */
  FRONT_ROW = 'front_row',
  /** 后排 */
  BACK_ROW = 'back_row',
}

/** 武功效果 */
export interface SkillEffect {
  /** 伤害倍率 */
  damageMultiplier: number
  /** 内力消耗 */
  manaCost: number
  /** 命中率 */
  accuracy: number
  /** 暴击率 */
  critRate: number
  /** 特殊效果 */
  effects?: StatusEffect[]
}

/** 状态效果 */
export enum StatusEffect {
  /** 中毒 */
  POISON = 'poison',
  /** 封穴（无法使用内力） */
  SEALED = 'sealed',
  /** 眩晕 */
  STUN = 'stun',
  /** 冰冻 */
  FREEZE = 'freeze',
  /** 燃烧 */
  BURN = 'burn',
  /** 狂暴（攻击提升，防御下降） */
  BERSERK = 'berserk',
  /** 无敌 */
  INVINCIBLE = 'invincible',
}

/** 武功数据 */
export interface Skill {
  /** 唯一 ID */
  id: SkillId
  /** 名称 */
  name: string
  /** 描述 */
  description: string
  /** 武功类型 */
  type: SkillType
  /** 所属门派 */
  sectId?: SectId
  /** 威力等级（1-10） */
  powerLevel: number
  /** 学习等级要求 */
  levelRequirement: number
  /** 学习条件描述 */
  requirement?: string
  /** 目标类型 */
  targetType: SkillTargetType
  /** 效果 */
  effect: SkillEffect
  /** 特殊效果描述 */
  specialEffect?: string
  /** 是否是合击技 */
  isCombo?: boolean
  /** 合击所需角色 ID 列表 */
  comboCharacters?: CharacterId[]
}

// ============= 地点类型 =============

/** 地点类型 */
export enum LocationType {
  /** 城市 */
  CITY = 'city',
  /** 小镇 */
  TOWN = 'town',
  /** 门派 */
  SECT = 'sect',
  /** 秘境 */
  DUNGEON = 'dungeon',
  /** 野外 */
  WILDERNESS = 'wilderness',
  /** 客栈 */
  INN = 'inn',
  /** 商店 */
  SHOP = 'shop',
  /** 宫殿 */
  PALACE = 'palace',
}

/** 地点数据 */
export interface Location {
  /** 唯一 ID */
  id: LocationId
  /** 名称 */
  name: string
  /** 描述 */
  description: string
  /** 地点类型 */
  type: LocationType
  /** 所属小说 */
  novel?: string
  /** 世界地图坐标 */
  worldX: number
  /** 世界地图坐标 */
  worldY: number
  /** 是否已探索 */
  explored: boolean
  /** 可访问的子地点 ID 列表 */
  subLocationIds?: LocationId[]
  /** 所在地点的 NPC ID 列表 */
  npcIds: CharacterId[]
  /** 可触发的事件 ID 列表 */
  eventIds?: string[]
  /** 连接的道路 */
  connections?: LocationConnection[]
}

/** 地点连接 */
export interface LocationConnection {
  /** 目标地点 ID */
  targetId: LocationId
  /** 距离 */
  distance: number
  /** 道路类型 */
  roadType: 'road' | 'path' | 'water' | 'mountain'
}

// ============= 门派类型 =============

/** 门派阵营 */
export enum SectAlignment {
  /** 正道 */
  RIGHTEOUS = 'righteous',
  /** 邪道 */
  EVIL = 'evil',
  /** 中立 */
  NEUTRAL = 'neutral',
}

/** 门派数据 */
export interface Sect {
  /** 唯一 ID */
  id: SectId
  /** 名称 */
  name: string
  /** 描述 */
  description: string
  /** 掌门人 ID */
  leaderId?: CharacterId
  /** 所在地 ID */
  locationId?: LocationId
  /** 阵营 */
  alignment: SectAlignment
  /** 势力值（影响江湖地位） */
  power: number
  /** 与玩家门派的友好度（-100 到 100） */
  friendship: number
  /** 加入条件 */
  joinRequirement?: string
  /** 专属武功 ID 列表 */
  exclusiveSkillIds: SkillId[]
  /** 门派等级要求 */
  levelRequirement: number
}

// ============= 物品类型 =============

/** 物品类型 */
export enum ItemType {
  /** 武器 */
  WEAPON = 'weapon',
  /** 防具 */
  ARMOR = 'armor',
  /** 饰品 */
  ACCESSORY = 'accessory',
  /** 丹药 */
  MEDICINE = 'medicine',
  /** 秘籍 */
  MANUAL = 'manual',
  /** 材料 */
  MATERIAL = 'material',
  /** 任务物品 */
  QUEST = 'quest',
  /** 食物 */
  FOOD = 'food',
  /** 其他 */
  OTHER = 'other',
}

/** 物品效果 */
export interface ItemEffect {
  /** 恢复生命值 */
  healthRestore?: number
  /** 恢复内力值 */
  manaRestore?: number
  /** 临时属性加成 */
  statBonus?: Partial<CharacterStats>
  /** 解除状态 */
  cureEffects?: StatusEffect[]
  /** 永久属性提升 */
  permanentBonus?: Partial<CharacterStats>
}

/** 物品数据 */
export interface Item {
  /** 唯一 ID */
  id: ItemId
  /** 名称 */
  name: string
  /** 描述 */
  description: string
  /** 物品类型 */
  type: ItemType
  /** 稀有度（1-5） */
  rarity: number
  /** 价格（银两） */
  price: number
  /** 效果 */
  effect?: ItemEffect
  /** 装备后属性加成 */
  equipBonus?: Partial<CharacterStats>
  /** 装备部位 */
  equipSlot?: 'weapon' | 'head' | 'body' | 'accessory'
  /** 学习后获得的武功 ID */
  learnSkillId?: SkillId
  /** 最大堆叠数量 */
  maxStack: number
}

/** 背包物品 */
export interface BagItem extends Item {
  /** 当前数量 */
  count: number
}

// ============= 任务类型 =============

/** 任务类型 */
export enum QuestType {
  /** 主线任务 */
  MAIN = 'main',
  /** 支线任务 */
  SIDE = 'side',
  /** 日常任务 */
  DAILY = 'daily',
  /** 隐藏任务 */
  HIDDEN = 'hidden',
}

/** 任务状态 */
export enum QuestStatus {
  /** 未接取 */
  NOT_STARTED = 'not_started',
  /** 进行中 */
  IN_PROGRESS = 'in_progress',
  /** 已完成 */
  COMPLETED = 'completed',
  /** 已失败 */
  FAILED = 'failed',
}

/** 任务目标 */
export interface QuestObjective {
  /** 目标 ID */
  id: string
  /** 目标描述 */
  description: string
  /** 目标类型 */
  type: 'kill' | 'collect' | 'talk' | 'go' | 'use'
  /** 目标 ID */
  targetId: string
  /** 当前进度 */
  current: number
  /** 目标进度 */
  required: number
  /** 是否完成 */
  completed: boolean
}

/** 任务数据 */
export interface Quest {
  /** 唯一 ID */
  id: QuestId
  /** 名称 */
  name: string
  /** 描述 */
  description: string
  /** 任务类型 */
  type: QuestType
  /** 任务状态 */
  status: QuestStatus
  /** 接取 NPC ID */
  giverId?: CharacterId
  /** 交付 NPC ID */
  turnInId?: CharacterId
  /** 前置任务 ID 列表 */
  prerequisites?: QuestId[]
  /** 任务目标列表 */
  objectives: QuestObjective[]
  /** 任务奖励 */
  rewards: QuestRewards
  /** 任务失败条件 */
  failConditions?: string[]
}

/** 任务奖励 */
export interface QuestRewards {
  /** 经验值 */
  exp?: number
  /** 银两 */
  silver?: number
  /** 金叶 */
  gold?: number
  /** 物品奖励 ID 列表 */
  itemIds?: ItemId[]
  /** 武功 ID（秘籍） */
  skillId?: SkillId
  /** 好感度变化 */
  favorabilityChanges?: { characterId: CharacterId; change: number }[]
  /** 声望变化 */
  reputationChanges?: { faction: string; change: number }[]
}

// ============= 战斗类型 =============

/** 战斗角色 */
export interface BattleCharacter {
  /** 角色数据 */
  character: Character
  /** 当前生命值 */
  currentHealth: number
  /** 当前内力值 */
  currentMana: number
  /** 当前状态效果 */
  statusEffects: { effect: StatusEffect; turns: number }[]
  /** 本回合是否已行动 */
  hasActed: boolean
  /** 行动顺序值 */
  initiative: number
}

/** 战斗队伍 */
export interface BattleTeam {
  /** 队伍成员 */
  members: BattleCharacter[]
  /** 队伍名称 */
  name: string
}

/** 战斗行动 */
export enum BattleActionType {
  /** 普通攻击 */
  ATTACK = 'attack',
  /** 使用武功 */
  SKILL = 'skill',
  /** 使用物品 */
  ITEM = 'item',
  /** 防御 */
  DEFEND = 'defend',
  /** 逃跑 */
  FLEE = 'flee',
}

/** 战斗行动 */
export interface BattleAction {
  /** 行动角色 ID */
  characterId: CharacterId
  /** 行动类型 */
  type: BattleActionType
  /** 目标角色 ID */
  targetId?: CharacterId
  /** 使用的技能 ID */
  skillId?: SkillId
  /** 使用的物品 ID */
  itemId?: ItemId
}

/** 战斗结果 */
export interface BattleAction {
  /** 行动角色 ID */
  characterId: CharacterId
  /** 行动类型 */
  type: BattleActionType
  /** 目标角色 ID 列表 */
  targetIds: CharacterId[]
  /** 使用的技能 ID */
  skillId?: SkillId
  /** 使用的物品 ID */
  itemId?: ItemId
  /** 造成的伤害 */
  damage?: number
  /** 是否暴击 */
  isCrit?: boolean
  /** 治疗量 */
  heal?: number
  /** 行动描述 */
  description: string
}

/** 战斗行动结果 */
export interface BattleActionResult {
  /** 行动角色 ID */
  characterId: CharacterId
  /** 行动类型 */
  type: BattleActionType
  /** 目标角色 ID 列表 */
  targetIds: CharacterId[]
  /** 使用的技能 ID */
  skillId?: SkillId
  /** 使用的物品 ID */
  itemId?: ItemId
  /** 造成的伤害 */
  damage?: number
  /** 是否暴击 */
  isCrit?: boolean
  /** 治疗量 */
  heal?: number
  /** 行动描述 */
  description: string
}

/** 战斗记录 */
export interface BattleLog {
  /** 回合数 */
  round: number
  /** 行动角色 ID */
  actorId: CharacterId
  /** 行动描述 */
  description: string
  /** 行动结果 */
  results: BattleActionResult[]
}

/** 战斗状态 */
export enum BattleState {
  /** 未开始 */
  NOT_STARTED = 'not_started',
  /** 玩家回合 */
  PLAYER_TURN = 'player_turn',
  /** 敌人回合 */
  ENEMY_TURN = 'enemy_turn',
  /** 结算中 */
  RESOLVING = 'resolving',
  /** 胜利 */
  VICTORY = 'victory',
  /** 失败 */
  DEFEAT = 'defeat',
  /** 逃跑成功 */
  FLED = 'fled',
}

// ============= 对话类型 =============

/** 对话选项 */
export interface DialogueOption {
  /** 选项文本 */
  text: string
  /** 下一对话节点 ID */
  nextNodeId: string
  /** 触发条件（可选） */
  condition?: DialogueCondition
  /** 选择后的效果 */
  effect?: DialogueEffect
}

/** 对话条件 */
export interface DialogueCondition {
  /** 需要的好感度 */
  minFavorability?: number
  /** 需要的任务状态 */
  requiredQuestStatus?: { questId: QuestId; status: QuestStatus }
  /** 需要的物品 */
  requiredItem?: { itemId: ItemId; count: number }
  /** 需要的角色在队伍中 */
  requiredCharacter?: CharacterId
}

/** 对话效果 */
export interface DialogueEffect {
  /** 好感度变化 */
  favorabilityChange?: { characterId: CharacterId; change: number }
  /** 给予物品 */
  giveItem?: { itemId: ItemId; count: number }
  /** 接取任务 */
  startQuest?: QuestId
  /** 更新任务状态 */
  updateQuest?: { questId: QuestId; objectiveId: string }
  /** 触发战斗 */
  triggerBattle?: string
}

/** 对话节点 */
export interface DialogueNode {
  /** 节点 ID */
  id: string
  /** 说话人 ID */
  speakerId: CharacterId
  /** 对话文本 */
  text: string
  /** 表情（可选） */
  expression?: 'normal' | 'happy' | 'angry' | 'sad' | 'surprised'
  /** 选项列表 */
  options?: DialogueOption[]
  /** 是否是结束节点 */
  isEnd?: boolean
}

/** 对话树 */
export interface DialogueTree {
  /** 对话树 ID */
  id: string
  /** 对话树名称 */
  name: string
  /** 起始节点 ID */
  startNodeId: string
  /** 所有节点 */
  nodes: Record<string, DialogueNode>
}

// ============= 游戏状态类型 =============

/** 游戏模式 */
export enum GameMode {
  /** 菜单 */
  MENU = 'menu',
  /** 世界地图 */
  WORLD_MAP = 'world_map',
  /** 城镇探索 */
  TOWN = 'town',
  /** 战斗 */
  BATTLE = 'battle',
  /** 对话 */
  DIALOGUE = 'dialogue',
  /** 菜单界面 */
  UI_MENU = 'ui_menu',
}

/** 存档数据 */
export interface SaveData {
  /** 存档槽位（1-3） */
  slot: number
  /** 存档时间 */
  timestamp: number
  /** 游戏时间（分钟） */
  playTime: number
  /** 玩家数据 */
  player: Character
  /** 队伍成员 */
  party: Character[]
  /** 当前位置 */
  currentLocation: LocationId
  /** 背包物品 */
  inventory: BagItem[]
  /** 已接取的任务 */
  quests: Quest[]
  /** 已探索的地点 ID 列表 */
  exploredLocations: LocationId[]
  /** 角色好感度映射 */
  favorability: Record<CharacterId, number>
  /** 游戏标志（用于剧情分支） */
  flags: Record<string, boolean>
}

/** 游戏设置 */
export interface GameSettings {
  /** 音乐音量（0-1） */
  musicVolume: number
  /** 音效音量（0-1） */
  sfxVolume: number
  /** 对话速度（毫秒/字） */
  textSpeed: number
  /** 全屏模式 */
  fullscreen: boolean
}
