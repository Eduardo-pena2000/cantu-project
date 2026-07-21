import { AssistanceEntity, AssistanceRepository, GetAssistanceHistoryDto } from "../../../domain";
import { PaginatedResponse } from "../../../shared";

export class GetAssistanceHistoryUseCase {
  constructor(private readonly assistanceRepository: AssistanceRepository) {}

  async execute(dto: GetAssistanceHistoryDto): Promise<PaginatedResponse<AssistanceEntity>> {
    const history = await this.assistanceRepository.getHistory(dto);

    return history;
  }
}
