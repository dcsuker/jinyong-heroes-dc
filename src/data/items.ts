import type { Item } from '../types';

const I = (
  id: string,
  name: string,
  type: Item['type'],
  effect: Item['effect'],
  rarity: Item['rarity'],
  price: number,
  description: string
): Item => ({ id, name, type, effect, rarity, price, description });

export const ITEMS: Record<string, Item> = {
  pu_tong_jian: I('pu_tong_jian', '普通长剑', 'weapon', { atk: 10 }, 'common', 100, '基础武器'),
  qing_gang_jian: I('qing_gang_jian', '青钢剑', 'weapon', { atk: 20 }, 'uncommon', 500, '锋利长剑'),
  bi_xie_jian: I('bi_xie_jian', '辟邪剑', 'weapon', { atk: 32, spd: 8 }, 'epic', 3000, '快剑偏锋'),
  xuan_tie_jian: I('xuan_tie_jian', '玄铁重剑', 'weapon', { atk: 45, spd: -5 }, 'legendary', 5000, '重剑无锋'),
  yi_tian_jian: I('yi_tian_jian', '倚天剑', 'weapon', { atk: 48, wis: 8 }, 'legendary', 8000, '神兵利器'),
  tu_long_dao: I('tu_long_dao', '屠龙刀', 'weapon', { atk: 52 }, 'legendary', 8000, '号令江湖'),
  da_gou_bang: I('da_gou_bang', '打狗棒', 'weapon', { atk: 30, wis: 10 }, 'epic', 3000, '丐帮信物'),
  jin_she_jian: I('jin_she_jian', '金蛇剑', 'weapon', { atk: 34, spd: 10 }, 'epic', 2500, '弯曲快剑'),

  bu_yi: I('bu_yi', '布衣', 'armor', { def: 5 }, 'common', 50, '基础衣装'),
  pi_jia: I('pi_jia', '皮甲', 'armor', { def: 12 }, 'uncommon', 300, '轻甲'),
  tie_jia: I('tie_jia', '铁甲', 'armor', { def: 20, spd: -4 }, 'rare', 800, '重甲'),
  ruan_wei_jia: I('ruan_wei_jia', '软猬甲', 'armor', { def: 25 }, 'epic', 3000, '稀有护甲'),

  hu_shao: I('hu_shao', '虎哨', 'accessory', { charm: 5 }, 'uncommon', 100, '提升号召'),
  yu_pei: I('yu_pei', '玉佩', 'accessory', { charm: 10 }, 'rare', 500, '温润佩饰'),
  jin_chai: I('jin_chai', '金钗', 'accessory', { charm: 15 }, 'rare', 800, '华贵配饰'),
  jiu_yang_miao_jing: I('jiu_yang_miao_jing', '九阳妙经', 'accessory', { hp: 30, mp: 40 }, 'legendary', 10000, '内功要诀'),

  jin_chuang_yao: I('jin_chuang_yao', '金疮药', 'medicine', { hp: 50 }, 'common', 20, '恢复气血'),
  yang_li_wan: I('yang_li_wan', '养力丸', 'medicine', { mp: 30 }, 'common', 30, '恢复内力'),
  xiao_huan_dan: I('xiao_huan_dan', '小还丹', 'medicine', { hp: 100 }, 'rare', 300, '疗伤丹药'),
  da_huan_dan: I('da_huan_dan', '大还丹', 'medicine', { hp: 200, mp: 100 }, 'epic', 1000, '高阶丹药'),
  qing_xin_san: I('qing_xin_san', '清心散', 'medicine', { mp: 60 }, 'uncommon', 120, '宁神回气'),
  ren_shen: I('ren_shen', '人参', 'medicine', { hp: 80 }, 'rare', 150, '补气养元'),
  ling_zhi: I('ling_zhi', '灵芝', 'medicine', { hp: 120, mp: 40 }, 'rare', 220, '珍贵药材'),
  zhu_yeqing: I('zhu_yeqing', '竹叶青', 'medicine', { hp: 20, mp: 10 }, 'common', 30, '好酒微补'),

  tai_ji_jue: I('tai_ji_jue', '太极诀', 'manual', { skill: 'tai_ji_quan' }, 'epic', 2000, '太极心法'),
  bei_ming_miao_jue: I('bei_ming_miao_jue', '北冥妙诀', 'manual', { skill: 'bei_ming_shen_gong' }, 'epic', 2200, '逍遥内功'),
  yi_jin_jing_book: I('yi_jin_jing_book', '易筋经', 'manual', { skill: 'yi_jin_jing' }, 'legendary', 0, '少林绝学'),
  du_gu_jian_pu: I('du_gu_jian_pu', '独孤剑谱', 'manual', { skill: 'du_gu_jiu_jian' }, 'legendary', 0, '剑道绝学'),
  jiang_long_zhang_pu: I('jiang_long_zhang_pu', '降龙掌谱', 'manual', { skill: 'jiang_long_shi_ba_zhang' }, 'legendary', 0, '掌法绝学'),
  liu_mai_jian_jue: I('liu_mai_jian_jue', '六脉剑诀', 'manual', { skill: 'liu_mai_shen_jian' }, 'legendary', 0, '指剑绝学'),
  kui_hua_bao_dian: I('kui_hua_bao_dian', '葵花宝典', 'manual', { skill: 'kui_hua_bao_dian' }, 'legendary', 0, '诡秘武学'),

  wu_xia_ling: I('wu_xia_ling', '武侠令', 'quest', {}, 'legendary', 0, '武林信物'),
  si_shu_jian_pu: I('si_shu_jian_pu', '四书剑谱', 'quest', {}, 'rare', 0, '任务道具'),
};