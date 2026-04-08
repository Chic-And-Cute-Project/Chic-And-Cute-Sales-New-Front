import {Component, Inject} from '@angular/core';
import {BranchDto} from "../../../core/models/branch.dto";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ErrorMessage} from "../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";
import {BranchService} from "../../../admin/services/branch/branch.service";

type AddBranch = {
  branch: BranchDto;
}

@Component({
  selector: 'app-add-branch-dialog',
  standalone: false,
  templateUrl: './add-branch-dialog.html',
  styleUrl: './add-branch-dialog.css'
})
export class AddBranchDialog {
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddBranchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddBranch,
    private snackBar: MatSnackBar,
    private branchService: BranchService
  ) { }

  onCreateBranch() {
    this.loading = true;
    this.snackBar.open('Creando sede');
    this.branchService.create(this.data.branch).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackBar.dismiss();
        this.dialogRef.close(response.branch);
      },
      error: (error: ErrorMessage) => {
        this.loading = false;
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
