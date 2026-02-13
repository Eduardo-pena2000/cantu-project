import { IGetUserRequest, UserEntity, UserRepository } from "../../../domain";
import { AppError } from "../../../shared";

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: IGetUserRequest): Promise<UserEntity> {
    const { params } = request;

    const user = await this.userRepository.findById(params.id);

    if (!user) {
      throw AppError.notFound("El usuario no existe");
    }

    return user;
  }
}
