import { inject } from '@angular/core';
import { CanMatchFn, CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../stores/auth.store';


// 支持：

// RBAC（角色）
// PBAC（权限点）
// ABAC（属性权限）
// 动态权限刷新
// 后端权限同步


// RoleGuard	    是否拥有某角色	    user.roles	        同步	是	    RBAC
// PermissionGuard	是否拥有某权限点	user.permissions	同步	是	    PBAC（最细粒度）

export function permissionGuard(requiredPermissions: string[]): CanMatchFn & CanActivateFn {
  return () => {
    const store = inject(AuthStore);
    const router = inject(Router);

    const isLoggedIn = store.isLoggedIn();
    const userPermissions = store.permissions();

    // 1. 未登录 → 重定向 login
    if (!isLoggedIn) {
      router.navigateByUrl('/login');
      return false;
    }

    // 2. 用户没有 permissions 字段 → 拒绝访问
    if (!Array.isArray(userPermissions)) {
      router.navigateByUrl('/forbidden');
      return false;
    }

    // 3. 至少拥有一个 required permission
    const hasPermission = requiredPermissions.some(p =>
      userPermissions.includes(p)
    );

    if (!hasPermission) {
      router.navigateByUrl('/forbidden');
      return false;
    }

    return true;
  };
}
