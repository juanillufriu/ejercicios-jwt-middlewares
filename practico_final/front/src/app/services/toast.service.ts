import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly defaultDuration = 4000;

  toasts = signal<Toast[]>([]);

  success(message: string, duration = this.defaultDuration): void {
    this.push('success', message, duration);
  }

  error(message: string, duration = this.defaultDuration): void {
    this.push('error', message, duration);
  }

  info(message: string, duration = this.defaultDuration): void {
    this.push('info', message, duration);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private push(type: ToastType, message: string, duration: number): void {
    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, type, message }]);
    setTimeout(() => this.dismiss(id), duration);
  }
}
