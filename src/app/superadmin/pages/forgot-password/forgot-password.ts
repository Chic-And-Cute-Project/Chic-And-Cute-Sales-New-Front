import {Component, OnInit} from '@angular/core';
import {UserDto} from "../../../core/models/user.dto";
import {UserService} from "../../../core/services/user/user.service";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ErrorMessage} from "../../../shared/models/error-message";
import {ResetPasswordDialog} from "../../dialogs/reset-password-dialog/reset-password-dialog";

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword implements OnInit {
  displayedColumns: string[] = ['name', 'lastName', 'username'];

  users: UserDto[];

  constructor(private userService: UserService, private snackBar: MatSnackBar,
              private dialog: MatDialog) {
    this.users = [];
  }

  ngOnInit() {
    this.refreshUsers();
  }

  refreshUsers() {
    this.userService.getAll().subscribe({
      next: (userApiResponse) => {
        this.snackBar.dismiss();
        this.users = userApiResponse.users;
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

  resetPassword(user: UserDto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      user: {
        ...user,
        password: ""
      }
    };

    const dialogRef = this.dialog.open(ResetPasswordDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: UserDto) => {
      if (result) {
        this.refreshUsers();
      }
    });
  }
}
