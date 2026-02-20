/**
 * 金庸群侠传 - 通用卡片组件
 */

import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

/** 卡片组件 */
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  const baseClasses = 'bg-paper rounded-lg shadow-lg border border-ink-light'
  const hoverClasses = hoverable ? 'hover:shadow-xl transition-shadow cursor-pointer' : ''

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
