export type Theme = 'light' | 'dark' | 'system';

export interface UserPrefs {
  language: string;          // 用户语言
  layoutMode: 'full' | 'mini'; // 布局模式
}

export interface UIState {
  sidebarCollapsed: boolean; // UI 状态
  lastVisitedPage: string;   // 最近访问页面
}

export interface Flags {
  onboardingDone: boolean;   // on boarding 

  // key = bannerId, value = true
  dismissedBanners: Record<string, boolean>;

  // optional: dismissed tooltips
  dismissedTooltips?: Record<string, boolean>;

  // optional: dismissed modals
  dismissedModals?: Record<string, boolean>;

  // any “one‑time UI hints”
}

export interface LocalState {
  theme: Theme;
  token?: string;            // 如果不敏感
  prefs: UserPrefs;
  ui: UIState;
  flags: Flags;
}

export interface ThemePrefs {
  theme: 'light' | 'dark' | 'system';
  autoTheme: boolean;

  highContrast: boolean;
  colorBlindMode: boolean;

  density: 'compact' | 'normal' | 'comfortable';
  fontSize: 'small' | 'medium' | 'large';
  reduceMotion: boolean;

  sidebarMode: 'expanded' | 'collapsed' | 'floating';
  borderRadius: number;
  cardShadow: 'none' | 'light' | 'heavy';

  chartTheme: 'light' | 'dark';

// 你不会写：
 
// state = signal<LocalState>(...)
// 因为那样会导致：
// 每次更新一个字段都要更新整个对象
// Signals 会频繁触发
// 性能差
// 不可维护
// 不符合企业级架构