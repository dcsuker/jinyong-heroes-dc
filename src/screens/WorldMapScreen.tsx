import { useEffect, useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { LOCATIONS } from '../data/locations';
import { audioManager } from '../utils/audioManager';
import type { Location, LocationType } from '../types';

const LOCATION_STYLES: Record<LocationType, { icon: string; color: string; shadow: string }> = {
  city: { icon: '🏙️', color: 'bg-amber-500', shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.45)]' },
  temple: { icon: '⛩️', color: 'bg-yellow-600', shadow: 'shadow-[0_0_12px_rgba(217,119,6,0.45)]' },
  mountain: { icon: '⛰️', color: 'bg-stone-500', shadow: 'shadow-[0_0_12px_rgba(120,113,108,0.45)]' },
  secret: { icon: '🔮', color: 'bg-purple-700', shadow: 'shadow-[0_0_12px_rgba(147,51,234,0.45)]' },
  border: { icon: '🛤️', color: 'bg-red-700', shadow: 'shadow-[0_0_12px_rgba(220,38,38,0.45)]' },
  camp: { icon: '🏕️', color: 'bg-green-700', shadow: 'shadow-[0_0_12px_rgba(22,163,74,0.45)]' },
};

export default function WorldMapScreen() {
  const { currentLocation, visitedLocations, setLocation, setScreen, party, player, gold } = useGameStore();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showParty, setShowParty] = useState(false);
  const [travelError, setTravelError] = useState<string | null>(null);

  const currentLoc = LOCATIONS[currentLocation];

  const locationLinks = useMemo(() => {
    const links: Array<{ key: string; from: Location; to: Location }> = [];
    const seen = new Set<string>();

    Object.values(LOCATIONS).forEach((from) => {
      (from.connected ?? []).forEach((toId) => {
        const to = LOCATIONS[toId];
        if (!to) return;
        const key = [from.id, to.id].sort().join('__');
        if (seen.has(key)) return;
        seen.add(key);
        links.push({ key, from, to });
      });
    });

    return links;
  }, []);

  useEffect(() => {
    audioManager.playBGM('worldmap');
  }, []);

  const handleTravel = (locId: string) => {
    const isCurrent = locId === currentLocation;
    const isConnected = !!currentLoc?.connected?.includes(locId);
    if (!isCurrent && !isConnected) {
      setTravelError('该地点与当前位置不连通，无法直接前往。');
      return;
    }

    audioManager.playSFX('travel');
    setLocation(locId);
    setTravelError(null);
    setSelectedLocation(null);
    setScreen('town');
  };

  return (
    <div className="w-full h-full bg-ink relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950">
        <svg className="absolute inset-0 w-full h-full opacity-75" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="ink-wash-bg">
              <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
            </filter>
            <linearGradient id="ink-map-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2a2927" />
              <stop offset="60%" stopColor="#1f1e1c" />
              <stop offset="100%" stopColor="#151412" />
            </linearGradient>
            <radialGradient id="ink-spread" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4a4640" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#4a4640" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="1000" height="600" fill="#0f0f0e" />
          <circle cx="180" cy="120" r="120" fill="url(#ink-spread)" />
          <circle cx="680" cy="90" r="150" fill="url(#ink-spread)" />
          <circle cx="420" cy="460" r="180" fill="url(#ink-spread)" />

          <path
            d="M132 102 L194 78 L286 84 L352 106 L424 94 L506 98 L580 116 L646 110 L724 130 L786 172 L814 232 L802 286 L784 338 L742 376 L676 414 L598 432 L514 430 L438 422 L366 410 L284 392 L214 360 L164 318 L130 266 L116 210 Z"
            fill="url(#ink-map-fill)"
            stroke="#5a5650"
            strokeWidth="1.8"
            filter="url(#ink-wash-bg)"
          />

          <path d="M212 162 Q310 198 386 238" fill="none" stroke="#77726b" strokeWidth="1" opacity="0.35" />
          <path d="M398 146 Q468 202 520 286" fill="none" stroke="#77726b" strokeWidth="1" opacity="0.35" />
          <path d="M548 186 Q612 254 654 332" fill="none" stroke="#77726b" strokeWidth="1" opacity="0.35" />

          <path
            d="M210 186 Q278 224 346 256 T492 318 T664 354 T838 372"
            fill="none"
            stroke="#8b847b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeOpacity="0.2"
          />
          <path
            d="M396 144 Q460 178 520 226 T612 286"
            fill="none"
            stroke="#8b847b"
            strokeWidth="3"
            strokeLinecap="round"
            strokeOpacity="0.16"
          />
        </svg>

        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-amber-700/30 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-amber-700/30 to-transparent" />
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-10">
        <h2 className="text-3xl font-bold text-gold drop-shadow-lg">江湖地图</h2>
        <p className="text-parchment/70 text-sm">当前位置：{currentLoc?.name || '未知'}</p>
      </div>

      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {locationLinks.map((link) => (
            <line
              key={link.key}
              x1={`${link.from.mapPos.x / 10}%`}
              y1={`${link.from.mapPos.y / 6}%`}
              x2={`${link.to.mapPos.x / 10}%`}
              y2={`${link.to.mapPos.y / 6}%`}
              stroke="#a8a29e"
              strokeWidth={0.75}
              strokeOpacity={0.28}
            />
          ))}
        </svg>

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
                onClick={() => {
                  setTravelError(null);
                  setSelectedLocation(loc);
                }}
                className={`relative w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2
                  ${
                    isCurrent
                      ? `${style.color} ${style.shadow} scale-125 z-30`
                      : isVisited
                      ? `${style.color}/80 ${style.shadow}`
                      : isConnected
                      ? 'bg-amber-700/50 hover:bg-amber-600/70'
                      : 'bg-stone-600/30 hover:bg-stone-500/50'
                  }`}
              >
                <span className="filter drop-shadow-sm">{style.icon}</span>
                {isCurrent && <span className="absolute inset-0 rounded-lg bg-white/35 animate-ping" />}
              </button>

              <div
                className={`absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold px-2 py-0.5 rounded text-center
                  ${isCurrent ? 'bg-crimson text-white' : isVisited ? 'bg-amber-700/80 text-white' : 'bg-stone-900/70 text-amber-200'}`}
              >
                {loc.name}
              </div>
            </div>
          );
        })}
      </div>

      {selectedLocation && (
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-30">
          <div className="bg-ink-dark border-2 border-gold p-6 rounded-lg max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{LOCATION_STYLES[selectedLocation.type || 'city']?.icon || '🏙️'}</span>
              <div>
                <h3 className="text-2xl font-bold text-gold">{selectedLocation.name}</h3>
                <span className="text-xs text-amber-300">{selectedLocation.novel}</span>
              </div>
            </div>
            <p className="text-parchment/85 mb-4">{selectedLocation.description}</p>

            {travelError && <p className="text-red-400 text-sm mb-3">{travelError}</p>}

            {selectedLocation.connected && selectedLocation.connected.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-parchment/55 mb-1">可通往：</p>
                <div className="flex flex-wrap gap-1">
                  {selectedLocation.connected.map((locId) => {
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
                className="flex-1 px-4 py-2 bg-crimson text-parchment font-bold rounded hover:bg-crimson-light transition-colors"
              >
                前往
              </button>
              <button
                onClick={() => {
                  setTravelError(null);
                  setSelectedLocation(null);
                }}
                className="flex-1 px-4 py-2 border border-gold text-gold rounded hover:bg-gold hover:text-ink-dark transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowParty(!showParty)}
        className="absolute top-4 right-4 px-4 py-2 bg-ink-dark border border-gold text-gold rounded hover:bg-gold hover:text-ink-dark transition-colors z-20"
      >
        队伍
      </button>

      {showParty && (
        <div className="absolute top-16 right-4 bg-ink-dark border border-gold p-4 rounded-lg min-w-[210px] z-30">
          <h4 className="text-gold font-bold mb-2">队伍状态</h4>
          <div className="space-y-2">
            {party.map((memberId, idx) => (
              <div key={idx} className="flex items-center gap-2 text-parchment">
                <span className="text-xl">{idx === 0 ? '🧑' : '⚔️'}</span>
                <span className="text-sm">{idx === 0 ? player.name : memberId}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-2 border-t border-gold/30">
            <p className="text-gold text-sm">💰 {gold} 两</p>
            <p className="text-parchment/65 text-sm">等级 {player.level}</p>
          </div>
          <button
            onClick={() => setShowParty(false)}
            className="mt-4 w-full px-2 py-1 text-sm border border-gold/50 text-gold/70 rounded hover:bg-gold hover:text-ink-dark transition-colors"
          >
            关闭
          </button>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        <button
          onClick={() => setScreen('character')}
          className="px-6 py-2 bg-ink-dark border border-gold text-gold rounded hover:bg-gold hover:text-ink-dark transition-colors"
        >
          角色
        </button>
        <button
          onClick={() => setScreen('inventory')}
          className="px-6 py-2 bg-ink-dark border border-gold text-gold rounded hover:bg-gold hover:text-ink-dark transition-colors"
        >
          背包
        </button>
        <button
          onClick={() => setScreen('quest')}
          className="px-6 py-2 bg-ink-dark border border-gold text-gold rounded hover:bg-gold hover:text-ink-dark transition-colors"
        >
          任务
        </button>
        <button
          onClick={() => setScreen('save')}
          className="px-6 py-2 bg-ink-dark border border-gold text-gold rounded hover:bg-gold hover:text-ink-dark transition-colors"
        >
          存档
        </button>
        <button
          onClick={() => setScreen('mainmenu')}
          className="px-6 py-2 bg-ink-dark border border-gold/50 text-gold/70 rounded hover:border-gold hover:text-gold transition-colors"
        >
          菜单
        </button>
      </div>

      <div className="absolute bottom-20 left-4 bg-ink-dark/80 border border-amber-700/50 p-3 rounded text-xs z-10">
        <p className="text-amber-300 font-bold mb-2">地点图例</p>
        <div className="space-y-1 text-parchment/75">
          <div className="flex items-center gap-2"><span>🏙️</span><span>城镇</span></div>
          <div className="flex items-center gap-2"><span>⛰️</span><span>门派/山地</span></div>
          <div className="flex items-center gap-2"><span>⛩️</span><span>寺庙</span></div>
          <div className="flex items-center gap-2"><span>🔮</span><span>秘境</span></div>
        </div>
      </div>
    </div>
  );
}
