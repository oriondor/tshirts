# T-Shirt Print

E-commerce app for custom t-shirt (and other product) printing. Customers browse predefined designs, customize them (pick colors, sizes, upload reference images), and check out through Shopify.

## Tech Stack

- **Nuxt 4** (Vue 3.5) with file-based routing
- **Drizzle ORM** + **PostgreSQL** (via `postgres` driver)
- **nuxt-auth-utils** for session-based auth (email/password + Google OAuth)
- **orio-ui** custom component library (auto-imported, prefixed `orio-`)
- **Resend** for transactional emails
- **Shopify Storefront API** for checkout

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in the values — see `.env.example` for required variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NUXT_SESSION_SECRET` | Session secret (`openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `RESEND_API_KEY` / `EMAIL_FROM` / `APP_URL` | Transactional email |
| `SHOPIFY_STORE_DOMAIN` / `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Shopify checkout |

### 3. Run migrations

Migrations are plain SQL files in `migrations/`, numbered sequentially. Run them against your database with `psql`:

```bash
# Run all migrations in order
for f in migrations/*.sql; do psql $DATABASE_URL -f "$f"; done

# Run a single migration
psql $DATABASE_URL -f migrations/011_rename_product_type_to_product_id.sql
```

### 4. Start dev server

```bash
npm run dev        # http://localhost:3000 (with --host for LAN access)
```

### Commands

```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

## Project Structure

```
app/
  assets/configs/       # Product and design definitions
    products.ts          # Product catalog (id, name, price, properties)
    designs.ts           # Design variants per product (images, merchandiseIds)
  composables/           # Vue composables
    useCart.ts            # Cart facade
    useCartStorage.ts    # IndexedDB-backed cart persistence
    useCheckout.ts       # Order creation, Shopify checkout
    useDesign.ts         # Design image paths and metadata
  components/
    Designs/             # Design listing and preview cards
    Cart/                # Cart item display and management
    Properties/          # Dynamic product property inputs
    Order/               # Order detail views
  pages/                 # File-based routing
    product/[productId]/           # Product design listing
    product/[productId]/design/    # Design customization page
  middleware/            # Route middleware (admin.ts)
  types/                 # TypeScript types (cart.ts, products.ts, address.ts)
server/
  api/                   # API routes
    auth/                # Login, signup, OAuth, email verification
    orders/              # Order CRUD
    admin/               # Admin order management
    shopify/             # Shopify checkout + product sync
    addresses/           # User address management
  db/
    index.ts             # Lazy-initialized Drizzle instance (getDb())
    schema/              # Drizzle table definitions
  utils/
    auth.ts              # requireAuth(), requireAdmin()
    storage.ts           # File upload handling (saveOrderFile)
    validation/          # Request validation (order, file)
migrations/              # Sequential SQL migration files
public/
  products/              # Product images (see Image Conventions below)
  designs/               # Design images (see Image Conventions below)
```

## Key Concepts

### Products and Designs

A **product** (e.g. "designer-custom-t-shirt") defines a purchasable item type with configurable properties (size, color, file uploads, etc). Products are defined in `app/assets/configs/products.ts`.

A **design** is a specific variant within a product (e.g. "personalised-person" within "designer-custom-t-shirt"). Designs define the actual artwork, pricing, and Shopify `merchandiseId`. Defined in `app/assets/configs/designs.ts`.

The `ProductId` type (`app/types/products.ts`) is the union of all product IDs and is used as the key for routing, config lookups, and database storage.

### Image Conventions

Images are organized by product ID in `public/`:

```
public/products/{productId}/
  preview.png            # Catalog thumbnail (shown on product listing)
  base.png               # Base product photo (shown behind design overlay)

public/designs/{productId}/{designId}/
  {color}.png            # Design artwork per color variant
```

The `baseImage` field in `ImageProps` (per-color in `designs.ts`) allows overriding the base product image for specific design colors (e.g. a back view).

### Shopify Integration

Each design in `designs.ts` has a `merchandiseId` — the numeric Shopify variant ID. To find these IDs, hit `GET /api/shopify/products` which fetches all products and variants from the Shopify Storefront API via GraphQL and returns them with both numeric and `gid://` format IDs.

At checkout, `merchandiseId` is converted to a Shopify Global ID (`gid://shopify/ProductVariant/{id}`) and used in a `cartCreate` mutation to build the Shopify cart.

### Order Flow

1. User browses products, picks a design, customizes properties
2. Item added to cart (persisted in IndexedDB via `useCartStorage`)
3. On checkout: cart items are posted to `/api/orders` (creates order + saves uploaded images)
4. Shopify checkout is created via `/api/shopify/create-checkout` using `merchandiseId` from design config
5. User is redirected to Shopify for payment

### Authentication

Two layers protect admin functionality:
- **Pages**: `definePageMeta({ middleware: "admin" })` in `app/middleware/admin.ts`
- **API routes**: `requireAdmin(event)` in route handlers

Regular auth uses `requireAuth(event)` which returns `userId` or throws 401.

### Database

Tables: `users`, `orders`, `orderItems`, `orderItemImages`, `addresses`

Access the Drizzle instance via `getDb()` from `server/db/index.ts` (lazy-initialized singleton).

### Migrations

Migrations are plain SQL files in `migrations/`, numbered sequentially (e.g. `001_create_users.sql`, `011_rename_product_type_to_product_id.sql`).

When adding a new migration:
1. Create `migrations/{next_number}_{description}.sql`
2. Update the Drizzle schema in `server/db/schema/` to match
3. Run the migration against your database with `psql $DATABASE_URL -f migrations/{file}.sql`

### orio-ui Component Library

All components and composables from `orio-ui` are auto-imported. Components use the `orio-` prefix:

```vue
<orio-button variant="subdued">Click me</orio-button>
<orio-input v-model="name" :error="errors.name" />
<orio-modal v-bind="modalProps" title="Title">...</orio-modal>
```

Key composables: `useApi`, `useModal`, `useValidation`, `useDecimalFormatter`, `useFuzzySearch`.

## Adding a New Product

1. Add an entry to `app/assets/configs/products.ts` with a unique `id`
2. Add the `id` to the `ProductId` union in `app/types/products.ts`
3. Add a design array for it in `app/assets/configs/designs.ts`
4. Place images in `public/products/{id}/` and `public/designs/{id}/{designId}/`
5. Create the corresponding Shopify product and use its `merchandiseId` in the design config
