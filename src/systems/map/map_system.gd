# map_system.gd
# Main system for managing game maps, tilemaps, and spatial relationships

class_name MapSystem extends ECSSystem

# Map loading priority (higher priority loads first)
@export var load_priority: int = 200

# Currently loaded map entity ID
var current_map_entity: int = 0

# Cache of loaded maps for quick switching
var map_cache: Dictionary = {}

# Reference to the Godot TileMap node (if used)
# var tilemap_node: TileMap

func _init() -> void:
	priority = 200  # Load before most other systems

func on_initialize() -> void:
	# Subscribe to map-related events
	subscribe_event("load_map", _on_load_map)
	subscribe_event("unload_map", _on_unload_map)
	subscribe_event("move_entity", _on_move_entity)
	subscribe_event("check_collision", _on_check_collision)

	# Log initialization
	print("MapSystem initialized")

func process_system(delta: float) -> void:
	# Handle any ongoing map processes if needed
	pass

func physics_process_system(delta: float) -> void:
	# Handle physics-related map processes if needed
	pass

# Load a map by name
func load_map(map_name: String) -> bool:
	# First, unload the current map if there is one
	if current_map_entity != 0:
		unload_current_map()

	# Look for a map entity with the given name
	var map_entities = get_entities(["MapDataComponent"])

	for entity_id in map_entities:
		var map_data: MapDataComponent = entity_manager.get_component(entity_id, "MapDataComponent")
		if map_data.map_name == map_name:
			current_map_entity = entity_id

			# Emit map loaded event
			emit_event("map_loaded", {
				"map_name": map_name,
				"entity_id": entity_id
			})

			print("Loaded map: ", map_name)
			return true

	# If we didn't find the map, try to create it from resources
	if _create_map_from_resources(map_name):
		print("Created map from resources: ", map_name)
		return true

	# Map not found
	emit_event("map_load_failed", {
		"map_name": map_name,
		"reason": "Map not found in entities or resources"
	})

	return false

# Unload the current map
func unload_current_map() -> void:
	if current_map_entity != 0:
		# Emit map unloaded event
		var map_data: MapDataComponent = entity_manager.get_component(current_map_entity, "MapDataComponent")
		emit_event("map_unloaded", {
			"map_name": map_data.map_name if map_data != null else "Unknown",
			"entity_id": current_map_entity
		})

		current_map_entity = 0

# Create a map from Godot resources (TileMap, etc.)
func _create_map_from_resources(map_name: String) -> bool:
	# This is where we'd load a tilemap scene and convert it to our ECS representation
	# For now, we'll create a basic empty map as a fallback
	var new_entity_id = entity_manager.create_entity()

	# Add basic map components
	var map_data_component = MapDataComponent.new(20, 15, map_name, "Dynamically created map")
	entity_manager.add_component(new_entity_id, "MapDataComponent", map_data_component)

	# Create default tiles for the map
	_initialize_default_tiles(new_entity_id, map_data_component)

	# Set as current map
	current_map_entity = new_entity_id

	# Emit map loaded event
	emit_event("map_loaded", {
		"map_name": map_name,
		"entity_id": new_entity_id
	})

	return true

# Initialize default tiles for a new map
func _initialize_default_tiles(map_entity_id: int, map_data: MapDataComponent) -> void:
	# Create basic floor tiles
	for y in range(map_data.height):
		for x in range(map_data.width):
			var tile_entity_id = entity_manager.create_entity()

			# Create and add tile component
			var tile_component = TileComponent.new(Vector2i(x, y), "floor", true, 1.0)
			entity_manager.add_component(tile_entity_id, "TileComponent", tile_component)

			# Add to map
			map_data.set_tile_entity(x, y, tile_entity_id)

# Check if a position is walkable (has no collisions)
func is_walkable(world_position: Vector2) -> bool:
	# Convert world position to grid position
	var grid_pos = Vector2i(int(world_position.x), int(world_position.y))

	# Get current map data
	if current_map_entity == 0:
		return false  # No map loaded

	var map_data: MapDataComponent = entity_manager.get_component(current_map_entity, "MapDataComponent")
	if map_data == null:
		return false

	# Check bounds
	if grid_pos.x < 0 or grid_pos.x >= map_data.width or grid_pos.y < 0 or grid_pos.y >= map_data.height:
		return false  # Out of bounds

	# Get tile entity at position
	var tile_entity_id = map_data.get_tile_entity(grid_pos.x, grid_pos.y)
	if tile_entity_id == 0:
		return false  # No tile at this position

	# Get tile component
	var tile_component: TileComponent = entity_manager.get_component(tile_entity_id, "TileComponent")
	if tile_component == null:
		return false

	# Return walkable property
	return tile_component.walkable

# Get the map entity at a world position
func get_tile_at_position(world_position: Vector2) -> int:
	# Convert world position to grid position
	var grid_pos = Vector2i(int(world_position.x), int(world_position.y))

	# Get current map data
	if current_map_entity == 0:
		return 0  # No map loaded

	var map_data: MapDataComponent = entity_manager.get_component(current_map_entity, "MapDataComponent")
	if map_data == null:
		return 0

	# Check bounds
	if grid_pos.x < 0 or grid_pos.x >= map_data.width or grid_pos.y < 0 or grid_pos.y >= map_data.height:
		return 0  # Out of bounds

	# Get and return tile entity at position
	return map_data.get_tile_entity(grid_pos.x, grid_pos.y)

# Handle load_map event
func _on_load_map(event_data: Dictionary) -> void:
	var map_name = event_data.get("map_name", "")
	if map_name != "":
		load_map(map_name)

# Handle unload_map event
func _on_unload_map(event_data: Dictionary) -> void:
	unload_current_map()

# Handle move_entity event
func _on_move_entity(event_data: Dictionary) -> void:
	var entity_id = event_data.get("entity_id", 0)
	var target_position = event_data.get("target_position", Vector2.ZERO)

	if entity_id == 0:
		return

	# Check if the target position is walkable
	if not is_walkable(target_position):
		# Cannot move to this position - send an event back
		emit_event("move_blocked", {
			"entity_id": entity_id,
			"target_position": target_position,
			"reason": "Position not walkable"
		})
		return

	# Move the entity by updating its TransformComponent
	var transform: TransformComponent = entity_manager.get_component(entity_id, "TransformComponent")
	if transform != null:
		transform.position = Vector3(target_position.x, target_position.y, transform.position.z)

		# Emit successful move event
		emit_event("entity_moved", {
			"entity_id": entity_id,
			"position": target_position
		})

# Handle check_collision event
func _on_check_collision(event_data: Dictionary) -> void:
	var entity_id = event_data.get("entity_id", 0)
	var position = event_data.get("position", Vector2.ZERO)

	if entity_id == 0:
		return

	var is_clear = is_walkable(position)

	emit_event("collision_result", {
		"entity_id": entity_id,
		"position": position,
		"is_clear": is_clear
	})

# Get the currently loaded map's data
func get_current_map_data() -> MapDataComponent:
	if current_map_entity == 0:
		return null

	return entity_manager.get_component(current_map_entity, "MapDataComponent")

# Get the currently loaded map entity ID
func get_current_map_entity() -> int:
	return current_map_entity