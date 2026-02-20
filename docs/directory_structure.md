# Directory Structure for 金庸群侠传dc版

## Overview
This document describes the directory structure of the 金庸群侠传dc版 game project.

## Project Structure

```
/workspace/jyqxzdc/
├── .claude/                    # Claude Code configuration
│   └── settings.local.json
├── .git/                      # Git repository metadata
├── .godot/                    # Godot editor metadata
├── .idea/                     # IDE configuration files
├── data/                      # Game data
│   └── lore/                  # Data from Jin Yong novels
│       ├── characters.json    # Character information from novels
│       ├── locations.json     # Geographic locations from novels
│       ├── martial_arts.json  # Martial arts techniques from novels
│       └── README.md          # Documentation for lore data
├── docs/                      # Documentation files
│   ├── ARCHITECTURE.md        # High-level architecture overview
│   └── architecture/          # Detailed architecture docs
│       ├── API_REFERENCE.md   # API reference documentation
│       ├── DIRECTORY_STRUCTURE.md # This file
│       └── ECS_ARCHITECTURE.md # ECS architecture details
├── res/                       # Game resources
│   └── quests/                # Quest definition files
│       ├── she_diao_quest.tres # "Legend of the Condor Heroes" quest
│       └── tutorial_quest.tres # Tutorial quest
├── src/                       # Source code
│   ├── components/            # ECS component definitions
│   ├── core/                  # Core ECS framework and infrastructure
│   │   ├── ecs/              # Entity-Component-System implementation
│   │   ├── events/           # Event bus and communication systems
│   │   ├── fsm/              # Finite State Machine implementation
│   │   ├── resources/        # Resource management utilities
│   │   └── systems/          # Example ECS system implementations
│   ├── entities/              # Entity definition and creation
│   ├── systems/               # Game system implementations
│   │   ├── combat/           # Combat system (framework)
│   │   ├── dialogue/         # Dialogue system (framework)
│   │   ├── map/              # Map system (implemented)
│   │   ├── quest/            # Quest system (implemented)
│   │   ├── save/             # Save system (framework)
│   │   └── skill/            # Skill system (framework)
├── tests/                     # Automated tests
│   ├── helpers/              # Test utility functions
│   ├── integration/          # Integration tests
│   ├── unit/                 # Unit tests
│   ├── main_test_scene.tscn   # Main test scene
│   ├── test_project.godot     # Test project configuration
│   ├── test_runner.gd         # Test execution script
│   └── test_runner.tscn       # Test runner scene
├── .editorconfig              # Editor configuration
├── .gitattributes             # Git attributes configuration
├── .gitignore                 # Git ignore rules
├── ARCHITECTURE.md            # Main architecture documentation
├── ASSETS_PLAN.md             # Asset planning document
├── CLAUDE.md                  # Claude Code instructions
├── GITHUB_SETUP.md            # GitHub repository setup instructions
├── PROJECT_SUMMARY.md         # Project summary document
├── README.md                  # Main project documentation
├── auto_commit.sh             # Automatic commit script
├── icon.svg                  # Project icon
├── project.godot             # Godot project configuration
└── scenes/                   # Godot scene files (placeholder)
```

## Key Directories

### `/data/lore/`
Contains all the information extracted from Jin Yong's novels including:
- Character biographies, stats, and relationships
- Geographic locations and their properties
- Detailed martial arts techniques and classifications

### `/src/systems/map/`
The fully implemented map system with:
- Tile and navigation components
- Map and collision systems
- Pathfinding algorithms
- Demo scene for testing

### `/src/systems/quest/`
The fully implemented quest system with:
- Quest and objective components
- Quest management systems
- Dynamic quest generator based on Jin Yong novels
- Demo scene for testing

### `/src/core/`
Core ECS infrastructure including:
- Entity, component, and system managers
- Event bus for communication
- State machine implementation
- Resource management utilities

### `/tests/`
Complete testing framework with:
- Unit tests for individual components
- Integration tests for system workflows
- Helper functions for test assertions
- Test runner for automated execution

## Special Files

### `project.godot`
The main Godot project file with configured autoloading for GlobalQuestManager and proper application settings.

### `src/main.tscn`
The main scene that ties together all the different systems, serving as the entry point for the game.

### `ARCHITECTURE.md`
Comprehensive documentation explaining the ECS architecture, system designs, and development principles.