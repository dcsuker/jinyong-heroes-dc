/**
 * 金庸群侠传 - 地图移动引擎
 * 实现世界地图移动和城镇探索
 */

import { Location, LocationConnection } from '@/types'

/** 地图引擎类 */
export class MapEngine {
  /** 所有地点 */
  private locations: Map<string, Location>
  /** 当前所在地 ID */
  private currentLocationId: string | null = null
  /** 位置更新回调 */
  private onLocationChange: (location: Location) => void
  /** 探索更新回调 */
  private onExplore: (locationId: string) => void

  constructor(
    locations: Location[],
    onLocationChange: (location: Location) => void,
    onExplore: (locationId: string) => void
  ) {
    this.locations = new Map(locations.map(l => [l.id, l]))
    this.onLocationChange = onLocationChange
    this.onExplore = onExplore
  }

  /**
   * 获取当前所在地
   */
  getCurrentLocation(): Location | null {
    if (!this.currentLocationId) return null
    return this.locations.get(this.currentLocationId) || null
  }

  /**
   * 根据 ID 获取地点
   */
  getLocationById(id: string): Location | null {
    return this.locations.get(id) || null
  }

  /**
   * 获取所有地点
   */
  getAllLocations(): Location[] {
    return Array.from(this.locations.values())
  }

  /**
   * 获取已探索的地点
   */
  getExploredLocations(): Location[] {
    return this.getAllLocations().filter(l => l.explored)
  }

  /**
   * 获取未探索的地点
   */
  getUnexploredLocations(): Location[] {
    return this.getAllLocations().filter(l => !l.explored)
  }

  /**
   * 设置当前位置
   */
  setCurrentLocation(locationId: string): boolean {
    const location = this.locations.get(locationId)
    if (!location) {
      return false
    }

    this.currentLocationId = locationId

    // 标记为已探索
    if (!location.explored) {
      location.explored = true
      this.onExplore(locationId)
    }

    this.onLocationChange(location)
    return true
  }

  /**
   * 移动到相邻地点
   */
  moveTo(targetId: string): boolean {
    const current = this.getCurrentLocation()
    if (!current) {
      return false
    }

    // 检查是否有连接
    const connection = current.connections?.find(c => c.targetId === targetId)
    if (!connection) {
      return false
    }

    return this.setCurrentLocation(targetId)
  }

  /**
   * 获取从当前位置可到达的地点
   */
  getAccessibleLocations(): Location[] {
    const current = this.getCurrentLocation()
    if (!current || !current.connections) {
      return []
    }

    return current.connections
      .map(c => this.locations.get(c.targetId))
      .filter((l): l is Location => !!l)
  }

  /**
   * 获取两个地点之间的距离
   */
  getDistance(fromId: string, toId: string): number | null {
    const from = this.locations.get(fromId)
    if (!from || !from.connections) {
      return null
    }

    const connection = from.connections.find(c => c.targetId === toId)
    return connection?.distance || null
  }

  /**
   * 计算两点之间的最短路径（BFS）
   */
  findPath(fromId: string, toId: string): string[] | null {
    if (fromId === toId) {
      return [fromId]
    }

    const from = this.locations.get(fromId)
    const to = this.locations.get(toId)

    if (!from || !to) {
      return null
    }

    const visited = new Set<string>()
    const queue: { id: string; path: string[] }[] = [{ id: fromId, path: [fromId] }]

    while (queue.length > 0) {
      const { id, path } = queue.shift()!

      if (visited.has(id)) continue
      visited.add(id)

      const location = this.locations.get(id)
      if (!location || !location.connections) continue

      for (const connection of location.connections) {
        if (connection.targetId === toId) {
          return [...path, toId]
        }

        if (!visited.has(connection.targetId)) {
          queue.push({
            id: connection.targetId,
            path: [...path, connection.targetId],
          })
        }
      }
    }

    return null
  }

  /**
   * 获取地点类型筛选
   */
  getLocationsByType(type: string): Location[] {
    return this.getAllLocations().filter(l => l.type === type)
  }

  /**
   * 添加地点连接
   */
  addConnection(fromId: string, connection: LocationConnection): boolean {
    const location = this.locations.get(fromId)
    if (!location) {
      return false
    }

    if (!location.connections) {
      location.connections = []
    }

    location.connections.push(connection)
    return true
  }

  /**
   * 移除地点连接
   */
  removeConnection(fromId: string, targetId: string): boolean {
    const location = this.locations.get(fromId)
    if (!location || !location.connections) {
      return false
    }

    const index = location.connections.findIndex(c => c.targetId === targetId)
    if (index === -1) {
      return false
    }

    location.connections.splice(index, 1)
    return true
  }

  /**
   * 获取附近地点（指定距离内）
   */
  getNearbyLocations(maxDistance: number): Location[] {
    const current = this.getCurrentLocation()
    if (!current || !current.connections) {
      return []
    }

    return current.connections
      .filter(c => c.distance <= maxDistance)
      .map(c => this.locations.get(c.targetId))
      .filter((l): l is Location => !!l)
  }

  /**
   * 标记地点为已探索
   */
  markExplored(locationId: string): void {
    const location = this.locations.get(locationId)
    if (location && !location.explored) {
      location.explored = true
      this.onExplore(locationId)
    }
  }

  /**
   * 检查地点是否已探索
   */
  isExplored(locationId: string): boolean {
    const location = this.locations.get(locationId)
    return location?.explored || false
  }
}

export default MapEngine
