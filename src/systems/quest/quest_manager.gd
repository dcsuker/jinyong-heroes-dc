extends Node
class_name QuestManager

# Singleton to manage all quests in the game

var quest_system: QuestSystem
var quest_data_dir: String = "res://quests/"

func _ready() -> void:
	# Initialize the quest system
	quest_system = QuestSystem.new()
	self.add_child(quest_system)

	# Connect signals
	quest_system.quest_completed.connect(_on_quest_completed)
	quest_system.quest_updated.connect(_on_quest_updated)

	print("Quest Manager initialized")


# Load a specific quest by ID
func load_quest(quest_id: String) -> Dictionary:
	var file_path := quest_data_dir + quest_id + ".tres"
	if ResourceLoader.exists(file_path):
		var quest_resource = ResourceLoader.load(file_path)
		if quest_resource is QuestComponent:
			return {
				"title": quest_resource.quest_title,
				"description": quest_resource.quest_description,
				"objectives": quest_resource.quest_objectives,
				"rewards": quest_resource.quest_rewards
			}
	return {}


# Accept a quest by ID
func accept_quest_by_id(quest_id: String) -> void:
	var quest_data = load_quest(quest_id)
	if not quest_data.is_empty():
		quest_system.accept_quest(quest_id, quest_data)
		print("Started quest: %s" % quest_data.get("title", quest_id))


# Update a quest objective
func update_quest_objective(quest_id: String, objective_idx: int, increment: int = 1) -> void:
	quest_system.update_quest(quest_id, objective_idx, increment)


# Check if a quest is completed
func is_quest_completed(quest_id: String) -> bool:
	return quest_system.has_completed_quest(quest_id)


# Get all active quests
func get_active_quests() -> Dictionary:
	return quest_system.get_active_quests()


# Get all completed quests
func get_completed_quests() -> Dictionary:
	return quest_system.get_completed_quests()


# Handler when a quest is updated
func _on_quest_updated(quest_id: String) -> void:
	print("Quest updated: %s" % quest_id)
	# Emit event for UI updates


# Handler when a quest is completed
func _on_quest_completed(quest_id: String) -> void:
	print("Quest completed: %s" % quest_id)
	# Process rewards and emit event for UI updates
	var quest_data = quest_system.get_quest_status(quest_id)
	if not quest_data.is_empty():
		_process_quest_rewards(quest_data)


# Process rewards for completed quest
func _process_quest_rewards(quest_data: Dictionary) -> void:
	var rewards = quest_data.get("rewards", {})

	# Award experience
	if rewards.has("exp"):
		# In a real game, connect to player's experience system
		print("Awarded %d experience points" % rewards.exp)

	# Award gold/money
	if rewards.has("gold"):
		# In a real game, connect to player's inventory/economy system
		print("Awarded %d gold" % rewards.gold)

	# Award items
	if rewards.has("item"):
		# In a real game, connect to player's inventory system
		print("Awarded item: %s" % rewards.item)