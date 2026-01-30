import {Component, Inject} from '@angular/core';
import {ProductDto} from "../../models/product.dto";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ProductService} from "../../services/product/product.service";
import {ErrorMessage} from "../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";

type ManageProduct =  {
  product: ProductDto;
}

@Component({
  selector: 'app-manage-product-dialog',
  standalone: false,
  templateUrl: './manage-product-dialog.html',
  styleUrl: './manage-product-dialog.css'
})
export class ManageProductDialog {
  loading: boolean = false;
  deleteValidator: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ManageProductDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ManageProduct,
    private snackBar: MatSnackBar,
    private productService: ProductService
  ) { }

  onUpdateProduct() {
    this.loading = true;
    this.snackBar.open('Actualizando producto');
    this.productService.update(this.data.product.id, this.data.product).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackBar.dismiss();
        this.dialogRef.close(response.product);
      },
      error: (error: ErrorMessage) => {
        this.loading = false;
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
      }
    });
  }

  onDeleteProduct() {
    if (this.deleteValidator) {
      this.loading = true;
      this.snackBar.open('Eliminando producto');
      this.productService.delete(this.data.product.id).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.dismiss();
          this.dialogRef.close(response.message);
        },
        error: (error: ErrorMessage) => {
          this.loading = false;
          this.snackBar.openFromComponent(ErrorSnackBar, {
            data: {
              messages: error.message
            },
            duration: 2000
          });
        }
      });
    } else {
      this.snackBar.open("Seleccionar la casilla para eliminar", "Entendido", {duration: 5000});
    }
  }
}
