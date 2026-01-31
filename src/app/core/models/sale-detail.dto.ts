import {ProductDto} from "../../admin/models/product.dto";

export interface SaleDetailDto {
  id: number;
  quantity: number;
  discount: number;
  product: ProductDto;

  limit: number;
  productId: number;
  finalPrice: number;
}
