
import { Injectable, inject, HttpClient } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { User } from '../../../core/types/user.types';


@Injectable({ providedIn: 'root' })
export class AuthApi {
  private http = inject(HttpClient);

  login(body: { username: string; password: string }) {
    return this.http.post<User>('/api/login', body);
  }
}