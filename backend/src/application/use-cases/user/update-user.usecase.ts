import { AppError } from "../../../shared";

import { IUpdateUserRequest } from "../../../domain/dtos";
import { FileRepository, RoleRepository, UserRepository } from "../../../domain/repositories";

export class UpdateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private fileRepository: FileRepository
  ) {}

  async execute(request: IUpdateUserRequest) {
    const { body, file, params } = request;

    const { email, names, last_names, phone, address, username, store_id, roles, area_id } = body;

    let avatar_url: string | null = null;
    let avatar_name: string | null = null;

    const user = await this.userRepository.findById(params.id);

    if (!user) {
      throw AppError.notFound("Usuario no existe");
    }

    if (file && file.buffer) {
      if (user.avatar_url) {
        await this.fileRepository.deleteImage(user.avatar_name);
      }

      const { file_name, url } = await this.fileRepository.uploadImage(file.buffer, "/images/users");

      avatar_name = file_name;
      avatar_url = url;
    } else {
      avatar_url = user.avatar_url;
      avatar_name = user.avatar_name;
    }

    const currentRoleIds = user.roles.map((role) => role.id);

    const rolesToAdd = roles.map(Number).filter((id) => !currentRoleIds.includes(+id));
    const rolesToRemove = currentRoleIds.filter((id) => !roles.map(Number).includes(id));

    if (rolesToAdd.length > 0) {
      await Promise.all(
        rolesToAdd.map(async (role) => {
          await this.roleRepository.assignToUser(role, params.id);
        })
      );
    }

    if (rolesToRemove.length > 0) {
      await Promise.all(
        rolesToRemove.map(async (role) => {
          await this.roleRepository.deleteToUser(role, params.id);
        })
      );
    }

    await this.userRepository.update(user.id, {
      email,
      names,
      last_names,
      phone,
      address,
      username,
      store_id,
      area_id,
      avatar_name,
      avatar_url,
    });
  }
}
