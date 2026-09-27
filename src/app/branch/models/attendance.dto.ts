import {BranchDto} from "../../core/models/branch.dto";
import {UserDto} from "../../core/models/user.dto";

export interface AttendanceDto {
  id: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  branch: BranchDto;
  user: UserDto;
  createdAt: Date;

  branchId: number;
  userId: number;
  attendanceTerminalId: number;
}
