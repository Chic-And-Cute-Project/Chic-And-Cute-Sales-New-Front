import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {UserAuxService} from "../../shared/services/user-aux/user-aux.service";

export const correctRoleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const userAuxService = inject(UserAuxService);

  const roleParam = route.parent?.paramMap.get('role');
  const role = userAuxService.getUserRole();

  if (role === roleParam) {
    return true;
  } else {
    return router.createUrlTree(['/home', role]);
  }
};
