import {Component, OnInit} from '@angular/core';
import {BranchDto} from "../../../models/branch.dto";
import {CloseSalesDayDto} from "../../../models/close-sales-day.dto";
import {SaleDto} from "../../../models/sale.dto";
import {firstValueFrom} from "rxjs";
import {ErrorSnackBar} from "../../../../shared/pages/error-snack-bar/error-snack-bar";
import {BranchService} from "../../../../admin/services/branch/branch.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ErrorMessage} from "../../../../shared/models/error-message";
import {SaleService} from "../../../services/sale/sale.service";
import {CloseSalesDayService} from "../../../services/close-sales-day/close-sales-day.service";
import {Router} from "@angular/router";
import {CloseSalesDaySalesDto} from "../../../models/close-sales-day-sales.dto";
import * as jspdf from "jspdf";
import {UserAuxService} from "../../../../shared/services/user-aux/user-aux.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-close-sales-days-admin',
  standalone: false,
  templateUrl: './close-sales-days-admin.html',
  styleUrl: './close-sales-days-admin.css'
})
export class CloseSalesDaysAdmin implements OnInit {
  savingCloseSalesDay: boolean = false;

  cashCount: number = 0;
  cardCount: number = 0;

  closeSalesDay: CloseSalesDayDto;

  branches: BranchDto[];
  sales: SaleDto[];

  constructor(private branchService: BranchService, private saleService: SaleService,
              private closeSalesDayService: CloseSalesDayService, private userAuxService: UserAuxService,
              private snackBar: MatSnackBar, private router: Router,
              private datePipe: DatePipe) {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    this.closeSalesDay = {
      date: date,
      closeSalesDaySales: [] as CloseSalesDaySalesDto[],
    } as CloseSalesDayDto;
    this.branches = [];
    this.sales = [];
  }

  async ngOnInit(): Promise<void> {
    try {
      const branchApiResponse = await firstValueFrom(this.branchService.getAllByActive());
      this.branches = branchApiResponse.branches;
      this.closeSalesDay.branchId = this.branches[0].id;

      this.refreshSales();
    } catch (error: any) {
      this.snackBar.openFromComponent(ErrorSnackBar, {
        data: {
          messages: error.message
        },
        duration: 2000
      });
    }
  }

  refreshSales() {
    this.saleService.getAllByBranchAndDate(this.closeSalesDay.branchId, this.closeSalesDay.date).subscribe({
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
        this.router.navigate(['/home/ADMIN']).then();
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
    const branch = this.branches.find(branch => branch.id === this.closeSalesDay.branchId);
    if (branch) {
      let doc = new jspdf.jsPDF({ format: "a7" });
      doc.setFontSize(10);
      doc.text(`Vendedor: ${this.userAuxService.getUser().username}`, 5, 10);
      doc.text(`Sede: ${branch?.name}`, 5, 20);
      doc.text(`Fecha de cierre: ${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}`, 5, 30);
      doc.text("Reporte de ventas", 37, 40, { align: "center"});
      doc.text(`Efectivo (${this.cashCount})\t S/.${this.closeSalesDay.cashAmount}`, 5, 50);
      doc.text(`Visa (${this.cardCount})\t\t S/.${this.closeSalesDay.cardAmount}`, 5, 60);
      doc.text(`Total \t\t S/.${this.closeSalesDay.totalAmount}`, 5, 70);
      doc.save('Cierre de caja');
    }
  }

  deleteSale(sale: SaleDto) {
    this.snackBar.open('Eliminando venta');
    this.saleService.delete(sale.id).subscribe({
      next: () => {
        this.snackBar.dismiss();
        this.refreshSales();
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
