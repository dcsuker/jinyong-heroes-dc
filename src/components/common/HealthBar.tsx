/**
 * 金庸群侠传 - 血条组件
 */

import React from 'react'

interface HealthBarProps {
  current: number
  max: number
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

/** 血条组件 */
const HealthBar: React.FC<HealthBarProps> = ({
  current,
  max,
  showText = true,
  size = 'md',
}) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100))
  const isLow = percentage < 30

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  return (
    <div className="w-full">
      {showText && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-ink-gray">生命</span>
          <span className="font-medium">{current} / {max}</span>
        </div>
      )}
      <div className={`health-bar ${sizeClasses[size]}`}>
        <div
          className={`health-bar-fill ${isLow ? 'low' : ''}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default HealthBar
