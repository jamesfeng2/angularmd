


// Create a conditional guard that can be dynamically enabled/disabled using Signals, without modifying the route config.

// This gives you:

// dynamic guard behavior

// runtime enable/disable

// no need to mutate route config

// perfect for Angular 17+ function guards

// clean, composable, reusable

// Example usage:


    
    // 1. Create a Signal Store controlling the condition   
// 2. Create a reusable conditionalGuard() factory
export function conditionalGuard<T>(
  condition: () => boolean,
  guard: CanDeactivateFn<T>
): CanDeactivateFn<T> {
  return (component, route, state) => {
    return condition()
      ? guard(component, route, state)
      : true; // skip guard
  };
}

// 3. Create your real guard (the one you want to toggle)
export const hasDoneSomeTaskGuard: CanDeactivateFn<any> =
  (component, route, state) => {
    return confirm('You have not completed the task. Leave anyway?');
  };


  // 4. Combine them using Signals
export const dynamicHasDoneTaskGuard: CanDeactivateFn<any> =
  conditionalGuard(
    () => inject(GuardToggleStore).enabled(),   // Signal-based condition
    hasDoneSomeTaskGuard                         // Real guard
  );

// 5. Use it in your route config
{
  path: 'edit',
  component: EditComponent,
  canDeactivate: [dynamicHasDoneTaskGuard]
}


// @Injectable({ providedIn: 'root' })
// export class GuardToggleStore {
    //   enabled = signal(true);   // default ON
    
    //   enable()  { this.enabled.set(true); }
    //   disable() { this.enabled.set(false); }
    // }

// 6. Toggle guard behavior at runtime
const toggle = inject(GuardToggleStore);

// Disable guard
toggle.disable();

// Enable guard
toggle.enable();

 