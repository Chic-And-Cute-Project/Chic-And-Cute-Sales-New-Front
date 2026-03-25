import {BranchDto} from "../../core/models/branch.dto";
import {SupplyBranchProductDto} from "./supply-branch-product.dto";

export interface SupplyBranchDto {
  id: number;
  date: Date;
  branch: BranchDto;
  type: string;
  comment: string;
  identifier: string;
  products: SupplyBranchProductDto[];

  branchId: number;
}
