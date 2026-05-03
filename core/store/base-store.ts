import { signal,computed } from '@angular/core';


// BaseStore:           UI state (loading, error, pagination, sorting)
//     ↑
// BaseEntityStore<T>:   entity state (map, list, CRUD)
//     ↑
// UserStore:       combines both + user-specific state + methods

export abstract class BaseStore {

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly error = signal<string | null>(null);

  readonly filter = signal('');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly totalCount = signal(0);
  readonly totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize())
);


  readonly sortKey = signal<string>('id');
  readonly sortDir = signal<'asc' | 'desc'>('asc');

  // ---------------------------
  // Mutators
  // ---------------------------

  setLoading(v: boolean) { this.loading.set(v); }
  setSaving(v: boolean) { this.saving.set(v); }
  setDeleting(v: boolean) { this.deleting.set(v); }
  setError(msg: string | null) { this.error.set(msg); }

  setFilter(keyword: string) {
    this.filter.set(keyword);
    this.pageIndex.set(0);
  }

  setPage(index: number) { this.pageIndex.set(index); }
  setPageSize(size: number) { this.pageSize.set(size); }

  setSort(key: string, dir: 'asc' | 'desc') {
    this.sortKey.set(key);
    this.sortDir.set(dir);
  }

  // 错误标准化
  normalizeError(err: any) {
  if (typeof err === 'string') return err;
  if (err?.message) return err.message;
  return 'Unknown error';
}


  resetUIState() {
    this.loading.set(false);
    this.saving.set(false);
    this.deleting.set(false);
    this.error.set(null);
    this.filter.set('');
    this.totalCount.set(0);
    this.pageIndex.set(0);
    this.pageSize.set(10);
    this.sortKey.set('id');
    this.sortDir.set('asc');
  }
}
