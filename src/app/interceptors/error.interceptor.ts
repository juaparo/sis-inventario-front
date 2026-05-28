import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        alert(error.error?.message || 'Acceso denegado: No tienes permisos suficientes para realizar esta acción.');
        if (router.url.includes('/users') || router.url.includes('/roles')) {
          router.navigate(['/']);
        }
      } else if (error.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
