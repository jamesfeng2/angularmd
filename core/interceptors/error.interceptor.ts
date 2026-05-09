 
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Shell } from '../../shell/shell.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const shell = inject(Shell);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        shell.user.set(null); // 清除用户
      }

      shell.loading.set(false);
      shell.globalError?.set(err.message ?? 'Unknown error');

      const formatted = {
        status: err.status,
        message: err.error?.message || 'Unknown error',
        timestamp: new Date()
      };
      return throwError(() => formatted);
    })
  );
};

// 职责：

// 捕获 HTTP 错误
// 分类错误（401 / 403 / 500 / 网络错误）
// 通知 Shell（全局错误状态）
// 自动登出（401）
// 不打印日志（交给 loggingInterceptor）