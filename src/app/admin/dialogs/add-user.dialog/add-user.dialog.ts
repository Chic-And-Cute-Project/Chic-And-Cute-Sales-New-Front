import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../../core/services/user/user.service";
import {UserDto} from "../../../core/models/user.dto";
import {ErrorMessage} from "../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";

type AddUser = {
  user: UserDto;
};

@Component({
  selector: 'app-add-user.dialog',
  standalone: false,
  templateUrl: './add-user.dialog.html',
  styleUrl: './add-user.dialog.css'
})
export class AddUserDialog {
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddUser,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) { }

  onCreateUser() {
    this.loading = true;
    this.snackBar.open('Creando vendedora');
    this.userService.register(this.data.user).subscribe({
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
