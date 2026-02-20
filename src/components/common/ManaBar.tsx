/**
 * 金庸群侠传 - 内力条组件
 */

import React from 'react'

interface ManaBarProps {
  current: number
  max: number
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

/** 内力条组件 */
const ManaBar: React.FC<ManaBarProps> = ({
  current,
  max,
  showText = true,
}) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100))

  return (
    <div className="w-full">
      {showText && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-ink-gray">内力</span>
          <span className="font-medium">{current} / {max}</span>
        </div>
      )}
      <div className="mana-bar">
        <div
          className="mana-bar-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ManaBar
