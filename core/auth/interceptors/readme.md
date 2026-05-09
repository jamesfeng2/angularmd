
```
HTTP  request phase)
1. AuthInterceptor所有请求都需要 token
2. RefreshTokenInterceptor if 401, do 2
3. RetryInterceptor if 2, do 3
4. ErrorInterceptor  if 4, stop
5. LoadingInterceptor sign ok


HTTP response phase)
5. LoadingInterceptor
4. ErrorInterceptor
3. RetryInterceptor
2. RefreshTokenInterceptor
1. AuthInterceptor

1. Backend Response（后端返回）后端把数据返回给浏览器。

2. HTTP Interceptors（响应阶段）顺序是 反向执行：
Interceptor N (response)
↓
Interceptor N-1 (response)
↓
...
↓
HttpClient
在这里你可以：
统一错误处理
统一 unwrap response
统一 logging
统一 retry

3. HttpClient Observable emits（发出值）HttpClient.get() 返回的 Observable 发出值。
4. Service 接收数据
this.http.get(...).subscribe(...)
或者 Signals：
this.user.set(response);

5. Component 接收数据
有两种情况：
(1) subscribe 手动接收
this.service.load().subscribe(data => this.user = data);
(2) async pipe 自动接收
html
<div *ngIf="user$ | async as user">

6. Signals / Store 更新（如果使用）
如果你用 Signals：
this.user.set(data);
Signals 会触发：
dirty-check
markForCheck
schedule change detection

7. Change Detection Scheduling（调度变更检测）
Angular 会把变更检测加入微任务队列。
Signals 会自动触发变更检测（除非你 runOutsideAngular）。

8. Change Detection Runs（变更检测执行）
Angular 检查：

哪些 Signals 变了
哪些 Inputs 变了
哪些模板表达式需要重新计算

9. Template Re-render（模板重新渲染）
DOM 更新。

10. AfterRender Hooks（Angular 17+）
如果你使用：
afterRender(() => {...});
它会在 DOM 更新后执行。

```
