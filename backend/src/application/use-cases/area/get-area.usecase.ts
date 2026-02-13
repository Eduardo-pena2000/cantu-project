import { AreaEntity, AreaRepository, IGetAreaRequest } from "../../../domain";
import { AppError } from "../../../shared";

export class GetAreaUseCase {
  constructor(private areaRepository: AreaRepository) {}

  async execute(request: IGetAreaRequest): Promise<AreaEntity> {
    const { params } = request;

    const area = await this.areaRepository.findById(params.id);

    if (!area) {
      throw AppError.notFound("El Area no existe");
    }

    return area;
  }
}
