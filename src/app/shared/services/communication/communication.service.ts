import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  titleChanged = new EventEmitter<{ name: string, branch: string }>();

  emitTitleChange(info: { name: string, branch: string }) {
    this.titleChanged.emit(info);
  }
}
