import { Component,  inject, } from '@angular/core';
import { UserStore } from '../../store/user.store';

@Component({
  selector: 'app-user-detail',
  template: `
    <ng-container *ngIf="selectedUser(); else empty">
      <h2>{{ selectedUser().name }}</h2>
      <p>Email: {{ selectedUser().email }}</p>
      <p>Role: {{ selectedUser().role }}</p>
    </ng-container>

    <ng-template #empty>
      <p>No user selected</p>
    </ng-template>
  `
})
export class UserDetailComponent {
  readonly selectedUser = inject(UserStore).selectedUser;
}
