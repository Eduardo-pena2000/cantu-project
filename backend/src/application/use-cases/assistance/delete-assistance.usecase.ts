import { AppError } from "../../../shared";

import { IGetAssistanceDto } from "../../../domain/dtos";
import { AssistanceRepository } from "../../../domain/repositories";

export class DeleteAssistanceUseCase {
  constructor(private assistanceRepository: AssistanceRepository) {}

  async execute(data: IGetAssistanceDto): Promise<void> {
    const assitance = await this.assistanceRepository.findById(data.id);

    if (!assitance) {
      throw AppError.notFound("La asistencia no existe.");
    }

    await this.assistanceRepository.delete(data.id);
  }
}
