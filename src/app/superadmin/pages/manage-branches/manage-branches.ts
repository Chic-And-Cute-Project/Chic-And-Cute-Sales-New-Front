import {Component, OnInit} from '@angular/core';
import {BranchDto} from "../../../core/models/branch.dto";
import {BranchService} from "../../../admin/services/branch/branch.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ErrorMessage} from "../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";
import {AddBranchDialog} from "../../dialogs/add-branch-dialog/add-branch-dialog";

@Component({
  selector: 'app-manage-branches',
  standalone: false,
  templateUrl: './manage-branches.html',
  styleUrl: './manage-branches.css'
})
export class ManageBranches implements OnInit {
  displayedColumns: string[] = ['name'];

  branches: BranchDto[];

  constructor(private branchService: BranchService, private snackBar: MatSnackBar,
              private dialog: MatDialog) {
    this.branches = [];
  }

  ngOnInit() {
    this.refreshBranches();
  }

  refreshBranches() {
    this.branchService.getAll().subscribe({
      next: (userApiResponse) => {
        this.snackBar.dismiss();
        this.branches = userApiResponse.branches;
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

  createBranch() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      branch: {}
    };

    const dialogRef = this.dialog.open(AddBranchDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: BranchDto) => {
      if (result) {
        this.refreshBranches();
      }
    });
  }
}
