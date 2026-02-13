import { CreateAreaDto } from "./create-area.dto";

export interface IUpdateAreaRequest {
  body: Partial<CreateAreaDto>;
  params: { id: number };
}
