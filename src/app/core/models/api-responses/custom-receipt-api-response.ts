import {CustomReceiptDto} from "../custom-receipt.dto";

export interface CustomReceiptApiResponse {
  customReceipt: CustomReceiptDto;
  customReceipts: CustomReceiptDto[];
}
