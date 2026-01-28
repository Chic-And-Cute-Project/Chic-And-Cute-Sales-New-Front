import {Component} from '@angular/core';
import {InventoryDto} from "../../models/inventory.dto";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-stock-branch',
  standalone: false,
  templateUrl: './stock-branch.html',
  styleUrl: './stock-branch.css'
})
export class StockBranch {
  productsSize: number = 0;
  pageIndex: number = 0;

  productName: string = '';

  inventories: InventoryDto[];

  constructor() {
    this.inventories = [];
  }

  searchProduct() {

  }

  reloadSearch(changeSede: boolean) {

  }

  handlePageEvent(e: PageEvent) {

  }
}
