# 金庸群侠传 DC 版 - 游戏架构设计

## 1. 整体架构

### 1.1 架构模式
- **ECS (Entity-Component-System)**: 用于游戏对象的数据与逻辑分离
- **事件驱动**: 使用信号和事件总线实现模块间解耦
- **状态机**: 用于战斗状态、游戏状态管理

### 1.2 核心原则
- 禁止单例 God Object
- 模块间通过事件通信
- 数据驱动设计

## 2. 目录结构

```
res://
├── src/
│   ├── core/           # 核心系统
│   │   ├── ecs/        # ECS 框架
│   │   ├── events/     # 事件系统
│   │   └── fsm/        # 状态机
│   ├── systems/        # 游戏系统
│   │   ├── map/        # 地图系统
│   │   ├── dialogue/   # 对话系统
│   │   ├── combat/     # 战斗系统
│   │   ├── skill/      # 武功系统
│   │   ├── quest/      # 任务系统
│   │   └── save/       # 存档系统
│   ├── components/     # ECS 组件
│   ├── entities/       # 实体定义
│   └── ui/             # UI 界面
├── data/               # 数据资源
│   ├── characters/     # 角色数据
│   ├── skills/         # 武功数据
│   ├── maps/           # 地图数据
│   ├── quests/         # 任务数据
│   └── dialogues/      # 对话数据
├── assets/             # 美术资源
│   ├── sprites/        # 2D 精灵
│   ├── maps/           # 地图图块
│   ├── audio/          # 音频
│   └── ui/             # UI 资源
└── scenes/             # 场景文件
    ├── main/           # 主场景
    ├── battle/         # 战斗场景
    └── ui/             # UI 场景
```

## 3. ECS 框架设计

### 3.1 Component (组件)
纯数据容器，无逻辑：
- `TransformComponent`: 位置、旋转、缩放
- `SpriteComponent`: 精灵信息
- `CharacterComponent`: 角色属性 (血量、内力等)
- `CombatComponent`: 战斗相关数据
- `SkillComponent`: 武功技能
- `QuestComponent`: 任务进度
- `DialogueComponent`: 对话状态

### 3.2 System (系统)
处理逻辑：
- `MapSystem`: 地图加载、切换、碰撞
- `DialogueSystem`: 对话逻辑、分支选择
- `CombatSystem`: 回合制战斗逻辑
- `SkillSystem`: 武功计算、特效
- `QuestSystem`: 任务追踪、完成判定
- `SaveSystem`: 存档/读档

### 3.3 Entity (实体)
EntityID 标识，组合组件：
- `Player`: 主角
- `NPC`: NPC 角色
- `Enemy`: 敌人
- `Trigger`: 触发器

## 4. 事件系统

### 4.1 事件总线
```gdscript
# 全局事件总线 (非单例，通过参数传递)
class EventBus:
    signal entity_created(entity_id: int)
    signal entity_destroyed(entity_id: int)
    signal dialogue_started(dialogue_id: String)
    signal dialogue_ended(dialogue_id: String)
    signal combat_started(combat_data: Dictionary)
    signal combat_ended(victory: bool)
    signal quest_updated(quest_id: String)
    signal quest_completed(quest_id: String)
```

### 4.2 事件类型
- `EntityEvent`: 实体相关
- `DialogueEvent`: 对话相关
- `CombatEvent`: 战斗相关
- `QuestEvent`: 任务相关
- `SaveEvent`: 存档相关

## 5. 状态机设计

### 5.1 游戏状态
```
GameState:
    - NONE
    - EXPLORATION (探索)
    - DIALOGUE (对话)
    - COMBAT (战斗)
    - PAUSE (暂停)
    - TRANSITION (场景切换)
```

### 5.2 战斗状态
```
CombatState:
    - IDLE (待机)
    - PLAYER_TURN (玩家回合)
    - ENEMY_TURN (敌人回合)
    - SKILL_ANIMATION (技能动画)
    - VICTORY (胜利)
    - DEFEAT (失败)
```

## 6. 模块接口文档

### 6.1 地图系统接口
```gdscript
class_name MapSystem
# 加载地图
func load_map(map_id: String) -> void
# 切换场景
func transition_to_scene(scene_path: String) -> void
# 获取碰撞信息
func get_collision_at(position: Vector2) -> bool
# 注册触发器
func register_trigger(trigger_id: String, callback: Callable) -> void
```

### 6.2 对话系统接口
```gdscript
class_name DialogueSystem
# 开始对话
func start_dialogue(dialogue_id: String, speaker_id: String) -> void
# 选择分支
func select_branch(branch_index: int) -> void
# 结束对话
func end_dialogue() -> void
```

### 6.3 战斗系统接口
```gdscript
class_name CombatSystem
# 开始战斗
func start_combat(enemies: Array, battle_config: Dictionary) -> void
# 玩家行动
func player_action(action_type: String, target: int, skill_id: String) -> void
# 结束战斗
func end_combat(victory: bool) -> void
```

### 6.4 武功系统接口
```gdscript
class_name SkillSystem
# 学习武功
func learn_skill(character_id: int, skill_id: String) -> void
# 升级武功
func upgrade_skill(character_id: int, skill_id: String) -> void
# 计算伤害
func calculate_damage(skill_id: String, attacker: Dictionary, defender: Dictionary) -> int
```

### 6.5 任务系统接口
```gdscript
class_name QuestSystem
# 接取任务
func accept_quest(quest_id: String) -> void
# 更新任务进度
func update_quest(quest_id: String, objective: String, count: int) -> void
# 完成任务
func complete_quest(quest_id: String) -> void
```

### 6.6 存档系统接口
```gdscript
class_name SaveSystem
# 保存游戏
func save_game(slot: int, data: Dictionary) -> Error
# 读取游戏
func load_game(slot: int) -> Dictionary
# 删除存档
func delete_save(slot: int) -> Error
```

## 7. 数据结构

### 7.1 角色数据
```json
{
    "id": "linghuchong",
    "name": "令狐冲",
    "level": 1,
    "hp": 100,
    "mp": 50,
    "attack": 20,
    "defense": 10,
    "speed": 15,
    "skills": ["dugu_jiujian", "taiji_jianfa"],
    "affinity": {}
}
```

### 7.2 武功数据
```json
{
    "id": "dugu_jiujian",
    "name": "独孤九剑",
    "type": "sword",
    "damage_multiplier": 2.0,
    "mp_cost": 20,
    "target": "single",
    "effects": ["break_defense"]
}
```

### 7.3 任务数据
```json
{
    "id": "quest_001",
    "name": "初入江湖",
    "description": "拜访华山派掌门",
    "objectives": [
        {"type": "talk_to", "target": "yuebushang", "count": 1}
    ],
    "rewards": {
        "exp": 100,
        "gold": 50,
        "items": []
    }
}
```

## 8. 开发流程

1. 每个模块独立开发
2. 提供接口文档
3. 单元测试通过
4. 集成测试
5. 提交代码
