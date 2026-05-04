
import { Injectable, inject } from '@angular/core';
import { computed, Signal, patchState, signalStore, withState,withComputed, withMethods,rxMethod } from '@anrx/signals';
import { tap,pipe, switchMap,tapResponse, } from 'rxjs';
import { User } from '../../../core/types/user.types';
import { AuthApi } from '../api/auth.api';

export type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

export const AuthStore = signalStore(
  withState<AuthState>({
    user: null as User | null,
    token: null as string | null,
    loading: false,
    error: null as string | null
  }),

  withComputed((user: Signal<User | null>) => ({
    isLoggedIn: computed(() => !!user()),
    isAdmin: computed(() => user()?.role === 'admin')
  })),

  withMethods((store: AuthState, api = inject(AuthApi)) => ({
    login: rxMethod<{ username: string; password: string }>(  // login(username, password)
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((credentials: { username: string; password: string }) =>  //解决用户连续点击登录按钮
          api.login(credentials).pipe(
            tapResponse({
              next: (user: User) =>
                patchState(store, {
                  user,
                  token: user.token,
                  error: null
                }),
              error: () =>
                patchState(store, { error: 'login failed' }),
              finalize: () =>
                patchState(store, { loading: false })
            })
          )
        )
      )
    ),

    logout() {
      patchState(store, {
        user: null,
        token: null
      });
    }
  }))
);