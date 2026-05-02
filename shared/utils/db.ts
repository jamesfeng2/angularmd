export async function idbSet(key: string, value: any) {
  const db = await openDB('app-db', 1, {
    upgrade(db) {
      db.createObjectStore('store');
    },
  });
  return db.put('store', value, key);
}

export async function idbGet<T>(key: string): Promise<T | null> {
  const db = await openDB('app-db', 1, {
    upgrade(db) {
      db.createObjectStore('store');
    },
  });
  return db.get('store', key);
}

// 适合 大、复杂、结构化、需要缓存 的数据，例如：

// appConfig（全局配置）
// 大型菜单结构
// 用户权限树（ACL）
// 缓存的 API 数据（如 dashboard 数据）
// 离线数据（offline queue）
// 大型 JSON（超过 5KB

// 50MB+
// 异步，不阻塞 UI
// 可以存对象
// 可以存大型 JSON
// 可以做缓存
// 可以做离线队列