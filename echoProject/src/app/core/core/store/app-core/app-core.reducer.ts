import { Store } from '@ngrx/store';
import { ActionTypes, AppActions } from './app-core.actions';
import { Themes, DEFAULT_THEME } from '../../../app.themes';
import { migrateReducerState } from '../store.utils';

export enum ErrorActions {
  RELOAD = 'Reload',
  NONE = 0,
  RESET = 1
}
export enum ErrorMessages {
  OFFLINE = 'No Connection Available',
  RESPONSE_ERROR = 'Error With Providing Response'
}
export interface IAppVersion {
  semver: string;
  isNewAvailable: boolean;
  checkingForVersion: boolean;
}
export interface IAppError {
  message: string;
  show: boolean;
  action: ErrorActions;
}
export interface IAppCore {
  sidebarExpanded: boolean;
  requestInProcess: boolean;
  version: IAppVersion;
  theme: string;
  themes: string[];
  error: IAppError;
  show: {
    addToPlaylist: boolean;
    media: GoogleApiYouTubeVideoResource;
    status: 'loading' | 'none'
  }
}
const newInitialState: IAppCore = {
  sidebarExpanded: true,
  requestInProcess: false,
  version: {
    semver: '',
    isNewAvailable: false,
    checkingForVersion: false
  },
  theme: DEFAULT_THEME,
  themes: Themes.sort(),
  error: {
    message: '',
    show: false,
    action: ErrorActions.NONE
  },
  show: {
    addToPlaylist: false,
    media: undefined,
    status: 'none'
  }
};
const initialState: IAppCore = migrateReducerState(
  'appLayout',
  newInitialState,
  localStorage
);

export function appCore(
  state: IAppCore = initialState,
  action: AppActions
): IAppCore {
  switch (action.type) {
    case ActionTypes.SIDEBAR_EXPAND:
      return { ...state, sidebarExpanded: true };

    case ActionTypes.SIDEBAR_COLLAPSE:
      return { ...state, sidebarExpanded: false };

    case ActionTypes.SIDEBAR_TOGGLE:
      return { ...state, sidebarExpanded: !state.sidebarExpanded };

    case ActionTypes.APP_VERSION_RECIEVED: {
      const version = getVersion(state, action.payload);
      return { ...state, version };
    }

    case ActionTypes.APP_CHECK_VERSION: {
      const version = {
        ...state.version,
        checkingForVersion: true
      };
      return { ...state, version };
    }

    case ActionTypes.APP_THEME_CHANGE: {
      return { ...state, theme: action.payload };
    }

    case ActionTypes.ERROR_ADD: {
      const { payload } = action;
      return {
        ...state,
        error: {
          message: payload?.message,
          show: true,
          action: ErrorActions.RELOAD
        }
      };
    }

    case ActionTypes.ERROR_CLEAN: {
      return {
        ...state,
        error: {
          ...initialState.error
        }
      };
    }

    case ActionTypes.TOGGLE_ERROR: {
      return {
        ...state,
        error: {
          ...initialState.error,
          show: false
        }
      };
    }

    case ActionTypes.SHOW_MODAL:
    case ActionTypes.CLOSE_MODAL: {
      const media = action['media'] || undefined;
      return {
        ...state,
        show: {
          ...state.show,
          addToPlaylist: action.payload,
          media
        }
      }
    }
    default:
      return {
        ...initialState,
        ...state,
      };
  }
}

export function getSidebarExpanded($state: Store<IAppCore>) {
  return $state.select(state => state.sidebarExpanded);
}


function getVersion(state: IAppCore, packageJson: any): IAppVersion {
  const current = state.version.semver;
  const remote = packageJson.version;

  const isCurrentEmpty = current === '';
  const isDifferent = current !== '' && current !== remote;

  // 基础结构
  const version: IAppVersion = {
    semver: remote,
    isNewAvailable: false,
    checkingForVersion: false
  };

  // 情况 1：本地版本为空 → 初始化为远端版本
  if (isCurrentEmpty) {
    version.semver = remote;
    return version;
  }

  // 情况 2：本地与远端不同 → 有新版本
  if (isDifferent) {
    version.semver = current;
    version.isNewAvailable = true;
    return version;
  }

  // 情况 3：版本相同 → 无新版本
  return version;
}

| 情况 | current | remote | 结果 semver | isNewAvailable |
| --- | --- | --- | --- | --- |
| 初次启动（本地空） | '' | '1.0.0' | '1.0.0' | false |
| 有新版本 | '1.0.0' | '1.2.0' | '1.0.0' | true |
| 已升级完成 | '1.2.0' | '1.2.0' | '1.2.0' | false |
  
function getVersion_old(state: IAppCore, packageJson: any): IAppVersion {
  const currentVersion = state.version.semver;
  const remoteVersion = packageJson.version;
  const version: IAppVersion = {
    semver: '',
    isNewAvailable: state.version.isNewAvailable,
    checkingForVersion: false
  };
  const isCurrentVersionEmpty = '' === currentVersion;
  const isCurrentDifferentFromRemote =
    !isCurrentVersionEmpty && currentVersion !== remoteVersion;
  if (isCurrentVersionEmpty) {
    version.semver = remoteVersion;
  }
  if (isCurrentDifferentFromRemote && !version.isNewAvailable) {
    version.semver = currentVersion;
    version.isNewAvailable = true;
  } else {
    // upgrade is completed
    version.semver = remoteVersion;
    version.isNewAvailable = false;
  }
  return version;
}
