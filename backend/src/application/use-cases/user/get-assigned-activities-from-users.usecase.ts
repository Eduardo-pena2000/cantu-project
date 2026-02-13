import { IGetUsersByActivitiesRequest } from "../../../domain/dtos";
import { UserEntity } from "../../../domain/entities";
import { UserRepository } from "../../../domain/repositories";

export class GetAssignedActivitiesFromUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: IGetUsersByActivitiesRequest): Promise<UserEntity[]> {
    const { scheduleId, storeId } = request.params;

    const users = await this.userRepository.findActivitiesForCurrentDay(+storeId, +scheduleId);

    return users;
  }
}
