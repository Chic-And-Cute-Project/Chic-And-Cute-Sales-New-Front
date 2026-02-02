import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../shared/services/base/base.service";
import {ProductApiResponse} from "../../models/api-responses/product-api-response";
import {catchError, Observable} from "rxjs";
import {ProductDto} from "../../models/product.dto";

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService<ProductApiResponse> {

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'products';
  }

  create(productDto: ProductDto) {
    return this.http.post<ProductApiResponse>(`${this.basePath}`, productDto, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  getAllByPage(page: number): Observable<ProductApiResponse> {
    return this.http.get<ProductApiResponse>(`${this.basePath}/page/${page}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  searchProductByPage(productCode: string, page: number): Observable<ProductApiResponse> {
    return this.http.get<ProductApiResponse>(`${this.basePath}/search/${encodeURIComponent(productCode)}/${page}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  countByProductCode(productCode: string): Observable<ProductApiResponse> {
    return this.http.get<ProductApiResponse>(`${this.basePath}/count/code/${encodeURIComponent(productCode)}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  update(id: number, body: ProductDto): Observable<ProductApiResponse> {
    return this.http.put<ProductApiResponse>(`${this.basePath}/${id}`, body, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<ProductApiResponse> {
    return this.http.delete<ProductApiResponse>(`${this.basePath}/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }
}
