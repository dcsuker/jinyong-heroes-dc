import { CompositeTilemap } from '@pixi/tilemap';
import { Assets, Container, Sprite, Text, Texture } from 'pixi.js';
import { PixiRoot } from './PixiRoot';
import { CHARACTERS } from '../../data/characters';
import mapRaw from '../../data/towns/jiaxing/map.json';
import tilesetRaw from '../../data/towns/jiaxing/tileset.json';
import collisionRaw from '../../data/towns/jiaxing/collision.json';
import npcsRaw from '../../data/towns/jiaxing/npcs.json';
import triggersRaw from '../../data/towns/jiaxing/triggers.json';

type TileId = 0 | 1 | 2;

interface TownMapData {
  tileSize: number;
  width: number;
  height: number;
  spawn: { x: number; y: number };
  layers: {
    ground: TileId[][];
    roads: TileId[][];
  };
}

interface TileSetData {
  image: string;
}

interface CollisionData {
  width: number;
  height: number;
  grid: number[][];
}

interface NpcData {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface TriggerData {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface TownInteractionTarget {
  id: string;
  label: string;
  kind: 'npc' | 'trigger';
}

export interface TownDebugInfo {
  focused: boolean;
  nearestId: string | null;
  nearestKind: 'npc' | 'trigger' | null;
  nearestLabel: string | null;
  nearestDistance: number | null;
  canInteract: boolean;
  lastKey: string | null;
  lastAction: string;
  ts: number;
}

interface TownRendererOptions {
  onInteract?: (target: TownInteractionTarget) => void;
  onDebug?: (info: TownDebugInfo) => void;
  initialPlayerTile?: { x: number; y: number };
}

type InteractableEntity = TownInteractionTarget & {
  sprite: Sprite;
};

interface BuildingDef {
  id: string;
  name: string;
  kind: 'inn' | 'market' | 'teahouse' | 'yamen' | 'clinic' | 'dock';
  x: number;
  y: number;
  w: number;
  h: number;
}

interface NpcActor {
  sprite: Sprite;
  nameText: Text;
  baseX: number;
  baseY: number;
  phase: number;
}

const mapData = mapRaw as TownMapData;
const tilesetData = tilesetRaw as TileSetData;
const collisionData = collisionRaw as CollisionData;
const npcData = npcsRaw as NpcData[];
const triggerData = triggersRaw as TriggerData[];
const BUILDINGS: BuildingDef[] = [
  { id: 'yuelai_inn', name: '悦来客栈', kind: 'inn', x: 2, y: 2, w: 4, h: 4 },
  { id: 'clinic', name: '月河药庐', kind: 'clinic', x: 2, y: 11, w: 3, h: 3 },
  { id: 'teahouse', name: '听雨茶楼', kind: 'teahouse', x: 11, y: 2, w: 3, h: 5 },
  { id: 'market', name: '河街市集', kind: 'market', x: 10, y: 11, w: 5, h: 3 },
  { id: 'yamen_post', name: '嘉兴巡检司', kind: 'yamen', x: 17, y: 3, w: 4, h: 5 },
  { id: 'nanhu_dock', name: '南湖船埠', kind: 'dock', x: 21, y: 11, w: 3, h: 3 },
];

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const makeSolidTexture = (color: string, size: number): Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(0,0,0,0.16)';
  ctx.strokeRect(0.5, 0.5, size - 1, size - 1);
  return Texture.from(canvas);
};

export class TownRenderer {
  private readonly pixi = new PixiRoot();
  private readonly options: TownRendererOptions;
  private readonly pressedKeys = new Set<string>();
  private readonly camera = new Container();
  private readonly worldLayer = new Container();
  private readonly actorLayer = new Container();
  private readonly ambienceLayer = new Container();
  private readonly hintText = new Text({
    text: '',
    style: {
      fill: 0xd1fae5,
      fontSize: 19,
      fontFamily: 'KaiTi, STKaiti, serif',
      stroke: { color: 0x111827, width: 3 },
    },
  });
  private readonly interactables: InteractableEntity[] = [];
  private readonly npcActors: NpcActor[] = [];

  private player: Sprite | null = null;
  private nearest: InteractableEntity | null = null;
  private destroyed = false;
  private destroying = false;
  private host: HTMLDivElement | null = null;
  private lastInteractAt = 0;
  private lastNearestDistance: number | null = null;
  private lastKey: string | null = null;
  private lastAction = 'init';
  private interactionEnabledAt = 0;
  private tickTime = 0;
  private playerMoveClock = 0;
  private playerTextures: Texture[] = [];
  private npcTextures: Texture[] = [];

  constructor(options: TownRendererOptions = {}) {
    this.options = options;
  }

  async mount(host: HTMLDivElement): Promise<void> {
    this.destroyed = false;
    this.host = host;
    this.host.tabIndex = 0;
    this.host.style.outline = 'none';
    this.host.addEventListener('pointerdown', this.onHostPointerDown);
    this.host.addEventListener('keydown', this.onKeyDown);
    this.host.addEventListener('keyup', this.onKeyUp);
    const app = await this.pixi.init(host);
    if (this.destroyed || this.host !== host) {
      app.destroy(true, { children: true, texture: false, textureSource: false });
      return;
    }
    this.host.focus();

    this.camera.addChild(this.worldLayer);
    this.camera.addChild(this.ambienceLayer);
    this.camera.addChild(this.actorLayer);
    this.pixi.world.addChild(this.camera);

    this.hintText.anchor.set(0.5, 1);
    this.hintText.visible = false;
    this.actorLayer.addChild(this.hintText);

    const textures = await this.loadTileTextures(mapData.tileSize);
    this.buildTileLayers(textures);
    this.buildActors();
    this.interactionEnabledAt = performance.now() + 320;

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onWindowBlur);
    app.ticker.add(this.onTick);
  }

  destroy(): void {
    if (this.destroying) return;
    this.destroying = true;
    this.destroyed = true;
    try {
      const app = this.pixi.getApp();
      try {
        app.ticker.remove(this.onTick);
      } catch {
        // no-op
      }
    } catch {
      // no-op
    }

    try {
      window.removeEventListener('keydown', this.onKeyDown);
      window.removeEventListener('keyup', this.onKeyUp);
      window.removeEventListener('blur', this.onWindowBlur);
    } catch {
      // no-op
    }

    try {
      if (this.host) {
        this.host.removeEventListener('pointerdown', this.onHostPointerDown);
        this.host.removeEventListener('keydown', this.onKeyDown);
        this.host.removeEventListener('keyup', this.onKeyUp);
        this.host = null;
      }
    } catch {
      // no-op
    }

    this.pressedKeys.clear();
    this.lastInteractAt = 0;
    this.interactables.length = 0;
    this.npcActors.length = 0;
    this.player = null;
    this.nearest = null;
    this.playerTextures = [];
    this.npcTextures = [];

    try {
      this.camera.removeChildren();
      this.worldLayer.removeChildren();
      this.actorLayer.removeChildren();
      this.ambienceLayer.removeChildren();
    } catch {
      // no-op
    }

    try {
      this.pixi.destroy();
    } catch {
      // no-op
    }
    this.destroying = false;
  }

  private async loadTileTextures(tileSize: number): Promise<Record<string, Texture>> {
    try {
      await Assets.load(tilesetData.image);
    } catch {
      // no-op: fallback is always procedural
    }

    return {
      grass: this.makeStyledTile(tileSize, '#2f5d3a', '#427a4e', 'grass'),
      water: this.makeStyledTile(tileSize, '#295779', '#4e8db5', 'water'),
      waterDeep: this.makeStyledTile(tileSize, '#1f425d', '#2e5b7d', 'water_deep'),
      shore: this.makeStyledTile(tileSize, '#6b7a63', '#9daa8e', 'shore'),
      road: this.makeStyledTile(tileSize, '#6f6552', '#a09378', 'road'),
      bridge: this.makeStyledTile(tileSize, '#594735', '#8f6f4f', 'bridge'),
      roof: this.makeStyledTile(tileSize, '#3f424a', '#5f646f', 'roof'),
      roofWarm: this.makeStyledTile(tileSize, '#6a3b34', '#8f5146', 'roof'),
      wall: this.makeStyledTile(tileSize, '#d4ccb9', '#ebe4d5', 'wall'),
      wallWood: this.makeStyledTile(tileSize, '#7a6a53', '#9c8766', 'wall'),
      sign: this.makeStyledTile(tileSize, '#6b4f36', '#ceb080', 'wall'),
      tree: this.makeStyledTile(tileSize, '#2e6238', '#4b8f5a', 'tree'),
      reed: this.makeStyledTile(tileSize, '#536b43', '#8ea26f', 'tree'),
      lantern: this.makeStyledTile(tileSize, '#6a2b25', '#f59e0b', 'trigger'),
      player: this.makeStyledTile(tileSize, '#0f766e', '#14b8a6', 'player'),
      playerAlt: this.makeStyledTile(tileSize, '#115e59', '#2dd4bf', 'player_alt'),
      npc: this.makeStyledTile(tileSize, '#b45309', '#f59e0b', 'npc'),
      npcAlt: this.makeStyledTile(tileSize, '#9a3412', '#fbbf24', 'npc_alt'),
      trigger: this.makeStyledTile(tileSize, '#0ea5e9', '#38bdf8', 'trigger'),
    };
  }

  private buildTileLayers(textures: Record<string, Texture>): void {
    const { tileSize, width, height } = mapData;
    const groundLayer = new CompositeTilemap();
    const roadLayer = new CompositeTilemap();
    const structureLayer = new CompositeTilemap();
    const shorelineLayer = new CompositeTilemap();

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const gx = x * tileSize;
        const gy = y * tileSize;
        const ground = mapData.layers.ground[y][x];
        groundLayer.tile(ground === 2 ? textures.water : textures.grass, gx, gy);
        if (ground === 2 && this.isNearLand(x, y)) {
          shorelineLayer.tile(textures.shore, gx, gy, { alpha: 0.45 });
        }

        const road = mapData.layers.roads[y][x];
        if (road === 1) roadLayer.tile(textures.road, gx, gy);
        if (road === 2) roadLayer.tile(textures.bridge, gx, gy);

        const blocked = collisionData.grid[y][x] === 1;
        if (blocked && y < 9 && ground !== 2) {
          structureLayer.tile(y < 4 ? textures.wall : textures.roof, gx, gy);
        }
        if (blocked && ground === 2) {
          structureLayer.tile(textures.waterDeep, gx, gy, { alpha: 0.62 });
        }
      }
    }

    this.worldLayer.addChild(groundLayer);
    this.worldLayer.addChild(shorelineLayer);
    this.worldLayer.addChild(roadLayer);
    this.worldLayer.addChild(structureLayer);
    this.renderBuildings(textures);
    this.addStreetDetails();
    this.addStreetLifeDetails();
    this.addScenerySprites(textures.tree, textures.reed, textures.lantern);
    this.addAmbience();
  }

  private renderBuildings(textures: Record<string, Texture>): void {
    const tileSize = mapData.tileSize;
    const buildingLayer = new CompositeTilemap();
    const facadeLayer = new Container();
    const labelLayer = new Container();

    for (const b of BUILDINGS) {
      for (let y = 0; y < b.h; y += 1) {
        for (let x = 0; x < b.w; x += 1) {
          const tx = b.x + x;
          const ty = b.y + y;
          const px = tx * tileSize;
          const py = ty * tileSize;
          const isRoof = y <= 1;
          const isDoor = y === b.h - 1 && x === Math.floor(b.w / 2);
          const roofTexture = b.kind === 'market' || b.kind === 'dock' || b.kind === 'teahouse' ? textures.roofWarm : textures.roof;
          const wallTexture = b.kind === 'dock' || b.kind === 'market' ? textures.wallWood : textures.wall;

          if (b.kind === 'market') {
            if (y <= 1) {
              buildingLayer.tile(textures.roofWarm, px, py);
            } else if (y === 2) {
              buildingLayer.tile(textures.bridge, px, py);
            } else if (x % 2 === 0) {
              buildingLayer.tile(textures.wallWood, px, py);
            }
          } else if (b.kind === 'dock') {
            if (y <= 1) {
              buildingLayer.tile(textures.roofWarm, px, py);
            } else if (x === 0 || x === b.w - 1 || y === b.h - 1) {
              buildingLayer.tile(textures.wallWood, px, py);
            } else {
              buildingLayer.tile(textures.bridge, px, py, { alpha: 0.85 });
            }
          } else if (isRoof) {
            buildingLayer.tile(roofTexture, px, py);
          } else {
            buildingLayer.tile(wallTexture, px, py);
          }

          if (isDoor) {
            buildingLayer.tile(textures.sign, px, py);
          }
        }
      }

      const facade = Sprite.from(this.makeBuildingFacadeTexture(b, tileSize));
      facade.anchor.set(0, 1);
      facade.x = b.x * tileSize;
      facade.y = (b.y + b.h - 0.1) * tileSize;
      facade.zIndex = 5;
      facadeLayer.addChild(facade);

      const label = new Text({
        text: b.name,
        style: {
          fill: 0xfde68a,
          fontSize: 16,
          fontFamily: 'KaiTi, STKaiti, serif',
          stroke: { color: 0x111827, width: 2 },
        },
      });
      label.anchor.set(0.5, 1);
      label.x = (b.x + b.w / 2) * tileSize;
      label.y = b.y * tileSize - 8;
      labelLayer.addChild(label);
    }

    this.worldLayer.addChild(buildingLayer);
    this.worldLayer.addChild(facadeLayer);
    this.worldLayer.addChild(labelLayer);
  }

  private addStreetDetails(): void {
    const tileSize = mapData.tileSize;
    const layer = new Container();

    this.addArchways(layer, tileSize);
    this.addBridgeRailings(layer, tileSize);
    this.addCourtyardWallsAndGates(layer, tileSize);

    this.worldLayer.addChild(layer);
  }

  private addStreetLifeDetails(): void {
    const tileSize = mapData.tileSize;
    const layer = new Container();
    this.addStreetStalls(layer, tileSize);
    this.addClothesLines(layer, tileSize);
    this.addLionAndLanternSets(layer, tileSize);
    this.addStoneStepWear(layer, tileSize);
    this.worldLayer.addChild(layer);
  }

  private addStreetStalls(layer: Container, tileSize: number): void {
    const stallSpots: Array<{ x: number; y: number; warm: boolean }> = [
      { x: 6, y: 10, warm: true },
      { x: 12, y: 10, warm: false },
      { x: 14, y: 10, warm: true },
      { x: 16, y: 6, warm: false },
    ];
    for (const s of stallSpots) {
      const stall = Sprite.from(this.makeStreetStallTexture(tileSize * 0.95, tileSize * 0.92, s.warm));
      stall.anchor.set(0.5, 1);
      stall.x = (s.x + 0.5) * tileSize;
      stall.y = (s.y + 0.92) * tileSize;
      layer.addChild(stall);
    }
  }

  private addClothesLines(layer: Container, tileSize: number): void {
    const lines: Array<{ x: number; y: number; w: number }> = [
      { x: 2, y: 7, w: 4 },
      { x: 10, y: 8, w: 3 },
      { x: 17, y: 8, w: 4 },
    ];
    for (const ln of lines) {
      const line = Sprite.from(this.makeClotheslineTexture(ln.w * tileSize, Math.round(tileSize * 0.65)));
      line.anchor.set(0, 1);
      line.x = ln.x * tileSize;
      line.y = (ln.y + 0.7) * tileSize;
      line.alpha = 0.9;
      layer.addChild(line);
    }
  }

  private addLionAndLanternSets(layer: Container, tileSize: number): void {
    const sets: Array<{ x: number; y: number }> = [
      { x: 2, y: 6 },
      { x: 11, y: 7 },
      { x: 17, y: 8 },
    ];
    for (const p of sets) {
      const deco = Sprite.from(this.makeLionLanternSetTexture(tileSize * 1.08, tileSize * 0.92));
      deco.anchor.set(0.5, 1);
      deco.x = (p.x + 0.5) * tileSize;
      deco.y = (p.y + 0.95) * tileSize;
      layer.addChild(deco);
    }
  }

  private addStoneStepWear(layer: Container, tileSize: number): void {
    const wearTex = this.makeStoneWearTexture(tileSize);
    for (let y = 0; y < mapData.height; y += 1) {
      for (let x = 0; x < mapData.width; x += 1) {
        if (mapData.layers.roads[y][x] !== 1) continue;
        // only render on road intersections/long lanes to avoid visual noise
        const left = x > 0 && mapData.layers.roads[y][x - 1] === 1;
        const right = x + 1 < mapData.width && mapData.layers.roads[y][x + 1] === 1;
        const up = y > 0 && mapData.layers.roads[y - 1][x] === 1;
        const down = y + 1 < mapData.height && mapData.layers.roads[y + 1][x] === 1;
        const degree = Number(left) + Number(right) + Number(up) + Number(down);
        if (degree < 2) continue;
        const wear = Sprite.from(wearTex);
        wear.anchor.set(0.5, 0.5);
        wear.x = (x + 0.5) * tileSize;
        wear.y = (y + 0.5) * tileSize;
        wear.alpha = degree >= 3 ? 0.46 : 0.32;
        layer.addChild(wear);
      }
    }
  }

  private addArchways(layer: Container, tileSize: number): void {
    const archSpots: Array<{ x: number; y: number; title: string }> = [
      { x: 8, y: 6, title: '东市巷' },
      { x: 15, y: 6, title: '临河街' },
      { x: 8, y: 10, title: '南巷口' },
    ];
    for (const spot of archSpots) {
      const s = Sprite.from(this.makeArchwayTexture(tileSize * 1.3, tileSize * 1.12, spot.title));
      s.anchor.set(0.5, 1);
      s.x = (spot.x + 0.5) * tileSize;
      s.y = (spot.y + 0.95) * tileSize;
      s.alpha = 0.94;
      layer.addChild(s);
    }
  }

  private addBridgeRailings(layer: Container, tileSize: number): void {
    const railTex = this.makeBridgeRailTexture(tileSize);
    for (let y = 0; y < mapData.height; y += 1) {
      for (let x = 0; x < mapData.width; x += 1) {
        if (mapData.layers.roads[y][x] !== 2) continue;
        const top = Sprite.from(railTex);
        top.anchor.set(0.5, 0.5);
        top.x = (x + 0.5) * tileSize;
        top.y = y * tileSize + tileSize * 0.18;
        layer.addChild(top);

        const bottom = Sprite.from(railTex);
        bottom.anchor.set(0.5, 0.5);
        bottom.x = (x + 0.5) * tileSize;
        bottom.y = y * tileSize + tileSize * 0.82;
        layer.addChild(bottom);
      }
    }
  }

  private addCourtyardWallsAndGates(layer: Container, tileSize: number): void {
    const hTex = this.makeCourtyardWallTexture(tileSize, 'h');
    const vTex = this.makeCourtyardWallTexture(tileSize, 'v');
    const gateTex = this.makeCourtyardGateTexture(tileSize);

    for (const b of BUILDINGS) {
      if (b.kind === 'dock') continue;
      const left = clamp(b.x - 1, 1, mapData.width - 2);
      const right = clamp(b.x + b.w, 1, mapData.width - 2);
      const top = clamp(b.y - 1, 1, mapData.height - 2);
      const bottom = clamp(b.y + b.h, 1, mapData.height - 2);
      const gateSide = this.pickGateSide(left, right, top, bottom);
      const gateMidX = Math.floor((left + right) / 2);
      const gateMidY = Math.floor((top + bottom) / 2);

      for (let x = left; x <= right; x += 1) {
        if (!(gateSide === 'north' && x === gateMidX)) {
          const sTop = Sprite.from(hTex);
          sTop.anchor.set(0.5, 0.5);
          sTop.x = (x + 0.5) * tileSize;
          sTop.y = (top + 0.5) * tileSize;
          layer.addChild(sTop);
        }
        if (!(gateSide === 'south' && x === gateMidX)) {
          const sBottom = Sprite.from(hTex);
          sBottom.anchor.set(0.5, 0.5);
          sBottom.x = (x + 0.5) * tileSize;
          sBottom.y = (bottom + 0.5) * tileSize;
          layer.addChild(sBottom);
        }
      }

      for (let y = top; y <= bottom; y += 1) {
        if (!(gateSide === 'west' && y === gateMidY)) {
          const sLeft = Sprite.from(vTex);
          sLeft.anchor.set(0.5, 0.5);
          sLeft.x = (left + 0.5) * tileSize;
          sLeft.y = (y + 0.5) * tileSize;
          layer.addChild(sLeft);
        }
        if (!(gateSide === 'east' && y === gateMidY)) {
          const sRight = Sprite.from(vTex);
          sRight.anchor.set(0.5, 0.5);
          sRight.x = (right + 0.5) * tileSize;
          sRight.y = (y + 0.5) * tileSize;
          layer.addChild(sRight);
        }
      }

      const gate = Sprite.from(gateTex);
      gate.anchor.set(0.5, 0.5);
      if (gateSide === 'north') {
        gate.x = (gateMidX + 0.5) * tileSize;
        gate.y = (top + 0.5) * tileSize;
      } else if (gateSide === 'south') {
        gate.x = (gateMidX + 0.5) * tileSize;
        gate.y = (bottom + 0.5) * tileSize;
      } else if (gateSide === 'west') {
        gate.x = (left + 0.5) * tileSize;
        gate.y = (gateMidY + 0.5) * tileSize;
        gate.rotation = Math.PI / 2;
      } else {
        gate.x = (right + 0.5) * tileSize;
        gate.y = (gateMidY + 0.5) * tileSize;
        gate.rotation = Math.PI / 2;
      }
      layer.addChild(gate);
    }
  }

  private pickGateSide(
    left: number,
    right: number,
    top: number,
    bottom: number
  ): 'north' | 'south' | 'west' | 'east' {
    let north = 0;
    let south = 0;
    let west = 0;
    let east = 0;

    for (let x = left; x <= right; x += 1) {
      if (top - 1 >= 0 && mapData.layers.roads[top - 1][x] > 0) north += 1;
      if (bottom + 1 < mapData.height && mapData.layers.roads[bottom + 1][x] > 0) south += 1;
    }
    for (let y = top; y <= bottom; y += 1) {
      if (left - 1 >= 0 && mapData.layers.roads[y][left - 1] > 0) west += 1;
      if (right + 1 < mapData.width && mapData.layers.roads[y][right + 1] > 0) east += 1;
    }

    const best = Math.max(north, south, west, east);
    if (best <= 0) return 'south';
    if (best === north) return 'north';
    if (best === south) return 'south';
    if (best === west) return 'west';
    return 'east';
  }

  private buildActors(): void {
    const tileSize = mapData.tileSize;
    this.playerTextures = [
      this.makeStyledTile(tileSize, '#0f766e', '#14b8a6', 'player'),
      this.makeStyledTile(tileSize, '#115e59', '#2dd4bf', 'player_alt'),
    ];
    this.npcTextures = [
      this.makeStyledTile(tileSize, '#b45309', '#f59e0b', 'npc'),
      this.makeStyledTile(tileSize, '#9a3412', '#fbbf24', 'npc_alt'),
    ];

    const player = Sprite.from(this.playerTextures[0]);
    player.width = tileSize * 0.98;
    player.height = tileSize * 0.98;
    player.anchor.set(0.5, 0.5);
    const spawn = this.options.initialPlayerTile ?? mapData.spawn;
    player.x = (spawn.x + 0.5) * tileSize;
    player.y = (spawn.y + 0.5) * tileSize;
    this.player = player;
    this.actorLayer.addChild(player);

    for (const npc of npcData) {
      const npcSprite = Sprite.from(this.npcTextures[0]);
      npcSprite.width = tileSize * 0.95;
      npcSprite.height = tileSize * 0.95;
      npcSprite.anchor.set(0.5, 0.5);
      npcSprite.x = (npc.x + 0.5) * tileSize;
      npcSprite.y = (npc.y + 0.5) * tileSize;
      npcSprite.eventMode = 'static';
      npcSprite.cursor = 'pointer';
      npcSprite.on('pointertap', () => {
        this.options.onInteract?.({ id: npc.id, label: npc.label, kind: 'npc' });
      });
      this.actorLayer.addChild(npcSprite);
      this.interactables.push({
        id: npc.id,
        label: CHARACTERS[npc.id]?.name ?? npc.label,
        kind: 'npc',
        sprite: npcSprite,
      });

      const nameText = new Text({
        text: CHARACTERS[npc.id]?.name ?? npc.label,
        style: {
          fill: 0xfef3c7,
          fontSize: 14,
          fontFamily: 'KaiTi, STKaiti, serif',
          stroke: { color: 0x0f172a, width: 3 },
        },
      });
      nameText.anchor.set(0.5, 1);
      nameText.x = npcSprite.x;
      nameText.y = npcSprite.y - tileSize * 0.48;
      this.actorLayer.addChild(nameText);
      this.npcActors.push({
        sprite: npcSprite,
        nameText,
        baseX: npcSprite.x,
        baseY: npcSprite.y,
        phase: Math.random() * Math.PI * 2,
      });
    }

    for (const trigger of triggerData) {
      const triggerSprite = Sprite.from(this.makeStyledTile(tileSize, '#0ea5e9', '#38bdf8', 'trigger'));
      triggerSprite.width = tileSize * 0.4;
      triggerSprite.height = tileSize * 0.4;
      triggerSprite.anchor.set(0.5, 0.5);
      triggerSprite.x = (trigger.x + 0.5) * tileSize;
      triggerSprite.y = (trigger.y + 0.5) * tileSize;
      triggerSprite.alpha = 0.85;
      triggerSprite.eventMode = 'static';
      triggerSprite.cursor = 'pointer';
      triggerSprite.on('pointertap', () => {
        this.options.onInteract?.({ id: trigger.id, label: trigger.label, kind: 'trigger' });
      });
      this.actorLayer.addChild(triggerSprite);
      this.interactables.push({
        id: trigger.id,
        label: trigger.label,
        kind: 'trigger',
        sprite: triggerSprite,
      });
    }
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    this.lastKey = key;
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key) || this.isInteractKey(event)) {
      event.preventDefault();
    }
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
      this.pressedKeys.add(key);
      return;
    }
    if (this.isInteractKey(event) && this.nearest) {
      if (event.repeat) return;
      const now = performance.now();
      if (now < this.interactionEnabledAt) return;
      if (now - this.lastInteractAt < 220) return;
      this.lastInteractAt = now;
      this.interactionEnabledAt = now + 240;
      this.lastAction = `interact:${this.nearest.kind}:${this.nearest.id}`;
      this.emitDebug();
      this.options.onInteract?.({ id: this.nearest.id, label: this.nearest.label, kind: this.nearest.kind });
      return;
    }
    if (this.isInteractKey(event) && !this.nearest) {
      this.lastAction = 'interact:no-target';
      this.emitDebug();
    }
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.pressedKeys.delete(event.key.toLowerCase());
  };

  private readonly onHostPointerDown = (): void => {
    this.host?.focus();
    this.lastAction = 'host:pointerdown-focus';
    this.emitDebug();
  };

  private readonly onWindowBlur = (): void => {
    this.pressedKeys.clear();
  };

  private readonly onTick = (): void => {
    if (this.destroyed || !this.player) return;

    const app = this.pixi.getApp();
    const dt = app.ticker.deltaMS / 1000;
    this.tickTime += dt;
    const speed = 160;
    let dx = 0;
    let dy = 0;

    if (this.pressedKeys.has('arrowup') || this.pressedKeys.has('w')) dy -= 1;
    if (this.pressedKeys.has('arrowdown') || this.pressedKeys.has('s')) dy += 1;
    if (this.pressedKeys.has('arrowleft') || this.pressedKeys.has('a')) dx -= 1;
    if (this.pressedKeys.has('arrowright') || this.pressedKeys.has('d')) dx += 1;

    const isMoving = dx !== 0 || dy !== 0;
    if (isMoving) {
      const len = Math.hypot(dx, dy);
      const step = speed * dt;
      const vx = (dx / len) * step;
      const vy = (dy / len) * step;

      const nextX = this.player.x + vx;
      const nextY = this.player.y + vy;
      if (!this.isBlocked(nextX, this.player.y)) this.player.x = nextX;
      if (!this.isBlocked(this.player.x, nextY)) this.player.y = nextY;
    }

    if (isMoving) {
      this.playerMoveClock += dt * 8.5;
      this.player.texture = this.playerTextures[Math.floor(this.playerMoveClock) % 2] ?? this.player.texture;
      this.player.rotation = Math.sin(this.playerMoveClock * 0.9) * 0.03;
    } else {
      this.playerMoveClock = 0;
      if (this.playerTextures[0]) this.player.texture = this.playerTextures[0];
      this.player.rotation *= 0.82;
    }

    for (const npc of this.npcActors) {
      const sway = Math.sin(this.tickTime * 1.5 + npc.phase);
      npc.sprite.y = npc.baseY + sway * 1.8;
      npc.sprite.texture = this.npcTextures[Math.floor(this.tickTime * 2.1 + npc.phase) % 2] ?? npc.sprite.texture;
      npc.sprite.rotation = sway * 0.015;
      npc.nameText.x = npc.sprite.x;
      npc.nameText.y = npc.sprite.y - mapData.tileSize * 0.52;
      npc.nameText.alpha = 0.94 + Math.max(0, sway) * 0.06;
    }

    this.player.x = clamp(this.player.x, mapData.tileSize * 0.5, mapData.width * mapData.tileSize - mapData.tileSize * 0.5);
    this.player.y = clamp(this.player.y, mapData.tileSize * 0.5, mapData.height * mapData.tileSize - mapData.tileSize * 0.5);

    this.updateNearest();
    this.updateCamera();
  };

  private isBlocked(px: number, py: number): boolean {
    const tileSize = mapData.tileSize;
    const tx = Math.floor(px / tileSize);
    const ty = Math.floor(py / tileSize);
    if (tx < 0 || ty < 0 || tx >= collisionData.width || ty >= collisionData.height) return true;
    return collisionData.grid[ty][tx] === 1;
  }

  private updateNearest(): void {
    if (!this.player) return;
    const radius = mapData.tileSize * 1.85;
    let nearest: InteractableEntity | null = null;
    let nearestDist = Number.POSITIVE_INFINITY;
    let nearestNpc: InteractableEntity | null = null;
    let nearestNpcDist = Number.POSITIVE_INFINITY;

    for (const entity of this.interactables) {
      const dist = Math.hypot(this.player.x - entity.sprite.x, this.player.y - entity.sprite.y);
      entity.sprite.alpha = entity.kind === 'trigger' ? 0.85 : 1;
      if (dist > radius) continue;
      if (entity.kind === 'npc' && dist < nearestNpcDist) {
        nearestNpc = entity;
        nearestNpcDist = dist;
      }
      if (dist < nearestDist) {
        nearest = entity;
        nearestDist = dist;
      }
    }

    this.nearest = nearestNpc ?? nearest;
    this.lastNearestDistance = this.nearest
      ? Math.hypot(this.player.x - this.nearest.sprite.x, this.player.y - this.nearest.sprite.y)
      : null;
    if (nearest) {
      nearest.sprite.alpha = 1;
      this.hintText.visible = true;
      this.hintText.text = `空格交互: ${nearest.label}`;
      this.hintText.position.set(this.player.x, this.player.y - mapData.tileSize * 0.85);
    } else {
      this.hintText.visible = false;
      this.hintText.text = '';
    }
    this.emitDebug();
  }

  private updateCamera(): void {
    if (!this.player) return;
    const app = this.pixi.getApp();
    const vw = app.renderer.width;
    const vh = app.renderer.height;
    const mapW = mapData.width * mapData.tileSize;
    const mapH = mapData.height * mapData.tileSize;

    let camX = this.player.x;
    let camY = this.player.y;

    if (mapW > vw) camX = clamp(camX, vw / 2, mapW - vw / 2);
    else camX = mapW / 2;

    if (mapH > vh) camY = clamp(camY, vh / 2, mapH - vh / 2);
    else camY = mapH / 2;

    this.camera.position.set(vw * 0.5 - camX, vh * 0.5 - camY);
  }

  private addScenerySprites(treeTexture: Texture, reedTexture: Texture, lanternTexture: Texture): void {
    const tileSize = mapData.tileSize;
    const treeSpots: Array<[number, number]> = [
      [2, 2], [7, 3], [9, 2], [14, 4], [22, 4], [25, 6], [5, 15], [11, 16], [16, 14], [27, 13],
    ];
    for (const [x, y] of treeSpots) {
      if (x <= 0 || y <= 0 || x >= mapData.width - 1 || y >= mapData.height - 1) continue;
      if (collisionData.grid[y][x] === 1) continue;
      const tree = Sprite.from(treeTexture);
      tree.width = tileSize * 0.9;
      tree.height = tileSize * 0.9;
      tree.anchor.set(0.5, 0.75);
      tree.x = (x + 0.5) * tileSize;
      tree.y = (y + 0.8) * tileSize;
      tree.alpha = 0.9;
      this.worldLayer.addChild(tree);
    }

    const reedSpots: Array<[number, number]> = [
      [18, 10], [18, 12], [19, 8], [22, 9], [23, 12], [24, 14], [26, 11],
    ];
    for (const [x, y] of reedSpots) {
      const reed = Sprite.from(reedTexture);
      reed.width = tileSize * 0.55;
      reed.height = tileSize * 0.72;
      reed.anchor.set(0.5, 0.85);
      reed.x = (x + 0.5) * tileSize;
      reed.y = (y + 0.86) * tileSize;
      reed.alpha = 0.8;
      this.worldLayer.addChild(reed);
    }

    const lanternSpots: Array<[number, number]> = [
      [8, 10], [12, 10], [16, 10], [20, 10], [8, 6], [15, 6],
    ];
    for (const [x, y] of lanternSpots) {
      const lantern = Sprite.from(lanternTexture);
      lantern.width = tileSize * 0.28;
      lantern.height = tileSize * 0.45;
      lantern.anchor.set(0.5, 1);
      lantern.x = (x + 0.5) * tileSize;
      lantern.y = (y + 0.78) * tileSize;
      lantern.alpha = 0.9;
      this.worldLayer.addChild(lantern);
    }
  }

  private addAmbience(): void {
    const tileSize = mapData.tileSize;
    const addMist = (x: number, y: number, w: number, h: number, alpha: number) => {
      const mist = Sprite.from(this.makeMistTexture(128, 96));
      mist.anchor.set(0.5, 0.5);
      mist.width = w;
      mist.height = h;
      mist.x = x;
      mist.y = y;
      mist.alpha = alpha;
      this.ambienceLayer.addChild(mist);
    };

    const addVignette = () => {
      const mapW = mapData.width * tileSize;
      const mapH = mapData.height * tileSize;
      const vignette = Sprite.from(this.makeVignetteTexture(256, 256));
      vignette.anchor.set(0.5, 0.5);
      vignette.width = mapW;
      vignette.height = mapH;
      vignette.x = mapW / 2;
      vignette.y = mapH / 2;
      vignette.alpha = 0.28;
      this.ambienceLayer.addChild(vignette);
    };

    addMist(7 * tileSize, 4 * tileSize, 260, 120, 0.2);
    addMist(22 * tileSize, 12 * tileSize, 300, 150, 0.18);
    addMist(15 * tileSize, 16 * tileSize, 240, 100, 0.12);
    addVignette();
  }

  private isInteractKey(event: KeyboardEvent): boolean {
    return event.code === 'Space' || event.key === ' ';
  }

  private makeArchwayTexture(width: number, height: number, title: string): Texture {
    const w = Math.max(48, Math.round(width));
    const h = Math.max(44, Math.round(height));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return makeSolidTexture('#5b341c', Math.max(16, Math.round(width / 3)));

    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0, h - 8, w, 6);

    ctx.fillStyle = '#6a3f20';
    ctx.fillRect(Math.round(w * 0.1), Math.round(h * 0.34), 8, Math.round(h * 0.62));
    ctx.fillRect(Math.round(w * 0.9) - 8, Math.round(h * 0.34), 8, Math.round(h * 0.62));

    const roofGrad = ctx.createLinearGradient(0, 2, 0, h * 0.38);
    roofGrad.addColorStop(0, '#6b3127');
    roofGrad.addColorStop(1, '#4b1f1a');
    ctx.fillStyle = roofGrad;
    ctx.beginPath();
    ctx.moveTo(Math.round(w * 0.06), Math.round(h * 0.3));
    ctx.quadraticCurveTo(Math.round(w * 0.5), 1, Math.round(w * 0.94), Math.round(h * 0.3));
    ctx.lineTo(Math.round(w * 0.9), Math.round(h * 0.4));
    ctx.quadraticCurveTo(Math.round(w * 0.5), Math.round(h * 0.12), Math.round(w * 0.1), Math.round(h * 0.4));
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#392316';
    const boardW = Math.round(w * 0.36);
    const boardH = Math.round(h * 0.2);
    const boardX = Math.round((w - boardW) / 2);
    const boardY = Math.round(h * 0.34);
    ctx.fillRect(boardX, boardY, boardW, boardH);
    ctx.strokeStyle = '#caa56d';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(boardX + 0.5, boardY + 0.5, boardW - 1, boardH - 1);
    ctx.fillStyle = '#f6deb0';
    ctx.font = `${Math.max(9, Math.round(h * 0.13))}px STKaiti, KaiTi, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, boardX + boardW / 2, boardY + boardH / 2 + 1);

    return Texture.from(canvas);
  }

  private makeBridgeRailTexture(tileSize: number): Texture {
    const w = tileSize;
    const h = Math.max(8, Math.round(tileSize * 0.2));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return makeSolidTexture('#8f6f4f', Math.max(8, Math.round(tileSize * 0.2)));

    ctx.fillStyle = '#8b6b4c';
    ctx.fillRect(0, Math.round(h * 0.3), w, Math.round(h * 0.42));
    ctx.fillStyle = '#6f533d';
    for (let x = 4; x < w - 2; x += 9) {
      ctx.fillRect(x, 0, 3, h);
    }
    ctx.fillStyle = 'rgba(232, 206, 166, 0.32)';
    ctx.fillRect(1, 1, w - 2, 2);
    return Texture.from(canvas);
  }

  private makeCourtyardWallTexture(tileSize: number, orientation: 'h' | 'v'): Texture {
    const w = orientation === 'h' ? tileSize : Math.max(8, Math.round(tileSize * 0.28));
    const h = orientation === 'h' ? Math.max(8, Math.round(tileSize * 0.28)) : tileSize;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return makeSolidTexture('#d8d0c0', Math.max(8, Math.round(tileSize * 0.28)));

    ctx.fillStyle = '#d8d0c0';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#b8aa95';
    if (orientation === 'h') {
      ctx.fillRect(0, 0, w, 2);
      for (let x = 3; x < w - 2; x += 8) {
        ctx.fillRect(x, 3, 2, h - 5);
      }
    } else {
      ctx.fillRect(0, 0, 2, h);
      for (let y = 3; y < h - 2; y += 8) {
        ctx.fillRect(3, y, w - 5, 2);
      }
    }
    ctx.strokeStyle = 'rgba(72, 58, 42, 0.35)';
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
    return Texture.from(canvas);
  }

  private makeCourtyardGateTexture(tileSize: number): Texture {
    const w = tileSize;
    const h = Math.max(8, Math.round(tileSize * 0.3));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return makeSolidTexture('#6a3f20', Math.max(8, Math.round(tileSize * 0.25)));

    ctx.fillStyle = '#6a3f20';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#4f2f1a';
    ctx.fillRect(Math.round(w * 0.12), 1, Math.round(w * 0.3), h - 2);
    ctx.fillRect(Math.round(w * 0.58), 1, Math.round(w * 0.3), h - 2);
    ctx.fillStyle = '#dcb884';
    ctx.fillRect(Math.round(w * 0.48), Math.round(h * 0.35), 3, 3);
    ctx.strokeStyle = '#c8aa7a';
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
    return Texture.from(canvas);
  }

  private makeStreetStallTexture(width: number, height: number, warm: boolean): Texture {
    const w = Math.max(20, Math.round(width));
    const h = Math.max(20, Math.round(height));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return makeSolidTexture('#7b4f29', Math.max(8, Math.round(width * 0.2)));

    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(Math.round(w * 0.12), h - 5, Math.round(w * 0.76), 4);

    ctx.fillStyle = '#7b4f29';
    ctx.fillRect(Math.round(w * 0.16), Math.round(h * 0.35), 3, Math.round(h * 0.5));
    ctx.fillRect(Math.round(w * 0.84) - 3, Math.round(h * 0.35), 3, Math.round(h * 0.5));
    ctx.fillRect(Math.round(w * 0.2), Math.round(h * 0.7), Math.round(w * 0.6), 5);

    ctx.fillStyle = warm ? '#8b2d1f' : '#365f8c';
    ctx.beginPath();
    ctx.moveTo(Math.round(w * 0.08), Math.round(h * 0.35));
    ctx.lineTo(Math.round(w * 0.92), Math.round(h * 0.35));
    ctx.lineTo(Math.round(w * 0.82), Math.round(h * 0.1));
    ctx.lineTo(Math.round(w * 0.18), Math.round(h * 0.1));
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = warm ? '#d49c6a' : '#9fc3de';
    for (let x = Math.round(w * 0.12); x < Math.round(w * 0.88); x += 7) {
      ctx.fillRect(x, Math.round(h * 0.16), 3, 2);
    }
    return Texture.from(canvas);
  }

  private makeClotheslineTexture(width: number, height: number): Texture {
    const w = Math.max(40, Math.round(width));
    const h = Math.max(18, Math.round(height));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return makeSolidTexture('#5b4632', 16);

    ctx.fillStyle = '#5b4632';
    ctx.fillRect(1, Math.round(h * 0.12), 3, h - 3);
    ctx.fillRect(w - 4, Math.round(h * 0.12), 3, h - 3);

    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(2, Math.round(h * 0.2));
    ctx.quadraticCurveTo(w * 0.5, Math.round(h * 0.34), w - 2, Math.round(h * 0.2));
    ctx.stroke();

    const clothColors = ['#9c2a2a', '#2f855a', '#365f8c', '#8b5a2b'];
    for (let i = 0; i < 4; i += 1) {
      const cw = Math.max(6, Math.round(w * 0.09));
      const ch = Math.max(5, Math.round(h * 0.24));
      const x = Math.round((w * (0.16 + i * 0.2)));
      const y = Math.round(h * 0.28 + (i % 2) * 1.5);
      ctx.fillStyle = clothColors[i];
      ctx.fillRect(x, y, cw, ch);
    }
    return Texture.from(canvas);
  }

  private makeLionLanternSetTexture(width: number, height: number): Texture {
    const w = Math.max(28, Math.round(width));
    const h = Math.max(22, Math.round(height));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return makeSolidTexture('#6a3f20', 16);

    ctx.fillStyle = '#9a7b58';
    ctx.fillRect(Math.round(w * 0.16), Math.round(h * 0.72), Math.round(w * 0.22), Math.round(h * 0.2));
    ctx.fillRect(Math.round(w * 0.62), Math.round(h * 0.72), Math.round(w * 0.22), Math.round(h * 0.2));
    ctx.fillStyle = '#6f533d';
    ctx.fillRect(Math.round(w * 0.2), Math.round(h * 0.64), Math.round(w * 0.14), Math.round(h * 0.08));
    ctx.fillRect(Math.round(w * 0.66), Math.round(h * 0.64), Math.round(w * 0.14), Math.round(h * 0.08));

    ctx.fillStyle = '#6b2b22';
    ctx.fillRect(Math.round(w * 0.47), Math.round(h * 0.2), Math.round(w * 0.06), Math.round(h * 0.45));
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(Math.round(w * 0.5), Math.round(h * 0.16), Math.round(w * 0.1), Math.round(h * 0.1), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(252, 211, 77, 0.38)';
    ctx.beginPath();
    ctx.ellipse(Math.round(w * 0.5), Math.round(h * 0.16), Math.round(w * 0.15), Math.round(h * 0.14), 0, 0, Math.PI * 2);
    ctx.fill();
    return Texture.from(canvas);
  }

  private makeStoneWearTexture(tileSize: number): Texture {
    const s = tileSize;
    const canvas = document.createElement('canvas');
    canvas.width = s;
    canvas.height = s;
    const ctx = canvas.getContext('2d');
    if (!ctx) return makeSolidTexture('#8f8574', Math.max(8, Math.round(tileSize * 0.5)));

    ctx.clearRect(0, 0, s, s);
    ctx.fillStyle = 'rgba(170, 160, 142, 0.16)';
    for (let i = 0; i < 7; i += 1) {
      const x = (i * 9) % s;
      const y = (i * 13) % s;
      ctx.fillRect(x, y, 8, 4);
    }
    ctx.strokeStyle = 'rgba(214, 205, 184, 0.24)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(2, s * 0.25);
    ctx.lineTo(s - 2, s * 0.75);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(2, s * 0.7);
    ctx.lineTo(s - 2, s * 0.35);
    ctx.stroke();
    return Texture.from(canvas);
  }

  private makeStyledTile(size: number, base: string, accent: string, kind: string): Texture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return makeSolidTexture(base, size);

    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(0,0,0,0.22)';
    ctx.strokeRect(0.5, 0.5, size - 1, size - 1);

    if (kind === 'grass' || kind === 'tree') {
      ctx.fillStyle = accent;
      for (let i = 0; i < 14; i += 1) {
        const x = (i * 7) % size;
        const y = (i * 11) % size;
        ctx.fillRect(x, y, 2, 4);
      }
      if (kind === 'grass') {
        ctx.fillStyle = 'rgba(223, 237, 209, 0.08)';
        ctx.fillRect(0, 0, size, size * 0.35);
      }
    } else if (kind === 'road' || kind === 'bridge') {
      ctx.fillStyle = accent;
      for (let y = 4; y < size; y += 8) {
        for (let x = (y / 4) % 2 === 0 ? 2 : 5; x < size; x += 8) {
          ctx.fillRect(x, y, 5, 3);
        }
      }
      if (kind === 'bridge') {
        ctx.strokeStyle = 'rgba(225, 200, 158, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(2, size * 0.18);
        ctx.quadraticCurveTo(size * 0.5, 0, size - 2, size * 0.18);
        ctx.stroke();
      }
    } else if (kind === 'water') {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(2, size * 0.3);
      ctx.quadraticCurveTo(size * 0.35, size * 0.2, size * 0.68, size * 0.32);
      ctx.quadraticCurveTo(size * 0.85, size * 0.4, size - 2, size * 0.28);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(2, size * 0.68);
      ctx.quadraticCurveTo(size * 0.28, size * 0.58, size * 0.62, size * 0.73);
      ctx.quadraticCurveTo(size * 0.83, size * 0.82, size - 2, size * 0.7);
      ctx.stroke();
      ctx.fillStyle = 'rgba(196, 228, 244, 0.1)';
      ctx.fillRect(0, 0, size, size * 0.22);
    } else if (kind === 'water_deep') {
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = 'rgba(18, 34, 52, 0.26)';
      for (let i = 0; i < 8; i += 1) {
        ctx.fillRect((i * 5) % size, (i * 9) % size, 4, 2);
      }
    } else if (kind === 'shore') {
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = accent;
      for (let i = 0; i < size; i += 5) {
        ctx.fillRect(i, size - 6, 3, 5);
      }
    } else if (kind === 'roof') {
      ctx.fillStyle = accent;
      for (let y = 2; y < size * 0.52; y += 6) {
        ctx.fillRect(2, y, size - 4, 3);
      }
      ctx.fillStyle = 'rgba(20,20,20,0.18)';
      ctx.fillRect(0, size * 0.56, size, size * 0.3);
    } else if (kind === 'wall') {
      ctx.fillStyle = accent;
      for (let i = 1; i < size; i += 10) {
        ctx.fillRect(0, i, size, 1);
      }
      ctx.fillStyle = '#4f4f4f';
      ctx.fillRect(size * 0.38, size * 0.28, size * 0.24, size * 0.24);
    } else if (kind.startsWith('player') || kind.startsWith('npc') || kind === 'trigger') {
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.beginPath();
      ctx.ellipse(size / 2, size * 0.86, size * 0.26, size * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = base;
      ctx.beginPath();
      ctx.arc(size / 2, size * 0.30, size * 0.16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.fillRect(size * 0.34, size * 0.46, size * 0.32, size * 0.26);
      ctx.fillStyle = base;
      ctx.fillRect(size * 0.35, size * 0.72, size * 0.1, size * 0.18);
      ctx.fillRect(size * 0.55, size * 0.72, size * 0.1, size * 0.18);
      ctx.fillRect(size * 0.23, size * 0.5, size * 0.1, size * 0.12);
      ctx.fillRect(size * 0.67, size * 0.5, size * 0.1, size * 0.12);
      if (kind === 'trigger') {
        ctx.clearRect(size * 0.2, size * 0.2, size * 0.6, size * 0.58);
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.moveTo(size * 0.5, size * 0.16);
        ctx.lineTo(size * 0.66, size * 0.46);
        ctx.lineTo(size * 0.5, size * 0.84);
        ctx.lineTo(size * 0.34, size * 0.46);
        ctx.closePath();
        ctx.fill();
      }
    }

    return Texture.from(canvas);
  }

  private makeBuildingFacadeTexture(building: BuildingDef, tileSize: number): Texture {
    const width = Math.max(64, Math.round(building.w * tileSize));
    const height = Math.max(70, Math.round(building.h * tileSize * 0.9));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return makeSolidTexture('#1f2937', tileSize);

    const paletteByKind: Record<BuildingDef['kind'], { roof: string; wall: string; trim: string; door: string }> = {
      inn: { roof: '#4a1f1d', wall: '#d7c3a4', trim: '#6b341f', door: '#4b2e1a' },
      market: { roof: '#6a2f1f', wall: '#c9b08b', trim: '#7b4f29', door: '#5a3d22' },
      teahouse: { roof: '#3f2f26', wall: '#d8d0c0', trim: '#355e4f', door: '#3f2d20' },
      yamen: { roof: '#2d3748', wall: '#d9d4cb', trim: '#7b1f1f', door: '#334155' },
      clinic: { roof: '#4a3a28', wall: '#d4ccb9', trim: '#4a6f3b', door: '#4b3520' },
      dock: { roof: '#5a3d2a', wall: '#8f775b', trim: '#67472f', door: '#4b3520' },
    };
    const p = paletteByKind[building.kind];
    const plaqueByKind: Record<BuildingDef['kind'], string> = {
      inn: '客栈',
      market: '市集',
      teahouse: '茶楼',
      yamen: '巡检',
      clinic: '药庐',
      dock: '船埠',
    };

    const roofHeight = Math.round(height * 0.34);
    const wallTop = Math.round(height * 0.3);
    const eaveDepth = Math.round(Math.max(6, tileSize * 0.35));

    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.beginPath();
    ctx.ellipse(width / 2, height - 5, width * 0.42, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = p.wall;
    ctx.fillRect(7, wallTop, width - 14, height - wallTop - 9);

    ctx.fillStyle = p.trim;
    for (let x = 10; x < width - 10; x += Math.max(14, Math.round(tileSize * 0.7))) {
      ctx.fillRect(x, wallTop + 3, 3, height - wallTop - 16);
    }

    const roofGradient = ctx.createLinearGradient(0, 0, 0, roofHeight + 8);
    roofGradient.addColorStop(0, this.lightenHex(p.roof, 18));
    roofGradient.addColorStop(1, p.roof);
    ctx.fillStyle = roofGradient;
    ctx.beginPath();
    ctx.moveTo(4, roofHeight + eaveDepth);
    ctx.quadraticCurveTo(width * 0.5, 2, width - 4, roofHeight + eaveDepth);
    ctx.lineTo(width - 10, roofHeight + eaveDepth + 7);
    ctx.quadraticCurveTo(width * 0.5, 10, 10, roofHeight + eaveDepth + 7);
    ctx.closePath();
    ctx.fill();

    // Secondary roof strip makes pavilion-like layered eaves.
    const midRoofY = Math.round(roofHeight * 0.52);
    ctx.fillStyle = this.lightenHex(p.roof, 8);
    ctx.beginPath();
    ctx.moveTo(Math.round(width * 0.13), midRoofY);
    ctx.quadraticCurveTo(width * 0.5, midRoofY - Math.round(tileSize * 0.2), Math.round(width * 0.87), midRoofY);
    ctx.lineTo(Math.round(width * 0.84), midRoofY + Math.round(tileSize * 0.16));
    ctx.quadraticCurveTo(width * 0.5, midRoofY - Math.round(tileSize * 0.05), Math.round(width * 0.16), midRoofY + Math.round(tileSize * 0.16));
    ctx.closePath();
    ctx.fill();

    // Flying eaves on both sides.
    ctx.fillStyle = this.lightenHex(p.roof, 14);
    ctx.beginPath();
    ctx.moveTo(5, roofHeight + eaveDepth - 4);
    ctx.quadraticCurveTo(0, roofHeight + eaveDepth - 10, 7, roofHeight + eaveDepth - 16);
    ctx.lineTo(12, roofHeight + eaveDepth - 9);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(width - 5, roofHeight + eaveDepth - 4);
    ctx.quadraticCurveTo(width, roofHeight + eaveDepth - 10, width - 7, roofHeight + eaveDepth - 16);
    ctx.lineTo(width - 12, roofHeight + eaveDepth - 9);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    for (let y = Math.round(tileSize * 0.28); y < roofHeight + eaveDepth - 6; y += Math.round(tileSize * 0.2)) {
      ctx.fillRect(10, y, width - 20, 2);
    }

    const windowY = Math.round(wallTop + tileSize * 0.55);
    const windowW = Math.round(Math.max(11, width * 0.13));
    const windowH = Math.round(Math.max(15, tileSize * 0.56));
    const sidePad = Math.round(Math.max(11, width * 0.1));
    const gap = Math.round(Math.max(8, width * 0.12));
    const leftWindowX = sidePad;
    const rightWindowX = width - sidePad - windowW;
    this.drawLatticeWindow(ctx, leftWindowX, windowY, windowW, windowH, gap);
    this.drawLatticeWindow(ctx, rightWindowX, windowY, windowW, windowH, gap);
    if (building.w >= 4) {
      const middleX = Math.round(width * 0.5 - windowW / 2);
      this.drawLatticeWindow(ctx, middleX, windowY - 2, windowW, windowH, gap);
    }

    const doorWidth = Math.round(Math.max(14, width * 0.16));
    const doorHeight = Math.round(Math.max(20, height * 0.23));
    const doorX = Math.round(width * 0.5 - doorWidth / 2);
    const doorY = height - doorHeight - 8;
    ctx.fillStyle = p.door;
    ctx.fillRect(doorX, doorY, doorWidth, doorHeight);
    ctx.fillStyle = '#f8e7b4';
    ctx.fillRect(doorX + Math.round(doorWidth * 0.62), doorY + Math.round(doorHeight * 0.45), 2, 2);

    const hasSignboard = building.kind === 'inn' || building.kind === 'clinic' || building.kind === 'teahouse';
    if (hasSignboard) {
      const sw = Math.round(Math.max(24, width * 0.23));
      const sh = Math.round(Math.max(13, tileSize * 0.52));
      const sx = Math.round(width * 0.5 - sw / 2);
      const sy = Math.round(wallTop + tileSize * 0.35);
      ctx.fillStyle = '#3f2716';
      ctx.fillRect(sx, sy, sw, sh);
      ctx.strokeStyle = '#b38b55';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(sx + 0.5, sy + 0.5, sw - 1, sh - 1);
      ctx.fillStyle = '#f5deb3';
      ctx.font = `${Math.max(10, Math.round(tileSize * 0.24))}px STKaiti, KaiTi, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(plaqueByKind[building.kind], sx + sw / 2, sy + sh / 2 + 1);
    }

    if (building.kind === 'market') {
      ctx.fillStyle = 'rgba(120, 42, 24, 0.78)';
      const awningY = wallTop + Math.round(tileSize * 0.25);
      ctx.fillRect(10, awningY, width - 20, Math.round(tileSize * 0.45));
      for (let x = 14; x < width - 14; x += 12) {
        ctx.fillStyle = x % 24 === 0 ? '#c98d4d' : '#8b5a2b';
        ctx.fillRect(x, awningY, 8, Math.round(tileSize * 0.45));
      }
    }

    if (building.kind === 'dock') {
      // Waterside stepped timber platform.
      const tier1Y = height - Math.round(tileSize * 0.48);
      const tier2Y = height - Math.round(tileSize * 0.3);
      const tier3Y = height - Math.round(tileSize * 0.15);
      ctx.fillStyle = '#a0805c';
      ctx.fillRect(5, tier1Y, width - 10, 5);
      ctx.fillStyle = '#8d6d4f';
      ctx.fillRect(7, tier2Y, width - 14, 5);
      ctx.fillStyle = '#7a5c43';
      ctx.fillRect(9, tier3Y, width - 18, 4);
      for (let x = 11; x < width - 11; x += 14) {
        ctx.fillStyle = '#6f533e';
        ctx.fillRect(x, wallTop + 12, 3, tier3Y - wallTop - 8);
      }
      ctx.fillStyle = 'rgba(216, 232, 242, 0.35)';
      ctx.fillRect(9, tier3Y + 5, width - 18, 2);
    }

    return Texture.from(canvas);
  }

  private drawLatticeWindow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    gap: number
  ): void {
    ctx.fillStyle = '#213246';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#d8c3a5';
    ctx.lineWidth = 1.3;
    ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);
    ctx.strokeStyle = 'rgba(216, 195, 165, 0.7)';
    for (let gx = x + 3; gx < x + width - 2; gx += Math.max(4, Math.round(gap * 0.4))) {
      ctx.beginPath();
      ctx.moveTo(gx, y + 2);
      ctx.lineTo(gx, y + height - 2);
      ctx.stroke();
    }
    for (let gy = y + 4; gy < y + height - 2; gy += Math.max(4, Math.round(gap * 0.34))) {
      ctx.beginPath();
      ctx.moveTo(x + 2, gy);
      ctx.lineTo(x + width - 2, gy);
      ctx.stroke();
    }
  }

  private lightenHex(hex: string, amount: number): string {
    const raw = hex.replace('#', '');
    if (raw.length !== 6) return hex;
    const n = Number.parseInt(raw, 16);
    const r = clamp(((n >> 16) & 0xff) + amount, 0, 255);
    const g = clamp(((n >> 8) & 0xff) + amount, 0, 255);
    const b = clamp((n & 0xff) + amount, 0, 255);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  private makeMistTexture(width: number, height: number): Texture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return makeSolidTexture('#dbeafe', 32);
    const g = ctx.createRadialGradient(width / 2, height / 2, 6, width / 2, height / 2, Math.max(width, height) * 0.5);
    g.addColorStop(0, 'rgba(214, 231, 235, 0.38)');
    g.addColorStop(0.55, 'rgba(206, 223, 230, 0.18)');
    g.addColorStop(1, 'rgba(206, 223, 230, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
    return Texture.from(canvas);
  }

  private makeVignetteTexture(width: number, height: number): Texture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return makeSolidTexture('#000000', 32);
    const g = ctx.createRadialGradient(width / 2, height / 2, width * 0.22, width / 2, height / 2, width * 0.62);
    g.addColorStop(0, 'rgba(0, 0, 0, 0)');
    g.addColorStop(1, 'rgba(12, 16, 22, 0.95)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
    return Texture.from(canvas);
  }

  private isNearLand(x: number, y: number): boolean {
    const neighbors: Array<[number, number]> = [
      [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
    ];
    return neighbors.some(([nx, ny]) => {
      if (nx < 0 || ny < 0 || nx >= mapData.width || ny >= mapData.height) return false;
      return mapData.layers.ground[ny][nx] !== 2;
    });
  }

  private emitDebug(): void {
    this.options.onDebug?.({
      focused: document.activeElement === this.host,
      nearestId: this.nearest?.id ?? null,
      nearestKind: this.nearest?.kind ?? null,
      nearestLabel: this.nearest?.label ?? null,
      nearestDistance: this.lastNearestDistance,
      canInteract: !!this.nearest,
      lastKey: this.lastKey,
      lastAction: this.lastAction,
      ts: Date.now(),
    });
  }

  getPlayerTilePosition(): { x: number; y: number } | null {
    if (!this.player) return null;
    const t = mapData.tileSize;
    return {
      x: Math.max(0, Math.floor(this.player.x / t)),
      y: Math.max(0, Math.floor(this.player.y / t)),
    };
  }
}

