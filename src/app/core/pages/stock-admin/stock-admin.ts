import {Component, OnInit} from '@angular/core';
import {BranchDto} from "../../models/branch.dto";
import {InventoryDto} from "../../models/inventory.dto";
import {PageEvent} from "@angular/material/paginator";
import {BranchService} from "../../../admin/services/branch/branch.service";
import {InventoryService} from "../../services/inventory/inventory.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {firstValueFrom} from "rxjs";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";
import {ErrorMessage} from "../../../shared/models/error-message";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {UserDto} from "../../models/user.dto";
import {UpdateInventoryDialog} from "../../dialogs/update-inventory-dialog/update-inventory-dialog";

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
}
