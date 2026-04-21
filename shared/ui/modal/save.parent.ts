`
<app-button variant="primary" (clicked)="openEdit()">
  Edit Profile
</app-button>

<app-modal
  [open]="editOpen"
  [loading]="saving"
  (closed)="editOpen = false"
>
  <div header>Edit Profile</div>

  <profile-form [(value)]="formValue"></profile-form>

  <div footer>
    <app-button variant="secondary" (clicked)="editOpen = false">
      Cancel
    </app-button>

    <app-button
      variant="primary"
      iconRight="fa fa-save"
      [loading]="saving"
      (clicked)="save()"
    >
      Save
    </app-button>

    // Modal 内的按钮会自动跟随主题变化
    <app-button variant="text" iconLeft="fa fa-moon" (clicked)="toggleTheme()">
  Toggle Theme
</app-button>

  </div>
</app-modal>


save() {
  this.saving = true;

  fakeApi.save(this.formValue).subscribe(() => {
    this.saving = false;
    this.editOpen = false;
  });
}


toggleTheme() {
  const root = document.documentElement;
  const current = root.getAttribute('data-theme');
  root.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
}



`