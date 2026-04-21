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

 

## Angular 里一共有 5 种方式可以阻止默认行为（preventDefault）in HTML or TS
```
而且每一种都有不同的使用场景。
我会按从“最常用”到“最底层”排序，让你一眼就能选对。

🟦 方式 1：在模板里直接用 $event.preventDefault()（最常用）
html
<button (click)="onClick($event); $event.preventDefault()">
  Save
</button>
或更简洁：

html
<button (click)="$event.preventDefault()">
适用场景
简单阻止默认行为

不需要复杂逻辑

不需要在 TS 里处理

🟦 方式 2：在组件方法里调用 event.preventDefault()（最标准）
ts
onClick(event: MouseEvent) {
  event.preventDefault();
}
 
适用场景
组件内部逻辑
 
Shared UI 组件（AppButton）

需要同时阻止冒泡、阻止默认行为

🟦 方式 3：使用 @HostListener 捕获事件并阻止默认行为（企业级组件常用）
ts
@HostListener('click', ['$event'])
onHostClick(event: MouseEvent) {
  event.preventDefault();
}
适用场景
自定义组件（AppButton、AppModal）

指令（Directive）

不想在模板写 (click)

想封装内部行为（ripple、loading、disabled）

这是你 AppButton 用的方式。

🟦 方式 4：在模板里使用 Angular 的 $event 修饰符（最简洁）
Angular 支持：

html
<form (submit)="onSubmit(); $event.preventDefault()">
但 Angular 没有 Vue 那种 .prevent 修饰符，
所以必须写 $event.preventDefault()。

适用场景
表单 submit

链接 click

简单阻止默认行为

🟦 方式 5：使用 return false（老方法，不推荐，但仍然有效）
html
<button (click)="onClick(); return false">
Angular 会把 return false 视为：

event.preventDefault()

event.stopPropagation()

适用场景
兼容旧代码

快速阻止所有行为

但不推荐在新项目使用。

🟦 方式 6：在指令中使用 Renderer2（底层方式）
ts
constructor(private renderer: Renderer2, private el: ElementRef) {
  this.renderer.listen(this.el.nativeElement, 'click', (event) => {
    event.preventDefault();
  });
}
适用场景
自定义指令

需要在运行时动态绑定事件

需要兼容 SSR / WebWorker

🟦 方式 7：使用事件捕获阶段阻止默认行为（高级场景）
ts
@HostListener('document:click', ['$event'])
onDocClick(event: MouseEvent) {
  if (shouldBlock(event)) {
    event.preventDefault();
  }
}
适用场景
全局事件控制

用于 Modal、Dropdown、Overlay 等全局交互

监听 document 级别事件 但它们不是默认捕获阶段 
监听整个网页的事件，然后组件内部决定要不要处理

Angular 的 HostListener 默认监听的是冒泡阶段（bubble phase）

onEsc() 用的是 @HostListener('document:keydown.escape')，
onDocClick() 用 @HostListener('document:click')

默认情况下：

浏览器事件顺序是：
捕获 → 目标 → 冒泡

Angular 默认监听 冒泡阶段。

但你可以让 Angular 监听 捕获阶段：

ts
@HostListener('document:click.capture', ['$event'])
onDocClick(event: MouseEvent) {
  event.preventDefault();
}
注意 .capture：

.capture = 捕获阶段

.passive = 被动监听

.once = 只触发一次

这是 Angular 的高级 HostListener 特性。

```


## 🟦 HostListener 的 7 大高级用法（完整版）
```

1) 监听 DOM 事件（基础但最常用）
ts
@HostListener('click', ['$event'])
onClick(event: MouseEvent) { ... }
监听组件本身的事件

$event 是原生事件对象

AppButton ripple 就是用这个

2) 监听 document 事件（全局事件）
ts
@HostListener('document:keydown.escape')
onEsc() { ... }
不管焦点在哪

ESC 一按就触发

Modal、Dropdown、Overlay 必备

3) 监听 window 事件（窗口级别）
ts
@HostListener('window:resize', ['$event'])
onResize(event: UIEvent) { ... }
响应式布局

监听滚动、大小变化

图表、布局组件常用

4) 使用事件修饰符（capture / passive / once）——真正高级
Angular 支持：

✔ 捕获阶段（事件最早触发）
ts
@HostListener('document:click.capture', ['$event'])
onDocClick(event: MouseEvent) { ... }
用途：

Modal loading 时锁定全局点击

阻止外部库事件

阻止所有点击（安全模式）

✔ passive（告诉浏览器“我不会阻止默认行为”）
ts
@HostListener('window:scroll.passive', ['$event'])
onScroll(event: Event) { ... }
用途：

性能优化（scroll/touch）

避免浏览器警告

✔ once（只触发一次）
ts
@HostListener('document:click.once', ['$event'])
onFirstClick(event: MouseEvent) { ... }
用途：

第一次点击触发某个逻辑

新手引导（onboarding）

只监听一次的事件

5) 同时监听多个事件（多 HostListener）
ts
@HostListener('window:resize')
@HostListener('window:orientationchange')
onLayoutChange() { ... }
用途：

移动端布局

图表自适应

Modal/Drawer 自适应

6) 监听自定义事件（组件内部 dispatchEvent）
ts
@HostListener('myCustomEvent', ['$event'])
onCustom(e: CustomEvent) { ... }
配合：

ts
this.el.nativeElement.dispatchEvent(new CustomEvent('myCustomEvent'));
用途：

自定义组件内部通信

指令与组件交互

7) 阻止默认行为 + 阻止冒泡（企业级组件必备）
AppButton 的黄金写法：

ts
@HostListener('click', ['$event'])
onClick(event: MouseEvent) {
  if (this.disabled || this.loading) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  this.createRipple(event);
  this.clicked.emit(event);
}
用途：

防止重复提交

防止 loading 时点击

ripple 不被打断

业务逻辑安全

🟦 HostListener 所有语法（完整版表格）
写法	说明	场景
'click'	监听组件自身事件	AppButton
'document:click'	监听全局事件	Modal、Dropdown
'window:resize'	监听窗口事件	响应式布局
'document:click.capture'	捕获阶段	全局点击锁定
'window:scroll.passive'	被动监听	性能优化
'document:keydown.escape'	ESC 关闭	Modal
'document:click.once'	只触发一次	Onboarding
'myEvent'	自定义事件	指令/组件通信


```