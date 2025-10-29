# E-Commerce Template: Vendure + Next.js

A production-ready, modular e-commerce template built with Vendure backend and Next.js 14 storefront.

## 🚀 Current Status: Phase 1 Complete

✅ **Completed Features:**
- Vendure backend with GraphQL API
- PostgreSQL database integration
- Vendure Admin UI
- Next.js 14 storefront with App Router
- Tailwind CSS styling
- GraphQL client (urql) integration
- Basic product catalog pages
- Responsive layout
- Docker Compose configuration

## 📦 Tech Stack

### Backend
- **Framework**: Vendure (TypeScript-based e-commerce)
- **Database**: PostgreSQL 15+
- **Language**: TypeScript
- **Admin UI**: Vendure Admin (built-in)

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **API Client**: urql (GraphQL)

### Deployment
- Docker Compose (local/VPS)
- Railway support (coming in Phase 3)

## 🛠️ Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### Option 1: Docker Compose (Recommended)

1. **Clone and setup:**
   ```bash
   cd TEMPLATES/ecommerce-template
   cp .env.example .env
   ```

2. **Start all services:**
   ```bash
   docker-compose up
   ```

3. **Access the applications:**
   - **Storefront**: http://localhost:3000
   - **Admin UI**: http://localhost:3001/admin
   - **Shop API**: http://localhost:3001/shop-api

4. **Login to Admin:**
   - Username: `superadmin`
   - Password: `superadmin`

### Option 2: Local Development

1. **Start PostgreSQL:**
   ```bash
   docker-compose up postgres -d
   ```

2. **Backend setup:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Storefront setup (in another terminal):**
   ```bash
   cd storefront
   npm install
   npm run dev
   ```

## 📁 Project Structure

```
ecommerce-template/
├── backend/                 # Vendure backend
│   ├── src/
│   │   ├── vendure-config.ts
│   │   ├── index.ts
│   │   ├── plugins/        # Custom plugins (future)
│   │   ├── migrations/     # Database migrations
│   │   └── types/          # TypeScript types
│   ├── static/             # Assets and emails
│   ├── Dockerfile
│   └── package.json
├── storefront/             # Next.js frontend
│   ├── app/                # App router pages
│   │   ├── page.tsx       # Homepage
│   │   ├── products/      # Product listing
│   │   └── cart/          # Shopping cart
│   ├── components/         # React components
│   ├── lib/               # GraphQL client & queries
│   ├── types/             # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Docker orchestration
├── .env.example           # Environment template
└── README.md
```

## 🎯 Getting Started with Admin

1. Access Admin UI at http://localhost:3001/admin
2. Login with superadmin credentials
3. Create your first product:
   - Navigate to **Catalog → Products**
   - Click **Create New Product**
   - Fill in product details
   - Add variants and images
   - Save and publish

## 🧪 Phase 1 Testing Checklist

Before proceeding to Phase 2, verify:

- [ ] Backend starts successfully
- [ ] Admin UI is accessible
- [ ] Can create products in admin
- [ ] PostgreSQL connection works
- [ ] Storefront displays at localhost:3000
- [ ] Products appear on storefront
- [ ] Product detail pages load
- [ ] Basic navigation works
- [ ] Docker Compose brings up all services
- [ ] No critical errors in console

## 🔜 Coming in Future Phases

### Phase 2 Testing (Upcoming)
- Advanced features testing

### Phase 3: Complete Tech Stack
- Redis (caching & sessions)
- Minio (object storage)
- Meilisearch (full-text search)
- Stripe payment integration
- Email system (SMTP)
- Advanced cart & checkout

### Phase 4: Testing Round 2
- End-to-end checkout flow
- Payment processing
- Email delivery

### Phase 5: Polish
- Product recommendations
- Reviews & ratings
- Wishlist
- Mobile optimization
- Accessibility

### Phase 6: Production Ready
- Security hardening
- Performance optimization
- Monitoring setup
- Railway deployment config

### Phase 7: Final Testing
- Load testing
- Security audit
- Cross-browser testing

### Phase 8: Documentation
- Complete deployment guides
- API documentation
- Customization guides

## 🔧 Environment Variables

See `.env.example` for all available options. Key variables:

```env
# Database
DB_NAME=vendure
DB_HOST=postgres
DB_USERNAME=postgres
DB_PASSWORD=postgres

# Admin Credentials
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=superadmin

# Security
COOKIE_SECRET=your-secret-here

# URLs
SHOP_URL=http://localhost:3000
NEXT_PUBLIC_VENDURE_SHOP_API_URL=http://localhost:3001/shop-api
```

## 📝 Development Commands

### Backend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
npm run migrate  # Run database migrations
```

### Storefront
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run ESLint
```

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `docker-compose ps`
- Verify database credentials in `.env`
- Check logs: `docker-compose logs backend`

### Storefront shows no products
- Ensure backend is running
- Create products in Admin UI
- Check API URL in `.env`

### Docker issues
- Reset everything: `docker-compose down -v && docker-compose up --build`
- Check ports 3000, 3001, 5432 are available

## 🤝 Contributing

This is a template project. Feel free to:
- Report issues
- Suggest improvements
- Submit pull requests
- Use as a base for your projects

## 📄 License

MIT License - Use freely for personal and commercial projects

## 🔗 Resources

- [Vendure Documentation](https://www.vendure.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Note**: This is Phase 1 of 8. Additional features will be added progressively. See the project plan for details.
