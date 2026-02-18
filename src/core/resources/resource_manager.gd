# resource_manager.gd
# Manages loading, unloading, and caching of game resources

class_name ResourceManager extends Node

# Cache: maps resource_path to loaded resource
var _cache: Dictionary = {}
var _reference_counts: Dictionary = {}

# Pending async loads
var _pending_loads: Dictionary = {}

signal resource_loaded(resource_path: String, resource: Resource)
signal resource_unloaded(resource_path: String)
signal load_failed(resource_path: String, error: String)

## Loads a resource with caching
## Returns: The loaded Resource or null if failed
func load_resource(resource_path: String) -> Resource:
	if resource_path.is_empty():
		push_error("Cannot load empty resource path")
		return null

	# Check cache first
	if _cache.has(resource_path):
		_increment_reference(resource_path)
		return _cache[resource_path]

	# Load resource
	var resource = ResourceLoader.load(resource_path)

	if resource == null:
		var error = "Failed to load resource: %s" % resource_path
		push_error(error)
		load_failed.emit(resource_path, error)
		return null

	# Cache the resource
	_cache[resource_path] = resource
	_reference_counts[resource_path] = 1
	resource_loaded.emit(resource_path, resource)

	return resource

## Asynchronously loads a resource
## Returns: A ResourceLoader that can be awaited
func load_resource_async(resource_path: String, use_threads: bool = true) -> ResourceLoader:
	if resource_path.is_empty():
		push_error("Cannot load empty resource path")
		return null

	# Check cache first
	if _cache.has(resource_path):
		_increment_reference(resource_path)
		resource_loaded.emit(resource_path, _cache[resource_path])
		return _cache[resource_path] as ResourceLoader

	# Start async load
	var loader = ResourceLoader.load_interactive(resource_path, ResourceLoader.CACHE_MODE_REUSE)
	_pending_loads[resource_path] = loader

	return loader

## Polls the progress of an async resource load
## Returns: 0-1 progress, or -1 if complete or failed
func poll_async_load(resource_path: String) -> float:
	if not _pending_loads.has(resource_path):
		return -1.0

	var loader = _pending_loads[resource_path]
	var status = loader.poll()

	if status == OK:
		# Load complete
		var resource = loader.get_resource()
		_cache[resource_path] = resource
		_reference_counts[resource_path] = 1
		_pending_loads.erase(resource_path)
		resource_loaded.emit(resource_path, resource)
		return 1.0
	elif status == ERR_FILE_EOF:
		return 1.0
	elif status < OK:
		# Load failed
		var error = "Async load failed: %s" % resource_path
		push_error(error)
		load_failed.emit(resource_path, error)
		_pending_loads.erase(resource_path)
		return -1.0
	else:
		# Still loading
		return loader.get_stage() / float(loader.get_stage_count())

## Unloads a resource (decrements reference count)
func unload_resource(resource_path: String) -> void:
	if not _cache.has(resource_path):
		return

	if not _reference_counts.has(resource_path):
		return

	_decrement_reference(resource_path)

	# If no more references, remove from cache
	if _reference_counts[resource_path] <= 0:
		_cache.erase(resource_path)
		_reference_counts.erase(resource_path)
		resource_unloaded.emit(resource_path)

## Forces immediate unload of a resource
## Use with caution - can cause crashes if resource is still in use
func force_unload(resource_path: String) -> void:
	if not _cache.has(resource_path):
		return

	_cache.erase(resource_path)
	_reference_counts.erase(resource_path)
	_pending_loads.erase(resource_path)
	resource_unloaded.emit(resource_path)

## Checks if a resource is cached
func is_cached(resource_path: String) -> bool:
	return _cache.has(resource_path)

## Gets a cached resource without loading
func get_cached(resource_path: String) -> Resource:
	return _cache.get(resource_path)

## Increments reference count for a resource
func _increment_reference(resource_path: String) -> void:
	if _reference_counts.has(resource_path):
		_reference_counts[resource_path] += 1

## Decrements reference count for a resource
func _decrement_reference(resource_path: String) -> void:
	if _reference_counts.has(resource_path):
		_reference_counts[resource_path] -= 1

## Gets the reference count for a resource
func get_reference_count(resource_path: String) -> int:
	return _reference_counts.get(resource_path, 0)

## Clears the cache (use with caution)
func clear_cache() -> void:
	_cache.clear()
	_reference_counts.clear()
	_pending_loads.clear()

## Gets cache statistics
func get_cache_stats() -> Dictionary:
	return {
		"cached_resources": _cache.size(),
		"total_references": _reference_counts.values().reduce(func(acc, val): return acc + val, 0),
		"pending_loads": _pending_loads.size()
	}

## Preloads a list of resources
## Returns: Dictionary of resource_path -> Resource (null for failed loads)
func preload_resources(resource_paths: Array[String]) -> Dictionary:
	var results: Dictionary = {}

	for path in resource_paths:
		results[path] = load_resource(path)

	return results

## Loads a scene and instantiates it
## Returns: Node instance or null
func load_scene(resource_path: String) -> Node:
	var packed_scene = load_resource(resource_path)

	if packed_scene == null or not packed_scene is PackedScene:
		push_error("Resource is not a PackedScene: %s" % resource_path)
		return null

	return packed_scene.instantiate()

## Saves a resource to disk
## Returns: true on success, false on failure
func save_resource(resource: Resource, resource_path: String) -> bool:
	if resource == null:
		push_error("Cannot save null resource")
		return false

	var error = ResourceSaver.save(resource, resource_path)

	if error != OK:
		push_error("Failed to save resource to %s: %s" % [resource_path, error_string(error)])
		return false

	return true
