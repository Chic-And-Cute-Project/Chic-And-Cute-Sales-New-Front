import {CanActivateFn, Router} from '@angular/router';
import {UserService} from "../services/user/user.service";
import {inject} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {catchError, map, of} from "rxjs";
import {ErrorMessage} from "../../shared/models/error-message";
import {ErrorSnackBar} from "../../shared/pages/error-snack-bar/error-snack-bar";
import {UserAuxService} from "../../shared/services/user-aux/user-aux.service";
import {CommunicationService} from "../../shared/services/communication/communication.service";

export const tokenGuard: CanActivateFn = () => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const userService = inject(UserService);
  const userAuxService = inject(UserAuxService);
  const communicationService = inject(CommunicationService);

  if (localStorage.getItem('token')) {
    if (userAuxService.getUser().id === undefined) {
      return userService.getObject().pipe(
        map((response) => {
          userAuxService.setUser(response.user);

          const role = userAuxService.getUserRole();
          if (role === 'ADMIN') {
            communicationService.emitTitleChange({ name: response.user.name + " " + response.user.lastName, branch: 'Administrador' });
          } else if (role === 'SUPER_ADMIN') {
            communicationService.emitTitleChange({ name: response.user.name + " " + response.user.lastName, branch: 'Superadmin' });
          } else if (role === 'BRANCH') {
            communicationService.emitTitleChange({ name: response.user.name + " " + response.user.lastName, branch: response.user.branch.name });
          }
          return true;
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
      return true;
    }
  } else {
    return router.createUrlTree(['/login']);
  }
};
