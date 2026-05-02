import { Injectable, signal, effect } from '@angular/core';
import { UserPrefs } from '../../shared/types/local-state.types';
import { loadFromLocal, saveToLocal } from '../../shared/utils/storage';
import { isUserPrefs, migrateUserPrefs } from '../../shared/utils/prefs-validators';

@Injectable({ providedIn: 'root' })
export class UserPrefsService {

  private readonly VERSION = 2;

  prefs = signal<UserPrefs>(
    loadFromLocal<UserPrefs>('prefs', {
      language: 'en',
      layoutMode: 'full'
    }, {
      version: this.VERSION,
      mergeDefault: true,
      validate: isUserPrefs,
      migrate: migrateUserPrefs
    })
  );

  constructor() {
    effect(() => {
      saveToLocal('prefs', this.prefs(), this.VERSION);
    });
  }

  // --- API: get ---
  get language() {
    return this.prefs().language;
  }

  get layoutMode() {
    return this.prefs().layoutMode;
  }

  // --- API: set ---
  setLanguage(lang: string) {
    this.prefs.update((p:UserPrefs) => ({ ...p, language: lang }));
  }

  setLayoutMode(mode: 'full' | 'mini') {
    this.prefs.update((p:UserPrefs) => ({ ...p, layoutMode: mode }));
  }

  // --- API: update ---
  updatePrefs(update: Partial<UserPrefs>) {
    this.prefs.update((p:UserPrefs) => ({ ...p, ...update }));
  }

  // --- API: reset ---
  reset() {
    this.prefs.set({
      language: 'en',
      layoutMode: 'full'
    });
  }
}


// 🟦 1. Language & Locale（语言与区域）
// key	纯中文含义
// language	用户界面语言
// timezone	用户时区偏好
// dateFormat	日期格式（YYYY-MM-DD / DD/MM/YYYY）
// timeFormat	时间格式（12h / 24h）
// numberFormat	数字格式（1,000.00 / 1.000,00）


// 这些是最典型的“用户偏好”。

// 🟦 2. Layout Preferences（布局偏好）
// 注意：
// UIState = 当前状态  
// UserPrefs = 用户偏好（长期）

// key	纯中文含义
// layoutMode	布局模式（全宽 / 居中）
// sidebarDefaultCollapsed	默认是否折叠侧边栏
// defaultPageSize	表格默认分页大小
// defaultViewMode	默认视图（列表 / 卡片）


// 这些是用户希望“每次打开系统都保持”的设置。

// 🟦 3. Dashboard Preferences（仪表盘偏好）
// key	纯中文含义
// dashboardLayout	仪表盘布局（小组件位置）
// dashboardWidgets	用户启用/禁用哪些小组件
// dashboardTheme	仪表盘主题（亮/暗/彩色）


// 这些属于“用户个性化配置”。

// 🟦 4. Table Preferences（表格偏好）
// key	纯中文含义
// tableDensity	表格密度（紧凑/正常/宽松）
// tableColumns	用户选择显示哪些列
// tableSort	默认排序方式
// tableFilters	默认筛选条件


// 这些是用户希望“每次打开表格都保持”的设置。

// 🟦 5. Notification Preferences（通知偏好）
// key	纯中文含义
// enableEmailNotifications	是否启用邮件通知
// enablePushNotifications	是否启用推送通知
// notificationSound	通知声音开关
// notificationFrequency	通知频率（实时/每小时/每天）


// 这些属于长期偏好。

// 🟦 6. Editor Preferences（编辑器偏好）
// 如果你的系统有代码编辑器、富文本编辑器等：

// key	纯中文含义
// editorTheme	编辑器主题（light/dark）
// editorFontSize	字体大小
// editorTabSize	Tab 宽度
// editorAutoSave	自动保存开关


// 🟦 7. Search Preferences（搜索偏好）
// key	纯中文含义
// searchHistoryEnabled	是否保存搜索历史
// searchDefaultFilters	默认搜索过滤器
// searchScope	默认搜索范围


// 🟦 8. Accessibility Preferences（无障碍偏好）
// key	纯中文含义
// reducedMotion	减少动画
// highContrastMode	高对比度模式
// largeText	大字体模式


// 这些属于长期偏好，而不是 UIState。

// 🟦 9. 最终推荐 UserPrefs（企业级结构）
// ts
// export interface UserPrefs {
//   // Language & Locale
//   language: string;
//   timezone: string;
//   dateFormat: string;
//   timeFormat: '12h' | '24h';
//   numberFormat: string;

//   // Layout
//   layoutMode: 'full' | 'centered';
//   sidebarDefaultCollapsed: boolean;
//   defaultPageSize: number;
//   defaultViewMode: 'list' | 'card';

//   // Dashboard
//   dashboardLayout: Record<string, any>;
//   dashboardWidgets: Record<string, boolean>;
//   dashboardTheme: 'light' | 'dark' | 'colorful';

//   // Table
//   tableDensity: 'compact' | 'normal' | 'comfortable';
//   tableColumns: Record<string, boolean>;
//   tableSort: string;
//   tableFilters: Record<string, any>;

//   // Notifications
//   enableEmailNotifications: boolean;
//   enablePushNotifications: boolean;
//   notificationSound: boolean;
//   notificationFrequency: 'realtime' | 'hourly' | 'daily';

//   // Editor
//   editorTheme: 'light' | 'dark';
//   editorFontSize: number;
//   editorTabSize: number;
//   editorAutoSave: boolean;

//   // Search
//   searchHistoryEnabled: boolean;
//   searchDefaultFilters: Record<string, any>;
//   searchScope: string;

//   // Accessibility
//   reducedMotion: boolean;
//   highContrastMode: boolean;
//   largeText: boolean;
// }