import { inject } from "@angular/core";
import { CanActivateFn, CanDeactivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

// export const authGuard = () => {
//   const router = inject(Router);
//   const token = localStorage.getItem('token');
//   if (!token) {
//     router.navigate(['/login']);
//     return false;
//   }
//   return true;
// };

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    return authService.isAuthenticated() ? true : inject(Router).createUrlTree(['/login']);
}