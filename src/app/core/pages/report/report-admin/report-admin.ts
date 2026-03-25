import {Component, OnInit} from '@angular/core';
import {UserDto} from "../../../models/user.dto";
import {BranchDto} from "../../../models/branch.dto";
import {SaleDetailDto} from "../../../models/sale-detail.dto";
import {firstValueFrom} from "rxjs";
import {ErrorSnackBar} from "../../../../shared/pages/error-snack-bar/error-snack-bar";
import {BranchService} from "../../../../admin/services/branch/branch.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../../services/user/user.service";
import {SaleService} from "../../../services/sale/sale.service";
import {ErrorMessage} from "../../../../shared/models/error-message";
import {SupplyBranchService} from "../../../../admin/services/supply-branch/supply-branch.service";
import {SupplyBranchDto} from "../../../../admin/models/supply-branch.dto";

@Component({
  selector: 'app-report-admin',
  standalone: false,
  templateUrl: './report-admin.html',
  styleUrl: './report-admin.css'
})
export class ReportAdmin implements OnInit {
  count: number = 0;

  cashAmount: number = 0;
  cardAmount: number = 0;
  totalAmount: number = 0;

  displayedColumns: string[] = ['code', 'quantity', 'finalPrice'];

  minDate: Date;
  maxDate: Date;
  minDateSupply: Date;
  maxDateSupply: Date;

  user: UserDto;
  branch: BranchDto;

  users: UserDto[];
  branches: BranchDto[];
  saleDetails: SaleDetailDto[];
  supplyBranches: SupplyBranchDto[];

  constructor(private branchService: BranchService, private userService: UserService,
              private saleService: SaleService, private supplyBranchService: SupplyBranchService,
              private snackBar: MatSnackBar,) {
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
    this.maxDate = new Date();
    this.maxDate.setHours(0, 0, 0, 0);
    this.maxDate.setDate(this.maxDate.getDate() + 1);
    this.minDateSupply = new Date();
    this.minDateSupply.setHours(0, 0, 0, 0);
    this.maxDateSupply = new Date();
    this.maxDateSupply.setHours(0, 0, 0, 0);
    this.maxDateSupply.setDate(this.maxDateSupply.getDate() + 1);
    this.user = {} as UserDto;
    this.branch = {} as BranchDto;
    this.users = [];
    this.branches = [];
    this.saleDetails = [];
    this.supplyBranches = [];
  }

  async ngOnInit(): Promise<void> {
    try {
      const branchApiResponse = await firstValueFrom(this.branchService.getAllByActive());
      this.branches = branchApiResponse.branches;
      this.branch = this.branches[0];

      const userApiResponse = await firstValueFrom(this.userService.getAll());
      this.users = userApiResponse.users;
      this.user = this.users[0];
    } catch (error: any) {
      this.snackBar.openFromComponent(ErrorSnackBar, {
        data: {
          messages: error.message
        },
        duration: 2000
      });
    }
  }

  searchSales() {
    this.saleService.getAdminReport(this.user.id, this.branch.id, this.minDate, this.maxDate).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.saleDetails = response.saleDetails;
        this.cashAmount = response.cashAmount;
        this.cardAmount = response.cardAmount;
        this.count = response.count;
        this.totalAmount = this.cashAmount + this.cardAmount;
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

  searchSupplyBranch() {
    this.supplyBranchService.getAllByBranchAndDates(this.branch.id, this.minDate, this.maxDate).subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.supplyBranches = response.supplyBranches;
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
