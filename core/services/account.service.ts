import { Injectable, signal } from '@angular/core';


// Load user profile, roles, permissions
// 个人资料、角色、权限等
// 这些信息通常在登录后从后端加载，并存储在全局状态中，供整个应用使用。
// 你可以把它放在 ShellService 里，但为了更清晰的职责分离，建议放在单独的 AccountService。
@Injectable({ providedIn: 'root' })
export class AccountService {
  user = signal<any>(null);

  setUser(u: any) {
    this.user.set(u);
  }

  clear() {
    this.user.set(null);
  }
}
