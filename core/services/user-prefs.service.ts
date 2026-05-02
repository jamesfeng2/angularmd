import { Injectable, signal, effect } from '@angular/core';
import { UserPrefs } from '../../shared/types/local-state.types';
import { loadFromLocal, saveToLocal } from '../../shared/utils/storage';
import { isUserPrefs, migrateUserPrefs } from '../../shared/utils/prefs-validators';

@Injectable({ providedIn: 'root' })
export class UserPrefsService {

  private readonly VERSION = 2;

  prefs = signal<UserPrefs>(
    loadFromLocal<UserPrefs>('prefs', {
      language: 'en',
      layoutMode: 'full'
    }, {
      version: this.VERSION,
      mergeDefault: true,
      validate: isUserPrefs,
      migrate: migrateUserPrefs
    })
  );

  constructor() {
    effect(() => {
      saveToLocal('prefs', this.prefs(), this.VERSION);
    });
  }

  // --- API: get ---
  get language() {
    return this.prefs().language;
  }

  get layoutMode() {
    return this.prefs().layoutMode;
  }

  // --- API: set ---
  setLanguage(lang: string) {
    this.prefs.update((p:UserPrefs) => ({ ...p, language: lang }));
  }

  setLayoutMode(mode: 'full' | 'mini') {
    this.prefs.update((p:UserPrefs) => ({ ...p, layoutMode: mode }));
  }

  // --- API: update ---
  updatePrefs(update: Partial<UserPrefs>) {
    this.prefs.update((p:UserPrefs) => ({ ...p, ...update }));
  }

  // --- API: reset ---
  reset() {
    this.prefs.set({
      language: 'en',
      layoutMode: 'full'
    });
  }
}
