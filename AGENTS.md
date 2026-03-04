# Project instructions for Codex

## Goal
Migrate TownScreen (Jiaxing) rendering from SVG/div to PixiJS renderer (Option B).
Keep React for UI and Zustand as the single source of truth. Pixi only renders and emits events.

## Tech constraints
- React 19 + TypeScript + Vite + Tailwind + Zustand + Howler
- Add deps: pixi.js, @pixi/tilemap
- No breaking changes to existing screens except TownScreen integration.

## Architecture
- src/engine/pixi/PixiRoot.ts: own PIXI.Application lifecycle
- src/engine/pixi/TownRenderer.ts: map layers + actors + camera + interaction hint
- src/data/towns/jiaxing/*: map.json, tileset.json, collision.json, triggers.json, npcs.json (seed minimal)
- TownScreen.tsx becomes a host: mount canvas + render React UI overlay

## Deliverables (must)
1) Pixi canvas mounted inside TownScreen, shows a player sprite moving with WASD
2) Collision grid prevents walking through blocked tiles
3) Near interaction: show "E" hint and dispatch interact event
4) Build passes: npm run validate:data, npx tsc -b, npm run build

## Working style
- Work in small commits; do not refactor unrelated modules
- Update/introduce minimal data files for Jiaxing (can be placeholder)
- Document how to add a new town map in README or docs/short note