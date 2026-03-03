import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { LOCATIONS } from '../data/locations';

interface SaveGameSnapshot {
  player: Record<string, unknown>;
  party: string[];
  inventory: Array<{ id: string; count: number }>;
  gold: number;
  currentLocation: string;
  flags: Record<string, boolean | string | number>;
  activeQuests: Record<string, unknown>;
  completedQuests: string[];
  playTime: number;
  visitedLocations: string[];
}

interface SaveSlotData {
  slot: number;
  timestamp: string;
  playTime: number;
  location: string;
  playerName: string;
  level: number;
  data: string;
}

const SAVE_KEY = 'jin-yong-saves';
const MAX_SLOTS = 6;
type PlayerState = ReturnType<typeof useGameStore.getState>['player'];

const isString = (v: unknown): v is string => typeof v === 'string';
const isNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

function isInventoryList(v: unknown): v is Array<{ id: string; count: number }> {
  return Array.isArray(v) && v.every((item) => isObject(item) && isString(item.id) && isNumber(item.count));
}

function isStringList(v: unknown): v is string[] {
  return Array.isArray(v) && v.every(isString);
}

function isSaveGameSnapshot(v: unknown): v is SaveGameSnapshot {
  if (!isObject(v)) return false;
  return (
    isObject(v.player) &&
    isStringList(v.party) &&
    isInventoryList(v.inventory) &&
    isNumber(v.gold) &&
    isString(v.currentLocation) &&
    isObject(v.flags) &&
    isObject(v.activeQuests) &&
    isStringList(v.completedQuests) &&
    isNumber(v.playTime) &&
    isStringList(v.visitedLocations)
  );
}

function normalizePlayer(raw: Record<string, unknown>, fallback: PlayerState) {
  const numberFields: Array<keyof typeof fallback> = [
    'level', 'exp', 'expNext', 'hp', 'hpMax', 'mp', 'mpMax', 'atk', 'def', 'spd', 'wis', 'charm', 'fameGood', 'fameEvil',
  ];
  const normalized = { ...fallback };

  if (isString(raw.name)) normalized.name = raw.name;
  numberFields.forEach((field) => {
    const value = raw[field as string];
    if (isNumber(value)) {
      (normalized as Record<string, unknown>)[field as string] = value;
    }
  });

  if (Array.isArray(raw.skills) && raw.skills.every(isString)) {
    normalized.skills = raw.skills;
  }
  if (
    isObject(raw.equipped) &&
    isString(raw.equipped.weapon) &&
    isString(raw.equipped.armor) &&
    isString(raw.equipped.accessory)
  ) {
    normalized.equipped = {
      weapon: raw.equipped.weapon,
      armor: raw.equipped.armor,
      accessory: raw.equipped.accessory,
    };
  }
  if (isObject(raw.charAffinities)) {
    normalized.charAffinities = Object.fromEntries(
      Object.entries(raw.charAffinities).filter(([, v]) => isNumber(v))
    ) as Record<string, number>;
  }
  if (isObject(raw.sectAffinities)) {
    normalized.sectAffinities = Object.fromEntries(
      Object.entries(raw.sectAffinities).filter(([, v]) => isNumber(v))
    ) as Record<string, number>;
  }
  if (
    isObject(raw.baseStats) &&
    isNumber(raw.baseStats.atk) &&
    isNumber(raw.baseStats.def) &&
    isNumber(raw.baseStats.spd) &&
    isNumber(raw.baseStats.wis) &&
    isNumber(raw.baseStats.charm) &&
    isNumber(raw.baseStats.hpMax) &&
    isNumber(raw.baseStats.mpMax)
  ) {
    normalized.baseStats = {
      atk: raw.baseStats.atk,
      def: raw.baseStats.def,
      spd: raw.baseStats.spd,
      wis: raw.baseStats.wis,
      charm: raw.baseStats.charm,
      hpMax: raw.baseStats.hpMax,
      mpMax: raw.baseStats.mpMax,
    };
  }

  normalized.hp = Math.max(0, Math.min(normalized.hpMax, normalized.hp));
  normalized.mp = Math.max(0, Math.min(normalized.mpMax, normalized.mp));
  return normalized;
}

function isSaveSlotData(v: unknown): v is SaveSlotData {
  if (!isObject(v)) return false;
  if (!isNumber(v.slot) || v.slot < 1 || v.slot > MAX_SLOTS) return false;
  if (!isString(v.timestamp) || !isString(v.location) || !isString(v.playerName) || !isString(v.data)) return false;
  if (!isNumber(v.playTime) || !isNumber(v.level)) return false;

  try {
    const parsed = JSON.parse(v.data);
    return isSaveGameSnapshot(parsed);
  } catch {
    return false;
  }
}

export default function SaveScreen() {
  const gameState = useGameStore();
  const { setScreen, currentLocation, player, gold, playTime } = gameState;
  const [saveSlots, setSaveSlots] = useState<SaveSlotData[]>([]);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save');

  const location = LOCATIONS[currentLocation];

  useEffect(() => {
    loadSaveSlots();
  }, []);

  const loadSaveSlots = () => {
    try {
      const savesJson = localStorage.getItem(SAVE_KEY);
      if (!savesJson) return;

      const raw = JSON.parse(savesJson);
      if (!Array.isArray(raw)) {
        setMessage('存档数据格式无效，已忽略');
        return;
      }

      const validSlots = raw.filter(isSaveSlotData).sort((a, b) => a.slot - b.slot);
      setSaveSlots(validSlots);

      if (validSlots.length !== raw.length) {
        setMessage('检测到异常存档，已自动跳过无效项');
      }
    } catch (e) {
      setMessage('加载存档失败');
      console.error('加载存档失败:', e);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}小时${mins}分钟`;
    return `${mins}分钟`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSave = (slot: number) => {
    try {
      const state = useGameStore.getState();
      const saveData: SaveSlotData = {
        slot,
        timestamp: new Date().toISOString(),
        playTime: state.playTime,
        location: state.currentLocation,
        playerName: state.player.name,
        level: state.player.level,
        data: JSON.stringify({
          player: state.player,
          party: state.party,
          inventory: state.inventory,
          gold: state.gold,
          currentLocation: state.currentLocation,
          flags: state.flags,
          activeQuests: state.activeQuests,
          completedQuests: state.completedQuests,
          playTime: state.playTime,
          visitedLocations: state.visitedLocations,
        }),
      };

      const newSlots = [...saveSlots.filter((s) => s.slot !== slot), saveData].sort((a, b) => a.slot - b.slot);
      localStorage.setItem(SAVE_KEY, JSON.stringify(newSlots));
      setSaveSlots(newSlots);
      setMessage(`已保存到存档 ${slot}`);
      setTimeout(() => setMessage(''), 2000);
    } catch (e) {
      setMessage('保存失败');
      console.error('保存失败:', e);
    }
  };

  const handleLoad = (slotData: SaveSlotData) => {
    try {
      const parsed = JSON.parse(slotData.data);
      if (!isSaveGameSnapshot(parsed)) {
        setMessage('存档结构无效，无法读取');
        return;
      }
      const fallbackPlayer = useGameStore.getState().player;
      const safePlayer = normalizePlayer(parsed.player, fallbackPlayer);

      useGameStore.setState({
        player: safePlayer,
        party: parsed.party,
        inventory: parsed.inventory,
        gold: parsed.gold,
        currentLocation: parsed.currentLocation,
        flags: parsed.flags,
        activeQuests: parsed.activeQuests as Record<string, never>,
        completedQuests: parsed.completedQuests,
        playTime: parsed.playTime,
        visitedLocations: parsed.visitedLocations,
      });

      setMessage('读取成功');
      setTimeout(() => setScreen('worldmap'), 500);
    } catch (e) {
      setMessage('读取失败');
      console.error('读取失败:', e);
    }
  };

  const handleDelete = (slot: number) => {
    if (!confirm(`确定要删除存档 ${slot} 吗？`)) return;
    try {
      const newSlots = saveSlots.filter((s) => s.slot !== slot);
      localStorage.setItem(SAVE_KEY, JSON.stringify(newSlots));
      setSaveSlots(newSlots);
      setMessage(`存档 ${slot} 已删除`);
      setTimeout(() => setMessage(''), 2000);
    } catch {
      setMessage('删除失败');
    }
  };

  const handleExport = () => {
    try {
      const savesJson = localStorage.getItem(SAVE_KEY);
      if (!savesJson) {
        setMessage('没有可导出的存档');
        return;
      }

      const blob = new Blob([savesJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `金庸群侠传存档_${new Date().toLocaleDateString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('存档已导出');
      setTimeout(() => setMessage(''), 2000);
    } catch {
      setMessage('导出失败');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(String(event.target?.result ?? ''));
        if (!Array.isArray(parsed)) {
          setMessage('无效的存档文件');
          return;
        }

        const validSlots = parsed.filter(isSaveSlotData).sort((a, b) => a.slot - b.slot);
        if (validSlots.length === 0) {
          setMessage('导入失败：未发现有效存档');
          return;
        }

        localStorage.setItem(SAVE_KEY, JSON.stringify(validSlots));
        setSaveSlots(validSlots);
        setMessage(
          validSlots.length === parsed.length
            ? '存档已导入'
            : '存档已导入（部分无效数据已过滤）'
        );
        setTimeout(() => setMessage(''), 2200);
      } catch {
        setMessage('导入失败');
      }
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  const getSlotInfo = (slot: number): SaveSlotData | undefined => saveSlots.find((s) => s.slot === slot);

  return (
    <div className="w-full h-full bg-ink flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gold/30 bg-ink-dark">
        <h2 className="text-2xl font-bold text-gold">存档管理</h2>
        <div className="flex items-center gap-4">
          {message && <span className="text-gold text-sm">{message}</span>}
          <button
            onClick={() => setScreen('worldmap')}
            className="px-4 py-2 border border-gold/50 text-gold/70 rounded hover:border-gold hover:text-gold"
          >
            返回
          </button>
        </div>
      </div>

      <div className="flex gap-4 p-4 border-b border-gold/20 bg-ink-dark/50">
        <button
          onClick={() => setActiveTab('save')}
          className={`px-6 py-2 rounded transition-colors ${
            activeTab === 'save'
              ? 'bg-crimson text-parchment font-bold'
              : 'border border-gold/50 text-gold/70 hover:border-gold hover:text-gold'
          }`}
        >
          保存游戏
        </button>
        <button
          onClick={() => setActiveTab('load')}
          className={`px-6 py-2 rounded transition-colors ${
            activeTab === 'load'
              ? 'bg-gold text-ink-dark font-bold'
              : 'border border-gold/50 text-gold/70 hover:border-gold hover:text-gold'
          }`}
        >
          读取游戏
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'save' && (
            <div className="mb-6 p-4 bg-ink-dark border border-gold/30 rounded-lg">
              <h3 className="text-gold font-bold mb-2">当前游戏状态</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-parchment/60">角色:</span>
                  <span className="text-parchment ml-2">{player.name} Lv.{player.level}</span>
                </div>
                <div>
                  <span className="text-parchment/60">位置:</span>
                  <span className="text-parchment ml-2">{location?.name || '未知'}</span>
                </div>
                <div>
                  <span className="text-parchment/60">游戏时间:</span>
                  <span className="text-parchment ml-2">{formatTime(playTime)}</span>
                </div>
                <div>
                  <span className="text-parchment/60">银两:</span>
                  <span className="text-gold ml-2">{gold}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: MAX_SLOTS }).map((_, idx) => {
              const slot = idx + 1;
              const slotData = getSlotInfo(slot);
              const isEmpty = !slotData;

              return (
                <div
                  key={slot}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isEmpty ? 'bg-ink-dark/50 border-gold/20' : 'bg-ink-dark border-gold/50 hover:border-gold'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gold">存档 {slot}</h3>
                    {!isEmpty && <span className="text-xs text-parchment/40">{formatDate(slotData.timestamp)}</span>}
                  </div>

                  {isEmpty ? (
                    <div className="text-center py-8">
                      <p className="text-parchment/40 mb-4">空存档位</p>
                      {activeTab === 'save' && (
                        <button
                          onClick={() => handleSave(slot)}
                          className="px-4 py-2 bg-crimson text-parchment rounded hover:bg-crimson-light"
                        >
                          保存到此位置
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👤</span>
                        <div>
                          <p className="text-parchment font-bold">{slotData.playerName}</p>
                          <p className="text-xs text-parchment/60">等级 {slotData.level}</p>
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        <p className="text-parchment/70">位置: {LOCATIONS[slotData.location]?.name || '未知'}</p>
                        <p className="text-parchment/70">游戏时间: {formatTime(slotData.playTime)}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        {activeTab === 'load' ? (
                          <button
                            onClick={() => handleLoad(slotData)}
                            className="flex-1 px-3 py-2 bg-gold text-ink-dark font-bold rounded hover:bg-gold/80"
                          >
                            读取
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSave(slot)}
                            className="flex-1 px-3 py-2 bg-crimson text-parchment rounded hover:bg-crimson-light"
                          >
                            覆盖
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(slot)}
                          className="px-3 py-2 border border-red-500/50 text-red-400 rounded hover:bg-red-500/20"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-ink-dark/50 border border-gold/20 rounded">
            <h3 className="text-gold font-bold mb-4">存档备份</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-ink border border-gold text-gold rounded hover:bg-gold hover:text-ink-dark"
              >
                导出存档（备份）
              </button>
              <label className="px-4 py-2 bg-ink border border-gold text-gold rounded hover:bg-gold hover:text-ink-dark cursor-pointer">
                导入存档
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
              <p className="text-parchment/40 text-sm">导入时会自动校验结构并过滤无效项</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (confirm('确定要重置游戏进度吗？这将清除当前游戏状态！')) {
                  useGameStore.getState().resetGame();
                  window.location.reload();
                }
              }}
              className="px-6 py-3 border border-red-500/50 text-red-400 rounded hover:bg-red-500/20"
            >
              重置当前游戏
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
