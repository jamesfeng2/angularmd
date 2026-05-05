import { inject } from '@angular/core';
import { signalStore, withState, withMethods } from '@ngrx/signals';
import { YoutubePlayerService } from '../services/youtube-player.service';
import { NowPlaylistStore } from '../now-playlist/now-playlist.store';
import { GoogleApiYouTubePlaylistResource, GoogleApiYouTubeVideoResource } from '../models/youtube.models';

export interface AppPlayerState {
  isPlaying: boolean;
  isFullscreen: boolean;
  isRepeating: boolean;
  player: YT.Player | null;
}

const initialState: AppPlayerState = {
  isPlaying: false,
  isFullscreen: false,
  isRepeating: false,
  player: null,
};

export const AppPlayerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const youtubePlayer = inject(YoutubePlayerService);
    const nowPlaylist = inject(NowPlaylistStore);

    return {
      // ============= 播放列表相关 =============

      playPlaylist(playlist: GoogleApiYouTubePlaylistResource) {
        // 1. 让 NowPlaylistStore 负责“把 playlist 展开成视频列表”
        // 2. 订阅它暴露的“第一首视频”流，然后播放
        const firstTrack$ = nowPlaylist.playPlaylistAndGetFirstTrack(playlist);

        firstTrack$.subscribe((firstVideo: GoogleApiYouTubeVideoResource | null) => {
          if (!firstVideo) return;
          this.playVideo(firstVideo);
        });
      },

      queuePlaylist(playlist: GoogleApiYouTubePlaylistResource) {
        // 只负责把 playlist 加入队列，具体展开逻辑交给 NowPlaylistStore
        nowPlaylist.queuePlaylist(playlist);
      },

      // ============= 单个视频相关 =============

      playVideo(media: GoogleApiYouTubeVideoResource) {
        // 1. 让 YoutubePlayerService 负责真正的加载 + 播放
        youtubePlayer.loadAndPlay(media);

        // 2. 更新 NowPlaylist 的“当前选中项”
        nowPlaylist.selectVideo(media);

        // 3. 更新本地 Signal 状态
        store.patchState({
          isPlaying: true,
        });
      },

      queueVideo(media: GoogleApiYouTubeVideoResource) {
        nowPlaylist.queueVideo(media);
      },

      removeVideoFromPlaylist(media: GoogleApiYouTubeVideoResource) {
        nowPlaylist.removeVideo(media);
      },

      // ============= 播放器控制 =============

      pauseVideo() {
        youtubePlayer.pause();
        store.patchState({
          isPlaying: false,
        });
      },

      togglePlayer() {
        // 如果你有“迷你播放器 / 展开播放器”的 UI 状态，可以放在别的 UI Store
        // 这里保留方法签名，内部转调 UI Store 即可
        // uiStore.togglePlayer();
      },

      toggleFullScreen() {
        const next = !store.state().isFullscreen;
        youtubePlayer.toggleFullScreen(next);
        store.patchState({
          isFullscreen: next,
        });
      },

      toggleRepeat() {
        const next = !store.state().isRepeating;
        store.patchState({
          isRepeating: next,
        });
        // 如果需要真正控制播放器循环逻辑，可以在 YoutubePlayerService 里处理
        youtubePlayer.setRepeat(next);
      },

      resetPlayer() {
        youtubePlayer.reset();
        store.patchState({
          ...initialState,
          player: store.state().player, // 如果你不想销毁实例，可以保留
        });
        nowPlaylist.reset(); // 可选：同步清空 NowPlaylist
      },

      // ============= 播放器初始化 & 状态同步 =============

      setupPlayer(player: YT.Player) {
        youtubePlayer.setupPlayer(player);
        store.patchState({ player });
      },

      changePlayerState(event: YT.OnStateChangeEvent) {
        // 1. 同步给 AppPlayer 自己（本地状态）
        const isPlaying = event.data === YT.PlayerState.PLAYING;
        store.patchState({ isPlaying });

        // 2. 同步给 NowPlaylistStore（比如：自动播放下一首）
        nowPlaylist.onPlayerStateChange(event);

        // 3. YoutubePlayerService 内部如果有额外逻辑，也可以处理
        youtubePlayer.onPlayerStateChange(event);
      },
    };
  })
);
