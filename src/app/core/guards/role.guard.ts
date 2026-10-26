import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Factoría de Functional Guards para control de acceso granular basado en roles.
 * Valida si el usuario autenticado cuenta con el rol requerido (p. ej. 'admin' o 'user').
 * Si un usuario con rol 'user' intenta acceder a '/admin', deniega el acceso y
 * lo redirige atómicamente a '/user-dashboard'.
 */
export const roleGuard = (allowedRole: 'admin' | 'user' | string): CanActivateFn => {
  return (route, state): boolean | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const session = authService.currentUser();

    // 1. Verificar si existe sesión válida
    if (!authService.isAuthenticated() || !session) {
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    // 2. Si cuenta con el rol requerido, permitir navegación
    if (session.role === allowedRole) {
      return true;
    }

    // 3. Si no cuenta con el rol, denegar acceso y redirigir atómicamente a su panel
    if (session.role === 'user') {
      return router.createUrlTree(['/user-dashboard']);
    }

    return router.createUrlTree(['/admin']);
  };
};
