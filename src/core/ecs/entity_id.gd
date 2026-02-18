# entity_id.gd
# Unique identifier wrapper for ECS entities

class_name EntityID extends Resource

var _id: int

func _init(p_id: int = 0) -> void:
	_id = p_id

func get_id() -> int:
	return _id

func is_valid() -> bool:
	return _id > 0

func to_string() -> String:
	return "EntityID(%d)" % __id
