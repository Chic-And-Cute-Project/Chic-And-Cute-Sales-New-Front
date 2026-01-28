import {DiscountDto} from "../discount.dto";

export interface DiscountApiResponse {
  discount: DiscountDto;
  discounts: DiscountDto[];
}
