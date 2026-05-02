// src/app/shell/shell.service.ts
import { Injectable, signal, effect } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { loadFromLocal, loadFromLocal1, loadFromLocal2, saveToLocal } from '../shared/utils/storage';
import { Theme, UserPrefs, UIState, Flags } from '../shared/types/local-state.types';
import { AuthService } from '../core/auth/auth.service';
import { AppConfigService } from '../core/config/app-config.service';
import { loadFromLocal, loadFromSession, saveToLocal, saveToSession } from '../shared/utils/storage';
import { idbGet, idbSet } from '../shared/utils/db';
import { UserPrefsService } from '../core/services/user-prefs.service';
import { LayoutService } from './layout/layout.service';
import { ThemeService } from '../core/services/theme.service';
import { UIStateService } from '../core/services/ui-state.service';
import { FlagsService } from '../core/services/flags-state.service';


// 全局状态中心（Signals）
// 持久化（localStorage + IndexedDB）
// 初始化（init()）
// 用户、主题、菜单、配置、loading
// 全局事件
// 全局网络状态

// 登录后跳转
// 未授权跳转
// Token 过期跳转
// 全局导航（如 goHome()）
// 权限路由控制
// 动态重定向

// ✔ constructor 做三件事：
// 恢复同步存储（localStorage/sessionStorage）
// 恢复异步存储（IndexedDB）
// 注册 effect 持久化监听

// ✔ init() 做两件事：
// 从后端加载用户/配置
// 写入 Shell 状态（user/theme/appConfig）

@Injectable({ providedIn: 'root' })
export class Shell {
// 全局状态 业务模块不需要关心这些，只需要读信号 全局状态中心
// 1. 所有全局状态必须用 Signals

  // --- 0 from session --
  session = signal(loadFromSession('session'));

  // --- 1. 从 localStorage 恢复同步状态 ---
 // user = signal<User | null>(loadFromLocal<User>('user')); 
  theme = signal<Theme>(loadFromLocal1<Theme>('theme') ?? 'light');

  prefs = signal<UserPrefs>(
    loadFromLocal<UserPrefs>('prefs', {
      language: 'en',
      layoutMode: 'full',
    }, {
    version: 2,
    mergeDefault: true,
    validate: isUserPrefs,
    migrate: migrateUserPrefs
  })
  );

  ui = signal<UIState>(
    loadFromLocal('ui', {
      sidebarCollapsed: false,
      lastVisitedPage: '/'
    }, {
      version: 1,
      mergeDefault: true
    })
  );

  flags = signal<Flags>(
    loadFromLocal2<Flags>('flags', {
      onboardingDone: false,
    })
  );

  // --- 2. 异步状态（IndexedDB 恢复） ---
  appConfig = signal<AppConfig | null>(null);

  // --- 3. 全局 UI 状态 ---
  loading = signal(false);
  globalError = signal<string | null>(null);

  // --- 4. 全局菜单 ---
  menu = signal<MenuItem[]>([]);

  // --- 5. 网络状态 ---
  network = signal({ online: true, retry: 0 });


// 持久化监听必须在 constructor，因为它是同步绑定 Signals → Storage 的生命周期起点。
// 恢复（restore）可以在 constructor 或 init()，取决于是否需要异步
//       localStorage / sessionStorage（同步） IndexedDB（异步
// effect 只能放 constructor，不放 init()。
// 后端加载（loadUser/loadConfig）必须放 init()
//        需要 async/await
//        需要在 App 启动时调用
//        不能放 constructor（constructor 不能 async）
//        不能放字段初始化（不能 await）

  constructor(
    private auth: AuthService,
    private config: AppConfigService,
    private layout: LayoutService,
    private router: Router,
    private prefsService: UserPrefsService,
    private themeService: ThemeService,
    private uiService: UIStateService,
    private flagsService: FlagsService,

  ) {
    // --- 恢复 IndexedDB ---
    // IndexedDB 是异步的，所以恢复必须放在 constructor
    idbGet<AppConfig>('appConfig').then(cfg => {
      if (cfg) this.appConfig.set(cfg);
    });

    // --- 持久化 localStorage --- should use services
    // effect(() => saveToLocal('user', this.user()));
    effect(() => saveToLocal('theme', this.theme()));
    effect(() => saveToLocal('theme', this.theme(), 1));
    effect(() => saveToLocal('prefs', this.prefs(), 2));
    effect(() => saveToLocal('ui', this.ui(), 1));
    effect(() => saveToLocal('flags', this.flags(),1));

    // --- 持久化 IndexedDB ---
    effect(() => {
      const cfg = this.appConfig();
      if (cfg) idbSet('appConfig', cfg);
    });

      effect(() => { saveToSession('session', this.session());
  });

  // --- 自动记录最近访问页面 ---
  this.router.events.pipe(
    filter((e:any): e is NavigationEnd => e instanceof NavigationEnd)
  ).subscribe((e: NavigationEnd) => {
    this.ui.update((ui: any) => ({
      ...ui,
      lastVisitedPage: e.urlAfterRedirects
    }));
  });


  }

  // --- 6. 应用初始化（APP_INITIALIZER 调用） ---
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

      this.user.set(user);   // Shell 可以写 // but at业务模块不能写
      this.appConfig.set(cfg);   // 单一写入者
      this.theme.set(cfg.theme);

      // 动态菜单
      this.menu.set(this.buildMenu(user.roles));


      // Flags service replace constructor Flags
      // Example: If user logs in first time, mark onboarding done
      if (!this.flags.flags().onboardingDone) {
        this.flags.markOnboardingDone();
    }


    } finally {
      this.loading.set(false);
    }
  }

    // Example: ShellService can expose flags to components
    get onboardingDone() {
      return this.flags.flags().onboardingDone;
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

  // --- 7. 动态菜单生成 ---
  private buildMenu(roles: string[]): MenuItem[] {
    return [
      { label: 'Dashboard', path: '/dashboard', icon: 'home' },
      { label: 'Customers', path: '/customers', icon: 'users' },
      { label: 'Orders', path: '/orders', icon: 'shopping-cart' },
      { label: 'Settings', path: '/settings', icon: 'settings' },
    ];
  }
}


// common functions for userprefs
function migrateUserPrefs(old: any, oldVersion: number): UserPrefs {
  if (oldVersion === 1) {
    return {
      language: old.language ?? 'en',
      layoutMode: 'full'
    };
  }
  return old;
}


function isUserPrefs(x: unknown): x is UserPrefs {
  return typeof x === 'object'
    && x !== null
    && typeof (x as any).language === 'string'
    && ['full', 'mini'].includes((x as any).layoutMode);
}


  // 全局状态必须可持久化
   // localStorage：适合用户、主题、偏好。,       （同步）
   // sessionStorage：适合临时状态（如当前 tab）。（同步）
   // IndexedDB：适合大数据（字典、配置、缓存）, （异步）

   // 所有持久化必须通过 Signals + effect 自动同步
   // constructor 在应用启动时只执行一次

   // 持久化监听必须在 constructor，因为它是同步绑定 Signals → Storage 的生命周期起点。
   // 恢复（restore）可以在 constructor 或 init()，取决于是否需要异步
   // 后端加载放在 init(), init() 可能被调用多次, effect inside init()会重复注册

   // Feature 模块不能持久化，只能读 Shell 状态


   
