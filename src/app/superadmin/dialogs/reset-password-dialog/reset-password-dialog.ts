import {Component, Inject} from '@angular/core';
import {UserDto} from "../../../core/models/user.dto";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../../core/services/user/user.service";
import {ErrorMessage} from "../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";

type ResetPasswordUser = {
  user: UserDto
}

@Component({
  selector: 'app-reset-password-dialog',
  standalone: false,
  templateUrl: './reset-password-dialog.html',
  styleUrl: './reset-password-dialog.css'
})
export class ResetPasswordDialog {
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ResetPasswordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ResetPasswordUser,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) { }

  onResetPassword() {
    this.loading = true;
    this.snackBar.open('Actualizando contraseña');
    this.userService.resetPassword(this.data.user).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackBar.dismiss();
        this.dialogRef.close(response.user);
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
