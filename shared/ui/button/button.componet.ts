import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button
      [disabled]="disabled"
      [ngClass]="variant"
      (click)="clicked.emit()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      border: none;
    }
    .primary { background: #1976d2; color: white; }
    .secondary { background: #e0e0e0; color: #333; }
  `]
})
export class AppButtonComponent {
  @Input() disabled = false;
  @Input() variant: 'primary' | 'secondary' = 'primary';

  @Output() clicked = new EventEmitter<void>();
}
`
uage:

<app-card>
  <div header>客户列表</div>

  <app-button (clicked)="reload()">刷新</app-button>

  <div footer>共 {{ total }} 条</div>
</app-card>

`
`
为什么它是“纯展示组件”？
没有 service

没有 store

没有 API 调用

没有业务逻辑

只负责 UI + 发出事件

可复用、可组合

`