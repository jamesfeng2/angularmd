
import { Routes } from '@angular/router';

export const SHELL_ROUTES: Routes = [
    {
    path: '',
    loadChildren: () => import('./shell/shell.routes').then(m => m.SHELL_ROUTES),
  },
];


// main.ts
//    ↓
// bootstrapApplication(AppComponent, appConfig)
//    ↓
// app.config.ts
//    ↓
// APP_INITIALIZER → shell.init()
//    ↓
// AppComponent 渲染
//    ↓
// <router-outlet>
//    ↓
// ShellComponent 渲染
//    ↓
// <router-outlet>
//    ↓
// Feature Modules 渲染

// init() 已在 APP_INITIALIZER 调用
// AppComponent 不需要也不能调用 init()
// ShellComponent 也不能调用 init()
// Feature 模块更不能调用 init()
