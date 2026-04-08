import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFound} from './shared/pages/page-not-found/page-not-found';
import {Login} from './security/pages/login/login';
import {HomePrincipal} from "./core/pages/home/home-principal/home-principal";
import {noTokenGuard} from "./security/guards/no-token-guard";
import {UsersBranches} from "./admin/pages/users-branches/users-branches";
import {StockPrincipal} from "./core/pages/stock/stock-principal/stock-principal";
import {ProductsDiscounts} from "./admin/pages/products-discounts/products-discounts";
import {RemissionGuides} from "./admin/pages/remission-guides/remission-guides";
import {
  StockReceptionPrincipal
} from "./core/pages/stock-reception/stock-reception-principal/stock-reception-principal";
import {PointOfSalePrincipal} from "./core/pages/point-of-sale/point-of-sale-principal/point-of-sale-principal";
import {
  CloseSalesDaysPrincipal
} from "./core/pages/close-sales-days/close-sales-days-principal/close-sales-days-principal";
import {ReportPrincipal} from "./core/pages/report/report-principal/report-principal";
import {DocumentsPrincipal} from "./core/pages/documents/documents-principal/documents-principal";
import {ForgotPassword} from "./superadmin/pages/forgot-password/forgot-password";
import {tokenGuard} from "./core/guards/token-guard";
import {correctRoleGuard} from "./core/guards/correct-role-guard";
import {superadminRoleGuard} from "./superadmin/guards/superadmin-role-guard";
import {adminRoleGuard} from "./admin/guards/admin-role-guard";
import {adminOrBranchRoleGuard} from "./core/guards/admin-or-branch-role-guard";
import {Profile} from "./core/pages/profile/profile";
import {SupplyBranch} from "./admin/pages/supply-branch/supply-branch";
import {IntakeBranch} from "./admin/pages/intake-branch/intake-branch";
import {ManageBranches} from "./superadmin/pages/manage-branches/manage-branches";

const routes: Routes = [
  { path: 'login', component: Login, canActivate: [noTokenGuard] },

  {
    path: 'home/:role',
    component: HomePrincipal,
    canActivate: [tokenGuard],
    children: [
      { path: 'profile', component: Profile, canActivate: [correctRoleGuard] },

      { path: 'stock', component: StockPrincipal, canActivate: [correctRoleGuard, adminOrBranchRoleGuard] },
      { path: 'stock-reception', component: StockReceptionPrincipal, canActivate: [correctRoleGuard, adminOrBranchRoleGuard] },
      { path: 'point-of-sale', component: PointOfSalePrincipal, canActivate: [correctRoleGuard, adminOrBranchRoleGuard] },
      { path: 'close-sales-day', component: CloseSalesDaysPrincipal, canActivate: [correctRoleGuard, adminOrBranchRoleGuard] },
      { path: 'reports', component: ReportPrincipal, canActivate: [correctRoleGuard, adminOrBranchRoleGuard] },
      { path: 'documents', component: DocumentsPrincipal, canActivate: [correctRoleGuard, adminOrBranchRoleGuard] },

      { path: 'users-branches', component: UsersBranches, canActivate: [correctRoleGuard, adminRoleGuard]},
      { path: 'products-discounts', component: ProductsDiscounts, canActivate: [correctRoleGuard, adminRoleGuard]},
      { path: 'remission-guide', component: RemissionGuides, canActivate: [correctRoleGuard, adminRoleGuard]},
      { path: 'supply-branch', component: SupplyBranch, canActivate: [correctRoleGuard, adminRoleGuard]},
      { path: 'intake-branch', component: IntakeBranch, canActivate: [correctRoleGuard, adminRoleGuard]},

      { path: 'forgot-password', component: ForgotPassword, canActivate: [correctRoleGuard, superadminRoleGuard]},
      { path: 'manage-branches', component: ManageBranches, canActivate: [correctRoleGuard, superadminRoleGuard]},

      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: '**', component: PageNotFound }
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
