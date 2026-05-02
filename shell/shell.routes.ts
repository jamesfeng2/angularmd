

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
        loadChildren: () => import('../features/dashboard/dashboard.routes'),
      },
      {
        path: 'customers',
        loadChildren: () => import('../features/customers/customers.routes'),
      },
      {
        path: 'orders',
        loadChildren: () => import('../features/orders/orders.routes'),
      },
    ],
  },
];
