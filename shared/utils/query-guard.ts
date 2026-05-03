// src/app/utils/query-guard.ts

export type QueryState = 'idle' | 'dispatching' | 'running';

export interface QueryGuardInstance<TArgs extends any[], TResult> {
  /** Current state of the guard */
  state: QueryState;

  /** Generation counter to prevent stale overwrites */
  generation: number;

  /** Reserve a new generation (called before starting async work) */
  reserve(): number;

  /** Try to start execution (returns false if already running) */
  tryStart(gen: number): boolean;

  /** Mark execution finished */
  end(gen: number): void;

  /** Execute the wrapped async function with concurrency protection */
  run: (...args: TArgs) => Promise<TResult>;
}

/**
 * queryGuard()
 * Wraps an async function with:
 * - concurrency control:  Reserve() + tryStart()  
 * - generation tracking:  gereration()  
 * - stale result protection:   end()  
 * - state machine:        state() 
 * 
 * Usage: 
 * verson enhance: v2 (with cancellation, abort signals, debounce, throttle)
 */
export function queryGuard<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>
): QueryGuardInstance<TArgs, TResult> {

  let state: QueryState = 'idle';
  let generation = 0;

  const guard: QueryGuardInstance<TArgs, TResult> = {
    get state() {
      return state;
    },

    get generation() {
      return generation;
    },

    reserve() {
      generation++;
      state = 'dispatching';
      return generation;
    },

    tryStart(gen: number) {
      if (state === 'running') return false;
      if (gen !== generation) return false;
      state = 'running';
      return true;
    },

    end(gen: number) {
      if (gen === generation) {
        state = 'idle';
      }
    },

    async run(...args: TArgs): Promise<TResult> {
      const gen = guard.reserve();

      if (!guard.tryStart(gen)) {
        return Promise.reject(new Error('QueryGuard: rejected due to concurrency'));
      }

      try {
        const result = await fn(...args);

        // Only accept result if generation matches
        if (gen === generation) {
          return result;
        } else {
          // Stale result — silently ignore
          return Promise.reject(new Error('QueryGuard: stale result ignored'));
        }
      } finally {
        guard.end(gen);
      }
    }
  };

  return guard;
}
