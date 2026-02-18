# event_bus.gd
# Decoupled event-driven communication system

class_name EventBus extends Node

# Event queue for deferred processing
var _event_queue: Array[Dictionary] = []
var _is_processing_queue: bool = false

# Event listeners: maps event_name -> array of Callable
var _listeners: Dictionary = {}

signal event_emitted(event_name: String, event_data: Dictionary)

## Registers a listener for a specific event
func subscribe(event_name: String, listener: Callable) -> void:
	if not _listeners.has(event_name):
		_listeners[event_name] = []

	_listeners[event_name].append(listener)

## Unregisters a listener from a specific event
func unsubscribe(event_name: String, listener: Callable) -> void:
	if not _listeners.has(event_name):
		return

	var index = _listeners[event_name].find(listener)
	if index >= 0:
		_listeners[event_name].remove_at(index)

## Emits an event immediately to all listeners
## Returns: number of listeners notified
func emit(event_name: String, event_data: Dictionary = {}) -> int:
	if not _listeners.has(event_name):
		event_emitted.emit(event_name, event_data)
		return 0

	var count = 0
	for listener in _listeners[event_name]:
		if listener.is_valid():
			listener.call(event_data)
			count += 1

	event_emitted.emit(event_name, event_data)
	return count

## Queues an event for deferred processing in the next frame
func queue_event(event_name: String, event_data: Dictionary = {}) -> void:
	_event_queue.append({"name": event_name, "data": event_data})

## Processes all queued events
## Call this in _process() or _physics_process()
func process_queue() -> void:
	if _is_processing_queue or _event_queue.is_empty():
		return

	_is_processing_queue = true

	# Process all queued events
	while not _event_queue.is_empty():
		var event = _event_queue.pop_front()
		emit(event.name, event.data)

	_is_processing_queue = false

## Clears all queued events without processing
func clear_queue() -> void:
	_event_queue.clear()

## Gets the number of queued events
func get_queue_count() -> int:
	return _event_queue.size()

## Gets the number of listeners for a specific event
func get_listener_count(event_name: String) -> int:
	if not _listeners.has(event_name):
		return 0

	return _listeners[event_name].size()

## Checks if there are any listeners for a specific event
func has_listeners(event_name: String) -> bool:
	return get_listener_count(event_name) > 0

## Clears all listeners for a specific event or all events
## If event_name is empty, clears all listeners
func clear_listeners(event_name: String = "") -> void:
	if event_name.is_empty():
		_listeners.clear()
	else:
		_listeners.erase(event_name)

## Creates a typed event subscription helper
## Usage:
## var health_sub = event_bus.create_subscription("health_changed")
## health_sub.connect(_on_health_changed)
func create_subscription(event_name: String) -> EventSubscription:
	return EventSubscription.new(self, event_name)

## Convenience method for one-shot event listeners
## Listeners are automatically unsubscribed after first event
func subscribe_once(event_name: String, listener: Callable) -> void:
	var wrapper = func(event_data: Dictionary):
		unsubscribe(event_name, listener)
		listener.call(event_data)

	subscribe(event_name, wrapper)

## Wait for an event with timeout
## Returns: Event data if emitted within timeout, null otherwise
func wait_for_event(event_name: String, timeout: float = 1.0) -> Dictionary:
	var received = false
	var result: Dictionary = {}

	var listener = func(event_data: Dictionary):
		received = true
		result = event_data

	subscribe_once(event_name, listener)

	var start_time = Time.get_ticks_msec()
	while not received and (Time.get_ticks_msec() - start_time) < timeout * 1000:
		await get_tree().process_frame

	if received:
		return result

	return {}


# Event Subscription helper class
class EventSubscription:
	var _bus: EventBus
	var _event_name: String

	func _init(bus: EventBus, event_name: String):
		_bus = bus
		_event_name = event_name

	func connect(listener: Callable):
		_bus.subscribe(_event_name, listener)

	func disconnect(listener: Callable):
		_bus.unsubscribe(_event_name, listener)

	func emit(event_data: Dictionary = {}):
		_bus.emit(_event_name, event_data)
