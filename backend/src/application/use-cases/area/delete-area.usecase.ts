import { AreaRepository, IDeleteAreaRequest } from "../../../domain";
import { AppError } from "../../../shared";

export class DeleteAreaUseCase {
  constructor(private areaRepository: AreaRepository) {}

  async execute(request: IDeleteAreaRequest): Promise<void> {
    const { params } = request;

    const area = await this.areaRepository.findById(params.id);

    if (!area) {
      throw AppError.notFound("El Area no existe");
    }

    await this.areaRepository.delete(params.id);
  }
}
