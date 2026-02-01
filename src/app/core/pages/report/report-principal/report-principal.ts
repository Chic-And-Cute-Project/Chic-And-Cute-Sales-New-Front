import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-report-principal',
  standalone: false,
  templateUrl: './report-principal.html',
  styleUrl: './report-principal.css'
})
export class ReportPrincipal {
  role: string;

  constructor(private route: ActivatedRoute) {
    this.role = this.route.snapshot.params['role'];
  }
}
