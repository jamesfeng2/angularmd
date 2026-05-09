
// src/app/core/feature/remote-config.service.ts
import { Injectable, signal } from '@angular/core';

type FeatureFlags = Record<string, boolean>;

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
