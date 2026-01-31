import { Injectable } from '@angular/core';
import {BaseService} from "../../../shared/services/base/base.service";
import {SaleApiResponse} from "../../models/api-responses/sale-api-response";
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs";
import {SaleDto} from "../../models/sale.dto";

@Injectable({
  providedIn: 'root'
})
export class SaleService extends BaseService<SaleApiResponse> {
  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'sales';
  }

  create(saleDto: SaleDto) {
    return this.http.post<SaleApiResponse>(`${this.basePath}`, saleDto, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }
}
