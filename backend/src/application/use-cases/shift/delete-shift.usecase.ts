import { IDeleteShiftRequest, ShiftRepository } from "../../../domain";
import { AppError } from "../../../shared";

export class DeleteShiftUseCase {
  constructor(private shiftRepository: ShiftRepository) {}

  async execute(request: IDeleteShiftRequest): Promise<void> {
    const { params } = request;

    const shift = await this.shiftRepository.findById(params.id);

    if (!shift) {
      throw AppError.notFound("El turno no existe");
    }

    await this.shiftRepository.delete(params.id);
  }
}
