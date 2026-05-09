

// src/app/core/http/refresh-token.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Shell } from '../../../shell/shell.service';
import { catchError, filter, switchMap, throwError } from 'rxjs';

// 防止并发刷新（只刷新一次）
// 所有等待中的请求自动排队
// 刷新成功后自动重试原请求
// 刷新失败自动登出

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const shell = inject(Shell);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // 非 401 错误直接抛出
      if (err.status !== 401) {
        return throwError(() => err);
      }

      // 如果没有 refreshToken → 直接登出
      const refreshToken = shell.user()?.refreshToken;
      if (!refreshToken) {
        shell.user.set(null);
        return throwError(() => err);
      }

      // 如果正在刷新 → 将请求加入队列
      if (isRefreshing) {
        return new Promise(resolve => {
          refreshQueue.push((newToken: string) => {
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            resolve(next(retryReq).toPromise());
          });
        });
      }

      // 开始刷新
      isRefreshing = true;
      // if (error.status === 401 && !req.url.includes('/auth/refresh')) 
      
      return auth.refreshToken(refreshToken).pipe(
        switchMap(newTokens => {
          isRefreshing = false;

          // 更新全局用户状态
          shell.user.update(u => ({
            ...u!,
            token: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
          }));

          // 处理队列中的请求
          refreshQueue.forEach(cb => cb(newTokens.accessToken));
          refreshQueue = [];

          // 重试当前请求
          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newTokens.accessToken}` },
          });

          return next(retryReq);
        }),

        catchError(refreshErr => {
          isRefreshing = false;
          refreshQueue = [];

          // 刷新失败 → 清除用户 → 跳转登录
          shell.user.set(null);

          return throwError(() => refreshErr);
        })
      );
    })
  );
};
