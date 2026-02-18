# ecs_system.gd
# Base class for all ECS systems

class_name ECSSystem extends Node

# System execution priority (lower number = earlier execution)
# Default: 300 (between Logic and Physics systems)
@export var priority: int = 300

# Whether this system is active
@export var active: bool = true

# Reference to entity manager (set by ECSManager)
var entity_manager: EntityManager

# Reference to event bus (set by ECSManager)
var event_bus: EventBus

# Reference to resource manager (set by ECSManager)
var resource_manager: ResourceManager

## Called when system is added to ECSManager
## Override to perform initialization
func on_initialize() -> void:
	pass

## Called when system is removed from ECSManager
## Override to perform cleanup
func on_cleanup() -> void:
	pass

## Called when system is activated
func on_activate() -> void:
	active = true

## Called when system is deactivated
func on_deactivate() -> void:
	active = false

## Called every frame
## Override in derived systems
func process_system(delta: float) -> void:
	pass

## Called every physics frame
## Override in derived systems
func physics_process_system(delta: float) -> void:
	pass

## Helper method to get entities with specific components
func get_entities(component_classes: Array[String]) -> Array[int]:
	if entity_manager == null:
		push_error("Entity manager not set")
		return []

	return entity_manager.query(component_classes)

## Helper method to get entities with components, excluding some
func get_entities_exclude(required: Array[String], excluded: Array[String]) -> Array[int]:
	if entity_manager == null:
		push_error("Entity manager not set")
		return []

	return entity_manager.query_exclude(required, excluded)

## Helper method to emit events
func emit_event(event_name: String, event_data: Dictionary = {}) -> int:
	if event_bus == null:
		push_error("Event bus not set")
		return 0

	return event_bus.emit(event_name, event_data)

## Helper method to subscribe to events
func subscribe_event(event_name: String, listener: Callable) -> void:
	if event_bus == null:
		push_error("Event bus not set")
		return

	event_bus.subscribe(event_name, listener)

## Helper method to unsubscribe from events
func unsubscribe_event(event_name: String, listener: Callable) -> void:
	if event_bus == null:
		push_error("Event bus not set")
		return

	event_bus.unsubscribe(event_name, listener)
