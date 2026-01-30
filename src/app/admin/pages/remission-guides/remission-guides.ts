import { Component } from '@angular/core';
import {BranchDto} from "../../../core/models/branch.dto";
import {InventoryDto} from "../../../core/models/inventory.dto";
import {PageEvent} from "@angular/material/paginator";
import {RemissionGuideDto} from "../../models/remission-guide.dto";

@Component({
  selector: 'app-remission-guides',
  standalone: false,
  templateUrl: './remission-guides.html',
  styleUrl: './remission-guides.css'
})
export class RemissionGuides {
  disableInventoryInput: boolean = false;

  productsSize: number = 0;
  pageIndex: number = 0;
  step: number = 1;

  productName: string = '';

  remissionGuide: RemissionGuideDto;

  branches: BranchDto[];
  destinyBranches: BranchDto[];
  inventories: InventoryDto[];

  constructor() {
    this.remissionGuide = {
      branchFrom: {} as BranchDto
    } as RemissionGuideDto;
    this.branches = [];
    this.destinyBranches = [];
    this.inventories = [];
  }

  reloadSearch(changeSede: boolean) {

  }

  searchProduct() {

  }


  handlePageEvent(e: PageEvent) {

  }

  selectProduct(inventory: InventoryDto) {

  }

  deleteFromArray(i: number) {

  }

  nextStep() {

  }

  createRemissionGuide() {

  }
}
