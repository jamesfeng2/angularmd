import { Injectable, signal, effect } from '@angular/core';
import { UIState, UserPrefs } from '../../shared/types/local-state.types';
import { loadFromLocal, saveToLocal } from '../../shared/utils/storage';


@Injectable({ providedIn: 'root' })
export class UIStateService {

  private readonly VERSION = 1;

  ui = signal<UIState>(
    loadFromLocal<UIState>('ui', {
      sidebarCollapsed: false,
      lastVisitedPage: '/'
    }, {
      version: this.VERSION,
      mergeDefault: true
    })
  );

  constructor() {
    effect(() => saveToLocal('ui', this.ui(), this.VERSION));
  }

  setSidebarCollapsed(v: boolean) {
    this.ui.update(ui => ({ ...ui, sidebarCollapsed: v }));
  }

  setLastVisitedPage(url: string) {
    this.ui.update(ui => ({ ...ui, lastVisitedPage: url }));
  }
}

// UIStateService 应该管理所有 实时 UI 状态，包括：

// 布局（sidebar、header、footer）
// 导航状态（loading、lastVisitedPage）
// 面板（drawer、settings、notifications）
// 弹窗（activeModal）
// 页面状态（pageLoading、pageError）
// 全局 UI（globalLoading、snackbar）
// 这些都属于 UIState，不是 Theme，也不是 Flags。

// 🟦 1. Layout（布局状态）
// key	纯中文含义
// sidebarCollapsed	侧边栏是否折叠
// sidebarPinned	侧边栏是否固定
// sidebarWidth	侧边栏宽度（拖拽调整）
// headerVisible	顶部导航是否显示
// footerVisible	底部是否显示
// layoutMode	布局模式（全宽 / 居中）


// 这些是 UIState 的核心。

// 🟦 2. Navigation（导航状态）
// key	纯中文含义
// lastVisitedPage	最近访问页面
// navigationLoading	是否正在导航（路由加载中）
// currentRoute	当前路由（可选）
// breadcrumbs	面包屑（可选）


// 这些是 ShellService + RouterEvents 自动更新的。

// 🟦 3. Panels / Drawers（面板状态）
// key	纯中文含义
// rightPanelOpen	右侧抽屉是否打开
// leftPanelOpen	左侧抽屉是否打开
// settingsPanelOpen	设置面板是否打开
// notificationPanelOpen	通知面板是否打开


// 这些是 UIStateService 管的，不属于 ThemeService。

// 🟦 4. Dialog / Modal（弹窗状态）
// 注意：
// “是否显示某个弹窗”属于 UIState  
// “用户是否关闭过某个弹窗”属于 Flags

// key	纯中文含义
// activeModal	当前打开的 modal ID
// modalStack	多层 modal 堆栈（可选）
// isGlobalDialogOpen	是否有全局对话框


// 🟦 5. Page-level UI State（页面级 UI 状态）
// key	纯中文含义
// pageLoading	当前页面是否在加载
// pageError	当前页面是否出错
// pageTitle	当前页面标题
// pageSubtitle	当前页面副标题


// 这些是页面渲染时动态变化的，不属于偏好。

// 🟦 6. Table / List UI State（列表状态）
// key	纯中文含义
// tableLoading	表格是否加载中
// selectedRows	当前选中的行
// expandedRows	展开的行
// activeFilters	当前筛选条件
// activeSort	当前排序方式


// 这些是“当前状态”，不是偏好。

// 🟦 7. Form UI State（表单状态）
// key	纯中文含义
// formDirty	表单是否被修改
// formValid	表单是否有效
// formSubmitting	表单是否正在提交


// 这些是实时状态，不应该放 prefs 或 flags。

// 🟦 8. Global UI State（全局 UI 状态）
// key	纯中文含义
// globalLoading	全局 loading（例如 API loading）
// globalError	全局错误提示
// snackbar	全局 snackbar 状态
// toastQueue	全局 toast 队列


// 这些是 UIStateService 的核心职责。

// 🟦 9. 最终推荐 UIState（企业级结构）
// ts
// export interface UIState {
//   // Layout
//   sidebarCollapsed: boolean;
//   sidebarPinned: boolean;
//   sidebarWidth: number;

//   headerVisible: boolean;
//   footerVisible: boolean;
//   layoutMode: 'full' | 'centered';

//   // Navigation
//   lastVisitedPage: string;
//   navigationLoading: boolean;

//   // Panels
//   rightPanelOpen: boolean;
//   leftPanelOpen: boolean;
//   settingsPanelOpen: boolean;
//   notificationPanelOpen: boolean;

//   // Modals
//   activeModal: string | null;

//   // Page
//   pageLoading: boolean;
//   pageError: string | null;
//   pageTitle: string;
//   pageSubtitle: string;

//   // Global UI
//   globalLoading: boolean;
//   globalError: string | null;
//   snackbar: { message: string; type: 'info' | 'success' | 'error' } | null;
// }