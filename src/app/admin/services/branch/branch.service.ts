import { Injectable } from '@angular/core';
import {BaseService} from "../../../shared/services/base/base.service";
import {BranchApiResponse} from "../../../core/models/api-responses/branch-api-response";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BranchService extends BaseService<BranchApiResponse> {

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'branches';
  }

  getAllByActive(): Observable<BranchApiResponse> {
    return this.http.get<BranchApiResponse>(`${this.basePath}/name/active`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }
}
