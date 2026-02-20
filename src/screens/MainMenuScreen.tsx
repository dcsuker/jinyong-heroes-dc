/**
 * 金庸群侠传 - 主菜单界面
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/store/gameStore'
import { useUIStore } from '@/store/uiStore'
import { GameMode } from '@/types'

/** 主菜单界面组件 */
const MainMenuScreen: React.FC = () => {
  const navigate = useNavigate()
  const { setGameMode, setLoaded } = useGameStore()
  const { showLoading } = useUIStore()

  /** 开始新游戏 */
  const handleNewGame = () => {
    showLoading('正在载入江湖世界...')
    setGameMode(GameMode.WORLD_MAP)
    setLoaded()
    setTimeout(() => {
      navigate('/world')
    }, 1000)
  }

  /** 继续游戏 */
  const handleContinue = () => {
    // 检查是否有存档
    navigate('/world')
  }

  /** 设置 */
  const handleSettings = () => {
    navigate('/settings')
  }

  return (
    <div className="ink-background min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-ink-black rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cinnabar rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center space-y-12">
        {/* 标题 */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-7xl font-bold text-ink-black font-serif tracking-wider">
            金庸群侠传
          </h1>
          <p className="text-xl text-ink-gray font-serif">
            仗剑江湖梦已远 侠骨柔情永流传
          </p>
        </div>

        {/* 菜单选项 */}
        <div className="space-y-4 min-w-[300px]">
          <button
            onClick={handleNewGame}
            className="btn-primary w-full text-lg py-4"
          >
            新游戏
          </button>
          <button
            onClick={handleContinue}
            className="btn-secondary w-full text-lg py-4"
          >
            继续游戏
          </button>
          <button
            onClick={handleSettings}
            className="btn-secondary w-full text-lg py-4"
          >
            设置
          </button>
        </div>

        {/* 版本信息 */}
        <div className="text-sm text-ink-light">
          <p>Version 1.0.0</p>
          <p className="mt-1">基于金庸 14 部武侠小说改编</p>
        </div>
      </div>

      {/* 水墨动画效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink-black/10 to-transparent"></div>
    </div>
  )
}

export default MainMenuScreen
