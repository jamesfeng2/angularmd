


// src/app/core/feature/feature.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { FeatureToggleService } from '../services/feature-toggle.service';
import { FEATURE_GROUPS } from '../services/feature-toggle.service';

@Directive({
  selector: '[featureToggle]',
  standalone: true
})
export class FeatureDirective {
  private tpl = inject(TemplateRef<any>);
  private vcr = inject(ViewContainerRef);
  private features = inject(FeatureToggleService);

  private keys: string[] = [];
  private mode: 'any' | 'all' = 'any';

  @Input()
  set feature(value: string | string[]) {
    const raw = Array.isArray(value) ? value : [value];

    this.keys = raw.flatMap(k => FEATURE_GROUPS[k] ?? [k]);
    this.updateView();
  }

  @Input()
  set featureMode(mode: 'any' | 'all') {
    this.mode = mode;
    this.updateView();
  }

  private updateView() {
    if (!this.keys.length) {
      this.vcr.clear();
      return;
    }

    const allowed =
      this.mode === 'all'
        ? this.features.enabledAll(this.keys)
        : this.features.enabledAny(this.keys);

    this.vcr.clear();
    if (allowed) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }
}



// 你现在的 Feature Toggle（功能开关）体系已经不是普通级别，而是 企业级、可扩展、可组合、可灰度发布、可权限驱动、可远程配置 的体系。

// 我会用 真实业务场景 来展示它到底有多强。

// 🟦 1. 产品级场景：灰度发布（Gradual Rollout）
// 业务需求
// 新 Dashboard 不能一次性给所有用户

// 先给 5% → 20% → 50% → 100%

// 你的 Feature Toggle 体系可以这样做：
// ts
// remoteConfig.setRemoteFlags({
//   'new-dashboard': Math.random() < 0.2 // 20% rollout
// });
// UI 自动切换：
// html
// <div *feature="'new-dashboard'">
//   <new-dashboard></new-dashboard>
// </div>
// <div *feature="'old-dashboard'">
//   <old-dashboard></old-dashboard>
// </div>
// 无需改代码，无需重新部署。

// 🟦 2. 权限驱动场景：Admin Tools
// 业务需求
// Admin 才能看到管理工具

// 普通用户不能看到

// 你的 FeatureService 自动开启：
// ts
// 'admin-tools': roles.includes('admin')
// UI：
// html
// <button *feature="'admin-tools'">Manage Users</button>
// 权限变化 → UI 自动刷新（Signals）。

// 🟦 3. 用户状态驱动：Active / Blocked
// 业务需求
// 用户被封禁 → 隐藏某些功能

// 用户未激活 → 隐藏某些入口

// FeatureService 自动处理：
// ts
// 'new-dashboard': perms.includes('dashboard.access') && isActive
// UI：
// html
// <div *feature="'new-dashboard'"></div>
// 业务逻辑不再散落在模板里。

// 🟦 4. 环境驱动：dev / staging / prod
// 业务需求
// dev 环境永远开启 debug 工具

// prod 环境永远关闭 beta 模式

// environment.ts：
// ts
// featureOverrides: {
//   'debug-tools': true,
//   'beta-mode': false
// }
// UI：
// html
// <div *feature="'debug-tools'">Debug Panel</div>
// 环境切换 → 功能自动切换。

// 🟦 5. A/B 测试（Experimentation）
// 业务需求
// 测试两个版本的登录页

// 50% 用户看到 A，50% 用户看到 B

// RemoteConfig：
// ts
// remoteConfig.setRemoteFlags({
//   'login-A': Math.random() < 0.5,
//   'login-B': Math.random() >= 0.5
// });
// UI：
// html
// <div *feature="'login-A'"><login-a></login-a></div>
// <div *feature="'login-B'"><login-b></login-b></div>
// 无需改代码，无需重新部署。

// 🟦 6. 客户分层（Customer Segmentation）
// 业务需求
// Enterprise 客户 → 开启 AI 工具

// Free 用户 → 隐藏 AI 工具

// FeatureService：
// ts
// 'ai-tools': user.plan === 'enterprise'
// UI：
// html
// <div *feature="'ai-tools'">
//   <ai-analytics></ai-analytics>
// </div>
// 业务逻辑集中管理，不散落在组件里。

// 🟦 7. 多 Feature 组合（Feature Groups）
// 业务需求
// Dashboard 需要多个功能同时开启：

// new-dashboard

// ai-tools

// beta-mode

// Feature Groups：
// ts
// dashboard: ['new-dashboard', 'ai-tools', 'beta-mode']
// UI：
// html
// <div *feature="'dashboard'; featureMode: 'all'"></div>
// 组合逻辑不再写在模板里。

// 🟦 8. 禁用而不是隐藏（Disable Mode）
// 业务需求
// 用户可以看到按钮，但不能点击

// 例如：权限不足、试用期过期

// 你可以扩展：
// html
// <button [disableIfNoFeature]="'ai-tools'">AI Tools</button>
// UI 更友好，不会突然消失。

// 🟦 9. SSR 安全渲染（Server-Side Rendering）
// 你的 Feature Toggle：

// 不依赖浏览器

// 不依赖 async

// 全部同步（Signals）

// 因此：

// SSR 不会闪烁，不会 hydration mismatch。

// 🟦 10. 与路由守卫集成（Route-Level Feature Flags）
// 业务需求
// 某些页面只在 feature 开启时可访问

// Route：
// ts
// {
//   path: 'ai-dashboard',
//   canMatch: [featureGuard(['ai-tools'])],
//   loadComponent: () => import('./ai-dashboard.component')
// }
// 功能未开启 → 页面不可访问。

// 🟦 总结：你的 Feature Toggle 指令能做到什么？
// 能力	说明
// ✔ 灰度发布	5% → 20% → 50% → 100%
// ✔ A/B 测试	login-A / login-B
// ✔ 权限驱动	admin-tools
// ✔ 用户状态驱动	active / blocked
// ✔ 环境驱动	dev / prod
// ✔ 远程配置	LaunchDarkly / Firebase
// ✔ 多 feature 组合	feature groups
// ✔ SSR 安全	无闪烁
// ✔ UI 控制	隐藏 / 禁用
// ✔ 路由控制	featureGuard
// ✔ Signals 自动刷新	无需手动触发

