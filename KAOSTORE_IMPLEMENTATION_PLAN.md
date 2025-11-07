# KaoStore Implementation Plan - Complete Transformation

## ✅ Completed Features

### 1. User Account Management
- ✅ **Addresses Page** (`/account/addresses`)
  - Add, edit, delete addresses
  - Default shipping/billing markers
  - Spanish translations

- ✅ **Account Settings** (`/account/settings`)
  - Update profile (name, phone, title)
  - Change password
  - Request email change
  - Tabbed interface

- ✅ **Order History** (`/account/orders`)
  - Paginated order list
  - Order preview with images
  - Status badges in Spanish
  - Links to order tracking

### 2. Order Tracking System
- ✅ Complete order tracking page
- ✅ Payment and fulfillment info
- ✅ Tracking codes support
- ✅ Status timeline

## 🚧 In Progress - Next Steps

### 3. Static Content Pages

#### About Us Page (`/about`)
```typescript
- Company story
- Mission and values
- Team introduction
- Contact mailto link (from admin settings)
```

#### Contact Page (`/contact`)
```typescript
- Contact form
- Support email (editable from admin)
- Business hours
- Social media links
```

#### Footer Pages
```typescript
/shipping - Shipping policies
/returns - Return & refund policies
/faq - Frequently asked questions
/legal - Terms of service, privacy policy
/sitemap - Site navigation map
```

### 4. Admin Content Management

#### Custom Fields Needed:
```typescript
GlobalSettings {
  supportEmail: String!
  contactEmail: String!
  aboutUs: Text
  shippingPolicy: Text
  returnPolicy: Text
  faqContent: JSON
  legalContent: Text
  privacyPolicy: Text
}
```

#### Admin UI Extension:
```
Settings → Content Management
├── Contact Information
│   ├── Support Email
│   ├── Contact Email
│   └── Phone Number
├── Page Content
│   ├── About Us
│   ├── Shipping Policy
│   ├── Returns Policy
│   ├── FAQ
│   └── Legal/Terms
└── Social Media
    ├── Facebook
    ├── Instagram
    └── Twitter
```

### 5. Branding: Vendure → KaoStore

#### Files to Update:
```
storefront/
├── app/
│   ├── layout.tsx - Meta tags, title
│   ├── page.tsx - Hero section
│   └── components/
│       ├── Header.tsx - Logo, name
│       └── Footer.tsx - Copyright, links
└── public/
    └── logo.svg - New KaoStore logo

backend/
├── src/
│   └── vendure-config.ts - Shop name
└── admin-ui/
    └── branding.ts - Admin UI customization
```

#### Text Replacements:
```bash
"Vendure" → "KaoStore"
"Vendure Store" → "KaoStore"
"vendure-store.com" → "kaostore.com"
```

### 6. Color Scheme: Primary → Light Red

#### Tailwind Config Update:
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        200: '#FECACA',
        300: '#FCA5A5',
        400: '#F87171',  // Light Red
        500: '#EF4444',
        600: '#DC2626',  // Main Accent
        700: '#B91C1C',
        800: '#991B1B',
        900: '#7F1D1D',
      },
    },
  },
}
```

#### CSS Variables:
```css
:root {
  --primary-50: #FEF2F2;
  --primary-600: #DC2626;  /* Light Red */
  --primary-700: #B91C1C;
}
```

### 7. Spanish Translations

#### Translation Keys:
```javascript
const es = {
  // Navigation
  'nav.home': 'Inicio',
  'nav.products': 'Productos',
  'nav.cart': 'Carrito',
  'nav.account': 'Mi Cuenta',
  'nav.contact': 'Contacto',

  // Buttons
  'btn.add_to_cart': 'Agregar al Carrito',
  'btn.checkout': 'Proceder al Pago',
  'btn.save': 'Guardar',
  'btn.cancel': 'Cancelar',
  'btn.delete': 'Eliminar',
  'btn.edit': 'Editar',

  // Account
  'account.my_account': 'Mi Cuenta',
  'account.orders': 'Mis Pedidos',
  'account.addresses': 'Mis Direcciones',
  'account.settings': 'Configuración',
  'account.logout': 'Cerrar Sesión',

  // Checkout
  'checkout.title': 'Finalizar Compra',
  'checkout.shipping': 'Envío',
  'checkout.payment': 'Pago',
  'checkout.review': 'Revisar',

  // Order Status
  'order.completed': 'Completado',
  'order.processing': 'Procesando',
  'order.shipped': 'Enviado',
  'order.delivered': 'Entregado',
  'order.cancelled': 'Cancelado',

  // Forms
  'form.email': 'Correo Electrónico',
  'form.password': 'Contraseña',
  'form.first_name': 'Nombre',
  'form.last_name': 'Apellido',
  'form.phone': 'Teléfono',
  'form.address': 'Dirección',
  'form.city': 'Ciudad',
  'form.postal_code': 'Código Postal',
  'form.country': 'País',

  // Footer
  'footer.about': 'Acerca de',
  'footer.shipping': 'Envíos',
  'footer.returns': 'Devoluciones',
  'footer.faq': 'Preguntas Frecuentes',
  'footer.legal': 'Legal',
  'footer.sitemap': 'Mapa del Sitio',
  'footer.contact': 'Contacto',
};
```

## Implementation Phases

### Phase 1: Account Pages ✅ DONE
- Addresses management
- Settings page
- Order history

### Phase 2: Static Content Pages (Next)
1. Create page templates
2. Add mailto links with admin variable
3. Implement navbar contact link
4. Create footer with all links

### Phase 3: Admin Content Management
1. Create custom fields in Vendure
2. Build admin UI extension
3. Create API for content retrieval
4. Connect storefront to content API

### Phase 4: Branding & Colors
1. Update all text references
2. Change color scheme
3. Create KaoStore logo
4. Update meta tags

### Phase 5: Translations
1. Create translation file
2. Implement i18n hook
3. Replace all UI text
4. Test Spanish translations

## Technical Architecture

### Content Management Flow
```
Admin Dashboard
    ↓ (saves to)
Custom Fields (Vendure DB)
    ↓ (exposes via)
GraphQL API
    ↓ (consumed by)
Storefront (Next.js)
    ↓ (displays)
Static Pages
```

### Mailto Variable System
```typescript
// Admin sets: supportEmail = "support@kaostore.com"

// Storefront uses:
<a href={`mailto:${settings.supportEmail}`}>
  Contactar Soporte
</a>

// Appears in:
- Contact page
- About Us page
- Footer
- Order tracking page
- Account pages
```

### File Structure
```
ecommerce-template/
├── backend/
│   ├── src/
│   │   ├── plugins/
│   │   │   └── content-management/
│   │   │       ├── content-management.plugin.ts
│   │   │       ├── content.entity.ts
│   │   │       └── content.resolver.ts
│   │   └── vendure-config.ts
│   └── admin-ui/
│       └── extensions/
│           └── content-editor/
│               ├── content-editor.module.ts
│               └── content-editor.component.ts
├── storefront/
│   ├── app/
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── shipping/page.tsx
│   │   ├── returns/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── legal/page.tsx
│   │   └── sitemap/page.tsx
│   ├── lib/
│   │   ├── content-queries.ts
│   │   └── translations.ts
│   └── public/
│       └── kaostore-logo.svg
└── docs/
    └── KAOSTORE_IMPLEMENTATION_PLAN.md
```

## Priority Order

### 🔥 High Priority (Do First)
1. ✅ Account pages (DONE)
2. Static content pages with templates
3. Navbar contact link
4. Footer with all links

### 🟡 Medium Priority
1. Admin content management fields
2. Branding (Vendure → KaoStore)
3. Color scheme update

### 🟢 Low Priority (Polish)
1. Full Spanish translations
2. Admin UI extension for content
3. Logo design

## Quick Wins (Can Do Now)

### 1. Add Contact to Navbar
```typescript
// components/Header.tsx
<Link href="/contact">Contacto</Link>
```

### 2. Create Footer Links
```typescript
// components/Footer.tsx
<div>
  <Link href="/about">Acerca de</Link>
  <Link href="/shipping">Envíos</Link>
  <Link href="/returns">Devoluciones</Link>
  <Link href="/faq">FAQ</Link>
  <Link href="/legal">Legal</Link>
  <Link href="/sitemap">Mapa del Sitio</Link>
  <Link href="/contact">Contacto</Link>
</div>
```

### 3. Update Primary Color
```bash
# Find and replace in all files:
primary-600 → Use light red #DC2626
```

### 4. Basic Spanish in UI
Replace hardcoded English text with Spanish equivalents in:
- Buttons
- Labels
- Status messages
- Form fields

## Testing Checklist

### Account Features
- [ ] Can add/edit/delete addresses
- [ ] Can update profile information
- [ ] Can change password
- [ ] Can view order history
- [ ] Can access order tracking from history

### Static Pages
- [ ] All footer links work
- [ ] Contact page displays support email
- [ ] About page loads content
- [ ] Mailto links use admin variable

### Branding
- [ ] No "Vendure" text visible
- [ ] All instances say "KaoStore"
- [ ] Primary color is light red
- [ ] Logo displays correctly

### Translations
- [ ] All buttons in Spanish
- [ ] All form labels in Spanish
- [ ] Order statuses in Spanish
- [ ] Navigation in Spanish

## Deployment Steps

1. Build backend with content plugin
2. Run migrations for custom fields
3. Build storefront with new pages
4. Restart all containers
5. Populate content in admin
6. Test all links and pages
7. Verify mailto links work
8. Check mobile responsiveness

---

**Status:** Implementation in progress
**Target:** Full KaoStore transformation
**Priority:** Account pages done, static pages next
