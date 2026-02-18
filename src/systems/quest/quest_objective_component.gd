extends Resource
class_name QuestObjectiveComponent

# Data for a single quest objective

@export var objective_type: String  # "collect", "defeat", "talk", "explore", etc.
@export var objective_text: String  # Display text for the objective
@export var target_count: int = 1   # How many times objective needs to be completed
@export var current_count: int = 0  # Current progress toward target
@export var is_completed: bool = false
@export var objective_reference: String = ""  # ID or reference to specific target (item ID, NPC name, etc.)