import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const roles = route.data['roles'] as string[];
  const userRole = authService.getRole();

  if( authService.loggedIn() && roles.includes(userRole!)){
    return true;
  }

  return router.createUrlTree(['/not-found']);


};
