import { IGetUsersWithOutTeamRequest, UserEntity, UserRepository } from "../../../domain";

export class GetUsersWithoutTeamUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: IGetUsersWithOutTeamRequest): Promise<UserEntity[]> {
    const {
      params: { id },
      query: { teamId },
    } = request;

    const users = await this.userRepository.findWithoutTeam(+id, +teamId);

    return users;
  }
}
