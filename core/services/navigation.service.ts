
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Navigation Service
// 这个服务负责处理应用中的导航功能，例如页面跳转、返回上一页等。
// 你可以在组件中通过 NavigationService.go('/path') 来实现页面跳转，或者通过 NavigationService.back() 来返回上一页，这样你就可以在不直接依赖 Router 的情况下来处理导航逻辑，保持代码的清晰和可维护性。
// 你也可以在应用启动时（例如在 AppComponent 的 ngOnInit 中）调用 ApiService 来加载一些初始数据，例如用户信息、全局配置等，来初始化应用的状态，包括导航的状态。
// 导航状态    
// key	纯中文含义
// go	一个方法，用于实现页面跳转，接受一个 URL 字符串作为参数，通常会调用 Router.navigateByUrl(url) 来实现页面跳转。
// back	一个方法，用于返回上一页，通常会调用 history.back() 来实现返回上一页的功能。
// 你可以把它放在 ShellService 里，但为了更清晰的职责分离，建议放在单独的 NavigationService。
// 这个服务的职责是管理全局导航状态，保持单一职责原则，避免把它和认证、用户信息、UI 状态等其他状态混在一起，保持代码的清晰和可维护性。    
// 你可以根据实际需求扩展 NavigationService 的功能，例如添加导航日志记录、导航通知等功能，但核心职责是管理全局导航状态，供整个应用使用。
// Navigation State    
// key	纯中文含义
@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(private router: Router) {}

  go(url: string) {
    this.router.navigateByUrl(url);
  }

  back() {
    history.back();
  }
}
