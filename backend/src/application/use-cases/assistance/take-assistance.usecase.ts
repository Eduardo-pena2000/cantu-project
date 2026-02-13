import {
  AssistanceEntity,
  AssistanceRepository,
  FileRepository,
  ICreateAssistanceRequest,
  TeamRepository,
  UserRepository,
} from "../../../domain";
import { AppError } from "../../../shared";

export class TakeAssistanceUseCase {
  constructor(
    private readonly assistanceRepository: AssistanceRepository,
    private readonly teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
    private readonly fileRepository: FileRepository
  ) {}

  async execute(request: ICreateAssistanceRequest): Promise<AssistanceEntity> {
    let {
      body: { employee_id, schedule_id, status, taken_by_employee_id, store_id, team_id },
      file,
    } = request;

    const assistanceUser = await this.assistanceRepository.findByUserOnCurrentDay(employee_id, schedule_id);

    if (assistanceUser) {
      throw AppError.notFound("El usuario ya tiene una asistencia tomada hoy.");
    }

    const user = await this.userRepository.findById(employee_id);

    if (!user) {
      throw AppError.notFound("El usuario no existe.");
    }

    if (!user.teams?.map((team) => team.id)?.includes(+team_id!)) {
      await this.teamRepository.assignUser(team_id!, employee_id);

      await this.teamRepository.unassignUser(employee_id, team_id!);
    }

    let assistance_image_name: string | null = null;
    let assistance_image_url: string | null = null;

    if (file && file.buffer) {
      const { file_name, url } = await this.fileRepository.uploadImage(file.buffer, `/images/assistances`);

      assistance_image_name = file_name;
      assistance_image_url = url;
    }

    return this.assistanceRepository.create({
      employee_id,
      schedule_id,
      status,
      taken_by_employee_id,
      assistance_image_name,
      assistance_image_url,
      store_id,
      team_id,
    });
  }
}
