# Project Structure

## Directory Tree

```
ecommerce-template/
│
├── 📄 README.md                    # Main documentation
├── 📄 QUICKSTART.md                # Quick setup guide
├── 📄 PHASE1-COMPLETE.md           # Phase 1 summary
├── 📄 PROJECT-STRUCTURE.md         # This file
├── 📄 package.json                 # Root package.json with helper scripts
├── 📄 docker-compose.yml           # Multi-service orchestration
├── 📄 .env                         # Environment variables (gitignored)
├── 📄 .env.example                 # Environment template
├── 📄 .gitignore                   # Git ignore rules
│
├── 📁 backend/                     # Vendure Backend
│   ├── 📁 src/
│   │   ├── 📄 index.ts            # Application entry point
│   │   ├── 📄 vendure-config.ts   # Vendure configuration
│   │   ├── 📁 plugins/            # Custom Vendure plugins
│   │   ├── 📁 migrations/         # Database migrations
│   │   └── 📁 types/              # TypeScript type definitions
│   │
│   ├── 📁 static/                 # Static assets
│   │   ├── 📁 assets/             # Uploaded product images
│   │   └── 📁 email/              # Email templates & test emails
│   │
│   ├── 📄 package.json            # Backend dependencies
│   ├── 📄 tsconfig.json           # TypeScript config
│   ├── 📄 Dockerfile              # Docker build instructions
│   └── 📄 .dockerignore           # Docker ignore rules
│
└── 📁 storefront/                 # Next.js Frontend
    ├── 📁 app/                    # Next.js App Router
    │   ├── 📄 layout.tsx          # Root layout
    │   ├── 📄 page.tsx            # Homepage
    │   ├── 📄 globals.css         # Global styles
    │   ├── 📄 not-found.tsx       # 404 page
    │   │
    │   ├── 📁 products/           # Products section
    │   │   ├── 📄 page.tsx        # Product listing
    │   │   └── 📁 [slug]/
    │   │       └── 📄 page.tsx    # Product detail (dynamic)
    │   │
    │   └── 📁 cart/
    │       └── 📄 page.tsx        # Shopping cart
    │
    ├── 📁 components/             # React components
    │   ├── 📄 Header.tsx          # Site header
    │   ├── 📄 Footer.tsx          # Site footer
    │   └── 📄 ProductCard.tsx     # Product card component
    │
    ├── 📁 lib/                    # Utilities
    │   ├── 📄 graphql-client.ts   # GraphQL client setup
    │   └── 📄 queries.ts          # GraphQL queries
    │
    ├── 📁 types/                  # TypeScript types
    │   └── 📄 index.ts            # Type definitions
    │
    ├── 📁 hooks/                  # Custom React hooks (future)
    ├── 📁 public/                 # Public static files
    │
    ├── 📄 package.json            # Frontend dependencies
    ├── 📄 tsconfig.json           # TypeScript config
    ├── 📄 next.config.ts          # Next.js configuration
    ├── 📄 tailwind.config.ts      # Tailwind CSS config
    ├── 📄 postcss.config.mjs      # PostCSS config
    ├── 📄 eslint.config.mjs       # ESLint config
    ├── 📄 Dockerfile              # Docker build instructions
    └── 📄 .dockerignore           # Docker ignore rules
```

## File Descriptions

### Root Level

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation with setup instructions |
| `QUICKSTART.md` | 5-minute quick start guide |
| `PHASE1-COMPLETE.md` | Phase 1 completion summary and testing checklist |
| `package.json` | Root package.json with helper scripts for the entire project |
| `docker-compose.yml` | Orchestrates PostgreSQL, backend, and storefront services |
| `.env` | Environment variables (never commit this!) |
| `.env.example` | Template for environment variables |
| `.gitignore` | Files and folders to ignore in git |

### Backend (`/backend`)

| File/Folder | Purpose |
|-------------|---------|
| `src/index.ts` | Bootstraps and starts the Vendure server |
| `src/vendure-config.ts` | Main Vendure configuration (database, plugins, API settings) |
| `src/plugins/` | Custom Vendure plugins (empty in Phase 1) |
| `src/migrations/` | Database migration files |
| `src/types/` | TypeScript type definitions |
| `static/assets/` | Uploaded product images and media |
| `static/email/` | Email templates and test emails |
| `package.json` | Backend dependencies (Vendure, TypeScript, PostgreSQL driver) |
| `tsconfig.json` | TypeScript compiler configuration |
| `Dockerfile` | Docker image build instructions |

### Storefront (`/storefront`)

| File/Folder | Purpose |
|-------------|---------|
| `app/layout.tsx` | Root layout wrapper (header, footer, metadata) |
| `app/page.tsx` | Homepage with hero and featured products |
| `app/globals.css` | Global CSS styles and Tailwind imports |
| `app/not-found.tsx` | 404 error page |
| `app/products/page.tsx` | Product listing page |
| `app/products/[slug]/page.tsx` | Dynamic product detail page |
| `app/cart/page.tsx` | Shopping cart (placeholder in Phase 1) |
| `components/Header.tsx` | Navigation header component |
| `components/Footer.tsx` | Site footer component |
| `components/ProductCard.tsx` | Reusable product card component |
| `lib/graphql-client.ts` | urql GraphQL client configuration |
| `lib/queries.ts` | GraphQL query definitions |
| `types/index.ts` | TypeScript interfaces for products, variants, etc. |
| `package.json` | Frontend dependencies (Next.js, React, Tailwind, urql) |
| `next.config.ts` | Next.js configuration (image domains, etc.) |
| `tailwind.config.ts` | Tailwind CSS theme and color customization |

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                             │
│                   (localhost:3000)                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ HTTP Requests
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Storefront (Port 3000)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ App Router Pages                                     │   │
│  │  - Homepage (/)                                      │   │
│  │  - Products (/products)                              │   │
│  │  - Product Detail (/products/[slug])                 │   │
│  │  - Cart (/cart)                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ GraphQL Client (urql)                                │   │
│  │  - Queries products                                  │   │
│  │  - Fetches product details                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ GraphQL Queries
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Vendure Backend (Port 3001)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Shop API (/shop-api)                                 │   │
│  │  - Product queries                                   │   │
│  │  - Collection queries                                │   │
│  │  - Order management (future)                         │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Admin API (/admin-api)                               │   │
│  │  - Product management                                │   │
│  │  - User management                                   │   │
│  │  - Settings                                          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Admin UI (/admin)                                    │   │
│  │  - Web interface for managing store                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ SQL Queries
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Port 5432)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Tables:                                              │   │
│  │  - Products                                          │   │
│  │  - ProductVariants                                   │   │
│  │  - Collections                                       │   │
│  │  - Assets (images)                                   │   │
│  │  - Users / Customers                                 │   │
│  │  - Orders (future)                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Port Allocation

| Service | Port | Internal Port | Purpose |
|---------|------|---------------|---------|
| Storefront | 3000 | 3000 | Next.js development server |
| Backend | 3001 | 3001 | Vendure API + Admin UI |
| PostgreSQL | 5432 | 5432 | Database server |

## Docker Volumes

| Volume | Purpose |
|--------|---------|
| `postgres_data` | Persists database data |
| `backend_node_modules` | Backend dependencies |
| `storefront_node_modules` | Storefront dependencies |

## Environment Variables

### Backend
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` - Database connection
- `SUPERADMIN_USERNAME`, `SUPERADMIN_PASSWORD` - Admin credentials
- `COOKIE_SECRET` - Session encryption key
- `SHOP_URL` - Storefront URL for emails
- `NODE_ENV` - Environment mode

### Storefront
- `NEXT_PUBLIC_VENDURE_SHOP_API_URL` - Vendure Shop API endpoint
- `NODE_ENV` - Environment mode

## Key Dependencies

### Backend
- `@vendure/core` - Vendure framework
- `@vendure/admin-ui` - Admin interface
- `@vendure/asset-server-plugin` - Asset management
- `@vendure/email-plugin` - Email handling
- `pg` - PostgreSQL driver
- `typescript` - Type safety
- `ts-node` - TypeScript execution
- `nodemon` - Auto-restart on changes

### Storefront
- `next` - React framework
- `react` & `react-dom` - UI library
- `urql` - GraphQL client
- `graphql` - GraphQL core
- `tailwindcss` - CSS framework
- `typescript` - Type safety

## Architecture Patterns

### Backend
- **Pattern**: Modular plugin architecture
- **Database**: TypeORM with PostgreSQL
- **API**: GraphQL (Shop API + Admin API)
- **Authentication**: JWT tokens + cookies

### Frontend
- **Pattern**: Server components by default (Next.js 14)
- **Routing**: File-based (App Router)
- **Data Fetching**: Server-side GraphQL queries
- **Styling**: Utility-first CSS (Tailwind)

## Future Structure (Phases 3+)

Phase 3 will add:
```
├── 📁 backend/
│   ├── 📁 src/plugins/
│   │   ├── meilisearch/          # Search plugin
│   │   ├── stripe/                # Payment plugin
│   │   └── custom-email/          # Email customizations
│   └── 📁 redis/                  # Redis config
│
└── 📁 storefront/
    ├── 📁 app/
    │   ├── 📁 checkout/           # Checkout flow
    │   ├── 📁 account/            # User dashboard
    │   └── 📁 auth/               # Login/register
    ├── 📁 hooks/
    │   ├── useCart.ts             # Cart management
    │   └── useAuth.ts             # Authentication
    └── 📁 context/
        └── CartContext.tsx        # Global cart state
```

---

**Last Updated**: October 28, 2025
**Version**: Phase 1 Complete
