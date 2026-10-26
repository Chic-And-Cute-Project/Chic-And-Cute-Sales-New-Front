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
import {CustomReceiptService} from "../../../services/custom-receipt/custom-receipt.service";

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

  branchName: string;

  constructor(private branchService: BranchService, private saleService: SaleService,
              private closeSalesDayService: CloseSalesDayService, private customReceiptService: CustomReceiptService,
              private userAuxService: UserAuxService, private snackBar: MatSnackBar,
              private router: Router, private datePipe: DatePipe) {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    this.closeSalesDay = {
      date: date,
      closeSalesDaySales: [] as CloseSalesDaySalesDto[],
    } as CloseSalesDayDto;
    this.branches = [];
    this.sales = [];
    this.branchName = '';
  }

  async ngOnInit(): Promise<void> {
    try {
      const branchApiResponse = await firstValueFrom(this.branchService.getAllByActive());
      this.branches = branchApiResponse.branches;
      this.closeSalesDay.branchId = this.branches[0].id;
      this.branchName = this.branches[0].name;

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
        const branch = this.branches.find(branch => branch.id === this.closeSalesDay.branchId);
        if (branch) {
          this.branchName = branch.name;
        }
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

  printReceipt(sale: SaleDto) {
    sale.finalPrice = 0;
    for (const salePaymentMethod of sale.paymentMethod) {
      sale.finalPrice = sale.finalPrice + Number(salePaymentMethod.amount);
    }
    for (const saleDetail of sale.detail) {
      saleDetail.finalPrice = 0;
      let price = saleDetail.quantity * Number(saleDetail.product.price);
      if (saleDetail.discount !== null) {
        price = price - (price * saleDetail.discount * 0.01);
      }
      saleDetail.finalPrice = Number(price.toFixed(2));
    }
    this.customReceiptService.getBySaleId(sale.id).subscribe({
      next: async (response) => {
        const pageWidth = 74;

        const logo = await this.getBase64Image('receipt-logo.png');
        const logoWidth = 30;
        const logoHeight = logoWidth * (157 / 374);

        let currentY = 3;
        currentY += logoHeight + 5 + 7;
        currentY += 8 * 9;
        currentY += 9;
        for (const detail of sale.detail) {
          currentY += detail.discount > 0 ? 12 : 8;
        }
        currentY += 7;
        currentY += 20;
        const pageHeight = currentY;

        const doc = new jspdf.jsPDF({ unit: 'mm', format: [pageWidth, pageHeight]});
        doc.addImage(logo, 'PNG', (pageWidth - logoWidth) / 2, 5, logoWidth, logoHeight);
        currentY = 3 + logoHeight + 5;
        doc.setFontSize(7);
        doc.text('Calle Boulevard 182 OF 404 Surco', pageWidth / 2, currentY, { align: 'center' });
        currentY += 7;

        doc.setFontSize(8);
        doc.text(`Guia: ${response.customReceipt.sequence}`, 5, currentY);
        currentY += 8;
        doc.text(`Nombre: ${response.customReceipt.name ?? ''}`, 5, currentY);
        currentY += 8;
        doc.text(`Dni: ${response.customReceipt.documentNumber ?? ''}`, 5, currentY);
        currentY += 8;
        doc.text(`Teléfono: ${response.customReceipt.phoneNumber ?? ''}`, 5, currentY);
        currentY += 8;
        doc.text(`Dirección: ${response.customReceipt.address ?? ''}`, 5, currentY);
        currentY += 8;
        doc.text(`Distrito: ${response.customReceipt.district ?? ''}`, 5, currentY);
        currentY += 8;
        doc.text(`Provincia: ${response.customReceipt.province ?? ''}`, 5, currentY);
        currentY += 8;
        doc.text(`Vendedor: ${sale.user.name}`, 5, currentY);
        currentY += 8;
        doc.text(`Método de pago: ${sale.paymentMethod.length === 1 ? sale.paymentMethod[0].type === 'VISA' ? 'Visa' : 'Efectivo' : 'Visa - Efectivo'}`, 5, currentY);
        currentY += 8;

        doc.setFontSize(9);
        doc.text('DETALLE DE COMPRA', pageWidth / 2, currentY, { align: 'center' });
        currentY += 9;
        doc.setFontSize(8);
        for (const detail of sale.detail) {
          doc.text(`${detail.quantity} x ${detail.product.code}`, 5, currentY);
          doc.text(`S/. ${detail.finalPrice.toFixed(2)}`, pageWidth - 5, currentY, { align: 'right' });
          currentY += 5;
          if (detail.discount > 0) {
            const discountAmount = detail.product.price * detail.quantity * (detail.discount / 100);
            doc.setFontSize(7);
            doc.text(`Descuento (${detail.discount}%): -S/. ${discountAmount.toFixed(2)}`, 5, currentY);
            currentY += 7;
            doc.setFontSize(8);
          } else {
            currentY += 3;
          }
        }

        doc.line(5, currentY, pageWidth - 5, currentY);
        currentY += 7;

        doc.setFontSize(10);
        doc.text('TOTAL', 5, currentY);
        doc.text(`S/. ${sale.finalPrice.toFixed(2)}`, pageWidth - 5, currentY, { align: 'right' });

        doc.save('Recibo');
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

  private getBase64Image(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = reject;
      img.src = url;
    });
  }
}
