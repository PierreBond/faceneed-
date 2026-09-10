export interface ShippingOptionCustom {
  id: string
  name: "Express" | "Shared"
  type: "fixed" | "shared"
  amount: number
  district?: string
  metadata?: {
    window_id?: string
    min_orders?: number
    current_orders?: number
    estimated_delivery?: string
  }
}

export interface WindowStatusResponse {
  window_id: string
  district: string
  status: "open" | "closing" | "closed" | "processing" | "completed"
  current_orders: number
  min_orders: number
  base_fee: number
  estimated_fee_range: { min: number; max: number }
  window_closes_in: string
  final_fee_per_order?: number
}

export interface OrderShippingWindowInfo {
  order_id: string
  window_id: string
  district: string
  status: "pending" | "confirmed" | "processing" | "completed"
  estimated_fee: number
  final_fee?: number
}