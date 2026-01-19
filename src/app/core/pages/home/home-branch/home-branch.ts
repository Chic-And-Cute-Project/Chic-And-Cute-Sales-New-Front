import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {UserDto} from "../../../models/user.dto";
import {UserAuxService} from "../../../../shared/services/user-aux/user-aux.service";

@Component({
  selector: 'app-home-branch',
  standalone: false,
  templateUrl: './home-branch.html',
  styleUrl: './home-branch.css'
})
export class HomeBranch {
  @Input() role: string = '';

  user: UserDto;

  constructor(private router: Router, private userAuxService: UserAuxService) {
    this.user = this.userAuxService.getUser();
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['login']).then();
  }
}
