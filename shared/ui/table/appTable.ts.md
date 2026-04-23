```

<app-table
  [columns]="[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true, width: '80px' },
    { key: 'email', label: 'Email', hideOnMobile: true }
  ]"
  [data]="users"
  [loading]="loading"
  [pageSize]="5"
  selectable="true"
  multiSelect="true"
  (rowClick)="openUser($event)"
  (selectionChange)="onSelect($event)"
>
</app-table>



<div class="table-wrapper">
  <!-- Loading -->
  <div class="loading-overlay" *ngIf="loading">
    <div class="spinner"></div>
  </div>

```
# component 

  ```
  import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';

export type TableColumn<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  hideOnMobile?: boolean;
};

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.css'],
})
export class AppTableComponent<T extends Record<string, any>>
  implements OnChanges
{
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() loading = false;
  @Input() pageSize = 10;
  @Input() selectable = false;
  @Input() multiSelect = false;

  @Output() rowClick = new EventEmitter<T>();
  @Output() selectionChange = new EventEmitter<T[]>();

  sortedData: T[] = [];
  currentPage = 1;
  sortKey: keyof T | null = null;
  sortDir: 'asc' | 'desc' = 'asc';
  selectedRows = new Set<T>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.sortedData = [...this.data];
      this.applySort();
    }
  }

  toggleSort(col: TableColumn<T>) {
    if (!col.sortable) return;

    if (this.sortKey === col.key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = col.key;
      this.sortDir = 'asc';
    }

    this.applySort();
  }

  applySort() {
    if (!this.sortKey) return;

    const key = this.sortKey;

    this.sortedData.sort((a, b) => {
      const v1 = a[key];
      const v2 = b[key];

      if (typeof v1 === 'number' && typeof v2 === 'number') {
        return this.sortDir === 'asc' ? v1 - v2 : v2 - v1;
      }

      return this.sortDir === 'asc'
        ? String(v1).localeCompare(String(v2))
        : String(v2).localeCompare(String(v1));
    });
  }

  get pagedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedData.slice(start, start + this.pageSize);
  }

  toggleSelect(row: T) {
    if (!this.selectable) return;

    if (this.multiSelect) {
      this.selectedRows.has(row)
        ? this.selectedRows.delete(row)
        : this.selectedRows.add(row);
    } else {
      this.selectedRows.clear();
      this.selectedRows.add(row);
    }

    this.selectionChange.emit([...this.selectedRows]);
  }

  isSelected(row: T) {
    return this.selectedRows.has(row);
  }
}


  ```
# html
  <table class="app-table">
    <thead>
      <tr>
        <th *ngIf="selectable" class="select-col"></th>

        <th
          *ngFor="let col of columns"
          [ngClass]="{
            sortable: col.sortable,
            sorted: sortKey === col.key,
            asc: sortDir === 'asc',
            desc: sortDir === 'desc',
            hideMobile: col.hideOnMobile
          }"
          (click)="toggleSort(col)"
          [style.width]="col.width"
        >
          {{ col.label }}
          <span class="sort-icon" *ngIf="col.sortable">▲▼</span>
        </th>
      </tr>
    </thead>

    <tbody>
      <!-- Empty -->
      <tr *ngIf="!loading && sortedData.length === 0">
        <td [attr.colspan]="columns.length + (selectable ? 1 : 0)">
          No data available
        </td>
      </tr>

      <!-- Rows -->
      <tr
        *ngFor="let row of pagedData"
        [ngClass]="{ selected: isSelected(row) }"
        (click)="rowClick.emit(row)"
      >
        <td
          *ngIf="selectable"
          class="select-col"
          (click)="toggleSelect(row); $event.stopPropagation()"
        >
          <input type="checkbox" [checked]="isSelected(row)" />
        </td>

        <td
          *ngFor="let col of columns"
          [ngClass]="{ hideMobile: col.hideOnMobile }"
        >
          {{ row[col.key] }}
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Pagination -->
  <div class="pagination" *ngIf="sortedData.length > pageSize">
    <button
      (click)="currentPage = currentPage - 1"
      [disabled]="currentPage === 1"
    >
      Prev
    </button>

    <span>{{ currentPage }}</span>

    <button
      (click)="currentPage = currentPage + 1"
      [disabled]="currentPage * pageSize >= sortedData.length"
    >
      Next
    </button>
  </div>
</div>



```