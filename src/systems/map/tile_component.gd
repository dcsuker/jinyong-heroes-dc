# tile_component.gd
# Component representing a map tile with properties

class_name TileComponent extends Component

# Tile position in grid coordinates
@export var grid_position: Vector2i = Vector2i.ZERO

# Tile type (walkable, wall, etc.)
@export var tile_type: String = "floor"

# Walkable flag
@export var walkable: bool = true

# Cost for pathfinding algorithms
@export var movement_cost: float = 1.0

# Texture/resource for this tile
@export var tile_texture: Texture2D

# Constructor
func _init(p_grid_position: Vector2i = Vector2i.ZERO, p_tile_type: String = "floor", p_walkable: bool = true, p_movement_cost: float = 1.0) -> void:
	grid_position = p_grid_position
	tile_type = p_tile_type
	walkable = p_walkable
	movement_cost = p_movement_cost