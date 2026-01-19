import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../core/services/user/user.service";
import {UserAuxService} from "../../shared/services/user-aux/user-aux.service";
import {CommunicationService} from "../../shared/services/communication/communication.service";
import {catchError, map, of} from "rxjs";
import {ErrorMessage} from "../../shared/models/error-message";
import {ErrorSnackBar} from "../../shared/pages/error-snack-bar/error-snack-bar";

export const tokenAndAdminRoleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const userService = inject(UserService);
  const userAuxService = inject(UserAuxService);
  const communicationService = inject(CommunicationService);

  if (localStorage.getItem('token')) {
    return userService.getObject().pipe(
      map((response) => {
        userAuxService.setUser(response.user);

        const role = userAuxService.getUserRole();
        if (role === 'ADMIN') {
          communicationService.emitTitleChange({ name: response.user.name + " " + response.user.lastName, branch: "Administrador" });
          return true;
        } else {
          return router.createUrlTree(['/home', role]);
        }
      }),
      catchError((error: ErrorMessage) => {
        localStorage.removeItem('token');
        snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        return of(router.createUrlTree(['/login']));
      })
    );
  } else {
    return router.createUrlTree(['/login']);
  }
};
