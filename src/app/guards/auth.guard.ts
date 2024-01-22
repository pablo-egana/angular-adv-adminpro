import { inject } from '@angular/core';
import { CanActivateFn, CanLoadFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const userService: UserService = inject(UserService);
  const router: Router = inject(Router);

  return userService.validateToken()
    .pipe(tap(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigateByUrl('/login');
      }
    }));

};

export const canLoad: CanLoadFn = (route, state) => {

  const userService: UserService = inject(UserService);
  const router: Router = inject(Router);

  return userService.validateToken()
    .pipe(tap(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigateByUrl('/login');
      }
    }));

}
