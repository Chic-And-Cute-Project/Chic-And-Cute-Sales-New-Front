import {Component, Inject} from '@angular/core';
import {DiscountDto} from "../../models/discount.dto";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DiscountService} from "../../services/discount/discount.service";
import {ErrorMessage} from "../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";

type AddDiscount ={
  discount: DiscountDto
}

@Component({
  selector: 'app-add-discount-dialog',
  standalone: false,
  templateUrl: './add-discount-dialog.html',
  styleUrl: './add-discount-dialog.css'
})
export class AddDiscountDialog {
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddDiscountDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddDiscount,
    private snackBar: MatSnackBar,
    private discountService: DiscountService
  ) { }

  onCreateDiscount() {
    this.loading = true;
    this.snackBar.open('Creando descuento');
    this.discountService.create(this.data.discount).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackBar.dismiss();
        this.dialogRef.close(response.discount);
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
