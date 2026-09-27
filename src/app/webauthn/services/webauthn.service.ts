import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs';
import {BaseService} from "../../shared/services/base/base.service";
import {WebauthnApiResponse} from "../models/api-responses/webauthn-api-response";
import {RegistrationResponseJSON} from "@simplewebauthn/browser";
import {VerifyAuthenticationDto} from "../models/verify-authentication.dto";

@Injectable({
  providedIn: 'root'
})
export class WebauthnService extends BaseService<WebauthnApiResponse>{

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'webauthn';
  }

  registerOptions() {
    return this.http.post<WebauthnApiResponse>(`${this.basePath}/register/options`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  verifyRegistration(body: RegistrationResponseJSON) {
    return this.http.post<WebauthnApiResponse>(`${this.basePath}/register/verify`, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }

  authenticationOptions() {
    return this.http.post<WebauthnApiResponse>(`${this.basePath}/authentication/options`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }

  verifyAuthentication(body: VerifyAuthenticationDto) {
    return this.http.post<WebauthnApiResponse>(`${this.basePath}/authentication/verify`, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }
}
