import { AppError } from "../../../shared";

import { IAssignAreaRequest } from "../../../domain/dtos";
import { AreaRepository } from "../../../domain/repositories";

export class AssignAreaToUsersUseCase {
  constructor(private areaRepository: AreaRepository) {}

  async execute(request: IAssignAreaRequest): Promise<void> {
    const { body } = request;

    const { area_id, added_users, deleted_users } = body;

    const usersArea = await this.areaRepository.findById(area_id);

    if (!usersArea) {
      throw AppError.notFound("El area no existe");
    }

    if (added_users.length > 0) {
      await Promise.all(
        added_users.map(async (user) => {
          await this.areaRepository.assignAreaToUsers(area_id, user);
        })
      );
    }

    if (deleted_users.length > 0) {
      await Promise.all(
        deleted_users.map(async (user) => {
          await this.areaRepository.unassignAreaToUsers(area_id, user);
        })
      );
    }
  }
}
