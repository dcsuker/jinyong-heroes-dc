# transform_component.gd
# Position, rotation, and scale data

class_name TransformComponent extends Component

@export var position: Vector3 = Vector3.ZERO
@export var rotation: Vector3 = Vector3.ZERO
@export var scale: Vector3 = Vector3.ONE

func _init(p_position: Vector3 = Vector3.ZERO, p_rotation: Vector3 = Vector3.ZERO, p_scale: Vector3 = Vector3.ONE) -> void:
	position = p_position
	rotation = p_rotation
	scale = p_scale
