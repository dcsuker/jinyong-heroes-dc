/**
 * 金庸群侠传 - 物品数据库
 * 包含武器、防具、丹药、秘籍等
 */

import { Item, ItemType, ItemEffect, StatusEffect } from '@/types'

/** 创建物品的辅助函数 */
function createItem(
  id: string,
  name: string,
  description: string,
  type: ItemType,
  rarity: number,
  price: number,
  effect?: ItemEffect,
  equipBonus?: Record<string, number>,
  equipSlot?: 'weapon' | 'head' | 'body' | 'accessory',
  learnSkillId?: string,
  maxStack: number = 99
): Item {
  return {
    id,
    name,
    description,
    type,
    rarity,
    price,
    effect,
    equipBonus,
    equipSlot,
    learnSkillId,
    maxStack,
  }
}

// ============= 武器 =============

export const XUAN_TIE_ZHONGJIAN: Item = createItem(
  'xuantie_zhongjian',
  '玄铁重剑',
  '杨过所使用的重剑，重达六十四斤',
  ItemType.WEAPON,
  5,
  10000,
  undefined,
  { attack: 50, strength: 20 },
  'weapon'
)

export const YITIAN_JIAN: Item = createItem(
  'yitian_jian',
  '倚天剑',
  '峨眉派镇派之宝，锋利无比',
  ItemType.WEAPON,
  5,
  15000,
  undefined,
  { attack: 45, agility: 15 },
  'weapon'
)

export const TULONG_DAO: Item = createItem(
  'tulong_dao',
  '屠龙刀',
  '武林至尊，屠龙宝刀',
  ItemType.WEAPON,
  5,
  15000,
  undefined,
  { attack: 48, strength: 18 },
  'weapon'
)

export const JINSHE_JIAN: Item = createItem(
  'jinshe_jian',
  '金蛇剑',
  '金蛇郎君的佩剑，剑身如金蛇',
  ItemType.WEAPON,
  4,
  5000,
  undefined,
  { attack: 35, agility: 10 },
  'weapon'
)

export const JUNZI_JIAN: Item = createItem(
  'junzi_jian',
  '君子剑',
  '岳不群的佩剑',
  ItemType.WEAPON,
  3,
  2000,
  undefined,
  { attack: 25, intelligence: 5 },
  'weapon'
)

export const TIETIE_JIAN: Item = createItem(
  'tietie_jian',
  '铁剑',
  '普通的铁制长剑',
  ItemType.WEAPON,
  1,
  50,
  undefined,
  { attack: 8 },
  'weapon'
)

export const GANG_JIAN: Item = createItem(
  'gang_jian',
  '钢剑',
  '精钢打造的剑',
  ItemType.WEAPON,
  2,
  200,
  undefined,
  { attack: 15 },
  'weapon'
)

export const MU_GUN: Item = createItem(
  'mu_gun',
  '木棍',
  '丐帮弟子常用的打狗棒',
  ItemType.WEAPON,
  2,
  100,
  undefined,
  { attack: 12, agility: 3 },
  'weapon'
)

export const DAGOU_BANG: Item = createItem(
  'dagou_bang',
  '打狗棒',
  '丐帮帮主信物',
  ItemType.WEAPON,
  5,
  8000,
  undefined,
  { attack: 30, agility: 20 },
  'weapon'
)

// ============= 防具 =============

export const YUJIA_YIJIA: Item = createItem(
  'yujia_yijia',
  '玉甲衣',
  '用玉石编织的宝甲',
  ItemType.ARMOR,
  4,
  6000,
  undefined,
  { defense: 35, health: 100 },
  'body'
)

export const RUAN_WEIJIA: Item = createItem(
  'ruan_weijia',
  '软猬甲',
  '黄蓉所穿的宝甲，刀枪不入',
  ItemType.ARMOR,
  5,
  12000,
  undefined,
  { defense: 40, agility: 15 },
  'body'
)

export const JINZHIXUAN: Item = createItem(
  'jinzhi_xuan',
  '金丝玄甲',
  '金丝编织的玄甲',
  ItemType.ARMOR,
  3,
  3000,
  undefined,
  { defense: 25 },
  'body'
)

export const BUJIA: Item = createItem(
  'bu_jia',
  '布衣',
  '普通的布衣',
  ItemType.ARMOR,
  1,
  30,
  undefined,
  { defense: 3 },
  'body'
)

export const CHANG_PAO: Item = createItem(
  'chang_pao',
  '长袍',
  '武林人士常穿的长袍',
  ItemType.ARMOR,
  2,
  150,
  undefined,
  { defense: 8 },
  'body'
)

// ============= 饰品 =============

export const JINYU_PEI: Item = createItem(
  'jinyu_pei',
  '金玉佩',
  '金玉制成的佩饰',
  ItemType.ACCESSORY,
  3,
  1500,
  undefined,
  { intelligence: 10, mana: 30 },
  'accessory'
)

export const HUSHI_LING: Item = createItem(
  'hushi_ling',
  '护身铃',
  '可以抵挡一次致命攻击',
  ItemType.ACCESSORY,
  4,
  5000,
  undefined,
  { defense: 15 },
  'accessory'
)

export const QINGLIAN_ZHU: Item = createItem(
  'qinglian_zhu',
  '清灵珠',
  '使人头脑清明的宝珠',
  ItemType.ACCESSORY,
  4,
  4000,
  undefined,
  { intelligence: 20, mana: 50 },
  'accessory'
)

// ============= 丹药 =============

export const JIUHUA_YULU_WAN: Item = createItem(
  'jiuhua_yulu_wan',
  '九花玉露丸',
  '桃花岛秘制丹药，恢复生命值',
  ItemType.MEDICINE,
  4,
  500,
  { healthRestore: 500 },
  undefined,
  undefined,
  undefined,
  20
)

export const YUZHENG_GAO: Item = createItem(
  'yuzheng_gao',
  '玉真膏',
  '疗伤圣药',
  ItemType.MEDICINE,
  4,
  800,
  { healthRestore: 800 },
  undefined,
  undefined,
  undefined,
  10
)

export const BEI_MING_SAN: Item = createItem(
  'beiming_san',
  '北冥散',
  '恢复内力值',
  ItemType.MEDICINE,
  3,
  400,
  { manaRestore: 300 },
  undefined,
  undefined,
  undefined,
  20
)

export const JINDU_SAN: Item = createItem(
  'jindu_san',
  '金毒散',
  '解毒丹药',
  ItemType.MEDICINE,
  3,
  300,
  { cureEffects: [StatusEffect.POISON] },
  undefined,
  undefined,
  undefined,
  10
)

export const XIAO_YAO_SAN: Item = createItem(
  'xiaoyao_san',
  '逍遥散',
  '解除负面状态',
  ItemType.MEDICINE,
  3,
  350,
  { cureEffects: [StatusEffect.POISON, StatusEffect.SEALED, StatusEffect.STUN] },
  undefined,
  undefined,
  undefined,
  10
)

export const LINGZHIXIAN_DAN: Item = createItem(
  'lingzhixian_dan',
  '灵芝仙丹',
  '大幅提升生命值',
  ItemType.MEDICINE,
  5,
  1500,
  { healthRestore: 1000 },
  undefined,
  undefined,
  undefined,
  5
)

export const JIU_YIN_DAN: Item = createItem(
  'jiuyin_dan',
  '九阴丹',
  '大幅提升内力值',
  ItemType.MEDICINE,
  5,
  1500,
  { manaRestore: 800 },
  undefined,
  undefined,
  undefined,
  5
)

// ============= 秘籍 =============

export const JIUYANG_ZHENJING: Item = createItem(
  'jiuyang_zhenjing',
  '九阳真经',
  '九阳神功的秘籍',
  ItemType.MANUAL,
  5,
  20000,
  undefined,
  undefined,
  undefined,
  'jiuyang_shengong'
)

export const JIUYIN_ZHENJING_SHU: Item = createItem(
  'jiuyin_zhenjing_shu',
  '九阴真经',
  '九阴真经的秘籍',
  ItemType.MANUAL,
  5,
  20000,
  undefined,
  undefined,
  undefined,
  'jiuyin_zhenjing'
)

export const KUIHUA_BAODIAN_SHU: Item = createItem(
  'kuihua_baodian_shu',
  '葵花宝典',
  '欲练此功必先自宫',
  ItemType.MANUAL,
  5,
  25000,
  undefined,
  undefined,
  undefined,
  'kuihua_baodian'
)

export const DUGU_JIUJIAN_PU: Item = createItem(
  'dugu_jiujian_pu',
  '独孤九剑谱',
  '独孤九剑的剑谱',
  ItemType.MANUAL,
  5,
  18000,
  undefined,
  undefined,
  undefined,
  'dugu_jiujian'
)

export const XIANGLONG_SHIBA_PU: Item = createItem(
  'xianglong_shiba_pu',
  '降龙十八掌谱',
  '降龙十八掌的秘籍',
  ItemType.MANUAL,
  5,
  18000,
  undefined,
  undefined,
  undefined,
  'xianglong_shiba'
)

// ============= 材料 =============

export const TIESHI: Item = createItem(
  'tieshi',
  '铁矿石',
  '打造武器的基础材料',
  ItemType.MATERIAL,
  1,
  50,
  undefined,
  undefined,
  undefined,
  undefined,
  999
)

export const YINZI: Item = createItem(
  'yinzi',
  '银子',
  '江湖通用货币',
  ItemType.MATERIAL,
  1,
  1,
  undefined,
  undefined,
  undefined,
  undefined,
  9999
)

export const JINZI: Item = createItem(
  'jinzi',
  '金子',
  '珍贵货币',
  ItemType.MATERIAL,
  2,
  100,
  undefined,
  undefined,
  undefined,
  undefined,
  999
)

export const LINGZHI: Item = createItem(
  'lingzhi',
  '灵芝',
  '珍贵的药材',
  ItemType.MATERIAL,
  3,
  500,
  undefined,
  undefined,
  undefined,
  undefined,
  50
)

export const RENSHEN: Item = createItem(
  'renshen',
  '人参',
  '大补的药材',
  ItemType.MATERIAL,
  4,
  1000,
  undefined,
  undefined,
  undefined,
  undefined,
  20
)

// ============= 食物 =============

export const MANHOU_TOU: Item = createItem(
  'mantou',
  '馒头',
  '普通的食物',
  ItemType.FOOD,
  1,
  5,
  { healthRestore: 20 },
  undefined,
  undefined,
  undefined,
  50
)

export const JIAOZI: Item = createItem(
  'jiaozi',
  '饺子',
  '美味的食物',
  ItemType.FOOD,
  2,
  20,
  { healthRestore: 50 },
  undefined,
  undefined,
  undefined,
  30
)

export const HAOJIU: Item = createItem(
  'haojiu',
  '好酒',
  '陈年好酒',
  ItemType.FOOD,
  3,
  100,
  { manaRestore: 50 },
  undefined,
  undefined,
  undefined,
  20
)

// ============= 任务物品 =============

export const TULONG_DAO_LING: Item = createItem(
  'tulong_dao_ling',
  '屠龙刀令牌',
  '开启屠龙刀秘密的令牌',
  ItemType.QUEST,
  5,
  0,
  undefined,
  undefined,
  undefined,
  undefined,
  1
)

export const WUDU_JIAO_LINGPAI: Item = createItem(
  'wudu_jiao_lingpai',
  '五毒教令牌',
  '五毒教信物',
  ItemType.QUEST,
  4,
  0,
  undefined,
  undefined,
  undefined,
  undefined,
  1
)

// ============= 导出所有物品 =============

export const ALL_ITEMS: Item[] = [
  // 武器
  XUAN_TIE_ZHONGJIAN, YITIAN_JIAN, TULONG_DAO, JINSHE_JIAN,
  JUNZI_JIAN, TIETIE_JIAN, GANG_JIAN, MU_GUN, DAGOU_BANG,

  // 防具
  YUJIA_YIJIA, RUAN_WEIJIA, JINZHIXUAN, BUJIA, CHANG_PAO,

  // 饰品
  JINYU_PEI, HUSHI_LING, QINGLIAN_ZHU,

  // 丹药
  JIUHUA_YULU_WAN, YUZHENG_GAO, BEI_MING_SAN, JINDU_SAN,
  XIAO_YAO_SAN, LINGZHIXIAN_DAN, JIU_YIN_DAN,

  // 秘籍
  JIUYANG_ZHENJING, JIUYIN_ZHENJING_SHU, KUIHUA_BAODIAN_SHU,
  DUGU_JIUJIAN_PU, XIANGLONG_SHIBA_PU,

  // 材料
  TIESHI, YINZI, JINZI, LINGZHI, RENSHEN,

  // 食物
  MANHOU_TOU, JIAOZI, HAOJIU,

  // 任务物品
  TULONG_DAO_LING, WUDU_JIAO_LINGPAI,
]

/** 根据 ID 查找物品 */
export function getItemById(id: string): Item | undefined {
  return ALL_ITEMS.find(i => i.id === id)
}

/** 根据名称查找物品 */
export function getItemByName(name: string): Item | undefined {
  return ALL_ITEMS.find(i => i.name === name)
}

/** 根据类型筛选物品 */
export function getItemsByType(type: ItemType): Item[] {
  return ALL_ITEMS.filter(i => i.type === type)
}

/** 获取武器类物品 */
export function getWeapons(): Item[] {
  return ALL_ITEMS.filter(i => i.type === ItemType.WEAPON)
}

/** 获取防具类物品 */
export function getArmors(): Item[] {
  return ALL_ITEMS.filter(i => i.type === ItemType.ARMOR)
}

/** 获取丹药类物品 */
export function getMedicines(): Item[] {
  return ALL_ITEMS.filter(i => i.type === ItemType.MEDICINE)
}

/** 获取秘籍类物品 */
export function getManuals(): Item[] {
  return ALL_ITEMS.filter(i => i.type === ItemType.MANUAL)
}

export default ALL_ITEMS
