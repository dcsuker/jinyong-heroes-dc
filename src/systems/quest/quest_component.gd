extends Resource
class_name QuestComponent

# Data for a single quest component

@export var quest_id: String
@export var quest_title: String
@export var quest_description: String
@export var quest_objectives: Array[String]
@export var quest_rewards: Dictionary
@export var is_active: bool = true
@export var is_completed: bool = false
@export var current_objective_index: int = 0
@export var quest_progress: float = 0.0