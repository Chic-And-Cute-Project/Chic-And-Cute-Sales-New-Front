import { Injectable } from '@angular/core';
import {BaseService} from "../../../shared/services/base/base.service";
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs";
import {CustomReceiptApiResponse} from "../../models/api-responses/custom-receipt-api-response";
import {CustomReceiptDto} from "../../models/custom-receipt.dto";

@Injectable({
  providedIn: 'root'
})
export class CustomReceiptService extends BaseService<CustomReceiptApiResponse> {

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'custom-receipts';
  }

  create(customReceiptDto: CustomReceiptDto) {
    return this.http.post<CustomReceiptApiResponse>(`${this.basePath}`, customReceiptDto, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(catchError(this.handleError));
  }
}
