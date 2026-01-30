import {RemissionGuideDto} from "../remission-guide.dto";

export interface RemissionGuideApiResponse {
  remissionGuide: RemissionGuideDto;
  remissionGuides: RemissionGuideDto[];
}
