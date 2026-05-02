import { Injectable } from '@angular/core';

// Logger Service
// 这个服务负责处理应用中的日志功能，例如记录调试信息、错误信息等。
// 你可以在应用中定义一些日志方法，例如 log、warn、error，来记录不同级别的日志信息，这样你就可以在开发和调试过程中更好地了解应用的运行状态和问题所在。
// 例如，在组件中，你可以通过 LoggerService.log('Component initialized') 来记录组件初始化的信息，或者通过 LoggerService.error('An error occurred', error) 来记录错误信息，并传递相关的错误对象等数据。
// 你也可以在应用启动时（例如在 AppComponent 的 ngOnInit 中）调用 ApiService 来加载一些初始数据，例如用户信息、全局配置等，来初始化应用的状态，包括日志的状态。
// 日志状态    
// key	纯中文含义
// log	一个方法，用于记录普通的日志信息，接受任意数量的参数，并将它们输出到控制台中，通常会在开发和调试过程中使用来了解应用的运行状态和调试信息。
// warn	一个方法，用于记录警告级别的日志信息，接受任意数量的参数，并将它们输出到控制台中，通常会在开发和调试过程中使用来记录可能存在的问题或者需要注意的信息。
// error	一个方法，用于记录错误级别的日志信息，接受任意数量的参数，并将它们输出到控制台中，通常会在开发和调试过程中使用来记录错误信息，并传递相关的错误对象等数据。
// 你可以把它放在 ShellService 里，但为了更清晰的职责分离，建议放在单独的 LoggerService。
// 这个服务的职责是管理全局日志状态，保持单一职责原则，避免把它和认证、用户信息、UI 状态等其他状态混在一起，保持代码的清晰和可维护性。    
// 你可以根据实际需求扩展 LoggerService 的功能，例如添加日志级别控制、日志输出格式化、日志存储等功能，但核心职责是管理全局日志状态，供整个应用使用。
@Injectable({ providedIn: 'root' })
export class LoggerService {
  log(...args: any[]) {
    console.log('[LOG]', ...args);
  }

  warn(...args: any[]) {
    console.warn('[WARN]', ...args);
  }

  error(...args: any[]) {
    console.error('[ERROR]', ...args);
  }
}
