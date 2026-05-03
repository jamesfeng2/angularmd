// 调用 ApiService
// CRUD
// 不包含 UI 状态
// 不包含 Signals
// 不包含业务逻辑

import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { User } from '../../../core/types/user.types';

// UserApiService = HTTP layer
// ApiService = infrastructure layer

@Injectable({ providedIn: 'root' })
export class UserApiService {

  private api = inject(ApiService);
  private appConfig = inject(AppConfigService);

  /** Resolve endpoint from AppConfig */
  private get endpoint() {
    return this.appConfig.appConfig().userEndpoint;   //userEndpoint: '/api/users',
  }

  getAll(): Promise<User[]> {
    return this.api.get<User[]>(this.endpoint);
  }

  /** GET /users */
  list(params?: { search?: string; page?: number; size?: number }) {
    return this.api.get<User[]>(this.endpoint, { params });
  }

  /** GET /users/:id */
  getById(id: string) {
    return this.api.get<User>(`${this.endpoint}/${id}`);
  }

  /** POST /users */
  create(data: Partial<User>) {
    return this.api.post<User>(this.endpoint, data);
  }

  /** PUT /users/:id */
  update(id: string, data: Partial<User>) {
    return this.api.put<User>(`${this.endpoint}/${id}`, data);
  }

  /** DELETE /users/:id */
  delete(id: string) {
    return this.api.delete(`${this.endpoint}/${id}`);
  }
}