# health_component.gd
# Health and damage resistance data

class_name HealthComponent extends Component

@export var current_health: float = 100.0
@export var max_health: float = 100.0
@export var defense: float = 0.0
@export var is_invincible: bool = false

func _init(p_current_health: float = 100.0, p_max_health: float = 100.0, p_defense: float = 0.0) -> void:
	current_health = p_current_health
	max_health = p_max_health
	defense = p_defense
	is_invincible = false

func take_damage(damage: float) -> float:
	if is_invincible:
		return 0.0

	var actual_damage = max(0.0, damage - defense)
	current_health = max(0.0, current_health - actual_damage)
	return actual_damage

func heal(amount: float) -> float:
	var heal_amount = min(amount, max_health - current_health)
	current_health += heal_amount
	return heal_amount

func is_alive() -> bool:
	return current_health > 0.0

func get_health_percentage() -> float:
	if max_health <= 0.0:
		return 0.0
	return current_health / max_health
