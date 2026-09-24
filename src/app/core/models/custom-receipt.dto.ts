export interface CustomReceiptDto {
  id: number;
  sequence: number;
  name: string;
  documentNumber: string;
  phoneNumber: string;
  address: string;
  district: string;
  province: string;

  saleId: number;
}
