// 异步操作（load/create/update/delete）
// 调用 UserApiService
// 更新 UserStore
// 使用 QueryGuard 防止并发问题

// loadUsers
// loadUserById
// createUser
// updateUser
// deleteUser

// All concurrency‑safe
// All using QueryGuard
// All updating UserStore

// Handles async operations
// Uses QueryGuard for concurrency safety
// Calls UserApiService
// Updates UserStore

// UserQuery = BaseQuery + UserStore + UserApiService

// ┌──────────────────────────────┐
// │        UserListPage          │
// │  (UI container, routed page) │
// └───────────────┬──────────────┘
//                 │ calls
//                 ▼
// ┌──────────────────────────────┐
// │          UserQuery           │
// │  extends BaseQuery<T>        │
// │  async + QueryGuard          │
// └───────────────┬──────────────┘
//                 │ calls
//                 ▼
// ┌──────────────────────────────┐
// │       UserApiService         │
// │     (HTTP via ApiService)    │
// └───────────────┬──────────────┘
//                 │ returns data
//                 ▼
// ┌──────────────────────────────┐
// │          UserStore           │
// │  extends BaseEntityStore<T>  │
// │  signals + selectors         │
// └───────────────┬──────────────┘
//                 │ feeds
//                 ▼
// ┌──────────────────────────────┐
// │     UserListComponent        │
// │     (UI presentation)        │
// └──────────────────────────────┘

import { Injectable, inject } from '@angular/core';
import { BaseQuery } from '../../../core/store/base-query';
import { UserStore } from './user.store';
import { UserApiService } from '../api/user-api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserQuery extends BaseQuery<UserStore, UserApiService> {

  constructor() {
    super(inject(UserStore), inject(UserApiService));
  }

  readonly loadUsers = this.run(async () => {
    const list = await firstValueFrom(this.api.list());
    this.store.setAll(list);
  });

  readonly loadUser = this.run(async (id: string) => {
    const user = await firstValueFrom(this.api.getById(id));
    this.store.upsertOne(user);
  });

  readonly createUser = this.run(async (data: any) => {
    const created = await firstValueFrom(this.api.create(data));
    this.store.upsertOne(created);
  });

  readonly updateUser = this.run(async (id: string, data: any) => {
    const updated = await firstValueFrom(this.api.update(id, data));
    this.store.upsertOne(updated);
  });

  readonly deleteUser = this.run(async (id: string) => {
    await firstValueFrom(this.api.delete(id));
    this.store.removeOne(id);
  });
}



// non base-query version

// import { Injectable, inject } from '@angular/core';
// import { UserApiService } from '../services/user.service';
// import { UserStore } from './user.store';
// import { queryGuard } from '../../../utils/query-guard';
// import { firstValueFrom } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class UserQuery {

//   private api = inject(UserApiService);
//   private store = inject(UserStore);

//   // -----------------------------
//   // Load user list
//   // -----------------------------
//   readonly loadUsers = queryGuard(async () => {
//     this.store.setLoading(true);
//     this.store.setError(null);

//     try {
//       const users = await firstValueFrom(this.api.list());
//       this.store.setUsers(users);
//     } catch (err: any) {
//       this.store.setError(err.message || 'Failed to load users');
//     } finally {
//       this.store.setLoading(false);
//     }
//   });

//   // -----------------------------
//   // Load single user
//   // -----------------------------
//   readonly loadUserById = queryGuard(async (id: string) => {
//     this.store.setLoading(true);
//     this.store.setError(null);

//     try {
//       const user = await firstValueFrom(this.api.getById(id));
//       this.store.setSelected(user);
//     } catch (err: any) {
//       this.store.setError(err.message || 'Failed to load user');
//     } finally {
//       this.store.setLoading(false);
//     }
//   });

//   // -----------------------------
//   // Create user
//   // -----------------------------
//   readonly createUser = queryGuard(async (data: any) => {
//     this.store.setSaving(true);
//     this.store.setError(null);

//     try {
//       const created = await firstValueFrom(this.api.create(data));
//       this.store.setUsers([...this.store.users(), created]);
//     } catch (err: any) {
//       this.store.setError(err.message || 'Failed to create user');
//     } finally {
//       this.store.setSaving(false);
//     }
//   });

//   // -----------------------------
//   // Update user
//   // -----------------------------
//   readonly updateUser = queryGuard(async (id: string, data: any) => {
//     this.store.setSaving(true);
//     this.store.setError(null);

//     try {
//       const updated = await firstValueFrom(this.api.update(id, data));

//       this.store.setUsers(
//         this.store.users().map(u => (u.id === id ? updated : u))
//       );

//       this.store.setSelected(updated);
//     } catch (err: any) {
//       this.store.setError(err.message || 'Failed to update user');
//     } finally {
//       this.store.setSaving(false);
//     }
//   });

//   // -----------------------------
//   // Delete user
//   // -----------------------------
//   readonly deleteUser = queryGuard(async (id: string) => {
//     this.store.setDeleting(true);
//     this.store.setError(null);

//     try {
//       await firstValueFrom(this.api.delete(id));

//       this.store.setUsers(
//         this.store.users().filter(u => u.id !== id)
//       );

//       if (this.store.selectedUser()?.id === id) {
//         this.store.setSelected(null);
//       }
//     } catch (err: any) {
//       this.store.setError(err.message || 'Failed to delete user');
//     } finally {
//       this.store.setDeleting(false);
//     }
//   });
// }
