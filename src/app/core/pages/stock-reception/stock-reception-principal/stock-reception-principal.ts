import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-stock-reception-principal',
  standalone: false,
  templateUrl: './stock-reception-principal.html',
  styleUrl: './stock-reception-principal.css'
})
export class StockReceptionPrincipal {
  role: string;

  constructor(private route: ActivatedRoute) {
    this.role = this.route.snapshot.params['role'];
  }
}
