import { rolesWithAccessToApp } from "../../../shared";

import { ICreateUserRequest } from "../../../domain/dtos";
import { UserEntity } from "../../../domain/entities";
import { FileRepository, RoleRepository, UserRepository } from "../../../domain/repositories";
import { PasswordService } from "../../../infraestructure/services";

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private fileRepository: FileRepository
  ) {}

  async execute(request: ICreateUserRequest): Promise<UserEntity> {
    const { body, file } = request;

    const { email, names, last_names, phone, address, username, store_id, roles, area_id } = body;

    const password = await PasswordService.hash(username.trim());

    let avatar_url: string | null = null;
    let avatar_name: string | null = null;

    if (file && file.buffer) {
      const { file_name, url } = await this.fileRepository.uploadImage(file.buffer, "/images/users");

      avatar_name = file_name;
      avatar_url = url;
    }

    const is_active = roles.some((role) => rolesWithAccessToApp.includes(+role));

    const data = await this.userRepository.create({
      email,
      names,
      last_names,
      phone,
      address,
      username,
      password,
      store_id,
      area_id,
      avatar_name,
      avatar_url,
      is_active,
    });

    await Promise.all(
      roles.map(async (role) => {
        await this.roleRepository.assignToUser(role, data.id);
      })
    );

    return data;
  }
}
