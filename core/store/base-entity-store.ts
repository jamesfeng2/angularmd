import { signal, computed } from '@angular/core';
import { BaseStore } from './base-store';
import { EntityMap } from '../../domains/users/store/user.store';

// {
//   "u1": { id: "u1", name: "James", email: "james@example.com", roles: ["admin"] },
//   "u2": { id: "u2", name: "Alice" }
// }
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

  //usage: if (!force && !this.store.isExpired(30000)) return; // 30s 缓存
  isExpired(ttlMs: number) {
    const ts = this.lastUpdated();
    return !ts || Date.now() - ts > ttlMs;
  }

  // create, update, delete, batch的乐观更新：先更新 UI，如果失败了再回滚。

  // 先把 UI 提前改掉（乐观更新），如果失败就用 rollback 把旧数据恢复回去
  // usage: const rollback = this.store.optimisticUpdate(userId, { name: newName });
  //        this.api.updateUser(userId, { name: newName }).catch(rollback);

    optimisticUpdate(id: string, patch: Partial<T>) {
      const prev = this.entities()[id];
      this.updateOne(id, patch);
      return () => this.updateOne(id, prev); // rollback
    }


  // Store 不只改 UI，还自己发 API，还自己处理失败，还自己回滚。
  // 这种模式的好处是：组件调用起来非常简单，完全不需要关心失败的情况，Store 内部自己处理好了。
  // 当然，这种模式也有缺点：Store 变得比较复杂，尤其是回滚的逻辑可能会比较麻烦。
  // 这种模式适合那些对用户体验要求比较高的场景，比如点赞、关注等操作，用户希望立即看到结果，如果失败了再悄悄地恢复回去。
  // usage: this.store.optimisticUpdate(userId, { name: newName }, 
  // () => this.api.updateUser(userId, { name: newName }));

  optimisticUpdate1(id: string, patch: Partial<T>, updateFn: () => Promise<any>, rollbackPatch?: Partial<T>) {
    const old = this.entities()[id];  // 先保存旧数据
    this.updateOne(id, patch);      // 立即更新 UI（updateOne）
    updateFn().catch(() => {
      if (rollbackPatch) {
        this.updateOne(id, { ...patch, ...rollbackPatch });
      } else {
        this.updateOne(id, old);
      }
  });
}


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
