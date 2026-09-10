import { ShippingDistrictConfig } from "../models/shipping-district-config"
import { SharedShippingWindow } from "../models/shipping-window"

export class SharedShippingCalculator {
  private districtConfigs: Map<string, ShippingDistrictConfig> = new Map()

  setDistrictConfigs(configs: ShippingDistrictConfig[]): void {
    this.districtConfigs.clear()
    for (const config of configs) {
      this.districtConfigs.set(config.district, config)
    }
  }

  async calculateFinalFee(window: SharedShippingWindow): Promise<number> {
    const orderCount = window.order_ids.length
    const minOrders = window.min_orders

    if (orderCount < minOrders) {
      return 4000
    }

    const config = this.districtConfigs.get(window.district)
    const baseLogistics = config?.base_logistics_cost || 10000
    const perOrderHandling = 300
    const estimatedTotal = baseLogistics + perOrderHandling * orderCount

    const feePerOrder = Math.max(window.base_fee, Math.ceil(estimatedTotal / orderCount))
    return Math.min(feePerOrder, 4000)
  }

  getEstimatedFeeRange(district: string, currentOrders: number, minOrders: number): { min: number; max: number } {
    const config = this.districtConfigs.get(district)
    const baseLogistics = config?.base_logistics_cost || 10000
    const perOrderHandling = 300

    const minScenarioOrders = Math.max(currentOrders, minOrders)
    const minEstimatedTotal = baseLogistics + perOrderHandling * minScenarioOrders
    const minFee = Math.max(1500, Math.ceil(minEstimatedTotal / minScenarioOrders))

    const maxScenarioOrders = minOrders * 3
    const maxEstimatedTotal = baseLogistics + perOrderHandling * maxScenarioOrders
    const maxFee = Math.max(1500, Math.ceil(maxEstimatedTotal / maxScenarioOrders))

    return {
      min: Math.min(minFee, 4000),
      max: Math.min(Math.max(minFee, maxFee), 4000),
    }
  }

  isWindowClosingSoon(window: SharedShippingWindow, hoursThreshold: number = 2): boolean {
    const timeLeft = window.window_end.getTime() - Date.now()
    return timeLeft <= hoursThreshold * 60 * 60 * 1000 && timeLeft > 0
  }

  getWindowStatus(window: SharedShippingWindow): "open" | "closing" | "closed" {
    const now = Date.now()
    if (now >= window.window_end.getTime()) return "closed"
    if (this.isWindowClosingSoon(window)) return "closing"
    return "open"
  }

  formatTimeRemaining(endTime: Date): string {
    const ms = endTime.getTime() - Date.now()
    if (ms <= 0) return "Closed"

    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }
}