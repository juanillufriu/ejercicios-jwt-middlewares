import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordPage {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  token = this.route.snapshot.queryParamMap.get('token') ?? '';
  password = '';
  confirmPassword = '';
  done = signal(false);
  loading = signal(false);

  async submit(): Promise<void> {
    if (!this.token) {
      this.toast.error('Link inválido o incompleto');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toast.error('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.auth.resetPassword(this.token, this.password));
      this.toast.success(res.message);
      this.done.set(true);
    } catch (err: any) {
      this.toast.error(err.error?.message || 'No se pudo restablecer la contraseña');
    } finally {
      this.loading.set(false);
    }
  }
}
