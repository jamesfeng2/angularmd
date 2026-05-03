import { signal, computed } from '@angular/core';
import { BaseStore } from './base-store';
import { EntityMap } from '../../domains/users/store/user.store';


// extends { id: string }> that T 必须是一个“带 id 字段的对象”，而不是一个字符串。
export abstract class BaseEntityStore<T extends { id: string }> extends BaseStore {

  protected readonly entities = signal<Record<string, T>>({});
  protected readonly lastUpdated = signal<number | null>(null);

  // ---------------------------
  // Selectors
  // ---------------------------

  readonly list = computed(() =>
    Object.values(this.entities())
  );

  readonly isDirty = computed(() =>
    this.lastUpdated() !== null
  );


  // ---------------------------
  // Entity Mutators
  // ---------------------------

  setAll(list: T[]) {
    const map: Record<string, T> = {};
    for (const item of list) map[item.id] = item;
    this.entities.set(map);
    this.lastUpdated.set(Date.now());
  }

  upsertOne(item: T) {              // upsert = update or insert
    this.entities.update((store:EntityMap<T>) => ({
      ...store,
      [item.id]: item
    }));
    this.lastUpdated.set(Date.now());
  }

  updateOne(id: string, patch: Partial<T>) {
    this.entities.update((store:EntityMap<T>) => ({
      ...store,
      [id]: { ...store[id], ...patch }
    }));
    this.lastUpdated.set(Date.now());
  }

  // 批量更新：一次更新多个实体，减少 updateOne 的调用次数
  updateMany(patches: Partial<T>[]) {
  this.entities.update((store:EntityMap<T>) => {
    const copy = { ...store };
    for (const p of patches) {
      if (p.id && copy[p.id]) {
        copy[p.id] = { ...copy[p.id], ...p };
      }
    }
    return copy;
  });
}


  // 字段级关系: link('u1', 'roleId', 'admin') 把u1用户的 roleId 改成 admin” 
  link<K extends keyof T>(id: string, key: K, value: T[K]) {
    this.updateOne(id, { [key]: value } as any);
  }
  
  // relationshipe update：更新一个实体的同时，更新与之相关的其他实体
//   userStore.updateOneWithRelations(
//   userId,
//   { roleId: newRoleId },
//   {
//     roleStore: [
//       { id: newRoleId, patch: { userCount: 10 } }
//     ]
//   }
// );

  updateOneWithRelations(id: string, patch: Partial<T>, relatedUpdates: { [relatedStoreName: string]: { id: string, patch: any }[] }) {
    this.updateOne(id, patch);
    for (const storeName in relatedUpdates) {
      const updates = relatedUpdates[storeName];
      for (const update of updates) {
        // 这里假设我们有一个方法可以获取相关的 store 实例
        const relatedStore = this.getRelatedStore(storeName);
        relatedStore.updateOne(update.id, update.patch);
      }
    }
  }

  removeOne(id: string) {
    this.entities.update((store:EntityMap<T>) => {
      const copy = { ...store };
      delete copy[id];
      return copy;
    });
    this.lastUpdated.set(Date.now());
  }

  // 软删除：不是真的从 store 中删除，而是打上 deleted 标记
  softDelete(id: string) {
  this.updateOne(id, { deleted: true } as any);
}


  clear() {
    this.entities.set({});
    this.lastUpdated.set(Date.now());
  }
}
