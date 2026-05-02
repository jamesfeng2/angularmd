// src/app/shell/shell.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Shell } from './shell.service';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';


// 渲染布局（header/sidebar/footer）

// 渲染 router-outlet

// 只读取 ShellService 的全局状态

// 不写状态

// 不调用 init()

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
  ],
  template: `
    <app-header 
      [user]="user()" 
      [theme]="theme()" 
    />

    <div class="layout">
      <app-sidebar [menu]="menu()" />

      <main class="content">
        <router-outlet />
      </main>
    </div>
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
export class ShellComponent {
  
  constructor(private shell: Shell) {}

  // Shell 全局状态（只读）
  user = this.shell.user;
  theme = this.shell.theme;
  menu = this.shell.menu;

}
