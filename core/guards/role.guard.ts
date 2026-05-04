
import { HttpInterceptorFn,  inject,catchError,throwError } from '@angular/core';
 import { AuthStore } from '../../domains/auth/store/auth.store';


export const roleGuard = (role: string) => () => {
  const store = inject(AuthStore);
  return store.hasRole(role)();
};