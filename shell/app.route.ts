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
    ],
  },
];
