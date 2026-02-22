import {Component, OnInit} from '@angular/core';
import {BranchDto} from "../../../models/branch.dto";
import {CloseSalesDayDto} from "../../../models/close-sales-day.dto";
import {BranchService} from "../../../../admin/services/branch/branch.service";
import {CloseSalesDayService} from "../../../services/close-sales-day/close-sales-day.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {firstValueFrom} from "rxjs";
import {ErrorSnackBar} from "../../../../shared/pages/error-snack-bar/error-snack-bar";
import {ErrorMessage} from "../../../../shared/models/error-message";

@Component({
  selector: 'app-documents-admin',
  standalone: false,
  templateUrl: './documents-admin.html',
  styleUrl: './documents-admin.css'
})
export class DocumentsAdmin implements OnInit {
  minDate: Date;
  maxDate: Date;

  branch: BranchDto;
  closeSalesDaySelected: CloseSalesDayDto;

  branches: BranchDto[];
  closeSalesDays: CloseSalesDayDto[];

  constructor(private branchService: BranchService, private closeSalesDayService: CloseSalesDayService,
              private snackBar: MatSnackBar) {
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
    this.maxDate = new Date();
    this.maxDate.setHours(0, 0, 0, 0);
    this.maxDate.setDate(this.maxDate.getDate() + 1);
    this.branch = {} as BranchDto;
    this.closeSalesDaySelected = {} as CloseSalesDayDto;
    this.branches = [];
    this.closeSalesDays = [];
  }

  async ngOnInit(): Promise<void> {
    try {
      const branchApiResponse = await firstValueFrom(this.branchService.getAllByActive());
      this.branches = branchApiResponse.branches;
      this.branch = this.branches[0];

      this.refreshDocuments();
    } catch (error: any) {
      this.snackBar.openFromComponent(ErrorSnackBar, {
        data: {
          messages: error.message
        },
        duration: 2000
      });
    }
  }

  refreshDocuments() {
    this.closeSalesDayService.getAllByBranchAndDate(this.branch.id, this.minDate, this.maxDate).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.closeSalesDays = response.closeSalesDays.map(closeSalesDay => {
          closeSalesDay.totalAmount = Number(closeSalesDay.cashAmount) + Number(closeSalesDay.cardAmount);
          return closeSalesDay;
        });
        this.closeSalesDaySelected = {} as CloseSalesDayDto;
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

  selectDocument(closeSalesDay: CloseSalesDayDto) {
    this.closeSalesDaySelected.show = false;
    this.closeSalesDaySelected = closeSalesDay;
    this.closeSalesDaySelected.show = true;
  }

  deleteDocument() {
    this.snackBar.open('Eliminando cierre de caja');
    this.closeSalesDayService.delete(this.closeSalesDaySelected.id).subscribe({
      next: () => {
        this.snackBar.dismiss();
        this.refreshDocuments();
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
}
