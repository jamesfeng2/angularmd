

import { AppConfig } from '../types/app-config.types';
 
export const DEFAULT_APP_CONFIG: AppConfig = {
  version: 1,

  apiBaseUrl: '/api',
  authEndpoint: '/api/auth',
  userEndpoint: '/api/users',

  enableAuditLog: false,
  enableNotifications: true,
  enableRealtime: false,

  defaultPageSize: 20,
  dashboardWidgets: {
    sales: true,
    tasks: true,
    activity: true
  },

  appName: 'My Enterprise App',
  logoUrl: '/assets/logo.svg',
  themeColor: '#1976d2'
};
