import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {UserAuxService} from "../../../../shared/services/user-aux/user-aux.service";

@Component({
  selector: 'app-home-superadmin',
  standalone: false,
  templateUrl: './home-superadmin.html',
  styleUrl: './home-superadmin.css'
})
export class HomeSuperadmin {
  @Input() role: string = '';

  constructor(private userAuxService: UserAuxService, private router: Router) {}

  signOut() {
    localStorage.clear();
    this.userAuxService.signOut();
    this.router.navigate(['login']).then();
  }
}
