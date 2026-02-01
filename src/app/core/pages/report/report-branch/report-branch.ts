import { Component } from '@angular/core';
import {SaleDetailDto} from "../../../models/sale-detail.dto";
import {SaleService} from "../../../services/sale/sale.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ErrorMessage} from "../../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../../shared/pages/error-snack-bar/error-snack-bar";

@Component({
  selector: 'app-report-branch',
  standalone: false,
  templateUrl: './report-branch.html',
  styleUrl: './report-branch.css'
})
export class ReportBranch {
  count: number = 0;

  cashAmount: number = 0;
  cardAmount: number = 0;
  totalAmount: number = 0;

  displayedColumns: string[] = ['code', 'quantity', 'finalPrice'];

  minDate: Date;
  maxDate: Date;

  saleDetails: SaleDetailDto[];

  constructor(private saleService: SaleService, private snackBar: MatSnackBar) {
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
    this.maxDate = new Date();
    this.maxDate.setHours(0, 0, 0, 0);
    this.maxDate.setDate(this.maxDate.getDate() + 1);
    this.saleDetails = [];
  }

  searchSales() {
    this.saleService.getMyReport(this.minDate, this.maxDate).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.saleDetails = response.saleDetails;
        this.cashAmount = response.cashAmount;
        this.cardAmount = response.cardAmount;
        this.count = response.count;
        this.totalAmount = this.cashAmount + this.cardAmount;
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
}
