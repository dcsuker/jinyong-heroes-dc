# ⚔️ 金庸群侠传 Web RPG

> 基于金庸14部武侠小说的开源 Web RPG，React + TypeScript + Tailwind CSS

## 🎮 在线游玩

**https://你的用户名.github.io/jin-yong-heroes**

## ✨ 特色

- **60+ 金庸经典角色** - 郭靖、黄蓉、杨过、小龙女、张无忌等经典人物
- **80+ 武功技能** - 降龙十八掌、独孤九剑、乾坤大挪移、九阳神功等
- **20+ 江湖地点** - 襄阳、少林寺、武当山、华山、桃花岛、大理等
- **回合制战斗** - 合击技 / 元素相克 / 状态效果
- **对话树系统** - 条件分支 / 好感度 / 多选项
- **声望系统** - 正道 / 邪道双线
- **Zustand 持久化存档**

## 🛠️ 技术栈

- React 18
- TypeScript 5
- Vite 7
- Tailwind CSS 3
- Zustand (状态管理)

## 📁 项目结构

```
src/
  ├── components/     # UI 组件
  ├── screens/        # 页面组件
  │   ├── MainMenuScreen.tsx
  │   ├── WorldMapScreen.tsx
  │   ├── TownScreen.tsx
  │   ├── BattleScreen.tsx
  │   ├── DialogueScreen.tsx
  │   ├── CharacterScreen.tsx
  │   ├── InventoryScreen.tsx
  │   └── SaveScreen.tsx
  ├── store/          # 状态管理
  │   ├── gameStore.ts
  │   └── battleStore.ts
  ├── data/           # 游戏数据
  │   ├── characters.ts   # 角色数据
  │   ├── skills.ts       # 武功数据
  │   ├── locations.ts    # 地点数据
  │   ├── sects.ts        # 门派数据
  │   ├── items.ts        # 物品数据
  │   └── quests.ts       # 任务数据
  ├── types/          # TypeScript 类型
  └── engine/         # 游戏引擎
```

## 🚀 本地运行

```bash
npm install
npm run dev
```

## 📦 构建

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

## 🌐 部署到 GitHub Pages

1. 在 GitHub 创建仓库
2. 推送代码到仓库
3. 启用 GitHub Pages（Settings > Pages）
4. 选择 GitHub Actions 作为部署源

项目已配置 `.github/workflows/deploy.yml`，推送后会自动部署。

## 📄 许可证

MIT

---

*本项目为学习用途，致敬金庸先生的武侠世界。*
