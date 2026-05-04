// core/router/router.store.ts
import { signalStore, withState, withMethods } from '@ngrx/signals';
import { inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';

export interface RouterStateModel {
  url: string;
  params: Record<string, any>;
  queryParams: Record<string, any>;
  data: Record<string, any>;
}

const initialState: RouterStateModel = {
  url: '/',
  params: {},
  queryParams: {},
  data: {},
};

// （同步路由状态：params/query/data）

export const RouterStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withMethods((store) => {
    const router = inject(Router);
    const rootRoute = inject(ActivatedRoute);

    router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        let route = rootRoute;
        while (route.firstChild) route = route.firstChild;

        store.url.set(router.url);
        store.params.set(route.snapshot.params);
        store.queryParams.set(route.snapshot.queryParams);
        store.data.set(route.snapshot.data);
      });

    return {};
  })
);
