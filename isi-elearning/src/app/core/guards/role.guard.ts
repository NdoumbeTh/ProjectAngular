import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard = (expectedRole: string): CanActivateFn => {

  return () => {

    const router = inject(Router);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user || !user.role) {
      router.navigate(['/']);
      return false;
    }

    if (user.role !== expectedRole) {
      router.navigate(['/dashboard']); // redirection sécurité
      return false;
    }

    return true;
  };

};
