class_name NPCComponent
extends Area2D

## NPC 组件 - 处理 NPC 的交互和对话

@export var npc_name: String = "NPC"
@export var npc_id: String = "npc_001"
@export var dialogue_tree: Dictionary = {}
@export var quest_giver: bool = false
@export var available_quests: Array[String] = []
@export var sprite_texture: Texture2D

var is_interactable: bool = true
var player_nearby: bool = false

signal player_entered(npc: NPCComponent)
signal player_exited(npc: NPCComponent)

func _ready() -> void:
	_setup_collision()
	_setup_sprite()

func _setup_collision() -> void:
	if get_node("CollisionShape2D") == null:
		var collision = CollisionShape2D.new()
		collision.name = "CollisionShape2D"
		var shape = CircleShape2D.new()
		shape.radius = 30
		collision.shape = shape
		add_child(collision)

func _setup_sprite() -> void:
	if get_node("Sprite2D") == null:
		var sprite = Sprite2D.new()
		sprite.name = "Sprite2D"
		sprite.scale = Vector2(2, 2)

		if sprite_texture:
			sprite.texture = sprite_texture
		else:
			# 创建占位符纹理
			var image = Image.create(16, 16, false, Image.FORMAT_RGBA8)
			image.fill(Color(0.8, 0.6, 0.2, 1.0))
			sprite.texture = ImageTexture.create_from_image(image)

		add_child(sprite)

func _on_area_entered(area: Area2D) -> void:
	if area.is_in_group("player"):
		player_nearby = true
		player_entered.emit(self)

func _on_area_exited(area: Area2D) -> void:
	if area.is_in_group("player"):
		player_nearby = false
		player_exited.emit(self)

func get_npc_data() -> Dictionary:
	return {
		"id": npc_id,
		"name": npc_name,
		"position": global_position,
		"dialogue_tree": dialogue_tree,
		"quest_giver": quest_giver,
		"available_quests": available_quests
	}

func start_dialogue() -> Dictionary:
	return dialogue_tree
