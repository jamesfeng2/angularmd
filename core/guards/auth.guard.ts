
import { Injectable, inject } from '@angular/core';
import { AuthStore } from '../../domains/auth/store/auth.store';
 


export const authGuard = () => {
  const store = inject(AuthStore);
  return store.isLoggedIn();
};