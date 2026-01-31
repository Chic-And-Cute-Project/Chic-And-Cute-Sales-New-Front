import {BranchDto} from "./branch.dto";
import {UserDto} from "./user.dto";
import {SaleDetailDto} from "./sale-detail.dto";
import {SalePaymentDto} from "./sale-payment.dto";

export interface SaleDto {
  id: number;
  date: Date;
  branch: BranchDto;
  user: UserDto;
  detail: SaleDetailDto[];
  payments: SalePaymentDto[];

  branchId: number;
  userId: number;
  finalPrice: number;
}
