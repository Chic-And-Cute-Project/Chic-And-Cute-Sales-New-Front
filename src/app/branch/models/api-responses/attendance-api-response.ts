import {AttendanceDto} from "../attendance.dto";

export interface AttendanceApiResponse {
  attendance: AttendanceDto;
  attendances: AttendanceDto[];
}
