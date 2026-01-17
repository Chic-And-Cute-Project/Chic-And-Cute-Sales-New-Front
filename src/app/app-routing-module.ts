import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFound} from './shared/pages/page-not-found/page-not-found';
import {Login} from './security/pages/login/login';
import {HomePrincipal} from "./core/pages/home-principal/home-principal";
import {noTokenGuard} from "./security/guards/no-token-guard";

const routes: Routes = [
  { path: 'login', component: Login, canActivate: [noTokenGuard] },

  { path: 'home/:role', component: HomePrincipal},

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
