import { Injectable } from '@angular/core';
import {BaseService} from '../../../shared/services/base/base.service';
import {UserApiResponse} from '../../models/api-responses/user-api-response';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<UserApiResponse>{

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'users';
  }
}
