
import { Component, signal, Signal,inject,NgIf,ReactiveFormsModule, FormGroup, FormControl } from '@angular/core';
import { UserStore } from '../../store/user.store';
import { UserProfileBasicComponent } from './user-profile-basic.component';
import { UserProfilePermissionsComponent } from './user-profile-permissions.component';
import { UserProfileRolesComponent } from './user-profile-roles.component';
import { UserProfileActivityComponent } from './user-profile-activity.component';
import { UserProfileSettingsComponent } from './user-profile-settings.component';

@Component({
  selector: 'app-user-profile-tabs',
  templateUrl: `
    <div class="tabs">
    <button (click)="select('basic')">Profile</button>
    <button (click)="select('permissions')">Permissions</button>
    <button (click)="select('roles')">Roles</button>
    <button (click)="select('activity')">Activity</button>
    <button (click)="select('settings')">Settings</button>
    </div>

    <div class="tab-content">
    <app-user-profile-basic *ngIf="tab() === 'basic'" />
    <app-user-profile-permissions *ngIf="tab() === 'permissions'" />
    <app-user-profile-roles *ngIf="tab() === 'roles'" />
    <app-user-profile-activity *ngIf="tab() === 'activity'" />
    <app-user-profile-settings *ngIf="tab() === 'settings'" />
    </div>

  `,
  standalone: true,
  imports: [
    NgIf,
    UserProfileBasicComponent,
    UserProfilePermissionsComponent,
    UserProfileRolesComponent,
    UserProfileActivityComponent,
    UserProfileSettingsComponent
  ]
})
export class UserProfileTabsComponent {
  readonly user = inject(UserStore).selectedUser;
  tab = signal<'basic' | 'permissions' | 'roles' | 'activity' | 'settings'>('basic');

  select(tab: typeof this.tab extends Signal<infer T> ? T : never) {
    this.tab.set(tab);
  }
}
