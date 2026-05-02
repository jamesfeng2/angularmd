// src/app/shell/layout/header/header.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Shell } from '../../shell.service';
import { UserPrefs } from '../../../shared/types/local-state.types';
import { UserPrefsService } from '../../../core/services/user-prefs.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="header">
      <button (click)="onToggleSidebar()">☰</button>

      <div class="spacer"></div>

      <span>{{ user?.name }}</span>

      <select [value]="theme1" (change)="toggleTheme1.emit(event.target as HTMLSelectElement).value as 'light' | 'dark' | 'system')">
        <option value="light">🌞 Light</option>
        <option value="dark">🌙 Dark</option>
        <option value="system">🖥️ System</option>
      </select>

      <button (click)="toggleTheme.emit()">
        {{ theme === 'light' ? '🌞' : '🌙' }}
      </button>

    <select [value]="prefs().language" (change)="changeLang($event)">
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>

    <div class="last-page">
  Last visited: {{ lastVisit  }}
</div>
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
    .select {
    padding: 4px 8px;
    border-radius: 4px;
    background: var(--bg);
    coor: var(--text);
    border: 1px solid #ccc;
    }
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
  @Input() theme1: 'light' | 'dark' | 'system' = 'system';

  @Output() toggleTheme = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() toggleTheme1 = EventEmitter<'light' | 'dark' |'system'>();

  
  constructor(private shell: Shell, 
    private prefsService: UserPrefsService
  ) {}
  
  // retrieve 
  lastVisit = () => this.shell.ui().lastVisitedPage;  

  prefs = () => this.shell.prefs;
  private lastClick = 0;

  changeLang(e: Event) {
    const lang = (e.target as HTMLSelectElement).value;
    this.shell.prefs.update((p: UserPrefs) => ({ ...p, language: lang }));
  }

  onToggleTheme() {
    // UI logic: debounce
    const now = Date.now();
    if (now - this.lastClick < 300) return;
    this.lastClick = now;

    // UI logic: maybe play animation
    // this.playRipple();

    // Emit to parent
    this.toggleTheme.emit();
  }
}


// by default, an child @Output() EventEmitter does nothing except notify the parent. 
// child itself does not change theme or sidebar state.

// child do UI‑level work before emitting, such as:

// local UI animations
// button ripple effects
// toggling internal UI state
// showing dropdown menus
// preventing double clicks
// debouncing
// analytics tracking
// accessibility focus managemen