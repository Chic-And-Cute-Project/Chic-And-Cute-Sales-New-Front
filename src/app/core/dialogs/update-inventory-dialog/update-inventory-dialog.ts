import {Component, Inject} from '@angular/core';
import {InventoryDto} from "../../models/inventory.dto";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ProductService} from "../../../admin/services/product/product.service";
import {InventoryService} from "../../services/inventory/inventory.service";
import {ErrorMessage} from "../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";

type UpdateInventory = {
  inventory: InventoryDto;
}

@Component({
  selector: 'app-update-inventory-dialog',
  standalone: false,
  templateUrl: './update-inventory-dialog.html',
  styleUrl: './update-inventory-dialog.css'
})
export class UpdateInventoryDialog {
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UpdateInventoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateInventory,
    private snackBar: MatSnackBar,
    private inventoryService: InventoryService
  ) { }

  onUpdateInventory() {
    this.loading = true;
    this.snackBar.open('Actualizando inventario');
    this.inventoryService.update(this.data.inventory.id, this.data.inventory).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackBar.dismiss();
        this.dialogRef.close(response.inventory);
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
