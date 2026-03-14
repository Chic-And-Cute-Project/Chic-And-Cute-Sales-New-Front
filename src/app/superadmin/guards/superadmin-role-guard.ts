import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {UserAuxService} from "../../shared/services/user-aux/user-aux.service";

export const superadminRoleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const userAuxService = inject(UserAuxService);

  const roleParam = route.parent?.paramMap.get('role');

  if (roleParam === 'SUPER_ADMIN') {
    return true;
  } else {
    const role = userAuxService.getUserRole();
    return router.createUrlTree(['/home', role]);
  }
};
