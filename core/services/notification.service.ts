import { Injectable, signal } from '@angular/core';
import { NotificationStore } from '../store/notification-store';

// Notification Service
// 这个服务负责存储和管理全局的通知状态，例如 snackbar 的消息和类型，供整个应用使用。
// 你可以在应用中定义一些通知，例如 "Data saved successfully"，来显示给用户，这样你就可以在不修改代码的情况下，通过修改通知的值来显示不同的消息。
// 例如，在组件中，你可以通过 NotificationService.show('Data saved successfully', 'success') 来显示一个成功的通知，然后根据结果来决定是否显示某个 UI 元素或者执行某段代码。
// 你也可以在应用启动时（例如在 AppComponent 的 ngOnInit 中）调用 ApiService 来加载一些初始数据，例如用户信息、全局配置等，来初始化应用的状态，包括通知状态的状态。
// 通知状态    
// key	纯中文含义
// snackbar	一个对象，包含当前 snackbar 的消息和类型，例如 { message: 'Data saved successfully', type: 'success' }，其中 message 是要显示的消息文本，type 是通知的类型，可以是 'info'、'success' 或 'error'，这些信息通常在应用中通过调用 NotificationService.show(message, type) 来设置，并存储在全局状态中，供整个应用使用。
// 你可以把它放在 ShellService 里，但为了更清晰的职责分离，建议放在单独的 NotificationService。
// 这个服务的职责是管理全局通知状态，保持单一职责原则，避免把它和认证、用户信息、UI 状态等其他状态混在一起，保持代码的清晰和可维护性。    
// 你可以根据实际需求扩展 NotificationService 的功能，例如添加通知日志记录、通知队列等功能，但核心职责是管理全局通知状态，供整个应用使用。

// simple version using signal
// @Injectable({ providedIn: 'root' })
// export class NotificationService {
//   snackbar = signal<{ message: string; type: string } | null>(null);

//   show(message: string, type: 'info' | 'success' | 'error' = 'info') {
//     this.snackbar.set({ message, type });
//   }

//   clear() {
//     this.snackbar.set(null);
//   }
// }

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private store: NotificationStore) {}

  add(message: string, type: Notification['type'] = 'info') {
    this.store.add(message, type);
  }

  remove(id: string) {
    this.store.remove(id);
  }

  markAsRead(id: string) {
    this.store.markAsRead(id);
  }

  markAllAsRead() {
    this.store.markAllAsRead();
  }

  clear() {
    this.store.clear();
  }

  notifications = this.store.notifications;
  unread = this.store.unread;
  unreadCount = this.store.unreadCount;
  sorted = this.store.sorted;
}

