import {Component, OnInit} from '@angular/core';
import {RemissionGuideDto} from "../../../../admin/models/remission-guide.dto";
import {ErrorMessage} from "../../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../../shared/pages/error-snack-bar/error-snack-bar";
import {RemissionGuideService} from "../../../../admin/services/remission-guide/remission-guide.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-stock-reception-branch',
  standalone: false,
  templateUrl: './stock-reception-branch.html',
  styleUrl: './stock-reception-branch.css'
})
export class StockReceptionBranch implements OnInit {
  updatingRemissionGuide: boolean = false;

  remissionGuide: RemissionGuideDto;

  remissionGuides: RemissionGuideDto[];

  constructor(private remissionGuideService: RemissionGuideService, private snackBar: MatSnackBar) {
    this.remissionGuide = {} as RemissionGuideDto;
    this.remissionGuides = [];
  }

  ngOnInit(): void {
    this.refreshRemissionGuides();
  }

  refreshRemissionGuides() {
    this.remissionGuideService.getObject().subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.remissionGuides = response.remissionGuides;
      },
      error: (error: ErrorMessage) => {
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
      }
    });
  }

  confirmRemissionGuide() {
    this.updatingRemissionGuide = true;
    this.snackBar.open('Confirmando guía');
    this.remissionGuideService.confirm(this.remissionGuide.id).subscribe({
      next: () => {
        this.updatingRemissionGuide = false;
        this.snackBar.dismiss();
        this.remissionGuide = {} as RemissionGuideDto;
        this.refreshRemissionGuides();
      },
      error: (error: ErrorMessage) => {
        this.updatingRemissionGuide = false;
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
      }
    });
  }
}
