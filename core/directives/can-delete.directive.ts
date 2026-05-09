
import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';


//usage <button *canDelete="user.canDelete">Delete</button>
//replace <div *ngIf="isAdmin && isActive && !isBlocked"

@Directive({
  selector: '[canDelete]'
})
export class CanDeleteDirective {
  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef
  ) {}
  @Input() set canDelete(val: boolean) {
    this.vcr.clear();
    if (val) this.vcr.createEmbeddedView(this.tpl);
  }
}

// 优点
// 简单

// 可用

// 逻辑清晰

// ❌ 缺点
// 只能处理 boolean

// 不能复用（只能叫 canDelete）

// 不能组合权限

// 不能从 AuthStore 自动读取权限

// 不能响应 Signals

// 不能统一管理权限点

// 模板仍然需要写 user.canDelete（业务逻辑泄漏）