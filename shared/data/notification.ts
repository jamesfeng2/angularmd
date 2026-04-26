

```
Inserts newest first ([n, ...list])

Supports real-time UX (new notifications appear at top)

Plays well with sortedByDate computed

Works with DTO ingestion

Works with WebSocket push

Works with localStorage persistence

Works with effects

Works with bulk ingestion

Works with hydration

Avoids unnecessary array churn

Matches real-world notification center behavior (Slack, GitHub, Gmail)

```
import { Injectable, signal, computed, effect } from '@angular/core';

export interface Notification {
  id: string;
  title: string;
  message?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: Date;
}

export interface NotificationDto {
  id: string;
  title: string;
  message?: string;
  type?: string;
  read?: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationStore {

  // ===== Core State =====
  private readonly _items = signal<Notification[]>([]);

  // ===== Derived State =====
  readonly unread = computed(() =>
    this._items().filter(n => !n.read)
  );

  readonly unreadCount = computed(() => this.unread().length);

  readonly hasUnread = computed(() => this.unreadCount() > 0);

  readonly sortedByDate = computed(() =>
    [...this._items()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  );

  // ===== Effects (Book Chapter 6.6 Style) =====
  // Auto-persist to localStorage
  private readonly persistEffect = effect(() => {
    const data = JSON.stringify(this._items());
    localStorage.setItem('notifications', data);
  });

  constructor() {
    this.restoreFromLocalStorage();
  }

  // ===== Creation =====
  addNotification(n: Notification) {
    this._items.update(list => [n, ...list]);
  }

  addBulk(list: Notification[]) {
    this._items.update(prev => [...list, ...prev]);
  }
 
  ingestFromServer(raw: NotificationDto[]) {
    const normalized = raw.map(dto => ({
      id: dto.id,
      title: dto.title,
      message: dto.message,
      type: (dto.type as any) ?? 'info',
      read: dto.read ?? false,
      createdAt: new Date(dto.createdAt)
    }));
    this.addBulk(normalized);
  }

  // ===== Query =====
  getById(id: string) {
    return this._items().find(n => n.id === id);
  }

  getByType(type: string) {
    return this._items().filter(n => n.type === type);
  }

  // ===== Update =====
  markAsRead(id: string) {
    this._items.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllAsRead() {
    this._items.update(list => list.map(n => ({ ...n, read: true })));
  }

  toggleRead(id: string) {
    this._items.update(list =>
      list.map(n =>
        n.id === id ? { ...n, read: !n.read } : n
      )
    );
  }

  updateNotification(id: string, partial: Partial<Notification>) {
    this._items.update(list =>
      list.map(n => n.id === id ? { ...n, ...partial } : n)
    );
  }

  // ===== Deletion =====
  remove(id: string) {
    this._items.update(list => list.filter(n => n.id !== id));
  }

  clearAll() {
    this._items.set([]);
  }

  clearRead() {
    this._items.update(list => list.filter(n => !n.read));
  }

  // ===== Integration =====
  loadInitialFromServer(fetcher: () => Promise<NotificationDto[]>) {
    fetcher().then(raw => this.ingestFromServer(raw));
  }

  subscribeToWebSocket(ws: WebSocket) {
    ws.onmessage = (event) => {
      const dto = JSON.parse(event.data) as NotificationDto;
      this.ingestFromServer([dto]);
    };
  }

  // ===== Persistence =====
  restoreFromLocalStorage() {
    const raw = localStorage.getItem('notifications');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Notification[];
      this._items.set(parsed.map(n => ({ ...n, createdAt: new Date(n.createdAt) })));
    } catch {}
  }
 




}