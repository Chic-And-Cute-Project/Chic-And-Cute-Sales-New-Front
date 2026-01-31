import {BranchDto} from "./branch.dto";
import {UserDto} from "./user.dto";
import {CloseSalesDaySalesDto} from "./close-sales-day-sales.dto";
import {SaleDto} from "./sale.dto";

export interface CloseSalesDayDto {
  id: number;
  date: Date;
  branch: BranchDto;
  user: UserDto;
  cashAmount: number;
  cardAmount: number;
  closeSalesDaySales: CloseSalesDaySalesDto[];

  sales: SaleDto[];
  branchId: number;
  totalAmount: number;
}
