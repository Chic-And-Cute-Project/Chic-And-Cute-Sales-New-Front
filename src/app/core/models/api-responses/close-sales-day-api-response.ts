import {CloseSalesDayDto} from "../close-sales-day.dto";

export interface CloseSalesDayApiResponse {
  closeSalesDay: CloseSalesDayDto;
  closeSalesDays: CloseSalesDayDto[];
}
