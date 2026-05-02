import { Injectable, signal } from '@angular/core';

// 认证状态（Authentication State）
// key	    纯中文含义
// token	认证 token（JWT 或其他）
// isAuthenticated	是否已认证（可以是一个计算属性，根据 token 是否存在来判断）
// 这些信息通常在登录后从后端加载，并存储在全局状态中，供整个应用使用。
// 你可以把它放在 ShellService 里，但为了更清晰的职责分离，建议放在单独的 AuthService。

@Injectable({ providedIn: 'root' })
export class AuthService {
  token = signal<string | null>(null);
  isAuthenticated = signal<boolean>(false);

  login(token: string) {
    this.token.set(token);
    this.isAuthenticated.set(true);
  }

  logout() {
    this.token.set(null);
    this.isAuthenticated.set(false);
  }

  isAuthenticate() {
    return this.isAuthenticated();
  }
}
