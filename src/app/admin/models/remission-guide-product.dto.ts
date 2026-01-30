import {ProductDto} from "./product.dto";

export interface RemissionGuideProductDto {
  id: number;
  quantity: number;
  product: ProductDto;

  limit: number;
}
