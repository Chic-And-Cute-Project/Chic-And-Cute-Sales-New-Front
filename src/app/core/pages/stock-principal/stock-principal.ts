import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-stock-principal',
  standalone: false,
  templateUrl: './stock-principal.html',
  styleUrl: './stock-principal.css'
})
export class StockPrincipal {
  role: string;

  constructor(private route: ActivatedRoute) {
    this.role = this.route.snapshot.params['role'];
  }
}
