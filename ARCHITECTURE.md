# Architecture Documentation for 金庸群侠传dc版

## Overview
This document describes the architecture of the 金庸群侠传dc版 (Jin Yong Qun Xia Zhuan DC Edition) game, a 2D RPG based on Jin Yong's wuxia novels. The game follows an Entity-Component-System (ECS) architecture combined with event-driven design principles.

## Core Architecture

### Entity-Component-System (ECS)
The game uses a custom ECS implementation designed for Godot 4.x:

- **Entities**: Unique identifiers that represent game objects (players, NPCs, items, etc.)
- **Components**: Data containers that define properties of entities (position, stats, inventory, etc.)
- **Systems**: Logic processors that operate on entities with specific component combinations

### Event System
The game implements a decoupled event system for communication between systems:

- **EventBus**: Singleton that handles publishing and subscribing to events
- **Events**: Structured data passed between systems
- **Handlers**: Functions that respond to specific event types

## System Modules

### 1. Map System
Located at `src/systems/map/`

- **Components**:
  - `TileComponent`: Defines properties of individual map tiles
  - `MapDataComponent`: Contains map-level data
  - `CollisionComponent`: Handles collision properties
  - `NavigationComponent`: Manages pathfinding capabilities

- **Systems**:
  - `MapSystem`: Manages game maps, collision detection, and spatial queries
  - `NavigationSystem`: Implements A* pathfinding algorithm

- **Features**:
  - Grid-based tile management
  - Collision detection and walkability checks
  - Dynamic pathfinding for character movement
  - Mouse-controlled navigation

### 2. Quest System
Located at `src/systems/quest/`

- **Components**:
  - `QuestComponent`: Defines quest properties (title, description, objectives, rewards)
  - `QuestObjectiveComponent`: Represents individual quest objectives

- **Systems**:
  - `QuestSystem`: Core logic for managing active and completed quests
  - `QuestManager`: Higher-level management of quest workflow
  - `GlobalQuestManager`: Autoload singleton for global quest access

- **Features**:
  - Quest acceptance, progression, and completion
  - Objective tracking with progress monitoring
  - Reward distribution system
  - Dynamic quest generation based on Jin Yong novels

### 3. Combat System
Located at `src/systems/combat/`

- **Structure**: Ready framework for implementing turn-based combat mechanics
- **Components**: Placeholder for health, attack, defense, and status effect components
- **Systems**: Framework for combat logic, damage calculation, and battle resolution

### 4. Dialogue System
Located at `src/systems/dialogue/`

- **Structure**: Framework for NPC conversations and story progression
- **Components**: Placeholder for dialogue trees and conversation states
- **Systems**: Ready for dialogue processing and UI management

### 5. Skill System
Located at `src/systems/skill/`

- **Structure**: Framework for martial arts techniques and character abilities
- **Components**: Ready for storing skill data and progression
- **Systems**: Prepared for skill execution and advancement mechanics

### 6. Save System
Located at `src/systems/save/`

- **Structure**: Framework for saving and loading game state
- **Components**: Placeholder for save-relevant data
- **Systems**: Ready for serialization and deserialization of game state

## Data Sources
Located at `data/lore/`

- `characters.json`: Comprehensive data on characters from Jin Yong's novels
- `locations.json`: Detailed information on locations from the novels
- `martial_arts.json`: Complete catalog of martial arts techniques from the novels

## Core Infrastructure
Located at `src/core/`

- **EntityManager**: Manages the lifecycle of entities
- **ComponentManager**: Handles component storage and retrieval
- **SystemManager**: Controls system execution order and dependencies
- **EventBus**: Provides event-driven communication between systems

## Game Integration

### Main Scene
The main scene (`src/main.tscn`) integrates:
- GlobalQuestManager as an autoload singleton
- EntityManager for ECS operations
- MapDemoSetup for initial map system demonstration

### Project Configuration
- Game name: 金庸群侠传dc版
- Main scene: res://src/main.tscn
- Rendering: Forward Plus with D3D12
- Physics: Jolt Physics engine

## Development Principles

### ECS Best Practices
- Avoid God Objects by properly separating concerns
- Components only contain data, no logic
- Systems contain all logic and operate on components
- Entities are pure identifiers that group components

### Event-Driven Design
- Loose coupling between systems
- Asynchronous communication when needed
- Scalable event handling

### Wuxia Authenticity
- All content based on Jin Yong's novels
- Authentic martial arts, locations, and character relationships
- Respectful representation of wuxia culture and values

## Future Expansion

The architecture is designed to accommodate additional systems such as:
- Inventory system
- Character progression system
- Party management system
- Multiple game modes (story, sandbox, multiplayer)
- Advanced AI for NPCs