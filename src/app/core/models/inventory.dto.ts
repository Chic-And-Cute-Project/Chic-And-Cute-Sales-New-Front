import {BranchDto} from "./branch.dto";
import {ProductDto} from "../../admin/models/product.dto";

export interface InventoryDto {
  id: number;
  quantity: number;
  branch: BranchDto;
  product: ProductDto;
}
