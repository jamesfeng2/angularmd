// core/router/router.selectors.ts
import { inject } from '@angular/core';
import { RouterStore } from './router.store';


// （从 RouterStore 取数据）

export function injectRouteParams() {
  const routerStore = inject(RouterStore);
  return routerStore.params;
}

export function injectRouteData() {
  const routerStore = inject(RouterStore);
  return routerStore.data;
}

export function injectRouteQueryParams() {
  const routerStore = inject(RouterStore);
  return routerStore.queryParams;
}
