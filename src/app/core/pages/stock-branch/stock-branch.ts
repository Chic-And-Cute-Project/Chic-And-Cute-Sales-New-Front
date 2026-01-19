import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-stock-branch',
  standalone: false,
  templateUrl: './stock-branch.html',
  styleUrl: './stock-branch.css'
})
export class StockBranch {
  @Input() role: string = '';
}
