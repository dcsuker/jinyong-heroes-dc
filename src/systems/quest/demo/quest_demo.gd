extends Control

@onready var quest_log_label = $QuestLogLabel
@onready var active_quests_label = $ActiveQuestsLabel
@onready var quest_buttons_vbox = $QuestButtonsVBox

var quest_manager: QuestManager

func _ready() -> void:
	# Find the quest manager in the scene
	quest_manager = get_node("/root/QuestManager")

	if quest_manager != null:
		update_quest_display()
		setup_quest_demo_buttons()
	else:
		quest_log_label.text = "Error: Quest Manager not found!"


func setup_quest_demo_buttons() -> void:
	# Clear existing buttons
	for child in quest_buttons_vbox.get_children():
		child.queue_free()

	# Create buttons for different demo quests
	var tutorial_quest_btn = Button.new()
	tutorial_quest_btn.text = "Start Tutorial Quest"
	tutorial_quest_btn.pressed.connect(func(): start_quest("tutorial_quest"))
	quest_buttons_vbox.add_child(tutorial_quest_btn)

	var she_diao_quest_btn = Button.new()
	she_diao_quest_btn.text = "Start She Diao Quest"
	she_diao_quest_btn.pressed.connect(func(): start_quest("she_diao_quest"))
	quest_buttons_vbox.add_child(she_diao_quest_btn)

	var update_quest_btn = Button.new()
	update_quest_btn.text = "Update Current Quest"
	update_quest_btn.pressed.connect(update_current_quest)
	quest_buttons_vbox.add_child(update_quest_btn)


func start_quest(quest_id: String) -> void:
	quest_manager.accept_quest(quest_id)
	update_quest_display()


func update_current_quest() -> void:
	var active_quests = quest_manager.get_active_quests()
	if not active_quests.is_empty():
		var first_quest_id = active_quests.keys()[0]
		quest_manager.update_quest(first_quest_id, 0)  # Update first objective
		update_quest_display()


func update_quest_display() -> void:
	var active_quests = quest_manager.get_active_quests()
	var completed_quests = quest_manager.get_completed_quests()

	var active_text = "Active Quests:\n"
	if active_quests.is_empty():
		active_text += "None\n"
	else:
		for quest_id in active_quests.keys():
			var quest = active_quests[quest_id]
			active_text += "- %s: %s\n" % [quest.title, quest.description]

			# Show objectives
			for i in range(quest.current_objectives.size()):
				var obj = quest.current_objectives[i]
				var status = "[%s/%s] %s" % [obj.current_count, obj.target_count, obj.text]
				if obj.completed:
					status = "✓ " + status
				else:
					status = "○ " + status
				active_text += "  %s\n" % status

	active_quests_label.text = active_text

	var completed_text = "Completed Quests:\n"
	if completed_quests.is_empty():
		completed_text += "None\n"
	else:
		for quest_id in completed_quests.keys():
			var quest = completed_quests[quest_id]
			completed_text += "- %s: Completed!\n" % quest.title

	quest_log_label.text = completed_text