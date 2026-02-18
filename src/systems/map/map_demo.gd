# map_demo.gd
# Demo script showing usage of the map system

extends Node2D

# References to ECS systems
var ecs_manager: ECSManager
var map_system: MapSystem
var navigation_system: NavigationSystem

# Player entity
var player_entity: int = 0

func _ready() -> void:
	# Find ECS manager (should be created by the setup script)
	ecs_manager = get_parent().find_child("ECSManager", true, false) as ECSManager

	if ecs_manager == null:
		# Wait a frame and try again (in case setup hasn't completed yet)
		await get_tree().process_frame
		ecs_manager = get_parent().find_child("ECSManager", true, false) as ECSManager

	if ecs_manager == null:
		printerr("ECSManager not found after setup!")
		return

	# Wait briefly to ensure systems are registered
	await get_tree().create_timer(0.1).timeout

	# Get references to our systems
	map_system = ecs_manager.get_system("MapSystem")
	navigation_system = ecs_manager.get_system("NavigationSystem")

	if map_system == null:
		printerr("MapSystem not found!")
		return

	if navigation_system == null:
		printerr("NavigationSystem not found!")
		return

	# Create the player entity
	_create_player()

	# Load the demo map that was created by the setup script
	map_system.load_map("DemoMap")

func _create_player() -> void:
	# Create the player entity
	player_entity = ecs_manager.entity_manager.create_entity()

	# Add components to the player
	var transform_comp = TransformComponent.new(Vector3(2, 2, 0))  # Start at grid position (2, 2)
	ecs_manager.entity_manager.add_component(player_entity, "TransformComponent", transform_comp)

	var velocity_comp = VelocityComponent.new()
	ecs_manager.entity_manager.add_component(player_entity, "VelocityComponent", velocity_comp)

	var nav_comp = NavigationComponent.new(2.0)  # Speed of 2 units per second
	ecs_manager.entity_manager.add_component(player_entity, "NavigationComponent", nav_comp)

	# Create a visual representation for the player
	var player_sprite = Sprite2D.new()
	player_sprite.texture = load("res://icon.svg") if ResourceLoader.exists("res://icon.svg") else null
	player_sprite.position = Vector2(2 * 32, 2 * 32)  # Assuming 32x32 pixel tiles
	player_sprite.scale = Vector2(0.5, 0.5)  # Scale down the icon
	player_sprite.modulate = Color.YELLOW  # Make player yellow to distinguish from background
	add_child(player_sprite)

	# Subscribe to navigation events
	ecs_manager.event_bus.subscribe("navigation_completed", _on_navigation_completed)
	ecs_manager.event_bus.subscribe("entity_moved", _on_entity_moved)

func _input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		# Get click position in world coordinates
		var world_pos = get_global_mouse_position()

		# Convert to grid position (assuming 32x32 tiles)
		var grid_pos = Vector2(int(world_pos.x / 32), int(world_pos.y / 32))

		# Navigate player to clicked position
		if navigation_system != null:
			navigation_system.navigate_to_entity(player_entity, grid_pos)

func _on_navigation_completed(data: Dictionary) -> void:
	print("Navigation completed for entity: ", data.get("entity_id", 0))

func _on_entity_moved(data: Dictionary) -> void:
	var entity_id = data.get("entity_id", 0)
	var position = data.get("position", Vector2.ZERO)

	# Update player sprite position if this is our player
	if entity_id == player_entity:
		var player_sprite = get_child(2) as Sprite2D  # Player sprite is now the third child
		if player_sprite != null:
			player_sprite.position = Vector2(position.x * 32, position.y * 32)

func _process(delta: float) -> void:
	# Update player sprite position based on ECS TransformComponent
	if player_entity != 0 and ecs_manager != null:
		var transform: TransformComponent = ecs_manager.entity_manager.get_component(player_entity, "TransformComponent")
		if transform != null:
			var player_sprite = get_child(2) as Sprite2D  # Player sprite is now the third child
			if player_sprite != null:
				player_sprite.position = Vector2(transform.position.x * 32, transform.position.y * 32)