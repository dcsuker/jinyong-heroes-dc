/**
 * 金庸群侠传 - 背包界面
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayerStore } from '@/store/playerStore'
import { useUIStore } from '@/store/uiStore'
import { Item } from '@/types'

/** 背包界面组件 */
const InventoryScreen: React.FC = () => {
  const navigate = useNavigate()
  const { inventory, removeItem } = usePlayerStore()
  const { addNotification } = useUIStore()

  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [useCount, setUseCount] = useState(1)

  /** 返回 */
  const handleBack = () => {
    navigate(-1)
  }

  /** 使用物品 */
  const handleUseItem = () => {
    if (!selectedItem) return

    // 这里应该实现物品使用逻辑
    addNotification(`使用了 ${selectedItem.name}`, 'success')
  }

  /** 丢弃物品 */
  const handleDiscardItem = () => {
    if (!selectedItem) return

    if (removeItem(selectedItem.id, useCount)) {
      addNotification(`丢弃了 ${selectedItem.name} x${useCount}`, 'info')
      setSelectedItem(null)
    }
  }

  /** 获取类型文本 */
  const getTypeText = (type: string): string => {
    const typeMap: Record<string, string> = {
      weapon: '武器',
      armor: '防具',
      accessory: '饰品',
      medicine: '丹药',
      manual: '秘籍',
      material: '材料',
      quest: '任务',
      food: '食物',
      other: '其他',
    }
    return typeMap[type] || '未知'
  }

  /** 获取稀有度颜色 */
  const getRarityColor = (rarity: number): string => {
    const colors: Record<number, string> = {
      1: '#8a8a8a',   // 灰色
      2: '#4ade80',   // 绿色
      3: '#4a90a4',   // 蓝色
      4: '#a855f7',   // 紫色
      5: '#f59e0b',   // 金色
    }
    return colors[rarity] || '#8a8a8a'
  }

  return (
    <div className="ink-background min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 标题栏 */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold font-serif text-ink-black">背包</h1>
          <button onClick={handleBack} className="btn-secondary">
            返回
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* 背包网格 */}
          <div className="col-span-2">
            <div className="card p-6">
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 48 }).map((_, index) => {
                  const item = inventory[index]
                  return (
                    <div
                      key={index}
                      onClick={() => item && setSelectedItem(item)}
                      className={`aspect-square border-2 rounded cursor-pointer transition-colors ${
                        item
                          ? selectedItem?.id === item.id
                            ? 'border-cinnabar bg-cinnabar/10'
                            : 'border-ink-light hover:border-ink-gray'
                          : 'border-ink-light/30 bg-ink-light/5'
                      }`}
                    >
                      {item && (
                        <div className="w-full h-full flex items-center justify-center p-1">
                          <div
                            className="w-8 h-8 rounded"
                            style={{
                              backgroundColor: getRarityColor(item.rarity),
                            }}
                            title={`${item.name} x${item.maxStack}`}
                          ></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 text-center text-ink-gray">
                物品数量：{inventory.length} / 48
              </div>
            </div>
          </div>

          {/* 物品详情 */}
          <div className="col-span-1">
            <div className="card p-6 sticky top-4">
              {selectedItem ? (
                <div className="space-y-4">
                  {/* 物品名称 */}
                  <div>
                    <h2
                      className="text-xl font-serif"
                      style={{ color: getRarityColor(selectedItem.rarity) }}
                    >
                      {selectedItem.name}
                    </h2>
                    <span className="text-sm text-ink-gray">
                      {getTypeText(selectedItem.type)}
                    </span>
                  </div>

                  {/* 物品图标 */}
                  <div className="w-24 h-24 mx-auto rounded-lg bg-ink-light/20 flex items-center justify-center">
                    <div
                      className="w-16 h-16 rounded"
                      style={{ backgroundColor: getRarityColor(selectedItem.rarity) }}
                    ></div>
                  </div>

                  {/* 物品描述 */}
                  <p className="text-ink-gray text-sm">{selectedItem.description}</p>

                  {/* 属性 */}
                  {selectedItem.equipBonus && (
                    <div className="space-y-1">
                      {Object.entries(selectedItem.equipBonus).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-ink-gray">{getAttributeName(key)}</span>
                          <span className="text-jade">+{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedItem.effect && (
                    <div className="space-y-1">
                      {selectedItem.effect.healthRestore && (
                        <div className="text-sm text-jade">
                          恢复生命值：+{selectedItem.effect.healthRestore}
                        </div>
                      )}
                      {selectedItem.effect.manaRestore && (
                        <div className="text-sm text-azure">
                          恢复内力值：+{selectedItem.effect.manaRestore}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 价格 */}
                  <div className="text-sm">
                    <span className="text-ink-gray">价格：</span>
                    <span className="font-medium">{selectedItem.price} 银两</span>
                  </div>

                  {/* 操作按钮 */}
                  <div className="space-y-2 pt-4 border-t border-ink-light">
                    {selectedItem.type === 'medicine' || selectedItem.type === 'food' ? (
                      <>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            max={selectedItem.maxStack}
                            value={useCount}
                            onChange={(e) => setUseCount(parseInt(e.target.value) || 1)}
                            className="w-20 px-2 py-1 border rounded"
                          />
                          <span className="text-ink-gray">个</span>
                        </div>
                        <button onClick={handleUseItem} className="btn-primary w-full">
                          使用
                        </button>
                      </>
                    ) : selectedItem.type === 'manual' ? (
                      <button onClick={handleUseItem} className="btn-primary w-full">
                        学习
                      </button>
                    ) : null}
                    <button onClick={handleDiscardItem} className="btn-secondary w-full">
                      丢弃
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-ink-gray py-12">
                  <p>请选择一个物品</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** 获取属性名称 */
function getAttributeName(key: string): string {
  const nameMap: Record<string, string> = {
    attack: '攻击力',
    defense: '防御力',
    strength: '力量',
    agility: '敏捷',
    intelligence: '悟性',
    health: '生命值',
    mana: '内力值',
  }
  return nameMap[key] || key
}

export default InventoryScreen
