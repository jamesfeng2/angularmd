import { Injectable, signal, effect } from '@angular/core';
import { Flags } from '../../shared/types/local-state.types';
import { loadFromLocal, saveToLocal } from '../../shared/utils/storage';


@Injectable({ providedIn: 'root' })
export class FlagsService {

  private readonly VERSION = 1;

  flags = signal<Flags>(
    loadFromLocal<Flags>('flags', {
      onboardingDone: false,
      dismissedBanners: {},
      dismissedTooltips: {},
      dismissedModals: {},
    }, {
      version: this.VERSION,
      mergeDefault: true
    })
  );

  constructor() {
    effect(() => saveToLocal('flags', this.flags(), this.VERSION));
  }

  // --- Onboarding --- 用户是否完成过新手引导
  onboardingDone() {
    this.flags.update((f: Flags) => ({ ...f, onboardingDone: true }));
  }


  // --- Banners --- 用户已经关闭过的横幅提示 
  // dismissedBanners['welcome-banner'] = true

  dismissBanner(id: string) {
    this.flags.update((f: Flags) => ({
      ...f,
      dismissedBanners: {
        ...f.dismissedBanners,
        [id]: true
      }
    }));
  }

  isBannerDismissed(id: string): boolean {
    return !!this.flags().dismissedBanners[id];
  }

  // --- Tooltips --- 小问号提示 新功能的小黄点提示  鼠标悬停出现的小提示框
  dismissTooltip(id: string) {
    this.flags.update((f: Flags) => ({
      ...f,
      dismissedTooltips: {
        ...f.dismissedTooltips,
        [id]: true
      }
    }));
  }

  isTooltipDismissed(id: string): boolean {
    return !!this.flags().dismissedTooltips?.[id];
  }

  // --- Modals --- 用户已经关闭过的弹窗 让弹窗不再重复打扰用户
  // dismissedModals['backup-intro'] = true

  dismissModal(id: string) {
    this.flags.update((f: Flags) => ({
      ...f,
      dismissedModals: {
        ...f.dismissedModals,
        [id]: true
      }
    }));
  }

  isModalDismissed(id: string): boolean {
    return !!this.flags().dismissedModals?.[id];
  }
}



// 1. Onboarding（新手引导类）
// key	纯中文含义
// onboardingDone	用户是否完成新手引导
// tourCompleted	是否完成功能导览
// firstTimeLogin	是否第一次登录
// firstTimeVisitDashboard	是否第一次访问仪表盘
// firstTimeVisitFeatureX	是否第一次访问某功能


// 🟦 2. Banners（横幅提示类）
// key	纯中文含义
// dismissedBanners['welcome']	已关闭“欢迎横幅”
// dismissedBanners['new-feature']	已关闭“新功能介绍横幅”
// dismissedBanners['maintenance']	已关闭“维护公告横幅”
// dismissedBanners['trial-ending']	已关闭“试用即将到期横幅”


// 🟦 3. Modals（弹窗类）
// key	纯中文含义
// dismissedModals['backup-intro']	已关闭“备份功能介绍弹窗”
// dismissedModals['upgrade-plan']	已关闭“升级套餐弹窗”
// dismissedModals['survey']	已关闭“用户调查弹窗”
// dismissedModals['security-warning']	已关闭“安全提示弹窗”


// 🟦 4. Tooltips（提示气泡类）
// key	纯中文含义
// dismissedTooltips['drag-card']	已关闭“拖拽卡片提示”
// dismissedTooltips['search-tips']	已关闭“搜索技巧提示”
// dismissedTooltips['filter-tips']	已关闭“筛选提示”
// dismissedTooltips['new-ui']	已关闭“新 UI 提示气泡”


// 🟦 5. Feature Discovery（功能发现类）
// key	纯中文含义
// featureSeen['dark-mode']	用户是否看过“深色模式介绍”
// featureSeen['ai-assistant']	是否看过“AI 助手介绍”
// featureSeen['bulk-actions']	是否看过“批量操作提示”
// featureSeen['shortcuts']	是否看过“快捷键提示”


// 🟦 6. Announcements（公告类）
// key	纯中文含义
// dismissedAnnouncements['2025-q1']	已关闭“2025 Q1 公告”
// dismissedAnnouncements['policy-update']	已关闭“隐私政策更新公告”
// dismissedAnnouncements['release-notes']	已关闭“版本更新公告”


// 🟦 7. UI Preferences（界面偏好类）
// key	纯中文含义
// uiPrefs['sidebarCollapsed']	用户是否折叠侧边栏
// uiPrefs['tableDensity']	表格密度（紧凑/正常/宽松）
// uiPrefs['cardView']	卡片视图偏好
// uiPrefs['listView']	列表视图偏好


// 🟦 8. Dashboard Personalization（仪表盘个性化）
// key	纯中文含义
// dashboardHiddenWidgets['sales']	隐藏“销售小组件”
// dashboardHiddenWidgets['tasks']	隐藏“任务小组件”
// dashboardHiddenWidgets['activity']	隐藏“活动小组件”


// 🟦 9. Warnings / Alerts（警告类）
// key	纯中文含义
// dismissedWarnings['low-storage']	已关闭“存储不足警告”
// dismissedWarnings['api-limit']	已关闭“API 限额警告”
// dismissedWarnings['security-risk']	已关闭“安全风险警告”


// 🟦 10. Marketing / Promotion（营销类）
// key	纯中文含义
// promoDismissed['upgrade']	已关闭“升级套餐促销”
// promoDismissed['referral']	已关闭“邀请好友促销”
// promoDismissed['discount']	已关闭“折扣活动提示”


// 🟦 11. Survey / Feedback（调查类）
// key	纯中文含义
// surveyDismissed['nps']	已关闭“NPS 调查”
// surveyDismissed['feature-feedback']	已关闭“功能反馈调查”
// surveyDismissed['exit-survey']	已关闭“退出调查”


// 🟦 12. Advanced UX（高级 UX 行为记录）
// key	纯中文含义
// hasUsedSearch	用户是否使用过搜索
// hasUsedFilters	是否使用过筛选
// hasUsedShortcuts	是否使用过快捷键
// hasCustomizedDashboard	是否自定义过仪表盘
// hasCompletedProfile	是否完善过个人资料
// \
// export interface Flags {
//   onboardingDone: boolean;

//   dismissedBanners: Record<string, boolean>;
//   dismissedModals: Record<string, boolean>;
//   dismissedTooltips: Record<string, boolean>;
//   dismissedAnnouncements: Record<string, boolean>;
//   dismissedWarnings: Record<string, boolean>;
//   promoDismissed: Record<string, boolean>;

//   featureSeen: Record<string, boolean>;
//   dashboardHiddenWidgets: Record<string, boolean>;

//   hasUsedSearch: boolean;
//   hasUsedFilters: boolean;
//   hasUsedShortcuts: boolean;
//   hasCustomizedDashboard: boolean;
//   hasCompletedProfile: boolean;
// }
