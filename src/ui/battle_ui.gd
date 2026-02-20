extends Control

## 战斗 UI 界面

@onready var player_hp_bar: ProgressBar = $MarginContainer/VBoxContainer/PlayerInfo/PlayerHPBar
@onready var player_energy_bar: ProgressBar = $MarginContainer/VBoxContainer/PlayerInfo/PlayerEnergyBar
@onready var enemy_hp_bar: ProgressBar = $MarginContainer/VBoxContainer/EnemyInfo/EnemyHPBar
@onready var battle_log: TextEdit = $MarginContainer/VBoxContainer/BattleLog
@onready var action_buttons: HBoxContainer = $MarginContainer/VBoxContainer/ActionButtons
@onready var martial_art_buttons: HBoxContainer = $MarginContainer/VBoxContainer/MartialArtButtons

var combat_system: CombatSystem
var player_entity_id: int
var enemy_entity_id: int

signal action_selected(martial_art: String, target_id: int)

func _ready() -> void:
	battle_log.editable = false
	battle_log.text = ""

	for btn in martial_art_buttons.get_children():
		if btn is Button:
			btn.pressed.connect(_on_martial_art_selected.bind(btn.name))

func setup(combat: CombatSystem, player_id: int, enemy_id: int) -> void:
	combat_system = combat
	player_entity_id = player_id
	enemy_entity_id = enemy_id

	if combat_system:
		combat_system.combat_ended.connect(_on_combat_ended)
		combat_system.action_completed.connect(_on_action_completed)
		if combat_system.combat_state:
			combat_system.combat_state.phase_changed.connect(_on_phase_changed)

func update_player_stats(stats: Dictionary) -> void:
	var hp = stats.get("hp", {})
	var energy = stats.get("internal_energy", {})

	if player_hp_bar:
		player_hp_bar.max_value = hp.get("max", 100)
		player_hp_bar.value = hp.get("current", 100)

	if player_energy_bar:
		player_energy_bar.max_value = energy.get("max", 100)
		player_energy_bar.value = energy.get("current", 100)

func update_enemy_stats(stats: Dictionary) -> void:
	var hp = stats.get("hp", {})

	if enemy_hp_bar:
		enemy_hp_bar.max_value = hp.get("max", 100)
		enemy_hp_bar.value = hp.get("current", 100)

func add_log_entry(text: String) -> void:
	if battle_log:
		battle_log.text += text + "\n"
		battle_log.scroll_vertical = battle_log.get_line_count()

func clear_log() -> void:
	if battle_log:
		battle_log.text = ""

func set_martial_arts(arts: Array[String]) -> void:
	# 清空现有按钮
	for btn in martial_art_buttons.get_children():
		btn.queue_free()

	# 创建新按钮
	for art in arts:
		var btn = Button.new()
		btn.name = art
		btn.text = art
		btn.pressed.connect(_on_martial_art_selected.bind(art))
		martial_art_buttons.add_child(btn)

	# 添加普通攻击按钮
	var normal_btn = Button.new()
	normal_btn.name = "普通攻击"
	normal_btn.text = "普通攻击"
	normal_btn.pressed.connect(_on_martial_art_selected.bind("普通攻击"))
	martial_art_buttons.add_child(normal_btn)

func _on_martial_art_selected(art_name: String) -> void:
	action_selected.emit(art_name, enemy_entity_id)

func _on_phase_changed(new_phase: int) -> void:
	match new_phase:
		CombatState.CombatPhase.PLAYER_TURN:
			action_buttons.visible = true
			martial_art_buttons.visible = true
			add_log_entry("--- 你的回合 ---")
		CombatState.CombatPhase.ENEMY_TURN:
			action_buttons.visible = false
			martial_art_buttons.visible = false
			add_log_entry("--- 敌人回合 ---")
		CombatState.CombatPhase.VICTORY:
			add_log_entry("=== 战斗胜利！===")
			action_buttons.visible = false
		CombatState.CombatPhase.DEFEAT:
			add_log_entry("=== 战斗失败... ===")
			action_buttons.visible = false

func _on_action_completed(actor: String, action: String, result: Dictionary) -> void:
	if result.success:
		add_log_entry("%s 使用 %s 造成 %d 点伤害" % [actor, action, result.damage])
		if result.is_critical:
			add_log_entry("  [会心一击!]")

func _on_combat_ended(victory: bool) -> void:
	if victory:
		add_log_entry("战斗胜利！获得经验值。")
	else:
		add_log_entry("战斗失败...")
