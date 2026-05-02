// src/app/shell/layout/layout.service.ts
import { Injectable, signal } from '@angular/core';

// 负责：Sidebar 折叠、主题、布局状态
// ShellComponent 只读，不写

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private collapsed = signal(false);

  isCollapsed = () => this.collapsed();

  toggle() {
    this.collapsed.update(v => !v);
  }

  collapse() {
    this.collapsed.set(true);
  }

  expand() {
    this.collapsed.set(false);
  }
}
