# Deployment Guide

This guide covers deploying the E-Commerce Template to production environments.

## Table of Contents

1. [Docker Production Deployment](#docker-production-deployment)
2. [Vercel + Heroku](#vercel--heroku)
3. [AWS Deployment](#aws-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Migrations](#database-migrations)
6. [SSL/HTTPS Setup](#sslhttps-setup)

---

## Docker Production Deployment

### Prerequisites
- VPS or cloud server (DigitalOcean, AWS EC2, etc.)
- Docker and Docker Compose installed
- Domain name configured
- SSL certificate (Let's Encrypt recommended)

### 1. Prepare Production Environment

```bash
# Clone repository on server
git clone <your-repo-url>
cd ecommerce-template
```

### 2. Configure Environment Variables

Create `.env` files:

**backend/.env**:
```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=vendure_prod
DB_USERNAME=vendure
DB_PASSWORD=<strong-random-password>

# Auth
SUPERADMIN_USERNAME=admin
SUPERADMIN_PASSWORD=<strong-random-password>
COOKIE_SECRET=<generate-strong-secret-key>

# URLs
SHOP_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com

# Email (configure SMTP)
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=<smtp-password>

# Node Environment
NODE_ENV=production
```

**storefront/.env.production**:
```env
NEXT_PUBLIC_VENDURE_SHOP_API_URL=https://api.yourdomain.com/shop-api
NEXT_PUBLIC_VENDURE_ASSET_URL=https://api.yourdomain.com/assets
```

### 3. Update Docker Compose for Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    restart: always

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production
    env_file:
      - ./backend/.env
    ports:
      - "3001:3001"
      - "3002:3002"
    depends_on:
      - postgres
      - redis
    restart: always

  storefront:
    build:
      context: ./storefront
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
    env_file:
      - ./storefront/.env.production
    ports:
      - "3000:3000"
    depends_on:
      - backend
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - storefront
    restart: always

volumes:
  postgres_data:
```

### 4. Create Nginx Configuration

Create `nginx/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name yourdomain.com;
        return 301 https://$host$request_uri;
    }

    # Storefront
    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        location / {
            proxy_pass http://storefront:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }

    # API
    server {
        listen 443 ssl http2;
        server_name api.yourdomain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        location / {
            proxy_pass http://backend:3001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }

    # Admin
    server {
        listen 443 ssl http2;
        server_name admin.yourdomain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        location / {
            proxy_pass http://backend:3002;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### 5. Deploy

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npm run migrate

# Populate initial data (first time only)
docker-compose -f docker-compose.prod.yml exec backend npm run populate
```

---

## Vercel + Heroku

### Storefront on Vercel

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy Storefront**:
```bash
cd storefront
vercel --prod
```

3. **Configure Environment Variables** in Vercel Dashboard:
   - `NEXT_PUBLIC_VENDURE_SHOP_API_URL`
   - `NEXT_PUBLIC_VENDURE_ASSET_URL`

### Backend on Heroku

1. **Create Heroku App**:
```bash
cd backend
heroku create your-app-name
```

2. **Add PostgreSQL**:
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

3. **Set Environment Variables**:
```bash
heroku config:set NODE_ENV=production
heroku config:set SUPERADMIN_USERNAME=admin
heroku config:set SUPERADMIN_PASSWORD=<password>
heroku config:set COOKIE_SECRET=<secret>
heroku config:set SHOP_URL=https://your-storefront.vercel.app
```

4. **Deploy**:
```bash
git push heroku main
```

5. **Run Migrations**:
```bash
heroku run npm run migrate
heroku run npm run populate
```

---

## AWS Deployment

### Using AWS ECS + RDS

1. **Create RDS PostgreSQL Instance**
2. **Create ECS Cluster**
3. **Create ECR Repositories** for backend and storefront
4. **Build and Push Docker Images**:

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
cd backend
docker build -t backend .
docker tag backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/backend:latest

# Build and push storefront
cd storefront
docker build -t storefront .
docker tag storefront:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/storefront:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/storefront:latest
```

5. **Create ECS Task Definitions**
6. **Create ECS Services**
7. **Configure ALB (Application Load Balancer)**
8. **Set up Route53 for DNS**

---

## Environment Variables

### Critical Production Variables

**Backend**:
- `NODE_ENV=production`
- `DB_PASSWORD` - Strong random password
- `COOKIE_SECRET` - Generate with: `openssl rand -base64 32`
- `SUPERADMIN_PASSWORD` - Strong password
- `SHOP_URL` - Your storefront URL (with https)

**Storefront**:
- `NEXT_PUBLIC_VENDURE_SHOP_API_URL` - Backend API URL
- `NEXT_PUBLIC_VENDURE_ASSET_URL` - Assets URL

### Generating Secure Secrets

```bash
# Generate cookie secret
openssl rand -base64 32

# Generate password
openssl rand -base64 24
```

---

## Database Migrations

### Running Migrations

```bash
# Development
npm run migrate

# Production (Docker)
docker-compose exec backend npm run migrate

# Production (Heroku)
heroku run npm run migrate
```

### Creating New Migrations

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migration
npm run migrate
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Certbot)

```bash
# Install certbot
sudo apt-get install certbot

# Generate certificates
sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com -d admin.yourdomain.com

# Certificates will be in: /etc/letsencrypt/live/yourdomain.com/
```

### Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab for auto-renewal
sudo crontab -e

# Add this line:
0 0 1 * * certbot renew --quiet && docker-compose restart nginx
```

---

## Post-Deployment Checklist

- [ ] Update all default passwords
- [ ] Configure SMTP for email sending
- [ ] Set up database backups
- [ ] Configure monitoring (e.g., Sentry, DataDog)
- [ ] Set up CDN for assets (CloudFlare, AWS CloudFront)
- [ ] Enable CORS only for your domains
- [ ] Test checkout flow end-to-end
- [ ] Set up logging and error tracking
- [ ] Configure rate limiting
- [ ] Test email verification flow
- [ ] Set up automated backups
- [ ] Configure firewall rules
- [ ] Test disaster recovery

---

## Monitoring & Maintenance

### Health Checks

Add health check endpoints:

**Backend** (`src/index.ts`):
```typescript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

### Logging

Use Winston or similar:
```bash
npm install winston
```

### Backups

**PostgreSQL Backup**:
```bash
# Backup
docker-compose exec postgres pg_dump -U vendure vendure_prod > backup.sql

# Restore
cat backup.sql | docker-compose exec -T postgres psql -U vendure vendure_prod
```

---

## Scaling

### Horizontal Scaling

- Use load balancer (Nginx, AWS ALB)
- Run multiple backend instances
- Use Redis for session storage
- Implement caching (Redis)

### Database Scaling

- Enable read replicas
- Implement connection pooling
- Use PostgreSQL performance tuning

---

## Troubleshooting

### Common Issues

**CORS Errors**:
- Check `cors.origin` in `vendure-config.ts`
- Ensure frontend URL is whitelisted

**Database Connection**:
- Verify DB credentials
- Check network security groups
- Ensure DB is accessible from backend

**Assets Not Loading**:
- Check `NEXT_PUBLIC_VENDURE_ASSET_URL`
- Verify CORS settings
- Check CDN configuration

---

## Support

For deployment issues:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables
3. Test database connectivity
4. Check firewall rules

For more help, open an issue on GitHub.
