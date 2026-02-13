import { AppError } from "../../../shared";

import { IUpdateAreaRequest } from "../../../domain/dtos";
import { AreaRepository } from "../../../domain/repositories";

export class UpdateAreaUseCase {
  constructor(private areaRepository: AreaRepository) {}

  async execute(request: IUpdateAreaRequest): Promise<void> {
    const { body, params } = request;

    const { store_id, name, manager_id } = body;

    const area = await this.areaRepository.findById(params.id);

    if (!area) {
      throw AppError.notFound("El area no existe");
    }

    const userHasArea = await this.areaRepository.userHasActiveAreaMember(manager_id!, area.id);

    if (!userHasArea) {
      await this.areaRepository.assignAreaToUsers(area.id, manager_id!);
    }

    await this.areaRepository.update(area.id, {
      store_id,
      name,
      manager_id,
    });
  }
}
