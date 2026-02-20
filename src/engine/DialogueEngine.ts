/**
 * 金庸群侠传 - 对话引擎
 * 实现对话树系统和打字机效果
 */

import { DialogueTree, DialogueNode, DialogueOption, DialogueEffect, CharacterId } from '@/types'

/** 对话引擎类 */
export class DialogueEngine {
  /** 当前对话树 */
  private currentTree: DialogueTree | null = null
  /** 当前节点 ID */
  private currentNodeId: string | null = null
  /** 已显示的文本 */
  private displayedText: string = ''
  /** 完整文本 */
  private fullText: string = ''
  /** 打字机效果定时器 */
  private typewriterTimer: number | null = null
  /** 打字机速度（毫秒/字） */
  private textSpeed: number = 50
  /** 对话结束回调 */
  private onDialogueEnd: () => void
  /** 文本更新回调 */
  private onTextUpdate: (text: string, isComplete: boolean) => void
  /** 选项更新回调 */
  private onOptionsUpdate: (options: DialogueOption[]) => void

  constructor(
    onDialogueEnd: () => void,
    onTextUpdate: (text: string, isComplete: boolean) => void,
    onOptionsUpdate: (options: DialogueOption[]) => void
  ) {
    this.onDialogueEnd = onDialogueEnd
    this.onTextUpdate = onTextUpdate
    this.onOptionsUpdate = onOptionsUpdate
  }

  /**
   * 开始对话
   */
  startDialogue(tree: DialogueTree, startNodeId?: string): void {
    this.currentTree = tree
    this.currentNodeId = startNodeId || tree.startNodeId
    this.displayedText = ''
    this.fullText = ''
    this.startTypewriter()
  }

  /**
   * 获取当前节点
   */
  getCurrentNode(): DialogueNode | null {
    if (!this.currentTree || !this.currentNodeId) {
      return null
    }
    return this.currentTree.nodes[this.currentNodeId] || null
  }

  /**
   * 获取当前说话人 ID
   */
  getCurrentSpeakerId(): CharacterId | null {
    const node = this.getCurrentNode()
    return node ? node.speakerId : null
  }

  /**
   * 开始打字机效果
   */
  private startTypewriter(): void {
    const node = this.getCurrentNode()
    if (!node) {
      this.onDialogueEnd()
      return
    }

    this.fullText = node.text
    this.displayedText = ''

    // 清除之前的定时器
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer)
    }

    let charIndex = 0

    this.typewriterTimer = window.setInterval(() => {
      if (charIndex < this.fullText.length) {
        this.displayedText = this.fullText.substring(0, charIndex + 1)
        this.onTextUpdate(this.displayedText, false)
        charIndex++
      } else {
        this.completeTypewriter()
      }
    }, this.textSpeed)
  }

  /**
   * 完成打字机效果
   */
  private completeTypewriter(): void {
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer)
      this.typewriterTimer = null
    }
    this.displayedText = this.fullText
    this.onTextUpdate(this.displayedText, true)

    // 显示选项
    const node = this.getCurrentNode()
    if (node && node.options) {
      this.onOptionsUpdate(node.options)
    }
  }

  /**
   * 跳过打字机效果（直接显示完整文本）
   */
  skipTypewriter(): void {
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer)
      this.typewriterTimer = null
    }
    this.displayedText = this.fullText
    this.onTextUpdate(this.displayedText, true)

    // 显示选项
    const node = this.getCurrentNode()
    if (node && node.options) {
      this.onOptionsUpdate(node.options)
    }
  }

  /**
   * 选择对话选项
   */
  selectOption(option: DialogueOption): void {
    // 执行效果
    if (option.effect) {
      this.executeEffect(option.effect)
    }

    // 跳转到下一节点
    this.currentNodeId = option.nextNodeId
    this.displayedText = ''
    this.fullText = ''

    // 检查是否是结束节点
    const node = this.getCurrentNode()
    if (!node || node.isEnd) {
      this.onDialogueEnd()
      return
    }

    // 开始新的打字机效果
    this.startTypewriter()
  }

  /**
   * 执行对话效果
   */
  private executeEffect(effect: DialogueEffect): void {
    // 这里只是通知效果，实际执行需要外部处理
    console.log('执行对话效果:', effect)
  }

  /**
   * 设置打字机速度
   */
  setTextSpeed(speed: number): void {
    this.textSpeed = speed
  }

  /**
   * 检查打字机是否正在进行
   */
  isTyping(): boolean {
    return this.typewriterTimer !== null
  }

  /**
   * 结束对话
   */
  endDialogue(): void {
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer)
      this.typewriterTimer = null
    }
    this.currentTree = null
    this.currentNodeId = null
    this.displayedText = ''
    this.fullText = ''
    this.onDialogueEnd()
  }
}

export default DialogueEngine
