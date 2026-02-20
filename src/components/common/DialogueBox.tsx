/**
 * 金庸群侠传 - 对话框组件
 */

import React, { useState, useEffect } from 'react'
import Button from './Button'

interface DialogueBoxProps {
  speakerName: string
  text: string
  options?: Array<{ text: string; onClick: () => void }>
  onComplete?: () => void
  textSpeed?: number
}

/** 对话框组件 */
const DialogueBox: React.FC<DialogueBoxProps> = ({
  speakerName,
  text,
  options = [],
  onComplete,
  textSpeed = 50,
}) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  // 打字机效果
  useEffect(() => {
    setDisplayedText('')
    setIsComplete(false)
    let index = 0

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1))
        index++
      } else {
        setIsComplete(true)
        clearInterval(timer)
      }
    }, textSpeed)

    return () => clearInterval(timer)
  }, [text, textSpeed])

  /** 跳过打字机 */
  const handleSkip = () => {
    if (!isComplete) {
      setDisplayedText(text)
      setIsComplete(true)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 z-50">
      <div className="max-w-3xl mx-auto">
        {/* 说话人名称 */}
        <div className="text-cinnabar font-serif text-lg mb-2">
          {speakerName}
        </div>

        {/* 对话文本 */}
        <div
          className="text-paper text-base mb-4 min-h-[80px] cursor-pointer"
          onClick={handleSkip}
        >
          {displayedText}
          {!isComplete && (
            <span className="typewriter-cursor">|</span>
          )}
        </div>

        {/* 选项 */}
        {isComplete && options.length > 0 && (
          <div className="space-y-2">
            {options.map((option, index) => (
              <Button
                key={index}
                onClick={option.onClick}
                variant="secondary"
                fullWidth
                className="text-paper border-paper hover:bg-paper hover:text-ink-black"
              >
                {option.text}
              </Button>
            ))}
          </div>
        )}

        {/* 继续提示 */}
        {isComplete && options.length === 0 && (
          <div className="text-right">
            <Button onClick={onComplete} variant="primary">
              继续
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DialogueBox
