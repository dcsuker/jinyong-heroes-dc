# ECS API Reference

## Core Classes

### EntityID

Represents a unique identifier for an ECS entity.

**Methods:**
- `get_id() -> int`: Returns the entity ID
- `is_valid() -> bool`: Returns true if ID is valid (> 0)
- `to_string() -> String`: Returns string representation

**Usage:**
```gdscript
var entity = entity_manager.create_entity()
var entity_id = EntityID.new(entity)
print(entity_id.get_id())  # 1
```

---

### EntityManager

Manages entity lifecycle and component storage.

**Public Methods:**

#### Entity Lifecycle
- `create_entity(p_initial_components: Array[Component] = []) -> int`
  Creates a new entity with optional initial components. Returns the entity ID.

- `destroy_entity(entity_id: int) -> void`
  Destroys an entity and removes all its components.

- `entity_exists(entity_id: int) -> bool`
  Returns true if the entity exists.

- `get_entity_count() -> int`
  Returns the total number of active entities.

#### Component Management
- `add_component(entity_id: int, component: Component) -> void`
  Adds a component to an entity.

- `remove_component(entity_id: int, component_class: String) -> void`
  Removes a component from an entity.

- `get_component(entity_id: int, component_class: String) -> Component`
  Returns a component from an entity, or null if not found.

- `has_component(entity_id: int, component_class: String) -> bool`
  Returns true if the entity has the specified component.

- `has_all_components(entity_id: int, component_classes: Array[String]) -> bool`
  Returns true if the entity has all specified components.

- `get_entity_components(entity_id: int) -> Array[String]`
  Returns all component classes an entity has.

#### Entity Queries
- `query(component_classes: Array[String]) -> Array[int]`
  Returns entities that have all specified components.

- `query_any(component_classes: Array[String]) -> Array[int]`
  Returns entities that have at least one of the specified components.

- `query_exclude(required: Array[String], excluded: Array[String]) -> Array[int]`
  Returns entities with all required components but none of the excluded components.

- `get_entities_with_component(component_class: String) -> Array[int]`
  Returns all entities with a specific component.

#### Utility
- `clear() -> void`
  Clears all entities and components.

**Signals:**
- `entity_created(entity_id: int)`: Emitted when an entity is created
- `entity_destroyed(entity_id: int)`: Emitted when an entity is destroyed
- `component_added(entity_id: int, component_class: String)`: Emitted when a component is added
- `component_removed(entity_id: int, component_class: String)`: Emitted when a component is removed

**Usage:**
```gdscript
# Create entity
var entity_id = entity_manager.create_entity()

# Add components
entity_manager.add_component(entity_id, TransformComponent.new())
entity_manager.add_component(entity_id, HealthComponent.new())

# Query entities
var entities = entity_manager.query(["TransformComponent", "VelocityComponent"])
for entity_id in entities:
    var transform = entity_manager.get_component(entity_id, "TransformComponent")
    # Process transform

# Destroy entity
entity_manager.destroy_entity(entity_id)
```

---

### EventBus

Decoupled event-driven communication system.

**Public Methods:**

#### Event Subscription
- `subscribe(event_name: String, listener: Callable) -> void`
  Registers a listener for a specific event.

- `unsubscribe(event_name: String, listener: Callable) -> void`
  Unregisters a listener from a specific event.

- `subscribe_once(event_name: String, listener: Callable) -> void`
  Registers a one-shot listener that is automatically unsubscribed after first event.

- `create_subscription(event_name: String) -> EventSubscription`
  Creates a typed subscription helper for convenient connect/disconnect.

#### Event Emission
- `emit(event_name: String, event_data: Dictionary = {}) -> int`
  Emits an event immediately to all listeners. Returns number of listeners notified.

- `queue_event(event_name: String, event_data: Dictionary = {}) -> void`
  Queues an event for deferred processing in the next frame.

- `process_queue() -> void`
  Processes all queued events. Call in `_process()` or `_physics_process()`.

#### Event Management
- `get_listener_count(event_name: String) -> int`
  Returns the number of listeners for a specific event.

- `has_listeners(event_name: String) -> bool`
  Returns true if there are any listeners for a specific event.

- `clear_listeners(event_name: String = "") -> void`
  Clears all listeners for a specific event, or all events if name is empty.

- `clear_queue() -> void`
  Clears all queued events without processing.

- `get_queue_count() -> int`
  Returns the number of queued events.

- `wait_for_event(event_name: String, timeout: float = 1.0) -> Dictionary`
  Waits for an event with timeout. Returns event data if emitted within timeout, null otherwise.

**Signals:**
- `event_emitted(event_name: String, event_data: Dictionary)`: Emitted when any event is fired

**Usage:**
```gdscript
# Subscribe to events
event_bus.subscribe("health_changed", _on_health_changed)

# Emit events
event_bus.emit("damage_dealt", {
    "target_id": target_id,
    "damage": 10.0,
    "source_id": player_id
})

# Queue events for deferred processing
event_bus.queue_event("entity_moved", {
    "entity_id": entity_id,
    "position": new_position
})

# Process queue in update
func _process(delta: float) -> void:
    event_bus.process_queue()

# Event handler
func _on_health_changed(event_data: Dictionary):
    var entity_id = event_data["entity_id"]
    var current_health = event_data["current_health"]
    print("Entity %d health: %f" % [entity_id, current_health])
```

---

### ResourceManager

Manages loading, unloading, and caching of game resources.

**Public Methods:**

#### Resource Loading
- `load_resource(resource_path: String) -> Resource`
  Loads a resource with caching. Returns the loaded Resource or null if failed.

- `load_resource_async(resource_path: String, use_threads: bool = true) -> ResourceLoader`
  Asynchronously loads a resource. Returns a ResourceLoader that can be polled.

- `poll_async_load(resource_path: String) -> float`
  Polls the progress of an async resource load. Returns 0-1 progress, or -1 if complete/failed.

- `preload_resources(resource_paths: Array[String]) -> Dictionary`
  Preloads a list of resources. Returns Dictionary of resource_path -> Resource.

#### Resource Unloading
- `unload_resource(resource_path: String) -> void`
  Unloads a resource (decrements reference count).

- `force_unload(resource_path: String) -> void`
  Forces immediate unload of a resource. Use with caution.

#### Resource Access
- `is_cached(resource_path: String) -> bool`
  Returns true if resource is cached.

- `get_cached(resource_path: String) -> Resource`
  Gets a cached resource without loading.

- `load_scene(resource_path: String) -> Node`
  Loads a scene and instantiates it. Returns Node instance or null.

- `save_resource(resource: Resource, resource_path: String) -> bool`
  Saves a resource to disk. Returns true on success, false on failure.

#### Cache Management
- `clear_cache() -> void`
  Clears the cache (use with caution).

- `get_reference_count(resource_path: String) -> int`
  Gets the reference count for a resource.

- `get_cache_stats() -> Dictionary`
  Gets cache statistics (cached_resources, total_references, pending_loads).

**Signals:**
- `resource_loaded(resource_path: String, resource: Resource)`: Emitted when resource is loaded
- `resource_unloaded(resource_path: String)`: Emitted when resource is unloaded
- `load_failed(resource_path: String, error: String)`: Emitted when load fails

**Usage:**
```gdscript
# Load a resource
var texture = resource_manager.load_resource("res://textures/player.png")

# Load a scene
var player_scene = resource_manager.load_scene("res://scenes/player.tscn")

# Async load
var loader = resource_manager.load_resource_async("res://assets/large_model.glb")
while loader != null:
    var progress = resource_manager.poll_async_load("res://assets/large_model.glb")
    print("Loading: %d%%" % (progress * 100))
    await get_tree().process_frame

# Save a resource
resource_manager.save_resource(data, "res://resources/data/character_data.tres")
```

---

### ECSSystem

Base class for all ECS systems.

**Properties:**
- `priority: int` - System execution priority (lower = earlier)
- `active: bool` - Whether system is active

**Dependencies (injected by ECSManager):**
- `entity_manager: EntityManager` - Reference to entity manager
- `event_bus: EventBus` - Reference to event bus
- `resource_manager: ResourceManager` - Reference to resource manager

**Methods to Override:**
- `on_initialize() -> void`: Called when system is added to ECSManager
- `on_cleanup() -> void`: Called when system is removed from ECSManager
- `on_activate() -> void`: Called when system is activated
- `on_deactivate() -> void`: Called when system is deactivated
- `process_system(delta: float) -> void`: Called every frame
- `physics_process_system(delta: float) -> void`: Called every physics frame

**Helper Methods:**
- `get_entities(component_classes: Array[String]) -> Array[int]`
  Gets entities with specific components.

- `get_entities_exclude(required: Array[String], excluded: Array[String]) -> Array[int]`
  Gets entities with components, excluding some.

- `emit_event(event_name: String, event_data: Dictionary = {}) -> int`
  Emits an event via EventBus.

- `subscribe_event(event_name: String, listener: Callable) -> void`
  Subscribes to an event via EventBus.

- `unsubscribe_event(event_name: String, listener: Callable) -> void`
  Unsubscribes from an event via EventBus.

**Usage:**
```gdscript
class_name MovementSystem extends ECSSystem

func _init() -> void:
    priority = 300

func on_initialize() -> void:
    subscribe_event("apply_force", _on_apply_force)

func physics_process_system(delta: float) -> void:
    var entities = get_entities(["TransformComponent", "VelocityComponent"])

    for entity_id in entities:
        var transform = entity_manager.get_component(entity_id, "TransformComponent")
        var velocity = entity_manager.get_component(entity_id, "VelocityComponent")

        # Process movement
        transform.position += velocity.velocity * delta
```

---

### ECSManager

Central manager for ECS architecture.

**Public Methods:**

#### System Management
- `register_system(system: ECSSystem) -> void`
  Registers a system with the ECSManager.

- `unregister_system(system: ECSSystem) -> void`
  Unregisters a system from the ECSManager.

- `get_systems() -> Array[ECSSystem]`
  Returns all registered systems.

- `get_systems_of_type(system_class: String) -> Array[ECSSystem]`
  Returns systems by type.

- `get_system(system_class: String) -> ECSSystem`
  Returns the first system of a specific type.

- `get_system_count() -> int`
  Returns total number of systems.

- `get_active_system_count() -> int`
  Returns number of active systems.

#### Utility
- `clear() -> void`
  Clears all entities and systems (use with caution).

**Signals:**
- `system_registered(system: ECSSystem)`: Emitted when system is registered
- `system_unregistered(system: ECSSystem)`: Emitted when system is unregistered

**Usage:**
```gdscript
# In RootScene or main game script
var ecs_manager: ECSManager = $ECSManager

# Register systems
var movement_system = MovementSystem.new()
ecs_manager.register_system(movement_system)

var combat_system = CombatSystem.new()
ecs_manager.register_system(combat_system)

# Get system by type
var movement = ecs_manager.get_system("MovementSystem")

# Create entities through entity manager
var entity_id = ecs_manager.entity_manager.create_entity()
ecs_manager.entity_manager.add_component(entity_id, TransformComponent.new())
```

---

## Component Reference

All components inherit from `Component` base class and are pure data containers.

### TransformComponent
```gdscript
@export var position: Vector3 = Vector3.ZERO
@export var rotation: Vector3 = Vector3.ZERO
@export var scale: Vector3 = Vector3.ONE
```

### VelocityComponent
```gdscript
@export var velocity: Vector3 = Vector3.ZERO
@export var acceleration: Vector3 = Vector3.ZERO
@export var max_speed: float = 10.0
@export var friction: float = 0.1
```

### HealthComponent
```gdscript
@export var current_health: float = 100.0
@export var max_health: float = 100.0
@export var defense: float = 0.0
@export var is_invincible: bool = false

func take_damage(damage: float) -> float
func heal(amount: float) -> float
func is_alive() -> bool
func get_health_percentage() -> float
```

### NameComponent
```gdscript
@export var name: String = ""
@export var display_name: String = ""
@export var title: String = ""

func get_full_name() -> String
```

---

## Event Reference

Common event names and data structures:

### Movement Events
- `"entity_moved"`: Entity moved
  - `entity_id: int`
  - `position: Vector3`
  - `velocity: Vector3`

- `"apply_force"`: Apply force to entity
  - `entity_id: int`
  - `force: Vector3`

### Combat Events
- `"damage_dealt"`: Damage was dealt
  - `target_id: int`
  - `damage: float`
  - `source_id: int`

- `"heal_applied"`: Heal was applied
  - `target_id: int`
  - `amount: float`

- `"health_changed"`: Health changed
  - `entity_id: int`
  - `current_health: float`
  - `max_health: float`
  - `damage_dealt: float` (optional)
  - `heal_amount: float` (optional)

- `"entity_died"`: Entity died
  - `entity_id: int`
  - `health_component: HealthComponent`

- `"entity_killed"`: Entity was killed
  - `entity_id: int`
  - `killer_id: int`

### Dialogue Events
- `"dialogue_started"`: Dialogue started
  - `npc_id: int`
  - `dialogue_id: String`

- `"dialogue_choice"`: Player made choice
  - `choice_id: int`
  - `dialogue_id: String`

- `"dialogue_ended"`: Dialogue ended
  - `dialogue_id: String`

### Map Events
- `"map_changed"`: Map changed
  - `old_map: String`
  - `new_map: String`

- `"location_entered"`: Entered location
  - `location_id: String`
  - `entity_id: int`

### Quest Events
- `"quest_started"`: Quest started
  - `quest_id: String`

- `"objective_completed"`: Objective completed
  - `quest_id: String`
  - `objective_id: String`

- `"quest_completed"`: Quest completed
  - `quest_id: String`

### Save/Load Events
- `"save_requested"`: Request save
  - `slot: int`

- `"load_requested"`: Request load
  - `slot: int`

- `"save_completed"`: Save completed
  - `slot: int`
  - `success: bool`

- `"load_completed"`: Load completed
  - `slot: int`
  - `success: bool`

---

## System Priorities

Recommended priority values for different system types:

- **100-199**: Input Systems
  - Player input handling

- **200-299**: Logic Systems
  - Game state updates
  - AI decision making

- **300-399**: Physics Systems
  - Movement
  - Collision detection

- **400-499**: Gameplay Systems
  - Combat
  - Dialogue
  - Quests
  - Skills

- **500-599**: Render Systems
  - Animation
  - Sprite updates
  - UI updates
