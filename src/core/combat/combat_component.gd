class_name CombatComponent
extends Node

## 战斗组件 - 处理角色的战斗属性

@export var max_hp: int = 100
@export var current_hp: int = 100
@export var attack: int = 10
@export var defense: int = 5
@export var speed: int = 10
@export var critical_rate: float = 0.05
@export var critical_damage: float = 1.5

@export var martial_arts: Array[String] = []
@export var internal_energy: int = 100
@export var max_internal_energy: int = 100

var is_alive: bool = true

signal hp_changed(current: int, max: int)
signal internal_energy_changed(current: int, max: int)
signal died()

func take_damage(amount: int) -> int:
	if not is_alive:
		return 0

	var actual_damage = max(1, amount - defense)
	current_hp = max(0, current_hp - actual_damage)
	hp_changed.emit(current_hp, max_hp)

	if current_hp <= 0:
		is_alive = false
		died.emit()

	return actual_damage

func heal(amount: int) -> int:
	var heal_amount = min(amount, max_hp - current_hp)
	current_hp += heal_amount
	hp_changed.emit(current_hp, max_hp)
	return heal_amount

func use_internal_energy(amount: int) -> bool:
	if internal_energy >= amount:
		internal_energy -= amount
		internal_energy_changed.emit(internal_energy, max_internal_energy)
		return true
	return false

func recover_internal_energy(amount: int) -> int:
	var recover_amount = min(amount, max_internal_energy - internal_energy)
	internal_energy += recover_amount
	internal_energy_changed.emit(internal_energy, max_internal_energy)
	return recover_amount

func add_martial_art(art_name: String) -> void:
	if art_name not in martial_arts:
		martial_arts.append(art_name)

func get_stats() -> Dictionary:
	return {
		"hp": {"current": current_hp, "max": max_hp},
		"internal_energy": {"current": internal_energy, "max": max_internal_energy},
		"attack": attack,
		"defense": defense,
		"speed": speed,
		"critical_rate": critical_rate,
		"critical_damage": critical_damage,
		"martial_arts": martial_arts
	}
