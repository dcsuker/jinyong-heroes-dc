/**
 * 金庸群侠传 - 角色面板界面
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayerStore } from '@/store/playerStore'

/** 角色面板界面组件 */
const CharacterScreen: React.FC = () => {
  const navigate = useNavigate()
  const { player, party } = usePlayerStore()

  /** 返回 */
  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="ink-background min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 标题栏 */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold font-serif text-ink-black">角色面板</h1>
          <button onClick={handleBack} className="btn-secondary">
            返回
          </button>
        </div>

        {/* 主角信息 */}
        <div className="card p-6">
          <div className="flex space-x-6">
            {/* 角色立绘区域 */}
            <div className="w-48">
              <div
                className="w-48 h-48 rounded-lg"
                style={{ backgroundColor: player.avatarColor }}
              >
                {/* 这里可以用 SVG 绘制简单的角色轮廓 */}
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-xl font-serif text-ink-black">{player.name}</h2>
                {player.title && (
                  <p className="text-sm text-ink-gray">{player.title}</p>
                )}
                <p className="text-sm text-ink-gray">Lv.{player.level}</p>
              </div>
            </div>

            {/* 属性面板 */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-ink-gray">生命值</span>
                    <span className="font-medium">
                      {player.baseStats.health} / {player.baseStats.maxHealth}
                    </span>
                  </div>
                  <div className="health-bar">
                    <div
                      className="health-bar-fill"
                      style={{
                        width: `${(player.baseStats.health / player.baseStats.maxHealth) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-ink-gray">内力值</span>
                    <span className="font-medium">
                      {player.baseStats.mana} / {player.baseStats.maxMana}
                    </span>
                  </div>
                  <div className="mana-bar">
                    <div
                      className="mana-bar-fill"
                      style={{
                        width: `${(player.baseStats.mana / player.baseStats.maxMana) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between py-2 border-b border-ink-light">
                  <span className="text-ink-gray">攻击力</span>
                  <span className="font-medium">{player.baseStats.attack}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-ink-light">
                  <span className="text-ink-gray">防御力</span>
                  <span className="font-medium">{player.baseStats.defense}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-ink-light">
                  <span className="text-ink-gray">力量</span>
                  <span className="font-medium">{player.baseStats.strength}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-ink-light">
                  <span className="text-ink-gray">敏捷</span>
                  <span className="font-medium">{player.baseStats.agility}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-ink-light">
                  <span className="text-ink-gray">悟性</span>
                  <span className="font-medium">{player.baseStats.intelligence}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-ink-light">
                  <span className="text-ink-gray">经验值</span>
                  <span className="font-medium">{player.exp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 武功列表 */}
        <div className="card p-6">
          <h2 className="text-xl font-serif mb-4">已知武功</h2>
          {player.skillIds.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {player.skillIds.map((skillId) => (
                <div key={skillId} className="p-3 bg-ink-light/10 rounded">
                  <p className="font-medium text-ink-black">{skillId}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-ink-gray">暂无武功</p>
          )}
        </div>

        {/* 队伍成员 */}
        {party.length > 0 && (
          <div className="card p-6">
            <h2 className="text-xl font-serif mb-4">队伍成员</h2>
            <div className="grid grid-cols-3 gap-4">
              {party.map((member) => (
                <div key={member.id} className="p-4 bg-ink-light/10 rounded flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ backgroundColor: member.avatarColor }}
                  ></div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-ink-gray">Lv.{member.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CharacterScreen
