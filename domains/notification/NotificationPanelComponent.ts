import { Component } from '@angular/core';
import { NotificationStore } from '../../core/store/notification-store';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  templateUrl: `
  <div class="panel">
  <div class="header">
    <h3>Notifications</h3>
    <button (click)="markAll()">Mark all as read</button>
  </div>

  <div class="list">
    <div
      class="item"
      *ngFor="let n of store.sorted()"
      [class.unread]="!n.read"
    >
      <div class="content">
        <h4>{{ n.title }}</h4>
        <p>{{ n.message }}</p>
        <small>{{ n.timestamp | date:'short' }}</small>
      </div>

      <div class="actions">
        <button (click)="markRead(n.id)">✓</button>
        <button (click)="remove(n.id)">🗑</button>
      </div>
    </div>
  </div>
</div>

  `,
  styleUrls: ['./notification-panel.component.css'],
})
export class NotificationPanelComponent {
  constructor(public store: NotificationStore) {}

  markRead(id: string) {
    this.store.markAsRead(id);
  }

  remove(id: string) {
    this.store.remove(id);
  }

  markAll() {
    this.store.markAllAsRead();
  }
}
