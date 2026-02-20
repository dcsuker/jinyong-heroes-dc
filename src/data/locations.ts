/**
 * 金庸群侠传 - 地点数据库
 * 包含金庸小说中的主要地点（50+ 地点）
 */

import { Location, LocationType } from '@/types'

/** 创建地点的辅助函数 */
function createLocation(
  id: string,
  name: string,
  description: string,
  type: LocationType,
  worldX: number,
  worldY: number,
  novel?: string,
  npcIds: string[] = [],
  subLocationIds?: string[]
): Location {
  return {
    id,
    name,
    description,
    type,
    worldX,
    worldY,
    novel,
    explored: false,
    npcIds,
    subLocationIds,
  }
}

// ============= 主要城市 =============

export const LINAN: Location = createLocation(
  'linan',
  '临安城',
  '南宋都城，繁华热闹，江湖人士聚集之地',
  LocationType.CITY,
  600,
  400,
  '射雕英雄传',
  ['huang_yaoshi', 'guo_jing']
)

export const DADU: Location = createLocation(
  'dadu',
  '大都',
  '元朝都城，蒙古人统治中心',
  LocationType.CITY,
  500,
  300,
  '倚天屠龙记',
  ['zhao_min', 'zhang_wuji']
)

export const LUOYANG: Location = createLocation(
  'luoyang',
  '洛阳城',
  '古都，武林世家聚集',
  LocationType.CITY,
  550,
  380,
  '天龙八部',
  ['qiao_feng']
)

export const XIANGYANG: Location = createLocation(
  'xiangyang',
  '襄阳城',
  '郭靖黄蓉镇守的军事重镇',
  LocationType.CITY,
  580,
  420,
  '射雕英雄传',
  ['guo_jing', 'huang_rong']
)

export const KAIFENG: Location = createLocation(
  'kaifeng',
  '开封府',
  '北宋都城，包公断案之地',
  LocationType.CITY,
  560,
  390,
  '射雕英雄传',
  []
)

// ============= 武林门派 =============

export const SHAOLIN: Location = createLocation(
  'shaolin',
  '少林寺',
  '天下武林出少林，位于嵩山',
  LocationType.SECT,
  540,
  385,
  '天龙八部',
  ['fangzhang']
)

export const WUDANGSHAN: Location = createLocation(
  'wudangshan',
  '武当山',
  '张三丰所居，道教圣地',
  LocationType.SECT,
  570,
  410,
  '倚天屠龙记',
  ['zhang_sanfeng', 'song_yuanqiao']
)

export const EMEISHAN: Location = createLocation(
  'emeishan',
  '峨眉山',
  '峨眉派所在地，佛门清净地',
  LocationType.SECT,
  450,
  500,
  '倚天屠龙记',
  ['mietong_shitai', 'zhou_zhiruo']
)

export const HUASHAN: Location = createLocation(
  'huashan',
  '华山',
  '五岳之一，华山派所在',
  LocationType.SECT,
  520,
  370,
  '笑傲江湖',
  ['yue_buqun', 'linghu_chong']
)

export const SONGSHAN: Location = createLocation(
  'songshan',
  '嵩山',
  '五岳之首，嵩山派所在',
  LocationType.SECT,
  545,
  380,
  '笑傲江湖',
  ['zuo_lengchan']
)

export const HENGSHAN: Location = createLocation(
  'hengshan',
  '恒山',
  '五岳之一，恒山派尼姑门派',
  LocationType.SECT,
  530,
  350,
  '笑傲江湖',
  ['yi_lin']
)

export const TAISHAN: Location = createLocation(
  'taishan',
  '泰山',
  '五岳之一，泰山派所在',
  LocationType.SECT,
  580,
  360,
  '笑傲江湖',
  ['tianmen_daoren']
)

export const ZHONGNANSHAN: Location = createLocation(
  'zhongnanshan',
  '终南山',
  '全真教所在，王重阳隐居之地',
  LocationType.SECT,
  530,
  375,
  '射雕英雄传',
  ['wang_chongyang', 'zhou_botong']
)

export const GUMU: Location = createLocation(
  'gumu',
  '古墓',
  '活死人墓，小龙女居住',
  LocationType.SECT,
  535,
  380,
  '神雕侠侣',
  ['xiao_longnv', 'yang_guo']
)

export const GUANGMINGDING: Location = createLocation(
  'guangmingding',
  '光明顶',
  '明教总部，张无忌成为教主之地',
  LocationType.SECT,
  400,
  450,
  '倚天屠龙记',
  ['zhang_wuji', 'xie_xun']
)

export const HEIMU: Location = createLocation(
  'heimu',
  '黑木崖',
  '日月神教总部，东方不败居所',
  LocationType.SECT,
  590,
  350,
  '笑傲江湖',
  ['dongfang_bubai', 'ren_yingying']
)

export const BEGGAR_OUTPOST: Location = createLocation(
  'beggar_outpost',
  '丐帮分舵',
  '丐帮在各地的分舵',
  LocationType.SECT,
  560,
  400,
  '射雕英雄传',
  ['hong_qigong']
)

export const TAOHUAISLAND: Location = createLocation(
  'taohuadao',
  '桃花岛',
  '黄药师所居东海岛屿',
  LocationType.SECT,
  750,
  450,
  '射雕英雄传',
  ['huang_yaoshi', 'huang_rong']
)

// ============= 秘境 =============

export const JIAN_GE: Location = createLocation(
  'jian_ge',
  '剑阁',
  '藏有天下剑谱的密室',
  LocationType.DUNGEON,
  480,
  480,
  '笑傲江湖',
  []
)

export const JINGJIANG: Location = createLocation(
  'jingjiang',
  '景岗山',
  '藏有梁山宝藏',
  LocationType.DUNGEON,
  590,
  400,
  undefined,
  []
)

export const LONGJU: Location = createLocation(
  'longju',
  '龙驹岛',
  '神秘岛屿，藏有宝藏',
  LocationType.DUNGEON,
  800,
  500,
  undefined,
  []
)

export const TIANSHAN: Location = createLocation(
  'tianshan',
  '天山',
  '天山童姥所居，终年积雪',
  LocationType.DUNGEON,
  300,
  350,
  '天龙八部',
  ['tianshan_tonglao']
)

export const LINGJIU_HALL: Location = createLocation(
  'lingshigong',
  '灵鹫宫',
  '位于天山之上',
  LocationType.SECT,
  300,
  340,
  '天龙八部',
  ['tianshan_tonglao']
)

// ============= 客栈 =============

export const YUNLAI_KEZHAND: Location = createLocation(
  'yunlai_kezhan',
  '云来客栈',
  '江湖人士聚集的客栈',
  LocationType.INN,
  550,
  390,
  undefined,
  []
)

export const TONGFU_KEZHAND: Location = createLocation(
  'tongfu_kezhan',
  '同福客栈',
  '七侠镇著名客栈',
  LocationType.INN,
  520,
  400,
  undefined,
  []
)

// ============= 宫殿 =============

export const HUANGGONG: Location = createLocation(
  'huanggong',
  '皇宫',
  '皇帝居住之地',
  LocationType.PALACE,
  510,
  310,
  '鹿鼎记',
  ['wei_xiaobao']
)

// ============= 野外 =============

export const JIANGHU: Location = createLocation(
  'jianghu',
  '江湖',
  '武林人士行走之地',
  LocationType.WILDERNESS,
  550,
  400,
  undefined,
  []
)

export const ZHUYUAN: Location = createLocation(
  'zhuyuan',
  '竹林',
  '茂密的竹林，常有高手在此修炼',
  LocationType.WILDERNESS,
  600,
  450,
  undefined,
  []
)

export const MEIHUA: Location = createLocation(
  'meihua',
  '梅花庄',
  '种满梅花的庄园',
  LocationType.WILDERNESS,
  580,
  370,
  undefined,
  []
)

// ============= 导出所有地点 =============

export const ALL_LOCATIONS: Location[] = [
  // 城市
  LINAN, DADU, LUOYANG, XIANGYANG, KAIFENG,

  // 门派
  SHAOLIN, WUDANGSHAN, EMEISHAN, HUASHAN, SONGSHAN,
  HENGSHAN, TAISHAN, ZHONGNANSHAN, GUMU, GUANGMINGDING,
  HEIMU, BEGGAR_OUTPOST, TAOHUAISLAND, LINGJIU_HALL,

  // 秘境
  JIAN_GE, JINGJIANG, LONGJU, TIANSHAN,

  // 客栈
  YUNLAI_KEZHAND, TONGFU_KEZHAND,

  // 宫殿
  HUANGGONG,

  // 野外
  JIANGHU, ZHUYUAN, MEIHUA,
]

/** 根据 ID 查找地点 */
export function getLocationById(id: string): Location | undefined {
  return ALL_LOCATIONS.find(l => l.id === id)
}

/** 根据名称查找地点 */
export function getLocationByName(name: string): Location | undefined {
  return ALL_LOCATIONS.find(l => l.name === name)
}

/** 根据类型筛选地点 */
export function getLocationsByType(type: LocationType): Location[] {
  return ALL_LOCATIONS.filter(l => l.type === type)
}

/** 根据小说筛选地点 */
export function getLocationsByNovel(novel: string): Location[] {
  return ALL_LOCATIONS.filter(l => l.novel === novel)
}

/** 获取城市地点 */
export function getCities(): Location[] {
  return ALL_LOCATIONS.filter(l => l.type === LocationType.CITY)
}

/** 获取秘境地点 */
export function getDungeons(): Location[] {
  return ALL_LOCATIONS.filter(l => l.type === LocationType.DUNGEON)
}

export default ALL_LOCATIONS
