# entity_manager.gd
# Manages entity lifecycle and component storage

class_name EntityManager extends Node

# Entity storage: maps entity_id to component data
var _entities: Dictionary = {}
var _next_entity_id: int = 1
var _entity_count: int = 0

# Component storage: maps component class to entity_id -> component
var _components: Dictionary = {}

signal entity_created(entity_id: int)
signal entity_destroyed(entity_id: int)
signal component_added(entity_id: int, component_class: String)
signal component_removed(entity_id: int, component_class: String)

## Creates a new entity with optional initial components
func create_entity(p_initial_components: Array[Component] = []) -> int:
	var entity_id = _next_entity_id
	_next_entity_id += 1
	_entities[entity_id] = {}
	_entity_count += 1

	for component in p_initial_components:
		if component != null and component is Component:
			add_component(entity_id, component)

	entity_created.emit(entity_id)
	return entity_id

## Destroys an entity and removes all its components
func destroy_entity(entity_id: int) -> void:
	if not _entities.has(entity_id):
		return

	# Remove all components
	var component_classes = _entities[entity_id].keys()
	for component_class in component_classes:
		_remove_component_internal(entity_id, component_class)

	_entities.erase(entity_id)
	_entity_count -= 1
	entity_destroyed.emit(entity_id)

## Adds a component to an entity
func add_component(entity_id: int, component: Component) -> void:
	if not _entities.has(entity_id):
		push_error("Entity %d does not exist" % entity_id)
		return

	if component == null:
		push_error("Cannot add null component to entity %d" % entity_id)
		return

	var component_class = component.get_class()

	# Initialize component storage if needed
	if not _components.has(component_class):
		_components[component_class] = {}

	# Check if component already exists
	if _entities[entity_id].has(component_class):
		push_warning("Entity %d already has component %s" % [entity_id, component_class])
		return

	# Add component
	_entities[entity_id][component_class] = component
	_components[component_class][entity_id] = component
	component_added.emit(entity_id, component_class)

## Removes a component from an entity
func remove_component(entity_id: int, component_class: String) -> void:
	if not _entities.has(entity_id):
		push_error("Entity %d does not exist" % entity_id)
		return

	_remove_component_internal(entity_id, component_class)

func _remove_component_internal(entity_id: int, component_class: String) -> void:
	if not _entities[entity_id].has(component_class):
		return

	_entities[entity_id].erase(component_class)
	_components[component_class].erase(entity_id)
	component_removed.emit(entity_id, component_class)

## Gets a component from an entity
func get_component(entity_id: int, component_class: String) -> Component:
	if not _entities.has(entity_id):
		return null

	return _entities[entity_id].get(component_class)

## Checks if an entity has a specific component
func has_component(entity_id: int, component_class: String) -> bool:
	if not _entities.has(entity_id):
		return false

	return _entities[entity_id].has(component_class)

## Checks if an entity has all specified components
func has_all_components(entity_id: int, component_classes: Array[String]) -> bool:
	if not _entities.has(entity_id):
		return false

	for component_class in component_classes:
		if not _entities[entity_id].has(component_class):
			return false

	return true

## Queries entities that have all specified components
## Returns: Array of entity IDs
func query(component_classes: Array[String]) -> Array[int]:
	var result: Array[int] = []

	# Find the component class with the fewest entities
	var smallest_component_class: String = ""
	var smallest_count: int = -1

	for component_class in component_classes:
		if not _components.has(component_class):
			return result

		var count = _components[component_class].size()
		if smallest_count == -1 or count < smallest_count:
			smallest_count = count
			smallest_component_class = component_class

	# Iterate over the smallest set and filter
	var candidates = _components[smallest_component_class].keys()
	for entity_id in candidates:
		if has_all_components(entity_id, component_classes):
			result.append(entity_id)

	return result

## Queries entities that have at least one of the specified components
## Returns: Array of entity IDs
func query_any(component_classes: Array[String]) -> Array[int]:
	var result: Array[int] = []
	var checked_entities: Dictionary = {}

	for component_class in component_classes:
		if not _components.has(component_class):
			continue

		for entity_id in _components[component_class].keys():
			if not checked_entities.has(entity_id):
				checked_entities[entity_id] = true
				result.append(entity_id)

	return result

## Queries entities that have all required components but none of the excluded components
## Returns: Array of entity IDs
func query_exclude(required: Array[String], excluded: Array[String]) -> Array[int]:
	var result: Array[int] = []
	var candidate_ids = query(required)

	for entity_id in candidate_ids:
		var has_excluded = false
		for excluded_class in excluded:
			if has_component(entity_id, excluded_class):
				has_excluded = true
				break

		if not has_excluded:
			result.append(entity_id)

	return result

## Gets all entities with a specific component
func get_entities_with_component(component_class: String) -> Array[int]:
	if not _components.has(component_class):
		return []

	return _components[component_class].keys()

## Gets the total number of entities
func get_entity_count() -> int:
	return _entity_count

## Checks if an entity exists
func entity_exists(entity_id: int) -> bool:
	return _entities.has(entity_id)

## Gets all component classes an entity has
func get_entity_components(entity_id: int) -> Array[String]:
	if not _entities.has(entity_id):
		return []

	return _entities[entity_id].keys()

## Clears all entities and components
func clear() -> void:
	_entities.clear()
	_components.clear()
	_next_entity_id = 1
	_entity_count = 0
