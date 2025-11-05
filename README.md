# E-Commerce Template

A modern, full-stack e-commerce template built with **Vendure** (backend) and **Next.js 14** (storefront).

## Features

###Backend (Vendure)
- Product catalog management
- Multi-variant products with stock management
- Order processing and management
- Customer authentication with email verification
- Shipping methods and zones
- Payment processing (Dummy payment for development)
- Admin dashboard
- PostgreSQL database
- Docker containerization

### Storefront (Next.js 14)
- Product browsing with search and filtering
- Category-based filtering
- Price range filtering and sorting
- Shopping cart with persistent state
- Customer authentication (register, login, email verification)
- Complete checkout flow (address, shipping, payment)
- **Stripe payment integration** with support for multiple payment methods
- Order history and details
- Account management
- Informational pages (About, Shipping, Returns, FAQ, Contact)
- Responsive design
- SEO optimized with meta tags
- Error boundaries for graceful error handling
- Loading skeletons for better UX

## Tech Stack

### Backend
- **Vendure** - Headless commerce framework
- **PostgreSQL** - Database
- **Docker** - Containerization
- **TypeScript** - Type-safe development

### Storefront
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **urql** - GraphQL client
- **React Context** - State management
- **Stripe** - Payment processing

## Prerequisites

- Node.js >= 20.9.0
- Docker and Docker Compose
- npm or yarn

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ecommerce-template
```

### 2. Start Backend Services

```bash
cd backend
docker-compose up -d
```

This will start:
- **Vendure Backend** - `http://localhost:3001`
- **Admin Dashboard** - `http://localhost:3002/admin`
- **PostgreSQL** - `localhost:5432`
- **Redis** - `localhost:6379`
- **Minio (S3)** - `localhost:9000`
- **Meilisearch** - `localhost:7700`

### 3. Populate Database with Sample Data

```bash
cd backend
npm install
npm run populate
```

### 4. Start Storefront

```bash
cd ../storefront
npm install
npm run dev
```

The storefront will be available at `http://localhost:3000`

## Default Credentials

### Admin Dashboard
- URL: `http://localhost:3002/admin`
- Username: `superadmin`
- Password: `superadmin`

### Test Customer Account
- Email: `test@example.com`
- Password: `test123`

## Environment Variables

### Backend (`backend/.env`)

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=vendure
DB_USERNAME=postgres
DB_PASSWORD=postgres

# Auth
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=superadmin
COOKIE_SECRET=change-this-to-a-random-string

# URLs
SHOP_URL=http://localhost:3000
```

### Storefront (`storefront/.env.local`)

```env
# API URLs
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/shop-api

# Stripe (get keys from https://dashboard.stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
```

**Important:** See [STRIPE_SETUP.md](storefront/STRIPE_SETUP.md) for detailed Stripe configuration instructions.

## Project Structure

```
ecommerce-template/
├── backend/                 # Vendure backend
│   ├── src/
│   │   ├── vendure-config.ts    # Vendure configuration
│   │   ├── index.ts             # Entry point
│   │   └── populate.ts          # Database seeder
│   ├── docker-compose.yml   # Docker services
│   └── package.json
│
└── storefront/              # Next.js storefront
    ├── app/                 # Next.js App Router pages
    │   ├── (auth)/         # Auth pages (login, register)
    │   ├── products/       # Product pages
    │   ├── cart/           # Shopping cart
    │   ├── checkout/       # Checkout flow
    │   ├── account/        # Customer account
    │   └── search/         # Search results
    ├── components/         # React components
    ├── contexts/           # React Context providers
    ├── lib/                # Utilities and GraphQL queries
    └── package.json
```

## Available Scripts

### Backend

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run populate     # Populate database with sample data
npm run migrate      # Run database migrations
```

### Storefront

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Features Walkthrough

### 1. Product Catalog
- Browse all products at `/products`
- Filter by category, price range
- Sort by name or price
- Search products with autocomplete

### 2. Shopping Cart
- Add products to cart
- Update quantities
- Remove items
- Persistent cart (survives page refresh)

### 3. Checkout Flow
1. **Address**: Enter shipping address
2. **Shipping**: Select shipping method
3. **Payment**: Complete payment (dummy payment in dev)

### 4. Customer Account
- Register new account with email verification
- Login/logout
- View order history
- View order details
- Manage account information

### 5. Search & Filtering
- Full-text product search
- Filter by category
- Filter by price range
- Sort by relevance, price, or name

## Development Tips

### Restarting Services

```bash
# Restart all backend services
cd backend
docker-compose restart

# Restart just the backend
docker-compose restart backend

# View logs
docker-compose logs -f backend
```

### Database Reset

```bash
# Stop services
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v

# Start fresh
docker-compose up -d
npm run populate
```

### Adding New Products

Use the Admin Dashboard at `http://localhost:3002/admin` to:
1. Create products
2. Add variants
3. Set prices
4. Upload images
5. Assign to collections
6. Manage stock levels

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Troubleshooting

### Backend won't start
- Check if ports 3001, 3002, 5432 are available
- Ensure Docker is running
- Check logs: `docker-compose logs backend`

### Storefront can't connect to backend
- Verify backend is running at `http://localhost:3001`
- Check CORS settings in `vendure-config.ts`
- Verify environment variables in `.env.local`

### Products not showing
- Run `npm run populate` to seed database
- Check Admin Dashboard to verify products exist
- Check browser console for errors

### Search not working
- The template uses product name filtering as fallback
- Search works by matching product names

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
