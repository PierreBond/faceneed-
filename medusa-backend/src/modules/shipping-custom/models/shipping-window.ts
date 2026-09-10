import { Entity, PrimaryKey, Property, Index } from "@mikro-orm/core"

@Entity({ tableName: "shipping_window" })
@Index({ properties: ["district", "status"] })
@Index({ properties: ["window_end"] })
export class SharedShippingWindow {
  @PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
  id!: string

  @Property({ length: 100 })
  district!: string

  @Property({ length: 100 })
  region!: string

  @Property({ type: "timestamptz" })
  window_start!: Date

  @Property({ type: "timestamptz" })
  window_end!: Date

  @Property({ length: 20, default: "open" })
  status!: "open" | "closing" | "closed" | "processing" | "completed"

  @Property({ type: "json", default: "[]" })
  order_ids!: string[]

  @Property({ default: 5 })
  min_orders!: number

  @Property({ default: 1500 })
  base_fee!: number

  @Property({ nullable: true })
  estimated_total_cost!: number | null

  @Property({ nullable: true })
  final_fee_per_order!: number | null

  @Property({ type: "timestamptz", onCreate: () => new Date() })
  created_at!: Date

  @Property({ type: "timestamptz", onCreate: () => new Date(), onUpdate: () => new Date() })
  updated_at!: Date
}