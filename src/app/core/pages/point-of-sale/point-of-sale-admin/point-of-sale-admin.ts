import {Component, OnInit} from '@angular/core';
import {BranchDto} from "../../../models/branch.dto";
import {InventoryDto} from "../../../models/inventory.dto";
import {DiscountDto} from "../../../../admin/models/discount.dto";
import {PageEvent} from "@angular/material/paginator";
import {SaleDto} from "../../../models/sale.dto";
import {SaleDetailDto} from "../../../models/sale-detail.dto";
import {firstValueFrom} from "rxjs";
import {ErrorSnackBar} from "../../../../shared/pages/error-snack-bar/error-snack-bar";
import {BranchService} from "../../../../admin/services/branch/branch.service";
import {DiscountService} from "../../../../admin/services/discount/discount.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ErrorMessage} from "../../../../shared/models/error-message";
import {InventoryService} from "../../../services/inventory/inventory.service";
import {SalePaymentDto} from "../../../models/sale-payment.dto";
import {SaleService} from "../../../services/sale/sale.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-point-of-sale-admin',
  standalone: false,
  templateUrl: './point-of-sale-admin.html',
  styleUrl: './point-of-sale-admin.css'
})
export class PointOfSaleAdmin implements OnInit {
  disableInventoryInput: boolean = false;
  disablePaymentInput: boolean = false;
  savingSale: boolean = false;

  inventoriesSize: number = 0;
  pageIndex: number = 0;
  step: number = 1;

  payedPrice: number = 0;
  change: number = 0;

  searchingMode: boolean = false;

  productCode: string = '';

  displayedColumns: string[] = ['code', 'quantity', 'price'];

  sale: SaleDto;

  paymentMethods: { cashAmount: number, cardAmount: number };

  branches: BranchDto[];
  discounts: DiscountDto[];
  inventories: InventoryDto[];

  constructor(private branchService: BranchService, private discountService: DiscountService,
              private inventoryService: InventoryService, private saleService: SaleService,
              private snackBar: MatSnackBar, private router: Router) {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    this.sale = {
      date: date,
      detail: [] as SaleDetailDto[],
      paymentMethod: [] as SalePaymentDto[],
      finalPrice: 0
    } as SaleDto;
    this.paymentMethods = { cardAmount: 0, cashAmount: 0 } as { cashAmount: number, cardAmount: number };
    this.branches = [];
    this.discounts = [];
    this.inventories = [];
  }

  async ngOnInit(): Promise<void> {
    try {
      const branchApiResponse = await firstValueFrom(this.branchService.getAllByActive());
      this.branches = branchApiResponse.branches;
      this.sale.branchId = this.branches[0].id;

      const discountApiResponse = await firstValueFrom(this.discountService.getAll());
      this.discounts = discountApiResponse.discounts;

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
      this.inventoryService.countByBranch(this.sale.branchId, true).subscribe({
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
    this.inventoryService.getAllByBranchAndPage(this.sale.branchId, page, true).subscribe({
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
      this.inventoryService.countByBranchAndProductCode(this.sale.branchId, this.productCode, true).subscribe({
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
    this.inventoryService.searchInventoriesByBranchAndPage(this.productCode, this.sale.branchId, page, true).subscribe({
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
    this.sale.detail.forEach(saleDetailDto => {
      if (saleDetailDto.product.id == inventoryToAdd.product.id) {
        elementExisting = true;
      }
    });
    if (!elementExisting) {
      const product: SaleDetailDto = { product: inventoryToAdd.product, productId: inventoryToAdd.product.id, quantity: 1, finalPrice: Number(inventoryToAdd.product.price), limit: inventoryToAdd.quantity } as SaleDetailDto;
      this.sale.detail.push(product);
      this.sale.finalPrice = this.sale.finalPrice + Number(inventoryToAdd.product.price);
    }
  }

  deleteFromArray(i: number) {
    this.sale.finalPrice = this.sale.finalPrice - this.sale.detail[i].finalPrice;
    this.sale.detail.splice(i, 1);
  }

  updateFinalPrice(saleDetail: SaleDetailDto) {
    this.sale.finalPrice = this.sale.finalPrice - saleDetail.finalPrice;

    let price = saleDetail.quantity * Number(saleDetail.product.price);
    if (saleDetail.discount != null) {
      price = price - (price * saleDetail.discount * 0.01);
    }
    saleDetail.finalPrice = Number(price.toFixed(2));

    this.sale.finalPrice = this.sale.finalPrice + saleDetail.finalPrice;
  }

  nextStep() {
    if (this.sale.detail.length != 0) {
      this.paymentMethods.cashAmount = this.sale.finalPrice;
      this.disableInventoryInput = true;
      this.step = 2;
    } else {
      this.snackBar.open("La venta esta vacia", "Entendido", {duration: 2000});
    }
  }

  savePaymentMethods() {
    const totalPrice: number = this.paymentMethods.cashAmount + this.paymentMethods.cardAmount;
    if (totalPrice > this.sale.finalPrice) {
      if (this.paymentMethods.cardAmount > 0 && this.paymentMethods.cashAmount > 0) {
        this.snackBar.open("Colocar monto exacto", "Entendido", {duration: 2000});
      } else {
        if (this.paymentMethods.cardAmount > 0) {
          this.snackBar.open("Colocar monto exacto", "Entendido", {duration: 2000});
        } else {
          this.disablePaymentInput = true;
          const salePaymentDto: SalePaymentDto = { type: 'EFECTIVO', amount: this.paymentMethods.cashAmount } as SalePaymentDto;
          this.sale.paymentMethod.push(salePaymentDto);
          this.payedPrice = totalPrice;
          const price = this.payedPrice - this.sale.finalPrice;
          this.change = Number(price.toFixed(2));
        }
      }
    } else if (totalPrice == this.sale.finalPrice) {
      this.disablePaymentInput = true;
      if (this.paymentMethods.cardAmount > 0) {
        const salePaymentDto: SalePaymentDto = { type: 'VISA', amount: this.paymentMethods.cardAmount } as SalePaymentDto;
        this.sale.paymentMethod.push(salePaymentDto);
      }
      if (this.paymentMethods.cashAmount > 0) {
        const salePaymentDto: SalePaymentDto = { type: 'EFECTIVO', amount: this.paymentMethods.cashAmount } as SalePaymentDto;
        this.sale.paymentMethod.push(salePaymentDto);
      }
      this.payedPrice = totalPrice;
      this.change = 0.00;
    } else {
      this.snackBar.open("Montos insuficientes", "Entendido", {duration: 2000});
    }
  }

  createPayment() {
    this.savingSale = true;
    this.snackBar.open('Creando venta');
    this.saleService.create(this.sale).subscribe({
      next: () => {
        this.savingSale = false;
        this.snackBar.dismiss();
        this.router.navigate(['/home/ADMIN']).then();
      },
      error: (error: ErrorMessage) => {
        this.savingSale = false;
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
