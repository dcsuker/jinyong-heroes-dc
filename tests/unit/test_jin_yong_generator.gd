# Unit tests for the Jin Yong Quest Generator
extends Node

var TestHelper = preload("res://tests/helpers/test_helper.gd")

func _ready() -> void:
	run_all_tests()
	emit_signal("finished")

func run_all_tests() -> void:
	test_jin_yong_generator_initialization()
	test_generate_random_quest()
	test_generate_character_specific_quest()
	test_generate_multiple_quests()

	print("All Jin Yong quest generator tests completed!")

func test_jin_yong_generator_initialization() -> void:
	TestHelper.print_test_header("Jin Yong Quest Generator Initialization")

	var generator = preload("res://src/systems/quest/jin_yong_quest_generator.gd").new()

	TestHelper.assert_not_equal(generator.quest_templates.size(), 0, "Should have quest templates initialized")
	TestHelper.assert_true(generator.quest_templates.has("escort"), "Should have escort template")
	TestHelper.assert_true(generator.quest_templates.has("gather_herb"), "Should have gather_herb template")
	TestHelper.assert_true(generator.quest_templates.has("defeat_enemy"), "Should have defeat_enemy template")
	TestHelper.assert_true(generator.quest_templates.has("learn_skill"), "Should have learn_skill template")
	TestHelper.assert_true(generator.quest_templates.has("retrieve_item"), "Should have retrieve_item template")

	TestHelper.assert_not_equal(generator.jin_yong_locations.size(), 0, "Should have Jin Yong locations")
	TestHelper.assert_not_equal(generator.jin_yong_characters.size(), 0, "Should have Jin Yong characters")
	TestHelper.assert_not_equal(generator.jin_yong_items.size(), 0, "Should have Jin Yong items")
	TestHelper.assert_not_equal(generator.jin_yong_enemies.size(), 0, "Should have Jin Yong enemies")
	TestHelper.assert_not_equal(generator.jin_yong_skills.size(), 0, "Should have Jin Yong skills")

	TestHelper.print_test_footer("Jin Yong Quest Generator Initialization")

func test_generate_random_quest() -> void:
	TestHelper.print_test_header("Generate Random Quest")

	var generator = preload("res://src/systems/quest/jin_yong_quest_generator.gd").new()

	# Generate a random quest without specifying template
	var random_quest = generator.generate_random_quest()

	TestHelper.assert_false(random_quest.is_empty(), "Should generate a valid quest")
	TestHelper.assert_true(random_quest.has("id"), "Generated quest should have an ID")
	TestHelper.assert_true(random_quest.has("title"), "Generated quest should have a title")
	TestHelper.assert_true(random_quest.has("description"), "Generated quest should have a description")
	TestHelper.assert_true(random_quest.has("objectives"), "Generated quest should have objectives")
	TestHelper.assert_true(random_quest.has("rewards"), "Generated quest should have rewards")

	TestHelper.assert_greater(random_quest.id.length(), 0, "Generated quest ID should not be empty")
	TestHelper.assert_greater(random_quest.title.length(), 0, "Generated quest title should not be empty")
	TestHelper.assert_greater(random_quest.description.length(), 0, "Generated quest description should not be empty")
	TestHelper.assert_not_equal(random_quest.objectives.size(), 0, "Generated quest should have at least one objective")

	# Generate a specific type of quest
	var escort_quest = generator.generate_random_quest("escort")
	TestHelper.assert_false(escort_quest.is_empty(), "Should generate a valid escort quest")
	TestHelper.assert_true(escort_quest.title.begins_with("护送"), "Escort quest should begin with '护送'")
	TestHelper.assert_not_equal(escort_quest.objectives.size(), 0, "Escort quest should have objectives")

	# Generate another specific type
	var herb_quest = generator.generate_random_quest("gather_herb")
	TestHelper.assert_false(herb_quest.is_empty(), "Should generate a valid herb quest")
	TestHelper.assert_true(herb_quest.title.ends_with("草药"), "Herb quest should end with '草药'")
	TestHelper.assert_not_equal(herb_quest.objectives.size(), 0, "Herb quest should have objectives")

	# Verify objective structure
	for objective in herb_quest.objectives:
		TestHelper.assert_true(objective.has("type"), "Objective should have type")
		TestHelper.assert_true(objective.has("text"), "Objective should have text")
		TestHelper.assert_true(objective.has("target_count"), "Objective should have target count")

	TestHelper.print_test_footer("Generate Random Quest")

func test_generate_character_specific_quest() -> void:
	TestHelper.print_test_header("Generate Character Specific Quest")

	var generator = preload("res://src/systems/quest/jin_yong_quest_generator.gd").new()

	# Test generating quests for known characters
	var guo_jing_quest = generator.generate_character_specific_quest("郭靖")
	TestHelper.assert_false(guo_jing_quest.is_empty(), "Should generate a valid郭靖 quest")
	TestHelper.assert_true(guo_jing_quest.title.begins_with("靖哥哥的请求"), "Guo Jing quest should start with expected title")
	TestHelper.assert_not_equal(guo_jing_quest.objectives.size(), 0, "Guo Jing quest should have objectives")

	var huang_rong_quest = generator.generate_character_specific_quest("黄蓉")
	TestHelper.assert_false(huang_rong_quest.is_empty(), "Should generate a valid 黄蓉 quest")
	TestHelper.assert_true(huang_rong_quest.title.begins_with("蓉儿的计谋"), "Huang Rong quest should start with expected title")
	TestHelper.assert_not_equal(huang_rong_quest.objectives.size(), 0, "Huang Rong quest should have objectives")

	var yang_guo_quest = generator.generate_character_specific_quest("杨过")
	TestHelper.assert_false(yang_guo_quest.is_empty(), "Should generate a valid 杨过 quest")
	TestHelper.assert_true(yang_guo_quest.title.begins_with("神雕大侠的任务"), "Yang Guo quest should start with expected title")
	TestHelper.assert_not_equal(yang_guo_quest.objectives.size(), 0, "Yang Guo quest should have objectives")

	var linghu_chong_quest = generator.generate_character_specific_quest("令狐冲")
	TestHelper.assert_false(linghu_chong_quest.is_empty(), "Should generate a valid 令狐冲 quest")
	TestHelper.assert_true(linghu_chong_quest.title.begins_with("浪子回头"), "Linghu Chong quest should start with expected title")
	TestHelper.assert_not_equal(linghu_chong_quest.objectives.size(), 0, "Linghu Chong quest should have objectives")

	# Test generating quest for unknown character (should fallback to random)
	var unknown_quest = generator.generate_character_specific_quest("Unknown Character")
	TestHelper.assert_false(unknown_quest.is_empty(), "Should generate a fallback quest for unknown character")
	TestHelper.assert_greater(unknown_quest.title.length(), 0, "Unknown character quest should have a title")

	TestHelper.print_test_footer("Generate Character Specific Quest")

func test_generate_multiple_quests() -> void:
	TestHelper.print_test_header("Generate Multiple Quests")

	var generator = preload("res://src/systems/quest/jin_yong_quest_generator.gd").new()

	# Generate multiple quests
	var quests = generator.generate_multiple_quests(5)

	TestHelper.assert_equal(quests.size(), 5, "Should generate 5 quests")

	# Verify each quest is valid
	for i in range(quests.size()):
		var quest = quests[i]
		TestHelper.assert_false(quest.is_empty(), "Each generated quest should be valid")
		TestHelper.assert_true(quest.has("id"), "Each quest should have an ID")
		TestHelper.assert_true(quest.has("title"), "Each quest should have a title")
		TestHelper.assert_not_equal(quest.title.length(), 0, "Each quest title should not be empty")

		# Verify IDs are unique
		for j in range(i + 1, quests.size()):
			TestHelper.assert_not_equal(quest.id, quests[j].id, "Quest IDs should be unique")

	TestHelper.print_test_footer("Generate Multiple Quests")

signal finished