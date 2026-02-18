extends Node
class_name QuestSystem

# Signal emitted when a quest is updated
signal quest_updated(quest_id: String)
# Signal emitted when a quest is completed
signal quest_completed(quest_id: String)

# Dictionary to store active quests
var active_quests: Dictionary = {}
# Dictionary to store completed quests
var completed_quests: Dictionary = {}

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	print("Quest system initialized")


# Accept a new quest
func accept_quest(quest_id: String, quest_data: Dictionary) -> void:
	if !active_quests.has(quest_id):
		active_quests[quest_id] = {
			"id": quest_id,
			"title": quest_data.get("title", "Unknown Quest"),
			"description": quest_data.get("description", ""),
			"objectives": quest_data.get("objectives", []),
			"rewards": quest_data.get("rewards", {}),
			"current_objectives": _init_objectives(quest_data.get("objectives", [])),
			"started_at": Time.get_ticks_msec()
		}
		print("Accepted quest: %s" % quest_id)


# Initialize objectives with completion status
func _init_objectives(objectives: Array) -> Array:
	var init_array: Array = []
	for obj in objectives:
		init_array.append({
			"text": obj.get("text", "Complete objective"),
			"type": obj.get("type", "generic"),
			"target_count": obj.get("target_count", 1),
			"current_count": 0,
			"completed": false
		})
	return init_array


# Update a quest objective
func update_quest(quest_id: String, objective_idx: int, increment: int = 1) -> void:
	if active_quests.has(quest_id):
		var quest = active_quests[quest_id]
		if objective_idx < quest.current_objectives.size():
			var objective = quest.current_objectives[objective_idx]

			objective.current_count = min(objective.current_count + increment, objective.target_count)

			if objective.current_count >= objective.target_count:
				objective.completed = true

			quest_updated.emit(quest_id)

			# Check if all objectives are completed
			if _are_all_objectives_complete(quest):
				complete_quest(quest_id)


# Check if all objectives in a quest are complete
func _are_all_objectives_complete(quest: Dictionary) -> bool:
	for objective in quest.current_objectives:
		if not objective.completed:
			return false
	return true


# Complete a quest
func complete_quest(quest_id: String) -> void:
	if active_quests.has(quest_id):
		var quest = active_quests[quest_id]

		# Move quest to completed quests
		completed_quests[quest_id] = quest
		active_quests.erase(quest_id)

		quest_completed.emit(quest_id)
		print("Completed quest: %s" % quest_id)


# Get status of a quest
func get_quest_status(quest_id: String) -> Dictionary:
	if active_quests.has(quest_id):
		return active_quests[quest_id]
	elif completed_quests.has(quest_id):
		return completed_quests[quest_id]
	else:
		return {}


# Get all active quests
func get_active_quests() -> Dictionary:
	return active_quests


# Get all completed quests
func get_completed_quests() -> Dictionary:
	return completed_quests


# Check if player has completed a specific quest
func has_completed_quest(quest_id: String) -> bool:
	return completed_quests.has(quest_id)