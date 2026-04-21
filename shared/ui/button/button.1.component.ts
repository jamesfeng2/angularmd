import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonVariant, ButtonSize } from './button.types';

@Component({
  selector: 'app-button',
  template: `
    <button
      class="app-button"
      [class.full-width]="fullWidth"
      [class.loading]="loading"
      [disabled]="disabled || loading"
      [ngClass]="[variant, size]"
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


