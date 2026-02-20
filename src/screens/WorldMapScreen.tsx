/**
 * 金庸群侠传 - 世界地图界面
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayerStore } from '@/store/playerStore'
import { ALL_LOCATIONS } from '@/data/locations'
import { LocationType } from '@/types'

/** 世界地图界面组件 */
const WorldMapScreen: React.FC = () => {
  const navigate = useNavigate()
  const { currentLocation, exploredLocations, setCurrentLocation } = usePlayerStore()

  // 获取当前所在地
  const currentLoc = ALL_LOCATIONS.find(l => l.id === currentLocation)

  /** 处理地点点击 */
  const handleLocationClick = (locationId: string) => {
    const location = ALL_LOCATIONS.find(l => l.id === locationId)
    if (!location) return

    // 标记为已探索
    if (!exploredLocations.includes(locationId)) {
      // 新地点探索逻辑
    }

    setCurrentLocation(locationId)

    // 根据地点类型跳转
    if (location.type === LocationType.CITY || location.type === LocationType.TOWN) {
      navigate(`/town/${locationId}`)
    } else if (location.type === LocationType.SECT) {
      navigate(`/town/${locationId}`)
    } else if (location.type === LocationType.DUNGEON) {
      // 秘境探索
      navigate(`/town/${locationId}`)
    }
  }

  /** 打开角色面板 */
  const openCharacter = () => {
    navigate('/character')
  }

  /** 打开背包 */
  const openInventory = () => {
    navigate('/inventory')
  }

  return (
    <div className="ink-background min-h-screen flex flex-col">
      {/* 顶部状态栏 */}
      <div className="bg-ink-black text-paper p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="font-serif text-lg">当前位置：{currentLoc?.name || '未知'}</span>
        </div>
        <div className="flex space-x-4">
          <button onClick={openCharacter} className="btn-secondary py-1 px-4 text-sm">
            角色
          </button>
          <button onClick={openInventory} className="btn-secondary py-1 px-4 text-sm">
            背包
          </button>
        </div>
      </div>

      {/* 地图区域 */}
      <div className="flex-1 relative p-8">
        {/* SVG 地图背景 */}
        <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
          {/* 地图背景 */}
          <defs>
            <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5f5f0" />
              <stop offset="100%" stopColor="#e8e8e3" />
            </linearGradient>
            <filter id="ink">
              <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" />
              <feDisplacementMap in="SourceGraphic" scale="10" />
            </filter>
          </defs>

          {/* 地图底色 */}
          <rect width="1000" height="600" fill="url(#mapBg)" />

          {/* 地形区域 */}
          {/* 山脉 */}
          <ellipse cx="300" cy="250" rx="150" ry="100" fill="#a8a898" opacity="0.5" />
          <ellipse cx="700" cy="200" rx="200" ry="120" fill="#a8a898" opacity="0.5" />
          <ellipse cx="500" cy="400" rx="180" ry="100" fill="#a8a898" opacity="0.5" />

          {/* 水域 */}
          <ellipse cx="800" cy="450" rx="150" ry="100" fill="#4a90a4" opacity="0.3" />
          <path d="M 200 300 Q 300 350 400 320 T 600 350" stroke="#4a90a4" strokeWidth="20" fill="none" opacity="0.3" />

          {/* 道路连接 */}
          {ALL_LOCATIONS.map((loc, index) => {
            const nextLoc = ALL_LOCATIONS[(index + 1) % ALL_LOCATIONS.length]
            if (loc.worldX && loc.worldY && nextLoc.worldX && nextLoc.worldY) {
              return (
                <line
                  key={`road-${loc.id}`}
                  x1={loc.worldX}
                  y1={loc.worldY}
                  x2={nextLoc.worldX}
                  y2={nextLoc.worldY}
                  stroke="#c4a484"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.5"
                />
              )
            }
            return null
          })}

          {/* 地点标记 */}
          {ALL_LOCATIONS.map((loc) => {
            const isExplored = exploredLocations.includes(loc.id)
            const isCurrent = loc.id === currentLocation
            const x = loc.worldX || 500
            const y = loc.worldY || 300

            return (
              <g
                key={loc.id}
                onClick={() => handleLocationClick(loc.id)}
                className="cursor-pointer"
                style={{ opacity: isExplored ? 1 : 0.5 }}
              >
                {/* 光晕效果 */}
                {isCurrent && (
                  <circle cx={x} cy={y} r="20" fill="none" stroke="#c41e3a" strokeWidth="2" opacity="0.5">
                    <animate attributeName="r" from="15" to="25" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* 地点标记 */}
                <circle
                  cx={x}
                  cy={y}
                  r={isCurrent ? 12 : 8}
                  fill={isCurrent ? '#c41e3a' : isExplored ? '#4a90a4' : '#8a8a8a'}
                  stroke="#1a1a1a"
                  strokeWidth="2"
                />

                {/* 地点名称 */}
                {isExplored && (
                  <text
                    x={x}
                    y={y + 25}
                    textAnchor="middle"
                    className="text-xs font-serif"
                    fill="#1a1a1a"
                  >
                    {loc.name}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* 底部提示 */}
      <div className="bg-ink-black/10 p-4 text-center text-ink-gray">
        <p>点击地点进行移动 · 按 ESC 返回主菜单</p>
      </div>
    </div>
  )
}

export default WorldMapScreen
