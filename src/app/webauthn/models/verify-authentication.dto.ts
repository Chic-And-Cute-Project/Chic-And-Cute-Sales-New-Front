import {AttendanceDto} from "../../branch/models/attendance.dto";
import {AuthenticationResponseJSON} from "@simplewebauthn/browser";

export interface VerifyAuthenticationDto {
  attendance: AttendanceDto;
  authenticationResponseJSON: AuthenticationResponseJSON;
}
