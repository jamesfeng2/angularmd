import { Injectable, signal } from '@angular/core';

// Feature Flag Service
// 这个服务负责存储和管理全局的功能开关状态，供整个应用使用。
// 你可以在应用中定义一些功能开关，例如 "newFeatureEnabled"，来控制某些功能是否启用，这样你就可以在不修改代码的情况下，通过修改功能开关的值来启用或禁用某些功能。
// 例如，在组件中，你可以通过 FeatureFlagService.isEnabled('newFeatureEnabled') 来检查某个功能是否启用，然后根据结果来决定是否显示某个 UI 元素或者执行某段代码。
// 你也可以在应用启动时（例如在 AppComponent 的 ngOnInit 中）调用 ApiService 来加载一些初始数据，例如用户信息、全局配置等，来初始化应用的状态，包括功能开关的状态。
// 功能开关状态    
// key	纯中文含义
// flags	一个对象，包含所有功能开关的状态，例如 { newFeatureEnabled: true, anotherFeatureEnabled: false }，其中 key 是功能开关的名称，value 是一个布尔值，表示该功能是否启用。
// 这些信息通常在应用启动时从后端返回，并存储在全局状态中，供整个应用使用。
// 你可以把它放在 ShellService 里，但为了更清晰的职责分离，建议放在单独的 FeatureFlagService。
// 这个服务的职责是管理全局功能开关状态，保持单一职责原则，避免把它和认证、用户信息、UI 状态等其他状态混在一起，保持代码的清晰和可维护性。    
// 你可以根据实际需求扩展 FeatureFlagService 的功能，例如添加功能开关日志记录、功能开关通知等功能，但核心职责是管理全局功能开关状态，供整个应用使用。
// Feature Flag State   
// key	纯中文含义  
//

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  flags = signal<Record<string, boolean>>({});

  setFlag(key: string, value: boolean) {
    this.flags.update(f => ({ ...f, [key]: value }));
  }

  isEnabled(key: string) {
    return !!this.flags()[key];
  }
}
