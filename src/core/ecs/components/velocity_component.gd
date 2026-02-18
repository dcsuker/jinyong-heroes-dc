# velocity_component.gd
# Velocity and acceleration data

class_name VelocityComponent extends Component

@export var velocity: Vector3 = Vector3.ZERO
@export var acceleration: Vector3 = Vector3.ZERO
@export var max_speed: float = 10.0
@export var friction: float = 0.1

func _init(p_velocity: Vector3 = Vector3.ZERO, p_acceleration: Vector3 = Vector3.ZERO, p_max_speed: float = 10.0, p_friction: float = 0.1) -> void:
	velocity = p_velocity
	acceleration = p_acceleration
	max_speed = p_max_speed
	friction = p_friction
