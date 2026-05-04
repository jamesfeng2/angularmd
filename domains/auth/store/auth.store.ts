
import { Injectable, inject } from '@angular/core';
import { computed, withHooks, Signal, patchState, signalStore, withState,withComputed, withMethods,rxMethod } from '@ngrx/signals';
import { shareReplay, tap,pipe, switchMap, Observable, throwError } from 'rxjs';
import { User } from '../../../core/types/user.types';
import { AuthApi } from '../api/auth.api';
import { tapResponse } from '@ngrx/operators';


// AuthStore → 管 token
// Interceptor → refresh token
// Effect → 监听 token 变化
// WebSocketService → reconnect

// HTTP：每次请求 → 带最新 token ✅
// WebSocket：建立连接时 → 带一次 token ❌（之后不会自动更新）

export type AuthResponse = {
  token: string;
  refreshToken: string;
  user: User;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
};

export const AuthStore = signalStore(
  withState<AuthState>({
    user: null as User | null,
    token: null as string | null,
    refreshToken: null as string | null,
    loading: false,
    error: null as string | null
  }),

  withComputed((store) => ({
    const user = () => store.user(),
    isLoggedIn: computed(() => !!user()),
 //   isAdmin: computed(() => user()?.role === 'admin')  //role is single value
    isAdmin: computed(() => user()?.role?.includes('admin') ?? false),  // role is array of strings
    hasRole: (role: string) => computed(() => user()?.roles.includes(role) ?? false)
  })),

  withMethods((store, api = inject(AuthApi)) => {

    // ⭐ 关键：共享 refresh 流
    // 解决方案：在 store 里维护一个“正在进行的刷新流”，供 interceptor 复用
    // 只有当没有刷新在进行时才创建新的刷新流 → 避免重复刷新
    // 刷新完成后清空 → 允许下次刷新
    let refreshInFlight$: Observable<AuthResponse> | null = null;

    return {
    login: rxMethod<{ username: string; password: string }>(  // login(username, password)
      pipe(
        tap(() => patchState(store, { loading: true })),
        
        switchMap((credentials: { username: string; password: string }) =>  //解决用户连续点击登录按钮
          api.login(credentials).pipe(
            tapResponse({
              next: (res: AuthResponse) => {
                patchState(store, {
                  user: res.user,
                  token: res.token,
                  refreshToken: res.refreshToken,
                  error: null
                });

                localStorage.setItem('auth', JSON.stringify(res)); 
                // 🔁把 multi-tab sync 放到 store 初始化（withHooks）里
              },

              error: () =>
                patchState(store, { error: 'login failed' }),
              finalize: () =>
                patchState(store, { loading: false })
            })
          )
        )
      )
    ),

    // 🔄 token refresh
    refresh: rxMethod<void>(
      pipe(
        switchMap(() => {

          // ⭐ 核心：获取“共享的 refresh 流”
            const rt = store.refreshToken();  
            if (!rt) {
              // 没有 refresh token → 直接登出
              store.logout();
              return throwError(() => new Error('No refresh token'));
            }

             // 已经有刷新在进行 → 复用它 
            if (refreshInFlight$) return refreshInFlight$;

            // 创建新的刷新流 
            // 关键：所有订阅共享同一个结果 → 避免重复刷新  
            // 刷新完成后清空 → 允许下次刷新  
            return api.refresh(store.refreshToken()).pipe(
              tapResponse({
                next: (res) =>
                  patchState(store, {
                    token: res.token,
                    refreshToken: res.refreshToken,
                    user: res.user
                  });
                }
              )
            );
          })
      ),

    /** ⭐ 核心：获取“共享的 refresh 流” */
      getRefresh$(): Observable<AuthResponse> {
        const rt = store.refreshToken();
        if (!rt) {
          // 没有 refresh token → 直接登出
          store.logout();
          return throwError(() => new Error('No refresh token'));
        }

        // 已经有刷新在进行 → 复用它
        if (refreshInFlight$) return refreshInFlight$;

        // 创建新的刷新流
        refreshInFlight$ = store.api.refresh(rt).pipe(
          tap((res) => {
            patchState(store, {
              accessToken: res.accessToken,
              refreshToken: res.refreshToken,
              user: res.user,
            });
            localStorage.setItem('auth', JSON.stringify(res));
          }),
          finalize(() => {
            // ⭐ 完成后清空（允许下次刷新）
            refreshInFlight$ = null;
          }),
          shareReplay(1) // ⭐ 关键：所有订阅共享同一个结果
        );

        return refreshInFlight$;
      },
    

    logout() {
      patchState(store, {
        user: null,
        token: null,
        refreshToken: null
      });
    }
  }
}),

  withHooks({
  onInit(store: AuthState) {
    const handler = (event: StorageEvent) => {
      if (event.key === 'auth' && event.newValue) {
        const data = JSON.parse(event.newValue);

        patchState(store, {
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
          error: null
        });
      }

      // logout sync
      if (event.key === 'auth' && event.newValue === null) {
        patchState(store, {
          user: null,
          token: null,
          refreshToken: null
        });
      }
    };

    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('storage', handler); // cleanup
    };
  }
})
);