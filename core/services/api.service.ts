import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// API Service for making HTTP requests to the backend.
// 这个服务负责与后端 API 进行通信，提供 get、post 等方法来发送 HTTP 请求。
// 你可以在这个服务中添加一些通用的功能，例如自动添加认证 token、错误处理、请求重试等功能，来简化其他组件和服务的代码。
// 例如，你可以在 get 和 post 方法中自动从 AuthService 获取 token，并将其添加到请求头中，这样其他组件和服务就不需要关心认证细节了。
// 当然，这些功能也可以根据实际需求来实现，核心职责是提供一个统一的接口来与后端 API 进行通信，保持代码的清晰和可维护性。
// 你可以根据实际需求扩展 ApiService 的功能，例如添加 put、delete 方法，或者添加一些辅助方法来处理特定的 API 请求，但核心职责是提供一个统一的接口来与后端 API 进行通信。
// 你可以在应用启动时（例如在 AppComponent 的 ngOnInit 中）调用 ApiService 来加载一些初始数据，例如用户信息、全局配置等，来初始化应用的状态。
// 这个服务的职责是管理全局应用配置，保持单一职责原则，避免把它和认证、用户信息、UI 状态等其他状态混在一起，保持代码的清晰和可维护性。

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(url);
  }

  post<T>(url: string, body: any) {
    return this.http.post<T>(url, body);
  }
}
