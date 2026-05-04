
import { Component, inject } from '@angular/core';
import { AuthStore } from '../store/auth.store';


@Component({
  standalone: true,
  template: `
    <login-form (submit)="onLogin($event)" />
    <p *ngIf="store.error()">{{ store.error() }}</p>
  `,
  imports: [LoginFormComponent]
})
export class LoginPage {
  store = inject(AuthStore);

  // passing username and password to the store's login method
  onLogin(data: { username: string; password: string }) {
    this.store.login(data);
  }
}
