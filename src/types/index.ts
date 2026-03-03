export interface Stats {
  hp: number;
  hpMax: number;
  mp: number;
  mpMax: number;
  atk: number;
  def: number;
  spd: number;
  wis: number;
  charm: number;
}

export interface Character {
  id: string;
  name: string;
  novel: string;
  sect: string;
  portrait: string;
  stats: Stats;
  skills: string[];
  personality: string[];
  recruitable: boolean;
  recruitCondition?: {
    fameGood?: number;
    fameEvil?: number;
    quest?: string;
    affinity?: number;
  };
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  type: '掌法' | '剑法' | '刀法' | '指法' | '暗器' | '轻功' | '内功' | '奇门' | '毒功';
  element: 'yang' | 'yin' | 'neutral' | 'poison' | 'ice' | 'fire';
  mpCost: number;
  power: number;
  hitCount: number;
  aoe: boolean;
  statusEffect?: string;
  learnFrom?: string;
  description: string;
}

export type LocationType = 'city' | 'temple' | 'mountain' | 'secret' | 'border' | 'camp';

export interface Location {
  id: string;
  name: string;
  novel: string;
  mapPos: { x: number; y: number };
  scenePath: string;
  bgm: string;
  connected: string[];
  npcs: string[];
  shopType?: string;
  description: string;
  type?: LocationType;
}

export interface Sect {
  id: string;
  name: string;
  alignment: 'good' | 'neutral' | 'evil';
  location: string;
  leader: string;
  skills: string[];
  joinReq: {
    fameGood?: number;
    fameEvil?: number;
    evilDeeds?: number;
  };
  initialAffinity: number;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'medicine' | 'manual' | 'material' | 'quest';
  effect: Record<string, number | string | boolean>;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  price: number;
  description: string;
}

export interface DialogueNode {
  speaker: string;
  portrait?: string;
  text: string;
  next?: string;
  choices?: Array<{
    text: string;
    next: string;
    condition?: Condition;
    effect?: Effect;
  }>;
  condition?: Condition;
  effect?: Effect;
  type?: 'end';
}

export interface DialogueTree {
  start: string;
  nodes: Record<string, DialogueNode>;
}

export interface Quest {
  id: string;
  name: string;
  type: 'main' | 'side';
  chapter?: number;
  giver: string;
  objectives: Array<{
    type: string;
    target?: string;
    count?: number;
    progress: number;
  }>;
  reward: {
    exp: number;
    gold: number;
    item?: string;
    skill?: string;
    affinity?: Record<string, number>;
  };
  nextQuest?: string;
  description: string;
}

export interface Condition {
  flag?: Record<string, boolean | string>;
  fameGood?: number;
  fameEvil?: number;
  quest?: string;
  gold?: number;
  item?: string;
  affinity?: Record<string, number>;
}

export interface Effect {
  flag?: Record<string, boolean | string>;
  affinity?: Record<string, number>;
  reputation?: { type: 'good' | 'evil'; amount: number };
  item?: string;
  gold?: number;
  quest?: string;
  skill?: string;
  healParty?: boolean;
}

export interface BattleUnit {
  id: string;
  enemyId?: string;
  name: string;
  portrait: string;
  stats: Stats;
  currentHp: number;
  currentMp: number;
  skills: string[];
  statusEffects: Array<{ type: string; duration: number; value?: number }>;
  isPlayer: boolean;
  isDefeated: boolean;
}

export interface SaveSlot {
  slot: number;
  timestamp: string;
  playTime: number;
  location: string;
  playerName: string;
  level: number;
}

export type GameScreen =
  | 'mainmenu'
  | 'worldmap'
  | 'town'
  | 'battle'
  | 'dialogue'
  | 'character'
  | 'inventory'
  | 'save'
  | 'quest';
