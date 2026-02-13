import { IGetShiftRequest, ShiftEntity, ShiftRepository } from "../../../domain";

import { AppError } from "../../../shared";

export class GetShiftUseCase {
  constructor(private shiftRepository: ShiftRepository) {}

  async execute(request: IGetShiftRequest): Promise<ShiftEntity> {
    const { params } = request;

    const shift = await this.shiftRepository.findById(params.id);

    if (!shift) {
      throw AppError.notFound("El turno no existe");
    }

    return shift;
  }
}
