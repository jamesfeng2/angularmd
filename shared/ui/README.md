Shared UI 的核心原则（文档重点）
`如果父组件不传值，@Input() 就是 undefined。`
1) Shared UI = 可复用的纯展示组件
例如：

- Button

- Card

- Table

Modal

Input

FormField

Badge

Avatar

这些组件：

不包含业务逻辑

不依赖任何 domain 

不依赖任何 service

不访问 API

不包含状态（store/signal/RxJS）

它们只做一件事：

渲染 UI + 发出事件

2) Shared UI 必须是“通用的”
也就是说：

不属于 customers

不属于 orders

不属于 products

`不属于任何 domain`

它们是“跨 domain 通用的 UI 积木”。

3) Shared UI 不能包含业务字段
❌ 错误示例：

Code
`<customer-card [customer]="customer"></customer-card>`
这种组件属于 customers domain，不能放 shared。

Shared UI 只能是：

Code
`<app-card>
<app-table>
<app-button>`
4) Shared UI 不能依赖 Data 层或 Feature 层
❌ 错误：

ts
constructor(private customerService: CustomerService) {}
❌ 错误：

ts
this.store.loadCustomers();
Shared UI 必须是：

- 无 service

- 无 store

- 无 API

- 无业务逻辑

5) Shared UI 必须是“可组合的”
例如：

- Table + Pagination

- Card + Header + Footer

- Modal + Content + Actions

Shared UI 的目标是：

让 Domain 的 UI 可以用这些积木拼装，而不是复制代码。

🧠 为什么 Shared UI 必须保持纯净？
文档背后的逻辑非常清晰：

1) Shared UI 是“基础设施层”
它应该像 Material UI、PrimeNG 那样：

通用

可复用

无业务

2) Shared UI 污染会导致整个架构崩坏
如果你把业务 UI 放进 shared：

所有 domain 都会依赖它

domain 边界会消失

依赖关系会变成意大利面

3) Shared UI 是 AI / 工具理解 UI 的关键
这个仓库的目标之一是：

让 AI 能自动理解 UI 结构并生成代码。

Shared UI 必须保持“纯净、可组合、可预测”。

📦 最终总结（你可以贴到团队规范）
Shared UI 只能包含纯展示组件。
Shared UI 不能包含业务逻辑、状态、API、domain 依赖。
Shared UI 必须是通用的、可复用的、可组合的 UI 积木。