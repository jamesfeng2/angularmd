我直接给你 AdminList 的完整企业级脚手架（scaffolder），完全符合你现在的架构：

Angular 21

Signals

Zoneless

BaseEntityQuery

UserQuery

UserStore

Feature-based folder structure

可扩展到 sorting / filtering / pagination / selectedUser / detail panel

我会给你一个 features/admins/ 的完整目录结构 + 每个文件的内容模板。

🟩 最终企业级脚手架：features/admins/
Code
features/
  admins/
    api/
      admin-api.service.ts
    store/
      admin.store.ts
    query/
      admin.query.ts
    components/
      admin-list/
        admin-list.component.ts
        admin-list.component.html
        admin-list.component.scss
      admin-detail/
        admin-detail.component.ts
        admin-detail.component.html
        admin-detail.component.scss
    pages/
      admin-page/
        admin-page.component.ts
        admin-page.component.html
    models/
      admin.model.ts
    routes/
      admins.routes.ts
下面我给你每个文件的内容（可直接复制）。

🟦 1. models/admin.model.ts
ts
export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}
🟦 2. api/admin-api.service.ts
ts
@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);

  getAdmins() {
    return this.http.get<Admin[]>('/api/admins');
  }

  update(id: string, patch: Partial<Admin>) {
    return this.http.patch<Admin>(`/api/admins/${id}`, patch);
  }
}
🟦 3. store/admin.store.ts
ts
@Injectable({ providedIn: 'root' })
export class AdminStore extends BaseEntityStore<Admin> {

  readonly selectedAdminId = signal<string | null>(null);

  readonly selectedAdmin = computed(() => {
    const id = this.selectedAdminId();
    return id ? this.entities()[id] : null;
  });

  setSelectedAdmin(id: string | null) {
    this.selectedAdminId.set(id);
  }

  // Sorting
  readonly sortKey = signal<keyof Admin>('name');
  readonly sortDir = signal<'asc' | 'desc'>('asc');

  // Filtering
  readonly filterText = signal('');

  // Pagination
  readonly page = signal(1);
  readonly pageSize = signal(10);

  readonly processedAdmins = computed(() => {
    let list = this.all();

    // Filtering
    const filter = this.filterText().toLowerCase();
    if (filter) {
      list = list.filter(a => a.name.toLowerCase().includes(filter));
    }

    // Sorting
    const key = this.sortKey();
    const dir = this.sortDir();
    list = [...list].sort((a, b) => {
      const av = a[key] ?? '';
      const bv = b[key] ?? '';
      if (av < bv) return dir === 'asc' ? -1 : 1;
      if (av > bv) return dir === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination
    const start = (this.page() - 1) * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });
}
🟦 4. query/admin.query.ts
ts
@Injectable({ providedIn: 'root' })
export class AdminQuery extends BaseEntityQuery<AdminStore, AdminApiService, Admin> {

  constructor() {
    super(inject(AdminStore), inject(AdminApiService));
  }

  loadAdmins() {
    return this.run(async () => {
      const admins = await this.api.getAdmins();
      this.store.setAll(admins);
    });
  }

  selectAdmin(id: string) {
    this.store.setSelectedAdmin(id);
  }

  updateAdmin(id: string, patch: Partial<Admin>) {
    return this.update(id, patch); // BaseEntityQuery CRUD
  }
}
🟦 5. components/admin-list/admin-list.component.ts
ts
@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  standalone: true,
  imports: [NgFor, NgIf]
})
export class AdminListComponent {
  private readonly query = inject(AdminQuery);
  private readonly store = inject(AdminStore);

  readonly admins = this.store.processedAdmins;

  ngOnInit() {
    this.query.loadAdmins();
  }

  select(id: string) {
    this.query.selectAdmin(id);
  }

  sort(key: keyof Admin) {
    this.store.sortKey.set(key);
    this.store.sortDir.set(
      this.store.sortDir() === 'asc' ? 'desc' : 'asc'
    );
  }

  filter(text: string) {
    this.store.filterText.set(text);
  }

  nextPage() {
    this.store.page.set(this.store.page() + 1);
  }

  prevPage() {
    this.store.page.set(Math.max(1, this.store.page() - 1));
  }
}
🟦 6. components/admin-list/admin-list.component.html
html
<input placeholder="Search..." (input)="filter($event.target.value)" />

<button (click)="sort('name')">Sort by Name</button>
<button (click)="sort('email')">Sort by Email</button>

<div *ngFor="let admin of admins()" 
     (click)="select(admin.id)"
     class="row">
  <strong>{{ admin.name }}</strong>
  <span>{{ admin.email }}</span>
</div>

<button (click)="prevPage()">Prev</button>
<button (click)="nextPage()">Next</button>
🟦 7. components/admin-detail/admin-detail.component.ts
ts
@Component({
  selector: 'app-admin-detail',
  templateUrl: './admin-detail.component.html',
  standalone: true,
  imports: [NgIf]
})
export class AdminDetailComponent {
  readonly admin = inject(AdminStore).selectedAdmin;
}
🟦 8. components/admin-detail/admin-detail.component.html
html
<ng-container *ngIf="admin(); else empty">
  <h2>{{ admin().name }}</h2>
  <p>Email: {{ admin().email }}</p>
  <p>Role: {{ admin().role }}</p>
</ng-container>

<ng-template #empty>
  <p>No admin selected</p>
</ng-template>
🟦 9. pages/admin-page/admin-page.component.html
html
<div class="admin-page">
  <app-admin-list />
  <app-admin-detail />
</div>
🟦 10. routes/admins.routes.ts
ts
export const ADMINS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/admin-page/admin-page.component')
        .then(m => m.AdminPageComponent)
  }
];
🎯 最终总结（Plain Chinese）
你现在拥有一个完整的：

AdminList

AdminDetail

loadAdmins

sorting

filtering

pagination

selectedAdmin

feature-based folder structure

全部符合你当前的企业级 Angular 21 架构。

James，你想让我继续生成：

AdminEdit（编辑管理员）脚手架？

AdminCreate（创建管理员）脚手架？

AdminTable（可复用表格组件）？

Admin API mock server（本地开发用）？

你选一个，我继续为你生成完整模块。

how real world features folder coordinate users and admins
James，这个问题问得非常关键：

⭐ “真实世界里 features/users 和 features/admins 是如何协同工作的？”
不是简单的“两个文件夹”，而是 两个业务域（Domain）之间的协作关系。

我给你一个 企业级、真实 SaaS 平台的完整解释，包括：

目录结构

依赖方向

数据流

Query / Store 如何协作

什么时候共享逻辑

什么时候隔离逻辑

什么时候跨 feature 调用

全部用 Plain Chinese + 场景图 + 代码示例。

🟩 1. 真实世界目录结构（企业级）
Code
features/
  users/
    api/
    store/
    query/
    components/
    pages/
    models/
    routes/

  admins/
    api/
    store/
    query/
    components/
    pages/
    models/
    routes/
关键点：users 和 admins 是两个独立业务域。

users = 所有用户（普通用户 + 管理员）

admins = 管理员管理界面（后台管理）

🟩 2. 真实世界的依赖方向（非常重要）
Code
admins → users
users  ✖→ admins（禁止）
Plain Chinese：

管理员管理界面（admins）可以依赖用户数据（users），
但用户模块不能依赖管理员模块。

为什么？

因为：

“管理员”是“用户”的子集

“用户”是基础域（foundation domain）

“管理员管理”是扩展域（extension domain）

🟩 3. 真实世界的协作方式（核心）
✔ users 提供基础数据
例如：

UserApiService.getUsers()

UserStore.entities()

UserQuery.loadUsers()

✔ admins 使用 users 的数据
例如：

AdminList 需要显示所有管理员（用户的一部分）

AdminDetail 需要显示管理员的用户资料

AdminPermissions 需要显示用户权限

🟩 4. 真实世界业务场景：管理员 = 用户 + 角色过滤
管理员不是一个独立实体。
管理员是：

Code
User where role = 'admin'
所以 admins feature 会这样做：

ts
loadAdmins() {
  return this.run(async () => {
    const users = await this.userApi.getUsers();
    const admins = users.filter(u => u.role === 'admin');
    this.store.setAll(admins);
  });
}
Plain Chinese：

admins 依赖 users 的 API，但有自己的 Store 和 Query。

🟩 5. 真实世界数据流（你团队能秒懂）
Code
AdminPage
 ↓
AdminQuery.loadAdmins()
 ↓
UserApiService.getUsers()   ← 来自 users 域
 ↓
AdminQuery 过滤出管理员
 ↓
AdminStore.setAll(admins)
 ↓
AdminList / AdminDetail 自动刷新
Plain Chinese：

admins 不直接访问数据库，它复用 users 的 API。

🟩 6. 为什么 admins 需要自己的 Store？
因为 admins 有自己的 UI 状态：

selectedAdminId

sorting

filtering

pagination

admin-specific computed

admin-specific detail panel

这些不能放在 users store，否则会污染 users 的 UI 状态。

🟩 7. 真实世界代码示例：admins 调用 users API
AdminQuery（跨 feature 调用 users API）
ts
@Injectable({ providedIn: 'root' })
export class AdminQuery {
  private readonly userApi = inject(UserApiService);
  private readonly store = inject(AdminStore);

  loadAdmins() {
    return this.run(async () => {
      const users = await this.userApi.getUsers();
      const admins = users.filter(u => u.role === 'admin');
      this.store.setAll(admins);
    });
  }
}
Plain Chinese：

AdminQuery 不需要自己的 API，它复用 UserApiService。

🟩 8. 真实世界代码示例：admins 使用 users 的实体
例如 AdminDetail 需要显示用户资料：

ts
readonly admin = computed(() => {
  const id = this.store.selectedAdminId();
  return id ? this.userStore.entities()[id] : null;
});
Plain Chinese：

管理员详情面板可以直接从 UserStore 读取用户实体。

🟩 9. 什么时候 users 和 admins 共享逻辑？
当逻辑是“用户通用”的时候：

UserApiService

UserStore.entities

UserQuery.loadUsers

User model

User permissions

User roles

这些都是 users 的职责。

admins 只是“用户的一个视图”。

🟩 10. 什么时候 users 和 admins 必须隔离？
当逻辑是“管理员界面特有”的时候：

AdminList sorting

AdminList filtering

AdminList pagination

AdminDetail panel

Admin-specific UI state

Admin-specific computed

这些都属于 admins。

🟩 11. 最终架构图（你团队能秒懂）
Code
┌──────────────┐
│  users        │  ← 基础域（User 数据）
│  API          │
│  Store        │
│  Query        │
└───────▲──────┘
        │ uses
┌───────┴────────┐
│  admins         │  ← 扩展域（管理员界面）
│  Store          │
│  Query          │
│  Components     │
└────────────────┘
Plain Chinese：

admins 是 users 的“消费者”，不是“兄弟”。

🎯 最终 Plain Chinese 总结
真实世界里，users 是基础域，admins 是扩展域。
admins 复用 users 的 API 和实体，但有自己的 Store、Query 和 UI 状态。
依赖方向永远是：admins → users，而不是反过来。

James，如果你愿意，我可以继续给你：

完整的 features/users + features/admins 协作示例（可运行）

跨 feature 的最佳实践（企业级）

如何设计 roles + permissions（RBAC）并让 admins 使用它