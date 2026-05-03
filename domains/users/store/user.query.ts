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
import { BaseEntityQuery } from '../../../core/store/base-entity-query'
import { UserStore } from './user.store';
import { UserApiService } from '../api/user-api.service';
import { User } from '../../../core/types/user.types';

export class UserQuery extends BaseEntityQuery<UserStore, UserApiService, User> {
  constructor() {
    super(inject(UserStore), inject(UserApiService));
  }

  // 业务动作触发选中用户 永远保持最新，不需要任何手动同步
  // 组件调用这个方法，传入用户 ID，UserQuery 会更新 UserStore 的 selectedUserId 信号，进而 selectedUser 信号会自动更新为对应的用户对象。
  // 组件调用 selectUser('123')，UserQuery 会调用 this.store.setSelectedUser('123')，UserStore 的 selectedUserId 信号会变为 '123'，selectedUser 信号会自动计算出 ID 为 '123' 的用户对象，并更新为 selectedUser 的值。
  // 组件可以通过 this.store.selectedUser() 来获取当前选中的用户对象。
  // 组件调用 selectUser(null) 来取消选中用户，UserStore 的 selectedUserId 信号会变为 null，selectedUser 信号会自动更新为 null，表示没有选中的用户。
  // usage: UserDetailComponent and UserListComponent 都会调用这个方法来设置当前选中的用户 ID，UserDetailComponent 会通过 selectedUser 信号来显示用户详情，UserListComponent 会通过 selectedUserId 信号来高亮选中的用户。
  selectUser(id: string) {
    this.store.setSelectedUser(id);
  }


  // 权限相关（最常见的用户特有）
  // 调 API → 更新 Store → UI 自动刷新 
  // UI usage: UserListComponent 可能会有一个“管理员”过滤选项，用户选择后调用 this.query.loadAdmins() 来加载管理员用户列表，UserQuery 会调用 API 获取管理员用户数据，并更新 UserStore 的用户列表信号，UserListComponent 会自动刷新显示管理员用户。
  loadAdmins() {
    return this.run(async () => {
      // 直接调用 API 获取管理员用户列表
      // const admins = await this.api.getAdmins();
      // this.store.setAll(admins);

      // 或者先获取所有用户，再过滤出管理员
      this.store.setLoading(true);
      const all = await this.api.getAll();
      const admins = all.filter(u => u.roles.includes('admin'));
      this.store.setAll(admins);
      this.store.setLoading(false);
    });
  }


    // 用户登录状态相关
    // 这里假设 API 有一个 getProfile 方法返回当前登录用户信息
  loadUserProfile(id: string) {
    return this.run(async () => {
    const profile = await this.api.getUserProfile(id);
    this.store.upsertOne(profile);
    this.store.setSelectedUser(profile);
    
      // const all = await this.api.getAll();
      // const profile = all.find(u => u.id === id);
      // if (profile) {
      //   this.store.setSelectedUserId(profile.id);
      // } else {
      //   throw new Error('User profile not found');
      // }
    });
  }

  // 用户角色 / 权限树
  loadUserPermissions(userId: string) {
    return this.run(async () => {
      // const perms = await this.api.getUserPermissions(userId);
      // this.store.setUserPermissions(userId, perms);

      const user = await this.api.getById(userId);
      const perms = user.roles.flatMap((role: string) => {
        if (role === 'admin') return ['read', 'write', 'delete'];
        if (role === 'editor') return ['read', 'write'];
        return ['read'];
      }); 
    }); 
  }

   // 用户搜索（带过滤规则）  
   // 这里的 filter 可以是一个简单的字符串，也可以是一个复杂的对象，取决于 API 的设计
  searchUsers(filter: string) {
    return this.run(async () => {
      // const results = await this.api.searchUsers(filter);
      // this.store.setAll(results);

      const all = await this.api.getAll();
      const results = all.filter(u => u.name.includes(filter) || u.email.includes(filter));
      this.store.setAll(results);
    });
  });  
  // filter 也可以是一个复杂的对象，取决于 API 的设计
  searchUsers1(filter: { name?: string; email?: string }) {
    return this.run(async () => {
      const all = await this.api.getAll();
      let results = all;
      if (filter.name) {
        results = results.filter(u => u.name.includes(filter.name?? ''));
      }
      if (filter.email) {
        results = results.filter(u => u.email.includes(filter.email?? ''));
      }
      this.store.setAll(results);
    });
  }

  // 用户状态管理（启用/禁用）
  toggleUserStatus(userId: string, enabled: boolean) {
    return this.run(async () => {
      // await this.api.setUserStatus(userId, enabled);
      // this.store.updateOne(userId, { enabled });

      const user = await this.api.getById(userId);
      if (user) {
        const updated = { ...user, enabled };
        await this.api.update(userId, updated);
        this.store.upsertOne(updated);
      } else {
        throw new Error('User not found');
      }
    });      
  }
  

  // calls BaseEntityQuery.update, which calls this.api.update and then this.store.upsertOne  
  // 更新用户资料
  updateUserProfile(userId: string, data: Partial<User>) {
    return this.update(userId, data);    
  };
  
  // 更新用户角色
  updateUserRoles(userId: string, roles: string[]) {
    return this.update(userId, { roles });    
  }

  // 更新用户头像  
  updateUserAvatar(userId: string, avatarUrl: string) {
    return this.update(userId, { avatarUrl });    
  }

  // 用户列表分页
  loadUsersPage(page: number, size: number) {
    return this.run(async () => {
      // const { users, total } = await this.api.getUsersPage(page, size);
      // this.store.setAll(users);
      // this.store.setTotalCount(total);

      const all = await this.api.getAll();
      const total = all.length;
      const users = all.slice(page * size, page * size + size);
      this.store.setAll(users);
      this.store.setTotalCount(total);
    });
  }

  // 用户列表排序
  loadUsersSorted(sortKey: string, sortDir: 'asc' | 'desc') {
    return this.run(async () => {
      // const users = await this.api.getUsersSorted(sortKey, sortDir);
      // this.store.setAll(users);

      const all = await this.api.getAll();
      const sorted = [...all].sort((a, b) => {
        const aValue = a[sortKey as keyof User]?? 0;
        const bValue = b[sortKey as keyof User]?? 0;
        if (aValue < bValue) return sortDir === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
      this.store.setAll(sorted);
    });
  }

    // 创建用户（通用 create）
  createUser(data: Partial<User>) {
    return this.create(data);
  }
    
  // 删除用户（通用 delete）
  deleteUser(userId: string) {
    return this.delete(userId);   
  }

  //



 



}




//without base-entity-query version, all logic in UserQuery, no BaseEntityQuery abstraction

// import { Injectable, inject } from '@angular/core';
// import { BaseQuery } from '../../../core/store/base-query';
// import { UserStore } from './user.store';
// import { UserApiService } from '../api/user-api.service';
// import { firstValueFrom } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class UserQuery extends BaseQuery<UserStore, UserApiService> {

//   constructor() {
//     super(inject(UserStore), inject(UserApiService));
//   }

//   readonly loadUsers = this.run(async () => {
//     const list = await firstValueFrom(this.api.list());
//     this.store.setAll(list);
//   });

//   readonly loadUser = this.run(async (id: string) => {
//     const user = await firstValueFrom(this.api.getById(id));
//     this.store.upsertOne(user);
//   });

//   readonly createUser = this.run(async (data: any) => {
//     const created = await firstValueFrom(this.api.create(data));
//     this.store.upsertOne(created);
//   });

//   readonly updateUser = this.run(async (id: string, data: any) => {
//     const updated = await firstValueFrom(this.api.update(id, data));
//     this.store.upsertOne(updated);
//   });

//   readonly deleteUser = this.run(async (id: string) => {
//     await firstValueFrom(this.api.delete(id));
//     this.store.removeOne(id);
//   });
// }



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
