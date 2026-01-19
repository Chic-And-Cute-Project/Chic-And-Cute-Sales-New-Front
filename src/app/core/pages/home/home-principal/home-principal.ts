import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home-principal',
  standalone: false,
  templateUrl: './home-principal.html',
  styleUrl: './home-principal.css'
})
export class HomePrincipal {
  role: string;

  constructor(private route: ActivatedRoute) {
    this.role = this.route.snapshot.params['role'];
  }
}
