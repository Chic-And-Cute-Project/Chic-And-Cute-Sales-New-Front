import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home-admin',
  standalone: false,
  templateUrl: './home-admin.html',
  styleUrl: './home-admin.css'
})
export class HomeAdmin {
  @Input() role: string = '';

  constructor(private router: Router) {}

  signOut() {
    localStorage.clear();
    this.router.navigate(['login']).then();
  }
}
