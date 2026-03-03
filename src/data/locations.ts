import type { Location } from '../types';

const L = (
  id: string,
  name: string,
  mapPos: { x: number; y: number },
  connected: string[],
  npcs: string[],
  type: Location['type'],
  opts?: Partial<Location>
): Location => ({
  id,
  name,
  novel: opts?.novel ?? '通用',
  mapPos,
  scenePath: opts?.scenePath ?? `/scenes/${id}`,
  bgm: opts?.bgm ?? 'jianghu_theme',
  connected,
  npcs,
  shopType: opts?.shopType,
  description: opts?.description ?? name,
  type,
});

export const LOCATIONS: Record<string, Location> = {
  jiaxing: L('jiaxing', '嘉兴', { x: 810, y: 370 }, ['hangzhou', 'lin_an', 'yangzhou'], ['innkeeper', 'merchant'], 'city', {
    bgm: 'town_jiangnan',
    shopType: 'general',
    description: '江南起点，水路与商旅交汇之地',
  }),
  lin_an: L('lin_an', '临安', { x: 760, y: 345 }, ['jiaxing', 'hangzhou', 'xianyang'], ['southern_emperor', 'official'], 'city', {
    bgm: 'town_capital',
    shopType: 'luxury',
  }),
  xiangyang: L('xiangyang', '襄阳', { x: 520, y: 380 }, ['wudang', 'chongqing', 'luoyang'], ['guo_jing', 'huang_rong'], 'city', {
    bgm: 'town_heroic',
    shopType: 'armory',
  }),
  dali: L('dali', '大理', { x: 220, y: 500 }, ['chengdu', 'tianshan'], ['duan_yu', 'duan_zhengchun'], 'city', {
    bgm: 'town_yunnan',
    shopType: 'general',
  }),
  beijing: L('beijing', '北京', { x: 700, y: 125 }, ['tianjin', 'black_cliff'], ['wei_xiaobao', 'kangxi'], 'city', {
    bgm: 'town_capital',
    shopType: 'luxury',
  }),

  shaolin: L('shaolin', '少林寺', { x: 520, y: 270 }, ['songshan', 'luoyang', 'kaifeng'], ['fang_zheng', 'xuan_nan', 'monk'], 'temple', {
    bgm: 'temple_zen',
    shopType: 'manual',
  }),
  wudang: L('wudang', '武当山', { x: 560, y: 350 }, ['xiangyang', 'chongqing'], ['zhang_sanfeng', 'song_yuanqiao'], 'mountain', {
    bgm: 'mountain_taoist',
    shopType: 'manual',
  }),
  emei: L('emei', '峨眉山', { x: 360, y: 420 }, ['chengdu', 'chongqing'], ['miejue_shitai', 'zhou_ziruo'], 'mountain', {
    bgm: 'mountain_buddhist',
  }),
  hua_shan: L('hua_shan', '华山', { x: 470, y: 260 }, ['xianyang', 'luoyang', 'songshan'], ['ling_hu_chong', 'feng_qingyang'], 'mountain', {
    bgm: 'mountain_swords',
    shopType: 'weapon',
  }),
  bright_peak: L('bright_peak', '光明顶', { x: 360, y: 220 }, ['xianyang', 'lanzhou', 'xian'], ['zhang_wuji', 'yang_xiao'], 'mountain', {
    bgm: 'cult_theme',
  }),
  black_cliff: L('black_cliff', '黑木崖', { x: 690, y: 200 }, ['beijing', 'tianjin'], ['dong_fang_bu_bai', 'ren_wo_xing'], 'secret', {
    bgm: 'evil_lair',
  }),
  ancient_tomb: L('ancient_tomb', '古墓', { x: 520, y: 320 }, ['zhongnan_mountain', 'hua_shan'], ['xiao_long_nv', 'yang_guo'], 'secret', {
    bgm: 'tomb_mysterious',
  }),
  tianshan: L('tianshan', '天山', { x: 180, y: 120 }, ['dali', 'xiyu'], ['xu_zhu', 'tong_lao'], 'mountain', {
    bgm: 'mountain_mystic',
  }),
  songshan: L('songshan', '嵩山', { x: 540, y: 250 }, ['shaolin', 'luoyang', 'hua_shan'], ['zuo_lengchan'], 'mountain', {
    bgm: 'mountain_majestic',
  }),
  zhongnan_mountain: L('zhongnan_mountain', '终南山', { x: 500, y: 300 }, ['ancient_tomb', 'hua_shan', 'songshan'], ['quanzhen_master', 'yin_zhiping'], 'mountain', {
    bgm: 'mountain_taoist',
  }),
  taishan: L('taishan', '泰山', { x: 720, y: 210 }, ['songshan'], ['tian_men'], 'mountain', {
    bgm: 'mountain_majestic',
  }),
  hengshan: L('hengshan', '恒山', { x: 650, y: 170 }, ['beijing', 'tianjin'], ['yi_lin', 'ding_xian'], 'mountain', {
    bgm: 'mountain_buddhist',
  }),
  peach_island: L('peach_island', '桃花岛', { x: 900, y: 430 }, ['hangzhou', 'shanghai'], ['huang_yaoshi', 'cheng_ying'], 'secret', {
    bgm: 'island_mysterious',
    shopType: 'special',
  }),
  beggar_headquarters: L('beggar_headquarters', '丐帮总舵', { x: 560, y: 390 }, ['xiangyang', 'luoyang'], ['xiao_feng', 'hong_qi_gong'], 'city', {
    bgm: 'jianghu_theme',
    shopType: 'special',
  }),
  jinlun_temple: L('jinlun_temple', '金轮寺', { x: 170, y: 220 }, ['xiyu', 'tianshan'], ['jinlun_fawang'], 'temple', {
    bgm: 'evil_lair',
  }),

  // Transit placeholders referenced by connected graphs.
  hangzhou: L('hangzhou', '杭州', { x: 790, y: 390 }, ['jiaxing', 'lin_an', 'peach_island'], ['merchant'], 'city', {
    bgm: 'town_jiangnan',
  }),
  yangzhou: L('yangzhou', '扬州', { x: 760, y: 300 }, ['jiaxing'], ['merchant'], 'city', {
    bgm: 'town_jiangnan',
  }),
  xianyang: L('xianyang', '咸阳', { x: 470, y: 300 }, ['lin_an', 'hua_shan', 'bright_peak'], ['merchant'], 'city', {
    bgm: 'town_heroic',
  }),
  chongqing: L('chongqing', '重庆', { x: 430, y: 410 }, ['xiangyang', 'wudang', 'emei'], ['merchant'], 'city', {
    bgm: 'town_heroic',
  }),
  luoyang: L('luoyang', '洛阳', { x: 560, y: 260 }, ['xiangyang', 'shaolin', 'songshan', 'beggar_headquarters', 'hua_shan'], ['merchant'], 'city', {
    bgm: 'town_heroic',
  }),
  chengdu: L('chengdu', '成都', { x: 310, y: 410 }, ['dali', 'emei'], ['merchant'], 'city', {
    bgm: 'town_heroic',
  }),
  tianjin: L('tianjin', '天津', { x: 740, y: 160 }, ['beijing', 'black_cliff', 'hengshan'], ['merchant'], 'city', {
    bgm: 'town_capital',
  }),
  kaifeng: L('kaifeng', '开封', { x: 620, y: 250 }, ['shaolin'], ['merchant'], 'city', {
    bgm: 'town_heroic',
  }),
  lanzhou: L('lanzhou', '兰州', { x: 320, y: 250 }, ['bright_peak'], ['merchant'], 'city', {
    bgm: 'town_heroic',
  }),
  xian: L('xian', '西安', { x: 440, y: 300 }, ['bright_peak'], ['merchant'], 'city', {
    bgm: 'town_heroic',
  }),
  xiyu: L('xiyu', '西域', { x: 120, y: 180 }, ['tianshan', 'jinlun_temple'], ['merchant'], 'border', {
    bgm: 'mountain_mystic',
  }),
  shanghai: L('shanghai', '上海', { x: 860, y: 360 }, ['peach_island'], ['merchant'], 'city', {
    bgm: 'town_jiangnan',
  }),
};
