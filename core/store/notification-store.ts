import { Injectable, signal, computed, effect } from '@angular/core';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationStore {
  // -----------------------------
  // 1. PRIVATE WRITABLE SIGNAL
  // -----------------------------
  private readonly _notifications = signal<Notification[]>([]);

  // -----------------------------
  // 2. PUBLIC READONLY SIGNAL
  // -----------------------------
  readonly notifications = this._notifications.asReadonly();

  // -----------------------------
  // 3. COMPUTED SIGNALS
  // -----------------------------
  readonly unread = computed(() =>
    this._notifications().filter(n => !n.read)
  );

  readonly unreadCount = computed(() => this.unread().length);

  readonly sorted = computed(() =>
    [...this._notifications()].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  );

  readonly byType = computed(() => {
    const map = new Map<string, Notification[]>();
    for (const n of this._notifications()) {
      if (!map.has(n.type)) map.set(n.type, []);
      map.get(n.type)!.push(n);
    }
    return map;
  });

  // -----------------------------
  // 4. EFFECTS (UX + PERSISTENCE)
  // -----------------------------
  constructor() {
    // Persist
    effect(() => {
      localStorage.setItem(
        'notifications',
        JSON.stringify(this._notifications())
      );
    });

    // Hydrate
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this._notifications.set(parsed);
      } catch {}
    }
  }

  // -----------------------------
  // 5. MUTATION METHODS (ALL use update())
  // -----------------------------

  /** Add new notification (PREPEND for best UX) */
  add(message: string, type: Notification['type'] = 'info', title = 'New Notification') {
    const newItem: Notification = {
      id: crypto.randomUUID(),
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
    };

    this._notifications.update(list => [newItem, ...list]);
  }

  /** Remove one */
  remove(id: string) {
    this._notifications.update(list =>
      list.filter(n => n.id !== id)
    );
  }

  /** Mark one as read */
  markAsRead(id: string) {
    this._notifications.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  /** Mark all as read */
  markAllAsRead() {
    this._notifications.update(list =>
      list.map(n => ({ ...n, read: true }))
    );
  }

  /** Clear all */
  clear() {
    this._notifications.update(() => []);
  }

  /** Filter by type (non‑mutating helper) */
  filterByType(type: Notification['type']) {
    return this._notifications().filter(n => n.type === type);
  }
}
