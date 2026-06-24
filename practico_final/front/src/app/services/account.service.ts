import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/users/me`;

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.api}/password`, {
      currentPassword,
      newPassword,
    });
  }

  changeEmail(newEmail: string, currentPassword: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.api}/email`, {
      newEmail,
      currentPassword,
    });
  }
}
