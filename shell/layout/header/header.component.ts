// src/app/shell/layout/header/header.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="header">
      <button (click)="toggleSidebar.emit()">☰</button>

      <div class="spacer"></div>

      <span>{{ user?.name }}</span>

      <button (click)="toggleTheme.emit()">
        {{ theme === 'light' ? '🌞' : '🌙' }}
      </button>
    </header>
  `,
  styles: [`
    .header {
      height: 56px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      background: var(--header-bg, #fff);
      border-bottom: 1px solid #ddd;
    }
    .spacer { flex: 1; }
  `]
})
// 负责：

// 显示用户

// 主题切换按钮

// Sidebar 切换按钮

// 触发 ShellComponent 的事件

export class HeaderComponent {
  @Input() user: any;
  @Input() theme: 'light' | 'dark' = 'light';

  @Output() toggleTheme = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>();
}
