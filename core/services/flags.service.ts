import { Injectable, signal, effect } from '@angular/core';
import { Flags } from '../../shared/types/local-state.types';
import { loadFromLocal, saveToLocal } from '../../shared/utils/storage';


@Injectable({ providedIn: 'root' })
export class FlagsService {

  private readonly VERSION = 1;

  flags = signal<Flags>(
    loadFromLocal<Flags>('flags', {
      onboardingDone: false,
      dismissedBanners: {},
      dismissedTooltips: {},
      dismissedModals: {},
    }, {
      version: this.VERSION,
      mergeDefault: true
    })
  );

  constructor() {
    effect(() => saveToLocal('flags', this.flags(), this.VERSION));
  }

  // --- Onboarding ---
  onboardingDone() {
    this.flags.update((f: Flags) => ({ ...f, onboardingDone: true }));
  }
}
