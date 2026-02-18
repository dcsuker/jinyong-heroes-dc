extends Node

# Global Quest Manager autoload

var quest_manager: QuestManager

func _ready() -> void:
	quest_manager = preload("res://src/systems/quest/quest_manager.gd").new()
	quest_manager.name = "QuestManager"
	self.add_child(quest_manager)
	print("Global Quest Manager loaded")


# Helper methods for easy access to quest functionality
func accept_quest(quest_id: String) -> void:
	quest_manager.accept_quest_by_id(quest_id)

func update_quest(quest_id: String, objective_idx: int, increment: int = 1) -> void:
	quest_manager.update_quest_objective(quest_id, objective_idx, increment)

func is_quest_completed(quest_id: String) -> bool:
	return quest_manager.is_quest_completed(quest_id)

func get_active_quests() -> Dictionary:
	return quest_manager.get_active_quests()

func get_completed_quests() -> Dictionary:
	return quest_manager.get_completed_quests()