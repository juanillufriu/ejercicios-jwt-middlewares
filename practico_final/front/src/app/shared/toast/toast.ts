import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toasts = this.toastService.toasts;

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  iconClass(type: string): string {
    if (type === 'success') return 'bi-check-circle';
    if (type === 'error') return 'bi-exclamation-triangle';
    return 'bi-info-circle';
  }

  bgClass(type: string): string {
    if (type === 'success') return 'bg-success';
    if (type === 'error') return 'bg-danger';
    return 'bg-info';
  }
}
