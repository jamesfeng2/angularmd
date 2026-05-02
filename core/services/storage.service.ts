    import { Injectable } from '@angular/core';

    // Storage Service
// 这个服务负责处理应用中的存储功能，例如本地存储、会话存储等。
// 你可以在应用中定义一些存储方法，例如 get、set、remove，来操作浏览器的本地存储或者会话存储，这样你就可以在不直接依赖 localStorage 或 sessionStorage 的情况下来处理存储逻辑，保持代码的清晰和可维护性。
// 例如，在组件中，你可以通过 StorageService.set('user', userData) 来保存用户信息，或者通过 StorageService.get('user') 来获取用户信息，这样你就可以在整个应用中统一管理存储逻辑，避免直接操作浏览器的存储 API，保持代码的一致性和可维护性。
// 你也可以在应用启动时（例如在 AppComponent 的 ngOnInit 中）调用 ApiService 来加载一些初始数据，例如用户信息、全局配置等，来初始化应用的状态，包括存储状态的状态。
// 存储状态    
// key	纯中文含义
// get	一个方法，用于从存储中获取数据，接受一个键作为参数，返回对应的数据，如果没有找到则返回 null。
// set	一个方法，用于向存储中保存数据，接受一个键和值作为参数，将值保存到存储中，通常会将值转换为 JSON 字符串来存储，以便在获取时能够正确解析。
// remove	一个方法，用于从存储中删除数据，接受一个键作为参数，从存储中删除对应的数据。
// 这些方法通常会操作浏览器的 localStorage 或 sessionStorage 来实现数据的持久化存储，供整个应用使用。
// 你可以把它放在 ShellService 里，但为了更清晰的职责分离，建议放在单独的 StorageService。
// 这个服务的职责是管理全局存储功能，保持单一职责原则，避免把它和认证、用户信息、UI 状态等其他状态混在一起，保持代码的清晰和可维护性。    
// 你可以根据实际需求扩展 StorageService 的功能，例如添加更多的存储方法、存储日志记录、存储通知等功能，但核心职责是管理全局存储功能，供整个应用使用。
@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string): T | null {
    return JSON.parse(localStorage.getItem(key) || 'null');
  }

  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }
}
