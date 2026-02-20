class_name DialogueManager
extends Node

## 对话管理器

signal dialogue_started(dialogue: DialogueData)
signal dialogue_ended()
signal text_displayed(speaker: String, text: String)
signal choices_available(choices: Array[Dictionary])

var current_dialogue: DialogueData = null
var dialogue_tree: Dictionary = {}
var is_active: bool = false

var _current_id: String = ""

func _ready() -> void:
	pass

func load_dialogue_tree(tree: Dictionary) -> void:
	dialogue_tree = tree

func start_dialogue(start_id: String) -> void:
	if start_id not in dialogue_tree:
		push_error("Dialogue ID not found: %s" % start_id)
		return

	is_active = true
	_current_id = start_id
	_show_current_dialogue()

func _show_current_dialogue() -> void:
	var data = dialogue_tree.get(_current_id)
	if not data:
		end_dialogue()
		return

	current_dialogue = data
	dialogue_started.emit(data)
	text_displayed.emit(data.speaker, data.text)

	if data.choices.size() > 0:
		choices_available.emit(data.choices)

func select_choice(index: int) -> void:
	if not is_active:
		return

	var data = dialogue_tree.get(_current_id)
	if not data or index >= data.choices.size():
		return

	var choice = data.choices[index]

	# 检查条件
	if choice.has("condition") and not _check_condition(choice.condition):
		return

	# 执行选择
	if choice.has("next_id"):
		_current_id = choice.next_id
		_show_current_dialogue()

func next_dialogue() -> void:
	if not is_active:
		return

	var data = dialogue_tree.get(_current_id)
	if not data:
		end_dialogue()
		return

	if data.next_id != "":
		_current_id = data.next_id
		_show_current_dialogue()
	else:
		end_dialogue()

func end_dialogue() -> void:
	is_active = false
	current_dialogue = null
	_current_id = ""
	dialogue_ended.emit()

func _check_condition(condition: String) -> bool:
	# TODO: 实现条件检查逻辑
	# 例如：检查任务状态，物品，好感度等
	return true

func create_sample_dialogue() -> Dictionary:
	return {
		"start": {
			"id": "start",
			"speaker": "郭靖",
			"text": "你好，我是郭靖。请问你见过我的大师父吗？",
			"next_id": "",
			"choices": [
				{
					"text": "见过，他在嘉兴城里",
					"next_id": "seen"
				},
				{
					"text": "没见过",
					"next_id": "not_seen"
				}
			]
		},
		"seen": {
			"id": "seen",
			"speaker": "郭靖",
			"text": "多谢！我得赶紧去找他老人家。",
			"next_id": "",
			"choices": []
		},
		"not_seen": {
			"id": "not_seen",
			"speaker": "郭靖",
			"text": "这样啊...那我再去别处找找。",
			"next_id": "",
			"choices": []
		}
	}
