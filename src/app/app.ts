import {ChangeDetectorRef, Component} from '@angular/core';
import {Subscription} from 'rxjs';
import {CommunicationService} from './shared/services/communication/communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  name: string = '';
  branch: string = '';
  titleChangeSubscription: Subscription;

  constructor(private communicationService: CommunicationService, private cdr: ChangeDetectorRef) {
    this.titleChangeSubscription = this.communicationService.titleChanged.subscribe(info => {
      this.name = info.name;
      this.branch = info.branch;
      this.cdr.detectChanges();
    });
  }
}
