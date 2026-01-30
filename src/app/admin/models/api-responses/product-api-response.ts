import {ProductDto} from "../product.dto";

export interface ProductApiResponse {
  product: ProductDto;
  products: ProductDto[];
  count: number;
  message: string;
}
