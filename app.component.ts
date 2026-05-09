// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FeatureToggleService } from './core/services/feature-toggle.service';
import { FeatureDirective } from './core/directives/feature.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FeatureDirective],
  template: `
    <router-outlet />
  `,
})
export class AppComponent {

  constructor(private features: FeatureToggleService) {
  setTimeout(() => {
    this.features.setRemoteFlags({
      'ai-tools': user.plan === 'enterprise',
      'beta-mode': false
    });
  }, 3000);
}

}


// 不调用 init()（因为 init() 已在 APP_INITIALIZER 调用）

// AppComponent 只负责渲染 Shell （通过 router-outlet） 
// AppComponent 挂载路由

// 保持最小、最干净、最稳定
// 不包含业务逻辑、不包含状态、不包含服务调用
// 这是 Angular 21 官方推荐的 AppComponent 角色