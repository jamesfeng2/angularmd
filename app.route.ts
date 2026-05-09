
import { Routes } from '@angular/router';
import { authActivateGuard, authMatchGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';
import { permissionGuard } from './core/auth/guards/permission.guard';

export const SHELL_ROUTES: Routes = [
    {
    path: '',
    loadChildren: () => import('./shell/shell.routes').then(m => m.SHELL_ROUTES),
  },
    {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.routes')
        .then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes')
        .then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'dashboard',
    // canMatch: [authMatchGuard],
    // canActivate: [authActivateGuard],
    // canMatch: [authMatchGuard, roleGuard(['admin'])],
    // canActivate: [authActivateGuard, roleGuard(['admin'])],
    canMatch: [authMatchGuard,roleGuard(['admin']), permissionGuard(['user.read', 'user.write', 'dashboard.access'])],
    canActivate: [authActivateGuard, permissionGuard(['user.read', 'user.write'])],
    loadComponent: () => import('./dashboard/dashboard.component')
  }

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
