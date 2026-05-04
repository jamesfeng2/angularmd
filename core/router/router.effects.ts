// core/router/router.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { concatLatestFrom } from '@ngrx/operators';
import { map, tap } from 'rxjs';
import { selectRouteData } from './router.selectors.ngrx'; // 如果你用 NgRx RouterStore

// （全局副作用：标题、埋点、权限跳转）

@Injectable()
export class RouterEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly titleService = inject(Title);

  // 权限跳转（例如：未登录 → login）
checkAuth$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      tap(() => {
        if (!this.authStore.accessToken()) {
          this.router.navigate(['/login']);
        }
      })
    ),
  { dispatch: false }
);


  // 示例：根据 route data.title 更新页面标题
  updateTitle$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(routerNavigatedAction),
        concatLatestFrom(() => this.store.select(selectRouteData)),
        map(([, data]) => data['title'] as string | undefined),
        tap((title) => {
          if (title) this.titleService.setTitle(`App - ${title}`);
        })
      ),
    { dispatch: false }
  );
}
