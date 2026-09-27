import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {UserDto} from "../../models/user.dto";
import {UserAuxService} from "../../../shared/services/user-aux/user-aux.service";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";
import {WebauthnService} from "../../../webauthn/services/webauthn.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {startRegistration} from "@simplewebauthn/browser";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  user: UserDto;

  constructor(private userAuxService: UserAuxService, private webauthnService: WebauthnService,
              private router: Router, private snackBar: MatSnackBar) {
    this.user = this.userAuxService.getUser();
  }

  signOut() {
    localStorage.clear();
    this.userAuxService.signOut();
    this.router.navigate(['/login']).then();
  }

  async registerTerminal() {
    try {
      this.snackBar.open('Registrando terminal');
      const response = await firstValueFrom(this.webauthnService.registerOptions());
      const registrationResponse = await startRegistration({ optionsJSON: response.options });

      await firstValueFrom(this.webauthnService.verifyRegistration(registrationResponse));
      this.userAuxService.getUser().branch.isRegistered = true;
      this.user = this.userAuxService.getUser();
      this.snackBar.open('Terminal registrada con éxito!', '', { duration: 2000 });
    } catch (error: any) {
      this.snackBar.openFromComponent(ErrorSnackBar, {
        data: {
          messages: error.message
        },
        duration: 2000
      });
    }
  }
}
