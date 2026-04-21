

Modal + Button 的最佳实践总结
✔ 按钮负责交互
- loading

- disabled

- ripple

- variant/size

✔ Modal 负责容器
- open/close

- backdrop

- ESC

- loading 时锁定

✔ 父组件负责业务逻辑
- open state

- loading state

- API 调用

- 表单提交

✔ Shared UI 永远不包含业务逻辑
AppButton 无业务

AppModal 无业务

父组件控制业务

这是你 monorepo 的 DDD + Shared UI 最佳组合方式。