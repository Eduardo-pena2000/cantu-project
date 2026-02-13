import { ICreateAreaRequest } from "../../../domain/dtos";
import { AreaEntity } from "../../../domain/entities";
import { AreaRepository, UserRepository } from "../../../domain/repositories";

export class CreateAreaUseCase {
  constructor(private areaRepository: AreaRepository) {}

  async execute(request: ICreateAreaRequest): Promise<AreaEntity> {
    const { body } = request;

    const { store_id, name, manager_id } = body;

    const data = await this.areaRepository.create({
      store_id,
      name,
      manager_id,
    });

    const userHasArea = await this.areaRepository.userHasActiveAreaMember(manager_id, data.id);

    if (!userHasArea) {
      await this.areaRepository.assignAreaToUsers(data.id, manager_id);
    }

    return data;
  }
}
