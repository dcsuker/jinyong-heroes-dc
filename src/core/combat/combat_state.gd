class_name CombatState
extends Node

## 战斗状态机

enum CombatPhase {
	IDLE,
	PLAYER_TURN,
	ENEMY_TURN,
	CALCULATING,
	VICTORY,
	DEFEAT
}

var current_phase: CombatPhase = CombatPhase.IDLE
var turn_order: Array[Dictionary] = []
var current_turn_index: int = 0
var battle_log: Array[String] = []

signal phase_changed(new_phase: CombatPhase)
signal turn_started(who: Dictionary)
signal battle_log_updated(log: Array[String])

func start_battle(participants: Array[Dictionary]) -> void:
	"""
	participants: [{entity_id, name, speed, stats, ...}]
	"""
	turn_order.clear()
	battle_log.clear()

	# 按速度排序决定出手顺序
	for p in participants:
		turn_order.append(p)
	turn_order.sort_custom(func(a, b): return a.speed > b.speed)

	current_phase = CombatPhase.PLAYER_TURN
	current_turn_index = 0
	phase_changed.emit(current_phase)

	add_log("战斗开始！")

	if turn_order.size() > 0:
		turn_started.emit(turn_order[0])

func get_current_actor() -> Dictionary:
	if turn_order.size() > 0 and current_turn_index < turn_order.size():
		return turn_order[current_turn_index]
	return {}

func next_turn() -> void:
	if turn_order.size() == 0:
		return

	current_turn_index = (current_turn_index + 1) % turn_order.size()

	# 检查是否是玩家回合
	var current = get_current_actor()
	if current.get("is_player", false):
		current_phase = CombatPhase.PLAYER_TURN
	else:
		current_phase = CombatPhase.ENEMY_TURN

	phase_changed.emit(current_phase)
	turn_started.emit(current)

func add_log(message: String) -> void:
	battle_log.append(message)
	battle_log_updated.emit(battle_log)

func get_battle_log() -> Array[String]:
	return battle_log

func is_player_turn() -> bool:
	return current_phase == CombatPhase.PLAYER_TURN

func is_enemy_turn() -> bool:
	return current_phase == CombatPhase.ENEMY_TURN

func set_victory() -> void:
	current_phase = CombatPhase.VICTORY
	phase_changed.emit(current_phase)
	add_log("战斗胜利！")

func set_defeat() -> void:
	current_phase = CombatPhase.DEFEAT
	phase_changed.emit(current_phase)
	add_log("战斗失败...")
