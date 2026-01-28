import {InventoryDto} from "../inventory.dto";

export interface InventoryApiResponse {
  inventory: InventoryDto;
  inventories: InventoryDto[];
}
