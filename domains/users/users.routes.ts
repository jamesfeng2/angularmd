export const USERS_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/user-list-page/user-list-page.component')
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/user-detail-page/user-detail-page.component')
  }
];
