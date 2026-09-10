import { EntityManager } from "@mikro-orm/core"
import { SharedShippingWindow } from "../models/shipping-window"
import { ShippingDistrictConfig } from "../models/shipping-district-config"
import { ShippingWindowRepository } from "../repositories/shipping-window"
import { SharedShippingCalculator } from "./shipping-calculator"
import { NotificationService } from "./notification-service"

export class WindowManager {
  private repo: ShippingWindowRepository
  private calculator: SharedShippingCalculator
  private notificationService: NotificationService
  private em: EntityManager

  constructor(
    repo: ShippingWindowRepository,
    calculator: SharedShippingCalculator,
    notificationService: NotificationService,
    em: EntityManager
  ) {
    this.repo = repo
    this.calculator = calculator
    this.notificationService = notificationService
    this.em = em
  }

  async getOrCreateWindow(district: string): Promise<SharedShippingWindow> {
    const config = await this.repo.getDistrictConfig(district)
    if (!config) {
      throw new Error(`No shipping config for district: ${district}`)
    }
    return this.repo.findOrCreateOpenWindow(district, config.region, config, this.em)
  }

  async assignOrderToWindow(orderId: string, district: string): Promise<SharedShippingWindow> {
    const window = await this.getOrCreateWindow(district)
    await this.repo.addOrderToWindow(window.id, orderId, this.em)
    return window
  }

  async closeWindow(windowId: string): Promise<SharedShippingWindow | null> {
    const window = await this.repo.findByIdWithOrders(windowId)
    if (!window || window.status !== "open") return null

    await this.repo.updateWindowStatus(windowId, "processing", this.em)

    const finalFee = await this.calculator.calculateFinalFee(window)
    await this.repo.updateWindowStatus(windowId, "completed", this.em, finalFee)

    await this.notificationService.notifyFeeUpdate(window, finalFee)

    return { ...window, final_fee_per_order: finalFee, status: "completed" }
  }

  async closeExpiredWindows(): Promise<SharedShippingWindow[]> {
    const expired = await this.repo.findExpiredWindows()
    const results: SharedShippingWindow[] = []

    for (const window of expired) {
      const closed = await this.closeWindow(window.id)
      if (closed) results.push(closed)
    }

    return results
  }

  async updateClosingSoonWindows(): Promise<void> {
    const closing = await this.repo.findClosingSoonWindows(2)
    for (const window of closing) {
      if (window.status === "open") {
        await this.repo.updateWindowStatus(window.id, "closing", this.em)
      }
    }
  }

  async recalculateWindow(windowId: string): Promise<number | null> {
    const window = await this.repo.findByIdWithOrders(windowId)
    if (!window) return null

    const finalFee = await this.calculator.calculateFinalFee(window)
    await this.repo.updateWindowStatus(windowId, "processing", this.em, finalFee)
    await this.notificationService.notifyFeeUpdate(window, finalFee)
    await this.repo.updateWindowStatus(windowId, "completed", this.em, finalFee)

    return finalFee
  }

  async getWindowStatus(windowId: string) {
    const window = await this.repo.findByIdWithOrders(windowId)
    if (!window) return null

    const currentOrders = window.order_ids.length
    const feeRange = this.calculator.getEstimatedFeeRange(
      window.district,
      currentOrders,
      window.min_orders
    )

    return {
      window_id: window.id,
      district: window.district,
      status: this.calculator.getWindowStatus(window),
      current_orders: currentOrders,
      min_orders: window.min_orders,
      base_fee: window.base_fee,
      estimated_fee_range: feeRange,
      window_closes_in: this.calculator.formatTimeRemaining(window.window_end),
      final_fee_per_order: window.final_fee_per_order,
    }
  }

  async getDistrictConfigs(): Promise<ShippingDistrictConfig[]> {
    return this.repo.getAllDistrictConfigs()
  }

  async updateDistrictConfig(config: Partial<ShippingDistrictConfig> & { district: string }): Promise<ShippingDistrictConfig> {
    return this.repo.upsertDistrictConfig(config, this.em)
  }
}