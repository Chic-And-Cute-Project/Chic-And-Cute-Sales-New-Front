import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFound} from './shared/pages/page-not-found/page-not-found';
import {Login} from './security/pages/login/login';
import {HomePrincipal} from "./core/pages/home/home-principal/home-principal";
import {noTokenGuard} from "./security/guards/no-token-guard";
import {tokenAndCorrectRoleGuard} from "./core/guards/token-and-correct-role-guard";
import {UsersBranches} from "./admin/pages/users-branches/users-branches";
import {tokenAndAdminRoleGuard} from "./admin/guards/token-and-admin-role-guard";
import {StockPrincipal} from "./core/pages/stock-principal/stock-principal";
import {tokenCorrectRoleAndBranchValidatorGuard} from "./core/guards/token-correct-role-and-branch-validator-guard";
import {ProductsDiscounts} from "./admin/pages/products-discounts/products-discounts";

const routes: Routes = [
  { path: 'login', component: Login, canActivate: [noTokenGuard] },

  { path: 'home/:role', component: HomePrincipal, canActivate: [tokenAndCorrectRoleGuard]},

  { path: 'stock/:role', component: StockPrincipal, canActivate: [tokenCorrectRoleAndBranchValidatorGuard] },

  { path: 'users-branches', component: UsersBranches, canActivate: [tokenAndAdminRoleGuard]},
  { path: 'products-discounts', component: ProductsDiscounts, canActivate: [tokenAndAdminRoleGuard]},

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
