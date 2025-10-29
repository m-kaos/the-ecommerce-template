# 🚀 Quick Start Guide

Get your e-commerce template running in 5 minutes!

## Step 1: Start the Stack

```bash
cd TEMPLATES/ecommerce-template
docker-compose up
```

This will start:
- PostgreSQL database on port 5432
- Vendure backend on port 3001
- Next.js storefront on port 3000

## Step 2: Wait for Services

Wait until you see:
```
vendure-backend    | 🚀 Vendure server started successfully!
vendure-storefront | ✓ Ready in 3s
```

## Step 3: Access Admin UI

1. Open: http://localhost:3001/admin
2. Login:
   - Username: `superadmin`
   - Password: `superadmin`

## Step 4: Create Your First Product

1. In Admin UI, go to **Catalog → Products**
2. Click **Create New Product**
3. Fill in:
   - Name: "Sample Product"
   - Slug: "sample-product" (auto-filled)
   - Description: "This is a test product"
4. Scroll to **Variants** section
5. Add a variant:
   - SKU: "SAMPLE-001"
   - Price: 2999 (represents $29.99)
6. Click **Create**

## Step 5: View on Storefront

1. Open: http://localhost:3000
2. Your product should appear on the homepage!
3. Click on it to see the detail page

## 🎉 Done!

You now have a working e-commerce site!

## Next Steps

- Add more products in the Admin UI
- Upload product images
- Explore collections and categories
- Test the product search
- Customize the theme colors

## Troubleshooting

### Services won't start?
```bash
# Stop everything
docker-compose down

# Remove volumes and restart
docker-compose down -v
docker-compose up --build
```

### Can't access admin?
- Make sure backend is fully started (check logs)
- Try clearing browser cache
- Verify port 3001 is not blocked

### No products on storefront?
- Create products in Admin UI first
- Make sure products are enabled/published
- Check backend logs for errors

## Stop the Stack

```bash
# Stop but keep data
docker-compose down

# Stop and delete all data
docker-compose down -v
```

---

**Happy building!** 🛍️
