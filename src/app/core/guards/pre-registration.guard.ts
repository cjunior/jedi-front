// src/app/guards/pre-registration.guard.ts
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PreRegistrationService } from '../services/pre-registration.service';
import { catchError, map, of } from 'rxjs';

export const preRegistrationGuard: CanActivateFn = (route, state) => {
  const token = route.paramMap.get('token'); // pega o token da URL
  const preRegistrationService = inject(PreRegistrationService);
  const router = inject(Router);

  if (!token) {
    router.navigate(['/']);
    return of(false);
  }

  return preRegistrationService.verifyPreRegistration(token).pipe(
    map(response => {
      const isValid = !!(response.completeName && response.email && response.cellphone);
      if (!isValid) {
        router.navigate(['/']);
      }
      return isValid;
    }),
    catchError(error => {
      console.error('Erro ao verificar token:', error);
      router.navigate(['/']);
      return of(false);
    })
  );
};
