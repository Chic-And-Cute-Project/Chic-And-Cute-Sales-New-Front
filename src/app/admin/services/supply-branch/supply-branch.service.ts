import { Injectable } from '@angular/core';
import {BaseService} from "../../../shared/services/base/base.service";
import {SupplyBranchApiResponse} from "../../models/api-responses/supply-branch-api-response";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {SupplyBranchDto} from "../../models/supply-branch.dto";

@Injectable({
  providedIn: 'root'
})
export class SupplyBranchService extends BaseService<SupplyBranchApiResponse> {

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'supply-branches';
  }

  addInventory(supplyBranchDto: SupplyBranchDto) {
    return this.http.post<SupplyBranchApiResponse>(`${this.basePath}/add`, supplyBranchDto, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }

  takeInventory(supplyBranchDto: SupplyBranchDto) {
    return this.http.post<SupplyBranchApiResponse>(`${this.basePath}/take`, supplyBranchDto, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }

  getAllByBranchAndDates(branchId: number, minDate: Date, maxDate: Date): Observable<SupplyBranchApiResponse> {
    return this.http.get<SupplyBranchApiResponse>(`${this.basePath}/branch-dates/${branchId}/${minDate.toISOString()}/${maxDate.toISOString()}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }
}
