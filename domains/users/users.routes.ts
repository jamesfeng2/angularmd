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
  },
  {
    path: ':id',
    loadComponent: () =>
      import('../pages/profile-page/profile-page.component')
        .then(m => m.ProfilePageComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('../pages/profile-edit/profile-edit.component')
        .then(m => m.ProfileEditComponent)
  }
];
