import {SaleDto} from "../sale.dto";
import {SaleDetailDto} from "../sale-detail.dto";

export interface SaleApiResponse {
  sale: SaleDto;
  sales: SaleDto[];
  saleDetails: SaleDetailDto[]
  count: number;
  cashCount: number;
  cardCount: number;
  cashAmount: number;
  cardAmount: number;
}
