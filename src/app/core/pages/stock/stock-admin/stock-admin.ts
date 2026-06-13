import {Component, OnInit} from '@angular/core';
import {BranchDto} from "../../../models/branch.dto";
import {InventoryDto} from "../../../models/inventory.dto";
import {PageEvent} from "@angular/material/paginator";
import {BranchService} from "../../../../admin/services/branch/branch.service";
import {InventoryService} from "../../../services/inventory/inventory.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {firstValueFrom} from "rxjs";
import {ErrorSnackBar} from "../../../../shared/pages/error-snack-bar/error-snack-bar";
import {ErrorMessage} from "../../../../shared/models/error-message";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {UserDto} from "../../../models/user.dto";
import {UpdateInventoryDialog} from "../../../dialogs/update-inventory-dialog/update-inventory-dialog";
import * as jspdf from "jspdf";
import {environment} from "../../../../../environment/environment";

@Component({
  selector: 'app-stock-admin',
  standalone: false,
  templateUrl: './stock-admin.html',
  styleUrl: './stock-admin.css'
})
export class StockAdmin implements OnInit {
  inventoriesSize: number = 0;
  pageIndex: number = 0;

  branchSelected: number = 0;

  searchingMode: boolean = false;

  productCode: string = '';

  displayedColumns: string[] = ['code', 'price', 'quantity'];

  branches: BranchDto[];
  inventories: InventoryDto[];

  constructor(private branchService: BranchService, private inventoryService: InventoryService,
              private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.branches = [];
    this.inventories = [];
  }

  async ngOnInit(): Promise<void> {
    try {
      const branchApiResponse = await firstValueFrom(this.branchService.getAllByActive());
      this.branches = branchApiResponse.branches;
      this.branchSelected = this.branches[0].id;

      this.refreshInventories(0, true);
    } catch (error: any) {
      this.snackBar.openFromComponent(ErrorSnackBar, {
        data: {
          messages: error.message
        },
        duration: 2000
      });
    }
  }

  refreshInventories(page: number, firstRequest: boolean) {
    if (firstRequest) {
      this.inventoryService.countByBranch(this.branchSelected).subscribe({
        next: (response) => {
          this.inventoriesSize = response.count;
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
    this.inventoryService.getAllByBranchAndPage(this.branchSelected, page).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.inventories = response.inventories;
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

  searchInventories(page: number, firstRequest: boolean) {
    if (firstRequest) {
      this.inventoryService.countByBranchAndProductCode(this.branchSelected, this.productCode).subscribe({
        next: (response) => {
          this.inventoriesSize = response.count;
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
    this.inventoryService.searchInventoriesByBranchAndPage(this.productCode, this.branchSelected, page).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.inventories = response.inventories;
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

  reloadSearch(changeSede: boolean) {
    if (changeSede) {
      this.pageIndex = 0;
      this.productCode = "";
      this.snackBar.open("Actualizando");
      this.refreshInventories(0, true);
    } else {
      if (this.searchingMode) {
        this.pageIndex = 0;
        this.searchingMode = false;
        this.productCode = "";
        this.snackBar.open("Actualizando");
        this.refreshInventories(0, true);
      }
    }
  }

  editInventory(inventory: InventoryDto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      inventory: {...inventory}
    };

    const dialogRef = this.dialog.open(UpdateInventoryDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: UserDto) => {
      if (result) {
        if (this.searchingMode) {
          this.searchInventories(this.pageIndex, false);
        } else {
          this.refreshInventories(this.pageIndex, false);
        }
      }
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    if (this.searchingMode) {
      this.searchInventories(e.pageIndex, false);
    } else {
      this.refreshInventories(e.pageIndex, false);
    }
  }

  searchInventory() {
    if (this.productCode != "") {
      this.pageIndex = 0;
      this.searchingMode = true;
      this.snackBar.open("Buscando productos");
      this.searchInventories(0, true);
    } else {
      this.snackBar.open("Código de producto vacío", "Entendido", { duration: 2000});
    }
  }

  async printInventory() {
    try {
      this.snackBar.open("Generando PDF con inventarios");
      const inventoryApiResponse = await firstValueFrom(this.inventoryService.getAllByBranch(this.branchSelected, true));
      const inventories = inventoryApiResponse.inventories;
      this.snackBar.dismiss();

      const doc = new jspdf.jsPDF({ format: "a4", unit: "mm" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const branchName =
        this.branches.find(b => b.id === this.branchSelected)?.name ?? `Sede #${this.branchSelected}`;

      const marginX = 10;
      const marginTop = 10;
      const gutter = 4;

      const blocksPerRow = 2;

      const printableWidth = pageWidth - marginX * 2;
      const blockWidth = (printableWidth - gutter * (blocksPerRow - 1)) / blocksPerRow;

      const codeXOffset = 0;
      const qtyXOffset = blockWidth - 12;

      const rowHeight = 5;
      const bottomMargin = 10;

      const header = () => {
        doc.setFontSize(12);
        doc.text("Reporte de Inventarios", pageWidth / 2, marginTop, { align: "center" });

        doc.setFontSize(9);
        doc.text(`Sede: ${branchName}`, marginX, marginTop + 7);

        const y = marginTop + 16;
        const lineTop = y - 4;
        const lineBottom = pageHeight - bottomMargin;

        for (let c = 0; c < blocksPerRow; c++) {
          const blockX = marginX + c * (blockWidth + gutter);
          doc.text("Código", blockX + codeXOffset, y);
          doc.text("Cant", blockX + qtyXOffset, y, { align: "right" });
          doc.setLineWidth(0.2);
          doc.line(blockX, y + 2, blockX + blockWidth, y + 2);
        }

        if (blocksPerRow > 1) {
          const separatorX = marginX + blockWidth + gutter / 2;
          doc.setLineWidth(0.2);
          doc.line(separatorX, lineTop, separatorX, lineBottom);
        }

        return y + 7;
      };

      let startY = header();

      let currentCol = 0;
      let y = startY;

      for (const inventory of inventories) {
        if (y + rowHeight > pageHeight - bottomMargin) {
          doc.addPage();
          startY = header();
          currentCol = 0;
          y = startY;
        }

        const blockX = marginX + currentCol * (blockWidth + gutter);

        const code = inventory.product.code ?? "";
        const qty = String(inventory.quantity ?? "");

        const maxCodeWidth = blockWidth - 16;
        const codeFitted =
          doc.getTextWidth(code) <= maxCodeWidth
            ? code
            : (() => {
              let s = code;
              while (s.length > 0 && doc.getTextWidth(s + "…") > maxCodeWidth) s = s.slice(0, -1);
              return s.length ? s + "…" : "";
            })();

        doc.text(codeFitted, blockX + codeXOffset, y);
        doc.text(qty, blockX + qtyXOffset, y, { align: "right" });
        doc.setLineWidth(0.2);
        doc.line(blockX, y + 2, blockX + blockWidth, y + 2);

        currentCol += 1;
        if (currentCol >= blocksPerRow) {
          currentCol = 0;
          y += rowHeight;
        }
      }
      doc.save('Inventarios');
    } catch (error: any) {
      this.snackBar.openFromComponent(ErrorSnackBar, {
        data: {
          messages: error.message
        },
        duration: 2000
      });
    }
  }

  generateExcel() {
    window.open(`${environment.apiUrl}inventories/excel-branch/${this.branchSelected}?available=true`, '_blank');
  }
}
