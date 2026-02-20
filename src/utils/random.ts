/**
 * 金庸群侠传 - 随机数工具
 */

/**
 * 生成指定范围内的随机整数
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns 随机整数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成指定范围内的随机浮点数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机浮点数
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * 从数组中随机选择一个元素
 * @param array 源数组
 * @returns 随机选择的元素，如果数组为空则返回 undefined
 */
export function randomChoice<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined
  return array[randomInt(0, array.length - 1)]
}

/**
 * 从数组中随机选择多个不重复的元素
 * @param array 源数组
 * @param count 选择数量
 * @returns 随机选择的元素数组
 */
export function randomChoices<T>(array: T[], count: number): T[] {
  const shuffled = [...array]
  const result: T[] = []
  for (let i = 0; i < Math.min(count, array.length); i++) {
    const index = randomInt(0, shuffled.length - 1)
    result.push(shuffled.splice(index, 1)[0])
  }
  return result
}

/**
 * 根据权重随机选择
 * @param items 项目数组，每个项目包含值和权重
 * @returns 随机选择的项目值
 */
export function randomWeighted<T>(items: { value: T; weight: number }[]): T | null {
  if (items.length === 0) return null

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
  let random = Math.random() * totalWeight

  for (const item of items) {
    if (random < item.weight) {
      return item.value
    }
    random -= item.weight
  }

  return items[items.length - 1].value
}

/**
 * 随机打乱数组
 * @param array 要打乱的数组
 * @returns 打乱后的新数组
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * 随机生成一个 ID
 * @param prefix 前缀
 * @returns 随机 ID
 */
export function generateId(prefix: string = ''): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 8; i++) {
    id += chars[randomInt(0, chars.length - 1)]
  }
  return prefix ? `${prefix}_${id}` : id
}

/**
 * 百分比概率判断
 * @param chance 概率（0-100）
 * @returns 是否触发
 */
export function chance(chance: number): boolean {
  return Math.random() * 100 < chance
}

/**
 * 从枚举中随机选择一个值
 * @param enumObj 枚举对象
 * @returns 随机枚举值
 */
export function randomEnum<T extends Record<string, string | number>>(enumObj: T): T[keyof T] {
  const values = Object.values(enumObj).filter(v => typeof v === 'string') as T[keyof T][]
  return randomChoice(values) || values[0]
}
