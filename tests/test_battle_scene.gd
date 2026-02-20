extends Node

## 测试战斗场景

@onready var combat_system: CombatSystem = $CombatSystem
@onready var battle_ui: Control = $UI/BattleUI

var player_entity_id: int = 1
var enemy_entity_id: int = 2

func _ready() -> void:
	print("=== 战斗测试场景 ===")
	_setup_test_battle()

func _setup_test_battle() -> void:
	# 创建玩家战斗组件
	var player_combat = CombatComponent.new()
	player_combat.name = "PlayerCombat"
	player_combat.max_hp = 100
	player_combat.current_hp = 100
	player_combat.attack = 15
	player_combat.defense = 8
	player_combat.speed = 10
	player_combat.martial_arts = ["普通攻击", "降龙十八掌"]

	# 创建敌人战斗组件
	var enemy_combat = CombatComponent.new()
	enemy_combat.name = "EnemyCombat"
	enemy_combat.max_hp = 200
	enemy_combat.current_hp = 200
	enemy_combat.attack = 20
	enemy_combat.defense = 10
	enemy_combat.speed = 8
	enemy_combat.martial_arts = ["九阴白骨爪"]

	# 添加到场景
	combat_system.add_child(player_combat)
	combat_system.add_child(enemy_combat)

	# 注册到战斗系统
	combat_system.register_entity(player_entity_id, player_combat)
	combat_system.register_entity(enemy_entity_id, enemy_combat)

	# 连接信号
	player_combat.hp_changed.connect(_on_player_hp_changed)
	combat_system.combat_ended.connect(_on_combat_ended)

	# 设置战斗 UI
	if battle_ui:
		battle_ui.visible = true
		battle_ui.setup(combat_system, player_entity_id, enemy_entity_id)
		battle_ui.set_martial_arts(player_combat.martial_arts)
		battle_ui.action_selected.connect(_on_action_selected)

	# 开始战斗
	combat_system.start_combat(
		[{id = player_entity_id, name = "少侠", "is_player": true, speed = 10}],
		[{id = enemy_entity_id, name = "黑风双煞", "is_player": false, speed = 8}]
	)

func _on_player_hp_changed(current: int, max: int) -> void:
	print("玩家 HP: %d/%d" % [current, max])

func _on_action_selected(martial_art: String, target_id: int) -> void:
	var result = combat_system.player_action(player_entity_id, martial_art, target_id)
	if result.success:
		print("玩家使用 %s，造成 %d 点伤害" % [martial_art, result.damage])
		if result.is_critical:
			print("会心一击！")

func _on_combat_ended(victory: bool) -> void:
	print("战斗结束：", "玩家胜利！" if victory else "玩家失败...")
	await get_tree().create_timer(2.0).timeout
	get_tree().quit()

func _input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and event.keycode == KEY_ESCAPE:
		get_tree().quit()
