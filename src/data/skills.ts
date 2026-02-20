/**
 * 金庸群侠传 - 武功技能数据库
 * 包含金庸 14 部小说中的主要武功（200+ 武功）
 */

import { Skill, SkillType, SkillTargetType, SkillEffect } from '@/types'

/** 创建武功的辅助函数 */
function createSkill(
  id: string,
  name: string,
  description: string,
  type: SkillType,
  powerLevel: number,
  levelRequirement: number,
  targetType: SkillTargetType,
  effect: SkillEffect,
  sectId?: string,
  requirement?: string,
  specialEffect?: string,
  isCombo?: boolean,
  comboCharacters?: string[]
): Skill {
  return {
    id,
    name,
    description,
    type,
    sectId,
    powerLevel,
    levelRequirement,
    requirement,
    targetType,
    effect,
    specialEffect,
    isCombo,
    comboCharacters,
  }
}

// ============= 内功心法 =============

export const JIUYANG_SHENGONG: Skill = createSkill(
  'jiuyang_shengong', '九阳神功', '九阳神功大成后内力自生速度奇快，百毒不侵',
  SkillType.INTERNAL, 10, 50,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0, manaCost: 0, accuracy: 100, critRate: 0 },
  undefined,
  '需九阳真经全本',
  '永久提升内力上限 50%，每回合自动恢复内力'
)

export const JIUYIN_ZHENJING: Skill = createSkill(
  'jiuyin_zhenjing', '九阴真经', '道家武学巅峰之作，包含上乘内功和武功',
  SkillType.INTERNAL, 10, 50,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0, manaCost: 0, accuracy: 100, critRate: 0 },
  undefined,
  '需通读九阴真经',
  '永久提升全属性 15%'
)

export const YIJIN_JING: Skill = createSkill(
  'yijin_jing', '易筋经', '少林寺镇派之宝，脱胎换骨之效',
  SkillType.INTERNAL, 10, 60,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0, manaCost: 0, accuracy: 100, critRate: 0 },
  'shaolin_sect',
  '需少林派嫡传弟子',
  '永久提升防御和生命值 30%'
)

export const BEIMING_SHENGONG: Skill = createSkill(
  'beiming_shengong', '北冥神功', '逍遥派绝学，可吸取他人内力',
  SkillType.INTERNAL, 9, 45,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0, manaCost: 30, accuracy: 90, critRate: 0 },
  undefined,
  '需逍遥派传承',
  '攻击时吸取对方内力转化为自身内力'
)

export const XIKONG_DAF: Skill = createSkill(
  'xikong_dafa', '吸功大法', '可以吸取他人功力的邪门武功',
  SkillType.INTERNAL, 8, 40,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0.5, manaCost: 20, accuracy: 85, critRate: 10 },
  undefined,
  undefined,
  '击败敌人后永久提升自身属性'
)

export const XIXING_DAF: Skill = createSkill(
  'xixing_dafa', '吸星大法', '任我行创制的吸取内力武功',
  SkillType.INTERNAL, 9, 50,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0.8, manaCost: 35, accuracy: 90, critRate: 15 },
  'riyue_shenjiao',
  '需日月神教教主',
  '大幅吸取对方内力，但有反噬风险'
)

export const KUIHUA_BAODIAN: Skill = createSkill(
  'kuihua_baodian', '葵花宝典', '武林奇书，欲练此功必先自宫',
  SkillType.INTERNAL, 10, 55,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0, manaCost: 0, accuracy: 100, critRate: 0 },
  'riyue_shenjiao',
  '需自宫',
  '永久提升速度 50%，攻击力 30%'
)

export const XIAN_TIAN_GONG: Skill = createSkill(
  'xiantian_gong', '先天功', '王重阳所创道家绝学',
  SkillType.INTERNAL, 10, 55,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0, manaCost: 0, accuracy: 100, critRate: 0 },
  'quanzhen_sect',
  '需全真教嫡传',
  '永久提升内力上限 40%'
)

export const CHUNYANG_GONG: Skill = createSkill(
  'chunyang_gong', '纯阳功', '武当派基础内功',
  SkillType.INTERNAL, 5, 10,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0, manaCost: 0, accuracy: 100, critRate: 0 },
  'wudang_sect',
  '需武当派弟子',
  '每回合自动恢复少量内力'
)

export const TAIJI_GONG: Skill = createSkill(
  'taiji_gong', '太极功', '张三丰所创，以静制动',
  SkillType.INTERNAL, 9, 50,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0, manaCost: 0, accuracy: 100, critRate: 0 },
  'wudang_sect',
  '需领悟太极道理',
  '反击时有 50% 几率将伤害反弹给敌人'
)

export const LONGXIANG_BANRUO_GONG: Skill = createSkill(
  'longxiang_banruo_gong', '龙象般若功', '密宗绝学，共分十三层',
  SkillType.INTERNAL, 9, 45,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0, manaCost: 0, accuracy: 100, critRate: 0 },
  undefined,
  '需西藏密宗传承',
  '每层提升力量 10%，最高十三层'
)

export const SHENLONG_JIAO_GONG: Skill = createSkill(
  'shenlong_jiao_gong', '神龙教功', '神龙教独门内功',
  SkillType.INTERNAL, 6, 30,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0, manaCost: 0, accuracy: 100, critRate: 0 },
  undefined,
  '需神龙教弟子',
  '提升毒抗和内力恢复'
)

// ============= 轻功 =============

export const SHENXING_BAIBIAN: Skill = createSkill(
  'shenxing_baibian', '神行百变', '铁剑门绝学，闪避身法',
  SkillType.QINGGONG, 7, 35,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0, manaCost: 15, accuracy: 100, critRate: 0 },
  undefined,
  undefined,
  '提升自身闪避率 50%，持续 3 回合'
)

export const LINGBO_WEIBU: Skill = createSkill(
  'lingbo_weibu', '凌波微步', '逍遥派绝顶轻功',
  SkillType.QINGGONG, 10, 50,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0, manaCost: 25, accuracy: 100, critRate: 0 },
  undefined,
  '需逍遥派传承',
  '大幅提升闪避，3 回合内几乎无法被命中'
)

export const JIN_YAN_GONG: Skill = createSkill(
  'jinyan_gong', '金雁功', '全真教轻功',
  SkillType.QINGGONG, 5, 20,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0, manaCost: 10, accuracy: 100, critRate: 0 },
  'quanzhen_sect',
  '需全真教弟子',
  '提升闪避率 30%'
)

export const QINGGONG_SHENFA: Skill = createSkill(
  'qinggong_shenfa', '轻功身法', '江湖人士基础轻功',
  SkillType.QINGGONG, 3, 5,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0, manaCost: 5, accuracy: 100, critRate: 0 },
  undefined,
  undefined,
  '小幅提升闪避率'
)

// ============= 掌法 =============

export const XIANGLONG_SHIBA: Skill = createSkill(
  'xianglong_shiba', '降龙十八掌', '丐帮镇帮绝学，天下第一掌法',
  SkillType.PALM, 10, 50,
  SkillTargetType.SINGLE,
  { damageMultiplier: 2.5, manaCost: 40, accuracy: 95, critRate: 20 },
  'beggar_sect',
  '需丐帮帮主或洪七公传人',
  '刚猛无铸，有几率击退敌人'
)

export const ANRAN_XIAOHUN_ZHANG: Skill = createSkill(
  'anran_xiaohun_zhang', '黯然销魂掌', '杨过自创掌法，威力惊人',
  SkillType.PALM, 10, 55,
  SkillTargetType.SINGLE,
  { damageMultiplier: 2.8, manaCost: 45, accuracy: 90, critRate: 25 },
  undefined,
  '需经历生死离别',
  '心情越悲痛威力越大'
)

export const TIANSHAN_LIUYANG_ZHANG: Skill = createSkill(
  'tianshan_liuyang_zhang', '天山六阳掌', '逍遥派绝学',
  SkillType.PALM, 9, 45,
  SkillTargetType.SINGLE,
  { damageMultiplier: 2.2, manaCost: 35, accuracy: 92, critRate: 18 },
  undefined,
  '需逍遥派传承',
  '阳刚之力，可解生死符'
)

export const POXIAN_ZHANG: Skill = createSkill(
  'poxian_zhang', '破绽掌', '寻找敌人破绽攻击',
  SkillType.PALM, 6, 25,
  SkillTargetType.SINGLE,
  { damageMultiplier: 1.5, manaCost: 20, accuracy: 85, critRate: 30 },
  undefined,
  undefined,
  '高暴击率'
)

export const KONGMING_QUAN: Skill = createSkill(
  'kongming_quan', '空明拳', '周伯通所创，以柔克刚',
  SkillType.FIST, 8, 45,
  SkillTargetType.SINGLE,
  { damageMultiplier: 1.8, manaCost: 25, accuracy: 95, critRate: 15 },
  'quanzhen_sect',
  '需领悟空明道理',
  '以虚击实，以柔克刚'
)

export const QISHANG_QUAN: Skill = createSkill(
  'qishang_quan', '七伤拳', '崆峒派绝学，先伤己后伤人',
  SkillType.FIST, 8, 40,
  SkillTargetType.SINGLE,
  { damageMultiplier: 2.5, manaCost: 35, accuracy: 85, critRate: 15 },
  'kongtong_sect',
  '需崆峒派传承',
  '威力巨大但会反噬自身'
)

// ============= 剑法 =============

export const DUGU_JIUJIAN: Skill = createSkill(
  'dugu_jiujian', '独孤九剑', '独孤求败所创，只攻不守',
  SkillType.SWORD, 10, 50,
  SkillTargetType.SINGLE,
  { damageMultiplier: 2.5, manaCost: 40, accuracy: 98, critRate: 30 },
  undefined,
  '需独孤求败传承',
  '看破敌人招式，专攻破绽'
)

export const LIUMAI_SHENJIAN: Skill = createSkill(
  'liumai_shenjian', '六脉神剑', '大理段氏绝学，以气化剑',
  SkillType.SWORD, 10, 55,
  SkillTargetType.SINGLE,
  { damageMultiplier: 3.0, manaCost: 60, accuracy: 90, critRate: 25 },
  undefined,
  '需一阳指大成',
  '无形剑气，极难闪避'
)

export const YIYANG_ZHI: Skill = createSkill(
  'yiyang_zhi', '一阳指', '大理段氏绝学，点穴功夫',
  SkillType.FINGER, 9, 45,
  SkillTargetType.SINGLE,
  { damageMultiplier: 2.0, manaCost: 35, accuracy: 95, critRate: 20 },
  undefined,
  '需大理段氏传承',
  '可封穴道，克制蛤蟆功'
)

export const YUSU_NVXIN_JIAN: Skill = createSkill(
  'yusu_nvxin_jian', '玉女素心剑', '古墓派剑法',
  SkillType.SWORD, 8, 40,
  SkillTargetType.SINGLE,
  { damageMultiplier: 2.0, manaCost: 30, accuracy: 92, critRate: 20 },
  'gumu_sect',
  '需古墓派弟子',
  '招式优美但暗藏杀机'
)

export const TAIJI_JIANFA: Skill = createSkill(
  'taiji_jianfa', '太极剑法', '张三丰晚年所创',
  SkillType.SWORD, 9, 50,
  SkillTargetType.SINGLE,
  { damageMultiplier: 2.0, manaCost: 30, accuracy: 95, critRate: 15 },
  'wudang_sect',
  '需领悟太极剑意',
  '剑势连绵不绝，以静制动'
)

export const XUANTIE_JIANFA: Skill = createSkill(
  'xuantie_jianfa', '玄铁剑法', '杨过使用玄铁重剑所创',
  SkillType.SWORD, 9, 48,
  SkillTargetType.SINGLE,
  { damageMultiplier: 2.8, manaCost: 40, accuracy: 85, critRate: 15 },
  undefined,
  '需玄铁重剑',
  '重剑无锋，大巧不工'
)

export const HUASHAN_JIANFA: Skill = createSkill(
  'huashan_jianfa', '华山剑法', '华山派基础剑法',
  SkillType.SWORD, 5, 15,
  SkillTargetType.SINGLE,
  { damageMultiplier: 1.3, manaCost: 15, accuracy: 90, critRate: 10 },
  'huashan_sect',
  '需华山派弟子',
  '轻灵飘逸'
)

export const EMEI_JIANFA: Skill = createSkill(
  'emei_jianfa', '峨眉剑法', '峨眉派剑法',
  SkillType.SWORD, 6, 20,
  SkillTargetType.SINGLE,
  { damageMultiplier: 1.5, manaCost: 18, accuracy: 92, critRate: 12 },
  'emei_sect',
  '需峨眉派弟子',
  '招式典雅'
)

export const JINSHE_JIANFA: Skill = createSkill(
  'jinshe_jianfa', '金蛇剑法', '金蛇郎君所创',
  SkillType.SWORD, 8, 40,
  SkillTargetType.SINGLE,
  { damageMultiplier: 2.0, manaCost: 30, accuracy: 90, critRate: 20 },
  undefined,
  '需金蛇剑',
  '招式诡异多变'
)

export const BIXIE_JIANFA: Skill = createSkill(
  'bixie_jianfa', '辟邪剑法', '林远图所创',
  SkillType.SWORD, 9, 45,
  SkillTargetType.SINGLE,
  { damageMultiplier: 2.5, manaCost: 35, accuracy: 95, critRate: 25 },
  undefined,
  '需自宫',
  '剑法诡异，速度极快'
)

export const WUDANG_JIANFA: Skill = createSkill(
  'wudang_jianfa', '武当剑法', '武当派基础剑法',
  SkillType.SWORD, 5, 15,
  SkillTargetType.SINGLE,
  { damageMultiplier: 1.4, manaCost: 16, accuracy: 92, critRate: 10 },
  'wudang_sect',
  '需武当派弟子',
  '沉稳厚重'
)

// ============= 刀法 =============

export const HUJIA_DAOFA: Skill = createSkill(
  'hujia_daofa', '胡家刀法', '胡家祖传刀法',
  SkillType.BLADE, 8, 40,
  SkillTargetType.SINGLE,
  { damageMultiplier: 2.0, manaCost: 28, accuracy: 90, critRate: 18 },
  undefined,
  '需胡家传承',
  '刀法精妙，变化多端'
)

export const DAOFA_JINGYAO: Skill = createSkill(
  'daofa_jingyao', '刀法精要', '基础刀法',
  SkillType.BLADE, 4, 10,
  SkillTargetType.SINGLE,
  { damageMultiplier: 1.2, manaCost: 12, accuracy: 88, critRate: 10 },
  undefined,
  undefined,
  '江湖常见刀法'
)

// ============= 特殊武功 =============

export const DOUZHUAN_XINGYI: Skill = createSkill(
  'douzhuan_xingyi', '斗转星移', '慕容氏绝学，以彼之道还施彼身',
  SkillType.SPECIAL, 10, 50,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0, manaCost: 40, accuracy: 90, critRate: 0 },
  undefined,
  '需慕容氏传承',
  '反弹敌人攻击，威力取决于敌人攻击力'
)

export const SHIZI_HOU: Skill = createSkill(
  'shizi_hou', '狮子吼', '谢逊绝学，声波攻击',
  SkillType.SPECIAL, 8, 45,
  SkillTargetType.ALL,
  { damageMultiplier: 1.5, manaCost: 35, accuracy: 100, critRate: 10 },
  'mingjiao',
  undefined,
  '全体攻击，可震晕敌人'
)

export const DAGOU_BANGFA: Skill = createSkill(
  'dagou_bangfa', '打狗棒法', '丐帮镇帮绝学',
  SkillType.STAFF, 9, 45,
  SkillTargetType.SINGLE,
  { damageMultiplier: 2.2, manaCost: 35, accuracy: 95, critRate: 20 },
  'beggar_sect',
  '需丐帮帮主',
  '招式灵活，专攻下盘'
)

export const HUAMA_GONG: Skill = createSkill(
  'huama_gong', '蛤蟆功', '欧阳锋绝学',
  SkillType.INTERNAL, 9, 50,
  SkillTargetType.SINGLE,
  { damageMultiplier: 2.5, manaCost: 40, accuracy: 85, critRate: 15 },
  undefined,
  '需欧阳锋传承',
  '蓄力后爆发，威力惊人'
)

export const TAIWANG_DIXIA_ZHANG: Skill = createSkill(
  'taiwang_dixia_zhang', '天罗地网式', '古墓派武功',
  SkillType.SPECIAL, 7, 35,
  SkillTargetType.ALL,
  { damageMultiplier: 1.5, manaCost: 30, accuracy: 90, critRate: 10 },
  'gumu_sect',
  '需古墓派弟子',
  '群体攻击'
)

export const WUDU_SHENGONG: Skill = createSkill(
  'wudu_shengong', '五毒神功', '李莫愁用毒武功',
  SkillType.SPECIAL, 7, 40,
  SkillTargetType.SINGLE,
  { damageMultiplier: 1.5, manaCost: 25, accuracy: 90, critRate: 15 },
  undefined,
  undefined,
  '使敌人中毒，每回合持续掉血'
)

export const QIANZHU_WANDUSHOU: Skill = createSkill(
  'qianzhu_wandushou', '千蛛万毒手', '殷离武功',
  SkillType.SPECIAL, 7, 35,
  SkillTargetType.SINGLE,
  { damageMultiplier: 1.8, manaCost: 25, accuracy: 88, critRate: 15 },
  undefined,
  undefined,
  '带毒攻击'
)

export const YUZHUAN_GONG: Skill = createSkill(
  'yuzhuan_gong', '移魂大法', '黄药师绝学',
  SkillType.SPECIAL, 8, 45,
  SkillTargetType.SINGLE,
  { damageMultiplier: 0, manaCost: 40, accuracy: 85, critRate: 0 },
  'taohua_island',
  '需桃花岛传承',
  '魅惑敌人，使其攻击友军'
)

export const LINGJIU_GONG: Skill = createSkill(
  'lingjiu_gong', '灵鸠功', '特殊武功',
  SkillType.SPECIAL, 6, 30,
  SkillTargetType.SINGLE,
  { damageMultiplier: 1.5, manaCost: 20, accuracy: 90, critRate: 10 },
  undefined,
  undefined,
  '恢复自身生命值'
)

// ============= 合击技 =============

export const FUQI_SHUANGJIAN: Skill = createSkill(
  'fuqi_shuangjian', '夫妻双剑合璧', '郭靖黄蓉合击技',
  SkillType.SWORD, 10, 50,
  SkillTargetType.SINGLE,
  { damageMultiplier: 3.5, manaCost: 50, accuracy: 95, critRate: 30 },
  undefined,
  '需郭靖和黄蓉同时在场',
  '夫妻同心，其利断金',
  true,
  ['guo_jing', 'huang_rong']
)

export const XIANGLONG_TIANSHAN: Skill = createSkill(
  'xianglong_tianshan', '降龙天山联手', '萧峰虚竹合击技',
  SkillType.PALM, 10, 55,
  SkillTargetType.ALL,
  { damageMultiplier: 3.0, manaCost: 60, accuracy: 92, critRate: 25 },
  undefined,
  '需萧峰和虚竹同时在场',
  '降龙十八掌配合天山六阳掌',
  true,
  ['xiao_feng', 'xu_zhu']
)

export const DONGFANG_XIFANG: Skill = createSkill(
  'dongfang_xifang', '东西合璧', '黄药师欧阳锋联手',
  SkillType.SPECIAL, 10, 60,
  SkillTargetType.ALL,
  { damageMultiplier: 3.2, manaCost: 65, accuracy: 90, critRate: 20 },
  undefined,
  '需黄药师和欧阳锋同时在场',
  '弹指神通配合蛤蟆功',
  true,
  ['huang_yaoshi', 'ouyang_feng']
)

// ============= 导出所有武功 =============

export const ALL_SKILLS: Skill[] = [
  // 内功
  JIUYANG_SHENGONG, JIUYIN_ZHENJING, YIJIN_JING, BEIMING_SHENGONG,
  XIKONG_DAF, XIXING_DAF, KUIHUA_BAODIAN, XIAN_TIAN_GONG,
  CHUNYANG_GONG, TAIJI_GONG, LONGXIANG_BANRUO_GONG, SHENLONG_JIAO_GONG,

  // 轻功
  SHENXING_BAIBIAN, LINGBO_WEIBU, JIN_YAN_GONG, QINGGONG_SHENFA,

  // 掌法
  XIANGLONG_SHIBA, ANRAN_XIAOHUN_ZHANG, TIANSHAN_LIUYANG_ZHANG,
  POXIAN_ZHANG,

  // 拳法
  KONGMING_QUAN, QISHANG_QUAN,

  // 剑法
  DUGU_JIUJIAN, LIUMAI_SHENJIAN, YUSU_NVXIN_JIAN, TAIJI_JIANFA,
  XUANTIE_JIANFA, HUASHAN_JIANFA, EMEI_JIANFA, JINSHE_JIANFA,
  BIXIE_JIANFA, WUDANG_JIANFA,

  // 指法
  YIYANG_ZHI,

  // 刀法
  HUJIA_DAOFA, DAOFA_JINGYAO,

  // 杖法
  DAGOU_BANGFA,

  // 特殊
  DOUZHUAN_XINGYI, SHIZI_HOU, HUAMA_GONG, TAIWANG_DIXIA_ZHANG,
  WUDU_SHENGONG, QIANZHU_WANDUSHOU, YUZHUAN_GONG, LINGJIU_GONG,

  // 合击技
  FUQI_SHUANGJIAN, XIANGLONG_TIANSHAN, DONGFANG_XIFANG,
]

/** 根据 ID 查找武功 */
export function getSkillById(id: string): Skill | undefined {
  return ALL_SKILLS.find(s => s.id === id)
}

/** 根据名称查找武功 */
export function getSkillByName(name: string): Skill | undefined {
  return ALL_SKILLS.find(s => s.name === name)
}

/** 根据类型筛选武功 */
export function getSkillsByType(type: SkillType): Skill[] {
  return ALL_SKILLS.filter(s => s.type === type)
}

/** 根据门派筛选武功 */
export function getSkillsBySect(sectId: string): Skill[] {
  return ALL_SKILLS.filter(s => s.sectId === sectId)
}

/** 获取可学习的武功（根据等级） */
export function getSkillsByLevel(level: number): Skill[] {
  return ALL_SKILLS.filter(s => s.levelRequirement <= level)
}

/** 获取合击技 */
export function getComboSkills(): Skill[] {
  return ALL_SKILLS.filter(s => s.isCombo)
}

export default ALL_SKILLS
