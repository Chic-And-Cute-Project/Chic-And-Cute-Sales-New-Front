import {Component, OnInit} from '@angular/core';
import {BranchDto} from "../../../core/models/branch.dto";
import {InventoryDto} from "../../../core/models/inventory.dto";
import {PageEvent} from "@angular/material/paginator";
import {RemissionGuideDto} from "../../models/remission-guide.dto";
import {BranchService} from "../../services/branch/branch.service";
import {InventoryService} from "../../../core/services/inventory/inventory.service";
import {firstValueFrom} from "rxjs";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ErrorMessage} from "../../../shared/models/error-message";
import {RemissionGuideProductDto} from "../../models/remission-guide-product.dto";
import {Router} from "@angular/router";
import {RemissionGuideService} from "../../services/remission-guide/remission-guide.service";

@Component({
  selector: 'app-remission-guides',
  standalone: false,
  templateUrl: './remission-guides.html',
  styleUrl: './remission-guides.css'
})
export class RemissionGuides implements OnInit {
  disableInventoryInput: boolean = false;
  savingRemissionGuide: boolean = false;

  inventoriesSize: number = 0;
  pageIndex: number = 0;
  step: number = 1;

  searchingMode: boolean = false;

  productCode: string = '';

  displayedColumns: string[] = ['code', 'quantity'];

  remissionGuide: RemissionGuideDto;

  branches: BranchDto[];
  destinyBranches: BranchDto[];
  inventories: InventoryDto[];

  constructor(private branchService: BranchService, private inventoryService: InventoryService,
              private remissionGuideService: RemissionGuideService, private snackBar: MatSnackBar,
              private router: Router) {
    this.remissionGuide = {
      branchFrom: {} as BranchDto,
      products: [] as RemissionGuideProductDto[],
    } as RemissionGuideDto;
    this.branches = [];
    this.destinyBranches = [];
    this.inventories = [];
  }

  async ngOnInit(): Promise<void> {
    try {
      const branchApiResponse = await firstValueFrom(this.branchService.getAllByActive());
      this.branches = branchApiResponse.branches;
      this.remissionGuide.branchFromId = this.branches[0].id;

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
      this.inventoryService.countByBranch(this.remissionGuide.branchFromId, true).subscribe({
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
    this.inventoryService.getAllByBranchAndPage(this.remissionGuide.branchFromId, page, true).subscribe({
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
      this.inventoryService.countByBranchAndProductCode(this.remissionGuide.branchFromId, this.productCode, true).subscribe({
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
    this.inventoryService.searchInventoriesByBranchAndPage(this.productCode, this.remissionGuide.branchFromId, page, true).subscribe({
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
    this.remissionGuide.products.forEach(remissionGuideItem => {
      if (remissionGuideItem.product.id == inventoryToAdd.product.id) {
        elementExisting = true;
      }
    });
    if (!elementExisting) {
      let product: RemissionGuideProductDto = { product: inventoryToAdd.product, productId: inventoryToAdd.product.id, quantity: inventoryToAdd.quantity, limit: inventoryToAdd.quantity } as RemissionGuideProductDto;
      this.remissionGuide.products.push(product);
    }
  }

  deleteFromArray(i: number) {
    this.remissionGuide.products.splice(i, 1);
  }

  nextStep() {
    if (this.remissionGuide.products.length != 0) {
      this.disableInventoryInput = true;
      this.step = 2;
      this.destinyBranches = this.branches.filter(branch => branch.id !== this.remissionGuide.branchFromId);
    } else {
      this.snackBar.open("La guia esta vacia", "Entendido", {duration: 2000});
    }
  }

  createRemissionGuide() {
    this.savingRemissionGuide = true;
    this.snackBar.open('Creando guía');
    this.remissionGuideService.create(this.remissionGuide).subscribe({
      next: () => {
        this.savingRemissionGuide = false;
        this.snackBar.dismiss();
        this.router.navigate(['/stock-reception/ADMIN']).then();
      },
      error: (error: ErrorMessage) => {
        this.savingRemissionGuide = false;
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
