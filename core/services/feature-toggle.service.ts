


 
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { environmentDev } from '../env-config';
import { AuthStore } from '../auth/auth.store';

type FeatureFlags = Record<string, boolean>;

// 所有 feature 组合必须在 Feature Groups 
export const FEATURE_GROUPS: Record<string, string[]> = {
  dashboard: ['new-dashboard', 'ai-tools'],
  beta: ['beta-mode'],
  adminPanel: ['admin-tools', 'new-dashboard']
};

// usage: FeatureDirective.ts （支持单 / 多 key + any/all）

// 统一管理所有 feature flags

// 支持：
// enabled(key)
// enabledAny(keys[])
// enabledAll(keys[])
// setFlag(key, value)
// setFlags(batch)

//所有 feature 组合必须在 Feature Groups 中定义好，不能随意在代码里散落着写
//所有环境差异必须在 env.config.ts
//所有 UI 控制必须通过directive

@Injectable({ providedIn: 'root' })
export class FeatureToggleService {
  private auth = inject(AuthStore);

  private baseFlags = signal<FeatureFlags>({
    'new-dashboard': false,     // 业务需求 用户状态驱动 用户被封禁 → 隐藏某些功能
    'admin-tools': false,       // 权限驱动场景
    'beta-mode': false,         // A/B 测试 50% 用户看到 A，50% 用户看到 B
    'debug-tools': false,
    'ai-tools': false
  });

  private remoteFlags = signal<FeatureFlags>({}); // from LaunchDarkly / Firebase / etc.

  private envOverrides = signal<FeatureFlags>(environmentDev.featureOverrides);

  readonly flags = computed<FeatureFlags>(() => ({
    ...this.baseFlags(),
    ...this.remoteFlags(),
    ...this.envOverrides()
  }));

  constructor() {
    effect(() => {
      const roles = this.auth.roles();
      const perms = this.auth.permissions();
      const isActive = this.auth.isActive();

      this.baseFlags.update(f => ({
        ...f,
        'admin-tools': roles.includes('admin'),           // 权限变化 → UI 自动刷新（Signals）。
        'new-dashboard': perms.includes('dashboard.access') && isActive
        
      }));
    });
  }

  enabled(key: string) {
    return !!this.flags()[key];
  }

  enabledAny(keys: string[]) {
    return keys.some(k => this.enabled(k));
  }

  enabledAll(keys: string[]) {
    return keys.every(k => this.enabled(k));
  }

  setFlag(key: string, value: boolean) {
    this.baseFlags.update(f => ({ ...f, [key]: value }));
  }

  setRemoteFlags(batch: FeatureFlags) {
    this.remoteFlags.set(batch);
  }
}
