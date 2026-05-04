// features/admin/admin.api.ts
import { Injectable } from '@angular/core';
import { of, delay } from 'rxjs';

export interface AdminDto {
  id: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AdminApi {
  getAdmins() {
    return of<AdminDto[]>([
      { id: '1', role: 'SUPER_ADMIN' },
      { id: '2', role: 'EDITOR' },
    ]).pipe(delay(300));
  }
}
