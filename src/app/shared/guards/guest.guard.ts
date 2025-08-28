import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { of, switchMap } from 'rxjs';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');
  const authService = inject(AuthService);
  return authService.checkAndRefreshToken().pipe(
    switchMap(valid => {
      if (!valid) return of(true);

      const role = authService.getRole();
      console.log(role)
      switch (role) {
        case 'ADMIN': return router.navigateByUrl('/admin').then(() => false);
        case 'RESPONSABLE': return router.navigateByUrl('/responsable').then(() => false);
        case 'QUALITY': return router.navigateByUrl('/service').then(() => false);
        default: return of(false);
      }
    })
  );
};
