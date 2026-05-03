// // 保存用户列表
// // 保存选中用户
// // 保存 loading/saving/error 状态
// // 纯同步状态

// // Holds users
// // Holds selected user
// // Holds loading/saving/deleting
// // Holds error
// // Pure synchronous state

// // UserStore = 用户数据的本地状态中心  
// // 保存数据
// // 保存 UI 状态
// // 不负责发请求

// // UserStore = synchronous state (signals)


// user-entity-store version

import { Injectable, computed, signal } from '@angular/core';
import { BaseEntityStore } from '../../../core/store/base-entity-store';
import { User } from '../../../core/types/user.types';

export type EntityMap<T extends { id: string }> = Record<string, T>;


@Injectable({ providedIn: 'root' })
export class UserStore extends BaseEntityStore<User> {

  readonly selectedUserId = signal<string | null>(null);

  readonly selectedUser = computed(() => {
    const id = this.selectedUserId();
    return id ? this.entities()[id] : null;
  });

  selectUser(id: string | null) {
    this.selectedUserId.set(id);
  }

  reset() {
    this.clear();
    this.resetUIState();
    this.selectedUserId.set(null);
  }
}




//non base-entity version


// import { Injectable, signal, computed, inject } from '@angular/core';
// import { User } from '../../../core/types/user.types';
// import { UserApiService } from '../api/user-api.service';

// type userMap = Record<string, User>;    // belong to module, not instance class
//                                       // Prevents circular type inference in own class
// @Injectable({ providedIn: 'root' })
// export class UserStore {

// private api = inject(UserApiService);

// // Entity Store
//   private readonly users = signal<userMap>({});
//   private readonly lastUpdated = signal<number | null>(null);

//   // UI State
//   readonly selectedUserId = signal<string | null>(null);
//   readonly filter = signal('');            // store.setFilter('john');  => filter.set('john') => store.filter() => 'john' => computed selectors auto re-evalute   
//   readonly pageIndex = signal(0);   
//   readonly pageSize = signal(10);                   // store.setPageSize(20);
//   readonly sortKey = signal<keyof User>('name');    // 'name' | 'email' | 'roles'
//   readonly sortDir = signal<'asc' | 'desc'>('asc');  // store.setSort('createdAt', 'desc');

//     /** UI loading states */
//   readonly loading = signal(false);               // store.setLoading(true);
//   readonly saving = signal(false);
//   readonly deleting = signal(false);

//   /** Error state */
//   readonly error = signal<string | null>(null);   // store.setError('Failed to load users');  

//   // Computed selectors
//   readonly selectedUser = computed(() => {
//     const id = this.selectedUserId();
//     return id ? this.users()[id] : null;
//   });

//   readonly filteredUsers = computed(() => {
//     const keyword = this.filter().toLowerCase();
//     return Object.values(this.users()).filter((u:any) =>
//       u.name.toLowerCase().includes(keyword)
//     );
//   });

//   readonly paginatedUsers = computed(() => {
//     const page = this.pageIndex();
//     const size = this.pageSize();
//     const list = this.filteredUsers();
//     return list.slice(page * size, page * size + size);
//   });


//   // Entity Store Methods -- Never mutate signals directly from outside.
//   setUsers(list: User[]) {
//     const map: userMap = {};
//     for (const u of list) map[u.id] = u;
//     this.users.set(map);
//   }

//   updateOneUser(id: string, patch: Partial<User>) {
//     this.users.update((u: userMap) => ({
//       ...u,
//       [id]: { ...u[id], ...patch }
//     }));
//   }

//     /** Remove a user */
//   removeUser(id: string) {
//     this.users.update((store: userMap) => {
//       const copy = { ...store };
//       delete copy[id];
//       return copy;
//     });
//   }

//   // UI State Methods
// selectUser(id: string | null) {
//     this.selectedUserId.set(id);
//   }

//   setFilter(keyword: string) {
//     this.filter.set(keyword);
//   }

//   setPage(index: number) {
//     this.pageIndex.set(index);
//   }

//   setLoading(v: boolean) {
//     this.loading.set(v);
//   }

//   setSaving(v: boolean) {
//     this.saving.set(v);
//   }

//   setDeleting(v: boolean) {
//     this.deleting.set(v);
//   }

//   setError(msg: string | null) {
//     this.error.set(msg);
//   }

  
// }
 
 

