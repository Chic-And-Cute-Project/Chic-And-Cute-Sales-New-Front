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
import { HomePrincipal } from './core/pages/home/home-principal/home-principal';
import { HomeSuperadmin } from './core/pages/home/home-superadmin/home-superadmin';
import { HomeAdmin } from './core/pages/home/home-admin/home-admin';
import { HomeBranch } from './core/pages/home/home-branch/home-branch';
import { UsersBranches } from './admin/pages/users-branches/users-branches';
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import { AddUserDialog } from './admin/dialogs/add-user-dialog/add-user-dialog';
import {MatDialogModule} from "@angular/material/dialog";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import { StockPrincipal } from './core/pages/stock/stock-principal/stock-principal';
import { StockAdmin } from './core/pages/stock/stock-admin/stock-admin';
import { StockBranch } from './core/pages/stock/stock-branch/stock-branch';
import { ProductsDiscounts } from './admin/pages/products-discounts/products-discounts';
import {MatTableModule} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import { RemissionGuides } from './admin/pages/remission-guides/remission-guides';
import {MatDatepickerModule} from "@angular/material/datepicker";
import { AddProductDialog } from './admin/dialogs/add-product-dialog/add-product-dialog';
import { AddDiscountDialog } from './admin/dialogs/add-discount-dialog/add-discount-dialog';
import { UpdateDiscountDialog } from './admin/dialogs/update-discount-dialog/update-discount-dialog';
import { ManageProductDialog } from './admin/dialogs/manage-product-dialog/manage-product-dialog';
import {MatCheckbox} from "@angular/material/checkbox";
import { UpdateInventoryDialog } from './core/dialogs/update-inventory-dialog/update-inventory-dialog';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import { StockReceptionPrincipal } from './core/pages/stock-reception/stock-reception-principal/stock-reception-principal';
import { StockReceptionAdmin } from './core/pages/stock-reception/stock-reception-admin/stock-reception-admin';
import { StockReceptionBranch } from './core/pages/stock-reception/stock-reception-branch/stock-reception-branch';
import { PointOfSalePrincipal } from './core/pages/point-of-sale/point-of-sale-principal/point-of-sale-principal';
import { PointOfSaleAdmin } from './core/pages/point-of-sale/point-of-sale-admin/point-of-sale-admin';
import { PointOfSaleBranch } from './core/pages/point-of-sale/point-of-sale-branch/point-of-sale-branch';
import { CloseSalesDaysPrincipal } from './core/pages/close-sales-days/close-sales-days-principal/close-sales-days-principal';
import { CloseSalesDaysAdmin } from './core/pages/close-sales-days/close-sales-days-admin/close-sales-days-admin';
import { CloseSalesDaysBranch } from './core/pages/close-sales-days/close-sales-days-branch/close-sales-days-branch';

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
    AddUserDialog,
    StockPrincipal,
    StockAdmin,
    StockBranch,
    ProductsDiscounts,
    RemissionGuides,
    AddProductDialog,
    AddDiscountDialog,
    UpdateDiscountDialog,
    ManageProductDialog,
    UpdateInventoryDialog,
    StockReceptionPrincipal,
    StockReceptionAdmin,
    StockReceptionBranch,
    PointOfSalePrincipal,
    PointOfSaleAdmin,
    PointOfSaleBranch,
    CloseSalesDaysPrincipal,
    CloseSalesDaysAdmin,
    CloseSalesDaysBranch
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
    MatProgressSpinner,
    MatTableModule,
    MatPaginator,
    MatDatepickerModule,
    MatCheckbox
  ],
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE'}
  ],
  bootstrap: [App]
})
export class AppModule { }
