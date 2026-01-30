import {Component, OnInit} from '@angular/core';
import {InventoryDto} from "../../models/inventory.dto";
import {PageEvent} from "@angular/material/paginator";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InventoryService} from "../../services/inventory/inventory.service";
import {ErrorMessage} from "../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";

@Component({
  selector: 'app-stock-branch',
  standalone: false,
  templateUrl: './stock-branch.html',
  styleUrl: './stock-branch.css'
})
export class StockBranch implements OnInit {
  inventoriesSize: number = 0;
  pageIndex: number = 0;

  searchingMode: boolean = false;

  productCode: string = '';

  displayedColumns: string[] = ['code', 'price', 'quantity'];

  inventories: InventoryDto[];

  constructor(private inventoryService: InventoryService, private snackBar: MatSnackBar) {
    this.inventories = [];
  }

  ngOnInit(): void {
    this.refreshInventories(0, true);
  }

  refreshInventories(page: number, firstRequest: boolean) {
    if (firstRequest) {
      this.inventoryService.countByMyBranch().subscribe({
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
    this.inventoryService.getAllByMyBranchAndPage(page).subscribe({
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
      this.inventoryService.countByMyBranchAndProductCode(this.productCode).subscribe({
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
    this.inventoryService.searchInventoriesByMyBranchAndPage(this.productCode, page).subscribe({
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

  reloadSearch() {
    if (this.searchingMode) {
      this.pageIndex = 0;
      this.searchingMode = false;
      this.productCode = "";
      this.snackBar.open("Actualizando");
      this.refreshInventories(0, true);
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    if (this.searchingMode) {
      this.searchInventories(e.pageIndex, false);
    } else {
      this.refreshInventories(e.pageIndex, false);
    }
  }
}
