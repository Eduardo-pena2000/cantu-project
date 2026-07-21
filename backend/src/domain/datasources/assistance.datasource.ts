import { CreateAssistanceDto, GetAssistanceHistoryDto } from "../dtos";
import { AssistanceEntity } from "../entities";
import { PaginatedResponse } from "../../shared";

export abstract class AssistanceDatasource {
  abstract create(dto: CreateAssistanceDto): Promise<AssistanceEntity>;
  abstract delete(id: number): Promise<void>;
  abstract findById(id: number): Promise<AssistanceEntity | null>;
  abstract findByUserOnCurrentDay(
    user_id: number,
    schedule_id: number
  ): Promise<AssistanceEntity | null>;
  abstract getHistory(dto: GetAssistanceHistoryDto): Promise<PaginatedResponse<AssistanceEntity>>;
}
