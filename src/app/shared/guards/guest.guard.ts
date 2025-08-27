import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');
  const authService = inject(AuthService);
  if(token && authService.validateToken()){
    const role = authService.getRole();
    if(role === "ADMIN"){
      router.navigateByUrl('/admin');
      return false;
    }
    if(role === "RESPONSABLE"){
      router.navigateByUrl("/responsable");
      return false;
    }
    if(role === "QUALITY"){
      router.navigateByUrl("/service");
      return false;
    }
    return false;
  }
  return true;
};
