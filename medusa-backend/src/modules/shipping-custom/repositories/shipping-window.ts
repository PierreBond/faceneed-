import { EntityRepository, EntityManager, FilterQuery } from "@mikro-orm/core"
import { SharedShippingWindow } from "../models/shipping-window"
import { ShippingDistrictConfig } from "../models/shipping-district-config"

export class ShippingWindowRepository extends EntityRepository<SharedShippingWindow> {
  async findOpenWindow(district: string): Promise<SharedShippingWindow | null> {
    return this.findOne({
      district,
      status: "open",
    } as FilterQuery<SharedShippingWindow>, {
      orderBy: { window_start: "ASC" },
    })
  }

  async findOrCreateOpenWindow(
    district: string,
    region: string,
    config: ShippingDistrictConfig,
    em: EntityManager
  ): Promise<SharedShippingWindow> {
    let window = await this.findOpenWindow(district)
    
    if (!window) {
      const now = new Date()
      const windowEnd = new Date(now.getTime() + config.window_duration_hours * 60 * 60 * 1000)
      
      window = em.create(SharedShippingWindow, {
        district,
        region,
        window_start: now,
        window_end: windowEnd,
        status: "open",
        order_ids: [],
        min_orders: config.min_orders,
        base_fee: 1500,
        estimated_total_cost: config.base_logistics_cost,
      })
      
      await em.persistAndFlush(window)
    }
    
    return window
  }

  async findExpiredWindows(): Promise<SharedShippingWindow[]> {
    const now = new Date()
    return this.find({
      status: "open",
      window_end: { $lt: now },
    } as FilterQuery<SharedShippingWindow>)
  }

  async findClosingSoonWindows(hoursBefore: number = 2): Promise<SharedShippingWindow[]> {
    const threshold = new Date(Date.now() + hoursBefore * 60 * 60 * 1000)
    return this.find({
      status: "open",
      window_end: { $lt: threshold },
    } as FilterQuery<SharedShippingWindow>)
  }

  async findByIdWithOrders(id: string): Promise<SharedShippingWindow | null> {
    return this.findOne({ id } as FilterQuery<SharedShippingWindow>)
  }

  async addOrderToWindow(windowId: string, orderId: string, em: EntityManager): Promise<void> {
    const window = await this.findByIdWithOrders(windowId)
    if (!window) return
    
    if (!window.order_ids.includes(orderId)) {
      window.order_ids.push(orderId)
      window.updated_at = new Date()
      await em.persistAndFlush(window)
    }
  }

  async updateWindowStatus(
    windowId: string, 
    status: SharedShippingWindow["status"], 
    em: EntityManager,
    finalFee?: number
  ): Promise<void> {
    const window = await this.findByIdWithOrders(windowId)
    if (!window) return
    
    window.status = status
    window.updated_at = new Date()
    
    if (finalFee !== undefined) {
      window.final_fee_per_order = finalFee
    }
    
    await em.persistAndFlush(window)
  }

  async getDistrictConfig(district: string): Promise<ShippingDistrictConfig | null> {
    const em = this.getEntityManager()
    return em.findOne(ShippingDistrictConfig, { district, is_active: true })
  }

  async getAllDistrictConfigs(): Promise<ShippingDistrictConfig[]> {
    const em = this.getEntityManager()
    return em.find(ShippingDistrictConfig, { is_active: true })
  }

  async upsertDistrictConfig(config: Partial<ShippingDistrictConfig> & { district: string }, em: EntityManager): Promise<ShippingDistrictConfig> {
    let existing = await this.getDistrictConfig(config.district)
    
    if (!existing) {
      existing = em.create(ShippingDistrictConfig, config)
    } else {
      Object.assign(existing, config)
    }
    
    await em.persistAndFlush(existing)
    return existing
  }
}