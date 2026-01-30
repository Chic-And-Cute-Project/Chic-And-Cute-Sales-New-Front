import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../shared/services/base/base.service";
import {DiscountApiResponse} from "../../models/api-responses/discount-api-response";
import {catchError, Observable} from "rxjs";
import {DiscountDto} from "../../models/discount.dto";

@Injectable({
  providedIn: 'root'
})
export class DiscountService extends BaseService<DiscountApiResponse> {

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'discounts';
  }

  create(discountDto: DiscountDto) {
    return this.http.post<DiscountApiResponse>(`${this.basePath}`, discountDto, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  update(id: number, body: DiscountDto): Observable<DiscountApiResponse> {
    return this.http.put<DiscountApiResponse>(`${this.basePath}/${id}`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }
}
