import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const verifiedGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const current = auth.user();
  if (current) {
    return current.isVerified ? true : router.parseUrl('/verify-pending');
  }

  return toObservable(auth.user).pipe(
    filter((u): u is NonNullable<typeof u> => u !== null),
    take(1),
    map((u) => (u.isVerified ? true : router.parseUrl('/verify-pending'))),
  );
};
