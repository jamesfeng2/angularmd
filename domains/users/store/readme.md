


## architecture

- BaseStore `UI state (loading, error, pagination, sorting)`
- BaseEntityStore<T>	`Entity map + CRUD`
- UserStore	            `Domain-specific selectors`

---
- BaseQuery<TStore, TApi>	`Async engine + QueryGuard`
- BaseEntityQuery      `通用 CRUD 模板（所有实体都能用）`
- UserQuery	            `Domain async logic`


---


### 1) BaseQuery<TStore, TApi>
Async engine + QueryGuard

它负责：“我负责异步流程控制，不管你要干什么，我都帮你包好

- setLoading(true/false)
- setError()
- try/catch/finally
- QueryGuard（防止重复请求、竞态、过期结果）
- run(fn) 包裹异步逻辑
 
--- 

### 2) BaseEntityQuery<TStore, TApi, T>
通用 CRUD + 乐观更新

它负责：你是一个实体，有 id，我就能帮你做 CRUD

- loadAll()
- create(
- update()
- delete()
- optimisticUpdate()
- （可扩展）optimisticCreate / optimisticDelete
- （可扩展）refresh / reload
 

它不关心：
- 用户
- 产品
- 项目
- 订单

---

### 3) UserQuery extends BaseEntityQuery
用户特有的业务逻辑

它负责：我只写用户业务，不写 CRUD，不写 loading，不写错误处理。

- loadAdmins()
- loadActiveUsers()
- searchUsers()
- loadUserPermissions()
- loadUserProfile()


```
┌──────────────────────────────┐
│        UserQuery             │  ← 用户业务逻辑（特有）
│  loadAdmins()                │
│  loadUserPermissions()       │
└───────────────▲──────────────┘
                │ extends
┌──────────────────────────────┐
│     BaseEntityQuery<T>       │  ← 通用 CRUD + 乐观更新
│  loadAll()                   │
│  create()                    │
│  update()                    │
│  delete()                    │
│  optimisticUpdate()          │
└───────────────▲──────────────┘
                │ extends
┌──────────────────────────────┐
│      BaseQuery<TStore,TApi>  │  ← Async engine + QueryGuard
│  run()                       │
│  setLoading()                │
│  setError()                  │
│  concurrency control         │
└──────────────────────────────┘
```




## Query.update() = “更新服务器数据 发请求 等服务器返回 决定如何处理结果”

## Store.updateOne() = “更新本地Store状态 改内存 改 signals 通知 UI 完全同步，不涉及 API



```

┌──────────────────────────────┐
│          UserStore           │  ← 用户业务状态（特有）
│  selectedUserId              │
│  selectUser()                │
└───────────────▲──────────────┘
                │ extends
┌──────────────────────────────┐
│     BaseEntityStore<T>       │  ← 通用实体状态（CRUD + map）
│  setAll()                    │
│  upsertOne()                 │
│  updateOne()                 │
│  removeOne()                 │
│  optimisticUpdate()          │
└───────────────▲──────────────┘
                │ extends
┌──────────────────────────────┐
│         BaseStore            │  ← UI 状态（loading/error）
│  setLoading()                │
│  setError()                  │
└──────────────────────────────┘

```