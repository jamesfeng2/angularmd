
import { Component, inject } from '@angular/core';
import { AuthStore } from '../store/auth.store';
import { FeatureDirective } from '../../../core/directives/feature.directive';


@Component({
  standalone: true,
  template: `
    <login-form (submit)="onLogin($event)" />
    <p *ngIf="store.error()">{{ store.error() }}</p>


    <!-- dynamic beta mode banner -->
  <div *feature="'beta-mode'">
    <beta-login-banner></beta-login-banner>
  </div>

  `,
  imports: [LoginFormComponent, FeatureDirective]
})
export class LoginPage {
  store = inject(AuthStore);
private router = inject(Router);
  private route = inject(ActivatedRoute);
  

  // passing username and password to the store's login method
  onLogin(data: { username: string; password: string }) {
    this.store.login(data);

        const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') || '/admin';

    this.router.navigateByUrl(returnUrl);
  }
}
