# movement_system.gd
# Example system that processes movement for entities

class_name MovementSystem extends ECSSystem

@export var process_in_physics: bool = true

func _init() -> void:
	priority = 300 # Physics systems

func on_initialize() -> void:
	# Subscribe to relevant events
	subscribe_event("apply_force", _on_apply_force)

func process_system(delta: float) -> void:
	if process_in_physics:
		return

	_process_movement(delta)

func physics_process_system(delta: float) -> void:
	if not process_in_physics:
		return

	_process_movement(delta)

func _process_movement(delta: float) -> void:
	# Query entities with Transform and Velocity components
	var entities = get_entities(["TransformComponent", "VelocityComponent"])

	for entity_id in entities:
		var transform: TransformComponent = entity_manager.get_component(entity_id, "TransformComponent")
		var velocity: VelocityComponent = entity_manager.get_component(entity_id, "VelocityComponent")

		# Apply acceleration
		velocity.velocity += velocity.acceleration * delta

		# Apply friction
		velocity.velocity *= (1.0 - velocity.friction * delta)

		# Clamp to max speed
		if velocity.velocity.length() > velocity.max_speed:
			velocity.velocity = velocity.velocity.normalized() * velocity.max_speed

		# Update position
		transform.position += velocity.velocity * delta

		# Reset acceleration for next frame
		velocity.acceleration = Vector3.ZERO

		# Emit event if entity moved significantly
		if velocity.velocity.length() > 0.01:
			emit_event("entity_moved", {
				"entity_id": entity_id,
				"position": transform.position,
				"velocity": velocity.velocity
			})

func _on_apply_force(event_data: Dictionary) -> void:
	var entity_id = event_data.get("entity_id", 0)
	var force = event_data.get("force", Vector3.ZERO)

	if entity_id == 0:
		return

	var velocity: VelocityComponent = entity_manager.get_component(entity_id, "VelocityComponent")

	if velocity != null:
		velocity.acceleration += force
