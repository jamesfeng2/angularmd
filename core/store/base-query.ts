import { queryGuard } from '../../shared/utils/query-guard';
import { BaseStore } from './base-store';

export abstract class BaseQuery<
TStore extends BaseStore, TApi> {

  constructor(
    protected readonly store: TStore,
    protected readonly api: TApi
  ) {}

  protected run<R>(fn: () => Promise<R>) {
    return queryGuard(async () => {    //  concurrency control
      try {
        this.store.setLoading(true);
        return await fn();
      } catch (err: any) {
        this.store.setError(err.message || 'Unknown error');
        throw err;
      } finally {
        this.store.setLoading(false);
      }
    });
  }
}
