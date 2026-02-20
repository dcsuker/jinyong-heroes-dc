# 金庸群侠传 DC 版 - 项目结构

## 完整目录结构

```
jyqxzdc/
├── data/                           # 游戏数据
│   ├── game_data/
│   │   └── combat_data.json        # 战斗数据（武功、物品、敌人）
│   └── lore/
│       ├── additional_data.json    # 额外小说数据
│       └── jin_yong_data.json      # 金庸小说基础数据
│
├── docs/                           # 文档
│   └── directory_structure.md      # 目录结构文档
│
├── src/                            # 源代码
│   ├── main.gd                     # 主游戏脚本
│   ├── main.tscn                   # 主游戏场景
│   │
│   ├── core/                       # 核心系统
│   │   ├── character/
│   │   │   ├── game_character.gd   # 游戏角色组件
│   │   │   └── npc_component.gd    # NPC 组件
│   │   ├── combat/                 # 战斗系统
│   │   │   ├── combat_component.gd # 战斗属性组件
│   │   │   ├── combat_state.gd     # 战斗状态机
│   │   │   ├── combat_system.gd    # 战斗系统
│   │   │   └── martial_art.gd      # 武功数据类
│   │   ├── dialogue/               # 对话系统
│   │   │   ├── dialogue_data.gd    # 对话数据类
│   │   │   └── dialogue_manager.gd # 对话管理器
│   │   ├── ecs/                    # ECS 架构
│   │   │   ├── components/         # ECS 组件
│   │   │   ├── ecs_manager.gd      # ECS 管理器
│   │   │   ├── ecs_system.gd       # ECS 系统基类
│   │   │   ├── entity_id.gd        # 实体 ID
│   │   │   └── entity_manager.gd   # 实体管理器
│   │   ├── events/
│   │   │   └── event_bus.gd        # 事件总线
│   │   ├── fsm/
│   │   │   └── state_machine.gd    # 状态机基类
│   │   ├── resources/
│   │   │   └── resource_manager.gd # 资源管理器
│   │   └── save/
│   │       └── save_system.gd      # 存档系统
│   │
│   ├── entities/                   # 实体场景
│   │   └── villager_npc.tscn       # 村民 NPC 场景
│   │
│   ├── systems/                    # 游戏系统
│   │   ├── map/                    # 地图系统
│   │   │   ├── collision_component.gd
│   │   │   ├── map_data_component.gd
│   │   │   ├── map_demo.gd
│   │   │   ├── map_demo.tscn
│   │   │   ├── map_demo_setup.gd
│   │   │   ├── map_system.gd
│   │   │   ├── navigation_component.gd
│   │   │   ├── navigation_system.gd
│   │   │   └── tile_component.gd
│   │   └── quest/                  # 任务系统
│   │       ├── demo/
│   │       ├── global_quest_manager.gd
│   │       ├── jin_yong_quest_generator.gd
│   │       ├── quest_component.gd
│   │       ├── quest_manager.gd
│   │       ├── quest_objective_component.gd
│   │       └── quest_system.gd
│   │
│   └── ui/                         # UI 系统
│       ├── battle_ui.gd            # 战斗 UI 脚本
│       ├── battle_ui.tscn          # 战斗 UI 场景
│       ├── dialogue_ui.gd          # 对话 UI 脚本
│       └── dialogue_ui.tscn        # 对话 UI 场景
│
├── tests/                          # 测试
├── ├── test_battle_scene.gd        # 战斗测试脚本
│   ├── test_battle_scene.tscn      # 战斗测试场景
│   ├── test_main_game.tscn         # 主游戏测试场景
│   ├── helpers/
│   ├── integration/
│   └── unit/
│
├── GITHUB_SETUP.md                 # GitHub 设置指南
├── PROJECT_SUMMARY.md              # 项目总结
├── README.md                       # 项目说明
├── project.godot                   # Godot 项目配置
└── world_state.json                # 游戏世界状态数据库
```

## 核心系统说明

### 1. 战斗系统 (Combat System)
- `combat_component.gd`: 角色战斗属性（HP、内力、攻击力等）
- `combat_state.gd`: 战斗状态机（回合管理、战斗阶段）
- `combat_system.gd`: 战斗逻辑（伤害计算、AI 行动）
- `martial_art.gd`: 武功招式数据

### 2. 对话系统 (Dialogue System)
- `dialogue_data.gd`: 对话数据结构
- `dialogue_manager.gd`: 对话树管理、选择分支

### 3. 任务系统 (Quest System)
- `quest_manager.gd`: 任务管理
- `quest_system.gd`: 任务逻辑
- `jin_yong_quest_generator.gd`: 金庸小说任务生成

### 4. 地图系统 (Map System)
- `map_system.gd`: 地图加载和管理
- `navigation_system.gd`: A*寻路
- `collision_component.gd`: 碰撞检测

### 5. 存档系统 (Save System)
- `save_system.gd`: 游戏存档/读档

### 6. ECS 架构
- `entity_manager.gd`: 实体管理
- `ecs_system.gd`: 系统基类

## 游戏操作

| 按键 | 功能 |
|------|------|
| W/A/S/D | 移动角色 |
| 空格 | 互动/开始战斗 |
| ESC | 退出/菜单 |

## 运行游戏

```bash
# 使用 Godot 运行
godot --path .

# 运行测试场景
godot --path . res://tests/test_main_game.tscn
godot --path . res://tests/test_battle_scene.tscn
```

## 已完成功能

- [x] 战斗系统（回合制武功战斗）
- [x] 对话系统（对话树、选择分支）
- [x] 任务系统（任务接取、完成）
- [x] 地图系统（寻路、碰撞）
- [x] 存档系统
- [x] 金庸小说数据（人物、门派、武功、地点）
- [x] 主游戏场景整合

## 待完成功能

- [ ] 更多武功招式
- [ ] 完整的主线剧情
- [ ] 更多 NPC 和对话
- [ ] 物品和装备系统
- [ ] 门派加入系统
- [ ] 存档/读档 UI
