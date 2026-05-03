import { Component,  inject, } from '@angular/core';
import { UserQuery } from '../../store/user.query';
import { UserStore } from '../../store/user.store';


@Component({
  selector: 'app-user-list',
  template: `
    <div *ngFor="let user of users()"
         (click)="select(user.id)"
         class="row">
      {{ user.name }}
    </div>
  `
})
export class UserListComponent {
  private readonly query = inject(UserQuery);
  readonly users = inject(UserStore).all;

  select(id: string) {
    this.query.selectUser(id);
  }
}
