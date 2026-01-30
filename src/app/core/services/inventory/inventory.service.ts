import { Injectable } from '@angular/core';
import {BaseService} from "../../../shared/services/base/base.service";
import {InventoryApiResponse} from "../../models/api-responses/inventory-api-response";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {InventoryDto} from "../../models/inventory.dto";

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends BaseService<InventoryApiResponse> {

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'inventories';
  }

  getAllByBranchAndPage(branchId: number, page: number): Observable<InventoryApiResponse> {
    return this.http.get<InventoryApiResponse>(`${this.basePath}/branch/${branchId}/${page}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  countByBranch(branchId: number): Observable<InventoryApiResponse> {
    return this.http.get<InventoryApiResponse>(`${this.basePath}/count/branch/${branchId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  searchInventoriesByBranchAndPage(productCode: string, branchId: number, page: number): Observable<InventoryApiResponse> {
    return this.http.get<InventoryApiResponse>(`${this.basePath}/search/${productCode}/${branchId}/${page}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  countByBranchAndProductCode(branchId: number, productCode: string): Observable<InventoryApiResponse> {
    return this.http.get<InventoryApiResponse>(`${this.basePath}/count/code/${productCode}/${branchId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  getAllByMyBranchAndPage(page: number): Observable<InventoryApiResponse> {
    return this.http.get<InventoryApiResponse>(`${this.basePath}/my-branch/${page}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }

  countByMyBranch(): Observable<InventoryApiResponse> {
    return this.http.get<InventoryApiResponse>(`${this.basePath}/count/my-branch`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }

  searchInventoriesByMyBranchAndPage(productCode: string, page: number): Observable<InventoryApiResponse> {
    return this.http.get<InventoryApiResponse>(`${this.basePath}/my-search/${productCode}/${page}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }

  countByMyBranchAndProductCode(productCode: string): Observable<InventoryApiResponse> {
    return this.http.get<InventoryApiResponse>(`${this.basePath}/my-count/code/${productCode}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }

  update(id: number, body: InventoryDto): Observable<InventoryApiResponse> {
    return this.http.put<InventoryApiResponse>(`${this.basePath}/${id}`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }
}
