import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// API Service for making HTTP requests to the backend.
// 这个服务负责与后端 API 进行通信，提供 get、post 等方法来发送 HTTP 请求。
// 你可以在这个服务中添加一些通用的功能，例如自动添加认证 token、错误处理、请求重试等功能，来简化其他组件和服务的代码。
// 例如，你可以在 get 和 post 方法中自动从 AuthService 获取 token，并将其添加到请求头中，这样其他组件和服务就不需要关心认证细节了。
// 核心职责是提供一个统一的接口来与后端 API 进行通信，保持代码的清晰和可维护性。
// 添加 put、delete 方法，或者添加一些辅助方法来处理特定的 API 请求，但核心职责是提供一个统一的接口来与后端 API 进行通信。
// 你可以在应用启动时（例如在 AppComponent 的 ngOnInit 中）调用 ApiService 来加载一些初始数据，例如用户信息、全局配置等，来初始化应用的状态。
// 这个服务的职责是管理全局应用配置，保持单一职责原则，避免把它和认证、用户信息、UI 状态等其他状态混在一起，保持代码的清晰和可维护性。

// Automatic base URL resolution
// Automatic query param handling
// Automatic JSON body handling
// Automatic headers merging
// Strong typing
// Error passthrough (interceptors handle errors)
// Ready for AuthInterceptor
// Ready for RetryInterceptor
// Ready for LoggingInterceptor


// ❌ Do NOT use it for:
// Firebase
// GraphQL
// WebSockets
// Local IndexedDB
// Mock data

// ✅ Use it for:
// REST APIs
// Microservices
// Backend‑for‑frontend
// Internal admin APIs
// Public APIs

interface ApiOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
}


@Injectable({ providedIn: 'root' })
export class ApiService {
  
  private http = inject(HttpClient); // 少写 constructor 更简洁 更适合 signal / effect /standalone 
  private appConfig = inject(AppConfigService);


  // Build full URL: baseUrl + path => /api + /users → /api/users   
  private buildUrl(path: string): string {
    const base = this.appConfig.appConfig().apiBaseUrl;
    // Ensure no double slashes
    return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }

  /** Convert object to HttpParams */
  private toParams(params?: Record<string, any>): HttpParams | undefined {
    if (!params) return undefined;

    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, value as any);
      }
    });
    return httpParams;
  }

  /** Merge headers */
  private mergeHeaders(headers?: Record<string, string>): HttpHeaders {
    let httpHeaders = new HttpHeaders();
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        httpHeaders = httpHeaders.set(key, value);
      });
    }
    return httpHeaders;
  }

  private handle<T>(obs: Observable<T>) {
  return obs.pipe(
    catchError((err: any) => {
      console.error('API error:', err);
      return throwError(() => err);
    })
  );
}


 
   // -----------------------------
  // HTTP METHODS
  // -----------------------------
  // get<T>(url: string) {return this.http.get<T>(url); }

  // --------------------------------------------------------------------
  // Generic request method (optional, can be used for more complex scenarios)
  // --------------------------------------------------------------------
      //   request<T>(method: string, path: string, options: any = {}) {
      //   return this.http.request<T>(method, this.buildUrl(path), {
      //     ...options,
      //     params: this.toParams(options.params),
      //     headers: this.mergeHeaders(options.headers)
      //   });
      // }
      // --------------------------------------------------------------------
      // Convenience methods for common HTTP verbs 
      // --------------------------------------------------------------------
      // get<T>(path: string, options?: ApiOptions) {
      //   return this.request<T>('GET', path, options);
      // }

    get<T>(
    path: string,
    options?: ApiOptions
  ) {
    return this.handle(
      this.http.get<T>(this.buildUrl(path), {
        params: this.toParams(options?.params),
        headers: this.mergeHeaders(options?.headers)
    })
    );
  }

  // post<T>(url: string, body: any) {
  //   return this.http.post<T>(url, body);
  // }
    post<T>(
    path: string,
    body: any,
    options?: ApiOptions
  ) {
    return this.http.post<T>(this.buildUrl(path), body, {
      params: this.toParams(options?.params),
      headers: this.mergeHeaders(options?.headers)
    });
  }

   put<T>(
    path: string,
    body: any,
    options?: ApiOptions
  ) {
    return this.handle(
      this.http.put<T>(this.buildUrl(path), body, {
        params: this.toParams(options?.params),
        headers: this.mergeHeaders(options?.headers)
        })
    );
  }

  patch<T>(
    path: string,
    body: any,
    options?:ApiOptions
  ) {
    return this.http.patch<T>(this.buildUrl(path), body, {
      params: this.toParams(options?.params),
      headers: this.mergeHeaders(options?.headers)
    });
  }

  delete<T>(
    path: string,
    options?: ApiOptions
  ) {
    return this.http.delete<T>(this.buildUrl(path), {
      params: this.toParams(options?.params),
      headers: this.mergeHeaders(options?.headers)
    });
  }
}
