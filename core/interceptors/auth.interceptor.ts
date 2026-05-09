

import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';

import { catchError, switchMap, throwError } from 'rxjs';
import { AuthResponse, AuthStore } from '../../domains/auth/store/auth.store';

// 职责：

// 给每个请求加 Authorization header
// 从 Shell 或 AuthService 读取 token
// 不处理错误
// 不处理日志


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(AuthStore);

  if (req.url.includes('/auth/refresh')) {      // ⭐ 跳过 refresh 接口（避免死循环）
    return next(req);
  }

  if (req.headers.get('x-skip-auth')) {       // 跳过不需要 auth 的请求（如 refreshToken 请求） → 避免死循环
     return next.handle(req);
  }

  if (req.headers.has('x-retried')) {       // 已经重试过一次了 → 避免死循环
    return throwError(() => err);
  }

  // const token = localStorage.getItem('access_token');
  const token = store.token();

  const authReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
    : req;

 
// export const authInterceptor: HttpInterceptorFn = (req, next) => {

//   const authReq = token
//     ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
//     : req;

//   return next(authReq);
// };


 return next(authReq).pipe(

    catchError((err: HttpErrorResponse) => {
   
      if (err.status !== 401) {             // ⭐ 只处理 401
        return throwError(() => err);
      }
      
      return store.getRefresh$().pipe(      // ⭐ 调用“共享 refresh 流”
        switchMap((res: AuthResponse) => {          
          const retryReq = req.clone({      // 用新 token 重试原请求
            setHeaders: {
              Authorization: `Bearer ${res.token}`,
            },
          });
          return next(retryReq);
        }),

        catchError((refreshErr: HttpErrorResponse) => {
          // refresh 失败 → logout
          store.logout();
          return throwError(() => refreshErr);
        })
      );
    })
  );
};