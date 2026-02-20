class_name DialogueData
extends Resource

## 对话数据结构

@export var id: String
@export var speaker: String
@export var text: String
@export var next_id: String = ""
@export var choices: Array[Dictionary] = []  # [{text, next_id, condition}]
@export var conditions: Array[String] = []  # 触发条件
@export var rewards: Dictionary = {}  # 对话完成后的奖励
