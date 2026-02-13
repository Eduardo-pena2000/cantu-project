import { IGetUsersByAssistanceRequest, UserEntity, UserRepository } from "../../../domain";

export class GetUsersByAssistanceCurrentDayUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: IGetUsersByAssistanceRequest): Promise<UserEntity[]> {
    const {
      params: { id },
    } = request;

    const users = await this.userRepository.findByScheduleForCurrentDay(+id);

    return users;
  }
}
