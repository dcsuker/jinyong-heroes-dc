# Unit tests for the Quest Manager
extends Node

var TestHelper = preload("res://tests/helpers/test_helper.gd")

func _ready() -> void:
	run_all_tests()
	emit_signal("finished")

func run_all_tests() -> void:
	test_quest_manager_initialization()
	test_load_quest_from_resource()
	test_quest_manager_workflow()

	print("All quest manager unit tests completed!")

func test_quest_manager_initialization() -> void:
	TestHelper.print_test_header("Quest Manager Initialization")

	var quest_manager = preload("res://src/systems/quest/quest_manager.gd").new()

	# We need to manually add to scene tree for _ready to execute
	var temp_node = Node.new()
	temp_node.add_child(quest_manager)
	quest_manager._ready()

	TestHelper.assert_not_equal(quest_manager.quest_system, null, "Quest manager should initialize quest system")
	TestHelper.assert_equal(quest_manager.quest_data_dir, "res://quests/", "Quest data dir should be set correctly")

	TestHelper.print_test_footer("Quest Manager Initialization")

func test_load_quest_from_resource() -> void:
	TestHelper.print_test_header("Load Quest From Resource")

	var quest_manager = preload("res://src/systems/quest/quest_manager.gd").new()
	var temp_node = Node.new()
	temp_node.add_child(quest_manager)
	quest_manager._ready()

	# Test loading the tutorial quest
	var quest_data = quest_manager.load_quest("tutorial_quest")

	TestHelper.assert_false(quest_data.is_empty(), "Should successfully load tutorial quest data")
	TestHelper.assert_equal(quest_data.get("title", ""), "初入江湖", "Tutorial quest title should match")
	TestHelper.assert_equal(quest_data.get("description", ""), "刚刚踏入武林，先熟悉一下周围环境，向村里的长者问好。", "Tutorial quest description should match")
	TestHelper.assert_equal(quest_data.get("objectives", []).size(), 1, "Tutorial quest should have one objective")
	TestHelper.assert_equal(quest_data.get("objectives", [])[0], "与村长对话", "Tutorial quest objective should match")

	# Check rewards dictionary
	var rewards = quest_data.get("rewards", {})
	TestHelper.assert_equal(rewards.get("exp", 0), 50, "Tutorial quest exp reward should be 50")
	TestHelper.assert_equal(rewards.get("gold", 0), 20, "Tutorial quest gold reward should be 20")

	# Test loading the She Diao quest
	var she_diao_data = quest_manager.load_quest("she_diao_quest")

	TestHelper.assert_false(she_diao_data.is_empty(), "Should successfully load She Diao quest data")
	TestHelper.assert_equal(she_diao_data.get("title", ""), "射雕英雄传：寻访江南七怪", "She Diao quest title should match")
	TestHelper.assert_equal(she_diao_data.get("description", ""), "在蒙古大漠中寻找传说中的江南七怪，学习基本的武功心法。", "She Diao quest description should match")
	TestHelper.assert_equal(she_diao_data.get("objectives", []).size(), 3, "She Diao quest should have three objectives")

	# Check objectives
	var objectives = she_diao_data.get("objectives", [])
	TestHelper.assert_equal(objectives[0], "找到柯镇恶", "First She Diao objective should match")
	TestHelper.assert_equal(objectives[1], "击败练习靶子3次", "Second She Diao objective should match")
	TestHelper.assert_equal(objectives[2], "收集疗伤草药2株", "Third She Diao objective should match")

	# Check She Diao rewards
	var she_diao_rewards = she_diao_data.get("rewards", {})
	TestHelper.assert_equal(she_diao_rewards.get("exp", 0), 200, "She Diao quest exp reward should be 200")
	TestHelper.assert_equal(she_diao_rewards.get("gold", 0), 100, "She Diao quest gold reward should be 100")
	TestHelper.assert_equal(she_diao_rewards.get("item", ""), "基础拳法秘籍", "She Diao quest item reward should match")

	# Test loading a non-existent quest (should return empty dict)
	var invalid_quest = quest_manager.load_quest("non_existent_quest")
	TestHelper.assert_true(invalid_quest.is_empty(), "Loading non-existent quest should return empty dictionary")

	TestHelper.print_test_footer("Load Quest From Resource")

func test_quest_manager_workflow() -> void:
	TestHelper.print_test_header("Quest Manager Workflow")

	var quest_manager = preload("res://src/systems/quest/quest_manager.gd").new()
	var temp_node = Node.new()
	temp_node.add_child(quest_manager)
	quest_manager._ready()

	# Start with no active or completed quests
	TestHelper.assert_equal(quest_manager.get_active_quests().size(), 0, "Should start with no active quests")
	TestHelper.assert_equal(quest_manager.get_completed_quests().size(), 0, "Should start with no completed quests")

	# Load and accept the tutorial quest
	quest_manager.accept_quest_by_id("tutorial_quest")

	TestHelper.assert_equal(quest_manager.get_active_quests().size(), 1, "Should have one active quest after accepting")
	TestHelper.assert_equal(quest_manager.get_completed_quests().size(), 0, "Should still have no completed quests after accepting")

	# Update the quest to completion
	quest_manager.update_quest_objective("quest_tutorial_001", 0, 1)  # Complete the tutorial quest

	# Wait briefly for signals to process (simulated)
	await get_tree().create_timer(0.1).timeout

	TestHelper.assert_equal(quest_manager.get_active_quests().size(), 0, "Should have no active quests after completion")
	TestHelper.assert_equal(quest_manager.get_completed_quests().size(), 1, "Should have one completed quest after completion")
	TestHelper.assert_true(quest_manager.is_quest_completed("quest_tutorial_001"), "Should report tutorial quest as completed")
	TestHelper.assert_false(quest_manager.is_quest_completed("some_other_quest"), "Should not report unrelated quest as completed")

	TestHelper.print_test_footer("Quest Manager Workflow")

signal finished