import { Migration } from "@mikro-orm/migrations"

export class ShippingCustomTables extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "shipping_window" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "district" varchar(100) NOT NULL,
        "region" varchar(100) NOT NULL,
        "window_start" timestamptz NOT NULL,
        "window_end" timestamptz NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'open',
        "order_ids" jsonb NOT NULL DEFAULT '[]',
        "min_orders" int NOT NULL DEFAULT 5,
        "base_fee" int NOT NULL DEFAULT 1500,
        "estimated_total_cost" int,
        "final_fee_per_order" int,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "shipping_window_pkey" PRIMARY KEY ("id")
      );
    `)

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "idx_shipping_window_district_status" 
      ON "shipping_window" ("district", "status");
    `)

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "idx_shipping_window_end" 
      ON "shipping_window" ("window_end");
    `)

    this.addSql(`
      CREATE TABLE IF NOT EXISTS "shipping_district_config" (
        "district" varchar(100) NOT NULL,
        "region" varchar(100) NOT NULL,
        "base_logistics_cost" int NOT NULL DEFAULT 10000,
        "min_orders" int NOT NULL DEFAULT 5,
        "window_duration_hours" int NOT NULL DEFAULT 24,
        "is_active" boolean NOT NULL DEFAULT true,
        CONSTRAINT "shipping_district_config_pkey" PRIMARY KEY ("district")
      );
    `)

    // Insert default district configurations for Ghana
    this.addSql(`
      INSERT INTO "shipping_district_config" ("district", "region", "base_logistics_cost", "min_orders", "window_duration_hours", "is_active") VALUES
      ('Sowutuom', 'Greater Accra', 8000, 5, 24, true),
      ('East Legon', 'Greater Accra', 10000, 5, 24, true),
      ('Adenta', 'Greater Accra', 9000, 5, 24, true),
      ('Madina', 'Greater Accra', 8500, 5, 24, true),
      ('Tema', 'Greater Accra', 9500, 5, 24, true),
      ('Ashaiman', 'Greater Accra', 9000, 5, 24, true),
      ('Accra Central', 'Greater Accra', 7000, 5, 24, true),
      ('Dansoman', 'Greater Accra', 7500, 5, 24, true),
      ('Laterbiokorshie', 'Greater Accra', 8000, 5, 24, true),
      ('Ablekuma', 'Greater Accra', 8500, 5, 24, true),
      ('Kumasi Central', 'Ashanti', 15000, 5, 24, true),
      ('Suame', 'Ashanti', 14000, 5, 24, true),
      ('Tafo', 'Ashanti', 14500, 5, 24, true),
      ('Asokwa', 'Ashanti', 15000, 5, 24, true),
      ('Kwadaso', 'Ashanti', 15500, 5, 24, true),
      ('Takoradi', 'Western', 18000, 5, 24, true),
      ('Sekondi', 'Western', 18500, 5, 24, true),
      ('Cape Coast', 'Central', 16000, 5, 24, true),
      ('Tamale', 'Northern', 22000, 5, 24, true),
      ('Ho', 'Volta', 17000, 5, 24, true),
      ('Koforidua', 'Eastern', 13000, 5, 24, true),
      ('Sunyani', 'Bono', 19000, 5, 24, true),
      ('Bolgatanga', 'Upper East', 25000, 5, 24, true),
      ('Wa', 'Upper West', 26000, 5, 24, true)
      ON CONFLICT ("district") DO NOTHING;
    `)
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "shipping_window";`)
    this.addSql(`DROP TABLE IF EXISTS "shipping_district_config";`)
  }
}