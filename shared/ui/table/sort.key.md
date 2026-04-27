2. Core 层
2.1 HttpClient 封装（企业级）
ts
```@Injectable({ providedIn: 'root' })
export class HttpClientService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: any) {
    return this.http.get<T>(url, { params });
  }

  post<T>(url: string, body: any) {
    return this.http.post<T>(url, body);
  }
}```
2.2 API Service（示例：User API）
ts
```@Injectable({ providedIn: 'root' })
export class UserApi {
  constructor(private http: HttpClientService) {}

  search(keyword: string) {
    return this.http.get<User[]>('/api/users', { q: keyword });
  }

  getUser(id: string) {
    return this.http.get<User>(`/api/users/${id}`);
  }
}```
2.3 Signal Store（企业级写法）
ts
```@Injectable({ providedIn: 'root' })
export class UserStore {
  private users = signal<User[]>([]);
  private loading = signal(false);

  users$ = computed(() => this.users());
  loading$ = computed(() => this.loading());

  constructor(private api: UserApi) {}

  load(keyword: string) {
    this.loading.set(true);

    this.api.search(keyword).subscribe({
      next: (res) => this.users.set(res),
      complete: () => this.loading.set(false)
    });
  }
}```
🧩 3. Shared UI 组件（可直接复制）
3.1 AppButton（Angular 21 standalone）
ts
```@Component({
  selector: 'app-button',
  standalone: true,
  template: `<button class="btn" [disabled]="disabled"><ng-content /></button>`,
  styles: [`.btn { padding: 8px 16px; border-radius: 4px; }`]
})
export class AppButton {
  @Input() disabled = false;
}```
3.2 AppModal（企业级、可复用）
ts
```@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <div class="backdrop" (click)="close()"></div>
    <div class="modal">
      <header><ng-content select="[modal-header]" /></header>
      <section><ng-content select="[modal-body]" /></section>
      <footer><ng-content select="[modal-footer]" /></footer>
    </div>
  `,
  styles: [`
    .backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.4); }
    .modal { background: white; padding: 16px; border-radius: 8px; }
  `]
})
export class AppModal {
  @Output() closed = new EventEmitter<void>();
  close() { this.closed.emit(); }
}
3.3 AppTable（企业级、可排序）
ts
@Component({
  selector: 'app-table',
  standalone: true,
  template: `
    <table>
      <thead>
        <tr>
          <th *ngFor="let col of columns" (click)="sort(col.key)">
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr *ngFor="let row of sorted()">
          <td *ngFor="let col of columns">{{ row[col.key] }}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class AppTable<T> {
  @Input() data: T[] = [];
  @Input() columns: { key: keyof T; label: string }[] = [];

  private sortKey = signal<keyof T | null>(null);

  sorted = computed(() => {
    const key = this.sortKey();
    if (!key) return this.data;
    return [...this.data].sort((a, b) => (a[key] > b[key] ? 1 : -1));
  });

  sort(key: keyof T) {
    this.sortKey.set(key);
  }
}
🧩 4. Feature 层：搜索框（RxJS + Signal 最佳实践）
4.1 search.service.ts（企业级 RxJS）
ts
@Injectable({ providedIn: 'root' })
export class SearchService {
  private keyword = new Subject<string>();

  results$ = this.keyword.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((kw) => this.api.search(kw)),
    shareReplay(1)
  );

  constructor(private api: UserApi) {}

  search(keyword: string) {
    this.keyword.next(keyword);
  }
}```
4.2 search.component.ts（Signal + RxJS 混合）
ts
```@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, AppTable],
  template: `
    <input type="text" (input)="onInput($event)" placeholder="Search..." />

    <app-table
      [data]="results()"
      [columns]="[
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' }
      ]"
    />
  `
})
export class SearchComponent {
  results = signal<User[]>([]);

  constructor(private search: SearchService) {
    effect(() => {
      this.search.results$.subscribe((res) => this.results.set(res));
    });
  }

  onInput(e: any) {
    this.search.search(e.target.value);
  }
}```
🧩 5. RxJS + Signal 最佳实践（企业级）
层	用什么	为什么
数据流（WebSocket、API、节流）	RxJS	流式、异步、取消、组合
状态（UI、表单、组件内部）	Signal	同步、可预测、性能好
展示层	Signal	自动更新