import { Injectable } from '@angular/core';
import {BaseService} from "../../../shared/services/base/base.service";
import {CloseSalesDayApiResponse} from "../../models/api-responses/close-sales-day-api-response";
import {catchError} from "rxjs";
import {CloseSalesDayDto} from "../../models/close-sales-day.dto";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CloseSalesDayService extends BaseService<CloseSalesDayApiResponse> {

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'close-sales-day';
  }

  create(closeSalesDayDto: CloseSalesDayDto) {
    return this.http.post<CloseSalesDayApiResponse>(`${this.basePath}`, closeSalesDayDto, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }
}
