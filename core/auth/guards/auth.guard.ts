
import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthStore } from '../../../domains/auth/store/auth.store';
 
/**
User Click
↓
NavigationStart
↓
AuthGuard (isLoggedIn?)
↓
RoleGuard (hasRole?)
↓
NavigationEnd
↓
Component Init
↓
HTTP Request
↓
AuthInterceptor (add token)
↓
Backend
↓
RefreshTokenInterceptor (401 → refresh → retry)
↓
RetryInterceptor
↓
ErrorInterceptor
↓
LoadingInterceptor
↓
Signals update (AuthStore)
↓
Change Detection
↓
DOM update





 * 为什么这个 Guard 是 A+ 企业级？
✔ 无订阅（No subscribe）
Guard 不应该发 HTTP，也不应该订阅 Observable。

✔ 无副作用（No side effects）
只读 Signals，不触发任何 HTTP。

✔ 无循环导航（No infinite redirect）
因为它只检查 token，不等待 refresh。

✔ 与 RefreshTokenInterceptor 完美协作
Guard 不负责刷新 token。
刷新逻辑完全在 Interceptor 中。

✔ CanMatch + CanActivate 双层保护 企业级必须两者都写。
CanMatch：阻止路由匹配
CanActivate：阻止进入页面


 */

export const authGuard = () => {
  const store = inject(AuthStore);
  return store.isLoggedIn();
};


const checkAuth = () => {
  const store = inject(AuthStore);
  // const auth = inject(AuthService);
  const router = inject(Router);

  // const token = auth.accessToken();
   const isLoggedIn = store.isLoggedIn(); //computed signal → 同步 → Guard 不需要订阅。

  if (!isLoggedIn) {
    router.navigateByUrl('/login');
    return false;
  }

  return true;
};

export const authMatchGuard: CanMatchFn = () => checkAuth(); // 先检查是否有 token 没有直接拒绝匹配 避免不必要的刷新和循环导航
export const authActivateGuard: CanActivateFn = () => checkAuth(); // 已经匹配了路由 但没有token 可能是 token 刷新中 或者刷新失败 这时直接拒绝进入页面 让用户停留在当前页（通常是登录页）等待刷新完成或者用户重新登录

// 2. 不依赖 HTTP（避免死锁）
// Guard 永远不能等待 refresh token 或发 HTTP。

// ✔ 3. 与 RefreshTokenInterceptor 完美协作
// Guard 只检查是否“有 token”
// Interceptor 负责有效 token 和刷新 token

// ✔ 4. CanMatch + CanActivate 双层保护
// CanMatch：阻止路由匹配
// CanActivate：阻止进入页面