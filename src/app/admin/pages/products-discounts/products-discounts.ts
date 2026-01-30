import {Component, OnInit} from '@angular/core';
import {ProductDto} from "../../models/product.dto";
import {DiscountDto} from "../../models/discount.dto";
import {PageEvent} from "@angular/material/paginator";
import {ProductService} from "../../services/product/product.service";
import {DiscountService} from "../../services/discount/discount.service";
import {ErrorMessage} from "../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {UserDto} from "../../../core/models/user.dto";
import {AddProductDialog} from "../../dialogs/add-product-dialog/add-product-dialog";
import {AddDiscountDialog} from "../../dialogs/add-discount-dialog/add-discount-dialog";
import {UpdateDiscountDialog} from "../../dialogs/update-discount-dialog/update-discount-dialog";
import {ManageProductDialog} from "../../dialogs/manage-product-dialog/manage-product-dialog";

@Component({
  selector: 'app-products-discounts',
  standalone: false,
  templateUrl: './products-discounts.html',
  styleUrl: './products-discounts.css'
})
export class ProductsDiscounts implements OnInit {
  productsSize: number = 0;
  pageIndex: number = 0;

  searchingMode: boolean = false;

  productCode: string = '';

  displayedColumns: string[] = ['code', 'price'];
  displayedColumnsDiscount: string[] = ['name', 'discount', 'productAssociated'];

  products: ProductDto[];
  discounts: DiscountDto[];

  constructor(private productService: ProductService, private discountService: DiscountService,
              private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.products = [];
    this.discounts = [];
  }

  ngOnInit() {
    this.refreshDiscounts();
    this.refreshProducts(this.pageIndex, true);
  }

  refreshProducts(page: number, firstRequest: boolean) {
    if (firstRequest) {
      this.productService.count().subscribe({
        next: (response) => {
          this.productsSize = response.count;
        },
        error: (error: ErrorMessage) => {
          this.snackBar.openFromComponent(ErrorSnackBar, {
            data: {
              messages: error.message
            },
            duration: 2000
          });
        }
      });
    }
    this.productService.getAllByPage(page).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.products = response.products;
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
      }
    });
  }

  refreshDiscounts() {
    this.discountService.getAll().subscribe({
      next: (response) => {
        this.discounts = response.discounts;
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
      }
    });
  }

  searchProducts(page: number, firstRequest: boolean) {
    if (firstRequest) {
      this.productService.countByProductCode(this.productCode).subscribe({
        next: (response) => {
          this.productsSize = response.count;
        },
        error: (error: ErrorMessage) => {
          this.snackBar.openFromComponent(ErrorSnackBar, {
            data: {
              messages: error.message
            },
            duration: 2000
          });
        }
      });
    }
    this.productService.searchProductByPage(this.productCode, page).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.products = response.products;
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
      }
    });
  }

  searchProduct() {
    if (this.productCode != "") {
      this.pageIndex = 0;
      this.searchingMode = true;
      this.snackBar.open("Buscando productos");
      this.searchProducts(0, true);
    } else {
      this.snackBar.open("Código de producto vacío", "Entendido", { duration: 2000});
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    if (this.searchingMode) {
      this.searchProducts(e.pageIndex, false);
    } else {
      this.refreshProducts(e.pageIndex, false);
    }
  }

  createProduct() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      product: {}
    };

    const dialogRef = this.dialog.open(AddProductDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: UserDto) => {
      if (result) {
        if (this.searchingMode) {
          this.searchProducts(this.pageIndex, true);
        } else {
          this.refreshProducts(this.pageIndex, true);
        }
      }
    });
  }

  reloadSearch() {
    if (this.searchingMode) {
      this.pageIndex = 0;
      this.searchingMode = false;
      this.productCode = "";
      this.snackBar.open("Actualizando");
      this.refreshProducts(0, true);
    }
  }

  manageProduct(product: ProductDto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      product: {...product}
    };

    const dialogRef = this.dialog.open(ManageProductDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: UserDto) => {
      if (result) {
        if (this.searchingMode) {
          this.searchProducts(this.pageIndex, true);
        } else {
          this.refreshProducts(this.pageIndex, true);
        }
      }
    });
  }

  createDiscount() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      discount: {}
    };

    const dialogRef = this.dialog.open(AddDiscountDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: UserDto) => {
      if (result) {
        this.refreshDiscounts();
      }
    });
  }

  updateDiscount(discount: DiscountDto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      discount: {...discount}
    };

    const dialogRef = this.dialog.open(UpdateDiscountDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: UserDto) => {
      if (result) {
        this.refreshDiscounts();
      }
    });
  }
}
