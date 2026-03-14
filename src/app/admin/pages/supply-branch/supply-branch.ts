import {Component, OnInit} from '@angular/core';
import {BranchDto} from "../../../core/models/branch.dto";
import {InventoryDto} from "../../../core/models/inventory.dto";
import {SupplyBranchDto} from "../../models/supply-branch.dto";
import {SupplyBranchProductDto} from "../../models/supply-branch-product.dto";
import {BranchService} from "../../services/branch/branch.service";
import {Router} from "@angular/router";
import {InventoryService} from "../../../core/services/inventory/inventory.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";
import {firstValueFrom} from "rxjs";
import {ErrorMessage} from "../../../shared/models/error-message";
import {PageEvent} from "@angular/material/paginator";
import {SupplyBranchService} from "../../services/supply-branch/supply-branch.service";

@Component({
  selector: 'app-supply-branch',
  standalone: false,
  templateUrl: './supply-branch.html',
  styleUrl: './supply-branch.css'
})
export class SupplyBranch implements OnInit {
  savingSupplyBranch: boolean = false;

  inventoriesSize: number = 0;
  pageIndex: number = 0;

  searchingMode: boolean = false;

  productCode: string = '';

  displayedColumns: string[] = ['code', 'quantity'];

  supplyBranch: SupplyBranchDto;

  branches: BranchDto[];
  inventories: InventoryDto[];

  constructor(private branchService: BranchService, private inventoryService: InventoryService,
              private supplyBranchService: SupplyBranchService, private snackBar: MatSnackBar,
              private router: Router) {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    this.supplyBranch = {
      date: date,
      branch: {} as BranchDto,
      products: [] as SupplyBranchProductDto[],
    } as SupplyBranchDto;
    this.branches = [];
    this.inventories = [];
  }

  async ngOnInit(): Promise<void> {
    try {
      const branchApiResponse = await firstValueFrom(this.branchService.getAllByActive());
      this.branches = branchApiResponse.branches;
      this.supplyBranch.branchId = this.branches[0].id;

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
      this.inventoryService.countByBranch(this.supplyBranch.branchId).subscribe({
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
    this.inventoryService.getAllByBranchAndPage(this.supplyBranch.branchId, page).subscribe({
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
      this.inventoryService.countByBranchAndProductCode(this.supplyBranch.branchId, this.productCode).subscribe({
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
    this.inventoryService.searchInventoriesByBranchAndPage(this.productCode, this.supplyBranch.branchId, page).subscribe({
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

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    if (this.searchingMode) {
      this.searchInventories(e.pageIndex, false);
    } else {
      this.refreshInventories(e.pageIndex, false);
    }
  }

  selectProduct(inventoryToAdd: InventoryDto) {
    let elementExisting = false;
    this.supplyBranch.products.forEach(supplyBranchProduct => {
      if (supplyBranchProduct.product.id == inventoryToAdd.product.id) {
        elementExisting = true;
      }
    });
    if (!elementExisting) {
      let product: SupplyBranchProductDto = { product: inventoryToAdd.product, productId: inventoryToAdd.product.id, quantity: 1 } as SupplyBranchProductDto;
      this.supplyBranch.products.push(product);
    }
  }

  deleteFromArray(i: number) {
    this.supplyBranch.products.splice(i, 1);
  }

  saveSupplyGuide() {
    this.savingSupplyBranch = true;
    this.snackBar.open('Alimentando sede');
    this.supplyBranchService.addInventory(this.supplyBranch).subscribe({
      next: () => {
        this.savingSupplyBranch = false;
        this.snackBar.dismiss();
        this.router.navigate(['/home/ADMIN']).then();
      },
      error: (error: ErrorMessage) => {
        this.savingSupplyBranch = false;
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
