import { Injectable } from '@angular/core';
import {BaseService} from '../../../shared/services/base/base.service';
import {UserApiResponse} from '../../models/api-responses/user-api-response';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from "rxjs";
import {UserDto} from "../../models/user.dto";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<UserApiResponse>{

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'users';
  }

  register(userDto: UserDto) {
    return this.http.post<UserApiResponse>(`${this.basePath}/register`, userDto, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  getAllByBranchRole(): Observable<UserApiResponse> {
    return this.http.get<UserApiResponse>(`${this.basePath}/roleBranch`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  searchUsersByName(username: string): Observable<UserApiResponse> {
    return this.http.get<UserApiResponse>(`${this.basePath}/name/${username}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  update(id: number, body: UserDto): Observable<UserApiResponse> {
    return this.http.put<UserApiResponse>(`${this.basePath}/${id}`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }
}
