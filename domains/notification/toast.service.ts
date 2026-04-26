import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info') {
    const toast: Toast = {
      id: crypto.randomUUID(),
      message,
      type,
    };

    this.toasts.update(list => [...list, toast]);

    setTimeout(() => this.remove(toast.id), 3000);
  }

  remove(id: string) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}

// usage
```

A) Manual trigger (UI decides when to show toast)
Example: after saving a form:

ts
toast.show('Saved successfully', 'success');

B) call toast-container.ts

C) Automatic trigger (NotificationStore effect)
This is the production pattern used in many apps.

Inside NotificationStore:

ts
constructor(private toast: ToastService) {
  this.restoreFromLocalStorage();

  effect(() => {
    const list = this._items();
    const latest = list[0];

    if (latest && !latest.read) {
      this.toast.show(latest.message, latest.type as any);
    }
  });
}
``