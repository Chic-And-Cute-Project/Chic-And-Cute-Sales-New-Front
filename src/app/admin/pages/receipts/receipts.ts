import { Component } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ErrorMessage} from "../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";
import {CustomReceiptDto} from "../../../core/models/custom-receipt.dto";
import {CustomReceiptService} from "../../../core/services/custom-receipt/custom-receipt.service";
import {environment} from "../../../../environment/environment";

@Component({
  selector: 'app-receipts',
  standalone: false,
  templateUrl: './receipts.html',
  styleUrl: './receipts.css'
})
export class Receipts {
  loading: boolean = false;

  displayedColumns: string[] = ['sequence', 'name', 'documentNumber', 'phoneNumber', 'address', 'district', 'province', 'createdAt'];

  customReceipts: CustomReceiptDto[] = [];

  constructor(private customReceiptsService: CustomReceiptService, private snackBar: MatSnackBar) {
    this.customReceipts = [];
  }

  ngOnInit() {
    this.refreshCustomReceipts();
  }

  refreshCustomReceipts() {
    this.loading = true;
    this.customReceiptsService.getAll().subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.customReceipts = response.customReceipts;
        this.loading = false;
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

  generateExcel() {
    window.open(`${environment.apiUrl}custom-receipts/excel`, '_blank');
  }
}
