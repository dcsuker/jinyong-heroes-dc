class_name SaveSystem
extends Node

## 存档系统 - 处理游戏存档和读档

const SAVE_PATH := "user://saves/"
const SAVE_FILE_PREFIX := "save_"

signal save_loaded(data: Dictionary)
signal save_saved(slot: int)
signal save_deleted(slot: int)

var current_save_data: Dictionary = {}

func _ready() -> void:
	_create_save_directory()

func _create_save_directory() -> void:
	var dir = DirAccess.open("user://")
	if not dir.dir_exists("saves"):
		dir.make_dir("saves")

func save_game(slot: int, data: Dictionary) -> bool:
	var file_path = _get_save_path(slot)
	var file = FileAccess.open(file_path, FileAccess.WRITE)

	if not file:
		push_error("无法创建存档文件：%s" % file_path)
		return false

	data["save_time"] = Time.get_datetime_string_from_system()
	data["slot"] = slot

	var json_string = JSON.stringify(data, "\t")
	file.store_string(json_string)
	file.close()

	current_save_data = data.duplicate()
	save_saved.emit(slot)
	print("游戏已保存到槽位 %d" % slot)
	return true

func load_game(slot: int) -> Dictionary:
	var file_path = _get_save_path(slot)

	if not FileAccess.file_exists(file_path):
		push_warning("存档文件不存在：槽位 %d" % slot)
		return {}

	var file = FileAccess.open(file_path, FileAccess.READ)
	var json_string = file.get_as_text()
	file.close()

	var data = JSON.parse_string(json_string)
	if data:
		current_save_data = data
		save_loaded.emit(data)
		print("游戏已从槽位 %d 加载" % slot)

	return data

func delete_save(slot: int) -> bool:
	var file_path = _get_save_path(slot)

	if FileAccess.file_exists(file_path):
		DirAccess.remove_absolute(file_path)
		save_deleted.emit(slot)
		print("存档已删除：槽位 %d" % slot)
		return true

	return false

func has_save(slot: int) -> bool:
	var file_path = _get_save_path(slot)
	return FileAccess.file_exists(file_path)

func get_save_info(slot: int) -> Dictionary:
	var file_path = _get_save_path(slot)

	if not FileAccess.file_exists(file_path):
		return {}

	var data = load_game(slot)
	return {
		"slot": slot,
		"save_time": data.get("save_time", "未知"),
		"play_time": data.get("play_time", 0),
		"character_name": data.get("player_data", {}).get("name", "未知"),
		"level": data.get("player_data", {}).get("level", 1)
	}

func get_all_saves() -> Array:
	var saves = []
	for i in range(1, 4):  # 支持 3 个存档槽
		if has_save(i):
			saves.append(get_save_info(i))
	return saves

func _get_save_path(slot: int) -> String:
	return SAVE_PATH + SAVE_FILE_PREFIX + str(slot) + ".json"

func get_current_data() -> Dictionary:
	return current_save_data.duplicate()
