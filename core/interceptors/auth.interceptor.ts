

import { HttpInterceptorFn,  inject,catchError,throwError } from '@angular/core';
import { UserStore } from '../../store/user.store';
import { UserQuery } from '../../store/user.query';
import { UserProfileTabsComponent } from '../../components/user-profile/user-profile-tabs.component';
import { AuthStore } from '../../domains/auth/store/auth.store';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(AuthStore);

  const token = store.token();

  const authReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
    : req;

    // 跳过不需要 auth 的请求（如 refreshToken 请求） → 避免死循环
    if (req.headers.get('x-skip-auth')) {
       return next.handle(req);
    }

 return next(authReq).pipe(

    catchError((err) => {
      // ⭐ 只处理 401
      if (err.status !== 401) {
        return throwError(() => err);
      }

      // ⭐ 调用“共享 refresh 流”
      return store.getRefresh$().pipe(
        switchMap((res) => {
          // 用新 token 重试原请求
          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${res.accessToken}`,
            },
          });
          return next(retryReq);
        }),
        catchError((refreshErr) => {
          // refresh 失败 → logout
          store.logout();
          return throwError(() => refreshErr);
        })
      );
    })
  );
};