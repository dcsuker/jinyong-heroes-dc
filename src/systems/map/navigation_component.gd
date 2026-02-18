# navigation_component.gd
# Component for pathfinding and navigation abilities

class_name NavigationComponent extends Component

# Current destination for pathfinding
@export var destination: Vector2 = Vector2.ZERO

# Path to follow (array of waypoints)
var path: Array[Vector2] = []

# Movement speed along the path
@export var move_speed: float = 100.0

# Whether this entity is currently following a path
@export var following_path: bool = false

# Distance threshold for reaching destination
@export var arrival_distance: float = 1.0

# Pathfinding algorithm preference
@export var pathfinding_algorithm: String = "astar"

# Current waypoint index in the path
var current_waypoint_index: int = 0

# Constructor
func _init(p_move_speed: float = 100.0, p_arrival_distance: float = 1.0, p_algorithm: String = "astar") -> void:
	move_speed = p_move_speed
	arrival_distance = p_arrival_distance
	pathfinding_algorithm = p_algorithm

# Reset the navigation component
func reset() -> void:
	destination = Vector2.ZERO
	path.clear()
	following_path = false
	current_waypoint_index = 0