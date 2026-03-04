# Town Pixi Data Format

This project uses Pixi renderer data under `src/data/towns/<town-id>/`.

## Files

- `map.json`
  - `tileSize`: tile pixel size.
  - `width` / `height`: map grid size.
  - `spawn`: player spawn tile `{ x, y }`.
  - `layers.ground`: ground tile ids (2D array).
  - `layers.roads`: road/overlay tile ids (2D array).
- `tileset.json`
  - `image`: optional tileset image path (current Jiaxing points to `/assets/jiaxing/tileset.png`).
  - If image is missing, renderer uses procedural solid-color textures as fallback.
- `collision.json`
  - `grid`: 2D grid (`0` walkable, `1` blocked).
- `npcs.json`
  - List of `{ id, label, x, y }` in tile coordinates.
  - `id` should map to existing character ids.
- `triggers.json`
  - List of `{ id, label, x, y }` in tile coordinates for interactable landmarks.

## Add A New Town

1. Create `src/data/towns/<new-town>/` with the same five JSON files.
2. Keep all grid arrays aligned with `map.json` width/height.
3. Add renderer logic to load the new town folder and route interaction callbacks to Zustand/game logic.
4. Keep quest/dialog state in Zustand; use Pixi only for rendering and input events.
