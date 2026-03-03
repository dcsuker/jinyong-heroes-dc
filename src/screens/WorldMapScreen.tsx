import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { LOCATIONS } from '../data/locations';
import { audioManager } from '../utils/audioManager';
import type { Location, LocationType } from '../types';

// 地点类型对应的图标和颜色
const LOCATION_STYLES: Record<LocationType, { icon: string; color: string; shadow: string }> = {
  city: { icon: '🏯', color: 'bg-amber-500', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.6)]' },
  temple: { icon: '🏛️', color: 'bg-yellow-600', shadow: 'shadow-[0_0_15px_rgba(217,119,6,0.6)]' },
  mountain: { icon: '⛰️', color: 'bg-stone-500', shadow: 'shadow-[0_0_15px_rgba(120,113,108,0.6)]' },
  secret: { icon: '🔮', color: 'bg-purple-600', shadow: 'shadow-[0_0_15px_rgba(147,51,234,0.6)]' },
  border: { icon: '🚩', color: 'bg-red-600', shadow: 'shadow-[0_0_15px_rgba(220,38,38,0.6)]' },
  camp: { icon: '⛺', color: 'bg-green-600', shadow: 'shadow-[0_0_15px_rgba(22,163,74,0.6)]' },
};

export default function WorldMapScreen() {
  const { currentLocation, visitedLocations, setLocation, setScreen, party, player, gold } = useGameStore();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showParty, setShowParty] = useState(false);

  const currentLoc = LOCATIONS[currentLocation];

  // 播放世界地图BGM
  useEffect(() => {
    audioManager.playBGM('worldmap');
  }, []);

  const handleTravel = (locId: string) => {
    audioManager.playSFX('travel');
    setLocation(locId);
    setSelectedLocation(null);
    setScreen('town');
  };

  return (
    <div className="w-full h-full bg-ink relative overflow-hidden">
      {/* 水墨风格中国地图背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950">
        {/* 水墨风格地图 - 使用SVG绘制简化的中国地图轮廓 */}
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          {/* 背景纹理 - 宣纸效果 */}
          <defs>
            <filter id="ink-wash">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
            </filter>
            <linearGradient id="ink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#292524" />
              <stop offset="50%" stopColor="#1c1917" />
              <stop offset="100%" stopColor="#0c0a09" />
            </linearGradient>
          </defs>

          {/* 地图轮廓 - 简化的中国形状 */}
          <path
            d="M 150 80
               L 200 60 L 280 70 L 350 90 L 400 80
               L 450 70 L 500 85 L 550 100 L 580 90
               L 620 95 L 680 100 L 720 95 L 760 110
               L 800 130 L 820 160 L 840 200 L 830 250
               L 820 300 L 800 340 L 780 370 L 740 400
               L 700 420 L 650 430 L 580 440 L 500 435
               L 420 425 L 350 415 L 280 400 L 220 380
               L 170 350 L 130 310 L 100 260 L 90 210
               L 100 160 L 120 120 Z"
            fill="url(#ink-gradient)"
            stroke="#44403c"
            strokeWidth="2"
            filter="url(#ink-wash)"
            opacity="0.8"
          />

          {/* 内部省份分界线（暗示） */}
          <path d="M 200 150 L 280 180 L 350 200" fill="none" stroke="#57534e" strokeWidth="1" opacity="0.3" />
          <path d="M 400 120 L 450 180 L 480 250" fill="none" stroke="#57534e" strokeWidth="1" opacity="0.3" />
          <path d="M 500 200 L 550 280 L 580 350" fill="none" stroke="#57534e" strokeWidth="1" opacity="0.3" />
          <path d="M 300 250 L 380 300 L 450 340" fill="none" stroke="#57534e" strokeWidth="1" opacity="0.3" />
        </svg>

        {/* 水墨山峰 - 西部 */}
        <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          <path d="M 80 120 L 120 80 L 160 110 L 180 150 L 140 180 L 90 160 Z" fill="#1c1917" />
          <path d="M 140 100 L 190 50 L 240 90 L 220 140 L 170 160 L 130 130 Z" fill="#1c1917" />
          <path d="M 200 80 L 260 30 L 320 70 L 300 120 L 250 140 L 210 110 Z" fill="#1c1917" />
        </svg>

        {/* 水墨山峰 - 北部 */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          <path d="M 420 100 L 460 70 L 500 95 L 480 130 L 440 125 Z" fill="#1c1917" />
          <path d="M 480 90 L 530 50 L 580 80 L 560 120 L 510 110 Z" fill="#1c1917" />
        </svg>

        {/* 水墨山峰 - 中部 */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          <path d="M 350 180 L 390 150 L 430 175 L 410 210 L 370 205 Z" fill="#1c1917" />
          <path d="M 400 160 L 450 120 L 490 150 L 460 190 L 420 185 Z" fill="#1c1917" />
        </svg>

        {/* 长江 - 水墨线条 */}
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          <path
            d="M 180 160
               Q 220 180 260 200
               T 340 240
               T 420 290
               T 520 330
               T 620 350
               T 750 360
               T 850 370"
            fill="none"
            stroke="#78716c"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="20,10"
          />
        </svg>

        {/* 黄河 */}
        <svg className="absolute inset-0 w-full h-full opacity-12" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          <path
            d="M 380 130
               Q 420 160 460 190
               T 520 230
               T 560 260"
            fill="none"
            stroke="#78716c"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        {/* 淮河 */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          <path
            d="M 500 220
               Q 550 250 620 280
               T 720 320"
            fill="none"
            stroke="#78716c"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {/* 海岸线 */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          <path
            d="M 780 340 L 850 350 L 900 370 L 920 400 L 900 430 L 850 440 L 800 430"
            fill="none"
            stroke="#44403c"
            strokeWidth="2"
            opacity="0.5"
          />
        </svg>

        {/* 印章装饰 - 角落 */}
        <div className="absolute top-8 left-8 w-16 h-16 border-2 border-red-800/40 rounded flex items-center justify-center">
          <span className="text-red-800/60 text-xs font-bold rotate-12">武侠</span>
        </div>
        <div className="absolute bottom-8 right-8 w-16 h-16 border-2 border-red-800/40 rounded flex items-center justify-center">
          <span className="text-red-800/60 text-xs font-bold -rotate-12">江湖</span>
        </div>

        {/* 边框装饰 - 毛笔笔触效果 */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-amber-700/30 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-amber-700/30 to-transparent" />
      </div>

      {/* 标题 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-10">
        <h2 className="text-3xl font-bold text-gold drop-shadow-lg">江湖地图</h2>
        <p className="text-parchment/60 text-sm">当前位置：{currentLoc?.name || '未知'}</p>
      </div>

      {/* 地点节点 */}
      <div className="absolute inset-0">
        {Object.values(LOCATIONS).map((loc) => {
          const isCurrent = loc.id === currentLocation;
          const isVisited = visitedLocations.includes(loc.id);
          const isConnected = currentLoc?.connected?.includes(loc.id);
          const locType = loc.type || 'city';
          const style = LOCATION_STYLES[locType] || LOCATION_STYLES.city;

          return (
            <div
              key={loc.id}
              className="absolute"
              style={{
                left: `${loc.mapPos.x / 10}%`,
                top: `${loc.mapPos.y / 6}%`,
                zIndex: isCurrent ? 20 : 10,
              }}
            >
              <button
                onClick={() => setSelectedLocation(loc)}
                className={`relative w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2
                  ${isCurrent
                    ? `${style.color} ${style.shadow} scale-125 z-30`
                    : isVisited
                    ? `${style.color}/80 ${style.shadow}`
                    : isConnected
                    ? 'bg-amber-700/60 hover:bg-amber-600/80'
                    : 'bg-stone-600/40 hover:bg-stone-500/60'
                  }`}
              >
                <span className="filter drop-shadow-md">{style.icon}</span>
                {/* 当前位置脉冲效果 */}
                {isCurrent && (
                  <span className="absolute inset-0 rounded-lg bg-white/50 animate-ping" />
                )}
              </button>
              {/* 地点名称标签 */}
              <div
                className={`absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold px-2 py-0.5 rounded text-center
                  ${isCurrent ? 'bg-crimson text-white' : isVisited ? 'bg-amber-700/80 text-white' : 'bg-stone-800/70 text-amber-200'}`}
              >
                {loc.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* 地点信息卡 */}
      {selectedLocation && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
          <div className="bg-ink-dark border-2 border-gold p-6 rounded-lg max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{LOCATION_STYLES[selectedLocation.type || 'city']?.icon || '🏯'}</span>
              <div>
                <h3 className="text-2xl font-bold text-gold">{selectedLocation.name}</h3>
                <span className="text-xs text-amber-400">{selectedLocation.novel}</span>
              </div>
            </div>
            <p className="text-parchment/80 mb-4">{selectedLocation.description}</p>

            {selectedLocation.connected && selectedLocation.connected.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-parchment/50 mb-1">可通往：</p>
                <div className="flex flex-wrap gap-1">
                  {selectedLocation.connected.map(locId => {
                    const loc = LOCATIONS[locId];
                    return loc ? (
                      <span key={locId} className="text-xs px-2 py-0.5 bg-stone-700 text-amber-200 rounded">
                        {loc.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {selectedLocation.shopType && (
              <p className="text-gold/80 text-sm mb-4">商店类型：{selectedLocation.shopType}</p>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => handleTravel(selectedLocation.id)}
                className="flex-1 px-4 py-2 bg-crimson text-parchment font-bold rounded
                           hover:bg-crimson-light transition-colors"
              >
                前往
              </button>
              <button
                onClick={() => setSelectedLocation(null)}
                className="flex-1 px-4 py-2 border border-gold text-gold rounded
                           hover:bg-gold hover:text-ink-dark transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 队伍状态按钮 */}
      <button
        onClick={() => setShowParty(!showParty)}
        className="absolute top-4 right-4 px-4 py-2 bg-ink-dark border border-gold text-gold rounded
                   hover:bg-gold hover:text-ink-dark transition-colors z-20"
      >
        队伍
      </button>

      {/* 队伍面板 */}
      {showParty && (
        <div className="absolute top-16 right-4 bg-ink-dark border border-gold p-4 rounded-lg min-w-[200px] z-30">
          <h4 className="text-gold font-bold mb-2">队伍状态</h4>
          <div className="space-y-2">
            {party.map((memberId, idx) => (
              <div key={idx} className="flex items-center gap-2 text-parchment">
                <span className="text-xl">
                  {idx === 0 ? '👤' : '⚔️'}
                </span>
                <span className="text-sm">
                  {idx === 0 ? player.name : memberId}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-2 border-t border-gold/30">
            <p className="text-gold text-sm">💰 {gold} 两</p>
            <p className="text-parchment/60 text-sm">等级 {player.level}</p>
          </div>
          <button
            onClick={() => setShowParty(false)}
            className="mt-4 w-full px-2 py-1 text-sm border border-gold/50 text-gold/70 rounded
                       hover:bg-gold hover:text-ink-dark transition-colors"
          >
            关闭
          </button>
        </div>
      )}

      {/* 底部导航 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        <button
          onClick={() => setScreen('character')}
          className="px-6 py-2 bg-ink-dark border border-gold text-gold rounded
                     hover:bg-gold hover:text-ink-dark transition-colors"
        >
          角色
        </button>
        <button
          onClick={() => setScreen('inventory')}
          className="px-6 py-2 bg-ink-dark border border-gold text-gold rounded
                     hover:bg-gold hover:text-ink-dark transition-colors"
        >
          背包
        </button>
        <button
          onClick={() => setScreen('quest')}
          className="px-6 py-2 bg-ink-dark border border-gold text-gold rounded
                     hover:bg-gold hover:text-ink-dark transition-colors"
        >
          任务
        </button>
        <button
          onClick={() => setScreen('save')}
          className="px-6 py-2 bg-ink-dark border border-gold text-gold rounded
                     hover:bg-gold hover:text-ink-dark transition-colors"
        >
          存档
        </button>
        <button
          onClick={() => setScreen('mainmenu')}
          className="px-6 py-2 bg-ink-dark border border-gold/50 text-gold/70 rounded
                     hover:border-gold hover:text-gold transition-colors"
        >
          菜单
        </button>
      </div>

      {/* 图例说明 */}
      <div className="absolute bottom-20 left-4 bg-ink-dark/80 border border-amber-700/50 p-3 rounded text-xs z-10">
        <p className="text-amber-400 font-bold mb-2">地点类型</p>
        <div className="space-y-1 text-parchment/70">
          <div className="flex items-center gap-2">
            <span>🏯</span> <span>城市</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⛰️</span> <span>门派/山</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🏛️</span> <span>寺庙</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔮</span> <span>秘境</span>
          </div>
        </div>
      </div>
    </div>
  );
}