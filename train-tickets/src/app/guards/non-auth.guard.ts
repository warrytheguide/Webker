import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs/operators';

export const nonAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1), // Take only the first emission and complete
    map((user) => {
      if (!user) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};
