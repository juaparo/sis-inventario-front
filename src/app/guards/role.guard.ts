import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.getUser();
  if (user && user.role === 'Administrador') {
    return true;
  }
  
  // Redirigir al dashboard si no tiene permisos
  return router.createUrlTree(['/']);
};
