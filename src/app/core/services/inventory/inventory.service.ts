import { Injectable } from '@angular/core';
import {BaseService} from "../../../shared/services/base/base.service";
import {InventoryApiResponse} from "../../models/api-responses/inventory-api-response";
import {HttpClient, HttpParams} from "@angular/common/http";
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

  getAllByBranch(branchId: number, available: boolean = false): Observable<InventoryApiResponse> {
    let params = new HttpParams();
    if (available) params = params.set('available', available.toString());
    return this.http.get<InventoryApiResponse>(`${this.basePath}/branch/${branchId}`, {
      params: params,
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  getAllByBranchAndPage(branchId: number, page: number, available: boolean = false): Observable<InventoryApiResponse> {
    let params = new HttpParams();
    if (available) params = params.set('available', available.toString());
    return this.http.get<InventoryApiResponse>(`${this.basePath}/branch/${branchId}/${page}`, {
      params: params,
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  countByBranch(branchId: number, available: boolean = false): Observable<InventoryApiResponse> {
    let params = new HttpParams();
    if (available) params = params.set('available', available.toString());
    return this.http.get<InventoryApiResponse>(`${this.basePath}/count/branch/${branchId}`, {
      params: params,
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  searchInventoriesByBranchAndPage(productCode: string, branchId: number, page: number, available: boolean = false): Observable<InventoryApiResponse> {
    let params = new HttpParams();
    if (available) params = params.set('available', available.toString());
    return this.http.get<InventoryApiResponse>(`${this.basePath}/search/${encodeURIComponent(productCode)}/${branchId}/${page}`, {
      params: params,
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  countByBranchAndProductCode(branchId: number, productCode: string, available: boolean = false): Observable<InventoryApiResponse> {
    let params = new HttpParams();
    if (available) params = params.set('available', available.toString());
    return this.http.get<InventoryApiResponse>(`${this.basePath}/count/code/${encodeURIComponent(productCode)}/${branchId}`, {
      params: params,
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  getAllByMyBranchAndPage(page: number, available: boolean = false): Observable<InventoryApiResponse> {
    let params = new HttpParams();
    if (available) params = params.set('available', available.toString());
    return this.http.get<InventoryApiResponse>(`${this.basePath}/my-branch/${page}`, {
      params: params,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }

  countByMyBranch(available: boolean = false): Observable<InventoryApiResponse> {
    let params = new HttpParams();
    if (available) params = params.set('available', available.toString());
    return this.http.get<InventoryApiResponse>(`${this.basePath}/count/my-branch`, {
      params: params,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }

  searchInventoriesByMyBranchAndPage(productCode: string, page: number, available: boolean = false): Observable<InventoryApiResponse> {
    let params = new HttpParams();
    if (available) params = params.set('available', available.toString());
    return this.http.get<InventoryApiResponse>(`${this.basePath}/my-search/${encodeURIComponent(productCode)}/${page}`, {
      params: params,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }

  countByMyBranchAndProductCode(productCode: string, available: boolean = false): Observable<InventoryApiResponse> {
    let params = new HttpParams();
    if (available) params = params.set('available', available.toString());
    return this.http.get<InventoryApiResponse>(`${this.basePath}/my-count/code/${encodeURIComponent(productCode)}`, {
      params: params,
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
