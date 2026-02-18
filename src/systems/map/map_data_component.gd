# map_data_component.gd
# Component containing map-level data

class_name MapDataComponent extends Component

# Map dimensions
@export var width: int = 0
@export var height: int = 0

# Map name
@export var map_name: String = ""

# Map description
@export var description: String = ""

# Path to the tilemap resource
@export var tilemap_resource_path: String = ""

# Background color for the map
@export var background_color: Color = Color(0.1, 0.1, 0.1)

# Map tiles (grid of tile entity IDs)
var tile_entities: Array[int] = []

# Constructor
func _init(p_width: int = 10, p_height: int = 10, p_map_name: String = "NewMap", p_description: String = "") -> void:
	width = p_width
	height = p_height
	map_name = p_map_name
	description = p_description

	# Initialize the tile entities array
	tile_entities.resize(width * height)
	for i in range(tile_entities.size()):
		tile_entities[i] = 0  # Empty/invalid entity ID

# Helper to get the entity ID at a specific grid position
func get_tile_entity(grid_x: int, grid_y: int) -> int:
	if grid_x < 0 or grid_x >= width or grid_y < 0 or grid_y >= height:
		return 0  # Invalid position
	return tile_entities[grid_y * width + grid_x]

# Helper to set the entity ID at a specific grid position
func set_tile_entity(grid_x: int, grid_y: int, entity_id: int) -> void:
	if grid_x < 0 or grid_x >= width or grid_y < 0 or grid_y >= height:
		return  # Invalid position
	tile_entities[grid_y * width + grid_x] = entity_id

# Helper to convert world position to grid position
func world_to_grid(world_pos: Vector2) -> Vector2i:
	return Vector2i(int(world_pos.x), int(world_pos.y))

# Helper to convert grid position to world position
func grid_to_world(grid_pos: Vector2i) -> Vector2:
	return Vector2(float(grid_pos.x), float(grid_pos.y))