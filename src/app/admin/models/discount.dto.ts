import {ProductDto} from "./product.dto";

export interface DiscountDto {
  id: number;
  name: string;
  quantity: number;
  product: ProductDto;
}
