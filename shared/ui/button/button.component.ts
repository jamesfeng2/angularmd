import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonVariant, ButtonSize } from './button.types';

@Component({
  selector: 'app-button',
  template: `
    <button
      class="app-button" // 永远存在 这个 class 是普通 HTML 永远存在，不需要 Angular 参与 <button class="app-button">
      [class.full-width]="fullWidth" //是否存在 动态绑定 由 Angular 根据表达式决定 class 是否存在
      [class.loading]="loading"
      [disabled]="disabled || loading" // 当 disabled 为 true，或者 loading 为 true 时，这个按钮就会被禁用。
      [ngClass]="[variant, size]"  //批量添加
      (click)="clicked.emit()"
    >
      <span class="spinner" *ngIf="loading"></span>

      <ng-content select="[icon]"></ng-content>

      <span class="label">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styleUrls: ['./button.component.css']
})
export class AppButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;

  @Output() clicked = new EventEmitter<void>();
}

`
disabled, checked selected readonly 
required native HTML disabled attribute


`

