import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import path from 'path';

const IS_DEV = process.env.NODE_ENV !== 'production';

export const config: VendureConfig = {
  apiOptions: {
    port: 3001,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    adminApiPlayground: IS_DEV,
    adminApiDebug: IS_DEV,
    shopApiPlayground: IS_DEV,
    shopApiDebug: IS_DEV,
  },
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME || 'superadmin',
      password: process.env.SUPERADMIN_PASSWORD || 'superadmin',
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET || 'cookie-secret-change-me',
    },
  },
  dbConnectionOptions: {
    type: 'postgres',
    synchronize: IS_DEV,
    logging: false,
    database: process.env.DB_NAME || 'vendure',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  customFields: {},
  plugins: [
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, '../static/assets'),
      // For local dev, the following settings are not required.
      // In production, you'll need to configure a CDN/S3-like storage
    }),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, '../static/email/test-emails'),
      route: 'mailbox',
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, '../static/email/templates'),
      globalTemplateVars: {
        fromAddress: '"Vendure Store" <noreply@vendure-store.com>',
        verifyEmailAddressUrl: process.env.SHOP_URL || 'http://localhost:3000/verify',
        passwordResetUrl: process.env.SHOP_URL || 'http://localhost:3000/reset-password',
        changeEmailAddressUrl: process.env.SHOP_URL || 'http://localhost:3000/change-email',
      },
    }),
    // Note: AdminUiPlugin requires compilation. For dev, use @vendure/admin-ui-plugin or access admin at /admin
    // AdminUiPlugin will be properly configured in production builds
  ],
};
