import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home-superadmin',
  standalone: false,
  templateUrl: './home-superadmin.html',
  styleUrl: './home-superadmin.css'
})
export class HomeSuperadmin {
  @Input() role: string = '';

  constructor(private router: Router) {}

  signOut() {
    localStorage.clear();
    this.router.navigate(['login']).then();
  }
}
