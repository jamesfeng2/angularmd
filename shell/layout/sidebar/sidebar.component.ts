// src/app/shell/layout/sidebar/sidebar.component.ts
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserPrefsService } from '../../../core/services/user-prefs.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <nav>
        <a *ngFor="let item of menu"
           [routerLink]="item.path"
           class="menu-item">
          <span class="icon">{{ item.icon }}</span>
          <span class="label" *ngIf="!collapsed">{{ item.label }}</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 220px;
      background: #f8f9fa;
      border-right: 1px solid #ddd;
      transition: width 0.2s;
    }
    .sidebar.collapsed {
      width: 60px;
    }
    .menu-item {
      display: flex;
      align-items: center;
      padding: 12px;
      text-decoration: none;
      color: #333;
    }
    .icon {
      width: 24px;
      margin-right: 12px;
    }
  `]
})

// 负责：
// 显示菜单
// 折叠/展开
// 响应 LayoutService 状态
export class SidebarComponent {
  @Input() menu: any[] = [];
  @Input() collapsed = false;

    constructor(  
      private prefsService: UserPrefsService
    ) {}

  layoutMode = ()=> this.prefsService.prefs().layoutMode;

}
