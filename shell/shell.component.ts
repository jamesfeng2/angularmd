// src/app/shell/shell.component.ts
import { Component, HostListener } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Shell } from './shell.service';
import { LayoutService } from './layout/layout.service';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ErrorBannerComponent } from './ui/error-banner.component';
import { SpinnerComponent } from './ui/spinner.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    ErrorBannerComponent,
    SpinnerComponent,
  ],
  template: `
    <app-header
      [user]="user()"
      [theme]="theme()"
      (toggleTheme)="toggleTheme()"
      (toggleSidebar)="toggleSidebar()"
    />

    <app-error-banner *ngIf="error()" [message]="error()" />

    <div class="layout">
      <app-sidebar 
        [menu]="menu()" 
        [collapsed]="isCollapsed()" 
      />

      <main class="content">
        <router-outlet />
      </main>
    </div>

    <app-spinner *ngIf="loading()" />
  `,
  styles: [`
    .layout {
      display: flex;
      height: 100vh;
    }
    .content {
      flex: 1;
      overflow: auto;
    }
  `]
})

// 渲染布局（header/sidebar/footer）
// 渲染 router-outlet
// 只读取 ShellService 的全局状态
// 不写状态
// 不调用 init()

// ShellComponent = 全局 UI 层（Layout Layer）
// ShellService = 全局状态中心（State Layer）

// ShellComponent 常见功能：
// Header / Sidebar / Footer
// 全局 Loading
// 全局 Error Banner
// 主题切换
// Sidebar 折叠
// 响应式布局（mobile detection）
// 全局导航（goHome / logout）
// 只读 ShellService 状态
// 不调用 init()
// 不写业务状态

export class ShellComponent {
  constructor(
    private shell: Shell,
    private layout: LayoutService,
    private router: Router,
  ) {}

  // Shell 全局状态（只读）
  user = () => this.shell.user();
  theme = () => this.shell.theme();
  menu = () => this.shell.menu();
  loading = () => this.shell.loading();
  error = () => this.shell.globalError();

  // --- Layout State ---
  isCollapsed = () => this.layout.isCollapsed();

  toggleSidebar() {
    this.layout.toggle();
  }

  toggleTheme() {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.shell.theme.set(next);
  }

  // --- Responsive ---
  isMobile = signal(window.innerWidth < 768);

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth < 768);
  }

  // --- Navigation ---
  goHome() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.shell.user.set(null);
    this.router.navigate(['/login']);
  }
}




  // “shell 是 constructor 参数，但 constructor 还没执行
  // user = this.shell.user;
  // theme = this.shell.theme;
  // menu = this.shell.menu;


