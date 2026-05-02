
// one para
export function loadFromLocal1<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export function saveToLocal1<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}


// two para
export function loadFromLocal2<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToLocal2<T>(key: string, value: T, version: number) {
  try {
    const wrapped: StoredValue<T> = { _v: version, data: value };
    localStorage.setItem(key, JSON.stringify(wrapped));
  } catch {
    // ignore
  }
}

// enhance version
// 类型校验（validate）
// 默认值合并（mergeDefault）
// 数据版本控制（version）
// 自动 fallback
// 自动修复损坏数据
// 自动删除旧版本
// 自动 JSON 解析
// 自动类型安全

export interface StoredValue<T> {
  _v: number;   // 数据版本
  data: T;      // 实际数据
}

export function loadFromLocal<T>(
  key: string,
  fallback: T,
  options: {
    version: number;                                // 当前版本
    validate?: (value: unknown) => value is T;       // 类型守卫
    migrate?: (oldData: any, oldVersion: number) => T; // 自动迁移
    mergeDefault?: boolean;                          // 合并默认值
  }
): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    let parsed: StoredValue<T>;

    try {
      parsed = JSON.parse(raw);
    } catch {
      // ❌ JSON 损坏 → 删除并返回 fallback
      localStorage.removeItem(key);
      return fallback;
    }

    // ❌ 没有版本号 → 删除并返回 fallback
    if (typeof parsed._v !== 'number') {
      localStorage.removeItem(key);
      return fallback;
    }

    // --- 自动迁移 当版本号不一致时 你可以把旧数据结构迁移到新结构。---
    if (parsed._v !== options.version) {
      if (options.migrate) {
        const migrated = options.migrate(parsed.data, parsed._v);
        saveToLocal(key, migrated, options.version);
        return migrated;
      } else {
        // ❌ 没有迁移函数 → 删除旧数据
        localStorage.removeItem(key);
        return fallback;
      }
    }

    // --- 类型校验 ---
    if (options.validate && !options.validate(parsed.data)) {
      localStorage.removeItem(key);
      return fallback;
    }

    // --- 合并默认值 ---
    if (options.mergeDefault) {
      return { ...fallback, ...parsed.data };
    }

    return parsed.data;

  } catch {
    return fallback;
  }
}








export function loadFromSession<T>(key: string): T | null {
  const raw = sessionStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export function saveToSession<T>(key: string, value: T) {
  sessionStorage.setItem(key, JSON.stringify(value));
}


// 适合 小、轻量、同步、立即可用 的数据，例如：

// 用户主题（theme）
// 用户 token（如果不敏感）
// 用户偏好（语言、布局模式）
// UI 状态（sidebar collapsed）
// 最近访问页面
// 简单的 flags（如 onboardingDone）

// localStorage 限制：
// 最大 5MB
// 同步阻塞（会卡 UI）
// 只能存字符串
// 不适合大 JSON
// 不适合频繁写入
// 不适合缓存 API 数据