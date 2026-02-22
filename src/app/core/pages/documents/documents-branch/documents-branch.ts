import {Component, OnInit} from '@angular/core';
import {CloseSalesDayDto} from "../../../models/close-sales-day.dto";
import {ErrorMessage} from "../../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../../shared/pages/error-snack-bar/error-snack-bar";
import {CloseSalesDayService} from "../../../services/close-sales-day/close-sales-day.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-documents-branch',
  standalone: false,
  templateUrl: './documents-branch.html',
  styleUrl: './documents-branch.css'
})
export class DocumentsBranch implements OnInit {
  minDate: Date;
  maxDate: Date;

  closeSalesDaySelected: CloseSalesDayDto;

  closeSalesDays: CloseSalesDayDto[];

  constructor(private closeSalesDayService: CloseSalesDayService, private snackBar: MatSnackBar) {
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
    this.maxDate = new Date();
    this.maxDate.setHours(0, 0, 0, 0);
    this.maxDate.setDate(this.maxDate.getDate() + 1);
    this.closeSalesDaySelected = {} as CloseSalesDayDto;
    this.closeSalesDays = [];
  }

  ngOnInit(): void {
    this.refreshDocuments();
  }

  refreshDocuments() {
    this.closeSalesDayService.getAllByMyBranchAndDate(this.minDate, this.maxDate).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.closeSalesDays = response.closeSalesDays.map(closeSalesDay => {
          closeSalesDay.totalAmount = Number(closeSalesDay.cashAmount) + Number(closeSalesDay.cardAmount);
          return closeSalesDay;
        });
        this.closeSalesDaySelected = {} as CloseSalesDayDto;
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

  selectDocument(closeSalesDay: CloseSalesDayDto) {
    this.closeSalesDaySelected.show = false;
    this.closeSalesDaySelected = closeSalesDay;
    this.closeSalesDaySelected.show = true;
  }
}
