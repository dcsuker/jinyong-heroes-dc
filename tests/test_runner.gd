# Test Runner for Jin Yong Qunxia Zhuan Game
extends Node

var TestHelper = preload("res://tests/helpers/test_helper.gd")

func _ready() -> void:
	print("Starting Test Suite for Jin Yong Qunxia Zhuan Game")

	# Run all test suites
	await run_unit_tests()
	await run_integration_tests()

	print("\n=========================================")
	print("ALL TESTS COMPLETED")
	print("=========================================")

func run_unit_tests() -> void:
	print("\n=========================================")
	print("RUNNING UNIT TESTS")
	print("=========================================")

	# Run quest system unit tests
	print("\n--- Running Quest System Tests ---")
	var quest_system_test = preload("res://tests/unit/test_quest_system.gd").new()
	get_tree().root.add_child(quest_system_test)
	await quest_system_test.finished  # Wait for test to finish

	# Remove test node after completion
	get_tree().root.remove_child(quest_system_test)

	# Run quest manager unit tests
	print("\n--- Running Quest Manager Tests ---")
	var quest_manager_test = preload("res://tests/unit/test_quest_manager.gd").new()
	get_tree().root.add_child(quest_manager_test)
	await quest_manager_test.finished  # Wait for test to finish

	# Remove test node after completion
	get_tree().root.remove_child(quest_manager_test)

	# Run Jin Yong generator unit tests
	print("\n--- Running Jin Yong Generator Tests ---")
	var generator_test = preload("res://tests/unit/test_jin_yong_generator.gd").new()
	get_tree().root.add_child(generator_test)
	await generator_test.finished  # Wait for test to finish

	# Remove test node after completion
	get_tree().root.remove_child(generator_test)

func run_integration_tests() -> void:
	print("\n=========================================")
	print("RUNNING INTEGRATION TESTS")
	print("=========================================")

	# Run integration tests
	print("\n--- Running Quest System Integration Tests ---")
	var integration_test = preload("res://tests/integration/test_quest_system_integration.gd").new()
	get_tree().root.add_child(integration_test)
	await integration_test.finished  # Wait for test to finish

	# Remove test node after completion
	get_tree().root.remove_child(integration_test)

# Signal to indicate all tests in a suite are finished
signal tests_finished