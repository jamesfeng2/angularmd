# angularmd

## @HostListener

```
为什么要用 @HostListener，而不是 HTML 的 (click)？
✔ 1) 组件内部行为（不暴露给外部）
如果你不想让父组件看到 click，只想组件内部处理：

ts
@HostListener('click')
onClick() { ... }
✔ 2) 自定义组件行为（比如 ripple 效果）
AppButton 就是这样：

ts
@HostListener('click', ['$event'])
createRipple(event: MouseEvent) { ... }
$event 就是原生 DOM 的 MouseEvent
这样 ripple 效果自动触发，不需要在 HTML 写 (click)="..."

✔ 3) 指令（Directive）必须用 HostListener
比如：

ts
@Directive({ selector: '[appAutoFocus]' })
export class AutoFocusDirective {
  @HostListener('click')
  onClick() {
    console.log('元素被点击');
  }
}
指令没有 template，所以必须用 HostListener。

🟦 真实复杂场景（AppButton ripple 效果）
你之前的 AppButton ripple 就是这样：

ts
@HostListener('click', ['$event'])
onClick(event: MouseEvent) {
  if (this.disabled || this.loading) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  this.createRipple(event); //do ripple first 因为 ripple 是 视觉反馈，clicked 是 业务事件
  this.clicked.emit(event);
}
解释：

用户点击按钮

HostListener 捕获 click

如果 disabled/loading → 阻止点击

否则 → 先做 ripple，再 emit clicked

这是 企业级按钮组件的标准写法。

因为 HTML 的 disabled 只会阻止原生 click，但不会阻止 Angular 的事件冒泡。
所以 loading 时必须手动阻止点击，否则会出现：

用户疯狂点击

重复提交

重复 API 调用

重复触发事件

ripple 效果乱飞

UI 卡顿

按钮被禁用或加载中 → 不让点（防止乱点）
按钮正常 → 先给用户视觉反馈（ripple）
再执行业务逻辑（emit clicked）
这样按钮才稳、好用、不会出 bug

```