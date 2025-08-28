import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, finalize, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

let refreshInProgress = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const refreshToken = authService.getRefreshToken();

  let authReq = req;

  if (token && refreshToken) {
    if (req.url.endsWith('/refresh')) {
      console.debug('[Interceptor] Usando REFRESH token');
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${refreshToken}`)
      });
    } else {
      console.debug('[Interceptor] Usando ACCESS token');
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }
  }

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401 && authService.getRefreshToken()) {

        if (!refreshInProgress) {
          refreshInProgress = true;
          refreshSubject.next(null);

          return authService.refreshAccessToken().pipe(
            tap(() => {
              const newToken = authService.getToken();
              console.debug('[Interceptor] Refresh exitoso, nuevo access token:', newToken);
              refreshSubject.next(newToken);
            }),
            switchMap(() => {
              const newToken = authService.getToken();
              const retryReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
              });
              return next(retryReq);
            }),
            catchError(refreshErr => {
              console.error('[Interceptor] Error en refresh:', refreshErr);
              authService.logout();
              refreshSubject.error(refreshErr);
              return throwError(() => refreshErr);
            }),
            finalize(() => { refreshInProgress = false; })
          );

        } else {
          return refreshSubject.pipe(
            switchMap(newToken => {
              if (!newToken) return throwError(() => err);
              const retryReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
              });
              return next(retryReq);
            })
          );
        }
      }

      return throwError(() => err);
    })
  );
};
