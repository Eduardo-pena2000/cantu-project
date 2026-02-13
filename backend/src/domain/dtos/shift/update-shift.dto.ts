import { CreateShiftDto } from "./create-shift.dto";

export interface IUpdateShiftRequest {
  body: CreateShiftDto;
  params: { id: number };
}
