import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgIf, NgContent } from '@angular/common';

//<app-button>Save</app-button>
//<app-button variant="secondary">Cancel</app-button>
// <app-button variant="danger">Delete</app-button>
//<app-button variant="outline">More</app-button>
//<app-button variant="text">Learn more</app-button>
//<app-button [disabled]="true">Submit</app-button>
//<app-button iconLeft="fa fa-plus">Add</app-button>
//<app-button iconOnly="true" iconLeft="fa fa-search"></app-button>


 

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'text'
  | 'outline';

export type ButtonSize = 'sm' | 'md' | 'lg';


@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: `
  <button
  class="app-button"
  [ngClass]="[
    variant,
    size,
    fullWidth ? 'full-width' : '',
    iconOnly ? 'icon-only' : ''
  ]"
  [disabled]="disabled || loading"
  [attr.aria-disabled]="disabled || loading"
  (click)="onClick($event)"
>
  <!-- Loading Spinner -->
  <span class="spinner" *ngIf="loading"></span>

  <!-- Icon Left -->
  <span class="icon left" *ngIf="iconLeft && !loading">
    <i [class]="iconLeft"></i>
  </span>

  <!-- Button Text -->
  <span class="label" *ngIf="!iconOnly">
    <ng-content></ng-content>
  </span>

  <!-- Icon Right -->
  <span class="icon right" *ngIf="iconRight && !loading">
    <i [class]="iconRight"></i>
  </span>
</button> 
  `,
  styleUrls: ['./app-button.component.css'],
})
export class AppButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() fullWidth = false;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() iconLeft?: string;
  @Input() iconRight?: string;
  @Input() iconOnly = false;

  @Output() clicked = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.clicked.emit(event);
  }
}
