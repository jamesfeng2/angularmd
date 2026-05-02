

// src/app/shell/shell.routes.ts
import { Routes } from '@angular/router';
import { ShellComponent } from './shell.component';

export const SHELL_ROUTES: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../domains/dashboard/dashboard.routes'),
      },
      {
        path: 'customers',
        loadChildren: () => import('../domains/customers/customers.routes'),
      },
      {
        path: 'orders',
        loadChildren: () => import('../domains/orders/orders.routes'),
      },
    ],
  },
];
