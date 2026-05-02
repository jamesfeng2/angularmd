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
