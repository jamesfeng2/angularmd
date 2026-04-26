import { Component } from '@angular/core';
import { NotificationStore } from '../stores/notification.store';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  templateUrl: `
  
  <div class="panel">
  <div class="header">
    <h3>Notifications</h3>
    <button (click)="store.markAllAsRead()">Mark all as read</button>
  </div>

  <div class="list">
    <div
      class="item"
      *ngFor="let n of store.sortedByDate()"
      [class.unread]="!n.read"
    >
      <div class="content">
        <h4>{{ n.title }}</h4>
        <p>{{ n.message }}</p>
        <small>{{ n.createdAt | date:'short' }}</small>
      </div>

      <div class="actions">
        <button (click)="store.markAsRead(n.id)">✓</button>
        <button (click)="store.remove(n.id)">🗑</button>
      </div>
    </div>
  </div>
</div>

  `,
  styleUrls: ['./notification-panel.component.css'],
})
export class NotificationPanelComponent {
  constructor(public store: NotificationStore) {}
}


```
.panel {
  width: 320px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  position: absolute;
  right: 0;
  top: 40px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.list {
  max-height: 400px;
  overflow-y: auto;
}

.item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
}

.item.unread {
  background: #f5f8ff;
}

.actions button {
  margin-left: 6px;
}

```