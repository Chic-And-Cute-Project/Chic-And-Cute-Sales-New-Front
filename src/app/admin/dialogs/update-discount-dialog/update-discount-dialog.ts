import {Component, Inject} from '@angular/core';
import {DiscountDto} from "../../models/discount.dto";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DiscountService} from "../../services/discount/discount.service";
import {ErrorMessage} from "../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";

type UpdateDiscount = {
  discount: DiscountDto;
}
@Component({
  selector: 'app-update-discount-dialog',
  standalone: false,
  templateUrl: './update-discount-dialog.html',
  styleUrl: './update-discount-dialog.css'
})
export class UpdateDiscountDialog {
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UpdateDiscountDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateDiscount,
    private snackBar: MatSnackBar,
    private discountService: DiscountService
  ) { }

  onUpdateDiscount() {
    this.loading = true;
    this.snackBar.open('Actualizando descuento');
    this.discountService.update(this.data.discount.id, this.data.discount).subscribe({
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
