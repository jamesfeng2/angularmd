
import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient,withRequestsMadeViaParent, withInterceptors, withFetch, withJsonp, withXsrf } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SHELL_ROUTES } from './app.route';
import { Shell } from './shell/shell.service';
import { refreshTokenInterceptor } from './core/interceptors/refresh-token.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(SHELL_ROUTES, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),

    // 应用启动初始化（Shell.init）
    {
      provide: APP_INITIALIZER,
      useFactory: (shell: Shell) => () => shell.init(),
      deps: [Shell],
      multi: true,
    },

    // must order: 先加 Token，再处理错误，最后日志（不修改请求/响应，只记录）
    // HttpClient + 拦截器, Angular 21 所有功能都通过 withXXX() 组合进来。
    provideHttpClient(
     withInterceptors([
        authInterceptor, 
        refreshTokenInterceptor,
        errorInterceptor, 
        loggingInterceptor
    ]),
    withFetch(),   //用 Fetch 替代 XHR	for 现代浏览器、流式响应
    withJsonp(),    //启用 JSONP 支持	for 老旧 API、跨域但不支持 CORS 的场景
    withXsrf({      //启用 XSRF 保护	for cookie-based session 的后端
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
    }),
    withRequestsMadeViaParent(), // 子模块 HttpClient 继承全局配置	for feature module 中使用 provideHttpClient() 时继承全局拦截器
    ),


    // 动画
    provideAnimations(),

    //i18n
     provideLocale('zh-CN'),

    //ssr Hydration
     provideClientHydration(),

    // zone
    provideZoneChangeDetection({ eventCoalescing: true }), 
  ],
};

// app.config.ts = 整个应用的启动配置中心（ApplicationConfig），
//   负责路由、HTTP、拦截器、初始化、DI、错误处理、动画、i18n 等全局能力



// provideRouter(routes)	注册路由系统
// APP_INITIALIZER	在应用启动前执行 Shell.init()
// provideHttpClient()	启用 HttpClient （Angular 16+ standalone 必须显式提供）。
// HTTP_INTERCEPTORS	全局拦截器（Auth/Error/Logging/ Token 过期处理）
// provideAnimations()	启用动画（Material、Overlay、Modal 都需要
// provideZoneChangeDetection()	提升性能（Angular 17+）
// provideI18n()	国际化、日期格式、货币格式
// provideServiceWorker()	PWA 支持
// provideRouterFeatures()	滚动、预加载、输入绑定等
// provideClientHydration()	SSR/SSG 支持
// provideEnvironmentInitializer() 用于环境级别初始化



// 1. withFetch() — 使用 Fetch API 替代 XHR
// ✔ 用途
// 让 Angular HttpClient 使用 Fetch API 而不是传统的 XMLHttpRequest。
// 优点：
// 更快
// 更现代
// 更好支持流式响应（streaming）
// 更好支持 Request/Response cloning
// 更好支持 AbortController

// ✔ 适用场景
// 现代浏览器
// SSR
// 流式响应（如 AI 接口）
// 大文件下载

// 2. withJsonp() — 启用 JSONP 支持
// ✔ 用途
// 让 HttpClient 支持 JSONP 请求：
// ts
// this.http.jsonp(url, 'callback');
// ✔ 适用场景
// 老旧 API
// 需要跨域但服务器不支持 CORS
// 第三方服务（如旧版地图 API）


// 3. withXsrf() — 启用 XSRF（跨站请求伪造）保护
// ✔ 用途
// 自动从 cookie 读取 XSRF token，并注入到请求 header。
// 默认：
// Cookie 名：XSRF-TOKEN
// Header 名：X-XSRF-TOKEN
// ✔ 适用场景
// 后端使用 cookie-based session
// 后端启用 XSRF 防护（如 Spring Security、Django、Laravel）


// 4. withRequestsMadeViaParent() — 继承父 HttpClient 配置
// ✔ 用途
// 当你在 子模块 或 子组件 中再次调用 provideHttpClient() 时：
// 默认会创建一个新的 HttpClient 实例
// 不会继承父级的拦截器、配置
// withRequestsMadeViaParent() 让子 HttpClient 继承父级配置。

// ✔ 适用场景
// 在 feature module 中使用 provideHttpClient()
// 在组件中使用 provideHttpClient()
// 想让子模块继续使用全局拦截器

// ✔ Demo（feature module）
// ts
// // features/customers/customers.config.ts
// export const customersConfig: ApplicationConfig = {
//   providers: [
//     provideHttpClient(
//       withRequestsMadeViaParent()
//     ),
//   ],
// };
// 效果：
// 子模块 HttpClient 会继承 app.config.ts 中的拦截器
// 不会重复注册拦截器
// 不会创建新的 HttpClient 管道