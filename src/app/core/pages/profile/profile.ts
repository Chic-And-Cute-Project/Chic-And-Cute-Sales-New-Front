import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {UserDto} from "../../models/user.dto";
import {UserAuxService} from "../../../shared/services/user-aux/user-aux.service";

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  user: UserDto;

  constructor(private userAuxService: UserAuxService, private router: Router) {
    this.user = this.userAuxService.getUser();
  }

  signOut() {
    localStorage.clear();
    this.userAuxService.signOut();
    this.router.navigate(['/login']).then();
  }
}
