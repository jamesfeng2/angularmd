import { Component } from '@angular/core';
import { NotificationStore } from '../stores/notification.store';

@Component({
  selector: 'app-notifications-panel-example',
  standalone: true,
  templateUrl: `
  <div class="example">
  <button (click)="addInfo()">Add Info</button>
  <button (click)="addSuccess()">Add Success</button>
  <button (click)="addWarning()">Add Warning</button>
  <button (click)="addError()">Add Error</button>

  <app-notification-panel></app-notification-panel>
</div>

  `,
})
export class NotificationsPanelExampleComponent {
  constructor(public store: NotificationStore) {}

  addInfo() {
    this.store.add('This is an info message', 'info');
  }

  addSuccess() {
    this.store.add('Operation successful', 'success');
  }

  addWarning() {
    this.store.add('This is a warning', 'warning');
  }

  addError() {
    this.store.add('Something went wrong', 'error');
  }
}
