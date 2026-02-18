# map_demo_setup.gd
# Setup script to initialize ECS with map systems

extends Node

func _ready() -> void:
	# Create ECS Manager if it doesn't exist
	var ecs_manager = ECSManager.new()
	ecs_manager.name = "ECSManager"
	add_child(ecs_manager)

	# Create and add Map System
	var map_system = MapSystem.new()
	map_system.name = "MapSystem"
	ecs_manager.register_system(map_system)

	# Create and add Navigation System
	var navigation_system = NavigationSystem.new()
	navigation_system.name = "NavigationSystem"
	ecs_manager.register_system(navigation_system)

	# Create a default map entity to work with
	_create_default_map(ecs_manager)

func _create_default_map(ecs_manager: ECSManager) -> void:
	# Create a new map entity
	var map_entity_id = ecs_manager.entity_manager.create_entity()

	# Add MapDataComponent to the entity
	var map_data_component = MapDataComponent.new(20, 15, "DemoMap", "A demonstration map for the map system")
	ecs_manager.entity_manager.add_component(map_entity_id, "MapDataComponent", map_data_component)

	# Initialize some tiles for the map
	for y in range(map_data_component.height):
		for x in range(map_data_component.width):
			var tile_entity_id = ecs_manager.entity_manager.create_entity()

			# Determine if this tile should be walkable or not
			var is_walkable = true
			# Create some obstacles in a pattern
			if (x % 7 == 0 and y % 5 == 0) or (x == 10 and y > 5 and y < 12):
				is_walkable = false

			# Create and add tile component
			var tile_component = TileComponent.new(Vector2i(x, y), "floor" if is_walkable else "wall", is_walkable, 1.0 if is_walkable else float('inf'))
			ecs_manager.entity_manager.add_component(tile_entity_id, "TileComponent", tile_component)

			# Add to map
			map_data_component.set_tile_entity(x, y, tile_entity_id)