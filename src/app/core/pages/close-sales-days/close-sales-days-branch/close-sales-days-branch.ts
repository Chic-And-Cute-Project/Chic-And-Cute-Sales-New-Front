import {Component, OnInit} from '@angular/core';
import {CloseSalesDayDto} from "../../../models/close-sales-day.dto";
import {SaleDto} from "../../../models/sale.dto";
import {SaleService} from "../../../services/sale/sale.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserAuxService} from "../../../../shared/services/user-aux/user-aux.service";
import {CloseSalesDaySalesDto} from "../../../models/close-sales-day-sales.dto";
import {ErrorMessage} from "../../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../../shared/pages/error-snack-bar/error-snack-bar";
import {CloseSalesDayService} from "../../../services/close-sales-day/close-sales-day.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-close-sales-days-branch',
  standalone: false,
  templateUrl: './close-sales-days-branch.html',
  styleUrl: './close-sales-days-branch.css'
})
export class CloseSalesDaysBranch implements OnInit {
  savingCloseSalesDay: boolean = false;

  cashCount: number = 0;
  cardCount: number = 0;

  closeSalesDay: CloseSalesDayDto;

  sales: SaleDto[];

  constructor(private saleService: SaleService, private closeSalesDayService: CloseSalesDayService,
              private snackBar: MatSnackBar, private userAuxService: UserAuxService,
              private router: Router) {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    this.closeSalesDay = {
      date: date,
      branchId: this.userAuxService.getUser().branch.id,
      closeSalesDaySales: [] as CloseSalesDaySalesDto[],
    } as CloseSalesDayDto;
    this.sales = [];
  }

  ngOnInit() {
    this.refreshSales();
  }

  refreshSales() {
    this.saleService.getAllByMyBranchAndDate(this.closeSalesDay.date).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.closeSalesDay.sales = response.sales;
        this.closeSalesDay.cashAmount = response.cashAmount;
        this.closeSalesDay.cardAmount = response.cardAmount;
        this.cashCount = response.cashCount;
        this.cardCount = response.cardCount;
        this.closeSalesDay.totalAmount = this.closeSalesDay.cashAmount + this.closeSalesDay.cardAmount;
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

  saveCloseSalesDay() {
    this.savingCloseSalesDay = true;
    for (const sale of this.closeSalesDay.sales) {
      const closeSalesDaySaleDto: CloseSalesDaySalesDto = { saleId: sale.id } as CloseSalesDaySalesDto;
      this.closeSalesDay.closeSalesDaySales.push(closeSalesDaySaleDto);
    }
    this.snackBar.open('Creando cierre de caja');
    this.closeSalesDayService.create(this.closeSalesDay).subscribe({
      next: () => {
        this.savingCloseSalesDay = false;
        this.snackBar.dismiss();
        this.router.navigate(['/home/BRANCH']).then();
      },
      error: (error: ErrorMessage) => {
        this.savingCloseSalesDay = false;
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
      }
    });
  }

  printPdf() {

  }
}
