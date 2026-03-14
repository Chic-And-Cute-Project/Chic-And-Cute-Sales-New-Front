import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {UserAuxService} from "../../shared/services/user-aux/user-aux.service";
import {MatSnackBar} from "@angular/material/snack-bar";

export const adminOrBranchRoleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const userAuxService = inject(UserAuxService);
  const snackBar = inject(MatSnackBar);

  const roleParam = route.parent?.paramMap.get('role');

  if (roleParam === 'ADMIN') {
    return true;
  } else if (roleParam === 'BRANCH') {
    if (userAuxService.getUser().branch.name === "Sin sede asignada") {
      snackBar.open("No tiene asignada una sede", "Cerrar", { duration: 4000 });
      return router.createUrlTree(['/home', roleParam]);
    } else {
      return true;
    }
  } else {
    const role = userAuxService.getUserRole();
    return router.createUrlTree(['/home', role]);
  }
};
