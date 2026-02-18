# health_system.gd
# Example system that processes health and damage

class_name HealthSystem extends ECSSystem

@export var process_in_physics: bool = true

func _init() -> void:
	priority = 400 # Gameplay systems

func on_initialize() -> void:
	# Subscribe to damage events
	subscribe_event("damage_dealt", _on_damage_dealt)
	subscribe_event("heal_applied", _on_heal_applied)

func process_system(delta: float) -> void:
	if process_in_physics:
		return

	_process_health(delta)

func physics_process_system(delta: float) -> void:
	if not process_in_physics:
		return

	_process_health(delta)

func _process_health(delta: float) -> void:
	# Query entities with Health components
	var entities = get_entities(["HealthComponent"])

	for entity_id in entities:
		var health: HealthComponent = entity_manager.get_component(entity_id, "HealthComponent")

		if health != null and not health.is_alive():
			# Emit death event once per entity
			emit_event("entity_died", {
				"entity_id": entity_id,
				"health_component": health
			})

			# Mark entity for cleanup if it has a DeathComponent
			# (This is just an example - actual death handling would be more complex)
func _on_damage_dealt(event_data: Dictionary) -> void:
	var target_id = event_data.get("target_id", 0)
	var damage = event_data.get("damage", 0.0)

	if target_id == 0 or damage <= 0:
		return

	var health: HealthComponent = entity_manager.get_component(target_id, "HealthComponent")

	if health != null:
		var actual_damage = health.take_damage(damage)

		# Emit health changed event
		emit_event("health_changed", {
			"entity_id": target_id,
			"current_health": health.current_health,
			"max_health": health.max_health,
			"damage_dealt": actual_damage
		})

		if not health.is_alive():
			emit_event("entity_killed", {
				"entity_id": target_id,
				"killer_id": event_data.get("source_id", 0)
			})

func _on_heal_applied(event_data: Dictionary) -> void:
	var target_id = event_data.get("target_id", 0)
	var amount = event_data.get("amount", 0.0)

	if target_id == 0 or amount <= 0:
		return

	var health: HealthComponent = entity_manager.get_component(target_id, "HealthComponent")

	if health != null:
		var heal_amount = health.heal(amount)

		# Emit health changed event
		emit_event("health_changed", {
			"entity_id": target_id,
			"current_health": health.current_health,
			"max_health": health.max_health,
			"heal_amount": heal_amount
		})
