@Component({
  selector: 'app-shell',
  standalone: true,
  template: `
    <app-header />
    <app-sidebar />
    <main>
      <router-outlet />
    </main>
    <app-footer />
  `,
})
@Injectable({ providedIn: 'root' })
export class ShellComponent {
// 全局状态 业务模块不需要关心这些，只需要读信号 全局状态中心
// 1. 所有全局状态必须用 Signals
// 
  user = signal<User | null>(loadFromLocal<User>('user'));  // userSignal
  loading = signal(false);                                 // gobalLoadingSignal
  theme = signal<'light' | 'dark'>(loadFromLocal<'light' | 'dark'>('theme') ?? 'light');    // themeSignal
  appConfig = signal<AppConfig | null>(null);   // configSignal
                                                // globalErrorSignal

  constructor(
    private auth: AuthService,
    private layout: LayoutService,
    private config: AppConfigService,
    private router: Router,
  ) {
{
    // 2. 自动持久化 localStorage
    effect(() => saveToLocal('user', this.user()));
    effect(() => saveToLocal('theme', this.theme()));

    // 3. 自动持久化 whole appConfig to IndexedDB
    effect(() => {
      const cfg = this.appConfig();
      if (cfg) idbSet('appConfig', cfg);
    });

    // 4. 恢复 IndexedDB  // IndexedDB 是异步的，所以恢复必须放在 constructor
    idbGet<AppConfig>('appConfig').then(cfg => {
      if (cfg) this.appConfig.set(cfg);
    });

  }

  // 2. 所有全局状态必须由后端加载 Shell 初始化: 1.需要 async/await
  // 3. 所有业务模块只能“读”Shell 状态，不能写 here is shell layout so can write
  // 4.  Angular 21 官方推荐的方式（使用 APP_INITIALIZER）在 app.config.ts 调用 init()

        // APP_INITIALIZER（最佳）生命周期正确、只执行一次、可 async、可阻塞启动
        // AppComponent 调用	 可用但不优雅
        // ShellComponent 调用	❌	会重复执行、破坏状态一致性
        // Feature 模块调用	❌❌❌	完全错误，破坏架构
  async init() {
    this.loading.set(true);

    try {
      const [user, cfg] = await Promise.all([
        this.auth.loadUser(),
        this.config.load(),
      ]);

      this.user.set(user);                  // Shell 可以写 // but at业务模块不能写
      this.appConfig.set(cfg);              // 单一写入者

      this.layout.initTheme(cfg.theme);
      this.setupNavigation(user);

    } finally {
      this.loading.set(false);
    }
  }

  setupNavigation(user: User) {
    const menu = this.layout.buildMenu(user.roles);
    this.layout.setMenu(menu);

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/dashboard']);
  }

  // 5. 全局状态必须可持久化
   // localStorage：适合用户、主题、偏好。,       （同步）
   // sessionStorage：适合临时状态（如当前 tab）。（同步）
   // IndexedDB：适合大数据（字典、配置、缓存）, （异步）

   // 所有持久化必须通过 Signals + effect 自动同步
   // constructor 在应用启动时只执行一次

   // 持久化监听必须在 constructor，因为它是同步绑定 Signals → Storage 的生命周期起点。
   // 恢复（restore）可以在 constructor 或 init()，取决于是否需要异步
   // 后端加载放在 init(), init() 可能被调用多次, effect inside init()会重复注册

   // Feature 模块不能持久化，只能读 Shell 状态

}
