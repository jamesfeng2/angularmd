import { inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
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
  withComputed((store) => ({
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
        store.patchState({ themes });
      },

      changeTheme(theme: string) {
        themeService.applyTheme(theme);
        store.patchState({ currentTheme: theme });
      },

      toggleSidebar() {
        // 建议放到单独 UiStore，这里保留门面方法
        // uiStore.toggleSidebar();
      },

      toggleModal(show: boolean, media?: any) {
        store.patchState({
          showAddToPlaylist: show,
          mediaToPlaylist: show ? media ?? null : null,
        });
      },

      // ---------- 版本管理 ----------

      loadCurrentVersion() {
        const version = versionService.getCurrentVersion();
        store.patchState({ appVersion: version });
      },

      async checkVersion() {
        const current = versionService.getCurrentVersion();
        const latest = await versionService.fetchLatestVersion();
        const hasNewVersion = !!latest && latest !== current;

        store.patchState({
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
      },

      // ---------- 用户认证 ----------

      async checkUserAuth() {
        store.patchState({ isCheckingAuth: true });
        try {
          const user = await authService.getCurrentUser();
          store.patchState({ user, isCheckingAuth: false });
        } catch (e) {
          store.patchState({ user: null, isCheckingAuth: false });
        }
      },

      async signinUser() {
        try {
          const user = await authService.signIn();
          store.patchState({ user });
        } catch (e: any) {
          this.notifyError('登录失败');
        }
      },

      async signoutUser() {
        await authService.signOut();
        store.patchState({ user: null });
      },

      // ---------- 播放列表 ----------

      async loadUserPlaylists() {
        const playlists = await playlistService.getUserPlaylists();
        store.patchState({ usersPlaylists: playlists });
      },

      async addToPlaylist(playlist: AppPlaylist, media: any) {
        await playlistService.addMediaToPlaylist(playlist.id, media);
        notification.success('已加入播放列表');
        store.patchState({ showAddToPlaylist: false, mediaToPlaylist: null });
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
        store.patchState({
          errors: [...store.errors(), message],
        });
      },
    };
  })
);
