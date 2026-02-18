# Unit tests for the Quest System
extends Node

var TestHelper = preload("res://tests/helpers/test_helper.gd")

func _ready() -> void:
	run_all_tests()
	emit_signal("finished")

func run_all_tests() -> void:
	test_quest_system_initialization()
	test_quest_acceptance()
	test_quest_completion()
	test_multiple_quests()

	print("All quest system unit tests completed!")

func test_quest_system_initialization() -> void:
	TestHelper.print_test_header("Quest System Initialization")

	var quest_system = preload("res://src/systems/quest/quest_system.gd").new()
	assert(quest_system != null, "Quest system should initialize successfully")

	TestHelper.assert_equal(quest_system.active_quests.size(), 0, "Active quests should be empty initially")
	TestHelper.assert_equal(quest_system.completed_quests.size(), 0, "Completed quests should be empty initially")

	TestHelper.print_test_footer("Quest System Initialization")

func test_quest_acceptance() -> void:
	TestHelper.print_test_header("Quest Acceptance")

	var quest_system = preload("res://src/systems/quest/quest_system.gd").new()

	var test_quest_data = {
		"title": "Test Quest",
		"description": "A test quest to verify the system",
		"objectives": [
			{"text": "Talk to NPC", "type": "talk", "target_count": 1}
		],
		"rewards": {"exp": 100, "gold": 50}
	}

	quest_system.accept_quest("test_quest_001", test_quest_data)

	TestHelper.assert_equal(quest_system.active_quests.size(), 1, "Should have one active quest after accepting")
	TestHelper.assert_true(quest_system.active_quests.has("test_quest_001"), "Active quests should contain the accepted quest")

	var stored_quest = quest_system.active_quests["test_quest_001"]
	TestHelper.assert_equal(stored_quest.title, "Test Quest", "Quest title should match")
	TestHelper.assert_equal(stored_quest.description, "A test quest to verify the system", "Quest description should match")
	TestHelper.assert_equal(stored_quest.current_objectives.size(), 1, "Quest should have one objective")

	var objective = stored_quest.current_objectives[0]
	TestHelper.assert_equal(objective.text, "Talk to NPC", "Objective text should match")
	TestHelper.assert_equal(objective.type, "talk", "Objective type should match")
	TestHelper.assert_equal(objective.target_count, 1, "Objective target count should match")
	TestHelper.assert_equal(objective.current_count, 0, "Objective current count should start at 0")
	TestHelper.assert_false(objective.completed, "Objective should not be completed initially")

	TestHelper.print_test_footer("Quest Acceptance")

func test_quest_completion() -> void:
	TestHelper.print_test_header("Quest Completion")

	var quest_system = preload("res://src/systems/quest/quest_system.gd").new()

	var test_quest_data = {
		"title": "Completion Test Quest",
		"description": "A test quest to verify completion logic",
		"objectives": [
			{"text": "Defeat Enemy", "type": "defeat", "target_count": 3}
		],
		"rewards": {"exp": 200, "item": "Sword"}
	}

	quest_system.accept_quest("test_quest_002", test_quest_data)

	# Initially, the quest should be in active quests and not completed
	TestHelper.assert_equal(quest_system.active_quests.size(), 1, "Should have one active quest")
	TestHelper.assert_equal(quest_system.completed_quests.size(), 0, "Should have zero completed quests initially")

	# Update the quest objective twice - should not complete yet
	quest_system.update_quest("test_quest_002", 0, 1)  # Count = 1
	quest_system.update_quest("test_quest_002", 0, 1)  # Count = 2

	var updated_quest = quest_system.active_quests["test_quest_002"]
	var updated_objective = updated_quest.current_objectives[0]
	TestHelper.assert_equal(updated_objective.current_count, 2, "Objective count should be 2 after two updates")
	TestHelper.assert_false(updated_objective.completed, "Objective should not be completed with 2/3 progress")
	TestHelper.assert_equal(quest_system.active_quests.size(), 1, "Quest should remain active with incomplete objectives")
	TestHelper.assert_equal(quest_system.completed_quests.size(), 0, "No quests should be completed yet")

	# Complete the objective - this should complete the entire quest
	quest_system.update_quest("test_quest_002", 0, 1)  # Count = 3, should complete

	# Wait briefly for signals to process (simulated)
	await get_tree().create_timer(0.1).timeout

	TestHelper.assert_equal(quest_system.active_quests.size(), 0, "Quest should move out of active quests after completion")
	TestHelper.assert_equal(quest_system.completed_quests.size(), 1, "Quest should be in completed quests after completion")
	TestHelper.assert_true(quest_system.completed_quests.has("test_quest_002"), "Completed quests should contain the finished quest")

	# Verify the completed quest data is preserved correctly
	var completed_quest = quest_system.completed_quests["test_quest_002"]
	TestHelper.assert_equal(completed_quest.title, "Completion Test Quest", "Completed quest title should match")
	TestHelper.assert_equal(completed_quest.rewards.exp, 200, "Completed quest rewards should be preserved")
	TestHelper.assert_equal(completed_quest.rewards.item, "Sword", "Completed quest item reward should be preserved")

	# The specific objective should be marked as completed
	var completed_objective = completed_quest.current_objectives[0]
	TestHelper.assert_true(completed_objective.completed, "Objective should be marked completed when quest completes")
	TestHelper.assert_equal(completed_objective.current_count, 3, "Objective count should be 3 when completed")

	TestHelper.print_test_footer("Quest Completion")

func test_multiple_quests() -> void:
	TestHelper.print_test_header("Multiple Quests")

	var quest_system = preload("res://src/systems/quest/quest_system.gd").new()

	# Add multiple quests
	var quest1_data = {
		"title": "First Quest",
		"description": "Test first quest",
		"objectives": [{"text": "Collect Item", "type": "collect", "target_count": 1}],
		"rewards": {"exp": 50}
	}

	var quest2_data = {
		"title": "Second Quest",
		"description": "Test second quest",
		"objectives": [{"text": "Defeat Monster", "type": "defeat", "target_count": 5}],
		"rewards": {"gold": 100}
	}

	quest_system.accept_quest("multi_quest_001", quest1_data)
	quest_system.accept_quest("multi_quest_002", quest2_data)

	TestHelper.assert_equal(quest_system.active_quests.size(), 2, "Should have two active quests")
	TestHelper.assert_true(quest_system.active_quests.has("multi_quest_001"), "Should contain first quest")
	TestHelper.assert_true(quest_system.active_quests.has("multi_quest_002"), "Should contain second quest")

	# Complete only one quest
	quest_system.update_quest("multi_quest_001", 0, 1)  # Complete first quest's objective

	# Wait briefly for signals to process (simulated)
	await get_tree().create_timer(0.1).timeout

	TestHelper.assert_equal(quest_system.active_quests.size(), 1, "Should have one active quest after completing one")
	TestHelper.assert_equal(quest_system.completed_quests.size(), 1, "Should have one completed quest after completing one")
	TestHelper.assert_true(quest_system.completed_quests.has("multi_quest_001"), "Should have first quest as completed")
	TestHelper.assert_true(quest_system.active_quests.has("multi_quest_002"), "Should still have second quest active")

	TestHelper.print_test_footer("Multiple Quests")

signal finished