
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Shell } from '../../shell/shell.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const shell = inject(Shell);
  const user = shell.user();

  if (!user?.token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return next(authReq);
};

// 职责：

// 给每个请求加 Authorization header
// 从 Shell 或 AuthService 读取 token
// 不处理错误
// 不处理日志