


import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth.store';

export const roleGuard1 = (role: string) => () => {
  const store = inject(AuthStore);
  return store.hasRole(role)();
};


// ✔ 2. 无副作用
// 不发 HTTP，不刷新 token，不订阅 Observable。

// ✔ 3. 不会产生循环导航
// 因为它不依赖 refresh token，也不依赖 HTTP。

export function roleGuard(allowedRoles: string | string[]): CanActivateFn {
  return () => {
    const store = inject(AuthStore);
    const router = inject(Router);

    const roles = store.roles(); // signal selector
    const isLoggedIn = store.isLoggedIn();

    // 未登录 → 拦截 ->重定向到 login
    if (!isLoggedIn) {
      router.navigate(['/login']);
      return false;
    }

    // 无角色信息 → 拦截
    if (!roles || roles.length === 0) {
      // if (!user?.roles || !Array.isArray(user.roles)) { // 角色信息不合法
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
