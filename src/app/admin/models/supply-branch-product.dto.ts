import {ProductDto} from "./product.dto";

export interface SupplyBranchProductDto {
  id: number;
  quantity: number;
  product: ProductDto;

  limit: number;
  productId: number;
}
