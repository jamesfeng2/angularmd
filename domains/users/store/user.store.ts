// 保存用户列表
// 保存选中用户
// 保存 loading/saving/error 状态
// 纯同步状态

// Holds users
// Holds selected user
// Holds loading/saving/deleting
// Holds error
// Pure synchronous state

// UserStore = 用户数据的本地状态中心  
// 保存数据
// 保存 UI 状态
// 不负责发请求

// UserStore = synchronous state (signals)


import { Injectable, signal } from '@angular/core';
import { User } from '../../../core/types/user.types';

@Injectable({ providedIn: 'root' })
export class UserStore {

  /** All users */
  readonly users = signal<User[]>([]);

  /** Selected user (detail page) */
  readonly selectedUser = signal<User | null>(null);

  /** UI loading states */
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);

  /** Error state */
  readonly error = signal<string | null>(null);

  // -----------------------------
  // Mutators
  // -----------------------------

  setUsers(list: User[]) {
    this.users.set(list);
  }

  setSelected(user: User | null) {
    this.selectedUser.set(user);
  }

  setLoading(v: boolean) {
    this.loading.set(v);
  }

  setSaving(v: boolean) {
    this.saving.set(v);
  }

  setDeleting(v: boolean) {
    this.deleting.set(v);
  }

  setError(msg: string | null) {
    this.error.set(msg);
  }
}
