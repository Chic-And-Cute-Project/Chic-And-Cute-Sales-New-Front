import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {UserAuxService} from "../../../../shared/services/user-aux/user-aux.service";

@Component({
  selector: 'app-home-branch',
  standalone: false,
  templateUrl: './home-branch.html',
  styleUrl: './home-branch.css'
})
export class HomeBranch {
  @Input() role: string = '';

  constructor(private router: Router, private userAuxService: UserAuxService) {}

  signOut() {
    localStorage.clear();
    this.userAuxService.signOut();
    this.router.navigate(['login']).then();
  }
}
