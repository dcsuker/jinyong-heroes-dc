# Map System

The Map System provides comprehensive functionality for managing game maps, tilemaps, collision detection, and navigation in the 金庸群侠传dc版 game.

## Components

### TileComponent
Represents a single map tile with properties such as position, type, walkability, and movement cost.

- `grid_position`: Position of the tile in grid coordinates
- `tile_type`: Type of tile (e.g., "floor", "wall", "water")
- `walkable`: Boolean indicating if the tile can be traversed
- `movement_cost`: Cost factor for pathfinding algorithms

### MapDataComponent
Contains map-level data including dimensions, name, and tile organization.

- `width`, `height`: Map dimensions in tiles
- `map_name`, `description`: Metadata about the map
- `tile_entities`: Array of tile entity IDs organized in a grid

### CollisionComponent
Defines collision properties for map entities.

- `shape_type`: Shape of the collision area
- `collides`: Whether the entity participates in collision detection
- `collision_layer` / `collision_mask`: Bitmasks for collision filtering

### NavigationComponent
Handles pathfinding and navigation abilities for entities.

- `destination`: Target position for navigation
- `path`: Array of waypoints to follow
- `move_speed`: Movement speed along the path
- `following_path`: Whether the entity is currently navigating

## Systems

### MapSystem
Primary system for managing game maps, including loading, unloading, and spatial queries.

- Manages map entities and tile organization
- Handles collision detection and walkability checks
- Provides map loading/unloading functionality via events

### NavigationSystem
Handles pathfinding and navigation for entities moving through the game world.

- Implements A* pathfinding algorithm
- Manages entity movement along calculated paths
- Provides navigation event handling

## Usage

The Map System is designed to work with the ECS architecture. To use it:

1. Register the `MapSystem` and `NavigationSystem` with the ECSManager
2. Create map entities with `MapDataComponent` and populate with tiles
3. Add `NavigationComponent` to entities that need to move through the map
4. Use the event system to trigger navigation (`navigate_to` event) or map changes (`load_map` event)

## Events

The Map System responds to and emits the following events:

- `load_map`: Request to load a named map
- `unload_map`: Request to unload the current map
- `move_entity`: Request to move an entity to a position
- `check_collision`: Request to check collision at a position
- `find_path`: Request to calculate a path between two points
- `navigate_to`: Request to navigate an entity to a destination
- `navigation_completed`: Emitted when an entity completes navigation
- `entity_moved`: Emitted when an entity successfully moves