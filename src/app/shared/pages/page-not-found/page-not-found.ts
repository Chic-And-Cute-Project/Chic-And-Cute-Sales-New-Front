import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../../core/services/user/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorMessage} from '../../models/error-message';
import {ErrorSnackBar} from '../error-snack-bar/error-snack-bar';

@Component({
  selector: 'app-page-not-found',
  standalone: false,
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.css'
})
export class PageNotFound {

  constructor(private userService: UserService, private router: Router,
              private snackBar: MatSnackBar) { }

  return() {
    if (localStorage.getItem('token')) {
      this.snackBar.open('Regresando a pagina principal');
      this.userService.getObject().subscribe({
        next: (response) => {
          this.snackBar.dismiss();
          this.router.navigate(['/home', response.user.role]).then();
        },
        error: (error: ErrorMessage) => {
          localStorage.removeItem('token');
          this.snackBar.openFromComponent(ErrorSnackBar, {
            data: {
              messages: error.message
            },
            duration: 2000
          });
        }
      });
    } else {
      this.router.navigate(['/login']).then();
    }
  }
}
