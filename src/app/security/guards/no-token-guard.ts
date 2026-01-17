import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../core/services/user/user.service";
import {catchError, map, of} from "rxjs";
import {ErrorMessage} from "../../shared/models/error-message";
import {ErrorSnackBar} from "../../shared/pages/error-snack-bar/error-snack-bar";

export const noTokenGuard: CanActivateFn = () => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const userService = inject(UserService);

  if (localStorage.getItem('token')) {
    return userService.getObject().pipe(
      map((response) => {
        return router.createUrlTree(['/home', response.user.role]);
      }),
      catchError((error: ErrorMessage) => {
        localStorage.removeItem('token');
        snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        return of(true);
      })
    );
  } else {
    return true;
  }
};
