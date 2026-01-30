import {Component, Inject} from '@angular/core';
import {ProductDto} from "../../models/product.dto";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ProductService} from "../../services/product/product.service";
import {ErrorMessage} from "../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";

type AddProduct = {
  product: ProductDto;
}

@Component({
  selector: 'app-add-product-dialog',
  standalone: false,
  templateUrl: './add-product-dialog.html',
  styleUrl: './add-product-dialog.css'
})
export class AddProductDialog {
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddProductDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddProduct,
    private snackBar: MatSnackBar,
    private productService: ProductService
  ) { }

  onCreateProduct() {
    this.loading = true;
    this.snackBar.open('Creando producto');
    this.productService.create(this.data.product).subscribe({
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
}
