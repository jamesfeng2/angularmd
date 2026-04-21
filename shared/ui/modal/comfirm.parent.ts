@Component({
  standalone: true,
  imports: [AppModalComponent, AppButtonComponent],
  template: `
    <app-button variant="danger" iconLeft="fa fa-trash" (clicked)="openDelete()">
      Delete
    </app-button>

    <app-modal
      [open]="deleteOpen"
      [loading]="deleteLoading"
      (closed)="deleteOpen = false"
    >
      <div header>Delete Item</div>

      <p>Are you sure you want to delete this item?</p>

      <div footer>
        <app-button
          variant="secondary"
          (clicked)="deleteOpen = false"
          [disabled]="deleteLoading"
        >
          Cancel
        </app-button>

        <app-button
          variant="danger"
          iconLeft="fa fa-trash"
          [loading]="deleteLoading"
          (clicked)="confirmDelete()"
        >
          Delete
        </app-button>
      </div>
    </app-modal>
  `,
})
export class DeletePage {
  deleteOpen = false;
  deleteLoading = false;

  openDelete() {
    this.deleteOpen = true;
  }

  confirmDelete() {
    this.deleteLoading = true;

    // 模拟异步操作
    setTimeout(() => {
      this.deleteLoading = false;
      this.deleteOpen = false;
    }, 1500);
  }
}
