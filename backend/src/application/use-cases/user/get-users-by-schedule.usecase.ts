import { IGetUsersByScheduleRequest, UserEntity, UserRepository } from "../../../domain";

import { PaginatedResponse } from "../../../shared";

export class GetUsersByScheduleUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: IGetUsersByScheduleRequest): Promise<PaginatedResponse<UserEntity>> {
    const {
      query: { limit, page },
      params: { id: schedule_id },
    } = request;

    const where: Record<string, any> = { schedule_id };

    const users = await this.userRepository.findBySchedule({ limit, page, where });

    return users;
  }
}
