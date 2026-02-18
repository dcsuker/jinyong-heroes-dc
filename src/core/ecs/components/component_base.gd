# component_base.gd
# Base class for all ECS components

class_name Component extends Resource

## All components must inherit from this base class
## Components are pure data containers with no business logic
## Use @export fields for editor visibility

func _init() -> void:
	# Override in derived components
	pass
