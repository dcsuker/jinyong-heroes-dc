class_name MainGame
extends Node2D

## 主游戏场景 - 金庸群侠传 DC 版

@onready var entity_manager: EntityManager = $EntityManager
@onready var quest_manager: Node = $QuestManager
@onready var combat_system: CombatSystem = $CombatSystem
@onready var dialogue_manager: DialogueManager = $DialogueManager
@onready var map_system: MapSystem = $MapSystem
@onready var save_system: Node = $SaveSystem
@onready var battle_ui: Control = $UI/BattleUI
@onready var dialogue_ui: Control = $UI/DialogueUI
@onready var debug_info: Label = $UI/DebugInfo
@onready var player: CharacterBody2D = $World/Player

# 游戏状态
var game_state: Dictionary = {
	"current_map": "tutorial",
	"player_data": {
		"name": "少侠",
		"level": 1,
		"exp": 0,
		"hp": 100,
		"max_hp": 100,
		"internal_energy": 50,
		"max_internal_energy": 50,
		"attack": 15,
		"defense": 8,
		"speed": 10,
		"martial_arts": []
	},
	"inventory": ["金创药 x3"],
	"active_quests": [],
	"completed_quests": [],
	"npc_relationships": {}
}

# 可交互的 NPC
var nearby_npcs: Array = []
var current_battle_entity_ids: Array = []

# 输入冷却
var input_cooldown: float = 0.0
const INPUT_COOLDOWN_TIME: float = 0.2

func _ready() -> void:
	_initialize_game()
	_setup_player()
	_setup_combat_system()
	_setup_dialogue_system()
	_load_world_state()
	_connect_signals()

func _initialize_game() -> void:
	print("=== 金庸群侠传 DC 版 ===")
	print("Version 0.2.0")
	print("游戏初始化...")

	# 加载世界状态
	_load_world_state()

func _setup_player() -> void:
	if player:
		# 设置玩家碰撞体
		if player.get_node("CollisionShape2D") == null:
			var collision = CollisionShape2D.new()
			collision.name = "CollisionShape2D"
			var shape = RectangleShape2D.new()
			shape.size = Vector2(32, 32)
			collision.shape = shape
			player.add_child(collision)

		# 设置玩家精灵
		if player.get_node("Sprite2D") == null:
			var sprite = Sprite2D.new()
			sprite.name = "Sprite2D"
			sprite.scale = Vector2(2, 2)
			var texture = _create_placeholder_texture(Color(0.2, 0.6, 1.0, 1.0))
			sprite.texture = texture
			player.add_child(sprite)

		# 设置交互区域
		var interaction_area = $World/Player/InteractionArea
		if interaction_area:
			var interaction_shape = interaction_area.get_node("CollisionShape2D")
			if interaction_shape and interaction_shape.shape == null:
				var shape = CircleShape2D.new()
				shape.radius = 50
				interaction_shape.shape = shape

			# 连接信号
			if not interaction_area.area_entered.is_connected(_on_interaction_area_entered):
				interaction_area.area_entered.connect(_on_interaction_area_entered)
			if not interaction_area.area_exited.is_connected(_on_interaction_area_exited):
				interaction_area.area_exited.connect(_on_interaction_area_exited)

		# 注册玩家到实体管理器
		var player_entity_id = entity_manager.create_entity()
		var transform_comp = TransformComponent.new()
		transform_comp.position = Vector3(player.global_position.x, player.global_position.y, 0)
		entity_manager.add_component(player_entity_id, "TransformComponent", transform_comp)

func _create_placeholder_texture(color: Color) -> Texture2D:
	var image = Image.create(32, 32, false, Image.FORMAT_RGBA8)
	image.fill(color)
	return ImageTexture.create_from_image(image)

func _setup_combat_system() -> void:
	if combat_system:
		combat_system.combat_ended.connect(_on_combat_ended)
		combat_system.action_completed.connect(_on_combat_action)

func _setup_dialogue_system() -> void:
	if dialogue_manager:
		# 加载示例对话树
		var sample_dialogue = dialogue_manager.create_sample_dialogue()
		dialogue_manager.load_dialogue_tree(sample_dialogue)

func _load_world_state() -> void:
	# 从 world_state.json 加载游戏世界数据
	var world_state_file = "res://world_state.json"
	if FileAccess.file_exists(world_state_file):
		var file = FileAccess.open(world_state_file, FileAccess.READ)
		var json_text = file.get_as_text()
		var world_state = JSON.parse_string(json_text)
		if world_state:
			print("世界状态已加载")
			# 可以从世界状态初始化 NPC、任务等

func _connect_signals() -> void:
	# 连接战斗 UI 信号
	if battle_ui:
		battle_ui.action_selected.connect(_on_battle_action_selected)

	# 连接对话 UI 信号
	if dialogue_ui:
		dialogue_ui.setup(dialogue_manager)

func _process(delta: float) -> void:
	_handle_player_input(delta)
	_update_debug_info()

	if input_cooldown > 0:
		input_cooldown -= delta

func _handle_player_input(delta: float) -> void:
	if not player:
		return

	# 如果战斗或对话中，跳过移动输入
	if battle_ui.visible or dialogue_ui.visible:
		return

	var velocity = Vector2.ZERO

	# WASD 移动
	if Input.is_action_pressed("move_up"):
		velocity.y -= 1
	if Input.is_action_pressed("move_down"):
		velocity.y += 1
	if Input.is_action_pressed("move_left"):
		velocity.x -= 1
	if Input.is_action_pressed("move_right"):
		velocity.x += 1

	velocity = velocity.normalized()

	if velocity.length() > 0:
		player.velocity = velocity * 200
	else:
		player.velocity = Vector2.ZERO

	player.move_and_slide()

	# 交互输入
	if Input.is_action_just_pressed("interact") and input_cooldown <= 0:
		if nearby_npcs.size() > 0:
			_interact_with_npc(nearby_npcs[0])
			input_cooldown = INPUT_COOLDOWN_TIME
		else:
			# 没有 NPC 时，空格键开始测试战斗
			_start_test_battle()
			input_cooldown = INPUT_COOLDOWN_TIME

func _interact_with_npc(npc: Node) -> void:
	var npc_name = npc.get("npc_name", npc.get("character_name", "NPC"))
	print("与 %s 对话" % npc_name)

	# 启动对话系统
	if dialogue_manager:
		var sample_dialogue = dialogue_manager.create_sample_dialogue()
		dialogue_manager.load_dialogue_tree(sample_dialogue)
		dialogue_manager.start_dialogue("start")

		# 更新任务：与村长对话
		if npc_name == "村长" and quest_manager:
			quest_manager.update_quest_objective("quest_001", 0, 1)

func _on_interaction_area_entered(area: Area2D) -> void:
	var parent = area.get_parent()
	if parent is NPCComponent or parent.has_method("get_npc_data"):
		var npc_name = parent.get("npc_name", "NPC")
		if not nearby_npcs.has(parent):
			nearby_npcs.append(parent)
			print("靠近 NPC: %s" % npc_name)

func _on_interaction_area_exited(area: Area2D) -> void:
	var parent = area.get_parent()
	if parent in nearby_npcs:
		nearby_npcs.erase(parent)
		print("离开 NPC")

func _start_test_battle() -> void:
	var test_enemy = {
		"name": "黑风双煞",
		"hp": 300,
		"attack": 35,
		"defense": 12,
		"martial_arts": ["九阴白骨爪"],
		"speed": 8
	}
	start_battle(test_enemy)

func start_battle(enemy_data: Dictionary) -> void:
	print("=== 开始战斗：", enemy_data.get("name", "未知敌人"), " ===")

	# 创建玩家战斗组件
	var player_combat = CombatComponent.new()
	player_combat.name = "PlayerCombat"
	player_combat.max_hp = game_state.player_data.max_hp
	player_combat.current_hp = game_state.player_data.hp
	player_combat.attack = game_state.player_data.attack
	player_combat.defense = game_state.player_data.defense
	player_combat.speed = game_state.player_data.speed
	player_combat.martial_arts = game_state.player_data.martial_arts.duplicate()
	if player_combat.martial_arts.size() == 0:
		player_combat.martial_arts = ["普通攻击"]

	# 创建敌人战斗组件
	var enemy_combat = CombatComponent.new()
	enemy_combat.name = "EnemyCombat"
	enemy_combat.max_hp = enemy_data.get("hp", 100)
	enemy_combat.current_hp = enemy_data.get("hp", 100)
	enemy_combat.attack = enemy_data.get("attack", 10)
	enemy_combat.defense = enemy_data.get("defense", 5)
	enemy_combat.speed = enemy_data.get("speed", 5)
	enemy_combat.martial_arts = enemy_data.get("martial_arts", ["普通攻击"]).duplicate()

	# 添加到战斗系统
	combat_system.add_child(player_combat)
	combat_system.add_child(enemy_combat)

	# 注册实体
	var player_entity_id = entity_manager.create_entity()
	var enemy_entity_id = entity_manager.create_entity()

	current_battle_entity_ids = [player_entity_id, enemy_entity_id]

	combat_system.register_entity(player_entity_id, player_combat)
	combat_system.register_entity(enemy_entity_id, enemy_combat)

	# 设置战斗 UI
	if battle_ui:
		battle_ui.visible = true
		battle_ui.setup(combat_system, player_entity_id, enemy_entity_id)
		battle_ui.set_martial_arts(player_combat.martial_arts)

		# 连接更新信号
		player_combat.hp_changed.connect(_update_player_hp)
		player_combat.internal_energy_changed.connect(_update_player_energy)

		# 初始更新 UI
		battle_ui.update_player_stats({"hp": {"current": player_combat.current_hp, "max": player_combat.max_hp}})
		battle_ui.update_enemy_stats({"hp": {"current": enemy_combat.current_hp, "max": enemy_combat.max_hp}})

	# 开始战斗
	combat_system.start_combat(
		[{id = player_entity_id, name = game_state.player_data.name, "is_player": true}],
		[{id = enemy_entity_id, name = enemy_data.name, "is_player": false}]
	)

func _update_player_hp(current: int, max: int) -> void:
	game_state.player_data.hp = current
	if battle_ui:
		battle_ui.update_player_stats({"hp": {"current": current, "max": max}})

func _update_player_energy(current: int, max: int) -> void:
	game_state.player_data.internal_energy = current
	if battle_ui:
		battle_ui.update_player_stats({"internal_energy": {"current": current, "max": max}})

func _on_battle_action_selected(martial_art: String, target_id: int) -> void:
	if current_battle_entity_ids.size() < 2:
		return

	var player_id = current_battle_entity_ids[0]
	var result = combat_system.player_action(player_id, martial_art, target_id)

	if result.success:
		# 玩家回合结束，敌人会自动响应
		pass

func _on_combat_action(actor: String, action: String, result: Dictionary) -> void:
	# 更新 UI 显示
	if battle_ui and result.has("target"):
		var target_id = result.target
		var target_comp = combat_system.entity_components.get(target_id)
		if target_comp:
			if target_comp.get("is_player", false):
				battle_ui.update_player_stats({"hp": {"current": target_comp.current_hp, "max": target_comp.max_hp}})
			else:
				battle_ui.update_enemy_stats({"hp": {"current": target_comp.current_hp, "max": target_comp.max_hp}})

func _on_combat_ended(victory: bool) -> void:
	print("=== 战斗结束：", "胜利！" if victory else "失败...", " ===")

	if victory:
		# 获得经验值
		var exp_gain = 100
		game_state.player_data.exp += exp_gain
		print("获得经验值：%d (总计：%d)" % [exp_gain, game_state.player_data.exp])

		# 检查升级
		_check_level_up()

	# 清理战斗
	_cleanup_battle()

func _check_level_up() -> void:
	var exp_needed = game_state.player_data.level * 200
	if game_state.player_data.exp >= exp_needed:
		game_state.player_data.level += 1
		game_state.player_data.max_hp += 20
		game_state.player_data.hp = game_state.player_data.max_hp
		game_state.player_data.attack += 5
		game_state.player_data.defense += 3
		game_state.player_data.max_internal_energy += 10
		game_state.player_data.internal_energy = game_state.player_data.max_internal_energy
		print("升级！当前等级：%d" % game_state.player_data.level)

func _cleanup_battle() -> void:
	# 清理战斗组件
	for child in combat_system.get_children():
		if child is CombatComponent:
			child.queue_free()

	# 清理实体
	for entity_id in current_battle_entity_ids:
		entity_manager.destroy_entity(entity_id)

	current_battle_entity_ids.clear()

	# 隐藏战斗 UI
	if battle_ui:
		battle_ui.visible = false

func _update_debug_info() -> void:
	if debug_info:
		var hp = game_state.player_data.hp
		var max_hp = game_state.player_data.max_hp
		var energy = game_state.player_data.internal_energy
		var max_energy = game_state.player_data.max_internal_energy
		var level = game_state.player_data.level
		var exp = game_state.player_data.exp

		debug_info.text = "金庸群侠传 DC 版
等级：%d | EXP: %d/%d
HP: %d/%d | 内力：%d/%d
ATK: %d | DEF: %d
附近 NPC: %d" % [
			level, exp, level * 200,
			hp, max_hp,
			energy, max_energy,
			game_state.player_data.attack,
			game_state.player_data.defense,
			nearby_npcs.size()
		]
