import { Component, signal } from '@angular/core';
import { NotificationStore } from '../stores/notification.store';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  templateUrl:`
  
  <button class="bell" (click)="toggle()">
  <span class="icon">🔔</span>

  <span class="badge" *ngIf="store.unreadCount() > 0">
    {{ store.unreadCount() }}
  </span>
</button>

<app-notification-panel *ngIf="isOpen()" />

  `,
  styleUrls: `
  .bell {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 11px;
}

  `,
})
export class NotificationBellComponent {
  isOpen = signal(false);

  constructor(public store: NotificationStore) {}

  toggle() {
    this.isOpen.update(v => !v);
  }
}
