import {Component, Inject} from '@angular/core';
import {CustomReceiptDto} from "../../models/custom-receipt.dto";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import * as jspdf from "jspdf";
import {ErrorMessage} from "../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";
import {SaleDetailDto} from "../../models/sale-detail.dto";
import {CustomReceiptService} from "../../services/custom-receipt/custom-receipt.service";

type GenerateCustomReceipt = {
  receipt: CustomReceiptDto;
  salesPersonName: string;
  paymentMethod: string;
  detail: SaleDetailDto[];
  finalPrice: number;
};

@Component({
  selector: 'app-generate-custom-receipt-dialog',
  standalone: false,
  templateUrl: './generate-custom-receipt-dialog.html',
  styleUrl: './generate-custom-receipt-dialog.css'
})
export class GenerateCustomReceiptDialog {
  loading: boolean = false;

  constructor(
      public dialogRef: MatDialogRef<GenerateCustomReceiptDialog>,
      @Inject(MAT_DIALOG_DATA) public data: GenerateCustomReceipt,
      private snackBar: MatSnackBar,
      private customReceiptService: CustomReceiptService
  ) { }

  async generateReceipt() {
    const pageWidth = 74;

    const logo = await this.getBase64Image('receipt-logo.png');
    const logoWidth = 30;
    const logoHeight = logoWidth * (157 / 374);

    let currentY = 3;
    currentY += logoHeight + 5 + 7;
    currentY += 8 * 9;
    currentY += 9;
    for (const detail of this.data.detail) {
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
    doc.text(`Guia: ${this.data.receipt.sequence}`, 5, currentY);
    currentY += 8;
    doc.text(`Nombre: ${this.data.receipt.name ?? ''}`, 5, currentY);
    currentY += 8;
    doc.text(`Dni: ${this.data.receipt.documentNumber ?? ''}`, 5, currentY);
    currentY += 8;
    doc.text(`Teléfono: ${this.data.receipt.phoneNumber ?? ''}`, 5, currentY);
    currentY += 8;
    doc.text(`Dirección: ${this.data.receipt.address ?? ''}`, 5, currentY);
    currentY += 8;
    doc.text(`Distrito: ${this.data.receipt.district ?? ''}`, 5, currentY);
    currentY += 8;
    doc.text(`Provincia: ${this.data.receipt.province ?? ''}`, 5, currentY);
    currentY += 8;
    doc.text(`Vendedor: ${this.data.salesPersonName}`, 5, currentY);
    currentY += 8;
    doc.text(`Método de pago: ${this.data.paymentMethod}`, 5, currentY);
    currentY += 8;

    doc.setFontSize(9);
    doc.text('DETALLE DE COMPRA', pageWidth / 2, currentY, { align: 'center' });
    currentY += 9;
    doc.setFontSize(8);
    for (const detail of this.data.detail) {
      doc.text(`${detail.quantity} x ${detail.product.code}`, 5, currentY);
      doc.text(`S/. ${detail.finalPrice.toFixed(2)}`, pageWidth - 5, currentY, { align: 'right' });
      currentY += 5;
      if (detail.discount > 0) {
        const discountAmount = detail.product.price * detail.quantity * (detail.discount / 100);
        doc.setFontSize(7);
        doc.text(`Descuento (${detail.discount}%): -S/. ${discountAmount.toFixed(2)}`, 5, currentY);
        currentY += 7;
      } else {
        currentY += 3;
      }
    }

    doc.line(5, currentY, pageWidth - 5, currentY);
    currentY += 7;

    doc.setFontSize(10);
    doc.text('TOTAL', 5, currentY);
    doc.text(`S/. ${this.data.finalPrice.toFixed(2)}`, pageWidth - 5, currentY, { align: 'right' });

    doc.save('Recibo');
  }

  saveReceipt() {
    this.loading = true;
    this.snackBar.open('Guardando recibo');
    this.customReceiptService.create(this.data.receipt).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackBar.dismiss();
        this.dialogRef.close(response.customReceipt);
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
