/**
 * 金庸群侠传 - 门派数据库
 * 包含金庸小说中的主要武林门派（20+ 门派）
 */

import { Sect, SectAlignment } from '@/types'

/** 创建门派的辅助函数 */
function createSect(
  id: string,
  name: string,
  description: string,
  alignment: SectAlignment,
  power: number,
  locationId: string | undefined,
  leaderId: string | undefined,
  exclusiveSkillIds: string[],
  levelRequirement: number,
  joinRequirement?: string,
  friendship: number = 0
): Sect {
  return {
    id,
    name,
    description,
    alignment,
    power,
    locationId,
    leaderId,
    exclusiveSkillIds,
    levelRequirement,
    joinRequirement,
    friendship,
  }
}

// ============= 正道门派 =============

export const SHAOLIN_SECT: Sect = createSect(
  'shaolin_sect',
  '少林寺',
  '天下武林出少林，少林寺是武林中资历最老的门派，以禅入武，内功心法独步天下',
  SectAlignment.RIGHTEOUS,
  95,
  'shaolin',
  'fangzhang',
  ['yijin_jing', 'luohan_quan', 'shaolin_jianfa'],
  20,
  '需通过少林三关测试'
)

export const WUDANG_SECT: Sect = createSect(
  'wudang_sect',
  '武当派',
  '张三丰所创，以柔克刚，以静制动，太极功夫冠绝天下',
  SectAlignment.RIGHTEOUS,
  90,
  'wudangshan',
  'zhang_sanfeng',
  ['taiji_quan', 'taiji_jianfa', 'chunyang_gong'],
  20,
  '需有道家根基'
)

export const EMEI_SECT: Sect = createSect(
  'emei_sect',
  '峨眉派',
  '郭襄所创，只收女弟子，剑法典雅',
  SectAlignment.RIGHTEOUS,
  75,
  'emeishan',
  'mietong_shitai',
  ['emei_jianfa', 'eimei_shengong'],
  15,
  '只收女弟子'
)

export const HUASHAN_SECT: Sect = createSect(
  'huashan_sect',
  '华山派',
  '五岳剑派之一，剑法轻灵飘逸',
  SectAlignment.RIGHTEOUS,
  70,
  'huashan',
  'yue_buqun',
  ['huashan_jianfa', 'zixia_gong'],
  15,
  '需通过华山入门测试'
)

export const SONGSHAN_SECT: Sect = createSect(
  'songshan_sect',
  '嵩山派',
  '五岳剑派盟主，左冷禅所领',
  SectAlignment.RIGHTEOUS,
  72,
  'songshan',
  'zuo_lengchan',
  ['songshan_jianfa', 'bingchan_gong'],
  20,
  '需五岳剑派推荐'
)

export const HENGSHAN_SECT: Sect = createSect(
  'hengshan_sect',
  '恒山派',
  '五岳剑派之一，尼姑门派',
  SectAlignment.RIGHTEOUS,
  60,
  'hengshan',
  'dingyi_shitai',
  ['hengshan_jianfa'],
  15,
  '只收女弟子'
)

export const HENGSHAN_SECT_2: Sect = createSect(
  'hengshan_sect_2',
  '衡山派',
  '五岳剑派之一，位于湖南',
  SectAlignment.RIGHTEOUS,
  58,
  'hengshan_hunan',
  'liu_zhengfeng',
  ['hengshan_jianfa_hunan'],
  15,
  '需推荐'
)

export const TAISHAN_SECT: Sect = createSect(
  'taishan_sect',
  '泰山派',
  '五岳剑派之一，位于山东',
  SectAlignment.RIGHTEOUS,
  55,
  'taishan',
  'tianmen_daoren',
  ['taishan_jianfa'],
  15,
  '需推荐'
)

export const QUANZHEN_SECT: Sect = createSect(
  'quanzhen_sect',
  '全真教',
  '王重阳所创，道家正宗，内功精纯',
  SectAlignment.RIGHTEOUS,
  85,
  'zhongnanshan',
  'wang_chongyang',
  ['quanzhen_jianfa', 'xiantian_gong', 'kongming_quan'],
  25,
  '需出家为道士'
)

export const GUMU_SECT: Sect = createSect(
  'gumu_sect',
  '古墓派',
  '林朝英所创，位于活死人墓中',
  SectAlignment.NEUTRAL,
  65,
  'gumu',
  'xiao_longnv',
  ['yusu_nvxin_jian', 'tianwang_dixia_zhang'],
  30,
  '需通过古墓机关考验'
)

// ============= 邪道门派 =============

export const RIYUE_SHENJIAO: Sect = createSect(
  'riyue_shenjiao',
  '日月神教',
  '东方不败所领，教众众多，势力庞大',
  SectAlignment.EVIL,
  88,
  'heimu',
  'dongfang_bubai',
  ['kuihua_baodian', 'xixing_dafa', 'qingyin_gong'],
  25,
  '需效忠教主'
)

export const MINGJIAO: Sect = createSect(
  'mingjiao',
  '明教',
  '源自波斯，张无忌为教主',
  SectAlignment.RIGHTEOUS,
  80,
  'guangmingding',
  'zhang_wuji',
  ['qiankun_danuoyi', 'shenghuo_ling_jianfa'],
  25,
  '需通过光明顶试炼'
)

export const TANGMEN: Sect = createSect(
  'tangmen',
  '唐门',
  '四川唐门，以暗器和毒闻名',
  SectAlignment.NEUTRAL,
  70,
  'tangmen_sichuan',
  'tangmen_zhanglao',
  ['tangmen_anqi', 'tangmen_du_gong'],
  20,
  '需唐门血脉或特殊贡献'
)

export const XINGXIU_SECT: Sect = createSect(
  'xingxiu_sect',
  '星宿派',
  '丁春秋所创，以毒功著称',
  SectAlignment.EVIL,
  55,
  'xingxiu',
  'ding_chunqiu',
  ['xingxiu_du_gong'],
  20,
  '需向星宿老仙效忠'
)

// ============= 中立门派 =============

export const BEGGAR_SECT: Sect = createSect(
  'beggar_sect',
  '丐帮',
  '天下第一大帮，帮众遍布各地',
  SectAlignment.RIGHTEOUS,
  92,
  'beggar_outpost',
  'hong_qigong',
  ['xianglong_shiba', 'dagou_bangfa'],
  10,
  '需为丐帮弟子'
)

export const TAOHUA_ISLAND: Sect = createSect(
  'taohua_island',
  '桃花岛',
  '黄药师所居，奇门遁甲天下无双',
  SectAlignment.NEUTRAL,
  82,
  'taohuadao',
  'huang_yaoshi',
  ['taohua_zhang', 'lanzhou_bifeng', 'yuxiao_jianfa'],
  35,
  '需通过桃花岛阵法'
)

export const WULIANG_SECT: Sect = createSect(
  'wuliang_sect',
  '无量剑派',
  '位于云南无量山',
  SectAlignment.NEUTRAL,
  35,
  'wuliangshan',
  'wuliang_zhangmen',
  ['wuliang_jianfa'],
  10,
  '需推荐'
)

export const KONGTONG_SECT: Sect = createSect(
  'kongtong_sect',
  '崆峒派',
  '西北大派，七伤拳闻名',
  SectAlignment.RIGHTEOUS,
  65,
  'kongtongshan',
  'kongtong_zhanglao',
  ['qishang_quan', 'kongtong_quanfa'],
  25,
  '需通过崆峒试炼'
)

export const LINGJIU_PALACE: Sect = createSect(
  'lingjiu_gong',
  '灵鹫宫',
  '天山童姥所居，逍遥派分支',
  SectAlignment.NEUTRAL,
  75,
  'lingshigong',
  'tianshan_tonglao',
  ['tianshan_liuyang_zhang', 'bawang_guiyuan_gong'],
  40,
  '需女子且通过考验'
)

export const TIANYING_JIAO: Sect = createSect(
  'tianyinjiao',
  '天鹰教',
  '殷天正所创，后并入明教',
  SectAlignment.NEUTRAL,
  68,
  'tianyinjiao_base',
  'yin_tianzheng',
  ['yingzhua_gong'],
  20,
  '需推荐'
)

export const JUEQING_SECT: Sect = createSect(
  'jueqing_sect',
  '绝情谷',
  '公孙止所居，与世隔绝',
  SectAlignment.NEUTRAL,
  50,
  'jueqinggu',
  'gongsun_zhi',
  ['jueqing_jianfa'],
  25,
  '需谷主同意'
)

export const WUDU_JIAO: Sect = createSect(
  'wudu_jiao',
  '五毒教',
  '蓝凤凰所领，位于苗疆',
  SectAlignment.EVIL,
  55,
  'wudu_jiao_miaojiang',
  'lan_fenghuang',
  ['wudu_shengong', 'gujiang'],
  20,
  '需苗疆人士'
)

// ============= 导出所有门派 =============

export const ALL_SECTS: Sect[] = [
  // 正道
  SHAOLIN_SECT, WUDANG_SECT, EMEI_SECT, HUASHAN_SECT,
  SONGSHAN_SECT, HENGSHAN_SECT, HENGSHAN_SECT_2, TAISHAN_SECT,
  QUANZHEN_SECT, GUMU_SECT, BEGGAR_SECT, MINGJIAO,
  KONGTONG_SECT,

  // 邪道
  RIYUE_SHENJIAO, XINGXIU_SECT, WUDU_JIAO,

  // 中立
  TAOHUA_ISLAND, WULIANG_SECT, LINGJIU_PALACE, TIANYING_JIAO,
  JUEQING_SECT, TANGMEN,
]

/** 根据 ID 查找门派 */
export function getSectById(id: string): Sect | undefined {
  return ALL_SECTS.find(s => s.id === id)
}

/** 根据名称查找门派 */
export function getSectByName(name: string): Sect | undefined {
  return ALL_SECTS.find(s => s.name === name)
}

/** 根据阵营筛选门派 */
export function getSectsByAlignment(alignment: SectAlignment): Sect[] {
  return ALL_SECTS.filter(s => s.alignment === alignment)
}

/** 获取正道门派 */
export function getRighteousSects(): Sect[] {
  return ALL_SECTS.filter(s => s.alignment === SectAlignment.RIGHTEOUS)
}

/** 获取邪道门派 */
export function getEvilSects(): Sect[] {
  return ALL_SECTS.filter(s => s.alignment === SectAlignment.EVIL)
}

/** 获取中立门派 */
export function getNeutralSects(): Sect[] {
  return ALL_SECTS.filter(s => s.alignment === SectAlignment.NEUTRAL)
}

export default ALL_SECTS
