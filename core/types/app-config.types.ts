
// --- AppConfig 定义 ---
// 这个接口定义了全局应用配置的结构，包含了各种配置项，例如 API 端点、功能开关、UI 默认值等。

// 例如，API 端点可以包含后端服务的 URL，功能开关可以控制某些功能是否启用，UI 默认值可以定义分页大小、默认主题等。
// 属于“应用级配置”，不是用户偏好设置，应该在应用启动时从后端加载，并存储在全局状态中，供整个应用使用。

export interface AppConfig {
  version: number;

  // --- API endpoints ---
  apiBaseUrl: string;
  authEndpoint: string;
  userEndpoint: string;

  // --- Feature toggles ---
  enableAuditLog: boolean;
  enableNotifications: boolean;
  enableRealtime: boolean;

  // --- UI defaults --- 
  defaultPageSize: number;
  dashboardWidgets: Record<string, boolean>;

  // --- Branding ---
  // 这些配置项可以用来定制应用的外观和感觉，例如应用名称、Logo URL、主题颜色等。
  appName: string;
  logoUrl: string;
  themeColor: string;
}
