class_name MartialArt
extends Resource

## 武功招式数据类

@export var name: String
@export var type: String  # 拳法，掌法，剑法，内功等
@export var level: String  # 普通，上乘，绝世
@export var damage_multiplier: float = 1.0
@export var internal_energy_cost: int = 10
@export var critical_bonus: float = 0.1
@export var description: String
@export var effects: Array[String] = []  # 特殊效果

func get_damage(base_attack: int) -> int:
	return int(base_attack * damage_multiplier)

func can_use(current_energy: int) -> bool:
	return current_energy >= internal_energy_cost
