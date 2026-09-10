import { MedusaService } from "@medusajs/framework/utils"
import { SharedShippingWindow } from "./models/shipping-window"
import { ShippingDistrictConfig } from "./models/shipping-district-config"
import { ShippingWindowRepository } from "./repositories/shipping-window"
import { SharedShippingCalculator } from "./services/shipping-calculator"
import { WindowManager } from "./services/window-manager"
import { NotificationService } from "./services/notification-service"

class ShippingCustomService extends MedusaService({
  SharedShippingWindow,
  ShippingDistrictConfig,
}) {
  protected repository_: ShippingWindowRepository
  protected calculator_: SharedShippingCalculator
  protected windowManager_: WindowManager
  protected notificationService_: NotificationService

  constructor(container: any) {
    super(container)
    
    this.repository_ = new ShippingWindowRepository(
      container.manager?.getRepository(SharedShippingWindow) || container.manager
    )
    
    this.calculator_ = new SharedShippingCalculator()
    this.notificationService_ = new NotificationService()
    this.windowManager_ = new WindowManager(
      this.repository_,
      this.calculator_,
      this.notificationService_,
      container.manager
    )
  }

  get repository(): ShippingWindowRepository {
    return this.repository_
  }

  get calculator(): SharedShippingCalculator {
    return this.calculator_
  }

  get windowManager(): WindowManager {
    return this.windowManager_
  }

  get notificationService(): NotificationService {
    return this.notificationService_
  }

  async initializeDistrictConfigs(): Promise<void> {
    const configs = await this.repository.getAllDistrictConfigs()
    this.calculator.setDistrictConfigs(configs)
  }

  async getShippingOptions(district: string): Promise<Array<{
    id: string
    name: string
    type: "fixed" | "shared"
    amount: number
    district?: string
    metadata?: Record<string, any>
  }>> {
    const config = await this.repository.getDistrictConfig(district)
    
    const expressOption = {
      id: "express",
      name: "Express Delivery",
      type: "fixed" as const,
      amount: 4000,
      metadata: {
        estimated_delivery: "1-2 business days",
      },
    }

    if (!config) {
      return [expressOption]
    }

    const window = await this.repository.findOpenWindow(district)
    const currentOrders = window?.order_ids.length || 0
    const feeRange = this.calculator.getEstimatedFeeRange(district, currentOrders, config.min_orders)

    const sharedOption = {
      id: `shared-${district}`,
      name: "Shared Delivery",
      type: "shared" as const,
      amount: feeRange.min,
      district,
      metadata: {
        window_id: window?.id,
        min_orders: config.min_orders,
        current_orders: currentOrders,
        estimated_delivery: "12-72 hours",
        fee_range: feeRange,
      },
    }

    return [expressOption, sharedOption]
  }
}

export default ShippingCustomService