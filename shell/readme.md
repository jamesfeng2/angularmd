

## shell service is App state, layout service is UI state

因为 LayoutService 是：

－　UI 状态中心
－　布局行为中心
－　与业务无关
－　与用户无关
－　与权限无关
－　与初始化无关

它只负责：

－　sidebar collapsed
－　responsive
－　drawer open
－　layout mode
－　layout animation

这些都是 UI 行为，不是 App 行为


UI 状态（layout）是：

－　不需要持久化
－　不需要跨页面共享
－　不需要在 APP_INITIALIZER 恢复
－　只影响布局组件


App 状态（shell）是：

－　需要持久化
－　需要跨页面共享
－　需要APP_INITIALIZER 恢复
－　影响整个应用

负责
－　user
－　theme
－　appConfig
－　menu
－　global loading
－　global error
