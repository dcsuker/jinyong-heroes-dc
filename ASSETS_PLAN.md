# Asset Planning Document
# 《金庸群侠传dc版》2D RPG

**Project Engine**: Godot 4.6
**Rendering**: Forward Plus (D3D12)
**Art Style**: 2D Pixel Art / Traditional Chinese RPG Style

---

## ASSET PRIORITIES

### Priority 1: Core Gameplay (Immediate)
- Player character sprites
- Basic tilemap terrain
- Basic collision tiles
- Dialogue box UI
- Basic test map

### Priority 2: Dialogue System (Week 1-2)
- Character portraits
- Name tags
- Dialogue box variants
- Text input fields
- Choice selection UI

### Priority 3: Combat System (Week 2-3)
- Combat character sprites
- Health/mana bars
- Action buttons
- Skill icons
- Combat effects
- Enemy sprites

### Priority 4: Content Expansion (Week 4+)
- Additional tilesets
- Environment objects
- UI polish
- Special effects
- Map variety

---

## 1. CHARACTER ASSETS

### 1.1 Player Character (主角)

**Sprite Sheet Specifications:**
- Pixel size: 32x32 or 48x48 pixels per frame
- Directions: 8 (up, down, left, right, and 4 diagonals)
- Animations per character:
  - Idle (4-6 frames)
  - Walk (4-8 frames)
  - Attack (3-6 frames)
  - Hurt (2-4 frames)
  - Cast (3-5 frames, for martial arts)
  - Victory/Defeat poses

**Required Sprites:**

| Character | Role | Sprite Size | Notes |
|-----------|------|-------------|-------|
| 主角 (Player) | Protagonist | 48x48 | Customizable appearance preferred |
| 郭靖 | Companion | 48x48 | Wearing Mongol-style clothing |
| 黄蓉 | Companion | 48x48 | Elegant, clever appearance |
| 杨过 | Companion | 48x48 | Dark gray/black clothing |
| 小龙女 | Companion | 48x48 | White robes, ethereal |
| 乔峰 | Companion | 48x48 | Strong, heroic appearance |
| 段誉 | Companion | 48x48 | Scholar-like appearance |
| 虚竹 | Companion | 48x48 | Monk appearance |
| 王语嫣 | Companion | 48x48 | Beautiful scholar |
| 令狐冲 | Companion | 48x48 | Free-spirited swordsman |
| 任盈盈 | Companion | 48x48 | Elegant musician |
| 张无忌 | Companion | 48x48 | Young hero appearance |
| 赵敏 | Companion | 48x48 | Princess-like appearance |

**Priority:**
- Player: P1 (Critical)
- Main companions: P2 (High)
- Secondary companions: P3 (Medium)

### 1.2 Character Portraits (立绘)

**Portrait Specifications:**
- Size: 256x320 pixels (4:5 aspect ratio)
- Format: PNG with transparency
- Expressions per character (minimum 3):
  - Normal/Neutral
  - Happy/Friendly
  - Sad/Concerned
  - Angry/Determined
  - Surprised/Shocked

**Required Portraits:**

| Character | Expressions | Priority |
|-----------|-------------|----------|
| 主角 | Normal, Happy, Angry, Sad, Surprised | P1 |
| 郭靖 | Normal, Happy, Angry, Concerned | P2 |
| 黄蓉 | Normal, Happy, Surprised, Determined | P2 |
| 杨过 | Normal, Angry, Sad, Determined | P2 |
| 小龙女 | Normal, Sad, Surprised, Happy | P2 |
| 乔峰 | Normal, Determined, Angry, Happy | P2 |
| 段誉 | Normal, Surprised, Happy, Concerned | P2 |
| 虚竹 | Normal, Surprised, Determined, Sad | P3 |
| 王语嫣 | Normal, Happy, Concerned, Surprised | P3 |
| 令狐冲 | Normal, Happy, Drunk, Determined | P2 |
| 任盈盈 | Normal, Happy, Sad, Determined | P3 |
| 张无忌 | Normal, Happy, Concerned, Angry | P3 |
| 赵敏 | Normal, Happy, Surprised, Cunning | P2 |

### 1.3 NPC Characters

**NPC Sprite Types:**
- Villagers (male/female, various ages)
- Merchants (shopkeepers, blacksmiths, innkeepers)
- Guards/Soldiers
- Martial Arts Masters
- Monks/Taoists
- Quest Givers

**NPC Portraits:**
- Generic villagers: 5-10 variations
- Important NPCs: Unique portraits with expressions

**Priority: P2 (High) - Start with 5-10 essential NPCs**

---

## 2. MAP/ENVIRONMENT ASSETS

### 2.1 Tilesets (地形图块)

**Tile Specifications:**
- Tile size: 32x32 pixels
- Tileset size: 512x512 or 1024x512 (16x16 or 32x16 tiles)

**Required Tilesets:**

#### 2.1.1 Basic Terrain (Priority: P1)
```
Forest/Wilderness Tileset:
- Grass (4 variations)
- Dirt path (8 variations: straight, corners, T-junctions, crossings)
- Water (animated: 2-4 frames)
- Water edges (16 variations for shorelines)
- Shallow water
- Trees (4-6 variations)
- Rocks/pebbles (3-5 variations)
- Flowers/plants (4-6 variations)
- Cliffs/height transitions (8 variations)
- Ground decorations (sticks, leaves, etc.)
```

#### 2.1.2 Interior Tileset (Priority: P1)
```
Indoor/Floor Tileset:
- Wooden floor (4 variations)
- Stone floor (4 variations)
- Carpet floor (3 variations)
- Wall tiles (wood, stone, painted)
- Wall edges/corners (8 variations)
- Door frames (4 variations)
- Windows
- Furniture items (tables, chairs, beds, cabinets)
```

#### 2.1.3 Town/City Tileset (Priority: P2)
```
Urban/City Tileset:
- Cobblestone streets (8 variations)
- Brick roads
- Building walls (brick, wood, plaster)
- Roofs (various angles and materials)
- Fences/walls
- Street decorations
- Market stalls
- Signs/banners
```

#### 2.1.4 Mountain/Wasteland Tileset (Priority: P3)
```
Mountain Tileset:
- Rocky ground (6 variations)
- Snow (if applicable)
- Mountain paths
- Cliffs (multiple heights)
- Caves
- Sparse vegetation
```

#### 2.1.5 Temple/Monastery Tileset (Priority: P2)
```
Sacred Tileset:
- Stone courtyard tiles
- Temple walls
- Roof tiles (Asian style)
- Pillars
- Statues
- Incense burners
- Altars
```

### 2.2 Environment Objects (环境物件)

**Object Sprites:**
- Format: PNG with transparency
- Sizes: 32x32 to 128x128 pixels

**Required Objects (Priority: P2):**

| Category | Items | Count |
|----------|-------|-------|
| Natural | Trees (oak, pine, bamboo), rocks, boulders, flowers, bushes | 15-20 |
| Buildings | Houses, shops, temples, towers, gates | 10-15 |
| Furniture | Tables, chairs, beds, cabinets, shelves | 8-12 |
| Interactive | Chests, doors, signs, wells, bridges | 8-10 |
| Decorative | Statues, lanterns, banners, flags, fountains | 10-15 |
| Combat | Weapons on ground, magic circles, barriers | 5-8 |

### 2.3 Backgrounds (背景图)

**Background Specifications:**
- Resolution: 1920x1080 or 1280x720 (HD/SD)
- Format: PNG or JPEG
- Style: Parallax-ready layers preferred

**Required Backgrounds (Priority: P2):**

| Location | Description | Priority |
|----------|-------------|----------|
| Forest | Dense forest, path through woods | P2 |
| Mountain | Misty mountain, cliffside view | P2 |
| Village | Small Chinese village | P2 |
| City | Bustling city/town square | P3 |
| Temple | Buddhist/Taoist temple courtyard | P2 |
| Interior | Inn room, palace room | P2 |
| Combat | Simple combat arena background | P1 |
| Dialogue | Simple dialogue background | P1 |

---

## 3. UI ASSETS

### 3.1 Dialogue System UI (Priority: P1)

**Dialogue Box:**
- Main dialogue box: 800x200 pixels
- Transparent background with semi-opaque fill
- Border/frame design (traditional Chinese pattern)
- Name tag area
- Text rendering area
- Optional portrait container

**Dialogue Components:**
```
- dialogue_box_bg.png - Main box background
- dialogue_box_border.png - Frame/border
- dialogue_name_tag.png - Character name display
- dialogue_indicator.png - "Press to continue" indicator
- dialogue_arrow.png - Next arrow animation
```

### 3.2 Combat System UI (Priority: P2)

**Combat Layout Elements:**

| Element | Size | Description |
|---------|------|-------------|
| health_bar_bg | 150x20 | Empty health bar background |
| health_bar_fill | 150x20 | Filled portion (animated) |
| health_bar_border | 152x22 | Health bar border |
| mana_bar_bg | 150x20 | Empty mana bar background |
| mana_bar_fill | 150x20 | Filled portion |
| mana_bar_border | 152x22 | Mana bar border |
| stamina_bar_bg | 150x20 | Stamina bar |
| stamina_bar_fill | 150x20 | Filled portion |
| stamina_bar_border | 152x22 | Border |
| combat_menu_bg | 300x400 | Action menu background |
| combat_button_normal | 280x60 | Normal button state |
| combat_button_hover | 280x60 | Hover state |
| combat_button_pressed | 280x60 | Pressed state |
| combat_frame | 800x600 | Overall combat UI frame |
| character_info_panel | 200x300 | Character stats panel |
| enemy_info_panel | 200x300 | Enemy stats panel |
| turn_indicator | 100x100 | Current turn indicator |

**Combat Icons:**
- Attack icon (sword/weapon)
- Defend icon (shield)
- Skill/Martial Arts icon (magic effect)
- Item icon (bag/potion)
- Run icon (door/exit)
- Special ability icons

### 3.3 Quest Log UI (Priority: P2)

```
Quest Log Components:
- quest_window_bg.png - Main window (800x600)
- quest_list_item_bg.png - List item background
- quest_list_item_selected.png - Selected state
- quest_description_bg.png - Description panel
- quest_objective_checkbox.png - Objective completion marker
- quest_title_icon.png - Title/icon display area
```

### 3.4 Menu/Inventory UI (Priority: P2)

**Main Menu:**
```
- menu_background.png - Main menu background (1920x1080)
- menu_button.png - Menu button (200x60)
- menu_title.png - Game title logo
```

**Inventory System:**
```
- inventory_window.png - Inventory window (600x800)
- inventory_slot.png - Item slot (64x64)
- inventory_slot_selected.png - Selected slot
- inventory_slot_highlight.png - Hover state
- item_quantity_bg.png - Number display background
- item_description_panel.png - Item details panel
```

**Character Status:**
```
- status_window.png - Character status window (400x600)
- stat_bar_bg.png - Stat bar background
- stat_bar_fill.png - Stat bar fill
- equipment_slot.png - Equipment slots
```

### 3.5 Icons (图标) (Priority: P2)

**Icon Specifications:**
- Size: 32x32, 64x64 pixels
- Format: PNG with transparency
- Style: Consistent pixel art style

**Required Icons:**

**Item Icons (50-100 needed):**
```
Category: Consumables (P2)
- Healing potion (red bottle)
- Mana potion (blue bottle)
- Antidote (green bottle)
- Food items (steamed bun, rice, etc.)
- Status cure items

Category: Equipment (P2)
- Weapons: Sword, Staff, Spear, Blade, Fan, Dagger
- Armor: Light, Medium, Heavy, Robe
- Accessories: Ring, Amulet, Belt, Boots, Helmet

Category: Key Items (P2)
- Keys, maps, scrolls, books, tokens
```

**Skill/Martial Arts Icons (30-50 needed):**
```
Category: Internal Arts (内功) (P2)
- Qi gathering icons
- Meditation icons

Category: External Arts (外功) (P2)
- Attack icons (sword strike, palm strike, kick)
- Combo icons

Category: Special Arts (绝学) (P2)
- Unique martial arts icons for each character
- Ultimate move icons
```

**Status Effect Icons (10-15 needed):**
```
- Poisoned (purple icon)
- Burned (red icon)
- Frozen (blue icon)
- Stunned (yellow icon)
- Buffed (green up arrow)
- Debuffed (red down arrow)
- Regenerating (green plus)
- Bleeding (red droplet)
- Confused (question mark)
- Protected (shield)
```

**UI Action Icons (Priority: P1):**
```
- Arrow/pointer (navigation)
- Checkmark (confirm)
- X mark (cancel)
- Question mark (help)
- Settings (gear)
- Save (floppy disk)
- Load (folder)
- Sound toggle (speaker)
- Music toggle (musical note)
```

### 3.6 Text & Typography

**Font Assets:**
```
- Primary font (Chinese support required)
  - Size: 12-48 pixels
  - Styles: Regular, Bold
  - File format: .ttf or .otf

- Dialogue font (readable at small sizes)
- UI font (clean, legible)
- Combat font (impactful for damage numbers)
```

---

## 4. EFFECTS ASSETS

### 4.1 Combat Effects (Priority: P2)

**Effect Animations:**
- Format: Sprite sheets with alpha channel
- Frame counts: 4-12 frames per effect

**Required Effects:**

| Effect | Description | Frames | Priority |
|--------|-------------|--------|----------|
| hit_flash | White flash on damage | 2-4 | P1 |
| hit_spark | Impact spark | 4-6 | P1 |
| slash_trail | Weapon slash trail | 6-8 | P2 |
| blood_splash | Blood effect (mild) | 4-6 | P2 |
| dodge_effect | Motion blur | 4-6 | P2 |
| block_effect | Shield impact | 4-6 | P2 |
| knockback | Pushed backward | 4-8 | P2 |
| level_up | Experience gain | 8-12 | P2 |

**Martial Arts Effects (Priority: P2):**
```
- qi_glow (energy aura): 8 frames
- palm_strike (hand effect): 6 frames
- sword_aura (weapon glow): 6 frames
- fire_element (flame effect): 8-12 frames
- ice_element (freeze effect): 8-12 frames
- lightning_element (spark effect): 8-12 frames
- wind_element (air current): 6-10 frames
```

### 4.2 Visual Feedback Elements (Priority: P2)

**Damage Numbers:**
- Damage number sprites (0-9)
- Critical hit indicator
- Miss indicator
- Block indicator

**Status Indicators:**
```
- Poison particles
- Burn particles
- Freeze crystals
- Heal sparkles
- Buff glow
- Debuff darkness
```

### 4.3 Environmental Effects (Priority: P3)

```
- Rain animation (parallax)
- Snow animation
- Fog overlay
- Day/night transitions
- Fire torch/light
- Water ripple
```

---

## 5. AUDIO ASSETS (Optional Note)

While not visual assets, important for completeness:

**Music:**
- Title screen theme
- Town/peaceful music
- Combat music (multiple tracks)
- Dungeon/exploration music
- Boss battle music
- Victory fanfare
- Game over theme

**Sound Effects:**
- Footsteps (multiple surfaces)
- Attack sounds (weapons, martial arts)
- Hit/impact sounds
- Magic spell sounds
- UI sounds (click, cancel, confirm)
- Dialogue typing sounds
- Environmental ambience

---

## 6. ASSET ORGANIZATION

### Recommended Folder Structure:
```
res://assets/
├── sprites/
│   ├── characters/
│   │   ├── player/
│   │   ├── companions/
│   │   └── npcs/
│   ├── enemies/
│   └── effects/
├── portraits/
│   ├── main_characters/
│   └── npcs/
├── tilesets/
│   ├── forest/
│   ├── indoor/
│   ├── town/
│   ├── mountain/
│   └── temple/
├── objects/
│   ├── furniture/
│   ├── natural/
│   └── interactive/
├── backgrounds/
├── ui/
│   ├── dialogue/
│   ├── combat/
│   ├── inventory/
│   ├── menu/
│   └── icons/
│       ├── items/
│       ├── skills/
│       └── status/
├── fonts/
└── audio/
    ├── music/
    └── sfx/
```

---

## 7. ASSET CREATION TIMELINE

### Week 1: Core Foundation
- Player character sprite (idle, walk, attack)
- Basic terrain tileset (grass, dirt, water, trees)
- Dialogue box UI
- Player portrait (neutral expression)
- Basic combat background
- Health/mana bars
- Basic damage effects

### Week 2: Dialogue & Navigation
- 3-5 companion character sprites
- Character portraits for main cast
- Indoor tileset
- 10-15 environment objects
- Quest log UI
- Inventory UI
- Item icons (20-30)

### Week 3: Combat Polish
- Combat sprites for player and companions
- Enemy sprites (5-10 variations)
- Combat menu UI
- Skill icons (15-20)
- Combat effects (slash, hit, magic)
- Status effect icons

### Week 4-6: Content Expansion
- Remaining tilesets (town, mountain, temple)
- More NPC sprites and portraits
- Additional environment objects
- More item and skill icons
- Background variations
- Advanced effects

### Week 7+: Polish & Content
- Additional character variations
- Premium effects
- UI polish and animations
- More backgrounds and environments

---

## 8. TECHNICAL REQUIREMENTS

### Godot 4.6-Specific Requirements:

**Sprite Sheets:**
- Use `Sprite2D` with `AnimatedSprite2D` nodes
- Sprite sheets can use Godot's sprite import settings
- Pixel art: Disable filtering (nearest-neighbor)

**Tilesets:**
- Use `TileMap` node with `TileSet` resource
- Organize tiles in 32x32 grids
- Use atlas textures for optimization

**UI:**
- Use `Control` nodes and themes
- NinePatchRect for stretchable UI elements
- Button nodes with hover/pressed states

**Effects:**
- Use `GPUParticles2D` for particle effects
- Sprite sheets for frame-based animations
- Consider using `AnimationPlayer` for complex effects

**Optimization:**
- Use texture atlases where possible
- Reuse assets across scenes
- Implement LOD for backgrounds
- Consider mipmapping for larger assets

---

## 9. STYLE GUIDE

**Visual Style Reference:**
- Classic 2D Chinese RPG games (e.g., original 金庸群侠传, 仙剑奇侠传)
- Pixel art: 16-bit or 32-bit style
- Color palette: Traditional Chinese colors (rich reds, golds, greens)
- Line weight: Clean, readable pixel outlines
- Lighting: Simple, effective lighting/shadows

**Character Design:**
- Distinctive silhouettes for recognition
- Consistent proportions across characters
- Readable at small sizes (32-48px)
- Clear facial features even at small scale

**UI Design:**
- Clean, readable interface
- Traditional Chinese decorative elements
- High contrast for readability
- Intuitive iconography

---

## 10. CONSIDERATIONS & NOTES

### Scalability:
- Asset creation should consider future expansion
- Modular assets for easy combination
- Template systems for character variations

### Localization:
- Text assets need space for different languages
- Font must support Chinese characters
- UI layout should accommodate variable text lengths

### Performance:
- Optimize texture sizes for mobile targets (if applicable)
- Use efficient sprite sheet layouts
- Implement sprite batching where possible

### Accessibility:
- High contrast options
- Clear visual feedback
- Distinguishable color schemes

---

## APPENDIX: QUICK REFERENCE

### Critical Path Assets (P1 - Must Have):
1. Player sprite (idle, walk, attack)
2. Basic terrain tileset
3. Dialogue box UI
4. Player portrait
5. Health/mana bars
6. Basic damage effects
7. Basic combat background
8. Basic indoor tileset

### High Priority Assets (P2 - Should Have Soon):
1. 3-5 companion sprites
2. Main character portraits
3. Enemy sprites
4. Combat UI
5. Inventory UI
6. Quest log UI
7. Item icons (20-30)
8. Skill icons (15-20)
9. Environment objects (15-20)

### Medium Priority Assets (P3 - Nice to Have):
1. Additional tilesets
2. More NPC portraits
3. Advanced effects
4. Premium backgrounds
5. Additional character variations
6. Advanced UI polish
7. Environmental effects

---

**Document Version**: 1.0
**Last Updated**: 2026-02-16
**Status**: Initial Asset Planning Complete
