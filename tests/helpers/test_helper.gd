# Base test helper functions for the Jin Yong Qunxia Zhuan game
extends Node

# Test assertion functions
static func assert_true(condition: bool, message: String = "") -> void:
	if not condition:
		push_error("ASSERTION FAILED: " + message)
		print("ASSERTION FAILED: " + message)
	else:
		print("ASSERTION PASSED: " + message)

static func assert_false(condition: bool, message: String = "") -> void:
	if condition:
		push_error("ASSERTION FAILED: " + message)
		print("ASSERTION FAILED: " + message)
	else:
		print("ASSERTION PASSED: " + message)

static func assert_equal(actual, expected, message: String = "") -> void:
	if actual != expected:
		push_error("ASSERTION FAILED: " + message + " (Expected: " + str(expected) + ", Got: " + str(actual) + ")")
		print("ASSERTION FAILED: " + message + " (Expected: " + str(expected) + ", Got: " + str(actual) + ")")
	else:
		print("ASSERTION PASSED: " + message)

static func assert_not_equal(actual, expected, message: String = "") -> void:
	if actual == expected:
		push_error("ASSERTION FAILED: " + message + " (Values should not be equal: " + str(expected) + ")")
		print("ASSERTION FAILED: " + message + " (Values should not be equal: " + str(expected) + ")")
	else:
		print("ASSERTION PASSED: " + message)

static func assert_greater(value: float, threshold: float, message: String = "") -> void:
	if value <= threshold:
		push_error("ASSERTION FAILED: " + message + " (Value: " + str(value) + " should be greater than " + str(threshold) + ")")
		print("ASSERTION FAILED: " + message + " (Value: " + str(value) + " should be greater than " + str(threshold) + ")")
	else:
		print("ASSERTION PASSED: " + message)

static func assert_less(value: float, threshold: float, message: String = "") -> void:
	if value >= threshold:
		push_error("ASSERTION FAILED: " + message + " (Value: " + str(value) + " should be less than " + str(threshold) + ")")
		print("ASSERTION FAILED: " + message + " (Value: " + str(value) + " should be less than " + str(threshold) + ")")
	else:
		print("ASSERTION PASSED: " + message)

static func print_test_header(test_name: String) -> void:
	print("\n=========================================")
	print("RUNNING TEST: " + test_name)
	print("=========================================")

static func print_test_footer(test_name: String) -> void:
	print("=========================================")
	print("TEST COMPLETED: " + test_name)
	print("=========================================\n")

# Utility function to simulate waiting in tests
static func simulate_wait(duration: float) -> void:
	# In a real test scenario, we might use a coroutine approach
	# For now, we'll just simulate the passage of time
	print("Simulated wait for " + str(duration) + " seconds")