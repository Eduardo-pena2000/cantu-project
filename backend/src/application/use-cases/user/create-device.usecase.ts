import { UserRepository } from "../../../domain";
import { AppError } from "../../../shared";

export class CreateDeviceUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(user_id: number, token: string): Promise<void> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw AppError.notFound("El usuario no existe");
    }

    if (!user.devices_tokens?.map((d) => d.token).includes(token)) {
      await this.userRepository.createDevice(user_id, token);
    }

    return;
  }
}
