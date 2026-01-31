import {SaleDto} from "../sale.dto";

export interface SaleApiResponse {
  sale: SaleDto;
  sales: SaleDto[];
  count: number;
}
