import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShellService {
  user = signal<User | null>(null);
  theme = signal<'light' | 'dark'>('light');
  loading = signal(false);

  constructor(private auth: AuthService) {}

  async init() {
    this.loading.set(true);
    const user = await this.auth.loadUser();
    this.user.set(user);
    this.loading.set(false);
  }
}


 
