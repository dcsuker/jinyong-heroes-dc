# name_component.gd
# Entity name and display data

class_name NameComponent extends Component

@export var name: String = ""
@export var display_name: String = ""
@export var title: String = ""

func _init(p_name: String = "", p_display_name: String = "", p_title: String = "") -> void:
	name = p_name
	display_name = p_display_name if not p_display_name.is_empty() else p_name
	title = p_title

func get_full_name() -> String:
	if title.is_empty():
		return display_name
	return "%s %s" % [title, display_name]
