# 金庸群侠传 🗡️

基于金庸 14 部武侠小说的开源 Web RPG 游戏

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🎮 游戏特色

- **100+ 金庸经典角色** - 郭靖、黄蓉、杨过、小龙女、张无忌、赵敏、令狐冲、任盈盈、萧峰、虚竹、段誉等
- **200+ 武功技能** - 降龙十八掌、独孤九剑、六脉神剑、九阳神功、葵花宝典等
- **50+ 江湖地点** - 少林寺、武当山、峨眉山、华山、光明顶、桃花岛等
- **20+ 武林门派** - 少林、武当、峨眉、丐帮、明教、日月神教等
- **回合制战斗系统** - 策略性战斗，合击技系统
- **多线剧情** - 5 种不同结局

## 🚀 在线游玩

[点击此处在线游玩](https://jin-yong-heroes.github.io/jin-yong-heroes)

## 📦 本地运行

### 环境要求

- Node.js 18+
- npm 9+

### 安装运行

```bash
# 克隆项目
git clone https://github.com/jin-yong-heroes/jin-yong-heroes.git
cd jin-yong-heroes

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 🛠️ 技术栈

- **React 18** - 前端框架
- **TypeScript 5** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Zustand** - 状态管理
- **React Router v6** - 路由管理

## 📁 项目结构

```
jin-yong-heroes/
├── src/
│   ├── data/              # 游戏数据
│   │   ├── characters.ts  # 角色数据库
│   │   ├── skills.ts      # 武功技能库
│   │   ├── locations.ts   # 地点数据
│   │   ├── sects.ts       # 门派数据
│   │   ├── items.ts       # 物品道具
│   │   └── index.ts       # 数据导出
│   ├── engine/            # 游戏引擎
│   │   ├── BattleEngine.ts    # 战斗系统
│   │   ├── QuestEngine.ts     # 任务系统
│   │   ├── DialogueEngine.ts  # 对话系统
│   │   ├── MapEngine.ts       # 地图移动
│   │   └── SaveEngine.ts      # 存档系统
│   ├── store/             # Zustand 状态
│   │   ├── gameStore.ts   # 游戏全局状态
│   │   ├── playerStore.ts # 玩家状态
│   │   ├── battleStore.ts # 战斗状态
│   │   └── uiStore.ts     # UI 状态
│   ├── components/        # UI 组件
│   │   └── common/        # 通用组件
│   ├── screens/           # 页面组件
│   │   ├── MainMenuScreen.tsx
│   │   ├── WorldMapScreen.tsx
│   │   ├── TownScreen.tsx
│   │   ├── BattleScreen.tsx
│   │   ├── CharacterScreen.tsx
│   │   ├── InventoryScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── utils/             # 工具函数
│   │   ├── formula.ts     # 战斗公式
│   │   └── random.ts      # 随机数
│   ├── types/             # TypeScript 类型
│   │   └── index.ts
│   ├── App.tsx            # 根组件
│   ├── main.tsx           # 入口文件
│   └── index.css          # 全局样式
├── public/
│   └── assets/            # 静态资源
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🎯 游戏系统

### 战斗系统

- 回合制战斗
- 先攻判定（基于敏捷）
- 武功技能消耗内力
- 特殊状态：中毒、封穴、着火、冰冻
- 合击技系统

### 角色系统

- 属性：生命、内力、力量、敏捷、悟性、防御、攻击
- 等级系统（1-100 级）
- 武功槽位
- 装备系统

### 探索系统

- 世界地图移动
- 城镇探索
- 秘境探险
- 随机事件

## 📖 开发指南

### 添加新角色

```typescript
// src/data/characters.ts
export const NEW_CHARACTER: Character = createCharacter(
  'new_character',
  '角色名',
  '角色描述',
  '所属小说',
  '所属门派 ID',
  CharacterType.ALLY,
  50, // 等级
  { health: 150, strength: 70, ... }, // 属性
  ['skill_1', 'skill_2'], // 武功列表
  0, // 初始好感度
  true, // 是否可招募
  '#COLOR' // 头像颜色
)
```

### 添加新武功

```typescript
// src/data/skills.ts
export const NEW_SKILL: Skill = createSkill(
  'new_skill',
  '武功名',
  '武功描述',
  SkillType.SWORD,
  8, // 威力等级
  40, // 学习等级
  SkillTargetType.SINGLE,
  { damageMultiplier: 2.0, manaCost: 30, accuracy: 90, critRate: 15 }
)
```

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

## 📄 许可证

MIT License

## 🙏 致谢

- 金庸先生创作的武侠小说
- 所有参与开发的贡献者

---

**仗剑江湖梦已远，侠骨柔情永流传**
