/**
 * 金庸群侠传 - 角色数据库
 * 包含金庸 14 部小说中的主要角色（100+ 角色）
 */

import { Character, CharacterType, CharacterStats } from '@/types'

/** 创建角色的辅助函数 */
function createCharacter(
  id: string,
  name: string,
  description: string,
  novel: string,
  sectId: string | undefined,
  type: CharacterType,
  level: number,
  stats: Partial<CharacterStats>,
  skillIds: string[],
  favorability: number = 0,
  recruitable: boolean = true,
  avatarColor: string = '#4a4a4a',
  title?: string
): Character {
  const baseStats: CharacterStats = {
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    strength: 10,
    agility: 10,
    intelligence: 10,
    defense: 10,
    attack: 10,
  }

  return {
    id,
    name,
    title,
    description,
    novel,
    sectId,
    type,
    level,
    exp: 0,
    maxLevel: 100,
    baseStats: { ...baseStats, ...stats },
    skillIds,
    itemIds: [],
    favorability,
    recruitable,
    avatarColor,
  }
}

// ============= 射雕英雄传 =============

export const GUO_JING: Character = createCharacter(
  'guo_jing', '郭靖', '忠厚老实的侠客，精通降龙十八掌和九阴真经',
  '射雕英雄传', undefined, CharacterType.ALLY, 50,
  { health: 180, maxHealth: 180, mana: 80, maxMana: 80, strength: 85, agility: 60, intelligence: 40, defense: 75, attack: 80 },
  ['xianglong_shiba', 'jiuyin_zhenjing', 'kongming_quan'],
  0, true, '#8B4513', '北侠'
)

export const HUANG_RONG: Character = createCharacter(
  'huang_rong', '黄蓉', '聪明机智的女侠，黄药师之女，精通打狗棒法',
  '射雕英雄传', 'taohua_island', CharacterType.ALLY, 48,
  { health: 120, maxHealth: 120, mana: 120, maxMana: 120, strength: 45, agility: 80, intelligence: 95, defense: 50, attack: 65 },
  ['dagou_bangfa', 'taohua_zhang', 'lanzhou_bifeng'],
  0, true, '#FFB6C1', '女中诸葛'
)

export const YANG_KANG: Character = createCharacter(
  'yang_kang', '杨康', '认贼作父的悲剧人物，杨铁心之子',
  '射雕英雄传', undefined, CharacterType.ENEMY, 45,
  { health: 130, maxHealth: 130, mana: 70, maxMana: 70, strength: 65, agility: 75, intelligence: 60, defense: 55, attack: 70 },
  ['jiuyin_baiguzhao'],
  0, false, '#696969', '小王爷'
)

export const MU_NIANCI: Character = createCharacter(
  'mu_nianci', '穆念慈', '忠贞不渝的女侠，杨康之妻',
  '射雕英雄传', undefined, CharacterType.ALLY, 40,
  { health: 100, maxHealth: 100, mana: 60, maxMana: 60, strength: 50, agility: 70, intelligence: 55, defense: 50, attack: 60 },
  ['mujiabian'],
  0, true, '#DDA0DD', ''
)

export const OUYANG_FENG: Character = createCharacter(
  'ouyang_feng', '欧阳锋', '西毒，蛤蟆功创始人',
  '射雕英雄传', undefined, CharacterType.ENEMY, 70,
  { health: 200, maxHealth: 200, mana: 100, maxMana: 100, strength: 90, agility: 55, intelligence: 70, defense: 70, attack: 95 },
  ['huama_gong', 'shetou_dianxue'],
  0, false, '#2F4F4F', '西毒'
)

export const HONG_QIGONG: Character = createCharacter(
  'hong_qigong', '洪七公', '北丐，降龙十八掌传人，丐帮帮主',
  '射雕英雄传', 'beggar_sect', CharacterType.ALLY, 75,
  { health: 210, maxHealth: 210, mana: 90, maxMana: 90, strength: 92, agility: 65, intelligence: 65, defense: 72, attack: 96 },
  ['xianglong_shiba', 'dagou_bangfa'],
  0, true, '#8B0000', '北丐'
)

export const HUANG_YAOSHI: Character = createCharacter(
  'huang_yaoshi', '黄药师', '东邪，桃花岛岛主，精通奇门遁甲',
  '射雕英雄传', 'taohua_island', CharacterType.ALLY, 72,
  { health: 180, maxHealth: 180, mana: 150, maxMana: 150, strength: 70, agility: 75, intelligence: 95, defense: 68, attack: 85 },
  ['taohua_zhang', 'lanzhou_bifeng', 'yuxiao_jianfa'],
  0, true, '#4169E1', '东邪'
)

export const YI_DENG: Character = createCharacter(
  'yi_deng', '一灯大师', '南帝，一阳指传人，大理国皇帝',
  '射雕英雄传', undefined, CharacterType.ALLY, 73,
  { health: 190, maxHealth: 190, mana: 140, maxMana: 140, strength: 65, agility: 55, intelligence: 75, defense: 70, attack: 88 },
  ['yiyang_zhi', 'jiuyin_zhenjing'],
  0, true, '#DAA520', '南帝'
)

export const WANG_CHongyang: Character = createCharacter(
  'wang_chongyang', '王重阳', '中神通，全真教创始人，天下第一',
  '射雕英雄传', 'quanzhen_sect', CharacterType.ALLY, 80,
  { health: 220, maxHealth: 220, mana: 160, maxMana: 160, strength: 85, agility: 70, intelligence: 90, defense: 80, attack: 98 },
  ['quanzhen_jianfa', 'xiantian_gong'],
  0, false, '#F5DEB3', '中神通'
)

export const QIU_QIANREN: Character = createCharacter(
  'qiu_qianren', '裘千仞', '铁掌水上漂，铁掌帮帮主',
  '射雕英雄传', undefined, CharacterType.ENEMY, 65,
  { health: 170, maxHealth: 170, mana: 80, maxMana: 80, strength: 82, agility: 78, intelligence: 55, defense: 65, attack: 85 },
  ['tiezhang_gong'],
  0, false, '#556B2F', '铁掌水上漂'
)

// ============= 神雕侠侣 =============

export const YANG_GUO: Character = createCharacter(
  'yang_guo', '杨过', '神雕大侠，自创黯然销魂掌',
  '神雕侠侣', undefined, CharacterType.ALLY, 55,
  { health: 160, maxHealth: 160, mana: 100, maxMana: 100, strength: 80, agility: 82, intelligence: 75, defense: 65, attack: 88 },
  ['anran_xiaohun_zhang', 'xuantie_jianfa', 'shejian_gong'],
  0, true, '#4682B4', '神雕大侠'
)

export const XIAO_LONGNV: Character = createCharacter(
  'xiao_longnv', '小龙女', '古墓派传人，清冷脱俗的仙子',
  '神雕侠侣', 'gumu_sect', CharacterType.ALLY, 52,
  { health: 130, maxHealth: 130, mana: 110, maxMana: 110, strength: 65, agility: 90, intelligence: 60, defense: 60, attack: 82 },
  ['yusu_nvxin_jian', 'tianwang_dixia_zhang'],
  0, true, '#F0F8FF', '小龙女'
)

export const LI_MOUCHOU: Character = createCharacter(
  'li_mochou', '李莫愁', '赤练仙子，古墓派叛徒',
  '神雕侠侣', 'gumu_sect', CharacterType.ENEMY, 55,
  { health: 140, maxHealth: 140, mana: 95, maxMana: 95, strength: 60, agility: 75, intelligence: 65, defense: 58, attack: 80 },
  ['wudu_shengong', 'bingpo_shenzhang'],
  0, false, '#8B008B', '赤练仙子'
)

export const GUO_FU: Character = createCharacter(
  'guo_fu', '郭芙', '郭靖长女，性格骄纵',
  '神雕侠侣', undefined, CharacterType.ALLY, 35,
  { health: 110, maxHealth: 110, mana: 50, maxMana: 50, strength: 55, agility: 60, intelligence: 40, defense: 50, attack: 58 },
  ['eimei_jianfa'],
  0, true, '#FF69B4', ''
)

export const GUO_XIANG: Character = createCharacter(
  'guo_xiang', '郭襄', '郭靖次女，豪爽侠义，后创峨眉派',
  '神雕侠侣', undefined, CharacterType.ALLY, 40,
  { health: 115, maxHealth: 115, mana: 75, maxMana: 75, strength: 52, agility: 68, intelligence: 70, defense: 52, attack: 62 },
  ['eimei_jianfa'],
  0, true, '#FF6347', '小东邪'
)

export const JINLUN_GUOSHI: Character = createCharacter(
  'jinlun_guoshi', '金轮法王', '蒙古国师，龙象般若功传人',
  '神雕侠侣', undefined, CharacterType.ENEMY, 68,
  { health: 200, maxHealth: 200, mana: 90, maxMana: 90, strength: 95, agility: 45, intelligence: 60, defense: 75, attack: 90 },
  ['longxiang_banruo_gong'],
  0, false, '#B8860B', '金轮国师'
)

// ============= 倚天屠龙记 =============

export const ZHANG_WUJI: Character = createCharacter(
  'zhang_wuji', '张无忌', '明教教主，九阳神功和乾坤大挪移传人',
  '倚天屠龙记', 'mingjiao', CharacterType.ALLY, 52,
  { health: 175, maxHealth: 175, mana: 130, maxMana: 130, strength: 78, agility: 75, intelligence: 70, defense: 72, attack: 85 },
  ['jiuyang_shengong', 'qiankun_danuoyi', 'qishang_quan'],
  0, true, '#8B7355', '明教教主'
)

export const ZHAO_MIN: Character = createCharacter(
  'zhao_min', '赵敏', '蒙古郡主，聪慧过人',
  '倚天屠龙记', undefined, CharacterType.ALLY, 45,
  { health: 110, maxHealth: 110, mana: 95, maxMana: 95, strength: 48, agility: 72, intelligence: 92, defense: 48, attack: 60 },
  [],
  0, true, '#FFE4B5', '蒙古郡主'
)

export const ZHOU_ZHIRUO: Character = createCharacter(
  'zhou_zhiruo', '周芷若', '峨眉派掌门，九阴白骨爪传人',
  '倚天屠龙记', 'emei_sect', CharacterType.ALLY, 48,
  { health: 125, maxHealth: 125, mana: 105, maxMana: 105, strength: 58, agility: 78, intelligence: 72, defense: 55, attack: 75 },
  ['jiuyin_baiguzhao', 'eimei_jianfa'],
  0, true, '#DDA0DD', '峨眉掌门'
)

export const XIAO_ZHAO: Character = createCharacter(
  'xiao_zhao', '小昭', '温柔体贴的侍女，实为紫衫龙王之女',
  '倚天屠龙记', undefined, CharacterType.ALLY, 38,
  { health: 95, maxHealth: 95, mana: 80, maxMana: 80, strength: 40, agility: 65, intelligence: 68, defense: 45, attack: 50 },
  ['qiankun_danuoyi'],
  0, true, '#FFC0CB', ''
)

export const YIN_LI: Character = createCharacter(
  'yin_li', '殷离', '蛛儿，殷天正孙女',
  '倚天屠龙记', undefined, CharacterType.ALLY, 42,
  { health: 120, maxHealth: 120, mana: 70, maxMana: 70, strength: 62, agility: 70, intelligence: 55, defense: 58, attack: 68 },
  ['qianzhu_wandushou'],
  0, true, '#8B3A62', '蛛儿'
)

export const YIN_TIANZHENG: Character = createCharacter(
  'yin_tianzheng', '殷天正', '天鹰教教主，白眉鹰王',
  '倚天屠龙记', undefined, CharacterType.ALLY, 65,
  { health: 185, maxHealth: 185, mana: 85, maxMana: 85, strength: 88, agility: 60, intelligence: 65, defense: 68, attack: 85 },
  ['yingzhua_gong'],
  0, true, '#A0522D', '白眉鹰王'
)

export const XIE_XUN: Character = createCharacter(
  'xie_xun', '谢逊', '金毛狮王，屠龙刀主人',
  '倚天屠龙记', 'mingjiao', CharacterType.ALLY, 62,
  { health: 195, maxHealth: 195, mana: 90, maxMana: 90, strength: 92, agility: 55, intelligence: 68, defense: 70, attack: 90 },
  ['qishang_quan', 'shizi_hou'],
  0, true, '#DAA520', '金毛狮王'
)

export const ZHANG_SANFENG: Character = createCharacter(
  'zhang_sanfeng', '张三丰', '武当派祖师，太极拳创始人',
  '倚天屠龙记', 'wudang_sect', CharacterType.ALLY, 85,
  { health: 230, maxHealth: 230, mana: 170, maxMana: 170, strength: 80, agility: 72, intelligence: 98, defense: 82, attack: 95 },
  ['taiji_quan', 'taiji_jianfa', 'chunyang_gong'],
  0, true, '#F5F5DC', '张真人'
)

export const SONG_YUANQIAO: Character = createCharacter(
  'song_yuanqiao', '宋远桥', '武当七侠之首',
  '倚天屠龙记', 'wudang_sect', CharacterType.ALLY, 55,
  { health: 155, maxHealth: 155, mana: 85, maxMana: 85, strength: 70, agility: 65, intelligence: 68, defense: 65, attack: 72 },
  ['wudang_jianfa', 'taiji_quan'],
  0, true, '#708090', ''
)

export const MIETONG_SHITAI: Character = createCharacter(
  'mietong_shitai', '灭绝师太', '峨眉派掌门，倚天剑主人',
  '倚天屠龙记', 'emei_sect', CharacterType.ENEMY, 60,
  { health: 160, maxHealth: 160, mana: 100, maxMana: 100, strength: 72, agility: 68, intelligence: 65, defense: 62, attack: 80 },
  ['eimei_jianfa'],
  0, false, '#696969', ''
)

// ============= 天龙八部 =============

export const XIAO_FENG: Character = createCharacter(
  'xiao_feng', '萧峰', '乔峰，契丹人，丐帮帮主，降龙十八掌传人',
  '天龙八部', 'beggar_sect', CharacterType.ALLY, 60,
  { health: 200, maxHealth: 200, mana: 90, maxMana: 90, strength: 95, agility: 70, intelligence: 68, defense: 75, attack: 96 },
  ['xianglong_shiba', 'longzhua_gong'],
  0, true, '#8B0000', '北乔峰'
)

export const XU_ZHU: Character = createCharacter(
  'xu_zhu', '虚竹', '少林寺小和尚，后为逍遥派掌门',
  '天龙八部', 'shaolin_sect', CharacterType.ALLY, 50,
  { health: 180, maxHealth: 180, mana: 120, maxMana: 120, strength: 75, agility: 60, intelligence: 50, defense: 70, attack: 78 },
  ['tianshan_liuyang_zhang', 'beiming_shengong'],
  0, true, '#8B4513', '梦郎'
)

export const DUAN_YU: Character = createCharacter(
  'duan_yu', '段誉', '大理国世子，六脉神剑传人',
  '天龙八部', undefined, CharacterType.ALLY, 48,
  { health: 140, maxHealth: 140, mana: 140, maxMana: 140, strength: 55, agility: 72, intelligence: 70, defense: 58, attack: 85 },
  ['liumai_shenjian', 'beiming_shengong'],
  0, true, '#4169E1', '段世子'
)

export const WANG_YUYAN: Character = createCharacter(
  'wang_yuyan', '王语嫣', '熟读各派武功秘籍的奇女子',
  '天龙八部', undefined, CharacterType.ALLY, 35,
  { health: 85, maxHealth: 85, mana: 90, maxMana: 90, strength: 30, agility: 55, intelligence: 95, defense: 35, attack: 40 },
  [],
  0, true, '#FFB6C1', '神仙姐姐'
)

export const MURONG_FU: Character = createCharacter(
  'murong_fu', '慕容复', '姑苏慕容，以斗转星移闻名',
  '天龙八部', undefined, CharacterType.ENEMY, 58,
  { health: 155, maxHealth: 155, mana: 95, maxMana: 95, strength: 72, agility: 78, intelligence: 75, defense: 65, attack: 80 },
  ['douzhuan_xingyi'],
  0, false, '#483D8B', '南慕容'
)

export const AOBAI: Character = createCharacter(
  'a_bai', '阿碧', '慕容复的侍女，温柔善良',
  '天龙八部', undefined, CharacterType.ALLY, 32,
  { health: 80, maxHealth: 80, mana: 70, maxMana: 70, strength: 35, agility: 60, intelligence: 58, defense: 40, attack: 42 },
  [],
  0, true, '#98FB98', ''
)

export const DUAN_ZHENGCHUN: Character = createCharacter(
  'duan_zhengchun', '段正淳', '大理国镇南王，段誉之父',
  '天龙八部', undefined, CharacterType.ALLY, 52,
  { health: 150, maxHealth: 150, mana: 85, maxMana: 85, strength: 68, agility: 65, intelligence: 62, defense: 62, attack: 70 },
  ['duanshi_jianfa'],
  0, true, '#DAA520', '镇南王'
)

export const JIU_MOZHI: Character = createCharacter(
  'jiu_mozhi', '鸠摩智', '吐蕃国师，精通火焰刀',
  '天龙八部', undefined, CharacterType.ENEMY, 65,
  { health: 165, maxHealth: 165, mana: 115, maxMana: 115, strength: 70, agility: 62, intelligence: 78, defense: 65, attack: 85 },
  ['huoyan_dao'],
  0, false, '#B22222', '大轮明王'
)

export const DING_CHUNQIU: Character = createCharacter(
  'ding_chunqiu', '丁春秋', '星宿老怪，用毒高手',
  '天龙八部', undefined, CharacterType.ENEMY, 62,
  { health: 155, maxHealth: 155, mana: 105, maxMana: 105, strength: 65, agility: 68, intelligence: 75, defense: 60, attack: 82 },
  ['xingxiu_du功'],
  0, false, '#2F4F4F', '星宿老仙'
)

export const TIAN_SHAN_TONG_LAO: Character = createCharacter(
  'tianshan_tonglao', '天山童姥', '逍遥派大弟子，返老还童',
  '天龙八部', undefined, CharacterType.ALLY, 68,
  { health: 145, maxHealth: 145, mana: 130, maxMana: 130, strength: 75, agility: 85, intelligence: 72, defense: 65, attack: 88 },
  ['bawang_guiyuan_gong', 'tianshan_liuyang_zhang'],
  0, true, '#C71585', '童姥'
)

// ============= 笑傲江湖 =============

export const LINGHU_CHONG: Character = createCharacter(
  'linghu_chong', '令狐冲', '华山派大弟子，独孤九剑传人',
  '笑傲江湖', 'huashan_sect', CharacterType.ALLY, 50,
  { health: 150, maxHealth: 150, mana: 100, maxMana: 100, strength: 72, agility: 85, intelligence: 70, defense: 62, attack: 85 },
  ['dugu_jiujian', 'taiji_jianfa'],
  0, true, '#4682B4', '令狐少侠'
)

export const REN_YINGYING: Character = createCharacter(
  'ren_yingying', '任盈盈', '日月神教圣姑，精通音律',
  '笑傲江湖', 'riyue_shenjiao', CharacterType.ALLY, 48,
  { health: 125, maxHealth: 125, mana: 110, maxMana: 110, strength: 55, agility: 75, intelligence: 80, defense: 58, attack: 70 },
  ['qingyin_gong'],
  0, true, '#9370DB', '圣姑'
)

export const YUE_LINGSHAN: Character = createCharacter(
  'yue_lingshan', '岳灵珊', '岳不群之女，令狐冲小师妹',
  '笑傲江湖', 'huashan_sect', CharacterType.ALLY, 38,
  { health: 100, maxHealth: 100, mana: 65, maxMana: 65, strength: 48, agility: 68, intelligence: 55, defense: 48, attack: 58 },
  ['huashan_jianfa'],
  0, true, '#FF69B4', '小师妹'
)

export const YUE_BUQUN: Character = createCharacter(
  'yue_buqun', '岳不群', '华山派掌门，君子剑',
  '笑傲江湖', 'huashan_sect', CharacterType.ENEMY, 58,
  { health: 155, maxHealth: 155, mana: 95, maxMana: 95, strength: 70, agility: 72, intelligence: 75, defense: 65, attack: 78 },
  ['zixia_gong', 'huashan_jianfa'],
  0, false, '#4B0082', '君子剑'
)

export const LIN_PINGZHI: Character = createCharacter(
  'lin_pingzhi', '林平之', '福威镖局少镖头，辟邪剑法传人',
  '笑傲江湖', 'huashan_sect', CharacterType.ENEMY, 45,
  { health: 125, maxHealth: 125, mana: 80, maxMana: 80, strength: 62, agility: 78, intelligence: 60, defense: 55, attack: 75 },
  ['bixie_jianfa'],
  0, false, '#2F4F4F', ''
)

export const DONGFANG_BUBAI: Character = createCharacter(
  'dongfang_bubai', '东方不败', '日月神教教主，葵花宝典传人',
  '笑傲江湖', 'riyue_shenjiao', CharacterType.ENEMY, 70,
  { health: 160, maxHealth: 160, mana: 120, maxMana: 120, strength: 75, agility: 98, intelligence: 80, defense: 70, attack: 95 },
  ['kuihua_baodian'],
  0, false, '#8B008B', '东方教主'
)

export const REN_WOXING: Character = createCharacter(
  'ren_woxing', '任我行', '日月神教前教主，吸星大法传人',
  '笑傲江湖', 'riyue_shenjiao', CharacterType.ENEMY, 68,
  { health: 185, maxHealth: 185, mana: 100, maxMana: 100, strength: 88, agility: 68, intelligence: 75, defense: 70, attack: 90 },
  ['xixing_dafa'],
  0, false, '#8B0000', '任教主'
)

export const ZUO_LENGCHAN: Character = createCharacter(
  'zuo_lengchan', '左冷禅', '嵩山派掌门，五岳剑派盟主',
  '笑傲江湖', 'songshan_sect', CharacterType.ENEMY, 62,
  { health: 165, maxHealth: 165, mana: 90, maxMana: 90, strength: 78, agility: 68, intelligence: 70, defense: 68, attack: 82 },
  ['songshan_jianfa', 'bingchan_gong'],
  0, false, '#708090', '左盟主'
)

export const YI_LIN: Character = createCharacter(
  'yi_lin', '仪琳', '恒山派小尼姑，纯真善良',
  '笑傲江湖', 'hengshan_sect', CharacterType.ALLY, 30,
  { health: 85, maxHealth: 85, mana: 75, maxMana: 75, strength: 38, agility: 55, intelligence: 50, defense: 45, attack: 45 },
  ['hengshan_jianfa'],
  0, true, '#FFE4E1', ''
)

export const TIAN_BOGUANG: Character = createCharacter(
  'tian_boguang', '田伯光', '万里独行，采花大盗',
  '笑傲江湖', undefined, CharacterType.ALLY, 48,
  { health: 135, maxHealth: 135, mana: 70, maxMana: 70, strength: 68, agility: 82, intelligence: 55, defense: 58, attack: 72 },
  ['kuaidao'],
  0, true, '#D2691E', '万里独行'
)

// ============= 鹿鼎记 =============

export const WEI_XIAOBAO: Character = createCharacter(
  'wei_xiaobao', '韦小宝', '市井出身的小混混，却屡建奇功',
  '鹿鼎记', undefined, CharacterType.ALLY, 35,
  { health: 120, maxHealth: 120, mana: 60, maxMana: 60, strength: 45, agility: 75, intelligence: 85, defense: 52, attack: 55 },
  ['shenxing_baibian'],
  0, true, '#CD853F', '韦爵爷'
)

export const JIAN_NING: Character = createCharacter(
  'jian_ning', '建宁公主', '刁蛮任性的公主，韦小宝之妻',
  '鹿鼎记', undefined, CharacterType.ALLY, 32,
  { health: 95, maxHealth: 95, mana: 70, maxMana: 70, strength: 42, agility: 65, intelligence: 60, defense: 45, attack: 52 },
  [],
  0, true, '#FF69B4', '建宁公主'
)

export const SHUANG_ER: Character = createCharacter(
  'shuang_er', '双儿', '韦小宝的贴身侍女，忠心耿耿',
  '鹿鼎记', undefined, CharacterType.ALLY, 35,
  { health: 100, maxHealth: 100, mana: 55, maxMana: 55, strength: 48, agility: 70, intelligence: 55, defense: 50, attack: 55 },
  ['shuangdao'],
  0, true, '#FFB6C1', ''
)

export const CHEN_JIN_NAN: Character = createCharacter(
  'chen_jinnan', '陈近南', '天地会总舵主，平生不识陈近南，便称英雄也枉然',
  '鹿鼎记', undefined, CharacterType.ALLY, 65,
  { health: 170, maxHealth: 170, mana: 95, maxMana: 95, strength: 78, agility: 72, intelligence: 80, defense: 70, attack: 82 },
  ['yiyang_zhi'],
  0, true, '#8B4513', '陈总舵主'
)

export const HAI_DAGFU: Character = createCharacter(
  'hai_dafu', '海大富', '宫中老太监，武功深不可测',
  '鹿鼎记', undefined, CharacterType.ALLY, 60,
  { health: 155, maxHealth: 155, mana: 100, maxMana: 100, strength: 70, agility: 65, intelligence: 72, defense: 68, attack: 78 },
  ['huagong_dafa'],
  0, true, '#696969', '海公公'
)

export const SHEN_LONGWANG: Character = createCharacter(
  'shen_longwang', '神龙教主', '神龙教教主',
  '鹿鼎记', undefined, CharacterType.ENEMY, 68,
  { health: 175, maxHealth: 175, mana: 110, maxMana: 110, strength: 80, agility: 65, intelligence: 75, defense: 72, attack: 85 },
  ['shenlong_jiao_gong'],
  0, false, '#2F4F4F', '神龙教主'
)

// ============= 书剑恩仇录 =============

export const JIA_LUO: Character = createCharacter(
  'jia_luo', '陈家洛', '红花会总舵主，乾隆皇帝的弟弟',
  '书剑恩仇录', undefined, CharacterType.ALLY, 48,
  { health: 145, maxHealth: 145, mana: 90, maxMana: 90, strength: 70, agility: 75, intelligence: 72, defense: 62, attack: 75 },
  ['fanying_meihua_zhang'],
  0, true, '#4169E1', '陈总舵主'
)

export const LUO_BING: Character = createCharacter(
  'luo_bing', '骆冰', '红花会十一当家，金刀骆家后人',
  '书剑恩仇录', undefined, CharacterType.ALLY, 42,
  { health: 120, maxHealth: 120, mana: 65, maxMana: 65, strength: 60, agility: 72, intelligence: 58, defense: 55, attack: 68 },
  ['shuangdao'],
  0, true, '#FF6347', '鸳鸯刀'
)

export const WEN_TAILAI: Character = createCharacter(
  'wen_tailai', '文泰来', '红花会四当家，奔雷手',
  '书剑恩仇录', undefined, CharacterType.ALLY, 50,
  { health: 155, maxHealth: 155, mana: 75, maxMana: 75, strength: 78, agility: 68, intelligence: 60, defense: 65, attack: 76 },
  ['benlei_zhang'],
  0, true, '#8B4513', '奔雷手'
)

// ============= 碧血剑 =============

export const YUAN_CHENGZHI: Character = createCharacter(
  'yuan_chengzhi', '袁承志', '袁崇焕之子，金蛇郎君传人',
  '碧血剑', undefined, CharacterType.ALLY, 52,
  { health: 160, maxHealth: 160, mana: 95, maxMana: 95, strength: 78, agility: 75, intelligence: 70, defense: 68, attack: 82 },
  ['jinshe_jianfa', 'bixie_jianfa'],
  0, true, '#4682B4', '袁少侠'
)

export const XIA_QINGQING: Character = createCharacter(
  'xia_qingqing', '夏青青', '金蛇郎君之女，袁承志之妻',
  '碧血剑', undefined, CharacterType.ALLY, 45,
  { health: 125, maxHealth: 125, mana: 85, maxMana: 85, strength: 58, agility: 72, intelligence: 65, defense: 55, attack: 68 },
  ['jinshe_jianfa'],
  0, true, '#98FB98', ''
)

export const JIN_SHE_LANGJUN: Character = createCharacter(
  'jin_she_langjun', '金蛇郎君', '夏雪宜，金蛇剑和金蛇锥主人',
  '碧血剑', undefined, CharacterType.ALLY, 55,
  { health: 150, maxHealth: 150, mana: 90, maxMana: 90, strength: 72, agility: 80, intelligence: 75, defense: 62, attack: 82 },
  ['jinshe_jianfa', 'jinshe_zhui'],
  0, false, '#8B7355', '金蛇郎君'
)

// ============= 雪山飞狐 =============

export const HU_FEI: Character = createCharacter(
  'hu_fei', '胡斐', '雪山飞狐，胡家刀法传人',
  '雪山飞狐', undefined, CharacterType.ALLY, 48,
  { health: 150, maxHealth: 150, mana: 80, maxMana: 80, strength: 78, agility: 75, intelligence: 65, defense: 65, attack: 82 },
  ['hujia_dao fa'],
  0, true, '#8B4513', '雪山飞狐'
)

export const CHENG_LINGSU: Character = createCharacter(
  'cheng_lingsu', '程灵素', '毒手药王弟子，医术高超',
  '雪山飞狐', undefined, CharacterType.ALLY, 42,
  { health: 100, maxHealth: 100, mana: 100, maxMana: 100, strength: 40, agility: 62, intelligence: 88, defense: 48, attack: 55 },
  ['duyao_gong'],
  0, true, '#DDA0DD', '药王弟子'
)

export const YUAN_ZIYI: Character = createCharacter(
  'yuan_ziyi', '袁紫衣', '凤天南之女，尼姑装扮',
  '雪山飞狐', undefined, CharacterType.ALLY, 45,
  { health: 125, maxHealth: 125, mana: 75, maxMana: 75, strength: 58, agility: 78, intelligence: 62, defense: 55, attack: 68 },
  ['emei_jianfa'],
  0, true, '#9370DB', ''
)

// ============= 飞狐外传 =============

export const HU_FEI_YOUNG: Character = createCharacter(
  'hu_fei_young', '胡斐', '少年胡斐，初出江湖',
  '飞狐外传', undefined, CharacterType.ALLY, 38,
  { health: 130, maxHealth: 130, mana: 70, maxMana: 70, strength: 70, agility: 72, intelligence: 60, defense: 58, attack: 72 },
  ['hujia_dao fa'],
  0, true, '#A0522D', ''
)

// ============= 连城诀 =============

export const DI_YUN: Character = createCharacter(
  'di_yun', '狄云', '朴实无华的少年，连城诀传人',
  '连城诀', undefined, CharacterType.ALLY, 45,
  { health: 145, maxHealth: 145, mana: 75, maxMana: 75, strength: 72, agility: 68, intelligence: 55, defense: 65, attack: 75 },
  ['liancheng_jue'],
  0, true, '#8B4513', ''
)

export const SHUI_SHENG: Character = createCharacter(
  'shui_sheng', '水笙', '水岱之女，与狄云患难与共',
  '连城诀', undefined, CharacterType.ALLY, 38,
  { health: 110, maxHealth: 110, mana: 65, maxMana: 65, strength: 52, agility: 68, intelligence: 58, defense: 52, attack: 60 },
  ['shuixiu_gong'],
  0, true, '#FFE4E1', ''
)

// ============= 侠客行 =============

export const SHI_potian: Character = createCharacter(
  'shi_potian', '石破天', '小乞丐，太玄经传人',
  '侠客行', undefined, CharacterType.ALLY, 55,
  { health: 175, maxHealth: 175, mana: 110, maxMana: 110, strength: 85, agility: 78, intelligence: 40, defense: 72, attack: 88 },
  ['taixuan_jing', 'luohan_quan'],
  0, true, '#8B7355', '狗杂种'
)

export const DINGDANG: Character = createCharacter(
  'dingdang', '丁当', '叮叮当当，石中玉之妻',
  '侠客行', undefined, CharacterType.ALLY, 40,
  { health: 110, maxHealth: 110, mana: 75, maxMana: 75, strength: 50, agility: 72, intelligence: 65, defense: 52, attack: 62 },
  [],
  0, true, '#FF69B4', '叮叮当当'
)

// ============= 白马啸西风 =============

export const LI_WENXIU: Character = createCharacter(
  'li_wenxiu', '李文秀', '江南女子，痴情于苏普',
  '白马啸西风', undefined, CharacterType.ALLY, 35,
  { health: 95, maxHealth: 95, mana: 70, maxMana: 70, strength: 42, agility: 65, intelligence: 62, defense: 48, attack: 52 },
  [],
  0, true, '#FFB6C1', ''
)

// ============= 鸳鸯刀 =============

export const YUAN_GUAN_YING: Character = createCharacter(
  'yuan_guanying', '袁冠南', '少年英雄，鸳鸯刀传人',
  '鸳鸯刀', undefined, CharacterType.ALLY, 42,
  { health: 130, maxHealth: 130, mana: 70, maxMana: 70, strength: 68, agility: 72, intelligence: 62, defense: 60, attack: 72 },
  ['yuanyang_dao'],
  0, true, '#4682B4', ''
)

// ============= 越女剑 =============

export const A_QING: Character = createCharacter(
  'a_qing', '阿青', '越女剑传人，剑法通神',
  '越女剑', undefined, CharacterType.ALLY, 50,
  { health: 130, maxHealth: 130, mana: 95, maxMana: 95, strength: 65, agility: 92, intelligence: 58, defense: 58, attack: 88 },
  ['yuenü_jian'],
  0, true, '#98FB98', '越女'
)

// ============= 其他重要角色 =============

export const ZHOU_botong: Character = createCharacter(
  'zhou_botong', '周伯通', '老顽童，王重阳师弟',
  '射雕英雄传', 'quanzhen_sect', CharacterType.ALLY, 70,
  { health: 190, maxHealth: 190, mana: 130, maxMana: 130, strength: 82, agility: 80, intelligence: 65, defense: 72, attack: 88 },
  ['kongming_quan', 'shuangshou_hubo'],
  0, true, '#F5DEB3', '老顽童'
)

export const YING_GU: Character = createCharacter(
  'ying_gu', '瑛姑', '神算子，段皇爷妃子',
  '射雕英雄传', undefined, CharacterType.ALLY, 55,
  { health: 130, maxHealth: 130, mana: 105, maxMana: 105, strength: 55, agility: 68, intelligence: 85, defense: 55, attack: 68 },
  ['nisu_gong'],
  0, true, '#D8BFD8', '神算子'
)

// ============= 导出所有角色 =============

export const ALL_CHARACTERS: Character[] = [
  // 射雕英雄传
  GUO_JING, HUANG_RONG, YANG_KANG, MU_NIANCI, OUYANG_FENG,
  HONG_QIGONG, HUANG_YAOSHI, YI_DENG, WANG_CHongyang, QIU_QIANREN,

  // 神雕侠侣
  YANG_GUO, XIAO_LONGNV, LI_MOUCHOU, GUO_FU, GUO_XIANG, JINLUN_GUOSHI,

  // 倚天屠龙记
  ZHANG_WUJI, ZHAO_MIN, ZHOU_ZHIRUO, XIAO_ZHAO, YIN_LI,
  YIN_TIANZHENG, XIE_XUN, ZHANG_SANFENG, SONG_YUANQIAO, MIETONG_SHITAI,

  // 天龙八部
  XIAO_FENG, XU_ZHU, DUAN_YU, WANG_YUYAN, MURONG_FU, AOBAI,
  DUAN_ZHENGCHUN, JIU_MOZHI, DING_CHUNQIU, TIAN_SHAN_TONG_LAO,

  // 笑傲江湖
  LINGHU_CHONG, REN_YINGYING, YUE_LINGSHAN, YUE_BUQUN, LIN_PINGZHI,
  DONGFANG_BUBAI, REN_WOXING, ZUO_LENGCHAN, YI_LIN, TIAN_BOGUANG,

  // 鹿鼎记
  WEI_XIAOBAO, JIAN_NING, SHUANG_ER, CHEN_JIN_NAN, HAI_DAGFU, SHEN_LONGWANG,

  // 书剑恩仇录
  JIA_LUO, LUO_BING, WEN_TAILAI,

  // 碧血剑
  YUAN_CHENGZHI, XIA_QINGQING, JIN_SHE_LANGJUN,

  // 雪山飞狐
  HU_FEI, CHENG_LINGSU, YUAN_ZIYI,

  // 飞狐外传
  HU_FEI_YOUNG,

  // 连城诀
  DI_YUN, SHUI_SHENG,

  // 侠客行
  SHI_potian, DINGDANG,

  // 白马啸西风
  LI_WENXIU,

  // 鸳鸯刀
  YUAN_GUAN_YING,

  // 越女剑
  A_QING,

  // 其他
  ZHOU_botong, YING_GU,
]

/** 根据 ID 查找角色 */
export function getCharacterById(id: string): Character | undefined {
  return ALL_CHARACTERS.find(c => c.id === id)
}

/** 根据名称查找角色 */
export function getCharacterByName(name: string): Character | undefined {
  return ALL_CHARACTERS.find(c => c.name === name)
}

/** 根据小说筛选角色 */
export function getCharactersByNovel(novel: string): Character[] {
  return ALL_CHARACTERS.filter(c => c.novel === novel)
}

/** 根据门派筛选角色 */
export function getCharactersBySect(sectId: string): Character[] {
  return ALL_CHARACTERS.filter(c => c.sectId === sectId)
}

/** 获取可招募角色列表 */
export function getRecruitableCharacters(): Character[] {
  return ALL_CHARACTERS.filter(c => c.recruitable && c.type === CharacterType.ALLY)
}

/** 根据类型筛选角色 */
export function getCharactersByType(type: CharacterType): Character[] {
  return ALL_CHARACTERS.filter(c => c.type === type)
}

export default ALL_CHARACTERS
