import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-point-of-sale-principal',
  standalone: false,
  templateUrl: './point-of-sale-principal.html',
  styleUrl: './point-of-sale-principal.css'
})
export class PointOfSalePrincipal {
  role: string;

  constructor(private route: ActivatedRoute) {
    this.role = this.route.snapshot.params['role'];
  }
}
