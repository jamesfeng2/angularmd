


// BaseEntityQuery 是“所有实体查询（Query）类的基类”，
// 用来封装：API 调用 + Store 更新 + QueryGuard 并发控制 + 乐观更新
// 这样，组件调用 Query 的时候就非常简单了，完全不需要关心失败的情况，Store 内部自己处理好了。
// 当然，这种模式也有缺点：Store 变得比较复杂，尤其是回滚的逻辑可能会比较麻烦。
// 这种模式适合那些对用户体验要求比较高的场景，比如点赞、关注等操作，用户希望立即看到结果，如果失败了再悄悄地恢复回去。
// UserQuery ProductQuery ProjectQuery OrderQuery TaskQuery

export interface BaseEntityApi<T> {
  getAll(): Promise<T[]>;
  create(payload: Partial<T>): Promise<T>;
  update(id: string, patch: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}


import { BaseEntityStore } from './base-entity-store';
import { BaseQuery } from './base-query';

export abstract class BaseEntityQuery<
  TStore extends BaseEntityStore<T>,
  TApi extends BaseEntityApi<T>,
  T extends { id: string }
> extends BaseQuery<TStore, TApi> {
   
loadAll() {
    return this.run(async () => {
      const list = await this.api.getAll();
      this.store.setAll(list);
    });
  }

  create(payload: Partial<T>) {
    return this.run(async () => {
      const created = await this.api.create(payload);
      this.store.upsertOne(created);
    });
  }

  update(id: string, patch: Partial<T>) {
    return this.run(async () => {
      const updated = await this.api.update(id, patch);
      this.store.updateOne(id, updated);
    });
  }

  delete(id: string) {
    return this.run(async () => {
      await this.api.delete(id);
      this.store.removeOne(id);
    });
  }

  // 乐观更新
  optimisticUpdate(id: string, patch: Partial<T>) {
    const rollback = this.store.optimisticUpdate(id, patch);
    return this.run(async () => {
      try {
        await this.api.update(id, patch);
      } catch {
        rollback();
      }
    });
  }
}      
