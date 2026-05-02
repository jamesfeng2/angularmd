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

// IndexedDB 是异步的，所以恢复必须放在 constructor    // 4. 恢复 IndexedDB  
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

      this.user.set(user);                  
      this.appConfig.set(cfg);             

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



}
