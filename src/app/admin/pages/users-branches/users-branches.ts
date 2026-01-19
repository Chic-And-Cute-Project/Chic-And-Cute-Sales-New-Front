import {Component, OnInit} from '@angular/core';
import {UserDto} from "../../../core/models/user.dto";
import {BranchService} from "../../services/branch/branch.service";
import {BranchDto} from "../../../core/models/branch.dto";
import {ErrorMessage} from "../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../../core/services/user/user.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddUserDialog} from "../../dialogs/add-user.dialog/add-user.dialog";

@Component({
  selector: 'app-users-branches',
  standalone: false,
  templateUrl: './users-branches.html',
  styleUrl: './users-branches.css'
})
export class UsersBranches implements OnInit {
  savingUser: boolean = false;

  username: string = '';

  userToUpdate: UserDto;
  users: UserDto[];
  usersNotActive: UserDto[];

  branches: BranchDto[];

  constructor(private branchService: BranchService, private userService: UserService,
              private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.userToUpdate = {
      branch: {} as BranchDto
    } as UserDto;
    this.users = [];
    this.usersNotActive = [];
    this.branches = [];
  }

  ngOnInit() {
    this.branchService.getAll().subscribe({
      next: (response) => {
        this.branches = response.branches;
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
    this.refreshUsers();
  }

  refreshUsers() {
    this.userService.getAllByBranchRole().subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.users = response.users.filter( user => user.branch.name != "Sin sede asignada");
        this.usersNotActive = response.users.filter( user => user.branch.name == "Sin sede asignada");
      },
      error: (error: ErrorMessage) => {
        this.snackBar.dismiss();
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
      }
    });
  }

  updateUser() {
    this.savingUser = true;
    this.snackBar.open('Actualizando usuario');
    this.userToUpdate.branchId = this.userToUpdate.branch.id;
    this.userService.update(this.userToUpdate.id, this.userToUpdate).subscribe({
      next: (response) => {
        this.savingUser = false;
        this.snackBar.dismiss();
        this.userToUpdate = { ...response.user };
        this.refreshUsers();
      },
      error: (error: ErrorMessage) => {
        this.savingUser = false;
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
      }
    });
  }

  addUser() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      user: {}
    };

    const dialogRef = this.dialog.open(AddUserDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: UserDto) => {
      if (result) {
        this.refreshUsers();
      }
    });
  }

  searchSale() {
    if (this.username != "") {
      this.snackBar.open("Buscando usuarios");
      this.userService.searchUsersByName(this.username).subscribe({
        next: (response) => {
          this.snackBar.dismiss();
          this.users = response.users.filter( user => user.branch.name != "Sin sede asignada");
          this.usersNotActive = response.users.filter( user => user.branch.name == "Sin sede asignada");
        },
        error: (error: ErrorMessage) => {
          this.snackBar.dismiss();
          this.snackBar.openFromComponent(ErrorSnackBar, {
            data: {
              messages: error.message
            },
            duration: 2000
          });
        }
      });
    } else {
      this.snackBar.open("Escribe un nombre", "Entendido", { duration: 2000});
    }
  }

  reloadSearch() {
    this.username = "";
    this.snackBar.open("Reiniciando búsqueda");
    this.refreshUsers();
  }

  selectUser(userDto: UserDto) {
    this.userToUpdate = { ...userDto };
  }
}
