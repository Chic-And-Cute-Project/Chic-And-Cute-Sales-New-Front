import { Injectable } from '@angular/core';
import {BaseService} from "../../../shared/services/base/base.service";
import {SupplyBranchApiResponse} from "../../models/api-responses/supply-branch-api-response";
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs";
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
}
