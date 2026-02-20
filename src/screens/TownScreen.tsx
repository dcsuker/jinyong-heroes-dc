/**
 * 金庸群侠传 - 城镇探索界面
 */

import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePlayerStore } from '@/store/playerStore'
import { ALL_LOCATIONS } from '@/data/locations'
import { ALL_CHARACTERS } from '@/data/characters'

/** 城镇探索界面组件 */
const TownScreen: React.FC = () => {
  const { townId } = useParams<{ townId: string }>()
  const navigate = useNavigate()
  const { currentLocation } = usePlayerStore()

  const [selectedNpc, setSelectedNpc] = useState<string | null>(null)

  // 获取当前地点
  const location = ALL_LOCATIONS.find(l => l.id === townId) || ALL_LOCATIONS.find(l => l.id === currentLocation)

  // 获取地点 NPC
  const npcs = location?.npcIds
    ? ALL_CHARACTERS.filter(c => location.npcIds?.includes(c.id))
    : []

  /** 返回世界地图 */
  const handleBackToWorld = () => {
    navigate('/world')
  }

  /** 与 NPC 对话 */
  const handleTalkToNpc = (npcId: string) => {
    setSelectedNpc(npcId)
    // 这里应该打开对话界面
  }

  /** 关闭对话 */
  const handleCloseDialogue = () => {
    setSelectedNpc(null)
  }

  if (!location) {
    return (
      <div className="ink-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-ink-black">地点不存在</h1>
          <button onClick={handleBackToWorld} className="btn-primary mt-4">
            返回世界地图
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ink-background min-h-screen flex flex-col">
      {/* 顶部栏 */}
      <div className="bg-ink-black text-paper p-4 flex justify-between items-center">
        <h1 className="font-serif text-xl">{location.name}</h1>
        <button onClick={handleBackToWorld} className="btn-secondary py-1 px-4 text-sm">
          返回地图
        </button>
      </div>

      {/* 城镇地图区域 */}
      <div className="flex-1 p-8">
        <div className="card p-6 h-full">
          {/* 地点描述 */}
          <div className="mb-6">
            <p className="text-ink-gray">{location.description}</p>
          </div>

          {/* 地点类型标签 */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-ink-black text-paper text-sm rounded">
              {getLocationTypeText(location.type)}
            </span>
          </div>

          {/* NPC 列表 */}
          {npcs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-serif text-ink-black">附近人物</h2>
              <div className="grid grid-cols-2 gap-4">
                {npcs.map((npc) => (
                  <div
                    key={npc.id}
                    onClick={() => handleTalkToNpc(npc.id)}
                    className="card p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      {/* NPC 头像占位 */}
                      <div
                        className="w-12 h-12 rounded-full"
                        style={{ backgroundColor: npc.avatarColor }}
                      ></div>
                      <div>
                        <h3 className="font-serif text-ink-black">{npc.name}</h3>
                        <p className="text-sm text-ink-gray">{npc.title || npc.description.slice(0, 20)}...</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 地点选项 */}
          <div className="mt-8 space-y-2">
            <h2 className="text-lg font-serif text-ink-black">此处可前往</h2>
            <button className="btn-secondary w-full py-2">
              探索四周
            </button>
            <button className="btn-secondary w-full py-2">
              休息（恢复生命值）
            </button>
            <button className="btn-secondary w-full py-2">
              离开此地
            </button>
          </div>
        </div>
      </div>

      {/* 对话弹窗（简化版） */}
      {selectedNpc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-serif mb-4">
              与 {ALL_CHARACTERS.find(c => c.id === selectedNpc)?.name} 对话
            </h2>
            <p className="text-ink-gray mb-6">
              （对话系统开发中...）
            </p>
            <div className="flex justify-end">
              <button onClick={handleCloseDialogue} className="btn-primary">
                离开
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** 获取地点类型文本 */
function getLocationTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    city: '城市',
    town: '小镇',
    sect: '门派',
    dungeon: '秘境',
    wilderness: '野外',
    inn: '客栈',
    shop: '商店',
    palace: '宫殿',
  }
  return typeMap[type] || '未知'
}

export default TownScreen
