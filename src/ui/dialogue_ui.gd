extends Control

## 对话 UI 界面

@onready var speaker_label: Label = $MarginContainer/VBoxContainer/SpeakerLabel
@onready var text_label: Label = $MarginContainer/VBoxContainer/TextLabel
@onready var choices_container: VBoxContainer = $MarginContainer/VBoxContainer/ChoicesContainer
@onready var next_indicator: Label = $MarginContainer/VBoxContainer/NextIndicator

var dialogue_manager: DialogueManager
var is_waiting_for_input: bool = false

func _ready() -> void:
	visible = false
	next_indicator.text = "[点击继续]"
	next_indicator.visible = false

func setup(dialogue_mgr: DialogueManager) -> void:
	dialogue_manager = dialogue_mgr

	if dialogue_manager:
		dialogue_manager.dialogue_started.connect(_on_dialogue_started)
		dialogue_manager.text_displayed.connect(_on_text_displayed)
		dialogue_manager.choices_available.connect(_on_choices_available)
		dialogue_manager.dialogue_ended.connect(_on_dialogue_ended)

func show_dialogue(speaker: String, text: String) -> void:
	visible = true
	speaker_label.text = speaker
	text_label.text = text
	is_waiting_for_input = true
	next_indicator.visible = true

func hide_dialogue() -> void:
	visible = false
	is_waiting_for_input = false
	next_indicator.visible = false
	_clear_choices()

func _clear_choices() -> void:
	for child in choices_container.get_children():
		child.queue_free()

func _on_dialogue_started(dialogue: DialogueData) -> void:
	pass

func _on_text_displayed(speaker: String, text: String) -> void:
	show_dialogue(speaker, text)

func _on_choices_available(choices: Array[Dictionary]) -> void:
	_clear_choices()
	next_indicator.visible = false

	for i in range(choices.size()):
		var choice = choices[i]
		var btn = Button.new()
		btn.text = choice.text
		btn.custom_minimum_size.x = 300
		btn.pressed.connect(_on_choice_selected.bind(i))
		choices_container.add_child(btn)

func _on_choice_selected(index: int) -> void:
	if dialogue_manager and is_waiting_for_input:
		dialogue_manager.select_choice(index)

func _on_dialogue_ended() -> void:
	hide_dialogue()

func _input(event: InputEvent) -> void:
	if not visible or not is_waiting_for_input:
		return

	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		# 检查是否点击在按钮上
		var mouse_pos = get_global_mouse_position()
		var over_button = false
		for child in choices_container.get_children():
			if child is Button and child.get_global_rect().has_point(mouse_pos):
				over_button = true
				break

		if not over_button and choices_container.get_child_count() == 0:
			if dialogue_manager:
				dialogue_manager.next_dialogue()

	if event is InputEventKey and event.pressed and event.keycode == KEY_SPACE:
		if dialogue_manager and choices_container.get_child_count() == 0:
			dialogue_manager.next_dialogue()
