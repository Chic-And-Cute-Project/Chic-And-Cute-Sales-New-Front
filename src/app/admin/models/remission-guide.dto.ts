import {BranchDto} from "../../core/models/branch.dto";
import {RemissionGuideProductDto} from "./remission-guide-product.dto";

export interface RemissionGuideDto {
  id: number;
  identifier: string;
  date: Date;
  branchFrom: BranchDto;
  branchTo: BranchDto;
  status: string;
  products: RemissionGuideProductDto[];

  branchFromId: number;
  branchToId: number;
}
