import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-close-sales-days-principal',
  standalone: false,
  templateUrl: './close-sales-days-principal.html',
  styleUrl: './close-sales-days-principal.css'
})
export class CloseSalesDaysPrincipal {
  role: string;

  constructor(private route: ActivatedRoute) {
    this.role = this.route.snapshot.params['role'];
  }
}
