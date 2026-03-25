import {SupplyBranchDto} from "../supply-branch.dto";

export interface SupplyBranchApiResponse {
  supplyBranch: SupplyBranchDto;
  supplyBranches: SupplyBranchDto[];
}
