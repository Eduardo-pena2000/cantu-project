import {
  AssistanceDatasource,
  AssistanceEntity,
  AssistanceRepository,
  CreateAssistanceDto,
} from "../../domain";

export class AssistanceRepositoryImpl implements AssistanceRepository {
  constructor(private assistanceDatasource: AssistanceDatasource) {}

  async create(dto: CreateAssistanceDto): Promise<AssistanceEntity> {
    return this.assistanceDatasource.create(dto);
  }

  async delete(id: number): Promise<void> {
    return this.assistanceDatasource.delete(id);
  }

  async findById(id: number): Promise<AssistanceEntity | null> {
    return this.assistanceDatasource.findById(id);
  }

  async findByUserOnCurrentDay(
    user_id: number,
    schedule_id: number
  ): Promise<AssistanceEntity | null> {
    return await this.assistanceDatasource.findByUserOnCurrentDay(user_id, schedule_id);
  }
}
