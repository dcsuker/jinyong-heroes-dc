# Project Directory Structure

## Root Structure

```
jyqxzdc/
├── project.godot              # Godot project configuration
├── icon.svg                   # Project icon
├── CLAUDE.md                  # Project instructions for Claude Code
├── README.md                  # Project overview and setup guide
├── docs/                      # Documentation
│   └── architecture/          # Architecture documentation
│       ├── ECS_ARCHITECTURE.md # ECS architecture design
│       ├── DIRECTORY_STRUCTURE.md # This file
│       └── API_REFERENCE.md    # System API documentation
│
├── src/                       # Source code
│   ├── core/                  # Core systems
│   │   ├── ecs/              # ECS framework
│   │   │   ├── entity_id.gd  # Entity identifier
│   │   │   ├── entity_manager.gd # Entity lifecycle manager
│   │   │   ├── ecs_manager.gd    # Central ECS manager
│   │   │   ├── ecs_system.gd     # Base system class
│   │   │   └── components/       # Component definitions
│   │   │       ├── component_base.gd
│   │   │       ├── transform_component.gd
│   │   │       ├── velocity_component.gd
│   │   │       ├── health_component.gd
│   │   │       ├── name_component.gd
│   │   │       ├── character_component.gd
│   │   │       ├── inventory_component.gd
│   │   │       └── ... (other components)
│   │   │
│   │   ├── events/           # Event system
│   │   │   └── event_bus.gd  # Event-driven communication
│   │   │
│   │   ├── resources/        # Resource management
│   │   │   └── resource_manager.gd # Load/unload resources
│   │   │
│   │   └── state/            # State management
│   │       ├── state_machine.gd    # Generic state machine
│   │       ├── game_state.gd      # Base game state
│   │       └── states/            # Game state implementations
│   │           ├── menu_state.gd
│   │           ├── gameplay_state.gd
│   │           ├── dialogue_state.gd
│   │           └── combat_state.gd
│   │
│   ├── systems/              # Game systems
│   │   ├── examples/         # Example systems
│   │   │   ├── movement_system.gd
│   │   │   └── health_system.gd
│   │   │
│   │   ├── map/              # Map system
│   │   │   ├── map_system.gd
│   │   │   ├── pathfinding_system.gd
│   │   │   └── components/
│   │   │       └── map_component.gd
│   │   │
│   │   ├── dialogue/         # Dialogue system
│   │   │   ├── dialogue_system.gd
│   │   │   └── components/
│   │   │       ├── dialogue_component.gd
│   │   │       └── dialogue_state_component.gd
│   │   │
│   │   ├── combat/           # Combat system
│   │   │   ├── combat_system.gd
│   │   │   ├── damage_system.gd
│   │   │   └── components/
│   │   │       ├── attack_component.gd
│   │   │       ├── defense_component.gd
│   │   │       └── combat_state_component.gd
│   │   │
│   │   ├── martial_arts/     # Martial Arts system
│   │   │   ├── martial_arts_system.gd
│   │   │   ├── skill_system.gd
│   │   │   └── components/
│   │   │       ├── martial_arts_component.gd
│   │   │       └── skill_component.gd
│   │   │
│   │   └── quest/            # Quest system
│   │       ├── quest_system.gd
│   │       └── components/
│   │           ├── quest_component.gd
│   │           └── quest_objective_component.gd
│   │
│   ├── gameplay/             # Gameplay logic
│   │   ├── player/
│   │   │   ├── player_controller.gd
│   │   │   └── player_input.gd
│   │   │
│   │   ├── ai/
│   │   │   ├── ai_controller.gd
│   │   │   ├── behavior_tree/
│   │   │   │   ├── behavior_node.gd
│   │   │   │   ├── sequence_node.gd
│   │   │   │   └── selector_node.gd
│   │   │   └── states/
│   │   │       ├── idle_state.gd
│   │   │       └── patrol_state.gd
│   │   │
│   │   └── interaction/
│   │       ├── interaction_system.gd
│   │       └── interaction_trigger.gd
│   │
│   ├── ui/                   # User interface
│   │   ├── hud/
│   │   │   ├── health_bar.gd
│   │   │   ├── minimap.gd
│   │   │   └── dialogue_box.gd
│   │   │
│   │   ├── menus/
│   │   │   ├── main_menu.gd
│   │   │   ├── pause_menu.gd
│   │   │   └── inventory_menu.gd
│   │   │
│   │   └── components/
│   │       ├── button_base.gd
│   │       └── panel_base.gd
│   │
│   └── utils/                # Utilities
│       ├── debug/
│       │   ├── debug_overlay.gd
│       │   └── entity_inspector.gd
│       │
│       ├── math/
│       │   └── math_utils.gd
│       │
│       └── data/
│           └── data_table.gd
│
├── scenes/                   # Scene files
│   ├── core/
│   │   ├── root_scene.tscn   # Main scene with ECSManager
│   │   └── ecs_manager.tscn  # ECS manager scene
│   │
│   ├── gameplay/
│   │   ├── player.tscn
│   │   ├── world.tscn
│   │   └── maps/
│   │       └── world_map.tscn
│   │
│   └── ui/
│       ├── hud.tscn
│       ├── main_menu.tscn
│       └── dialogue_box.tscn
│
├── resources/                # Game resources
│   ├── data/
│   │   ├── characters/
│   │   │   └── character_data.tres
│   │   ├── martial_arts/
│   │   │   └── skills/
│   │   │       └── skill_data.tres
│   │   └── quests/
│   │       └── quest_data.tres
│   │
│   ├── dialogue/
│   │   └── dialogues/
│   │       └── example_dialogue.tres
│   │
│   └── maps/
│       └── locations/
│           └── map_data.tres
│
├── assets/                   # Imported assets
│   ├── textures/
│   ├── models/
│   ├── sounds/
│   └── fonts/
│
└── tests/                    # Tests
    ├── components/
    │   └── component_test.gd
    ├── systems/
    │   └── system_test.gd
    └── integration/
        └── ecs_integration_test.gd
```

## Directory Purpose

### `src/core/ecs/`
Contains the ECS framework implementation. These are the foundational classes that implement the entity-component-system architecture.

### `src/core/events/`
Contains the event bus implementation for decoupled communication between systems.

### `src/core/resources/`
Contains the resource manager for loading, caching, and unloading game resources.

### `src/core/state/`
Contains state machine implementations for managing game states and entity states.

### `src/systems/`
Contains all game systems that process entities. Each major module (Map, Dialogue, Combat, etc.) has its own subdirectory.

### `src/gameplay/`
Contains gameplay-specific logic that may not fit neatly into the ECS pattern (e.g., input handling, AI behavior trees).

### `src/ui/`
Contains all user interface code, organized by function (HUD, menus, reusable components).

### `src/utils/`
Contains utility classes and helper functions.

### `scenes/`
Contains Godot scene files (`.tscn`) that define the scene tree structure.

### `resources/`
Contains Godot resource files (`.tres`) that store game data.

### `assets/`
Contains imported assets (textures, 3D models, audio files, etc.).

### `docs/`
Contains project documentation, architecture diagrams, and API references.

### `tests/`
Contains automated tests for components, systems, and integration.

## Conventions

1. **Naming**: Use `snake_case` for all files and directories
2. **Organization**: Group related functionality together
3. **Separation**: Keep ECS components, systems, and game logic separated
4. **Documentation**: Add comments for complex logic
5. **Dependencies**: Avoid circular dependencies; use EventBus for decoupling

## File Naming Patterns

- **Components**: `{name}_component.gd` (e.g., `transform_component.gd`)
- **Systems**: `{name}_system.gd` (e.g., `movement_system.gd`)
- **Resources**: `{name}_data.tres` (e.g., `character_data.tres`)
- **Scenes**: `{name}.tscn` (e.g., `player.tscn`)
- **Scripts**: `{name}.gd` (e.g., `player_controller.gd`)
