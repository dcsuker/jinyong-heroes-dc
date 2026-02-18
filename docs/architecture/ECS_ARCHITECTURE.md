# ECS Architecture Design

## Overview

Entity-Component-System (ECS) architecture for Godot 4 GDScript implementation following a data-oriented design pattern. This architecture enforces separation of concerns and enables efficient iteration over game entities.

## Core Concepts

### Entity
- **Purpose**: Unique identifier for game objects
- **Structure**: Pure ID wrapper, no logic or data
- **Lifetime**: Managed by EntityManager
- **Example**: player_entity, npc_001, sword_item

### Component
- **Purpose**: Pure data container, zero business logic
- **Structure**: Inherits from Resource, contains only data fields
- **Rules**:
  - No methods (except _init and simple getters)
  - No references to other components
  - No game logic
- **Examples**: TransformComponent, HealthComponent, NameComponent

### System
- **Purpose**: Pure logic processor, iterates over entities with specific components
- **Structure**: Inherits from Node, implements update pattern
- **Rules**:
  - No component data storage
  - Query EntityManager for entities
  - Process in update cycle
  - Emit events via EventBus
- **Examples**: MovementSystem, CombatSystem, AnimationSystem

### Event Bus
- **Purpose**: Decoupled communication between systems
- **Structure**: Signal-based pub/sub pattern
- **Rules**:
  - No direct system-to-system calls
  - Events are pure data
  - Async handling via signal queue
- **Examples**: health_changed_event, player_moved_event

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                       RootScene                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              ECSManager                               │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │ EntityManager │  │ EventBus     │  │ResourceManager││  │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │  │
│  │                                                      │  │
│  │  Systems                                             │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │  │
│  │  │Movement  │ │Combat    │ │Animation │ │...     │ │  │
│  │  │System    │ │System    │ │System    │ │        │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Storage Strategy

### Archetype-based Storage (Recommended)
- Components stored together in archetypes
- Efficient iteration over homogeneous data
- Cache-friendly memory layout
- Godot: Use TypedArray + Dictionary for archetype tracking

### Alternative: Sparse Set
- O(1) add, remove, lookup
- Iteration by component type
- Better for dynamic entity composition
- Godot: Use Dictionary with entity_id as key

## System Execution Order

Systems execute in priority order (lower number = earlier execution):

1. **Input Systems** (Priority: 100)
   - Capture and process player input

2. **Logic Systems** (Priority: 200)
   - Game state updates
   - AI decision making

3. **Physics Systems** (Priority: 300)
   - Movement, collision detection

4. **Gameplay Systems** (Priority: 400)
   - Combat, dialogue, quests

5. **Render Systems** (Priority: 500)
   - Animation, sprite updates
   - UI updates

## Query Interface

Systems query entities using component filters:

```gdscript
# Get entities with specific components
var entities = entity_manager.query([TransformComponent, VelocityComponent])

# Get entities with at least one of multiple components
var entities = entity_manager.query_any([TransformComponent, StaticComponent])

# Get entities with all components AND exclude others
var entities = entity_manager.query([TransformComponent], exclude=[StaticComponent])
```

## Event Flow

```
System A                Event Bus              System B
   │                         │                      │
   ├─── emit_event ─────────►│                      │
   │                         │                      │
   │                         ├─── fire_signal ──────►
   │                         │                      │
   │                         │◄───── on_signal ─────┤
   │                         │                      │
```

## Lifecycle Management

### Entity Lifecycle
1. **Creation**: EntityManager.create_entity()
2. **Component Assignment**: entity_manager.add_component(entity_id, component)
3. **Processing**: Systems iterate and update
4. **Destruction**: EntityManager.destroy_entity(entity_id)

### System Lifecycle
1. **Registration**: ECSManager.register_system(system)
2. **Initialization**: system.on_enter_tree() (Godot hook)
3. **Processing**: system.process() or system._physics_process()
4. **Cleanup**: system.on_exit_tree() (Godot hook)

## Performance Considerations

1. **Batch Processing**: Process all entities of one type before switching
2. **Component Access**: Cache component references during iteration
3. **Event Throttling**: Use event pooling for high-frequency events
4. **Memory Management**: Reuse entity IDs after destruction
5. **Debug Mode**: Add query statistics and entity count monitoring

## Concurrency Model

Godot 4's threading model is single-threaded for GDScript. For performance-critical systems:
- Use C#/GDExtension for multithreaded systems
- Keep GDScript systems simple and data-oriented
- Consider Godot's MultiThreadedSceneTree for experimental threading

## Anti-Patterns to Avoid

1. **God Object**: Don't put all logic in EntityManager or ECSManager
2. **Circular Dependencies**: Systems should only depend on EntityManager and EventBus
3. **Component Logic**: Never add business logic to components
4. **Direct System Calls**: Use EventBus for inter-system communication
5. **Singletons**: Pass dependencies via constructor or set from parent

## Integration Points

### Map Module
- Components: PositionComponent, MapLocationComponent
- Systems: MapSystem, PathfindingSystem
- Events: map_changed_event, location_entered_event

### Dialogue Module
- Components: DialogueComponent, DialogueStateComponent
- Systems: DialogueSystem
- Events: dialogue_started_event, dialogue_choice_event

### Combat Module
- Components: HealthComponent, AttackComponent, DefenseComponent
- Systems: CombatSystem, DamageSystem
- Events: combat_started_event, damage_dealt_event

### Martial Arts Module
- Components: MartialArtsComponent, SkillComponent
- Systems: MartialArtsSystem, SkillSystem
- Events: skill_learned_event, skill_used_event

### Quest Module
- Components: QuestComponent, QuestObjectiveComponent
- Systems: QuestSystem
- Events: quest_started_event, objective_completed_event

### Save/Load Module
- Systems: SaveSystem, LoadSystem
- Events: save_requested_event, load_requested_event

## Testing Strategy

1. **Component Tests**: Validate data structure and serialization
2. **System Tests**: Mock EntityManager and EventBus, test logic in isolation
3. **Integration Tests**: Test event flow between systems
4. **Performance Tests**: Measure query time with N entities

## Future Extensions

1. **Component Pools**: Object pooling for frequently created components
2. **System Groups**: Enable/disable entire groups of systems
3. **Hot Reloading**: Reload systems during development
4. **Visual Debugger**: Entity/component inspector in editor
5. **Entity Prefabs**: Blueprint system for entity creation
