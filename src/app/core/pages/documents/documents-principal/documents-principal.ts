import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-documents-principal',
  standalone: false,
  templateUrl: './documents-principal.html',
  styleUrl: './documents-principal.css'
})
export class DocumentsPrincipal {
  role: string;

  constructor(private route: ActivatedRoute) {
    this.role = this.route.snapshot.params['role'];
  }
}
