
import { Component,  inject,NgIf,ActivatedRoute } from '@angular/core';
import { UserStore } from '../../store/user.store';
import { UserQuery } from '../../store/user.query';
import { UserProfileTabsComponent } from '../../components/user-profile/user-profile-tabs.component';

@Component({
  selector: 'app-profile-page',
  templateUrl: `
    <ng-container *ngIf="user(); else loading">
    <h2>{{ user().name }}</h2>
    <p>{{ user().email }}</p>
    </ng-container>

    <ng-template #loading>
    <p>Loading profile...</p>
    </ng-template>

  `,
  standalone: true,
  imports: [UserProfileTabsComponent, NgIf]
})
export class ProfilePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly query = inject(UserQuery);
  readonly user = inject(UserStore).selectedUser;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.query.loadUserProfile(id);
  }
}
