/**
 * 金庸群侠传 - 设置界面
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/store/gameStore'

/** 设置界面组件 */
const SettingsScreen: React.FC = () => {
  const navigate = useNavigate()
  const { settings, updateSettings } = useGameStore()

  const [localSettings, setLocalSettings] = useState(settings)

  /** 返回主菜单 */
  const handleBack = () => {
    navigate('/')
  }

  /** 更新设置 */
  const handleChange = (key: keyof typeof settings, value: number | boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }))
    updateSettings({ [key]: value })
  }

  return (
    <div className="ink-background min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 标题 */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-ink-black font-serif">设置</h1>
        </div>

        {/* 设置选项 */}
        <div className="card p-6 space-y-6">
          {/* 音乐音量 */}
          <div className="space-y-2">
            <label className="block text-lg text-ink-black">音乐音量</label>
            <input
              type="range"
              min="0"
              max="100"
              value={localSettings.musicVolume * 100}
              onChange={(e) => handleChange('musicVolume', parseInt(e.target.value) / 100)}
              className="w-full h-2 bg-ink-light rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-right text-ink-gray">{Math.round(localSettings.musicVolume * 100)}%</div>
          </div>

          {/* 音效音量 */}
          <div className="space-y-2">
            <label className="block text-lg text-ink-black">音效音量</label>
            <input
              type="range"
              min="0"
              max="100"
              value={localSettings.sfxVolume * 100}
              onChange={(e) => handleChange('sfxVolume', parseInt(e.target.value) / 100)}
              className="w-full h-2 bg-ink-light rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-right text-ink-gray">{Math.round(localSettings.sfxVolume * 100)}%</div>
          </div>

          {/* 对话速度 */}
          <div className="space-y-2">
            <label className="block text-lg text-ink-black">对话速度</label>
            <input
              type="range"
              min="10"
              max="100"
              value={localSettings.textSpeed}
              onChange={(e) => handleChange('textSpeed', parseInt(e.target.value))}
              className="w-full h-2 bg-ink-light rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-right text-ink-gray">
              {localSettings.textSpeed <= 30 ? '快' : localSettings.textSpeed <= 60 ? '中' : '慢'}
            </div>
          </div>

          {/* 全屏模式 */}
          <div className="flex items-center justify-between">
            <label className="text-lg text-ink-black">全屏模式</label>
            <button
              onClick={() => handleChange('fullscreen', !localSettings.fullscreen)}
              className={`w-14 h-8 rounded-full transition-colors ${
                localSettings.fullscreen ? 'bg-cinnabar' : 'bg-ink-light'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transform transition-transform ${
                  localSettings.fullscreen ? 'translate-x-7' : 'translate-x-1'
                }`}
              ></div>
            </button>
          </div>
        </div>

        {/* 返回按钮 */}
        <div className="text-center">
          <button onClick={handleBack} className="btn-primary">
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsScreen
