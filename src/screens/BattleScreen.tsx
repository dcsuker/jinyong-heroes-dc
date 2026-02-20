/**
 * 金庸群侠传 - 战斗界面
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBattleStore } from '@/store/battleStore'
import { BattleState } from '@/types'

/** 战斗界面组件 */
const BattleScreen: React.FC = () => {
  const navigate = useNavigate()
  const {
    inBattle,
    battleState,
    playerTeam,
    enemyTeam,
    battleLogs,
    currentActorId,
  } = useBattleStore()

  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)

  /** 是否是玩家回合 */
  const isPlayerTurn = battleState === BattleState.PLAYER_TURN

  /** 战斗是否结束 */
  const isBattleOver = battleState === BattleState.VICTORY || battleState === BattleState.DEFEAT

  /** 处理攻击 */
  const handleAttack = () => {
    // 这里应该调用战斗引擎执行攻击
    console.log('攻击', selectedTarget)
  }

  /** 处理防御 */
  const handleDefend = () => {
    console.log('防御')
  }

  /** 处理逃跑 */
  const handleFlee = () => {
    console.log('逃跑')
    navigate('/world')
  }

  /** 战斗结束返回 */
  const handleBattleEnd = () => {
    navigate('/world')
  }

  // 模拟战斗日志自动滚动
  const logsEndRef = React.useRef<HTMLDivElement>(null)
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [battleLogs])

  if (!inBattle) {
    return (
      <div className="ink-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-ink-black mb-4">未在战斗中</h1>
          <button onClick={() => navigate('/world')} className="btn-primary">
            返回世界地图
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ink-background min-h-screen flex flex-col">
      {/* 战斗区域 */}
      <div className="flex-1 flex">
        {/* 玩家队伍（左侧） */}
        <div className="w-1/3 p-4 border-r border-ink-light">
          <h2 className="text-lg font-serif mb-4">我方</h2>
          <div className="space-y-4">
            {playerTeam.map((member) => (
              <div
                key={member.character.id}
                className={`card p-3 ${
                  currentActorId === member.character.id ? 'ring-2 ring-cinnabar' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ backgroundColor: member.character.avatarColor }}
                  ></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-serif">{member.character.name}</span>
                      <span className="text-sm text-ink-gray">
                        {member.currentHealth}/{member.character.baseStats.maxHealth}
                      </span>
                    </div>
                    {/* 血条 */}
                    <div className="health-bar mt-1">
                      <div
                        className="health-bar-fill"
                        style={{
                          width: `${(member.currentHealth / member.character.baseStats.maxHealth) * 100}%`,
                        }}
                      ></div>
                    </div>
                    {/* 内力条 */}
                    <div className="mana-bar mt-1">
                      <div
                        className="mana-bar-fill"
                        style={{
                          width: `${(member.currentMana / member.character.baseStats.maxMana) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 战斗日志（中间） */}
        <div className="w-1/3 p-4 flex flex-col">
          <h2 className="text-lg font-serif mb-4 text-center">战斗日志</h2>
          <div className="flex-1 overflow-y-auto space-y-2 bg-black/5 rounded p-4">
            {battleLogs.map((log, index) => (
              <p key={index} className="text-sm text-ink-black">
                {log}
              </p>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* 敌人队伍（右侧） */}
        <div className="w-1/3 p-4 border-l border-ink-light">
          <h2 className="text-lg font-serif mb-4">敌方</h2>
          <div className="space-y-4">
            {enemyTeam.map((enemy) => (
              <div
                key={enemy.character.id}
                onClick={() => isPlayerTurn && setSelectedTarget(enemy.character.id)}
                className={`card p-3 cursor-pointer ${
                  selectedTarget === enemy.character.id ? 'ring-2 ring-cinnabar' : ''
                } ${!isPlayerTurn ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ backgroundColor: enemy.character.avatarColor }}
                  ></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-serif">{enemy.character.name}</span>
                      <span className="text-sm text-ink-gray">
                        {enemy.currentHealth}/{enemy.character.baseStats.maxHealth}
                      </span>
                    </div>
                    {/* 血条 */}
                    <div className="health-bar mt-1">
                      <div
                        className={`health-bar-fill ${
                          enemy.currentHealth < enemy.character.baseStats.maxHealth * 0.3 ? 'low' : ''
                        }`}
                        style={{
                          width: `${(enemy.currentHealth / enemy.character.baseStats.maxHealth) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="bg-ink-black text-paper p-4">
        {isBattleOver ? (
          <div className="text-center space-y-4">
            <h2 className={`text-2xl font-serif ${
              battleState === BattleState.VICTORY ? 'text-jade' : 'text-cinnabar'
            }`}>
              {battleState === BattleState.VICTORY ? '战斗胜利！' : '战斗失败...'}
            </h2>
            <button onClick={handleBattleEnd} className="btn-primary">
              返回
            </button>
          </div>
        ) : (
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleAttack}
              disabled={!isPlayerTurn || !selectedTarget}
              className={`btn-secondary py-3 px-8 ${
                !isPlayerTurn || !selectedTarget ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              攻击
            </button>
            <button
              disabled={!isPlayerTurn}
              className={`btn-secondary py-3 px-8 ${
                !isPlayerTurn ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              武功
            </button>
            <button
              onClick={handleDefend}
              disabled={!isPlayerTurn}
              className={`btn-secondary py-3 px-8 ${
                !isPlayerTurn ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              防御
            </button>
            <button
              onClick={handleFlee}
              disabled={!isPlayerTurn}
              className={`btn-secondary py-3 px-8 ${
                !isPlayerTurn ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              逃跑
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BattleScreen
