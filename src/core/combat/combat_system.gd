class_name CombatSystem
extends Node

## 战斗系统 - 处理战斗逻辑

@export var martial_arts_data: Dictionary = {}

var combat_state: CombatState
var entity_components: Dictionary = {}

signal combat_started()
signal combat_ended(victory: bool)
signal action_completed(actor: String, action: String, result: Dictionary)

func _ready() -> void:
	combat_state = CombatState.new()
	add_child(combat_state)

	combat_state.turn_started.connect(_on_turn_started)
	combat_state.phase_changed.connect(_on_phase_changed)

	_load_martial_arts_data()

func _load_martial_arts_data() -> void:
	# 从 JSON 加载武功数据
	martial_arts_data = {
		"降龙十八掌": {
			"name": "降龙十八掌",
			"type": "掌法",
			"level": "绝世",
			"damage_multiplier": 2.5,
			"internal_energy_cost": 30,
			"critical_bonus": 0.2
		},
		"九阴白骨爪": {
			"name": "九阴白骨爪",
			"type": "爪法",
			"level": "上乘",
			"damage_multiplier": 1.8,
			"internal_energy_cost": 20,
			"critical_bonus": 0.15
		},
		"空明拳": {
			"name": "空明拳",
			"type": "拳法",
			"level": "上乘",
			"damage_multiplier": 1.5,
			"internal_energy_cost": 15,
			"critical_bonus": 0.1
		},
		"打狗棒法": {
			"name": "打狗棒法",
			"type": "棒法",
			"level": "绝世",
			"damage_multiplier": 2.0,
			"internal_energy_cost": 25,
			"critical_bonus": 0.15
		}
	}

func register_entity(entity_id: int, component: CombatComponent) -> void:
	entity_components[entity_id] = component

func unregister_entity(entity_id: int) -> void:
	entity_components.erase(entity_id)

func start_combat(player_entities: Array, enemy_entities: Array) -> void:
	var participants = []

	for entity in player_entities:
		var combat_comp = entity_components.get(entity.id)
		if combat_comp:
			participants.append({
				"id": entity.id,
				"name": entity.name,
				"is_player": true,
				"speed": combat_comp.speed,
				"stats": combat_comp.get_stats()
			})

	for entity in enemy_entities:
		var combat_comp = entity_components.get(entity.id)
		if combat_comp:
			participants.append({
				"id": entity.id,
				"name": entity.name,
				"is_player": false,
				"speed": combat_comp.speed,
				"stats": combat_comp.get_stats()
			})

	combat_state.start_battle(participants)
	combat_started.emit()

func player_action(entity_id: int, martial_art: String, target_id: int) -> Dictionary:
	if not combat_state.is_player_turn():
		return {"success": false, "reason": "不是玩家回合"}

	var attacker = entity_components.get(entity_id)
	var target = entity_components.get(target_id)

	if not attacker or not target:
		return {"success": false, "reason": "实体不存在"}

	if not attacker.is_alive:
		return {"success": false, "reason": "攻击者已死亡"}

	# 检查内功是否足够
	var art_data = martial_arts_data.get(martial_art)
	if not art_data:
		return {"success": false, "reason": "武功不存在"}

	if not attacker.use_internal_energy(art_data.internal_energy_cost):
		return {"success": false, "reason": "内功不足"}

	# 计算伤害
	var base_damage = attacker.attack
	var damage = int(base_damage * art_data.damage_multiplier)

	# 会心一击判定
	var is_critical = randf() < (attacker.critical_rate + art_data.critical_bonus)
	if is_critical:
		damage = int(damage * attacker.critical_damage)

	# 应用防御
	var actual_damage = target.take_damage(damage)

	var result = {
		"success": true,
		"attacker": entity_id,
		"target": target_id,
		"martial_art": martial_art,
		"damage": actual_damage,
		"is_critical": is_critical
	}

	combat_state.add_log("%s 使用 %s，对 %s 造成 %d 点伤害！" % [
		attacker.name, martial_art, target.name, actual_damage
	])

	if is_critical:
		combat_state.add_log("会心一击！")

	action_completed.emit(attacker.name, martial_art, result)

	# 检查是否击败敌人
	if not target.is_alive:
		combat_state.add_log("%s 被击败了！" % target.name)
		_check_battle_end()
	else:
		combat_state.next_turn()

	return result

func enemy_ai_action() -> Dictionary:
	var current = combat_state.get_current_actor()
	if current.is_player:
		return {"success": false, "reason": "当前是玩家回合"}

	var attacker = entity_components.get(current.id)
	if not attacker or not attacker.is_alive:
		combat_state.next_turn()
		return {"success": false, "reason": "当前角色已死亡"}

	# 简单的 AI：随机选择一个玩家目标
	var player_targets = []
	for entity in entity_components.values():
		if entity.is_alive and entity != attacker:
			player_targets.append(entity)

	if player_targets.size() == 0:
		_check_battle_end()
		return {"success": false, "reason": "没有可用目标"}

	var target = player_targets[randi() % player_targets.size()]

	# 随机选择一个武功
	var available_arts = attacker.martial_arts
	if available_arts.size() == 0:
		available_arts = ["普通攻击"]

	var selected_art = available_arts[randi() % available_arts.size()]

	# 如果是普通攻击，创建临时数据
	if selected_art == "普通攻击":
		var result = _perform_attack(attacker, target, "普通攻击", 1.0, 0, 0)
		combat_state.next_turn()
		return result

	var art_data = martial_arts_data.get(selected_art)
	if not art_data:
		combat_state.next_turn()
		return {"success": false, "reason": "武功数据不存在"}

	return _perform_attack(
		attacker, target, selected_art,
		art_data.damage_multiplier,
		art_data.internal_energy_cost,
		art_data.critical_bonus
	)

func _perform_attack(attacker: CombatComponent, target: CombatComponent,
					art_name: String, damage_mult: float, energy_cost: int,
					crit_bonus: float) -> Dictionary:
	# 扣除内功
	if energy_cost > 0:
		attacker.use_internal_energy(energy_cost)

	# 计算伤害
	var base_damage = attacker.attack
	var damage = int(base_damage * damage_mult)

	# 会心一击判定
	var is_critical = randf() < (attacker.critical_rate + crit_bonus)
	if is_critical:
		damage = int(damage * attacker.critical_damage)

	# 应用防御
	var actual_damage = target.take_damage(damage)

	var result = {
		"success": true,
		"attacker": attacker.name,
		"target": target.name,
		"martial_art": art_name,
		"damage": actual_damage,
		"is_critical": is_critical
	}

	combat_state.add_log("%s 使用 %s，对 %s 造成 %d 点伤害！" % [
		attacker.name, art_name, target.name, actual_damage
	])

	if is_critical:
		combat_state.add_log("会心一击！")

	action_completed.emit(attacker.name, art_name, result)

	# 检查是否击败
	if not target.is_alive:
		combat_state.add_log("%s 被击败了！" % target.name)
		_check_battle_end()

	return result

func _check_battle_end() -> void:
	var players_alive = 0
	var enemies_alive = 0

	for entity in entity_components.values():
		if entity.is_alive:
			if entity.get("is_player", false):
				players_alive += 1
			else:
				enemies_alive += 1

	if enemies_alive == 0:
		combat_state.set_victory()
		combat_ended.emit(true)
	elif players_alive == 0:
		combat_state.set_defeat()
		combat_ended.emit(false)

func _on_turn_started(who: Dictionary) -> void:
	if not who.get("is_player", false):
		# 敌人回合，延迟执行 AI
		await get_tree().create_timer(1.0).timeout
		enemy_ai_action()

func _on_phase_changed(new_phase: CombatState.CombatPhase) -> void:
	pass

func get_combat_state() -> CombatState:
	return combat_state

func get_battle_log() -> Array[String]:
	return combat_state.get_battle_log()
