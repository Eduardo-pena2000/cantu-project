import { IDeleteUserRequest, UserRepository } from "../../../domain";
import { AppError } from "../../../shared";

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: IDeleteUserRequest): Promise<void> {
    const { params } = request;

    const user = await this.userRepository.findById(params.id);

    if (!user) {
      throw AppError.notFound("El usuario no existe");
    }

    await this.userRepository.delete(params.id);
  }
}
