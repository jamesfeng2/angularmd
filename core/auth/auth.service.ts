

// src/app/core/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// （刷新逻辑）used by refresh-token.interceptor.ts
// 负责调用刷新接口
// 不处理 token 存储（由 Shell 负责）
// 不处理错误（由 refresh-token.interceptor.ts 负责）

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  refreshToken(refreshToken: string): Observable<{ accessToken: string; refreshToken: string }> {
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      '/api/auth/refresh',
      { refreshToken }
    );
  }
}
