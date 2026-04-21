import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <ng-content select="[header]"></ng-content>
      <ng-content></ng-content>
      <ng-content select="[footer]"></ng-content>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      background: white;
    }
  `]
})
export class AppCardComponent {}


`
<app-card>
  <div header>客户列表</div>

  <app-button (clicked)="reload()">刷新</app-button>

  <div footer>共 {{ total }} 条</div>
</app-card>


`