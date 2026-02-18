# navigation_system.gd
# System for handling pathfinding and navigation for entities

class_name NavigationSystem extends ECSSystem

# Priority for navigation processing
@export var navigation_priority: int = 250

# Reference to the MapSystem
var map_system: MapSystem

func _init() -> void:
	priority = 250  # Between map loading and main game logic

func on_initialize() -> void:
	# Subscribe to navigation-related events
	subscribe_event("find_path", _on_find_path)
	subscribe_event("navigate_to", _on_navigate_to)
	subscribe_event("stop_navigation", _on_stop_navigation)

	# Try to get the MapSystem reference
	var ecs_manager = get_parent()
	if ecs_manager != null and ecs_manager.has_method("get_system"):
		map_system = ecs_manager.get_system("MapSystem")

	# Log initialization
	print("NavigationSystem initialized")

func process_system(delta: float) -> void:
	# Process all entities with NavigationComponent that are following a path
	var entities = get_entities(["NavigationComponent", "TransformComponent"])

	for entity_id in entities:
		var nav_comp: NavigationComponent = entity_manager.get_component(entity_id, "NavigationComponent")
		var transform: TransformComponent = entity_manager.get_component(entity_id, "TransformComponent")

		if nav_comp.following_path and not nav_comp.path.is_empty():
			_follow_path(entity_id, nav_comp, transform, delta)

# Follow the current path for an entity
func _follow_path(entity_id: int, nav_comp: NavigationComponent, transform: TransformComponent, delta: float) -> void:
	if nav_comp.current_waypoint_index >= nav_comp.path.size():
		# Path completed
		nav_comp.following_path = false
		emit_event("navigation_completed", {
			"entity_id": entity_id,
			"destination": nav_comp.destination
		})
		return

	# Get current target waypoint
	var target_pos = nav_comp.path[nav_comp.current_waypoint_index]
	var current_pos = Vector2(transform.position.x, transform.position.y)

	# Calculate direction and move toward target
	var direction = (target_pos - current_pos).normalized()
	var movement = direction * nav_comp.move_speed * delta

	# Move the entity
	transform.position.x += movement.x
	transform.position.y += movement.y

	# Check if we've reached the current waypoint
	if current_pos.distance_to(target_pos) <= nav_comp.arrival_distance:
		# Move to next waypoint
		nav_comp.current_waypoint_index += 1

		# If we've reached the final waypoint
		if nav_comp.current_waypoint_index >= nav_comp.path.size():
			nav_comp.following_path = false
			emit_event("navigation_completed", {
				"entity_id": entity_id,
				"destination": nav_comp.destination
			})

# Find a path between two points
func find_path(start_pos: Vector2, end_pos: Vector2) -> Array[Vector2]:
	var path: Array[Vector2] = []

	# Get the current map
	if map_system == null:
		printerr("NavigationSystem: No MapSystem found")
		return path

	var map_data = map_system.get_current_map_data()
	if map_data == null:
		printerr("NavigationSystem: No map data available")
		return path

	# Perform simple A* pathfinding between start and end positions
	path = _calculate_astar_path(start_pos, end_pos, map_data)

	return path

# Simple A* pathfinding algorithm
func _calculate_astar_path(start: Vector2, goal: Vector2, map_data: MapDataComponent) -> Array[Vector2]:
	var path: Array[Vector2] = []

	# Convert positions to grid coordinates
	var start_grid = Vector2i(int(start.x), int(start.y))
	var goal_grid = Vector2i(int(goal.x), int(goal.y))

	# Validate start and goal positions are walkable
	if not _is_walkable_grid(map_data, start_grid) or not _is_walkable_grid(map_data, goal_grid):
		return path  # Invalid start or goal position

	# Simple implementation using sets and dictionaries
	var open_set = []
	var closed_set = {}
	var came_from = {}
	var g_score = {}
	var f_score = {}

	# Initialize scores
	g_score[start_grid] = 0
	f_score[start_grid] = start_grid.distance_to(goal_grid)
	open_set.append(start_grid)

	while not open_set.is_empty():
		# Find node in open_set with lowest f_score
		var current = open_set[0]
		var min_f = f_score[current]
		for node in open_set:
			if f_score[node] < min_f:
				current = node
				min_f = f_score[node]

		# If we reached the goal
		if current == goal_grid:
			# Reconstruct path
			var temp_path = []
			var path_node = current
			while path_node in came_from:
				temp_path.push_front(path_node)
				path_node = came_from[path_node]
			temp_path.push_front(start_grid)

			# Convert grid positions back to world positions
			for grid_pos in temp_path:
				path.append(Vector2(grid_pos.x, grid_pos.y))

			return path

		# Move current from open_set to closed_set
		open_set.erase(current)
		closed_set[current] = true

		# Get neighbors
		var neighbors = _get_neighbors(current, map_data)
		for neighbor in neighbors:
			if neighbor in closed_set:
				continue

			var tentative_g_score = g_score[current] + 1  # Assuming unit cost

			if not neighbor in open_set:
				open_set.append(neighbor)
			elif tentative_g_score >= g_score[neighbor]:
				continue

			# Record this path as better
			came_from[neighbor] = current
			g_score[neighbor] = tentative_g_score
			f_score[neighbor] = g_score[neighbor] + neighbor.distance_to(goal_grid)

	# If we get here, no path was found
	return []

# Get valid neighboring grid positions
func _get_neighbors(pos: Vector2i, map_data: MapDataComponent) -> Array[Vector2i]:
	var neighbors: Array[Vector2i] = []

	# Check four directions: up, down, left, right
	var directions = [Vector2i(0, -1), Vector2i(0, 1), Vector2i(-1, 0), Vector2i(1, 0)]

	for dir in directions:
		var neighbor_pos = pos + dir

		# Check if neighbor is within map bounds and walkable
		if _is_valid_grid_position(neighbor_pos, map_data) and _is_walkable_grid(map_data, neighbor_pos):
			neighbors.append(neighbor_pos)

	return neighbors

# Check if a grid position is within map bounds
func _is_valid_grid_position(pos: Vector2i, map_data: MapDataComponent) -> bool:
	return pos.x >= 0 and pos.x < map_data.width and pos.y >= 0 and pos.y < map_data.height

# Check if a grid position is walkable
func _is_walkable_grid(map_data: MapDataComponent, pos: Vector2i) -> bool:
	# Get tile at position
	var tile_entity_id = map_data.get_tile_entity(pos.x, pos.y)
	if tile_entity_id == 0:
		return false  # No tile at this position

	# Get tile component
	var tile_component: TileComponent = entity_manager.get_component(tile_entity_id, "TileComponent")
	if tile_component == null:
		return false

	return tile_component.walkable

# Navigate to a position
func navigate_to_entity(entity_id: int, target_pos: Vector2) -> bool:
	# Get the navigation component
	var nav_comp: NavigationComponent = entity_manager.get_component(entity_id, "NavigationComponent")
	if nav_comp == null:
		return false

	# Get the transform component to get start position
	var transform: TransformComponent = entity_manager.get_component(entity_id, "TransformComponent")
	if transform == null:
		return false

	var start_pos = Vector2(transform.position.x, transform.position.y)

	# Calculate path
	var path = find_path(start_pos, target_pos)

	if path.is_empty():
		# No path found
		emit_event("navigation_failed", {
			"entity_id": entity_id,
			"start_pos": start_pos,
			"target_pos": target_pos,
			"reason": "No path found"
		})
		return false

	# Store path and destination in the navigation component
	nav_comp.path = path
	nav_comp.destination = target_pos
	nav_comp.following_path = true
	nav_comp.current_waypoint_index = 1  # Start from first waypoint after start position

	# Emit navigation started event
	emit_event("navigation_started", {
		"entity_id": entity_id,
		"path": path,
		"destination": target_pos
	})

	return true

# Handle find_path event
func _on_find_path(event_data: Dictionary) -> void:
	var start_pos = event_data.get("start_pos", Vector2.ZERO)
	var end_pos = event_data.get("end_pos", Vector2.ZERO)

	var path = find_path(start_pos, end_pos)

	emit_event("path_found", {
		"start_pos": start_pos,
		"end_pos": end_pos,
		"path": path,
		"path_found": not path.is_empty()
	})

# Handle navigate_to event
func _on_navigate_to(event_data: Dictionary) -> void:
	var entity_id = event_data.get("entity_id", 0)
	var target_pos = event_data.get("target_pos", Vector2.ZERO)

	if entity_id == 0:
		return

	var success = navigate_to_entity(entity_id, target_pos)

	emit_event("navigate_response", {
		"entity_id": entity_id,
		"target_pos": target_pos,
		"success": success
	})

# Handle stop_navigation event
func _on_stop_navigation(event_data: Dictionary) -> void:
	var entity_id = event_data.get("entity_id", 0)

	if entity_id == 0:
		return

	var nav_comp: NavigationComponent = entity_manager.get_component(entity_id, "NavigationComponent")
	if nav_comp != null:
		nav_comp.following_path = false
		nav_comp.path.clear()
		nav_comp.current_waypoint_index = 0

		emit_event("navigation_stopped", {
			"entity_id": entity_id
		})