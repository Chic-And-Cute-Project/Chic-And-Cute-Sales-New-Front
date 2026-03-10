import {Component, OnInit} from '@angular/core';
import {SaleDto} from "../../../models/sale.dto";
import {DiscountDto} from "../../../../admin/models/discount.dto";
import {InventoryDto} from "../../../models/inventory.dto";
import {SaleDetailDto} from "../../../models/sale-detail.dto";
import {SalePaymentDto} from "../../../models/sale-payment.dto";
import {DiscountService} from "../../../../admin/services/discount/discount.service";
import {SaleService} from "../../../services/sale/sale.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InventoryService} from "../../../services/inventory/inventory.service";
import {Router} from "@angular/router";
import {PageEvent} from "@angular/material/paginator";
import {ErrorMessage} from "../../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../../shared/pages/error-snack-bar/error-snack-bar";
import {firstValueFrom} from "rxjs";
import {UserAuxService} from "../../../../shared/services/user-aux/user-aux.service";

@Component({
  selector: 'app-point-of-sale-branch',
  standalone: false,
  templateUrl: './point-of-sale-branch.html',
  styleUrl: './point-of-sale-branch.css'
})
export class PointOfSaleBranch implements OnInit {
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

  discounts: DiscountDto[];
  inventories: InventoryDto[];

  constructor(private discountService: DiscountService, private inventoryService: InventoryService,
              private saleService: SaleService, private snackBar: MatSnackBar,
              private router: Router, private userAuxService: UserAuxService) {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    this.sale = {
      date: date,
      branchId: this.userAuxService.getUser().branch.id,
      detail: [] as SaleDetailDto[],
      paymentMethod: [] as SalePaymentDto[],
      finalPrice: 0
    } as SaleDto;
    this.paymentMethods = { cardAmount: 0, cashAmount: 0 } as { cashAmount: number, cardAmount: number };
    this.discounts = [];
    this.inventories = [];
  }

  async ngOnInit(): Promise<void> {
    try {
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

  reloadSearch() {
    if (this.searchingMode) {
      this.pageIndex = 0;
      this.searchingMode = false;
      this.productCode = "";
      this.snackBar.open("Actualizando");
      this.refreshInventories(0, true);
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
    const product: SaleDetailDto = { product: inventoryToAdd.product, productId: inventoryToAdd.product.id, quantity: 1, finalPrice: Number(inventoryToAdd.product.price), limit: inventoryToAdd.quantity } as SaleDetailDto;
    this.sale.detail.push(product);
    this.sale.finalPrice = this.sale.finalPrice + Number(inventoryToAdd.product.price);
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
        this.router.navigate(['/home/BRANCH']).then();
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
