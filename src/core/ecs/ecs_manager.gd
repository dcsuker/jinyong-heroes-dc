# ecs_manager.gd
# Central manager for ECS architecture

class_name ECSManager extends Node

# Core managers
@onready var entity_manager: EntityManager = $EntityManager
@onready var event_bus: EventBus = $EventBus
@onready var resource_manager: ResourceManager = $ResourceManager

# Systems storage
var _systems: Array[ECSSystem] = []

# System execution groups
var _process_systems: Array[ECSSystem] = []
var _physics_process_systems: Array[ECSSystem] = []

signal system_registered(system: ECSSystem)
signal system_unregistered(system: ECSSystem)

func _ready() -> void:
	# Connect internal signals
	_configure_managers()

## Configures internal connections between managers
func _configure_managers() -> void:
	# Managers will be configured externally or via children

## Registers a system with the ECSManager
func register_system(system: ECSSystem) -> void:
	if system == null:
		push_error("Cannot register null system")
		return

	if _systems.has(system):
		push_warning("System already registered")
		return

	# Inject dependencies
	system.entity_manager = entity_manager
	system.event_bus = event_bus
	system.resource_manager = resource_manager

	# Add to appropriate execution list
	if system.has_method("process_system"):
		_process_systems.append(system)

	if system.has_method("physics_process_system"):
		_physics_process_systems.append(system)

	# Sort by priority
	_sort_systems(_process_systems)
	_sort_systems(_physics_process_systems)

	_systems.append(system)

	# Add as child if not already
	if system.get_parent() != self:
		add_child(system)

	system.on_initialize()
	system_registered.emit(system)

## Unregisters a system from the ECSManager
func unregister_system(system: ECSSystem) -> void:
	if system == null:
		return

	if not _systems.has(system):
		return

	system.on_cleanup()
	system_unregistered.emit(system)

	_process_systems.erase(system)
	_physics_process_systems.erase(system)
	_systems.erase(system)

	# Remove as child if managed by us
	if system.get_parent() == self:
		remove_child(system)

## Gets all registered systems
func get_systems() -> Array[ECSSystem]:
	return _systems.duplicate()

## Gets systems by type
func get_systems_of_type(system_class: String) -> Array[ECSSystem]:
	var result: Array[ECSSystem] = []

	for system in _systems:
		if system.get_class() == system_class:
			result.append(system)

	return result

## Gets the first system of a specific type
func get_system(system_class: String) -> ECSSystem:
	var systems = get_systems_of_type(system_class)

	if systems.is_empty():
		return null

	return systems[0]

## Sorts systems by priority (lower number = earlier execution)
func _sort_systems(systems_array: Array[ECSSystem]) -> void:
	systems_array.sort_custom(func(a, b): return a.priority < b.priority)

## Process all systems
func _process(delta: float) -> void:
	event_bus.process_queue()

	for system in _process_systems:
		if system.active:
			system.process_system(delta)

## Physics process all systems
func _physics_process(delta: float) -> void:
	event_bus.process_queue()

	for system in _physics_process_systems:
		if system.active:
			system.physics_process_system(delta)

## Clears all entities and systems (use with caution)
func clear() -> void:
	# Unregister all systems first
	var systems_to_remove = _systems.duplicate()
	for system in systems_to_remove:
		unregister_system(system)

	# Clear entity manager
	if entity_manager != null:
		entity_manager.clear()

## Gets the total number of systems
func get_system_count() -> int:
	return _systems.size()

## Gets the number of active systems
func get_active_system_count() -> int:
	var count = 0
	for system in _systems:
		if system.active:
			count += 1
	return count
