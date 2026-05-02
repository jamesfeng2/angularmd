

## 1. 用户状态（User State）
- 当前用户信息
- 用户角色
- 用户权限
- 用户偏好（语言、主题、布局）
- 用户 session 状态（是否登录、是否过期）

## 2. 全局 UI 状态（Global UI State）
- 全局 loading（页面级、应用级）
- 全局错误提示（toast/snackbar）
- 全局成功提示
- 全局 modal 状态
- 全局 overlay 状态
- 全局禁用状态（例如提交中）

## 3. 全局主题（Theme State）
- light / dark
- 动态主题切换
- 主题持久化（localStorage）
- 主题同步到 layout

## 4. 全局配置（AppConfig）
- API base URL
- feature flags
- 环境配置
- 动态配置（从后端加载）
- 字典（如国家、货币、状态码）

## 5. 全局导航状态（Navigation State）
- 当前菜单
- 动态菜单（基于权限）
- 当前激活菜单
- 面包屑（breadcrumbs）
- 路由守卫状态（auth / role）

## 6. 全局网络状态（Network State）
- 全局请求计数
- 全局请求失败统计
- 网络离线/在线状态
- 重试策略（可选）

## 7. 全局缓存（Global Cache）
- 字典缓存
- 配置缓存
- 用户偏好缓存
- 最近访问页面缓存

## 8. 全局事件（Global Events）
- 登录事件
- 登出事件
- 权限变更事件
- 主题变更事件
- 全局错误事件
- 全局刷新事件


## shell service is App state, layout service is Layout state, 
## ShellComponent = Layout UI

因为 LayoutService 是：

- UI 状态中心
- 布局行为中心
- 与业务无关
- 与用户无关
- 与权限无关
- 与初始化无关

它只负责：

- sidebar collapsed
- responsive
- drawer open
- layout mode
- layout animation

这些都是 UI 行为，不是 App 行为


UI 状态（layout）是：

- 不需要持久化
- 不需要跨页面共享
- 不需要在 APP_INITIALIZER 恢复
- 只影响布局组件


### App state 状态（shell）是：

- 需要持久化
- 需要跨页面共享
- 需要APP_INITIALIZER 恢复
- 影响整个应用

负责
- user
- theme 用户、主题、菜单、配置、loading
- appConfig
- menu
- global loading
- global error
