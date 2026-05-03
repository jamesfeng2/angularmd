import { queryGuard } from '../../shared/utils/query-guard';

export abstract class BaseQuery<TStore, TApi> {

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
