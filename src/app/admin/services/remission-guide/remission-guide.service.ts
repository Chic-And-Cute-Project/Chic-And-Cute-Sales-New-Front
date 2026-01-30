import { Injectable } from '@angular/core';
import {BaseService} from "../../../shared/services/base/base.service";
import {RemissionGuideApiResponse} from "../../models/api-responses/remission-guide-api-response";
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs";
import {RemissionGuideDto} from "../../models/remission-guide.dto";

@Injectable({
  providedIn: 'root'
})
export class RemissionGuideService extends BaseService<RemissionGuideApiResponse> {

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'remission-guides';
  }

  create(remissionGuideDto: RemissionGuideDto) {
    return this.http.post<RemissionGuideApiResponse>(`${this.basePath}`, remissionGuideDto, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  confirm(remissionGuideId: number) {
    return this.http.get<RemissionGuideApiResponse>(`${this.basePath}/confirm/${remissionGuideId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }
}
