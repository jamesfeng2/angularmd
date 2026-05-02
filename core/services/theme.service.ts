import { Injectable, signal, effect } from '@angular/core';
import { Theme, UIState, UserPrefs } from '../../shared/types/local-state.types';
import { loadFromLocal, saveToLocal } from '../../shared/utils/storage';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly VERSION = 1;

  theme = signal<Theme>(
    loadFromLocal<Theme>('theme', 'system', {
      version: this.VERSION
    })
  );

  constructor() {
    effect(() => saveToLocal('theme', this.theme(), this.VERSION));
  }

  setTheme(t: Theme) {
    this.theme.set(t);
  }
}
