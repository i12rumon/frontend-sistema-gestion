import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { inject } from '@angular/core';
import { of, switchMap } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const roles = route.data['roles'] as string[];
  return authService.checkAndRefreshToken().pipe(
    switchMap(valid => {
      if (!valid) {
        router.navigate(['/login']);
        return of(false);
      }

      const userRole = authService.getRole();
      if (roles.includes(userRole!)) return of(true);

      router.navigate(['/not-found']);
      return of(false);
    })
  );

};
