class_name GameCharacter
extends Node2D

## 游戏角色 - 地图上的角色实体

@export var character_name: String
@export var character_id: int
@export var sprite_texture: Texture2D
@export var move_speed: float = 150.0

var target_position: Vector2 = Vector2.ZERO
var is_moving: bool = false
var current_map: Node2D = null

signal arrived_at_position()
signal talked_to(character: GameCharacter)

func _ready() -> void:
	target_position = global_position

func _process(delta: float) -> void:
	if is_moving:
		var direction = (target_position - global_position).normalized()
		var distance = global_position.distance_to(target_position)

		if distance < 5.0:
			global_position = target_position
			is_moving = false
			arrived_at_position.emit()
		else:
			global_position += direction * move_speed * delta

func move_to(position: Vector2) -> void:
	target_position = position
	is_moving = true

func stop() -> void:
	is_moving = false
	target_position = global_position

func setup(name: String, id: int) -> void:
	character_name = name
	character_id = id

func get_data() -> Dictionary:
	return {
		"id": character_id,
		"name": character_name,
		"position": global_position,
		"is_moving": is_moving
	}
