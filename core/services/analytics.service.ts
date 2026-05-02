import { Injectable } from '@angular/core';

// Analytics Service
// 这个服务负责处理应用中的分析和跟踪功能，例如用户行为分析、事件跟踪等。
// 你可以在应用中定义一些分析事件，例如 "buttonClicked"，来跟踪用户的行为，这样你就可以收集用户的使用数据来优化应用的体验。
// 例如，在组件中，你可以通过 AnalyticsService.track('buttonClicked', { buttonId: 'submit' }) 来跟踪某个按钮的点击事件，并传递一些相关的数据，例如按钮的 ID、用户的信息等。
// 你也可以在应用启动时（例如在 AppComponent 的 ngOnInit 中）调用 ApiService 来加载一些初始数据，例如用户信息、全局配置等，来初始化应用的状态，包括分析和跟踪的状态。
// 分析和跟踪状态    
// key	纯中文含义
// track	一个方法，用于跟踪分析事件，接受一个事件名称和可选的数据对象作为参数，通常会    
// 将事件和数据发送到分析平台或者日志系统中，供后续分析和优化使用。
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  track(event: string, data?: any) {
    console.log('[Analytics]', event, data);
  }
}
