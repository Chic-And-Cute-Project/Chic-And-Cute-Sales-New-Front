import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import {provideHttpClient} from '@angular/common/http';
import {MatToolbar} from '@angular/material/toolbar';
import { Login } from './security/pages/login/login';
import { PageNotFound } from './shared/pages/page-not-found/page-not-found';
import {ErrorSnackBar} from './shared/pages/error-snack-bar/error-snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import { HomePrincipal } from './core/pages/home-principal/home-principal';
import { HomeSuperadmin } from './core/pages/home-superadmin/home-superadmin';
import { HomeAdmin } from './core/pages/home-admin/home-admin';
import { HomeBranch } from './core/pages/home-branch/home-branch';
import { UsersBranches } from './admin/pages/users-branches/users-branches';
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import { AddUserDialog } from './admin/dialogs/add-user.dialog/add-user.dialog';
import {MatDialogModule} from "@angular/material/dialog";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    App,
    Login,
    PageNotFound,
    ErrorSnackBar,
    HomePrincipal,
    HomeSuperadmin,
    HomeAdmin,
    HomeBranch,
    UsersBranches,
    AddUserDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbar,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInput,
    FormsModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinner
  ],
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
