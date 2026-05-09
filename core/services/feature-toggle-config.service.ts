
// src/app/core/feature/remote-config.service.ts
import { Injectable, signal } from '@angular/core';

type FeatureFlags = Record<string, boolean>;

// 它是整个 Feature Flag 系统的“远程输入层”，负责接收来自 LaunchDarkly / Firebase Remote Config / 后端接口 等等的配置数据，并将它们转换成统一的 FeatureFlags 格式，供 FeatureToggleService 使用。

@Injectable({ providedIn: 'root' })
export class FeatureToggleConfigService {
  private _flags = signal<FeatureFlags>({});

  readonly flags = this._flags.asReadonly();

  setRemoteFlags(batch: FeatureFlags) {
    this._flags.set(batch);
  }

  updateFlag(key: string, value: boolean) {
    this._flags.update(f => ({ ...f, [key]: value }));
  }
}
