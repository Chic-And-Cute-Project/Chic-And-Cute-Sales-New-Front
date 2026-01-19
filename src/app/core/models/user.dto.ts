import {BranchDto} from "./branch.dto";

export interface UserDto {
  id: number;
  name: string;
  lastName: string;
  username: string;
  password: string;
  role: string;
  branch: BranchDto;

  branchId: number;
}
