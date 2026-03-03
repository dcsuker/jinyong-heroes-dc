import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { LOCATIONS } from '../data/locations';

interface SaveSlotData {
  slot: number;
  timestamp: string;
  playTime: number;
  location: string;
  playerName: string;
  level: number;
  data: string; // 序列化的游戏数据
}

const SAVE_KEY = 'jin-yong-saves';
const MAX_SLOTS = 6;

export default function SaveScreen() {
  const gameState = useGameStore();
  const { setScreen, currentLocation, player, gold, playTime } = gameState;
  const [saveSlots, setSaveSlots] = useState<SaveSlotData[]>([]);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save');

  const location = LOCATIONS[currentLocation];

  // 加载存档列表
  useEffect(() => {
    loadSaveSlots();
  }, []);

  const loadSaveSlots = () => {
    try {
      const savesJson = localStorage.getItem(SAVE_KEY);
      if (savesJson) {
        const saves = JSON.parse(savesJson) as SaveSlotData[];
        setSaveSlots(saves);
      }
    } catch (e) {
      console.error('加载存档失败:', e);
    }
  };

  // 格式化游戏时间
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}小时${mins}分钟`;
    }
    return `${mins}分钟`;
  };

  // 格式化日期
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 保存游戏
  const handleSave = (slot: number) => {
    try {
      // 获取当前游戏状态
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

      // 更新存档列表
      const newSlots = [...saveSlots.filter(s => s.slot !== slot), saveData]
        .sort((a, b) => a.slot - b.slot);

      localStorage.setItem(SAVE_KEY, JSON.stringify(newSlots));
      setSaveSlots(newSlots);
      setMessage(`已保存到存档 ${slot}`);
      setTimeout(() => setMessage(''), 2000);
    } catch (e) {
      setMessage('保存失败');
      console.error('保存失败:', e);
    }
  };

  // 读取游戏
  const handleLoad = (slotData: SaveSlotData) => {
    try {
      const parsed = JSON.parse(slotData.data);

      // 恢复游戏状态
      useGameStore.setState({
        player: parsed.player,
        party: parsed.party,
        inventory: parsed.inventory,
        gold: parsed.gold,
        currentLocation: parsed.currentLocation,
        flags: parsed.flags,
        activeQuests: parsed.activeQuests,
        completedQuests: parsed.completedQuests,
        playTime: parsed.playTime,
        visitedLocations: parsed.visitedLocations,
      });

      setMessage('读取成功！');
      setTimeout(() => {
        setScreen('worldmap');
      }, 500);
    } catch (e) {
      setMessage('读取失败');
      console.error('读取失败:', e);
    }
  };

  // 删除存档
  const handleDelete = (slot: number) => {
    if (!confirm(`确定要删除存档 ${slot} 吗？`)) return;

    try {
      const newSlots = saveSlots.filter(s => s.slot !== slot);
      localStorage.setItem(SAVE_KEY, JSON.stringify(newSlots));
      setSaveSlots(newSlots);
      setMessage(`存档 ${slot} 已删除`);
      setTimeout(() => setMessage(''), 2000);
    } catch (e) {
      setMessage('删除失败');
    }
  };

  // 导出存档（备份）
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
    } catch (e) {
      setMessage('导出失败');
    }
  };

  // 导入存档
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const saves = JSON.parse(event.target?.result as string);
        if (Array.isArray(saves)) {
          localStorage.setItem(SAVE_KEY, JSON.stringify(saves));
          setSaveSlots(saves);
          setMessage('存档已导入');
          setTimeout(() => setMessage(''), 2000);
        } else {
          setMessage('无效的存档文件');
        }
      } catch (e) {
        setMessage('导入失败');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 获取存档位信息
  const getSlotInfo = (slot: number): SaveSlotData | undefined => {
    return saveSlots.find(s => s.slot === slot);
  };

  return (
    <div className="w-full h-full bg-ink flex flex-col">
      {/* 顶部导航 */}
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

      {/* Tab切换 */}
      <div className="flex gap-4 p-4 border-b border-gold/20 bg-ink-dark/50">
        <button
          onClick={() => setActiveTab('save')}
          className={`px-6 py-2 rounded transition-colors
            ${activeTab === 'save'
              ? 'bg-crimson text-parchment font-bold'
              : 'border border-gold/50 text-gold/70 hover:border-gold hover:text-gold'}`}
        >
          保存游戏
        </button>
        <button
          onClick={() => setActiveTab('load')}
          className={`px-6 py-2 rounded transition-colors
            ${activeTab === 'load'
              ? 'bg-gold text-ink-dark font-bold'
              : 'border border-gold/50 text-gold/70 hover:border-gold hover:text-gold'}`}
        >
          读取游戏
        </button>
      </div>

      {/* 存档槽位 */}
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
                  className={`p-4 rounded-lg border-2 transition-all
                    ${isEmpty
                      ? 'bg-ink-dark/50 border-gold/20'
                      : 'bg-ink-dark border-gold/50 hover:border-gold'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gold">存档 {slot}</h3>
                    {!isEmpty && (
                      <span className="text-xs text-parchment/40">
                        {formatDate(slotData.timestamp)}
                      </span>
                    )}
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
                        <p className="text-parchment/70">
                          位置: {LOCATIONS[slotData.location]?.name || '未知'}
                        </p>
                        <p className="text-parchment/70">
                          游戏时间: {formatTime(slotData.playTime)}
                        </p>
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

          {/* 备份和导入 */}
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
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              <p className="text-parchment/40 text-sm">
                导出存档可用于备份或在其他设备上继续游戏
              </p>
            </div>
          </div>

          {/* 重置游戏 */}
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
