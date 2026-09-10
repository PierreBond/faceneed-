# Faceneed Medusa Backend

Custom Medusa v2 backend for Faceneed Ghana skincare store.

## Features

- **Custom Shipping Module**: Express (₵40) + Shared Delivery (₵15+ per district)
- **Admin Product Management**: On-site product creation/editing
- **Paystack Integration**: Card + Mobile Money payments
- **Resend Email**: Order notifications
- **District-level Shipping**: 24 Ghana districts configured

## Quick Start

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start services
docker-compose up -d

# 3. Run migrations
npm run db:migrate

# 4. Seed data
npm run seed

# 5. Start dev server
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `JWT_SECRET` - 64-char secret (generate: `openssl rand -hex 32`)
- `COOKIE_SECRET` - 64-char secret
- `STORE_CORS` - Frontend URL
- `ADMIN_CORS` - Frontend URL
- `AUTH_CORS` - Frontend URL
- `RESEND_API_KEY` - For emails
- `PAYSTACK_SECRET_KEY` - Paystack test/live key

## Custom Shipping Module

### District Configuration

24 Ghana districts pre-configured with base logistics costs:
- Greater Accra: Sowutuom, East Legon, Adenta, Madina, Tema, Ashaiman, Accra Central, Dansoman, Laterbiokorshie, Ablekuma
- Ashanti: Kumasi Central, Suame, Tafo, Asokwa, Kwadaso
- Western: Takoradi, Sekondi
- Central: Cape Coast
- Northern: Tamale
- Volta: Ho
- Eastern: Koforidua
- Bono: Sunyani
- Upper East: Bolgatanga
- Upper West: Wa

### Shipping Options

| Option | Cost | Delivery | Min Orders |
|--------|------|----------|------------|
| Express | ₵40 | 1-2 days | N/A |
| Shared | ₵15+ | 12-72 hrs | 5 per district |

### Window Lifecycle

1. **Open**: Accepting orders (12-72 hours)
2. **Closing**: 2 hours before end
3. **Closed**: No new orders
4. **Processing**: Calculating final fees
5. **Completed**: Fees notified to customers

### Fee Calculation

```
final_fee = max(base_fee, (base_logistics + per_order_handling * order_count) / order_count)
capped at express_price (₵40)
```

## API Endpoints

### Store API (Customer-facing)

```
GET /store/shipping-options?district=Sowutuom
GET /store/shipping-windows/:district
```

### Admin API

```
GET    /admin/shipping-windows
POST   /admin/shipping-districts
GET    /admin/shipping-windows/:id
POST   /admin/shipping-windows/:id (action: close|recalculate)
```

## Admin Product Management

Admin users identified by customer metadata:
```json
{ "role": "admin" }
```

Endpoints:
```
GET    /admin/products
POST   /admin/products
PUT    /admin/products/:id
DELETE /admin/products/:id
POST   /admin/products/:id/images
```

## Deployment (Railway)

1. Create Railway project from template
2. Add PostgreSQL + Redis services
3. Set environment variables
4. Deploy
5. Run migrations: `railway run npm run db:migrate`
6. Seed: `railway run npm run seed`

## Project Structure

```
src/
├── modules/
│   └── shipping-custom/          # Custom shipping module
│       ├── models/               # Entities
│       ├── repositories/         # Data access
│       ├── services/             # Business logic
│       ├── loaders/              # Cron jobs
│       └── api/                  # API routes
├── migrations/                   # Database migrations
├── scripts/                      # Seed scripts
└── medusa-config.ts              # Medusa configuration
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:migrate` | Run migrations |
| `npm run db:generate` | Generate migration |
| `npm run seed` | Seed initial data |