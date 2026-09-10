import { Entity, PrimaryKey, Property } from "@mikro-orm/core"

@Entity({ tableName: "shipping_district_config" })
export class ShippingDistrictConfig {
  @PrimaryKey({ length: 100 })
  district!: string

  @Property({ length: 100 })
  region!: string

  @Property({ default: 10000 })
  base_logistics_cost!: number

  @Property({ default: 5 })
  min_orders!: number

  @Property({ default: 24 })
  window_duration_hours!: number

  @Property({ default: true })
  is_active!: boolean
}