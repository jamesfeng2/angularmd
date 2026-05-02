import { Injectable, signal } from '@angular/core';

// Breakpoint Service
// 这个服务负责存储和管理全局的断点状态，供整个应用使用。
// 你可以在应用中定义一些断点状态，例如 "isMobile"，来控制某些功能或者 UI 元素是否适配移动端，这样你就可以在不修改代码的情况下，通过修改断点状态的值来适配不同的设备。
// 例如，在组件中，你可以通过 BreakpointService.isMobile() 来检查当前是否处于移动端模式，然后根据结果来决定是否显示某个 UI 元素或者执行某段代码。
// 你也可以在应用启动时（例如在 AppComponent 的 ngOnInit 中）调用 ApiService 来加载一些初始数据，例如用户信息、全局配置等，来初始化应用的状态，包括断点状态的状态。
// 断点状态    
// key	纯中文含义
// isMobile	一个布尔值，表示当前是否处于移动端模式，这些信息通常在应用启动时通过检测用户的设备类型或者窗口大小来设置，并存储在全局状态中，供整个应用使用。
// 你可以把它放在 ShellService 里，但为了更清晰的职责分离，建议放在单独的 BreakpointService。
// 这个服务的职责是管理全局断点状态，保持单一职责原则，避免把它和认证、用户信息、UI 状态等其他状态混在一起，保持代码的清晰和可维护性。    
// 你可以根据实际需求扩展 BreakpointService 的功能，例如添加更多的断点状态、断点日志记录、断点通知等功能，但核心职责是管理全局断点状态，供整个应用使用。
@Injectable({ providedIn: 'root' })
export class BreakpointService {
  isMobile = signal(false);

  setMobile(v: boolean) {
    this.isMobile.set(v);
  }
}
