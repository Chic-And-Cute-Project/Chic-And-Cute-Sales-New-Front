import {Component} from '@angular/core';
import {BranchDto} from "../../models/branch.dto";
import {InventoryDto} from "../../models/inventory.dto";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-stock-admin',
  standalone: false,
  templateUrl: './stock-admin.html',
  styleUrl: './stock-admin.css'
})
export class StockAdmin {
  productsSize: number = 0;
  pageIndex: number = 0;

  branchSelected: number = 0;

  productName: string = '';

  branches: BranchDto[];
  inventories: InventoryDto[];

  constructor() {
    this.branches = [];
    this.inventories = [];
  }

  searchProduct() {

  }

  reloadSearch(changeSede: boolean) {

  }

  editInventory(inventory: InventoryDto) {

  }

  handlePageEvent(e: PageEvent) {

  }
}
