# 金庸群侠传dc版 (Jin Yong Heroes Legend DC Edition)

A 2D RPG game based on Jin Yong's wuxia novels, built with Godot 4.6 and GDScript.

## Overview

This game brings the rich world of Jin Yong's martial arts novels to life in a 2D RPG format. Players can explore the jianghu (martial arts world), learn famous martial arts techniques, interact with legendary characters, and experience storylines from classic wuxia novels.

## Features

- **ECS Architecture**: Entity-Component-System design for flexible and maintainable code
- **Jin Yong Lore**: Authentic characters, locations, and martial arts from the novels
- **Quest System**: Dynamic quests based on storylines from Jin Yong's works
- **Map System**: Grid-based navigation with collision detection and pathfinding
- **Event System**: Decoupled communication between game systems
- **Complete Testing Framework**: Unit and integration tests for all implemented systems
- **Automated Development Pipeline**: Scripts for automatic commits and GitHub integration

## Architecture

The game follows a modern ECS (Entity-Component-System) architecture:

- **Entities**: Game objects identified by unique IDs
- **Components**: Data containers defining object properties
- **Systems**: Logic processors operating on entities with specific components
- **Events**: Message passing between systems

For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Systems

### Implemented
- **Map System**: Complete implementation with navigation, collision detection, and pathfinding
- **Quest System**: Complete system with dynamic generation based on Jin Yong novels
- **Event System**: Provides decoupled communication between game systems
- **Testing Framework**: Comprehensive tests for implemented systems

### Planned
- **Combat System**: Turn-based martial arts combat
- **Dialogue System**: NPC conversations and story progression
- **Skill System**: Martial arts techniques and character abilities
- **Save System**: Game state persistence
- **UI System**: User interfaces for inventory, character, and menus

## Data Sources

The game incorporates authentic data from Jin Yong's novels:

- `data/lore/characters.json`: Characters with stats, abilities, and relationships
- `data/lore/locations.json`: Geographic locations and regions
- `data/lore/martial_arts.json`: Martial arts techniques and cultivation methods

## Running the Game

To run the game, use Godot 4.6:

```bash
godot --path .
```

Or open the project in the Godot editor and run it from there.

## Development

### Project Structure

```
├── src/                 # Source code
│   ├── components/      # ECS components
│   ├── core/            # Core ECS infrastructure
│   ├── systems/         # Game systems (map, quest, combat, etc.)
│   └── ui/              # User interface elements
├── data/                # Game data
│   └── lore/            # Jin Yong novel data
├── docs/                # Documentation
├── tests/               # Automated tests
└── res/                 # Game resources
    └── quests/          # Quest definitions
```

### Agent Team Structure

The development follows a specialized agent team approach with roles:
1. Lore Extractor - Extracts information from Jin Yong's novels
2. Canon Validator - Ensures adherence to original novels
3. Quest Designer - Generates quests based on novel storylines
4. Narrative Planner - Creates cohesive game narrative
5. Game Designer - Converts lore into gameplay mechanics
6. System Architect - Designs ECS architecture and state machines
7. Asset Planner - Plans required assets and art style
8. Programmer - Implements game systems and code
9. Integrator - Assembles modules into cohesive project
10. QA Agent - Tests game functionality

### Contributing

The game follows these development principles:

- Maintain ECS architecture consistency
- Respect Jin Yong's original works
- Prioritize authentic wuxia atmosphere
- Write tests for new functionality
- Follow GDScript best practices

## GitHub Integration

The project includes setup instructions for:
- Creating a GitHub repository
- Pushing initial code
- Configuring automatic commit scripts for completed modules
- Setting up CI/CD workflows

See [GITHUB_SETUP.md](GITHUB_SETUP.md) for detailed instructions.

## License

This project is for educational and personal use based on Jin Yong's fictional universe.