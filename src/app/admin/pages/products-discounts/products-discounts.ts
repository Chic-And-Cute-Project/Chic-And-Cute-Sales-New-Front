import {Component, OnInit} from '@angular/core';
import {ProductDto} from "../../models/product.dto";
import {DiscountDto} from "../../models/discount.dto";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-products-discounts',
  standalone: false,
  templateUrl: './products-discounts.html',
  styleUrl: './products-discounts.css'
})
export class ProductsDiscounts implements OnInit {
  productsSize: number = 0;
  pageIndex: number = 0;

  productName: string = '';

  products: ProductDto[];
  discounts: DiscountDto[];

  constructor() {
    this.products = [];
    this.discounts = [];
  }

  ngOnInit() {

  }

  searchProduct() {

  }

  handlePageEvent(e: PageEvent) {

  }

  createProduct() {

  }

  reloadSearch() {

  }

  manageProduct(product: ProductDto) {

  }

  createDiscount() {

  }

  updateDiscount(discount: DiscountDto) {

  }
}
