import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailPage {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  status = signal<'loading' | 'ok' | 'error'>('loading');
  isAuthenticated = this.auth.isAuthenticated();

  constructor() {
    this.run();
  }

  private async run(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!token) {
      this.status.set('error');
      this.toast.error('Token inválido o expirado');
      return;
    }

    try {
      await firstValueFrom(this.auth.verifyEmail(token));
      this.status.set('ok');
      this.toast.success('Email verificado correctamente');
      this.auth.refreshUser();
    } catch (err: any) {
      this.status.set('error');
      this.toast.error(err.error?.message || 'Token inválido o expirado');
    }
  }
}
