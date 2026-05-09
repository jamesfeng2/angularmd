

import { Injectable, signal,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs';

// （刷新逻辑）used by refresh-token.interceptor.ts
// 负责调用刷新接口 获取新 token
// 不处理 token 存储（由 Shell 负责）
// 不处理错误（由 refresh-token.interceptor.ts 负责）


  // refreshToken(refreshToken: string): Observable<{ accessToken: string; refreshToken: string }> {
  //   return this.http.post<{ accessToken: string; refreshToken: string }>(
  //     '/api/auth/refresh',
  //     { refreshToken }
  //   );
 

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // --- Signals Store ---
  user = signal<any | null>(null);
  accessToken = signal<string | null>(localStorage.getItem('access_token'));    // Token 自动持久化 刷新后自动更新 localStorage
  refreshTokenValue = signal<string | null>(localStorage.getItem('refresh_token'));

  // --- API endpoints ---
  private API = {
    login: '/auth/login',
    refresh: '/auth/refresh',
    profile: '/auth/me'
  };

  // --- Login ---
  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(this.API.login, credentials).pipe(
      tap(res => {
        this.setTokens(res.accessToken, res.refreshToken);
        this.loadUserProfile().subscribe();
      })
    );
  }

  // --- Refresh Token called by refresh-token.interceptor.ts ---
  refreshToken() {
    const token = this.refreshTokenValue();
    if (!token) return throwError(() => new Error('No refresh token'));

    return this.http.post<any>(this.API.refresh, { refreshToken: token }).pipe(
      tap(res => this.setTokens(res.accessToken, res.refreshToken)),
      map(res => res.accessToken)
    );
  }

  // --- Load User Profile 登录后立即获取用户资料 ---
  loadUserProfile() {
    return this.http.get<any>(this.API.profile).pipe(     //
      tap(user => this.user.set(user))
    );
  }

  // --- Logout ---
  logout() {
    this.user.set(null);
    this.accessToken.set(null);
    this.refreshTokenValue.set(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // --- Helpers ---
  private setTokens(access: string, refresh: string) {
    this.accessToken.set(access);
    this.refreshTokenValue.set(refresh);
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }
}
