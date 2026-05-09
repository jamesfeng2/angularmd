// src/app/core/http/logging.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const start = performance.now();

  console.log('[HTTP Request]', req.method, req.url);

  return next(req).pipe(
    tap({
      next: (event) => {
        const time = (performance.now() - start).toFixed(1);
        console.log(`[HTTP Response] ${req.url} (${time}ms)`, event);
      },
      error: (err) => {
        const time = (performance.now() - start).toFixed(1);
        console.error(`[HTTP Error] ${req.url} (${time}ms)`, err);
      },
    })
  );
};


// 职责：

// 打印请求
// 打印响应
// 打印耗时
// 不处理错误
// 不修改请求
// 不修改响应