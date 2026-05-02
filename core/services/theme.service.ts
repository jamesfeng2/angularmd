import { Injectable, signal, effect } from '@angular/core';
import { Theme, UIState, UserPrefs } from '../../shared/types/local-state.types';
import { loadFromLocal, saveToLocal } from '../../shared/utils/storage';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly VERSION = 1;

  theme = signal<Theme>(
    loadFromLocal<Theme>('theme', 'system', {
      version: this.VERSION
    })
  );

  constructor() {
    effect(() => saveToLocal('theme', this.theme(), this.VERSION));
  }

  setTheme(t: Theme) {
    this.theme.set(t);
  }
}


// 🟦 1. Theme（主题相关）
// key	纯中文含义
// theme	当前主题（亮色/暗色/系统）
// autoTheme	是否自动跟随系统主题
// highContrast	高对比度模式
// colorBlindMode	色盲模式（红绿弱、蓝黄弱等）


// 🟦 2. Layout Density（界面密度）
// key	纯中文含义
// density	界面密度（紧凑/正常/宽松）
// tableDensity	表格密度偏好
// formDensity	表单密度偏好


// 这些在企业后台系统里非常常见。

// 🟦 3. Font & Typography（字体偏好）
// key	纯中文含义
// fontSize	字体大小（小/中/大）
// fontFamily	字体（系统字体/等宽字体）
// lineHeight	行高偏好


// 🟦 4. Motion / Animation（动效偏好）
// key	纯中文含义
// reduceMotion	减少动画（无障碍）
// disableTransitions	禁用过渡动画
// disableHoverEffects	禁用 hover 动效


// 这些对无障碍（Accessibility）非常重要。

// 🟦 5. Sidebar / Navigation（导航偏好）
// 这些你也可以放在 UIStateService，但如果你想统一“视觉呈现”，也可以放 ThemeService。

// key	纯中文含义
// sidebarMode	侧边栏模式（展开/折叠/悬浮）
// sidebarWidth	自定义侧边栏宽度
// navbarPosition	顶部导航位置（固定/滚动）


// 🟦 6. Component Style Preferences（组件样式偏好）
// key	纯中文含义
// buttonStyle	按钮样式（圆角/直角/胶囊）
// cardShadow	卡片阴影（无/轻/重）
// borderRadius	全局圆角大小
// inputStyle	输入框样式（线框/填充）


// 🟦 7. Dark Mode Enhancements（暗色模式增强）
// key	纯中文含义
// darkModeContrast	暗色模式对比度增强
// darkModeSaturation	暗色模式饱和度调整
// darkModeDimImages	暗色模式降低图片亮度


// 🟦 8. Accessibility（无障碍偏好）
// key	纯中文含义
// screenReaderMode	屏幕阅读器模式
// focusOutlineAlways	始终显示焦点边框
// keyboardNavigation	键盘导航模式


// 🟦 9. Dashboard Display Preferences（仪表盘显示偏好）
// key	纯中文含义
// dashboardTheme	仪表盘主题（浅色/深色/彩色）
// widgetStyle	小组件样式（卡片/扁平）
// chartTheme	图表主题（亮色/暗色）


