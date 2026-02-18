# collision_component.gd
# Component representing collision properties for map entities

class_name CollisionComponent extends Component

# Collision shape type (circle, rectangle, polygon, etc.)
@export var shape_type: String = "rectangle"

# Collision bounds/shape data
@export var collision_shape: Variant

# Whether this entity collides with others
@export var collides: bool = true

# Collision layer bitmask
@export var collision_layer: int = 1

# Collision mask bitmask
@export var collision_mask: int = 1

# Is this a trigger (doesn't block movement but triggers events)
@export var is_trigger: bool = false

# Constructor
func _init(p_shape_type: String = "rectangle", p_collides: bool = true, p_collision_layer: int = 1, p_collision_mask: int = 1, p_is_trigger: bool = false) -> void:
	shape_type = p_shape_type
	collides = p_collides
	collision_layer = p_collision_layer
	collision_mask = p_collision_mask
	is_trigger = p_is_trigger