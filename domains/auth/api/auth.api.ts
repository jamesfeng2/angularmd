
import { Injectable, inject, HttpClient } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { User } from '../../../core/types/user.types';


export type RefreshResponse = {
  token: string;
  refreshToken: string;
  user: User;
};

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private http = inject(HttpClient);

  login(body: { username: string; password: string }) {
    return this.http.post<User>('/api/login', body);
  }

  refresh(refreshToken: string) {
  return this.http.post<RefreshResponse>(
    '/auth/refresh',
    { refreshToken },
    {
      headers: {
        'x-skip-auth': 'true'
      }
    }   // 告诉 interceptor 这个请求不需要带 token 也不需要刷新
  );
}
}