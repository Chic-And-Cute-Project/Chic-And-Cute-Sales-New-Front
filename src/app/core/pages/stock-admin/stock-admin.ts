import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-stock-admin',
  standalone: false,
  templateUrl: './stock-admin.html',
  styleUrl: './stock-admin.css'
})
export class StockAdmin {
  @Input() role: string = '';
}
