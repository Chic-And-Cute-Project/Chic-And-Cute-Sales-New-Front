import { Injectable } from '@angular/core';
import {BaseService} from "../../../shared/services/base/base.service";
import {SaleApiResponse} from "../../models/api-responses/sale-api-response";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
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

  getAllByBranchAndDate(branchId: number, date: Date): Observable<SaleApiResponse> {
    return this.http.get<SaleApiResponse>(`${this.basePath}/branch-date/${branchId}/${date.toISOString()}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  getAllByMyBranchAndDate(date: Date): Observable<SaleApiResponse> {
    return this.http.get<SaleApiResponse>(`${this.basePath}/my-branch-date/${date.toISOString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }

  getAdminReport(userId: number, branchId: number, minDate: Date, maxDate: Date): Observable<SaleApiResponse> {
    return this.http.get<SaleApiResponse>(`${this.basePath}/admin-report/${userId}/${branchId}/${minDate.toISOString()}/${maxDate.toISOString()}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  getMyReport(minDate: Date, maxDate: Date): Observable<SaleApiResponse> {
    return this.http.get<SaleApiResponse>(`${this.basePath}/my-report/${minDate.toISOString()}/${maxDate.toISOString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<SaleApiResponse> {
    return this.http.delete<SaleApiResponse>(`${this.basePath}/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }
}
