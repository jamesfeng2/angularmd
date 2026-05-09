import { Injectable, signal } from '@angular/core';
import { AppConfig } from '../types/app-config.types';
import { DEFAULT_APP_CONFIG } from '../auth/config/default-app-config';
import { idbGet, idbSet } from '../../shared/utils/db';

// 全局应用配置（Global App Config）
// 这些配置通常在应用启动时从后端加载，并存储在全局状态中，供整个应用使用。
// 你可以把它放在 ShellService 里，但为了更清晰的职责分离，建议放在单独的 AppConfigService。

// 你可以根据实际需求定义 AppConfig 的类型，这里用 any 作为示例。
// 例如：
// interface AppConfig {
//   apiBaseUrl: string;
//   featureFlags: { [key: string]: boolean };
//   // UI 默认值
//   // 品牌信息
// }
// 你可以在应用启动时加载配置（例如在 AppComponent 的 ngOnInit 中）调用 AppConfigService.load()
// 例如：
// this.appConfigService.load({
//   apiBaseUrl: 'https://api.example.com',
//   featureFlags: { newFeature: true }
// });
// AppConfigService 还可以提供一些辅助方法来获取特定的配置项，例如 getApiBaseUrl() 或 isFeatureEnabled(featureName: string) 等，方便其他组件和服务使用。
// 当然，这些方法也可以直接在组件或服务中通过 this.appConfigService.config() 来访问配置对象。
// 你可以根据实际需求扩展 AppConfigService 的功能，例如添加配置更新、监听配置变化等功能。
// 这个服务的职责是管理全局应用配置，保持单一职责原则，避免把它和认证、用户信息、UI 状态等其他状态混在一起，保持代码的清晰和可维护性。
// 你可以根据实际需求调整 AppConfigService 的实现，例如添加错误处理、加载状态等功能，但核心职责是管理全局应用配置。
// 
@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly KEY = 'appConfig';
 
  appConfig = signal<AppConfig>(DEFAULT_APP_CONFIG);

  constructor() {
    this.restoreFromIndexedDB();
  }

  private async restoreFromIndexedDB() {
    const config = await idbGet<AppConfig>(this.KEY);
    if (config) {
      this.appConfig.set(config);
    }
  }

  private async persistToIndexedDB() {
    await idbSet(this.KEY, this.appConfig);
  }

  async load(config: AppConfig) {
    this.appConfig.set(config);
    await this.persistToIndexedDB();
  } 


  update(partial: Partial<AppConfig>) {
    this.appConfig.update((cfg:AppConfig) => ({ ...cfg, ...partial }));
    this.persistToIndexedDB();
  }

  // 你也可以添加一些辅助方法来获取特定的配置项，例如：
  get apiBaseUrl() {
    return this.appConfig().apiBaseUrl;
  }

  isFeatureEnabled(featureName: string): boolean {
    return this.appConfig().featureFlags?.[featureName] ?? false;
  }   



}
