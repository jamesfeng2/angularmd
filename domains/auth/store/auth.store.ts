
import { Injectable, inject } from '@angular/core';
import { computed, withHooks, Signal, patchState, signalStore, withState,withComputed, withMethods,rxMethod } from '@ngrx/signals';
import { shareReplay,finalize, tap,pipe, switchMap, Observable, throwError } from 'rxjs';
import { User } from '../../../core/types/user.types';
import { AuthApi } from '../api/auth.api';
import { tapResponse } from '@ngrx/operators';
import { Router } from '@angular/router';


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
    { providedIn: 'root' },

  withState<AuthState>({
    user: null as User | null,
    token: null as string | null,
    refreshToken: null as string | null,
    loading: false,
    error: null as string | null
  }),

  withComputed((store: AuthState) => ({
    const user = () => store.user(),
    isLoggedIn: computed(() => !!user()),
 //   isAdmin: computed(() => user()?.role === 'admin')  //role is single value
    isAdmin: computed(() => user()?.role?.includes('admin') ?? false),  // role is array of strings
    hasRole: (role: string) => computed(() => user()?.roles.includes(role) ?? false),
    roles : computed(() => user()?.roles ?? []),
 
    accessToken: () => store.token(), 
    permissions: () => user()?.permissions ?? [],
  })),

  withMethods((store, api = inject(AuthApi)) => {
    const router = inject(Router);
    // // 应用启动时加载当前用户（也可以由 RouterEffects 触发）
    //     api
    //     .getCurrentUser()
    //     .pipe(
    //       tapResponse({
    //         next: (user) => {
    //           store.user.set(user);
    //           store.loading.set(false);
    //         },
    //         error: () => {
    //           store.user.set(null);
    //           store.loading.set(false);
    //         },
    //       })
    //     )
    //     .subscribe();
    // }),

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
                
                router.navigate(['/dashboard']);
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

    // 🔄 token refresh 当 token 过期 → 用 refreshToken 去换新的 token
    refresh: rxMethod<void>(
      pipe(
        switchMap(() => {

            const rt = store.refreshToken();   // 先拿 refresh token
            if (!rt) {
              store.logout();                             // 连 refresh token 都没了 → 直接登出
              return throwError(() => new Error('No refresh token'));
            }
            
            if (refreshInFlight$) return refreshInFlight$;   // 已经有刷新在进行 → 复用它 
     
            return api.refresh(rt).pipe(
              tapResponse({
                next: (res) => {
                  patchState(store, {
                    token: res.token,
                    refreshToken: res.refreshToken,
                    user: res.user
                  });
                }
              })
            );
          })
        )
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
              accessToken: res.Token,
              refreshToken: res.refreshToken,
              user: res.user,
            });
            localStorage.setItem('auth', JSON.stringify(res));
          }),
          finalize(() => {
            refreshInFlight$ = null;     // ⭐ 完成后清空（允许下次刷新）
          }),
          shareReplay(1)            // ⭐ 关键：所有订阅共享同一个结果
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

 
