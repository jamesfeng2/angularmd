

import { Component, effect,inject,NgIf,ReactiveFormsModule, FormGroup, FormControl } from '@angular/core';
import { UserStore } from '../../store/user.store';
import { UserQuery } from '../../store/user.query';

@Component({
  selector: 'app-profile-edit',
  templateUrl: `
  <form [formGroup]="form" (ngSubmit)="save()">
  <label>Name</label>
  <input formControlName="name" />

  <label>Email</label>
  <input formControlName="email" />

  <button type="submit">Save</button>
</form>

  `,
  standalone: true,
  imports: [ReactiveFormsModule, NgIf]
})
export class ProfileEditComponent {
  private readonly store = inject(UserStore);
  private readonly query = inject(UserQuery);

  readonly user = this.store.selectedUser;

  form = new FormGroup({ 
    name: new FormControl(''),
    email: new FormControl(''),
  });

  ngOnInit() {
    effect(() => {
      const u = this.user();
      if (u) {
        this.form.patchValue({
          name: u.name,
          email: u.email
        });
      }
    });
  }

  save() {
    const id = this.user()?.id!;
    this.query.update(id, this.form.value);
  }
}
