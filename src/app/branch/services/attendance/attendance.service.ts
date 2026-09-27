import { Injectable } from '@angular/core';
import {BaseService} from "../../../shared/services/base/base.service";
import {HttpClient} from "@angular/common/http";
import {AttendanceApiResponse} from "../../models/api-responses/attendance-api-response";

@Injectable({
  providedIn: 'root'
})
export class AttendanceService extends BaseService<AttendanceApiResponse> {

  constructor(http: HttpClient) {
    super(http);
    this.basePath = this.basePath + 'attendances';
  }
}
