import { Injectable, signal, effect } from '@angular/core';
import { UIState, UserPrefs } from '../../shared/types/local-state.types';
import { loadFromLocal, saveToLocal } from '../../shared/utils/storage';


@Injectable({ providedIn: 'root' })
export class UIStateService {

  private readonly VERSION = 1;

  ui = signal<UIState>(
    loadFromLocal<UIState>('ui', {
      sidebarCollapsed: false,
      lastVisitedPage: '/'
    }, {
      version: this.VERSION,
      mergeDefault: true
    })
  );

  constructor() {
    effect(() => saveToLocal('ui', this.ui(), this.VERSION));
  }

  setSidebarCollapsed(v: boolean) {
    this.ui.update(ui => ({ ...ui, sidebarCollapsed: v }));
  }

  setLastVisitedPage(url: string) {
    this.ui.update(ui => ({ ...ui, lastVisitedPage: url }));
  }
}
