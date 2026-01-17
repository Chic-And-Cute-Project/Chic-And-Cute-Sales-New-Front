import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-home-superadmin',
  standalone: false,
  templateUrl: './home-superadmin.html',
  styleUrl: './home-superadmin.css'
})
export class HomeSuperadmin {
  @Input() role: string = '';
}
