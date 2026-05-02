import { Injectable, signal } from '@angular/core';

// HTTP Error State
// 这个服务负责存储和管理全局的 HTTP 错误状态，供整个应用使用。
// 你可以在 ApiService 中捕获 HTTP 错误，并通过 HttpErrorService 来存储错误信息，这样其他组件和服务就可以访问这些错误信息来显示错误提示或者进行其他处理。
// 例如，在 ApiService 的 get 和 post 方法中，你可以使用 catchError 操作符来捕获 HTTP 错误，并调用 HttpErrorService.setError(err) 来存储错误信息。
// 你也可以在 HttpErrorService 中添加一些辅助方法来处理错误信息，例如 clearError() 来清除错误状态，或者 getLastError() 来获取最后一次的错误信息，这样其他组件和服务就可以更方便地使用这个服务来处理 HTTP 错误。
// 这个服务的职责是管理全局 HTTP 错误状态，保持单一职责原则，避免把它和认证、用户信息、UI 状态等其他状态混在一起，保持代码的清晰和可维护性。    
// 你可以根据实际需求扩展 HttpErrorService 的功能，例如添加错误日志记录、错误通知等功能，但核心职责是管理全局 HTTP 错误状态，供整个应用使用。
// 你可以在应用启动时（例如在 AppComponent 的 ngOnInit 中）调用 ApiService 来加载一些初始数据，例如用户信息、全局配置等，来初始化应用的状态。
// HTTP 错误状态    
// key	纯中文含义
// lastError	最后一次的 HTTP 错误信息（可以是一个对象，包含错误码、错误消息等信息）
// 这些信息通常在发送 HTTP 请求时从后端返回，并存储在全局状态中，供整个应用使用。
// 你可以把它放在 ShellService 里，但为了更清晰的职责分离，建议放在单独的 HttpErrorService。
// 你可以在 ApiService 中捕获 HTTP 错误，并通过 HttpErrorService 来存储错误信息，这样其他组件和服务就可以访问这些错误信息来显示错误提示或者进行其他处理。
// 例如，在 ApiService 的 get 和 post 方法中，你可以使用 catchError 操作符来捕获 HTTP 错误，并调用 HttpErrorService.setError(err) 来存储错误信息。
// 你也可以在 HttpErrorService 中添加一些辅助方法来处理错误信息，例如 clearError() 来清除错误状态，或者 getLastError() 来获取最后一次的错误信息，这样其他组件和服务就可以更方便地使用这个服务来处理 HTTP 错误。
// 这个服务的职责是管理全局 HTTP 错误状态，保持单一职责原则，避免把它和认证、用户信息、UI 状态等其他状态混在一起，保持代码的清晰和可维护性。    
// 你可以根据实际需求扩展 HttpErrorService 的功能，例如添加错误日志记录、错误通知等功能，但核心职责是管理全局 HTTP 错误状态，供整个应用使用。
// HTTP Error State


@Injectable({ providedIn: 'root' })
export class HttpErrorService {
  lastError = signal<any>(null);

  setError(err: any) {
    this.lastError.set(err);
  }

  clear() {
    this.lastError.set(null);
  }
}
