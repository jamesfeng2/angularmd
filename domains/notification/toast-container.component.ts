import { Component } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.css'],
})
export class ToastContainerComponent {
  constructor(public toast: ToastService) {}
}
