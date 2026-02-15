# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Godot 4.6 game project using GDScript. The rendering backend is Forward Plus with D3D12 on Windows. Physics uses Jolt Physics (3D).

## Engine & Tools

- **Engine**: Godot 4.6
- **Language**: GDScript (`.gd` files)
- **Scenes**: `.tscn` (text-based scene files)
- **Resources**: `.tres` (text-based resource files)
- **Project config**: `project.godot` (avoid manual edits; use the Godot editor when possible)

## Running the Project

Run from the Godot editor or via CLI:
```
godot --path .
```

To run a specific scene:
```
godot --path . res://path/to/scene.tscn
```

## Architecture Notes

- Scene tree is the core architecture pattern — nodes compose into scenes, scenes compose into the game.
- Autoloads (singletons) are registered in `project.godot` under `[autoload]` for global state/managers.
- Signals are the preferred way to decouple communication between nodes.

## Conventions

- Use `snake_case` for variables, functions, and file names.
- Use `PascalCase` for class/node names and class_name declarations.
- Prefix private members with `_`.
- Scene files (`.tscn`) and scripts (`.gd`) typically share the same base name and live alongside each other.
