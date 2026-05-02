import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { User } from '../../../core/types/user.types';
import { UserApiService } from '../services/user-api.service';

@Component({
  selector: 'app-user-list',
  template: `
    <div *ngFor="let u of users">
      {{ u.name }} — {{ u.email }}
    </div>
  `
})
export class UserListComponent {

  users: User[] = [];

  constructor(private userApi: UserApiService) {}

  ngOnInit() {
    this.userApi.list().subscribe((users: User[]) => {
      this.users = users;
    });
  }
}
