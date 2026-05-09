import { inject } from '@angular/core';
import { signalStore, computed, patchState, withState, withComputed, withMethods } from '@ngrx/signals';
import { Router } from '@angular/router';


// ==== 领域服务（示例，按你们项目实际替换） ====
import { ThemeService } from '../services/theme.service';
import { VersionService } from '../services/version.service';
import { AuthService } from '../services/auth.service';
import { PlaylistService } from '../services/playlist.service';
import { NotificationService } from '../services/notification.service';

export interface AppUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface AppPlaylist {
  id: string;
  title: string;
}

export interface AppState {
  themes: string[];
  currentTheme: string | null;

  appVersion: string | null;
  latestVersion: string | null;
  hasNewVersion: boolean;

  user: AppUser | null;
  isCheckingAuth: boolean;

  showAddToPlaylist: boolean;
  usersPlaylists: AppPlaylist[];
  mediaToPlaylist: any | null;

  errors: string[];
}

const initialState: AppState = {
  themes: [],
  currentTheme: null,

  appVersion: null,
  latestVersion: null,
  hasNewVersion: false,

  user: null,
  isCheckingAuth: false,

  showAddToPlaylist: false,
  usersPlaylists: [],
  mediaToPlaylist: null,

  errors: [],
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  // ====== 派生状态（代替原来的 selectors$） ======
  withComputed((store: AppState) => ({
    // 是否已登录
    isAuthenticated: () => !!store.user(),
    // 当前主题列表
    themesView: () => store.themes(),
    // 是否显示“加入播放列表”弹窗
    showAddToPlaylistView: () => store.showAddToPlaylist(),
  })),

  // ====== 行为方法（代替原来的 AppApi 方法） ======
  withMethods((store) => {
    const router = inject(Router);
    const themeService = inject(ThemeService);
    const versionService = inject(VersionService);
    const authService = inject(AuthService);
    const playlistService = inject(PlaylistService);
    const notification = inject(NotificationService);

    return {
      // ---------- UI / 主题 ----------

      loadThemes() {
        const themes = themeService.getAvailableThemes();
        patchState(store,{ themes });
      },

      changeTheme(theme: string) {
        themeService.applyTheme(theme);
        patchState(store,{ currentTheme: theme });
      },

      toggleSidebar() {
        // 建议放到单独 UiStore，这里保留门面方法
        // uiStore.toggleSidebar();
      },

      toggleModal(show: boolean, media?: any) {
        patchState(store,{
          showAddToPlaylist: show,
          mediaToPlaylist: show ? media ?? null : null,
        });
      },

      // ---------- 版本管理 ----------

      loadCurrentVersion() {
        const version = versionService.getCurrentVersion();
        patchState(store,{ appVersion: version });
      },

      async checkVersion() {
        const current = versionService.getCurrentVersion();
        const latest = await versionService.fetchLatestVersion();
        const hasNewVersion = !!latest && latest !== current;

        patchState(store,{
          appVersion: current,
          latestVersion: latest,
          hasNewVersion,
        });

        if (hasNewVersion) {
          notification.info('发现新版本，可刷新或重新打开应用。');
        }
      },

      updateVersion() {
        // 这里可以做：清缓存、强制刷新等
        versionService.forceReload();
        versionService.clearLocalCache();
        // 3. 清除 Service Worker 缓存（如果你的项目有 PWA）
        versionService.clearServiceWorkerCache();
      },

      // ---------- 用户认证 ----------

      async checkUserAuth() {
        patchState(store,{ isCheckingAuth: true });
        try {
          const user = await authService.getCurrentUser();
          patchState(store,{ user, isCheckingAuth: false });
        } catch (e) {
          patchState(store,{ user: null, isCheckingAuth: false });
        }
      },

      async signinUser() {
        try {
          const user = await authService.signIn();
          patchState(store,{ user });
        } catch (e: any) {
          this.notifyError('登录失败');
        }
      },

      async signoutUser() {
        await authService.signOut();
        patchState(store,{ user: null });
      },

      // ---------- 播放列表 ----------

      async loadUserPlaylists() {
        const playlists = await playlistService.getUserPlaylists();
        patchState(store,{ usersPlaylists: playlists });
      },

      async addToPlaylist(playlist: AppPlaylist, media: any) {
        await playlistService.addMediaToPlaylist(playlist.id, media);
        notification.success('已加入播放列表');
        patchState(store,{ showAddToPlaylist: false, mediaToPlaylist: null });
      },

      // ---------- 搜索 / 分页 ----------

      searchMore() {
        // 这里建议转调 SearchStore，AppStore 只做门面
        // searchStore.loadMore();
      },

      // ---------- 路由 ----------

      navigateBack() {
        router.navigate(['../']);
      },

      // ---------- 错误处理 ----------

      notifyError(message: string) {
        notification.error(message);
        patchState(store,{
          errors: [...store.errors(), message],
        });
      },
    };
  })
);
