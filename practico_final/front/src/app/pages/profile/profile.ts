import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);
  private account = inject(AccountService);
  private toast = inject(ToastService);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  newEmail = '';
  emailCurrentPassword = '';

  resending = signal(false);
  changingPassword = signal(false);
  changingEmail = signal(false);

  async resendVerification(): Promise<void> {
    this.resending.set(true);
    try {
      await firstValueFrom(this.auth.resendVerification());
      this.toast.success('Email reenviado');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'No se pudo reenviar el email');
    } finally {
      this.resending.set(false);
    }
  }

  async submitPassword(): Promise<void> {
    if (this.newPassword !== this.confirmPassword) {
      this.toast.error('Las contraseñas nuevas no coinciden');
      return;
    }

    this.changingPassword.set(true);
    try {
      const res = await firstValueFrom(
        this.account.changePassword(this.currentPassword, this.newPassword),
      );
      this.toast.success(res.message);
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    } catch (err: any) {
      this.toast.error(err.error?.message || 'No se pudo cambiar la contraseña');
    } finally {
      this.changingPassword.set(false);
    }
  }

  async submitEmail(): Promise<void> {
    this.changingEmail.set(true);
    try {
      const res = await firstValueFrom(
        this.account.changeEmail(this.newEmail, this.emailCurrentPassword),
      );
      this.toast.success(res.message);
      this.newEmail = '';
      this.emailCurrentPassword = '';
      this.auth.refreshUser();
    } catch (err: any) {
      this.toast.error(err.error?.message || 'No se pudo cambiar el email');
    } finally {
      this.changingEmail.set(false);
    }
  }
}
