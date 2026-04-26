
```
1. Auth Module (必备)
Why?
Every production app needs:

login

logout

refresh tokens

session persistence

role/permission checks

Signals patterns:
user = signal<User | null>(null)

isLoggedIn = computed(() => !!user())

authEffect for token refresh

🧩 2. User Preferences / Settings Store
Why?
Users expect:

dark mode

language

layout preferences

notification settings

Signals patterns:
persist to localStorage

computed for theme

effect to update <html> attributes

🧩 3. Global Error Handling
Why?
Production apps must gracefully handle:

network errors

server errors

unexpected exceptions

Signals patterns:
globalError = signal<Error | null>(null)

effect to show toast/snackbar

🧩 4. Toast / Snackbar Service
Why?
Notifications are persistent.
Toasts are ephemeral.

Signals patterns:
queue

auto-dismiss effect

animations

🧩 5. Loading / Spinner Store
Why?
Every app needs:

global loading indicator

per-request loading state

Signals patterns:
pendingRequests = signal(0)

computed: isLoading = pendingRequests() > 0

🧩 6. Modal / Dialog Manager
Why?
Centralized modal control avoids:

duplicated state

nested modals

inconsistent UX

Signals patterns:
activeModal = signal<ModalState | null>(null)

effect to lock scroll

🧩 7. Router State Store
Why?
Production apps need:

current route

query params

route-level loading

route-level guards

Signals patterns:
currentRoute = signal<RouteInfo>(...)

computed for derived route state

🧩 8. Cache Layer (Query Store)
Why?
Avoid refetching:

user profile

product lists

dashboard data

Signals patterns:
TTL-based caching

stale-while-revalidate

optimistic updates

🧩 9. WebSocket / SSE Integration
Why?
Real-time features:

notifications

chat

dashboards

stock prices

Signals patterns:
wsEffect to push updates into stores

reconnection logic

🧩 10. Feature Flags / Remote Config
Why?
Production apps need:

gradual rollout

A/B testing

kill switches

Signals patterns:
flags = signal<Record<string, boolean>>({})

computed for feature availability
```