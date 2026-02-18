# Integration tests for the quest system and generator
extends Node

var TestHelper = preload("res://tests/helpers/test_helper.gd")

func _ready() -> void:
	run_all_tests()
	emit_signal("finished")

func run_all_tests() -> void:
	test_quest_system_with_generated_quests()
	test_complete_quest_workflow()
	test_global_quest_manager_integration()

	print("All integration tests completed!")

func test_quest_system_with_generated_quests() -> void:
	TestHelper.print_test_header("Quest System With Generated Quests")

	# Create both quest system and generator
	var quest_system = preload("res://src/systems/quest/quest_system.gd").new()
	var generator = preload("res://src/systems/quest/jin_yong_quest_generator.gd").new()

	# Generate a quest using the generator
	var generated_quest = generator.generate_random_quest()

	TestHelper.assert_false(generated_quest.is_empty(), "Should generate a valid quest")

	# Now try to add the generated quest to the quest system
	quest_system.accept_quest(generated_quest.id, generated_quest)

	TestHelper.assert_equal(quest_system.active_quests.size(), 1, "Should have one active quest after accepting generated quest")
	TestHelper.assert_true(quest_system.active_quests.has(generated_quest.id), "Should contain the generated quest ID")

	# Verify that the quest details were preserved correctly
	var stored_quest = quest_system.active_quests[generated_quest.id]
	TestHelper.assert_equal(stored_quest.title, generated_quest.title, "Stored quest title should match generated quest")
	TestHelper.assert_equal(stored_quest.description, generated_quest.description, "Stored quest description should match generated quest")
	TestHelper.assert_equal(stored_quest.rewards, generated_quest.rewards, "Stored quest rewards should match generated quest")
	TestHelper.assert_equal(stored_quest.objectives.size(), generated_quest.objectives.size(), "Stored quest objectives count should match")

	# Test that we can progress the generated quest through the system
	if stored_quest.objectives.size() > 0:
		# Try to update the first objective
		var initial_count = stored_quest.current_objectives[0].current_count
		quest_system.update_quest(generated_quest.id, 0, 1)

		# Check that the count was updated
		var updated_quest = quest_system.active_quests[generated_quest.id]
		var updated_objective = updated_quest.current_objectives[0]
		TestHelper.assert_equal(updated_objective.current_count, initial_count + 1, "Objective count should be incremented")

	TestHelper.print_test_footer("Quest System With Generated Quests")

func test_complete_quest_workflow() -> void:
	TestHelper.print_test_header("Complete Quest Workflow")

	# Test a complete workflow: generate quest -> accept quest -> progress quest -> complete quest
	var generator = preload("res://src/systems/quest/jin_yong_quest_generator.gd").new()
	var quest_system = preload("res://src/systems/quest/quest_system.gd").new()

	# Generate a simple quest (one objective with target count of 1)
	var simple_quest = {
		"id": "integration_test_simple",
		"title": "Integration Test Simple Quest",
		"description": "A simple quest for integration testing",
		"objectives": [
			{"type": "test", "text": "Complete test objective", "target_count": 1}
		],
		"rewards": {"exp": 150, "gold": 75}
	}

	# Initially, no quests in system
	TestHelper.assert_equal(quest_system.active_quests.size(), 0, "Should start with no active quests")
	TestHelper.assert_equal(quest_system.completed_quests.size(), 0, "Should start with no completed quests")

	# Accept the quest
	quest_system.accept_quest(simple_quest.id, simple_quest)

	TestHelper.assert_equal(quest_system.active_quests.size(), 1, "Should have one active quest after acceptance")
	TestHelper.assert_equal(quest_system.completed_quests.size(), 0, "Should still have no completed quests after acceptance")
	TestHelper.assert_true(quest_system.active_quests.has(simple_quest.id), "Should contain the test quest")

	# Progress the quest to completion
	quest_system.update_quest(simple_quest.id, 0, 1)  // Complete the single objective

	# Wait briefly for signals to process (simulated)
	await get_tree().create_timer(0.1).timeout

	# After completion
	TestHelper.assert_equal(quest_system.active_quests.size(), 0, "Should have no active quests after completion")
	TestHelper.assert_equal(quest_system.completed_quests.size(), 1, "Should have one completed quest after completion")
	TestHelper.assert_true(quest_system.completed_quests.has(simple_quest.id), "Should contain the completed test quest")

	# Verify the completed quest has all the original data
	var completed_quest = quest_system.completed_quests[simple_quest.id]
	TestHelper.assert_equal(completed_quest.title, simple_quest.title, "Completed quest should preserve title")
	TestHelper.assert_equal(completed_quest.description, simple_quest.description, "Completed quest should preserve description")
	TestHelper.assert_equal(completed_quest.rewards, simple_quest.rewards, "Completed quest should preserve rewards")
	TestHelper.assert_equal(completed_quest.objectives.size(), simple_quest.objectives.size(), "Completed quest should preserve objectives")

	# Test the status retrieval method
	var retrieved_status = quest_system.get_quest_status(simple_quest.id)
	TestHelper.assert_false(retrieved_status.is_empty(), "Should be able to retrieve completed quest status")
	TestHelper.assert_equal(retrieved_status.title, simple_quest.title, "Retrieved status should match completed quest")

	# Verify the quest is NOT in active anymore
	var active_status = quest_system.get_quest_status("nonexistent")
	TestHelper.assert_true(active_status.is_empty(), "Should return empty for nonexistent quests")

	TestHelper.print_test_footer("Complete Quest Workflow")

func test_global_quest_manager_integration() -> void:
	TestHelper.print_test_header("Global Quest Manager Integration")

	# Test the global quest manager that ties everything together
	var global_manager_script = preload("res://src/systems/quest/global_quest_manager.gd")
	var global_manager = global_manager_script.new()

	# Add to a temporary node so _ready gets called
	var temp_scene = Node.new()
	temp_scene.add_child(global_manager)
	global_manager._ready()

	TestHelper.assert_not_equal(global_manager.quest_manager, null, "Global manager should have initialized quest manager")
	TestHelper.assert_not_equal(global_manager.quest_manager.quest_system, null, "Global manager's quest manager should have initialized quest system")

	# Verify initial state
	TestHelper.assert_equal(global_manager.get_active_quests().size(), 0, "Should start with no active quests")
	TestHelper.assert_equal(global_manager.get_completed_quests().size(), 0, "Should start with no completed quests")

	# Load and start a predefined quest
	global_manager.accept_quest("tutorial_quest")

	TestHelper.assert_equal(global_manager.get_active_quests().size(), 1, "Should have one active quest after accepting")
	TestHelper.assert_true(global_manager.get_active_quests().has("quest_tutorial_001"), "Should contain tutorial quest")
	TestHelper.assert_equal(global_manager.get_completed_quests().size(), 0, "Should still have no completed quests")

	# Progress and complete the quest
	global_manager.update_quest("quest_tutorial_001", 0, 1)

	# Wait briefly for signals to process (simulated)
	await get_tree().create_timer(0.1).timeout

	# After completion
	TestHelper.assert_equal(global_manager.get_active_quests().size(), 0, "Should have no active quests after completion")
	TestHelper.assert_equal(global_manager.get_completed_quests().size(), 1, "Should have one completed quest after completion")
	TestHelper.assert_true(global_manager.is_quest_completed("quest_tutorial_001"), "Should report tutorial quest as completed")

	# Try to start another quest
	global_manager.accept_quest("she_diao_quest")

	TestHelper.assert_equal(global_manager.get_active_quests().size(), 1, "Should have one active quest after accepting She Diao")
	TestHelper.assert_equal(global_manager.get_completed_quests().size(), 1, "Should still have one completed quest")
	TestHelper.assert_true(global_manager.get_active_quests().has("quest_she_diao_001"), "Should contain She Diao quest")
	TestHelper.assert_false(global_manager.is_quest_completed("quest_she_diao_001"), "She Diao quest should not be completed yet")

	# Clean up by removing from scene tree
	temp_scene.remove_child(global_manager)

	TestHelper.print_test_footer("Global Quest Manager Integration")

signal finished