// features/admin/admin.store.ts
import { signalStore, withState, withMethods } from '@ngrx/signals';
import { inject, effect } from '@angular/core';
import { AdminApi } from './admin.api';
import { injectRouteData } from '../../core/router/router.selectors';
import { tapResponse, mapResponse } from '@ngrx/operators';

export interface AdminState {
  list: { id: string; role: string }[];
  loading: boolean;
}

const initialState: AdminState = {
  list: [],
  loading: false,
};

export const AdminStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withMethods((store) => {
    const api = inject(AdminApi);
    const routeData = injectRouteData();

    // 示例：当某个 route data 标记需要加载 admin 列表时才加载
    effect(() => {
      const shouldLoad = routeData().['loadAdmins'];
      if (!shouldLoad) return;

      store.loading.set(true);

      api
        .getAdmins()
        .pipe(
          mapResponse((dtos) =>
            dtos.map((d) => ({ id: d.id, role: d.role }))
          ),
          tapResponse({
            next: (list) => {
              store.list.set(list);
              store.loading.set(false);
            },
            error: () => {
              store.list.set([]);
              store.loading.set(false);
            },
          })
        )
        .subscribe();
    });

    return {};
  })
);
