/**
 * 金庸群侠传 - UI 状态管理
 */

import { create } from 'zustand'

/** UI 状态接口 */
interface UIState {
  /** 当前显示的弹窗类型 */
  activeModal: 'none' | 'settings' | 'help' | 'confirm'
  /** 确认框回调 */
  confirmCallback: ((confirmed: boolean) => void) | null
  /** 确认框标题 */
  confirmTitle: string
  /** 确认框内容 */
  confirmMessage: string
  /** 是否显示加载界面 */
  isLoading: boolean
  /** 加载提示文字 */
  loadingText: string
  /** 通知消息队列 */
  notifications: Notification[]
  /** 当前子屏幕（如背包、角色面板） */
  activeSubScreen: 'none' | 'character' | 'inventory' | 'skills' | 'map'
  /** 设置 activeModal */
  setModal: (modal: 'none' | 'settings' | 'help' | 'confirm') => void
  /** 显示确认框 */
  showConfirm: (title: string, message: string, callback: (confirmed: boolean) => void) => void
  /** 显示加载 */
  showLoading: (text?: string) => void
  /** 隐藏加载 */
  hideLoading: () => void
  /** 添加通知 */
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
  /** 设置子屏幕 */
  setSubScreen: (screen: 'none' | 'character' | 'inventory' | 'skills' | 'map') => void
}

/** 通知消息 */
interface Notification {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: number
}

/** 创建 UI Store */
export const useUIStore = create<UIState>((set) => ({
  activeModal: 'none',
  confirmCallback: null,
  confirmTitle: '',
  confirmMessage: '',
  isLoading: false,
  loadingText: '加载中...',
  notifications: [],
  activeSubScreen: 'none',

  setModal: (modal) => set({ activeModal: modal }),

  showConfirm: (title, message, callback) => set({
    activeModal: 'confirm',
    confirmTitle: title,
    confirmMessage: message,
    confirmCallback: callback,
  }),

  showLoading: (text = '加载中...') => set({
    isLoading: true,
    loadingText: text,
  }),

  hideLoading: () => set({ isLoading: false }),

  addNotification: (message, type = 'info') => {
    const id = `notif_${Date.now()}_${Math.random()}`
    const notification: Notification = {
      id,
      message,
      type,
      timestamp: Date.now(),
    }
    set((state) => ({
      notifications: [...state.notifications, notification],
    }))
    // 5 秒后自动移除
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id),
      }))
    }, 5000)
  },

  setSubScreen: (screen) => set({ activeSubScreen: screen }),
}))
