


import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth.store';

export const roleGuard = (role: string) => () => {
  const store = inject(AuthStore);
  return store.hasRole(role)();
};




export function roleGuard1(allowedRoles: string | string[]): CanActivateFn {
  return () => {
    const store = inject(AuthStore);
    const router = inject(Router);

    const roles = store.roles(); // signal selector
    const isLoggedIn = store.isLoggedIn();

    // 未登录 → 拦截
    if (!isLoggedIn) {
      router.navigate(['/login']);
      return false;
    }

    // 无角色信息 → 拦截
    if (!roles || roles.length === 0) {
      router.navigate(['/forbidden']);
      return false;
    }

    // 角色不匹配 → 拦截
    const hasRole = Array.isArray(allowedRoles)
      ? roles.some(r => allowedRoles.includes(r))
      : roles.includes(allowedRoles);
    if (!hasRole) {
      router.navigate(['/forbidden']);
      return false;
    }

    return true;
  };
}
