extends Node
class_name JinYongQuestGenerator

# Quest generator that creates quests based on Jin Yong's novels

# Define available quest templates
var quest_templates: Dictionary = {
	"escort": {
		"title_prefix": "护送",
		"title_suffix": "",
		"description_template": "护送%s安全抵达%s。",
		"objectives": [
			{"type": "escort", "text": "保护目标不受伤害", "target_count": 1}
		],
		"rewards": {"exp": 100, "gold": 50}
	},

	"gather_herb": {
		"title_prefix": "采集",
		"title_suffix": "草药",
		"description_template": "在%s地区寻找并采集珍贵的%s。",
		"objectives": [
			{"type": "collect", "text": "采集草药", "target_count": 3}
		],
		"rewards": {"exp": 75, "gold": 30, "item": "草药"}
	},

	"defeat_enemy": {
		"title_prefix": "除魔卫道：讨伐",
		"title_suffix": "",
		"description_template": "前往%s清除%s的威胁。",
		"objectives": [
			{"type": "defeat", "text": "击败敌人", "target_count": 5}
		],
		"rewards": {"exp": 150, "gold": 100}
	},

	"learn_skill": {
		"title_prefix": "求学问道：学习",
		"title_suffix": "",
		"description_template": "拜访%s，恳求传授%s绝技。",
		"objectives": [
			{"type": "talk", "text": "找到师父", "target_count": 1},
			{"type": "learn", "text": "完成试炼", "target_count": 1}
		],
		"rewards": {"exp": 200, "item": "武学秘籍"}
	},

	"retrieve_item": {
		"title_prefix": "寻回失落",
		"title_suffix": "",
		"description_template": "从%s取回失落已久的%s。",
		"objectives": [
			{"type": "explore", "text": "找到藏宝地点", "target_count": 1},
			{"type": "collect", "text": "取得物品", "target_count": 1}
		],
		"rewards": {"exp": 175, "item": "珍贵物品"}
	}
}

# Locations from Jin Yong's novels
var jin_yong_locations: Array[String] = [
	"襄阳城", "桃花岛", "光明顶", "少林寺", "武当山",
	"峨眉山", "华山", "灵鹫宫", "星宿海", "雪山寺",
	"大轮寺", "铁掌山", "黑龙潭", "红花会总舵", "苗疆"
]

# People from Jin Yong's novels
var jin_yong_characters: Array[String] = [
	"郭靖", "黄蓉", "杨过", "小龙女", "张无忌",
	"赵敏", "令狐冲", "任盈盈", "段誉", "王语嫣",
	"虚竹", "乔峰", "周伯通", "洪七公", "黄药师",
	"欧阳锋", "一灯大师", "丘处机", "成吉思汗"
]

# Herbs and items from Jin Yong's novels
var jin_yong_items: Array[String] = [
	"九花玉露丸", "天香续命膏", "断肠草", "雪参",
	"何首乌", "千年何首乌", "冰蚕", "朱睛冰蟾"
]

# Enemies and monsters from Jin Yong's novels
var jin_yong_enemies: Array[String] = [
	"蒙古兵", "鲜卑武士", "星宿派弟子", "简陋教众",
	"天鹰教徒", "血刀门僧人", "青海派弟子", "五毒教徒"
]

# Martial arts skills from Jin Yong's novels
var jin_yong_skills: Array[String] = [
	"降龙十八掌", "独孤九剑", "黯然销魂掌", "九阴真经",
	"九阳神功", "太极剑法", "凌波微步", "北冥神功",
	"吸星大法", "易筋经", "六脉神剑", "一阳指"
]


# Generate a random quest based on template
func generate_random_quest(template_type: String = "") -> Dictionary:
	var template_keys = quest_templates.keys()
	if template_type == "" or not quest_templates.has(template_type):
		template_type = template_keys[randi() % template_keys.size()]

	var template = quest_templates[template_type]

	# Generate quest details
	var location = jin_yong_locations[randi() % jin_yong_locations.size()]
	var character = jin_yong_characters[randi() % jin_yong_characters.size()]
	var item = jin_yong_items[randi() % jin_yong_items.size()]
	var enemy = jin_yong_enemies[randi() % jin_yong_enemies.size()]
	var skill = jin_yong_skills[randi() % jin_yong_skills.size()]

	# Choose random elements based on template
	var quest_details = {}
	match template_type:
		"escort":
			quest_details = {
				"title": template.title_prefix + character + template.title_suffix,
				"description": template.description_template % [character, location]
			}
		"gather_herb":
			quest_details = {
				"title": template.title_prefix + item + template.title_suffix,
				"description": template.description_template % [location, item]
			}
		"defeat_enemy":
			quest_details = {
				"title": template.title_prefix + enemy + template.title_suffix,
				"description": template.description_template % [location, enemy]
			}
		"learn_skill":
			quest_details = {
				"title": template.title_prefix + skill + template.title_suffix,
				"description": template.description_template % [location, skill]
			}
		"retrieve_item":
			quest_details = {
				"title": template.title_prefix + item + template.title_suffix,
				"description": template.description_template % [location, item]
			}

	# Create complete quest
	var quest = {
		"id": "quest_jinyong_%s_%d" % [template_type, Time.get_ticks_msec()],
		"title": quest_details.title,
		"description": quest_details.description,
		"objectives": template.objectives.duplicate(),
		"rewards": template.rewards.duplicate()
	}

	return quest


# Generate multiple quests of different types
func generate_multiple_quests(count: int) -> Array:
	var quests: Array = []
	for i in range(count):
		quests.append(generate_random_quest())
	return quests


# Generate a quest specifically for a character from Jin Yong's novels
func generate_character_specific_quest(character_name: String) -> Dictionary:
	# Create templates tailored for specific characters
	var character_templates: Dictionary = {
		"郭靖": {
			"title": "靖哥哥的请求",
			"description": "%s请求你帮助他保护襄阳城的安全。" % character_name,
			"objectives": [
				{"type": "defeat", "text": "击退蒙古军队", "target_count": 10},
				{"type": "defend", "text": "保卫城墙关键点", "target_count": 3}
			],
			"rewards": {"exp": 500, "gold": 200, "item": "兵法秘籍"}
		},
		"黄蓉": {
			"title": "蓉儿的计谋",
			"description": "%s需要你协助她破解一道精妙的机关谜题。" % character_name,
			"objectives": [
				{"type": "solve_puzzle", "text": "解开机关", "target_count": 1},
				{"type": "collect", "text": "获取材料", "target_count": 5}
			],
			"rewards": {"exp": 400, "gold": 150, "item": "桃花岛武功秘籍"}
		},
		"杨过": {
			"title": "神雕大侠的任务",
			"description": "%s委托你帮他寻找一株珍贵药材以治疗小龙女的寒毒。" % character_name,
			"objectives": [
				{"type": "explore", "text": "前往绝情谷", "target_count": 1},
				{"type": "collect", "text": "找到断肠草", "target_count": 1}
			],
			"rewards": {"exp": 600, "gold": 250, "item": "玄铁剑法"}
		},
		"令狐冲": {
			"title": "浪子回头",
			"description": "%s希望你能找到他的师傅风清扬，带回华山派的绝学。" % character_name,
			"objectives": [
				{"type": "talk", "text": "找到风清扬", "target_count": 1},
				{"type": "learn", "text": "学会独孤九剑入门", "target_count": 1}
			],
			"rewards": {"exp": 450, "gold": 180, "item": "独孤九剑前四式"}
		}
	}

	if character_templates.has(character_name):
		var template = character_templates[character_name]
		return {
			"id": "quest_char_%s_%d" % [character_name, Time.get_ticks_msec()],
			"title": template.title,
			"description": template.description,
			"objectives": template.objectives,
			"rewards": template.rewards
		}
	else:
		# Generate a generic quest if character is not in templates
		return generate_random_quest()


# Add a custom quest template
func add_custom_template(name: String, template: Dictionary) -> void:
	quest_templates[name] = template