
 

import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from './store/auth.store';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [() => {
      const store = inject(AuthStore);
      return !store.isLoggedIn(); // 已登录 → 不允许进 login
    }],
    loadComponent: () =>
      import('./pages/login.page').then(m => m.LoginPage)
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];