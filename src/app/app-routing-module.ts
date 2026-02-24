import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFound} from './shared/pages/page-not-found/page-not-found';
import {Login} from './security/pages/login/login';
import {HomePrincipal} from "./core/pages/home/home-principal/home-principal";
import {noTokenGuard} from "./security/guards/no-token-guard";
import {tokenAndCorrectRoleGuard} from "./core/guards/token-and-correct-role-guard";
import {UsersBranches} from "./admin/pages/users-branches/users-branches";
import {tokenAndAdminRoleGuard} from "./admin/guards/token-and-admin-role-guard";
import {StockPrincipal} from "./core/pages/stock/stock-principal/stock-principal";
import {tokenCorrectRoleAndBranchValidatorGuard} from "./core/guards/token-correct-role-and-branch-validator-guard";
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
import {tokenAndSuperadminRoleGuard} from "./superadmin/guards/token-and-superadmin-role-guard";

const routes: Routes = [
  { path: 'login', component: Login, canActivate: [noTokenGuard] },

  { path: 'home/:role', component: HomePrincipal, canActivate: [tokenAndCorrectRoleGuard]},

  { path: 'stock/:role', component: StockPrincipal, canActivate: [tokenCorrectRoleAndBranchValidatorGuard] },
  { path: 'stock-reception/:role', component: StockReceptionPrincipal, canActivate: [tokenCorrectRoleAndBranchValidatorGuard] },
  { path: 'point-of-sale/:role', component: PointOfSalePrincipal, canActivate: [tokenCorrectRoleAndBranchValidatorGuard] },
  { path: 'close-sales-day/:role', component: CloseSalesDaysPrincipal, canActivate: [tokenCorrectRoleAndBranchValidatorGuard] },
  { path: 'reports/:role', component: ReportPrincipal, canActivate: [tokenCorrectRoleAndBranchValidatorGuard] },
  { path: 'documents/:role', component: DocumentsPrincipal, canActivate: [tokenCorrectRoleAndBranchValidatorGuard] },

  { path: 'users-branches', component: UsersBranches, canActivate: [tokenAndAdminRoleGuard]},
  { path: 'products-discounts', component: ProductsDiscounts, canActivate: [tokenAndAdminRoleGuard]},
  { path: 'remission-guide', component: RemissionGuides, canActivate: [tokenAndAdminRoleGuard]},

  { path: 'forgot-password', component: ForgotPassword, canActivate: [tokenAndSuperadminRoleGuard]},

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
