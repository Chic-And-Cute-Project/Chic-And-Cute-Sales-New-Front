import {BranchDto} from "../../core/models/branch.dto";
import {SupplyBranchProductDto} from "./supply-branch-product.dto";

export interface SupplyBranchDto {
  id: number;
  date: Date;
  branch: BranchDto;
  products: SupplyBranchProductDto[];

  branchId: number;
}
