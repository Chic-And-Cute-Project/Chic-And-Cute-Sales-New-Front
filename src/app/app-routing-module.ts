import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFound} from './shared/pages/page-not-found/page-not-found';
import {Login} from './security/pages/login/login';

const routes: Routes = [
  { path: 'login', component: Login },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
